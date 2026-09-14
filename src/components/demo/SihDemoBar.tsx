import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Scale, 
  CreditCard, 
  CheckCheck,
  RefreshCw,
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info
} from 'lucide-react';
import { FarmerProfile, AgriToken, ProcurementRecord, DbtTransaction } from '../../types';
import { RAMESH_KUMAR_SIH_DEMO, RAMESH_KUMAR_DEMO_TOKEN } from '../../data/agriMockData';
import { allocationService } from '../../services/allocationService';
import { WeighbridgeService } from '../../services/weighbridgeService';
import { notificationService } from '../../services/notificationService';
import { auditLogger } from '../../domain/auditLog';
import { eventBus } from '../../services/eventBus';
import { playAudioChime } from '../../utils/speech';

interface SihDemoBarProps {
  currentFarmer: FarmerProfile;
  activeToken: AgriToken;
  allTokens: AgriToken[];
  onSetFarmer: (farmer: FarmerProfile) => void;
  onUpdateTokens: (tokens: AgriToken[]) => void;
  onAddProcurement: (record: ProcurementRecord) => void;
  onUpdateDbtTransactions: (updater: (prev: DbtTransaction[]) => DbtTransaction[]) => void;
  onOpenSihAudit: (featureId?: string) => void;
  onResetAllState?: () => void;
}

export const SihDemoBar: React.FC<SihDemoBarProps> = ({
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [simulationStatus, setSimulationStatus] = useState<string>('Ready for demonstration');

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

    setSimulationStatus('Initialized: Ramesh Kumar | F-10234 | Rampur | Wheat 80Q | Centre A | 10:30 AM | Queue 11/18 | 18m | ₹24,000');
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

    eventBus.publish('farmer.arrived', { tokenId: token.id }, 'SihDemoBar');
    notificationService.send({
      type: 'QUEUE_UPDATED',
      title: 'Gate Arrival Confirmed',
      titleHi: 'गेट पर आगमन दर्ज',
      body: `Token ${token.tokenNumber} verified at Gate Inward. Proceed to Counter #2.`,
      bodyHi: `टोकन ${token.tokenNumber} गेट पर सत्यापित। सीधे काउंटर #2 पर जाएं।`,
      channel: 'APP'
    });

    setSimulationStatus(`Gate Arrival: ${token.farmerName} verified at Gate Inward -> Counter #2`);
    playAudioChime();
  };

  // 3. Late Arrival
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

    setSimulationStatus(`Late Arrival: Token ${token.tokenNumber} requeued to Position #${result.newPosition} (24h Grace Active)`);
    playAudioChime();
  };

  // 4. Requeue
  const handleRequeue = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const newAhead = (token.peopleAhead || 0) + 2;
    const newWait = (token.estimatedWaitMins || 0) + 12;
    const updated = allTokens.map(t => {
      if (t.id === token.id) {
        return {
          ...t,
          peopleAhead: newAhead,
          estimatedWaitMins: newWait
        };
      }
      return t;
    });
    onUpdateTokens(updated);

    auditLogger.record({
      actorId: 'SUP-WRD-01',
      actorRole: 'SUPERVISOR',
      action: 'QUEUE_REORDERED',
      entity: 'Queue',
      entityId: token.id,
      before: { peopleAhead: token.peopleAhead },
      after: { peopleAhead: newAhead, estimatedWaitMins: newWait },
      source: 'SIMULATION',
      reason: 'Dynamic requeue applied for gate traffic balancing (+2 slots)'
    });

    setSimulationStatus(`Requeued: Token ${token.tokenNumber} shifted +2 slots (${newAhead} ahead, ~${newWait}m)`);
    playAudioChime();
  };

  // 5. Queue Progress
  const handleQueueProgress = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const newWait = Math.max(0, token.estimatedWaitMins - 6);
    const newAhead = Math.max(0, token.peopleAhead - 1);
    const newStatus = newAhead === 0 ? 'Called' : token.status;
    const updated = allTokens.map(t => {
      if (t.id === token.id) {
        return {
          ...t,
          peopleAhead: newAhead,
          estimatedWaitMins: newWait,
          status: newStatus
        };
      }
      return t;
    });
    onUpdateTokens(updated);

    if (newAhead === 0) {
      auditLogger.record({
        actorId: 'SUP-WRD-01',
        actorRole: 'SUPERVISOR',
        action: 'TOKEN_CALLED',
        entity: 'Queue',
        entityId: token.id,
        after: { counterAssigned: token.counterAssigned || 2 },
        source: 'SIMULATION',
        reason: `Token ${token.tokenNumber} called to Counter #${token.counterAssigned || 2}`
      });
    }

    setSimulationStatus(`Queue Progress: ${newAhead} ahead | Estimated wait: ${newWait} mins`);
    playAudioChime();
  };

  // 6. Weighbridge (IS 9281 Standard)
  const handleWeighbridge = () => {
    const token = activeToken || RAMESH_KUMAR_DEMO_TOKEN;
    const calc = WeighbridgeService.calculate({
      grossWeightKg: 10450,
      tareWeightKg: 2450, // Net = 8000 kg = 80 Quintal
      cropName: token?.serviceDetails?.cropName || 'Wheat (Sharbati)',
      moisturePercentage: 11.2,
      foreignMatterPercentage: 1.4,
      mspPerQuintal: 2275
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

    setSimulationStatus(`Weighbridge: Slip #${calc.slipNumber} | Gross: 10,450kg | Tare: 2,450kg | Net: 80.0Q (Moisture 11.2%)`);
    playAudioChime();
  };

  // 7. Procurement Complete
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

    // Update token status to Completed
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

    setSimulationStatus(`Procurement Complete: Slip #${slipNumber} | 80Q Wheat | DBT Advice: ₹24,000 Generated`);
    playAudioChime();
  };

  // 8. DBT Event (PFMS Direct Benefit Transfer Credit)
  const handleDbtEvent = () => {
    const utr = `PFMSSBI${Date.now().toString().slice(-8)}`;
    onUpdateDbtTransactions(prev => {
      if (prev.length === 0) return prev;
      return prev.map((tx, idx) => {
        if (idx === 0) {
          return {
            ...tx,
            amountInr: 24000,
            status: 'Credited',
            utrNumber: utr
          };
        }
        return tx;
      });
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
      utrNumber: utr 
    }, 'SihDemoBar');

    notificationService.send({
      type: 'PAYMENT_UPDATED',
      title: 'DBT Payout Credited: ₹24,000',
      titleHi: 'डीबीटी भुगतान जमा: ₹24,000',
      body: `₹24,000 credited to ${currentFarmer.bankName} (${currentFarmer.bankAccount}). UTR: ${utr}.`,
      bodyHi: `₹24,000 आपके ${currentFarmer.bankName} खाते में जमा किए गए। यूटीआर: ${utr}।`,
      channel: 'APP'
    });

    setSimulationStatus(`DBT Event: ₹24,000 credited to ${currentFarmer.bankAccount} (${currentFarmer.bankName}) | UTR: ${utr}`);
    playAudioChime();
  };

  // 9. Deterministic RESET DEMO
  const handleResetDemo = () => {
    if (onResetAllState) {
      onResetAllState();
    } else {
      localStorage.removeItem('agriseva_farmer');
      localStorage.removeItem('agriseva_tokens');
      localStorage.removeItem('agriseva_procurements');
      localStorage.removeItem('agriseva_dbt');
      localStorage.removeItem('agriseva_fleet');
      window.location.reload();
    }
    setSimulationStatus('RESET DEMO: All booking, queue, arrival, weighbridge, payment & audit states restored to canonical baseline.');
    playAudioChime();
  };

  return (
    <div className="w-full bg-[#063B2A] text-white border-b border-emerald-500/30 px-3 sm:px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top Header Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-400/30 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              DEMO SIMULATION
            </span>
            <span className="text-xs text-white/90 font-medium hidden sm:inline">
              SIH Deterministic Scenario Controller
            </span>
            <span className="text-xs text-emerald-300/80 font-mono truncate max-w-md">
              • {simulationStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSihAudit()}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5 transition-colors"
              title="Open SIH Technical Audit Matrix"
            >
              <Info className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold">Audit Matrix</span>
            </button>

            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="text-xs p-1 text-white/70 hover:text-white rounded hover:bg-white/10 transition-colors"
              aria-label={isExpanded ? 'Collapse SIH Demo Bar' : 'Expand SIH Demo Bar'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Action Buttons Row */}
        {isExpanded && (
          <div className="pt-1 pb-1 flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
            {/* 1. Initialize */}
            <button
              onClick={handleInitialize}
              className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                isRameshKumarActive 
                  ? 'bg-amber-400 text-black border-amber-300 shadow-sm font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Initialize Canonical Scenario: Ramesh Kumar | F-10234 | Rampur | Wheat 80Q | Centre A | 10:30 AM | Queue 11/18 | 18m | ₹24,000"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>1. Initialize</span>
            </button>

            {/* 2. Gate Arrival */}
            <button
              onClick={handleGateArrival}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-700/60 hover:bg-emerald-600/70 text-white border border-emerald-400/40 flex items-center gap-1.5 transition-colors"
              title="Mark arrival at Gate Inward and assign counter"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>2. Gate Arrival</span>
            </button>

            {/* 3. Late Arrival */}
            <button
              onClick={handleLateArrival}
              className="px-2.5 py-1.5 rounded-lg bg-amber-600/40 hover:bg-amber-500/50 text-white border border-amber-400/40 flex items-center gap-1.5 transition-colors"
              title="Simulate late arrival: dynamic requeue with 24-hour statutory grace period"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>3. Late Arrival</span>
            </button>

            {/* 4. Requeue */}
            <button
              onClick={handleRequeue}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-colors"
              title="Dynamically requeue slot (+2 positions) for gate congestion load balancing"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
              <span>4. Requeue</span>
            </button>

            {/* 5. Queue Progress */}
            <button
              onClick={handleQueueProgress}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-colors"
              title="Advance queue by 1 step (-1 ahead, -6 mins)"
            >
              <Clock className="w-3.5 h-3.5 text-sky-300" />
              <span>5. Queue Progress</span>
            </button>

            {/* 6. Weighbridge */}
            <button
              onClick={handleWeighbridge}
              className="px-2.5 py-1.5 rounded-lg bg-teal-700/60 hover:bg-teal-600/70 text-white border border-teal-400/40 flex items-center gap-1.5 transition-colors"
              title="Record IS 9281 electronic weighbridge gross & tare weights (Net: 80 Quintals)"
            >
              <Scale className="w-3.5 h-3.5 text-teal-300" />
              <span>6. Weighbridge</span>
            </button>

            {/* 7. Procurement Complete */}
            <button
              onClick={handleProcurementComplete}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-700/60 hover:bg-cyan-600/70 text-white border border-cyan-400/40 flex items-center gap-1.5 transition-colors"
              title="Complete procurement and generate PFMS DBT Advice for ₹24,000"
            >
              <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
              <span>7. Procurement Complete</span>
            </button>

            {/* 8. DBT Event */}
            <button
              onClick={handleDbtEvent}
              className="px-2.5 py-1.5 rounded-lg bg-blue-700/60 hover:bg-blue-600/70 text-white border border-blue-400/40 flex items-center gap-1.5 transition-colors"
              title="Direct Benefit Transfer: credit ₹24,000 to registered bank account via PFMS"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-300" />
              <span>8. DBT Event</span>
            </button>

            {/* Deterministic RESET DEMO */}
            <button
              onClick={handleResetDemo}
              className="px-2.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/70 text-red-200 border border-red-500/40 flex items-center gap-1 sm:ml-auto transition-colors font-semibold"
              title="RESET DEMO: deterministic reset of booking, queue, arrival, weighbridge, payment, notifications, and audit"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-300" />
              <span>RESET DEMO</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
