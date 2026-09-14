/**
 * AgriSeva Multi-Channel Notification Engine
 * Handles App alerts, SMS dispatch logs, and Voice synthesizer prompts.
 */

import { eventBus } from './eventBus';
import { AgriToken } from '../types';

export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'ARRIVAL_REMINDER'
  | 'QUEUE_UPDATED'
  | 'LATE_STATUS'
  | 'CANCELLATION'
  | 'RESCHEDULE'
  | 'PROCESSING_STARTED'
  | 'PROCESSING_COMPLETED'
  | 'PAYMENT_UPDATED'
  | 'WEATHER_ALERT'
  | 'GENERAL';

export type NotificationChannel = 'APP' | 'SMS' | 'VOICE' | 'IVR';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  titleHi: string;
  body: string;
  bodyHi: string;
  channel: NotificationChannel;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

class NotificationService {
  private notifications: AppNotification[] = [];
  private listeners: Set<(notifications: AppNotification[]) => void> = new Set();

  constructor() {
    this.notifications = [
      {
        id: 'NOTIF-01',
        type: 'QUEUE_UPDATED',
        title: 'Token Called at Counter #2',
        titleHi: 'टोकन संख्या AS-108 को काउंटर #2 पर बुलाया गया',
        body: 'Please approach Counter #2 with your Land 7/12 & Aadhaar credentials.',
        bodyHi: 'कृपया 7/12 व आधार विवरण के साथ काउंटर #2 पर पहुंचें।',
        channel: 'APP',
        timestamp: '5 mins ago',
        isRead: false
      },
      {
        id: 'NOTIF-02',
        type: 'WEATHER_ALERT',
        title: 'Clear Skies Advisory for Harvesting',
        titleHi: 'कटाई व परिवहन हेतु अनुकूल मौसम',
        body: 'Wardha district forecast is dry and clear for the next 48 hours.',
        bodyHi: 'अगले 48 घंटों में वर्धा जिले में मौसम साफ और शुष्क रहेगा।',
        channel: 'APP',
        timestamp: '1 hour ago',
        isRead: true
      }
    ];

    // Wire up domain event listeners
    eventBus.subscribe('farmer.late', (event: any) => {
      this.send({
        type: 'LATE_STATUS',
        title: 'Grace Period Active: Requeued by 2 Slots',
        titleHi: 'ग्रेस अवधि सक्रिय: कतार में 2 स्थान बाद का समय दिया गया',
        body: `Your booking was accommodated within the 24-hour grace window. You are at position ${event.payload?.newPosition || 2}.`,
        bodyHi: `आपकी बुकिंग 24 घंटे की ग्रेस विंडो में सुरक्षित है। आपका नया स्थान ${event.payload?.newPosition || 2} है।`,
        channel: 'APP'
      });
    });

    eventBus.subscribe('payment.updated', (event: any) => {
      this.send({
        type: 'PAYMENT_UPDATED',
        title: 'Direct Benefit Transfer (DBT) Credited',
        titleHi: 'डीबीटी भुगतान बैंक खाते में जमा हुआ',
        body: `₹${event.payload?.amount || 24000} credited to Bank Account via PFMS. UTR: ${event.payload?.utrNumber || 'SBIN908231'}.`,
        bodyHi: `₹${event.payload?.amount || 24000} PFMS द्वारा सीधे बैंक खाते में जमा किए गए।`,
        channel: 'APP'
      });
    });
  }

  public send(notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): AppNotification {
    const fullNotif: AppNotification = {
      ...notif,
      id: `NOTIF-${Date.now().toString().slice(-5)}`,
      timestamp: 'Just now',
      isRead: false
    };

    this.notifications.unshift(fullNotif);
    this.notify();
    eventBus.publish('notification.created', fullNotif, 'NotificationService');
    return fullNotif;
  }

  public getAll(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public notifyBookingConfirmed(token: AgriToken): void {
    this.send({
      type: 'BOOKING_CONFIRMED',
      title: `Booking Confirmed: Token ${token.tokenNumber}`,
      titleHi: `बुकिंग पुष्ट: टोकन ${token.tokenNumber}`,
      body: `Your slot at ${token.centreName} is booked for ${token.scheduledTime}. Ahead in line: ${token.peopleAhead}.`,
      bodyHi: `${token.centreName} पर आपका स्लॉट ${token.scheduledTime} हेतु आरक्षित है। कतार में आगे: ${token.peopleAhead}।`,
      channel: 'SMS'
    });
  }

  public notifyLateArrivalRequeued(token: AgriToken, newPosition: number, estimatedWaitMins?: number): void {
    const waitMsg = estimatedWaitMins ? ` Estimated wait: ~${estimatedWaitMins} mins.` : '';
    const waitMsgHi = estimatedWaitMins ? ` अनुमानित प्रतीक्षा समय: ~${estimatedWaitMins} मिनट।` : '';
    this.send({
      type: 'LATE_STATUS',
      title: `Grace Period Applied: Token ${token.tokenNumber}`,
      titleHi: `ग्रेस अवधि लागू: टोकन ${token.tokenNumber}`,
      body: `Late arrival recorded. Requeued to position #${newPosition} under 24-hour grace window.${waitMsg}`,
      bodyHi: `देर से आगमन दर्ज। 24 घंटे की ग्रेस अवधि के तहत कतार स्थान #${newPosition} आवंटित।${waitMsgHi}`,
      channel: 'APP'
    });
  }

  public notifyGateArrival(token: AgriToken): void {
    this.send({
      type: 'QUEUE_UPDATED',
      title: `Gate Inward Verified: Token ${token.tokenNumber}`,
      titleHi: `गेट इनवर्ड सत्यापित: टोकन ${token.tokenNumber}`,
      body: `Welcome to Mandi. Please proceed to Counter #${token.counterAssigned || 2}.`,
      bodyHi: `मंडी में स्वागत है। कृपया काउंटर #${token.counterAssigned || 2} पर जाएं।`,
      channel: 'APP'
    });
  }

  public sendNotification(payload: {
    title: string;
    titleHi?: string;
    message?: string;
    messageHi?: string;
    body?: string;
    bodyHi?: string;
    type?: string;
    channel?: string;
    severity?: string;
    targetKisanId?: string;
  }): void {
    this.send({
      type: 'CANCELLATION',
      title: payload.title,
      titleHi: payload.titleHi || payload.title,
      body: payload.message || payload.body || '',
      bodyHi: payload.messageHi || payload.bodyHi || payload.message || '',
      channel: 'APP'
    });
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notify();
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.notify();
  }

  public reset(): void {
    this.notifications = [
      {
        id: 'NOTIF-01',
        type: 'QUEUE_UPDATED',
        title: 'Token Called at Counter #2',
        titleHi: 'टोकन संख्या AS-108 को काउंटर #2 पर बुलाया गया',
        body: 'Please approach Counter #2 with your Land 7/12 & Aadhaar credentials.',
        bodyHi: 'कृपया 7/12 व आधार विवरण के साथ काउंटर #2 पर पहुंचें।',
        channel: 'APP',
        timestamp: '5 mins ago',
        isRead: false
      },
      {
        id: 'NOTIF-02',
        type: 'WEATHER_ALERT',
        title: 'Clear Skies Advisory for Harvesting',
        titleHi: 'कटाई व परिवहन हेतु अनुकूल मौसम',
        body: 'Wardha district forecast is dry and clear for the next 48 hours.',
        bodyHi: 'अगले 48 घंटों में वर्धा जिले में मौसम साफ और शुष्क रहेगा।',
        channel: 'APP',
        timestamp: '1 hour ago',
        isRead: true
      }
    ];
    this.notify();
  }

  public subscribe(listener: (notifications: AppNotification[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(l => l([...this.notifications]));
  }
}

export const notificationService = new NotificationService();
