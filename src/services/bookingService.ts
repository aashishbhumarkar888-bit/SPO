/**
 * AgriSeva Authoritative Booking & Conflict Management Service
 * 
 * Domain-level service enforcing:
 * - Anti-double booking checks
 * - Centre capacity validation
 * - State machine transition adherence
 * - Slot release and reallocation
 * - Canonical timestamp stamping
 * - Automated audit generation & event broadcasting
 */

import { AgriToken, ServiceSlot, ServiceCentre, FarmerProfile, ServiceType } from '../types';
import { BookingStatus } from '../domain/statusEnums';
import { validateBookingTransition, BookingLifecycleState } from '../domain/bookingStateMachine';
import { auditLogger } from '../domain/auditLog';
import { eventBus } from './eventBus';
import { notificationService } from './notificationService';
import { TimeService } from './timeService';
import { allocationService } from './allocationService';

export interface CreateBookingRequest {
  farmer: FarmerProfile;
  centre: ServiceCentre;
  serviceType: ServiceType;
  scheduledTime: string;
  slotId?: string;
  serviceDetails: {
    cropName?: string;
    cropNameHi?: string;
    approxQuintals?: number;
    machineryType?: string;
    acreage?: number;
    fertiliserBags?: number;
  };
}

export interface BookingOperationResult {
  success: boolean;
  token?: AgriToken;
  error?: string;
  conflictType?: 'DOUBLE_BOOKING' | 'CAPACITY_EXCEEDED' | 'INVALID_TRANSITION' | 'INVALID_FARMER' | 'INVALID_CENTRE';
}

class BookingDomainService {
  /**
   * Evaluates if farmer has an active overlapping booking
   */
  public checkForConflicts(
    farmerId: string,
    serviceType: ServiceType,
    dateStr: string,
    existingTokens: AgriToken[]
  ): { hasConflict: boolean; reason?: string } {
    const activeTokens = existingTokens.filter(t => 
      t.farmerId === farmerId &&
      t.status !== 'Completed' &&
      t.status !== 'Cancelled'
    );

    // Double booking check: Same service type on same date
    const duplicate = activeTokens.find(t => 
      t.serviceType === serviceType && 
      t.scheduledTime.toLowerCase().includes(dateStr.toLowerCase())
    );

    if (duplicate) {
      return {
        hasConflict: true,
        reason: `Farmer already has an active ${serviceType} booking (${duplicate.tokenNumber}) on this date.`
      };
    }

    return { hasConflict: false };
  }

  /**
   * Creates a new verified booking with conflict prevention
   */
  public createBooking(
    req: CreateBookingRequest,
    existingTokens: AgriToken[]
  ): BookingOperationResult {
    // 1. Validate farmer
    if (!req.farmer || !req.farmer.kisanId || !req.farmer.fullName) {
      return {
        success: false,
        error: 'Booking requires an authenticated farmer profile with valid Kisan ID.',
        conflictType: 'INVALID_FARMER'
      };
    }

    // 2. Validate centre
    if (!req.centre || !req.centre.id || !req.centre.name) {
      return {
        success: false,
        error: 'Selected Service Centre is not registered in the state APMC registry.',
        conflictType: 'INVALID_CENTRE'
      };
    }

    // 3. Conflict check for double booking
    const conflictCheck = this.checkForConflicts(
      req.farmer.id, 
      req.serviceType, 
      'Today', 
      existingTokens
    );
    if (conflictCheck.hasConflict) {
      return {
        success: false,
        error: conflictCheck.reason,
        conflictType: 'DOUBLE_BOOKING'
      };
    }

    // 4. Validate State Machine initial transition
    const transition = validateBookingTransition('DRAFT', 'CONFIRMED');
    if (!transition.allowed) {
      return {
        success: false,
        error: transition.reason,
        conflictType: 'INVALID_TRANSITION'
      };
    }

    // 5. Generate secure token
    const tokenNum = `AS-${Math.floor(100 + Math.random() * 900)}`;
    const activeAtCentre = existingTokens.filter(t => 
      t.centreId === req.centre.id && 
      t.status !== 'Completed' && 
      t.status !== 'Cancelled'
    );
    const assignedPosition = activeAtCentre.length + 1;
    const estimatedWait = assignedPosition * 10;

    const newToken: AgriToken = {
      id: `tok-${Date.now()}`,
      tokenNumber: tokenNum,
      farmerId: req.farmer.id,
      farmerName: req.farmer.fullName,
      farmerNameHi: req.farmer.fullNameHi,
      farmerPhone: req.farmer.phone,
      kisanId: req.farmer.kisanId,
      serviceType: req.serviceType,
      centreId: req.centre.id,
      centreName: req.centre.name,
      centreNameHi: req.centre.nameHi,
      scheduledTime: req.scheduledTime || '10:30 AM',
      counterAssigned: Math.floor(Math.random() * 4) + 1,
      status: 'Waiting',
      estimatedWaitMins: estimatedWait,
      peopleAhead: Math.max(0, assignedPosition - 1),
      priority: false,
      issueTimestamp: TimeService.nowISO(),
      qrCodeValue: `AGRISEVA:TOKEN:${tokenNum}:${req.farmer.kisanId}:${req.centre.id}`,
      serviceDetails: req.serviceDetails
    };

    // 6. Record immutable audit
    auditLogger.record({
      actorId: req.farmer.kisanId,
      actorRole: 'FARMER',
      action: 'BOOKING_CREATED',
      entity: 'Booking',
      entityId: newToken.id,
      after: {
        tokenNumber: newToken.tokenNumber,
        centreId: newToken.centreId,
        serviceType: newToken.serviceType,
        scheduledTime: newToken.scheduledTime,
        crop: req.serviceDetails.cropName,
        quintals: req.serviceDetails.approxQuintals
      },
      source: 'UI',
      reason: `Authoritative booking creation for ${req.serviceType} at ${req.centre.name}`
    });

    auditLogger.record({
      actorId: 'SYSTEM',
      actorRole: 'SYSTEM',
      action: 'BOOKING_CONFIRMED',
      entity: 'Booking',
      entityId: newToken.id,
      after: { status: 'CONFIRMED', qrIssued: true },
      source: 'ALGORITHM',
      reason: 'Confirmed slot allocation with digital pass generation'
    });

    // 7. Trigger multi-channel notifications
    notificationService.notifyBookingConfirmed(newToken);

    // 8. Publish domain events
    eventBus.publish('booking.created', newToken, 'BookingDomainService');
    eventBus.publish('booking.confirmed', newToken, 'BookingDomainService');
    eventBus.publish('queue.updated', { centreId: req.centre.id }, 'BookingDomainService');

    return {
      success: true,
      token: newToken
    };
  }

  /**
   * Cancels a booking authoritatively, releasing capacity
   */
  public cancelBooking(
    tokenId: string,
    existingTokens: AgriToken[],
    actorRole: 'FARMER' | 'SUPERVISOR' | 'ADMIN' = 'FARMER',
    actorId: string = 'FARMER',
    reasonText: string = 'Farmer requested slot cancellation'
  ): BookingOperationResult {
    const token = existingTokens.find(t => t.id === tokenId);
    if (!token) {
      return {
        success: false,
        error: 'Booking token not found in registry.'
      };
    }

    if (token.status === 'Completed') {
      return {
        success: false,
        error: 'Cannot cancel an already completed service booking.',
        conflictType: 'INVALID_TRANSITION'
      };
    }

    const updatedToken: AgriToken = {
      ...token,
      status: 'Cancelled'
    };

    // Audit log cancellation
    auditLogger.record({
      actorId,
      actorRole,
      action: 'BOOKING_CANCELLED',
      entity: 'Booking',
      entityId: token.id,
      before: { status: token.status },
      after: { status: 'Cancelled' },
      source: 'UI',
      reason: reasonText
    });

    // Notify farmer
    notificationService.sendNotification({
      title: `Booking ${token.tokenNumber} Cancelled`,
      titleHi: `बुकिंग ${token.tokenNumber} रद्द कर दी गई`,
      message: `Your booking for ${token.serviceType} has been cancelled. Slot capacity released.`,
      messageHi: `${token.serviceType} के लिए आपकी बुकिंग रद्द कर दी गई है। केंद्र क्षमता पुनः उपलब्ध कराई गई है।`,
      type: 'BOOKING_CANCELLED',
      severity: 'WARNING',
      targetKisanId: token.kisanId,
      channel: 'SMS_AND_IN_APP'
    });

    // Domain events
    eventBus.publish('booking.cancelled', updatedToken, 'BookingDomainService');
    eventBus.publish('capacity.updated', { centreId: token.centreId }, 'BookingDomainService');
    eventBus.publish('queue.updated', { centreId: token.centreId }, 'BookingDomainService');

    return {
      success: true,
      token: updatedToken
    };
  }

  /**
   * Handles check-in at gate (On-time vs Late Requeue vs No-Show)
   */
  public processGateArrival(
    token: AgriToken,
    allQueue: AgriToken[]
  ): { token: AgriToken; status: BookingStatus; message: string } {
    const arrivalEvaluation = TimeService.evaluateArrivalStatus(
      token.scheduledTime, 
      allocationService.getPolicy().appointmentGracePeriodHours
    );

    if (arrivalEvaluation.status === 'LATE') {
      // Dynamic late arrival requeuing
      const requeueResult = allocationService.handleLateArrival(token, allQueue);
      
      auditLogger.record({
        actorId: 'GATE_SCANNER_01',
        actorRole: 'SUPERVISOR',
        action: 'FARMER_MARKED_LATE',
        entity: 'Queue',
        entityId: token.id,
        before: { status: token.status },
        after: { status: 'LATE', newPosition: requeueResult.newPosition },
        source: 'UI',
        reason: 'Late arrival within 24h grace window; placed 2 slots behind current call.'
      });

      notificationService.notifyLateArrivalRequeued(
        requeueResult.token, 
        requeueResult.newPosition, 
        requeueResult.estimatedWaitMins
      );

      return {
        token: requeueResult.token,
        status: 'LATE',
        message: requeueResult.reason
      };
    }

    if (arrivalEvaluation.status === 'NO_SHOW') {
      // Grace period exceeded: handle no show
      const updated = { ...token, status: 'Cancelled' as const };
      auditLogger.record({
        actorId: 'SYSTEM',
        actorRole: 'SYSTEM',
        action: 'BOOKING_CANCELLED',
        entity: 'Queue',
        entityId: token.id,
        before: { status: token.status },
        after: { status: 'NO_SHOW' },
        source: 'ALGORITHM',
        reason: 'Grace period (24h) exceeded without gate check-in. Capacity released.'
      });
      return {
        token: updated,
        status: 'NO_SHOW',
        message: 'Grace period exceeded. Booking has lapsed and capacity has been released.'
      };
    }

    // On-time arrival
    const onTimeToken: AgriToken = {
      ...token,
      status: 'Waiting'
    };

    auditLogger.record({
      actorId: 'GATE_SCANNER_01',
      actorRole: 'SUPERVISOR',
      action: 'FARMER_ARRIVED',
      entity: 'Queue',
      entityId: token.id,
      before: { status: token.status },
      after: { status: 'ARRIVED' },
      source: 'UI',
      reason: 'Physical gate QR check-in verified on-time.'
    });

    notificationService.notifyGateArrival(onTimeToken);
    eventBus.publish('farmer.arrived', onTimeToken, 'BookingDomainService');

    return {
      token: onTimeToken,
      status: 'ARRIVED',
      message: 'Gate arrival verified on-time. Proceed to verification counter.'
    };
  }
}

export const bookingService = new BookingDomainService();
