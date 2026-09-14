import React, { useState, useEffect } from 'react';
import { 
  AppRole, 
  LanguageCode, 
  FarmerProfile, 
  AgriToken, 
  ProcurementRecord, 
  DbtTransaction, 
  MachineryAsset, 
  QueueStatus 
} from './types';
import { AppHeader } from './components/AppHeader';
import { SihDemoBar } from './components/demo/SihDemoBar';
import { FarmerApp } from './components/farmer/FarmerApp';
import { SupervisorConsole } from './components/supervisor/SupervisorConsole';
import { SuperAdminConsole } from './components/superadmin/SuperAdminConsole';
import { SihEvaluationInspector } from './components/common/SihEvaluationInspector';
import { auditLogger } from './domain/auditLog';
import { 
  CURRENT_FARMER, 
  INITIAL_TOKENS, 
  INITIAL_PROCUREMENT, 
  DBT_TRANSACTIONS, 
  FLEET_ASSETS,
  TRANSLATIONS
} from './data/agriMockData';
import { playAudioChime } from './utils/speech';
import { TimeService } from './services/timeService';
import { notificationService } from './services/notificationService';
import { eventBus } from './services/eventBus';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<AppRole>('farmer');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [outdoorMode, setOutdoorMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);
  const [isVoiceMitraOpen, setIsVoiceMitraOpen] = useState<boolean>(false);
  const [isSihAuditOpen, setIsSihAuditOpen] = useState<boolean>(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | undefined>(undefined);

  // Global listener to jump into specific feature in SIH Tech Audit
  useEffect(() => {
    const handleOpenAudit = (e: Event) => {
      const customEvent = e as CustomEvent<{ featureId?: string }>;
      if (customEvent.detail?.featureId) {
        setSelectedAuditId(customEvent.detail.featureId);
      }
      setIsSihAuditOpen(true);
    };
    window.addEventListener('open-sih-audit', handleOpenAudit);
    return () => window.removeEventListener('open-sih-audit', handleOpenAudit);
  }, []);

  // Core synchronized application state
  const [farmer, setFarmer] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem('agriseva_farmer');
    return saved ? JSON.parse(saved) : CURRENT_FARMER;
  });

  const [tokens, setTokens] = useState<AgriToken[]>(() => {
    const saved = localStorage.getItem('agriseva_tokens');
    return saved ? JSON.parse(saved) : INITIAL_TOKENS;
  });

  const [procurementRecords, setProcurementRecords] = useState<ProcurementRecord[]>(() => {
    const saved = localStorage.getItem('agriseva_procurements');
    return saved ? JSON.parse(saved) : INITIAL_PROCUREMENT;
  });

  const [dbtTransactions, setDbtTransactions] = useState<DbtTransaction[]>(() => {
    const saved = localStorage.getItem('agriseva_dbt');
    return saved ? JSON.parse(saved) : DBT_TRANSACTIONS;
  });

  const [fleet, setFleet] = useState<MachineryAsset[]>(() => {
    const saved = localStorage.getItem('agriseva_fleet');
    return saved ? JSON.parse(saved) : FLEET_ASSETS;
  });

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('agriseva_farmer', JSON.stringify(farmer));
  }, [farmer]);

  useEffect(() => {
    localStorage.setItem('agriseva_tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('agriseva_procurements', JSON.stringify(procurementRecords));
  }, [procurementRecords]);

  useEffect(() => {
    localStorage.setItem('agriseva_dbt', JSON.stringify(dbtTransactions));
  }, [dbtTransactions]);

  useEffect(() => {
    localStorage.setItem('agriseva_fleet', JSON.stringify(fleet));
  }, [fleet]);

  // Apply outdoor contrast mode class to root HTML
  useEffect(() => {
    if (outdoorMode) {
      document.documentElement.classList.add('outdoor-contrast-mode');
    } else {
      document.documentElement.classList.remove('outdoor-contrast-mode');
    }
  }, [outdoorMode]);

  // Farmer creates a new booking
  const handleAddToken = (newToken: AgriToken) => {
    setTokens(prev => [newToken, ...prev]);
    auditLogger.log({
      action: 'BOOKING_CREATED',
      actorRole: 'FARMER',
      actorId: farmer.kisanId,
      targetEntity: 'AgriToken',
      targetId: newToken.id,
      description: `Created booking ${newToken.tokenNumber} for ${newToken.serviceType} at ${newToken.centreName}`,
      metadata: {
        tokenNumber: newToken.tokenNumber,
        centreId: newToken.centreId,
        serviceType: newToken.serviceType
      }
    });
  };

  // Supervisor token updates
  const handleUpdateTokenStatus = (tokenId: string, status: QueueStatus) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        return { ...t, status };
      }
      return t;
    }));
    auditLogger.log({
      action: 'STATUS_TRANSITION',
      actorRole: 'SUPERVISOR',
      actorId: 'SUP-WRD-01',
      targetEntity: 'AgriToken',
      targetId: tokenId,
      description: `Token status transitioned to ${status}`,
      metadata: { newStatus: status }
    });
  };

  const handleTogglePriority = (tokenId: string) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        return { ...t, priority: !t.priority };
      }
      return t;
    }));
  };

  const handleReassignCounter = (tokenId: string, counter: number) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        return { ...t, counterAssigned: counter };
      }
      return t;
    }));
  };

  const handleCallToken = (token: AgriToken) => {
    setTokens(prev => prev.map(t => {
      if (t.id === token.id) {
        return { ...t, status: 'Called', peopleAhead: 0, estimatedWaitMins: 0 };
      }
      return t;
    }));
    auditLogger.log({
      action: 'TOKEN_CALLED',
      actorRole: 'SUPERVISOR',
      actorId: 'SUP-WRD-01',
      targetEntity: 'AgriToken',
      targetId: token.id,
      description: `Called token ${token.tokenNumber} to counter #${token.counterAssigned}`
    });
  };

  // Supervisor records weighbridge inward & releases DBT advice
  const handleAddProcurement = (record: ProcurementRecord) => {
    setProcurementRecords(prev => [record, ...prev]);

    // Automatically generate corresponding DBT transaction in Farmer's passbook!
    const newDbt: DbtTransaction = {
      id: `DBT-${Date.now().toString().slice(-4)}`,
      scheme: `MSP ${record.cropName} Procurement`,
      amountInr: record.totalGrossPayable,
      status: 'Processing',
      utrNumber: record.utrNumber || `SBI${Date.now()}`,
      date: 'Today',
      bankMasked: farmer.bankAccount,
      description: `DBT advice generated by APMC Weighbridge Slip #${record.slipNumber}`,
      descriptionHi: `तौल पर्ची #${record.slipNumber} के आधार पर डीबीटी भुगतान सलाह जारी`
    };
    setDbtTransactions(prev => [newDbt, ...prev]);

    auditLogger.log({
      action: 'WEIGHBRIDGE_INWARD_RECORDED',
      actorRole: 'SUPERVISOR',
      actorId: 'SUP-WRD-01',
      targetEntity: 'ProcurementRecord',
      targetId: record.id,
      description: `Recorded weighbridge slip #${record.slipNumber} for ${record.cropName} (${record.netWeightQuintals} Q). Net payable: ₹${record.totalGrossPayable}`,
      metadata: {
        slipNumber: record.slipNumber,
        netWeightQuintals: record.netWeightQuintals,
        payableInr: record.totalGrossPayable
      }
    });
  };

  // Fleet management
  const handleDispatchAsset = (assetId: string, farmerName: string, village: string) => {
    setFleet(prev => prev.map(item => {
      if (item.id === assetId) {
        return {
          ...item,
          status: 'In-Field',
          acresCoveredToday: item.acresCoveredToday + 2.5
        };
      }
      return item;
    }));
  };

  const handleRecallAsset = (assetId: string) => {
    setFleet(prev => prev.map(item => {
      if (item.id === assetId) {
        return {
          ...item,
          status: 'Available'
        };
      }
      return item;
    }));
  };

  // Reset the entire demo environment to canonical initial baseline
  const handleResetAllState = () => {
    localStorage.removeItem('agriseva_farmer');
    localStorage.removeItem('agriseva_tokens');
    localStorage.removeItem('agriseva_procurements');
    localStorage.removeItem('agriseva_dbt');
    localStorage.removeItem('agriseva_fleet');
    setFarmer(CURRENT_FARMER);
    setTokens(INITIAL_TOKENS);
    setProcurementRecords(INITIAL_PROCUREMENT);
    setDbtTransactions(DBT_TRANSACTIONS);
    setFleet(FLEET_ASSETS);
    auditLogger.reset();
    notificationService.reset();
    TimeService.resetOffset();
    eventBus.publish('system.reset', {}, 'App');
  };

  // Get current active token for farmer
  const activeToken = tokens.find(t => t.kisanId === farmer.kisanId && t.status !== 'Completed') || tokens[0];

  return (
    <div className={`min-h-screen bg-[#F6F9F7] text-[#063B2A] transition-colors ${outdoorMode ? 'outdoor-contrast-mode' : ''}`}>
      {/* Universal Header with 3 Roles, Language Switcher, High Contrast, Offline Toggle */}
      <AppHeader
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        language={language}
        onLanguageChange={setLanguage}
        outdoorMode={outdoorMode}
        onToggleOutdoorMode={() => setOutdoorMode(prev => !prev)}
        isOffline={isOffline}
        onToggleOffline={() => {
          setIsOffline(prev => !prev);
          playAudioChime();
        }}
        mobileFrameMode={mobileFrameMode}
        onToggleMobileFrame={() => setMobileFrameMode(prev => !prev)}
        onOpenSihAudit={() => setIsSihAuditOpen(true)}
      />

      {/* Persistent SIH Evaluation Demo Scenario & Interactive Control Layer */}
      <SihDemoBar
        currentFarmer={farmer}
        activeToken={activeToken}
        allTokens={tokens}
        onSetFarmer={setFarmer}
        onUpdateTokens={setTokens}
        onAddProcurement={handleAddProcurement}
        onUpdateDbtTransactions={setDbtTransactions}
        onOpenSihAudit={(id) => {
          if (id) setSelectedAuditId(id);
          setIsSihAuditOpen(true);
        }}
        onResetAllState={handleResetAllState}
      />

      {/* Role-Based Primary Views */}
      <main className="w-full pb-16">
        {currentRole === 'farmer' && (
          <FarmerApp
            farmer={farmer}
            activeToken={activeToken}
            procurementRecords={procurementRecords}
            dbtTransactions={dbtTransactions}
            language={language}
            isOffline={isOffline}
            mobileFrameMode={mobileFrameMode}
            onAddToken={handleAddToken}
            onOpenVoiceMitra={() => setIsVoiceMitraOpen(true)}
            isVoiceMitraOpen={isVoiceMitraOpen}
            onCloseVoiceMitra={() => setIsVoiceMitraOpen(false)}
          />
        )}

        {currentRole === 'supervisor' && (
          <SupervisorConsole
            tokens={tokens}
            onUpdateTokenStatus={handleUpdateTokenStatus}
            onTogglePriority={handleTogglePriority}
            onReassignCounter={handleReassignCounter}
            onCallToken={handleCallToken}
            procurementRecords={procurementRecords}
            onAddProcurement={handleAddProcurement}
            fleet={fleet}
            onDispatchAsset={handleDispatchAsset}
            onRecallAsset={handleRecallAsset}
            language={language}
          />
        )}

        {currentRole === 'superadmin' && (
          <SuperAdminConsole
            language={language}
          />
        )}
      </main>

      {/* Persistent Floating SIH Technical Evaluation Pill (always accessible for jury evaluation) */}
      <aside aria-label="SIH Evaluation Quick Access" className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsSihAuditOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#063B2A] hover:bg-[#0B5D3B] text-white shadow-lg border border-emerald-500/40 text-xs font-bold transition-transform active:scale-95"
          title="Inspect SIH Technical Architecture: Implemented vs Integration-Ready Status"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span className="font-mono tracking-tight">SIH Tech Audit Matrix</span>
        </button>
      </aside>

      {/* SIH Technical Architecture Inspector Modal */}
      <SihEvaluationInspector 
        isOpen={isSihAuditOpen} 
        onClose={() => {
          setIsSihAuditOpen(false);
          setSelectedAuditId(undefined);
        }}
        initialSelectedId={selectedAuditId}
      />
    </div>
  );
}
