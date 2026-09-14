/**
 * AgriSeva Authoritative Canonical Time Provider
 * 
 * Enforces canonical synchronization for arrival windows,
 * grace periods, queue dwell estimations, and audit logging.
 * Prevents client device clock manipulation from skewing domain logic.
 */

export class TimeService {
  // Configured baseline reference time for deterministic evaluation
  private static simulatedOffsetMs: number = 0;

  /**
   * Returns authoritative UTC timestamp as ISO-8601 string
   */
  public static nowISO(): string {
    const timestamp = Date.now() + this.simulatedOffsetMs;
    return new Date(timestamp).toISOString();
  }

  /**
   * Returns authoritative epoch in milliseconds
   */
  public static nowMs(): number {
    return Date.now() + this.simulatedOffsetMs;
  }

  /**
   * Returns human-readable time (e.g. "10:30 AM")
   */
  public static formatTime(dateOrIso?: string | Date): string {
    const date = dateOrIso ? new Date(dateOrIso) : new Date(this.nowMs());
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Returns human-readable date & time (e.g. "13 Sep 2026, 10:30 AM")
   */
  public static formatDateTime(dateOrIso?: string | Date): string {
    const date = dateOrIso ? new Date(dateOrIso) : new Date(this.nowMs());
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Checks if an arrival time falls within the allowed window or grace period.
   * @param scheduledTimeStr Scheduled slot time e.g. "10:30 AM" or ISO string
   * @param gracePeriodHours Maximum grace period allowance (default 24h)
   */
  public static evaluateArrivalStatus(
    scheduledTimeStr: string,
    gracePeriodHours: number = 24
  ): {
    status: 'EXPECTED' | 'ARRIVED' | 'LATE' | 'NO_SHOW';
    isWithinGracePeriod: boolean;
    minutesDifference: number;
  } {
    // For standardized evaluation, analyze against the current authoritative time
    const now = new Date(this.nowMs());
    let scheduledDate = new Date();

    if (scheduledTimeStr.includes(':')) {
      const parts = scheduledTimeStr.replace(/(Today,|Tomorrow,)/i, '').trim();
      const match = parts.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const mins = parseInt(match[2], 10);
        const mer = match[3]?.toUpperCase();
        if (mer === 'PM' && hours < 12) hours += 12;
        if (mer === 'AM' && hours === 12) hours = 0;
        scheduledDate.setHours(hours, mins, 0, 0);
      }
    } else {
      scheduledDate = new Date(scheduledTimeStr);
    }

    const diffMinutes = Math.round((now.getTime() - scheduledDate.getTime()) / 60000);

    if (diffMinutes < -15) {
      // Arrived more than 15 mins early
      return { status: 'EXPECTED', isWithinGracePeriod: true, minutesDifference: diffMinutes };
    }
    if (diffMinutes <= 30) {
      // On-time window (-15 mins to +30 mins)
      return { status: 'ARRIVED', isWithinGracePeriod: true, minutesDifference: diffMinutes };
    }
    if (diffMinutes <= gracePeriodHours * 60) {
      // Late but within grace period
      return { status: 'LATE', isWithinGracePeriod: true, minutesDifference: diffMinutes };
    }

    // Beyond grace period
    return { status: 'NO_SHOW', isWithinGracePeriod: false, minutesDifference: diffMinutes };
  }

  /**
   * Reset simulation time offset
   */
  public static resetOffset(): void {
    this.simulatedOffsetMs = 0;
  }
}
