/**
 * AgriSeva Core Booking Lifecycle State Machine
 * Compliant with SIH Technical Evaluation Architecture
 * 
 * Strict state transitions prevent illegal booking mutations:
 * DRAFT -> PENDING -> CONFIRMED -> EXPECTED -> ARRIVED -> LATE -> IN_QUEUE -> IN_PROGRESS -> COMPLETED
 * Side branches: RESCHEDULED, CANCELLED, NO_SHOW
 */

export type BookingLifecycleState =
  | 'DRAFT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'EXPECTED'
  | 'ARRIVED'
  | 'LATE'
  | 'IN_QUEUE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'NO_SHOW';

export const VALID_BOOKING_TRANSITIONS: Record<BookingLifecycleState, BookingLifecycleState[]> = {
  DRAFT: ['PENDING', 'CANCELLED'],
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['EXPECTED', 'CANCELLED', 'RESCHEDULED'],
  EXPECTED: ['ARRIVED', 'LATE', 'NO_SHOW', 'CANCELLED'],
  ARRIVED: ['IN_QUEUE'],
  LATE: ['IN_QUEUE', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW'],
  IN_QUEUE: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  RESCHEDULED: ['PENDING', 'CONFIRMED'],
  CANCELLED: [],
  NO_SHOW: ['RESCHEDULED', 'CANCELLED']
};

export interface StateTransitionResult {
  allowed: boolean;
  from: BookingLifecycleState;
  to: BookingLifecycleState;
  reason?: string;
}

/**
 * Validates whether a state transition is legally permissible
 */
export function validateBookingTransition(
  from: BookingLifecycleState,
  to: BookingLifecycleState
): StateTransitionResult {
  const allowedNextStates = VALID_BOOKING_TRANSITIONS[from] || [];
  if (allowedNextStates.includes(to)) {
    return { allowed: true, from, to };
  }
  return {
    allowed: false,
    from,
    to,
    reason: `Illegal state transition from ${from} to ${to}. Allowed transitions: ${allowedNextStates.join(', ') || 'None (terminal state)'}`
  };
}

export function isTerminalState(state: BookingLifecycleState): boolean {
  return VALID_BOOKING_TRANSITIONS[state].length === 0;
}
