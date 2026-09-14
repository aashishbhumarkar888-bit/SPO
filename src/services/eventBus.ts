/**
 * AgriSeva Domain Event Bus Abstraction
 * Decouples domain engines from UI presentation layers.
 * Prepared for WebSocket, SSE, or cloud messaging connectivity in production.
 */

export type DomainEventType =
  | 'booking.created'
  | 'booking.confirmed'
  | 'booking.cancelled'
  | 'booking.updated'
  | 'queue.updated'
  | 'farmer.arrived'
  | 'farmer.late'
  | 'farmer.requeued'
  | 'appointment.cancelled'
  | 'capacity.updated'
  | 'payment.updated'
  | 'notification.created'
  | 'weighbridge.completed'
  | 'system.reset';

export interface DomainEvent<T = unknown> {
  type: DomainEventType;
  payload: T;
  timestamp: string;
  source: string;
}

export type DomainEventHandler<T = unknown> = (event: DomainEvent<T>) => void;

class DomainEventBus {
  private handlers: Map<DomainEventType, Set<DomainEventHandler<any>>> = new Map();

  public subscribe<T = unknown>(type: DomainEventType, handler: DomainEventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    const set = this.handlers.get(type)!;
    set.add(handler as DomainEventHandler<any>);

    return () => {
      set.delete(handler as DomainEventHandler<any>);
    };
  }

  public publish<T = unknown>(type: DomainEventType, payload: T, source: string = 'client'): void {
    const event: DomainEvent<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      source
    };

    const listeners = this.handlers.get(type);
    if (listeners) {
      listeners.forEach(handler => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Error in event handler for ${type}:`, err);
        }
      });
    }
  }
}

export const eventBus = new DomainEventBus();
