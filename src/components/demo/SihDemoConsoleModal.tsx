import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  X, 
  Info, 
  ShieldCheck, 
  Zap, 
  Clock,
  Scale,
  CreditCard,
  Building2
} from 'lucide-react';
import { FarmerProfile, AgriToken, ProcurementRecord, DbtTransaction } from '../../types';
import { RAMESH_KUMAR_SIH_DEMO, RAMESH_KUMAR_DEMO_TOKEN } from '../../data/agriMockData';
import { allocationService } from '../../services/allocationService';
import { WeighbridgeService } from '../../services/weighbridgeService';
import { notificationService } from '../../services/notificationService';
import { auditLogger } from '../../domain/auditLog';
import { eventBus } from '../../services/eventBus';
import { playAudioChime } from '../../utils/speech';
import { DemoCredentialsDirectory } from '../common/DemoCredentialsDirectory';

interface SihDemoConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFarmer: FarmerProfile;
  activeToken?: AgriToken;
  allTokens: AgriToken[];
  onSetFarmer: (farmer: FarmerProfile) => void;
  onUpdateTokens: (tokens: AgriToken[]) => void;
  onAddProcurement: (record: ProcurementRecord) => void;
  onUpdateDbtTransactions: (updater: (prev: DbtTransaction[]) => DbtTransaction[]) => void;
  onOpenSihAudit: (featureId?: string) => void;
  onResetAllState?: () => void;
}

export const SihDemoConsoleModal: React.FC<SihDemoConsoleModalProps> = ({
  isOpen,
  onClose,
  currentFarmer,
  activeToken,
  allTokens,
  onSetFarmer,
  onUpdateTokens,
  onAddProcurement,
  onUpdateDbtTransactions,
  onOpenSihAudit,
  onResetAllState
}) => {
  const [simulationStatus, setSimulationStatus] = useState<string>('Ready for demonstration');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const isRameshKumarActive = currentFarmer.kisanId === 'F-10234';

  // 1. Initialize Canonical SIH Ramesh Kumar Scenario
  const handleInitialize = () => {
    onSetFarmer(RAMESH_KUMAR_SIH_DEMO);
    const updated = [RAMESH_KUMAR_DEMO_TOKEN, ...allTokens.filter(t => t.id !== RAMESH_KUMAR_DEMO_TOKEN.id)];
    onUpdateTokens(updated);

    auditLogger.record({
      actorId: 'F-10234',
      actorRole: 'FARMER',
      action: 'BOOKING_CONFIRMED',
      entity: 'Booking',
      entityId: RAMESH_KUMAR_DEMO_TOKEN.id,
      after: {
        farmer: 'Ramesh Kumar',
        kisanId: 'F-10234',
        village: 'Rampur',
        crop: 'Wheat',
        quantity: '80 Quintal',
        centre: 'Centre A',
        time: '10:30 AM',
        queue: '11/18',
        wait: '18 min',
        estimatedDbt: '₹24,000'
      },
      source: 'SIMULATION',
      reason: 'SIH Scenario Initialized: Ramesh Kumar (F-10234, Rampur, Wheat 80Q, Centre A, 10:30 AM, Queue 11/18, 18 min, ₹24,000)'
    });

    notificationService.send({
      type: 'QUEUE_UPDATED',
      title: 'SIH Demo Initialized',
      titleHi: 'एसआईएच डेमो प्रारंभ',
      body: 'Loaded deterministic Ramesh Kumar (Wheat, 80 Quintals) test scenario.',
      bodyHi: 'रमेश कुमार (गेहूं, 80 क्विंटल) परीक्षण परिदृश्य लोड किया गया।',
      channel: 'APP'
    });

    setActiveStepIndex(1);
    setSimulationStatus('Initialized: Ramesh Kumar | F-10234 | Rampur | Wheat 80Q | Centre A | 10:30 AM | Queue 11/18 | 18m');
    playAudioChime();
  };

  // 2. Gate Arrival
  const handleGateArrival = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const updated = allTokens.map(t => {
      if (t.id === token.id) {
        return {
          ...t,
          status: 'At Counter' as const,
          peopleAhead: 0,
          estimatedWaitMins: 0,
          counterAssigned: 2
        };
      }
      return t;
    });
    onUpdateTokens(updated);

    auditLogger.record({
      actorId: 'SUP-WRD-01',
      actorRole: 'SUPERVISOR',
      action: 'FARMER_ARRIVED',
      entity: 'Queue',
      entityId: token.id,
      before: { status: token.status },
      after: { status: 'At Counter', counterAssigned: 2 },
      source: 'SIMULATION',
      reason: `Gate Inward arrival verified for ${token.farmerName} (${token.tokenNumber}) at Counter #2`
    });

    eventBus.publish('farmer.arrived', { tokenId: token.id }, 'SihDemoConsoleModal');
    notificationService.send({
      type: 'QUEUE_UPDATED',
      title: 'Gate Arrival Confirmed',
      titleHi: 'गेट पर आगमन दर्ज',
      body: `Token ${token.tokenNumber} verified at Gate Inward. Proceed to Counter #2.`,
      bodyHi: `टोकन ${token.tokenNumber} गेट पर सत्यापित। सीधे काउंटर #2 पर जाएं।`,
      channel: 'APP'
    });

    setActiveStepIndex(2);
    setSimulationStatus(`Gate Arrival: ${token.farmerName} verified at Gate Inward -> Counter #2`);
    playAudioChime();
  };

  // 3. Late Arrival & Grace Period Requeue
  const handleLateArrival = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const result = allocationService.handleLateArrival(token, allTokens);
    const updated = allTokens.map(t => t.id === token.id ? result.token : t);
    onUpdateTokens(updated);

    auditLogger.record({
      actorId: 'SYSTEM',
      actorRole: 'SYSTEM',
      action: 'FARMER_MARKED_LATE',
      entity: 'Queue',
      entityId: token.id,
      before: { status: token.status },
      after: { status: result.token.status, newPosition: result.newPosition, gracePeriodHours: 24 },
      source: 'ALGORITHM',
      reason: 'Late arrival detected. 24-hour statutory grace period applied. Requeued automatically.'
    });

    notificationService.send({
      type: 'LATE_STATUS',
      title: 'Grace Period Applied: Requeued',
      titleHi: 'ग्रेस अवधि लागू: कतार पुनर्गठित',
      body: `Booking protected under 24-hour grace policy. Reassigned to queue position #${result.newPosition}.`,
      bodyHi: `आपकी बुकिंग 24 घंटे की ग्रेस नीति के तहत सुरक्षित है। कतार स्थान #${result.newPosition} दिया गया।`,
      channel: 'APP'
    });

    setActiveStepIndex(3);
    setSimulationStatus(`Late Arrival: Token ${token.tokenNumber} requeued to Position #${result.newPosition} (24h Grace Active)`);
    playAudioChime();
  };

  // 4. Fast-Track Priority / Token Called
  const handleFastTrack = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const updated = allTokens.map(t => {
      if (t.id === token.id) {
        return {
          ...t,
          priority: true,
          status: 'Called' as const,
          peopleAhead: 0,
          estimatedWaitMins: 0,
          counterAssigned: 2
        };
      }
      return t;
    });
    onUpdateTokens(updated);

    auditLogger.record({
      actorId: 'SUP-WRD-01',
      actorRole: 'SUPERVISOR',
      action: 'TOKEN_CALLED',
      entity: 'Queue',
      entityId: token.id,
      after: { counterAssigned: 2, priority: true },
      source: 'SIMULATION',
      reason: `Supervisor fast-tracked and called token ${token.tokenNumber} to Counter #2`
    });

    setActiveStepIndex(4);
    setSimulationStatus(`Fast-Track Priority: Token ${token.tokenNumber} called to Counter #2`);
    playAudioChime();
  };

  // 5. Electronic Weighbridge (IS 9281 Standard)
  const handleWeighbridge = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const calc = WeighbridgeService.calculate({
      grossWeightKg: 10450,
      tareWeightKg: 2450,
      cropName: token.serviceDetails?.cropName || 'Wheat (Sharbati)',
      moisturePercentage: 11.2,
      foreignMatterPercentage: 1.4,
      mspPerQuintal: 2275
    });

    const updated = allTokens.map(t => {
      if (t.id === token.id) {
        return {
          ...t,
          status: 'Weighbridge' as const,
          peopleAhead: 0,
          estimatedWaitMins: 0
        };
      }
      return t;
    });
    onUpdateTokens(updated);

    notificationService.send({
      type: 'PROCESSING_COMPLETED',
      title: 'Vehicle on Weighbridge (IS 9281)',
      titleHi: 'वाहन तौल कांटे पर (IS 9281)',
      body: `Gross: 10,450kg, Tare: 2,450kg, Net: 80.0 Quintals. Moisture: 11.2% (Grade A FAQ Passed).`,
      bodyHi: `सकल वजन: 10,450 किग्रा, खाली वजन: 2,450 किग्रा, शुद्ध: 80 क्विंटल। नमी: 11.2% (एफएक्यू पास)।`,
      channel: 'APP'
    });

    auditLogger.record({
      actorId: 'OPERATOR-WB-01',
      actorRole: 'SUPERVISOR',
      action: 'WEIGHT_RECORDED',
      entity: 'Weighbridge',
      entityId: calc.slipNumber,
      after: {
        grossWeightKg: 10450,
        tareWeightKg: 2450,
        netWeightQuintals: 80,
        moisturePercentage: 11.2,
        qualityGrade: 'FAQ Grade A'
      },
      source: 'HARDWARE_TERMINAL',
      reason: 'Electronic weighbridge gross & tare weights verified per IS 9281 standards'
    });

    setActiveStepIndex(5);
    setSimulationStatus(`Weighbridge: Slip #${calc.slipNumber} | Gross: 10,450kg | Tare: 2,450kg | Net: 80.0Q (Moisture 11.2%)`);
    playAudioChime();
  };

  // 6. Procurement Completion (Slip Generated)
  const handleProcurementComplete = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const slipNumber = `WB-2026-${Date.now().toString().slice(-4)}`;
    const newProcurement: ProcurementRecord = {
      id: `PROC-${Date.now().toString().slice(-4)}`,
      tokenId: token.id,
      slipNumber,
      farmerName: currentFarmer.fullName,
      farmerNameHi: currentFarmer.fullNameHi,
      kisanId: currentFarmer.kisanId,
      cropName: token.serviceDetails?.cropName || 'Wheat (Sharbati)',
      cropNameHi: token.serviceDetails?.cropNameHi || 'गेहूं (शरबती)',
      centreName: 'Wardha APMC Central Yard',
      centreNameHi: 'वर्धा एपीएमसी मुख्य मंडी केंद्र',
      grossWeightKg: 10450,
      tareWeightKg: 2450,
      netWeightKg: 8000,
      grossWeightQuintals: 104.5,
      tareWeightQuintals: 24.5,
      netWeightQuintals: 80.0,
      moisturePercentage: 11.2,
      foreignMatterPercentage: 1.4,
      qualityGrade: 'FAQ Grade A',
      mspPerQuintal: 2275,
      totalGrossPayable: 24000,
      dbtStatus: 'Advice Generated',
      utrNumber: `PFMS-GEN-${Date.now().toString().slice(-6)}`,
      timestamp: 'Today, Just now'
    };

    onAddProcurement(newProcurement);

    const updated = allTokens.map(t => t.id === token.id ? { ...t, status: 'Completed' as const, peopleAhead: 0, estimatedWaitMins: 0 } : t);
    onUpdateTokens(updated);

    auditLogger.record({
      actorId: 'SUP-WRD-01',
      actorRole: 'SUPERVISOR',
      action: 'PROCUREMENT_COMPLETED',
      entity: 'Procurement',
      entityId: newProcurement.id,
      after: {
        slipNumber,
        netWeightQuintals: 80.0,
        dbtPayableInr: 24000,
        dbtStatus: 'Advice Generated'
      },
      source: 'UI',
      reason: 'MSP procurement successfully recorded. PFMS DBT payment advice generated for ₹24,000'
    });

    notificationService.send({
      type: 'PROCESSING_COMPLETED',
      title: 'Procurement Slip Generated (80 Quintals)',
      titleHi: 'उपार्जन पर्ची जारी (80 क्विंटल गेहूं)',
      body: `Weighbridge slip #${slipNumber} created. Net payable ₹24,000 forwarded to PFMS DBT gateway.`,
      bodyHi: `तौल पर्ची #${slipNumber} जारी। ₹24,000 भुगतान हेतु पीएफएमएस डीबीटी को भेजा गया।`,
      channel: 'APP'
    });

    setActiveStepIndex(6);
    setSimulationStatus(`Procurement Complete: Slip #${slipNumber} | 80Q Wheat | DBT Advice: ₹24,000 Generated`);
    playAudioChime();
  };

  // 7. Direct Benefit Transfer (DBT Credit via PFMS)
  const handleDbtEvent = () => {
    const utr = `PFMSSBI${Date.now().toString().slice(-8)}`;
    onUpdateDbtTransactions(prev => {
      const creditedTxn: DbtTransaction = {
        id: `DBT-${Date.now()}`,
        scheme: 'PM-AASHA (MSP Direct Procurement)',
        amountInr: 24000,
        status: 'Credited',
        utrNumber: utr,
        date: 'Today, Just now',
        bankMasked: `${currentFarmer.bankName} •••• ${currentFarmer.bankAccount.slice(-4)}`,
        description: 'Direct Benefit Transfer for 80 Quintals Wheat at ₹2,275 MSP (Wardha APMC)',
        descriptionHi: '80 क्विंटल गेहूं का न्यूनतम समर्थन मूल्य डीबीटी अंतरण (वर्धा मंडी)'
      };
      if (prev.length === 0) return [creditedTxn];
      return [creditedTxn, ...prev.filter(tx => tx.utrNumber !== utr && tx.status !== 'Processing')];
    });

    auditLogger.record({
      actorId: 'PFMS-GATEWAY',
      actorRole: 'SYSTEM',
      action: 'PAYMENT_CREDITED',
      entity: 'Payment',
      entityId: `DBT-${utr}`,
      after: {
        amountInr: 24000,
        bankAccount: currentFarmer.bankAccount,
        bankName: currentFarmer.bankName,
        utrNumber: utr,
        status: 'Credited'
      },
      source: 'SIMULATION',
      reason: 'Direct Benefit Transfer of ₹24,000 successfully credited to farmer registered bank account'
    });

    eventBus.publish('payment.updated', { 
      amount: 24000, 
      utr, 
      bank: currentFarmer.bankName 
    }, 'SihDemoConsoleModal');

    notificationService.send({
      type: 'PAYMENT_UPDATED',
      title: 'DBT Payment Credited: ₹24,000',
      titleHi: 'डीबीटी भुगतान जमा: ₹24,000',
      body: `₹24,000 credited to ${currentFarmer.bankName} account via PFMS. UTR: ${utr}.`,
      bodyHi: `₹24,000 आपके ${currentFarmer.bankName} खाते में जमा किए गए। यूटीआर: ${utr}।`,
      channel: 'SMS'
    });

    setActiveStepIndex(7);
    setSimulationStatus(`DBT Credited: ₹24,000 sent to ${currentFarmer.bankName} (${currentFarmer.bankAccount}) | UTR: ${utr}`);
    playAudioChime();
  };

  // Reset Demo
  const handleReset = () => {
    if (onResetAllState) {
      onResetAllState();
    }
    setActiveStepIndex(0);
    setSimulationStatus('Demo environment reset to baseline.');
    playAudioChime();
  };

  const steps = [
    {
      num: '01',
      title: 'Initialize Scenario',
      desc: 'Load Ramesh Kumar (Wheat, 80 Quintals, Token #TOK-WRD-042)',
      action: handleInitialize,
      btnLabel: isRameshKumarActive ? 'Scenario Loaded' : 'Load Ramesh Kumar'
    },
    {
      num: '02',
      title: 'Gate Arrival Inward',
      desc: 'Simulate vehicle arriving at Wardha Kendra; assign to Counter #2',
      action: handleGateArrival,
      btnLabel: 'Trigger Gate Inward'
    },
    {
      num: '03',
      title: 'Late Arrival & Grace',
      desc: 'Simulate late arrival; statutory 24-hour grace applied without forfeiture',
      action: handleLateArrival,
      btnLabel: 'Simulate Late (+24h Grace)'
    },
    {
      num: '04',
      title: 'Fast-Track Priority',
      desc: 'Supervisor priority override + calling token to Counter #2',
      action: handleFastTrack,
      btnLabel: 'Fast-Track & Call'
    },
    {
      num: '05',
      title: 'IS 9281 Weighbridge',
      desc: 'Electronic Gross (10,450kg) & Tare (2,450kg) = Net 80.0Q (Moisture 11.2%)',
      action: handleWeighbridge,
      btnLabel: 'Record Weights'
    },
    {
      num: '06',
      title: 'Complete Procurement',
      desc: 'Generate official Form 6A Weighment Slip & create ₹24,000 DBT advice',
      action: handleProcurementComplete,
      btnLabel: 'Generate Slip & DBT Advice'
    },
    {
      num: '07',
      title: 'DBT Credit via PFMS',
      desc: 'Credit ₹24,000 directly to farmer bank account via NPCI APBS',
      action: handleDbtEvent,
      btnLabel: 'Simulate PFMS Credit'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#063B2A] text-white p-5 flex items-center justify-between border-b border-[#0B5D3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-slate-950 uppercase tracking-wide">
                  DEMO SIMULATION
                </span>
                <span className="text-xs text-white/70">Controlled SIH Jury Evaluation Console</span>
              </div>
              <h3 className="text-lg font-bold font-serif-display text-white mt-0.5">
                SPO — Deterministic SIH Demonstration Scenario
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Simulation Status Banner */}
        <div className="px-6 py-3 bg-[#DDF4E9] border-b border-[#168A5B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#063B2A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#168A5B] animate-pulse"></span>
            <span className="font-mono">{simulationStatus}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSihAudit()}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-[#168A5B]/40 text-[#063B2A] text-xs font-bold hover:bg-[#F6F9F7] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#168A5B]" />
              <span>Tech Audit Matrix</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Execution Sequence */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Demo Credentials Directory for Evaluators */}
          <DemoCredentialsDirectory
            defaultExpanded={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {steps.map((s, idx) => {
              const isCompleted = activeStepIndex > idx;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={s.num}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20'
                      : isCompleted
                      ? 'bg-[#F6F9F7] border-emerald-300/60'
                      : 'bg-white border-slate-200 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        STEP {s.num}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Executed</span>
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                          Recommended Next
                        </span>
                      ) : null}
                    </div>

                    <h4 className="font-bold text-sm text-[#063B2A]">{s.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={s.action}
                      className={`w-full py-2 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                        isCurrent
                          ? 'bg-[#063B2A] hover:bg-[#0B5D3B] text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{s.btnLabel}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer with Instructions */}
        <div className="p-4 bg-[#F6F9F7] border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#168A5B]" />
            <span>
              All demo actions update the canonical system state and reflect across Farmer, Supervisor, and DBT ledgers simultaneously.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
