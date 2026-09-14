/**
 * AgriSeva Immutable Audit Logging Subsystem
 * Tracks operational actions, transitions, and state changes for transparency.
 */

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorRole: 'FARMER' | 'SUPERVISOR' | 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM';
  action: 
    | 'BOOKING_CREATED'
    | 'BOOKING_CONFIRMED'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_RESCHEDULED'
    | 'FARMER_ARRIVED'
    | 'FARMER_MARKED_LATE'
    | 'FARMER_REQUEUED'
    | 'QUEUE_REORDERED'
    | 'COUNTER_ASSIGNED'
    | 'COUNTER_REASSIGNED'
    | 'PROCESSING_STARTED'
    | 'PROCESSING_COMPLETED'
    | 'WEIGHT_RECORDED'
    | 'PROCUREMENT_COMPLETED'
    | 'PAYMENT_UPDATED'
    | 'POLICY_CHANGED'
    | 'POLICY_UPDATED'
    | 'WEIGHBRIDGE_INWARD_RECORDED'
    | 'PAYMENT_ADVICE_ISSUED'
    | 'PAYMENT_CREDITED'
    | 'EMERGENCY_BROADCAST_SENT'
    | 'TOKEN_CALLED'
    | 'STATUS_TRANSITION';
  entity: 'Booking' | 'Queue' | 'Weighbridge' | 'Procurement' | 'Payment' | 'Policy' | 'Broadcaster';
  entityId: string;
  before?: Record<string, unknown> | string;
  after?: Record<string, unknown> | string;
  timestamp: string;
  source: 'UI' | 'SIMULATION' | 'ALGORITHM' | 'HARDWARE_TERMINAL';
  reason?: string;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-LOG-101',
    actorId: 'F-10234',
    actorRole: 'FARMER',
    action: 'BOOKING_CREATED',
    entity: 'Booking',
    entityId: 'TOK-108',
    after: { slot: '10:30 AM', centre: 'Centre A', service: 'MandiSlot', crop: 'Wheat', quintals: 80 },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'UI',
    reason: 'Farmer Ramesh Kumar self-scheduled mandi slot via AgriSeva web'
  },
  {
    id: 'AUD-LOG-102',
    actorId: 'SUP-01',
    actorRole: 'SUPERVISOR',
    action: 'COUNTER_ASSIGNED',
    entity: 'Queue',
    entityId: 'TOK-108',
    before: { counterAssigned: 0 },
    after: { counterAssigned: 2 },
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    source: 'UI',
    reason: 'Initial counter assignment by gate supervisor'
  }
];

type AuditListener = (entry: AuditLogEntry) => void;

function scrubSensitiveData(data?: Record<string, unknown> | string): Record<string, unknown> | string | undefined {
  if (!data || typeof data === 'string') return data;
  const scrubbed: Record<string, unknown> = { ...data };
  for (const key of Object.keys(scrubbed)) {
    const val = scrubbed[key];
    if (typeof val === 'string') {
      // Mask phone
      if (/^\+?91?[6-9]\d{9}$/.test(val)) {
        scrubbed[key] = val.slice(0, 2) + '******' + val.slice(-2);
      }
      // Mask Aadhaar
      if (/^\d{12}$/.test(val)) {
        scrubbed[key] = 'XXXX-XXXX-' + val.slice(-4);
      }
      // Mask bank account
      if (key.toLowerCase().includes('account') && val.length > 4) {
        scrubbed[key] = '••••' + val.slice(-4);
      }
    }
  }
  return scrubbed;
}

class AuditLoggerService {
  private logs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
  private listeners: Set<AuditListener> = new Set();

  public record(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const fullEntry: AuditLogEntry = {
      ...entry,
      before: scrubSensitiveData(entry.before),
      after: scrubSensitiveData(entry.after),
      id: `AUD-LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(fullEntry);
    this.notifyListeners(fullEntry);
    return fullEntry;
  }

  public log(entry: {
    action: AuditLogEntry['action'] | string;
    actorRole: AuditLogEntry['actorRole'];
    actorId: string;
    targetEntity?: string;
    targetId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }): AuditLogEntry {
    return this.record({
      actorId: entry.actorId,
      actorRole: entry.actorRole,
      action: (entry.action as AuditLogEntry['action']) || 'BOOKING_CREATED',
      entity: (entry.targetEntity as AuditLogEntry['entity']) || 'Booking',
      entityId: entry.targetId || 'SYSTEM',
      after: entry.metadata,
      source: 'UI',
      reason: entry.description
    });
  }

  public reset(): void {
    this.logs = [...INITIAL_AUDIT_LOGS];
    this.listeners.forEach(listener => {
      INITIAL_AUDIT_LOGS.forEach(entry => listener(entry));
    });
  }

  public getAll(): AuditLogEntry[] {
    return [...this.logs];
  }

  public subscribe(listener: AuditListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(entry: AuditLogEntry): void {
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (err) {
        console.error('Audit listener error:', err);
      }
    });
  }
}

export const auditLogger = new AuditLoggerService();
