/**
 * AgriSeva Centralized Validation Subsystem
 * Enforces schema integrity, type safety, and domain boundary validation.
 */

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export class ValidationService {
  /**
   * Validates Indian 10-digit mobile number
   */
  public static validateMobile(phone: string): { valid: boolean; error?: string } {
    const cleaned = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return {
        valid: false,
        error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
      };
    }
    return { valid: true };
  }

  /**
   * Validates 4-digit or 6-digit OTP
   */
  public static validateOtp(otp: string): { valid: boolean; error?: string } {
    if (!/^\d{4,6}$/.test(otp.trim())) {
      return {
        valid: false,
        error: 'OTP must be 4 or 6 numeric digits.'
      };
    }
    return { valid: true };
  }

  /**
   * Validates booking crop request inputs
   */
  public static validateBookingInput(data: {
    centreId: string;
    date: string;
    slotId: string;
    approxQuintals?: number;
    cropName?: string;
  }): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.centreId) {
      errors.centreId = 'Please select an authorized service centre or mandi yard.';
    }
    if (!data.date) {
      errors.date = 'Please choose an appointment date.';
    }
    if (!data.slotId) {
      errors.slotId = 'Please select a designated time slot.';
    }
    if (data.approxQuintals !== undefined) {
      if (data.approxQuintals <= 0) {
        errors.approxQuintals = 'Crop quantity must be greater than 0 Quintals.';
      } else if (data.approxQuintals > 500) {
        errors.approxQuintals = 'Single booking cannot exceed 500 Quintals (APMC regulatory cap).';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validates weighbridge tare and gross inputs
   */
  public static validateWeighbridge(grossKg: number, tareKg: number): ValidationResult {
    const errors: Record<string, string> = {};

    if (grossKg <= 0) {
      errors.grossKg = 'Gross vehicle weight must be greater than 0 kg.';
    }
    if (tareKg < 0) {
      errors.tareKg = 'Tare weight cannot be negative.';
    }
    if (tareKg >= grossKg && grossKg > 0) {
      errors.tareKg = 'Tare (empty vehicle) weight cannot equal or exceed gross weight.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}
