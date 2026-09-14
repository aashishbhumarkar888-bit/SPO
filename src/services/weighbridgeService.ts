/**
 * AgriSeva Weighbridge & Fair Average Quality (FAQ) Valuation Service
 * 
 * Centralized calculation engine for:
 * 1. Net tare determination according to standard weighbridge rules (IS 9281 domain formulation)
 * 2. Moisture deduction formulas (FAQ standard limit: 12% for cereals, 10% for oilseeds)
 * 3. MSP and total gross payout valuation
 */

export interface WeighbridgeInputs {
  grossWeightKg: number;
  tareWeightKg: number;
  cropName: string;
  moisturePercentage: number;
  foreignMatterPercentage: number;
  mspPerQuintal: number;
  maxMoistureFAQ?: number;
  deductionRatePerPercent?: number; // In percentage of quantity or INR per Q
}

export interface WeighbridgeCalculationResult {
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  grossWeightQuintals: number;
  tareWeightQuintals: number;
  netWeightQuintals: number;
  moisturePercentage: number;
  moistureDeductionQuintals: number;
  foreignMatterDeductionQuintals: number;
  finalPayableQuintals: number;
  mspPerQuintal: number;
  grossPayoutInr: number;
  deductionsInr: number;
  finalPayableInr: number;
  qualityGrade: 'FAQ Grade A' | 'Grade B' | 'Below Fair';
  slipNumber: string;
  generatedAt: string;
}

export class WeighbridgeService {
  /**
   * Calculates net tare, moisture deductions, and total payout using standardized rules
   */
  public static calculate(inputs: WeighbridgeInputs): WeighbridgeCalculationResult {
    const grossKg = Math.max(0, inputs.grossWeightKg);
    const tareKg = Math.max(0, inputs.tareWeightKg);
    const netKg = Math.max(0, grossKg - tareKg);

    const grossQuintals = Number((grossKg / 100).toFixed(2));
    const tareQuintals = Number((tareKg / 100).toFixed(2));
    const netQuintals = Number((netKg / 100).toFixed(2));

    const maxFaqMoisture = inputs.maxMoistureFAQ ?? 12.0;
    const moisture = Math.max(0, inputs.moisturePercentage);
    const excessMoisturePct = Math.max(0, moisture - maxFaqMoisture);

    // Standard Mandi Deduction Rule: 1% weight deduction for every 1% excess moisture above FAQ limit
    const moistureDeductionQ = Number(((netQuintals * excessMoisturePct) / 100).toFixed(2));
    
    // Foreign matter deduction: Above 2% threshold, deduct exact excess
    const excessForeignPct = Math.max(0, inputs.foreignMatterPercentage - 2.0);
    const foreignMatterDeductionQ = Number(((netQuintals * excessForeignPct) / 100).toFixed(2));

    const totalDeductionsQ = Number((moistureDeductionQ + foreignMatterDeductionQ).toFixed(2));
    const finalPayableQ = Math.max(0, Number((netQuintals - totalDeductionsQ).toFixed(2)));

    const msp = inputs.mspPerQuintal;
    const grossPayout = Math.round(netQuintals * msp);
    const deductionsInr = Math.round(totalDeductionsQ * msp);
    const finalPayableInr = Math.round(finalPayableQ * msp);

    // Grade classification
    let qualityGrade: 'FAQ Grade A' | 'Grade B' | 'Below Fair' = 'FAQ Grade A';
    if (moisture > 14.0 || inputs.foreignMatterPercentage > 3.5) {
      qualityGrade = 'Below Fair';
    } else if (moisture > maxFaqMoisture || inputs.foreignMatterPercentage > 2.0) {
      qualityGrade = 'Grade B';
    }

    const slipNumber = `APMC-WB-${Date.now().toString().slice(-5)}`;

    return {
      grossWeightKg: grossKg,
      tareWeightKg: tareKg,
      netWeightKg: netKg,
      grossWeightQuintals: grossQuintals,
      tareWeightQuintals: tareQuintals,
      netWeightQuintals: netQuintals,
      moisturePercentage: moisture,
      moistureDeductionQuintals: moistureDeductionQ,
      foreignMatterDeductionQuintals: foreignMatterDeductionQ,
      finalPayableQuintals: finalPayableQ,
      mspPerQuintal: msp,
      grossPayoutInr: grossPayout,
      deductionsInr,
      finalPayableInr,
      qualityGrade,
      slipNumber,
      generatedAt: new Date().toISOString()
    };
  }
}
