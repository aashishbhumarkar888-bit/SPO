/**
 * src/services/emailService.ts
 * Client-side interface to the server-side SMTP mailer proxy.
 * Zero credentials are exposed in client-side code.
 */

export interface SmtpSendOtpResult {
  success: boolean;
  message: string;
  smtpConfigured: boolean;
  smtpDelivered: boolean;
  expiresInMinutes?: number;
  previewOtp?: string;
  note?: string;
  error?: string;
}

export interface SmtpVerifyOtpResult {
  success: boolean;
  message?: string;
  error?: string;
  verifiedEmail?: string;
}

export interface SmtpStatusResult {
  configured: boolean;
  host?: string;
  port?: number;
  sender?: string;
}

export const emailService = {
  /**
   * Request a 6-digit OTP dispatched to the recipient's email address via the server SMTP relay
   */
  async sendOtp(email: string, fullName?: string): Promise<SmtpSendOtpResult> {
    const cleanEmail = email.trim().toLowerCase();
    const response = await fetch('/api/auth/send-smtp-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, fullName: fullName?.trim() })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to dispatch email verification code');
    }
    return data;
  },

  /**
   * Verify the 6-digit OTP against server-side session cache
   */
  async verifyOtp(email: string, code: string): Promise<SmtpVerifyOtpResult> {
    const response = await fetch('/api/auth/verify-smtp-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() })
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Invalid or expired verification code' };
    }
    return data;
  },

  /**
   * Check SMTP relay health & configuration state without sending an email
   */
  async checkSmtpStatus(): Promise<SmtpStatusResult> {
    try {
      const response = await fetch('/api/auth/smtp-status');
      if (!response.ok) {
        return { configured: false };
      }
      return await response.json();
    } catch {
      return { configured: false };
    }
  }
};
