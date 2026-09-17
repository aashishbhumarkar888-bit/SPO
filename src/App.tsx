import React, { useState, useEffect } from 'react';
import { 
  AppRole, 
  LanguageCode, 
  FarmerProfile, 
  AgriToken, 
  ProcurementRecord, 
  DbtTransaction, 
  MachineryAsset, 
  QueueStatus,
  SupervisorSession,
  SuperAdminSession
} from './types';
import { AppHeader } from './components/AppHeader';
import { FarmerApp } from './components/farmer/FarmerApp';
import { SupervisorConsole } from './components/supervisor/SupervisorConsole';
import { SuperAdminConsole } from './components/superadmin/SuperAdminConsole';
import { SupervisorLoginModal } from './components/supervisor/SupervisorLoginModal';
import { SuperAdminLoginModal } from './components/superadmin/SuperAdminLoginModal';
import { FarmerLoginModal } from './components/farmer/FarmerLoginModal';
import { FarmerRegistrationModal } from './components/farmer/FarmerRegistrationModal';
import { KisanMitraVoiceModal } from './components/farmer/KisanMitraVoiceModal';
import { SihDemoConsoleModal } from './components/demo/SihDemoConsoleModal';
import { SihEvaluationInspector } from './components/common/SihEvaluationInspector';
import { PublicLandingGate } from './components/common/PublicLandingGate';
import { auditLogger } from './domain/auditLog';
import { 
  CURRENT_FARMER, 
  INITIAL_TOKENS, 
  INITIAL_PROCUREMENT, 
  DBT_TRANSACTIONS, 
  FLEET_ASSETS 
} from './data/agriMockData';
import { playAudioChime } from './utils/speech';
import { TimeService } from './services/timeService';
import { notificationService } from './services/notificationService';
import { eventBus } from './services/eventBus';
import { 
  initializeFirestoreData, 
  saveFarmerToFirestore, 
  saveTokenToFirestore,
  syncFarmerTokensFromFirestore
} from './services/firestoreDbService';
import { signOutFromFirebase } from './services/firebaseConfig';
import { KrishiGeminiAssistant } from './components/ai/KrishiGeminiAssistant';
import { ShieldCheck, PhoneCall, Building2, Lock, Sparkles, Volume2, Bot, MapPin } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<AppRole>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      if (roleParam === 'supervisor') {
        const sup = localStorage.getItem('spo_supervisor_session');
        if (sup) return 'supervisor';
      }
      if (roleParam === 'superadmin') {
        const sa = localStorage.getItem('spo_superadmin_session');
        if (sa) return 'superadmin';
      }
      const isFarmerActive = sessionStorage.getItem('spo_farmer_session_active') === 'true';
      const savedFarmer = localStorage.getItem('agriseva_farmer');
      if (savedFarmer && isFarmerActive) {
        return 'farmer';
      }
    } catch {
      // restricted environments
    }
    return 'landing';
  });
  const [language, setLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('agriseva_language');
      if (saved === 'hi' || saved === 'en' || saved === 'mr' || saved === 'pa') {
        return saved as LanguageCode;
      }
    } catch {
      // restricted environments
    }
    return 'hi';
  });

  useEffect(() => {
    try {
      localStorage.setItem('agriseva_language', language);
    } catch {
      // restricted environments
    }
  }, [language]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('agriseva_theme');
      if (saved === null || saved === undefined) {
        return 'light';
      }
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [outdoorMode, setOutdoorMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isVoiceMitraOpen, setIsVoiceMitraOpen] = useState<boolean>(false);
  const [isGeminiAssistantOpen, setIsGeminiAssistantOpen] = useState<boolean>(false);

  // Sync theme with document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('agriseva_theme', theme);
    } catch {
      // restricted environments
    }
  }, [theme]);

  // Authenticated operational sessions (Supervisor & Super Admin)
  const [supervisorSession, setSupervisorSession] = useState<SupervisorSession | null>(() => {
    try {
      const saved = localStorage.getItem('spo_supervisor_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [superAdminSession, setSuperAdminSession] = useState<SuperAdminSession | null>(() => {
    try {
      const saved = localStorage.getItem('spo_superadmin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (supervisorSession) {
      localStorage.setItem('spo_supervisor_session', JSON.stringify(supervisorSession));
    } else {
      localStorage.removeItem('spo_supervisor_session');
    }
  }, [supervisorSession]);

  useEffect(() => {
    if (superAdminSession) {
      localStorage.setItem('spo_superadmin_session', JSON.stringify(superAdminSession));
    } else {
      localStorage.removeItem('spo_superadmin_session');
    }
  }, [superAdminSession]);

  // Seed and verify Firebase Firestore database tables & collections
  useEffect(() => {
    initializeFirestoreData();
  }, []);

  // Security modals & Jury demo states
  const [isFarmerLoginModalOpen, setIsFarmerLoginModalOpen] = useState<boolean>(() => {
    try {
      const isFarmerActive = sessionStorage.getItem('spo_farmer_session_active') === 'true';
      const isSupActive = !!localStorage.getItem('spo_supervisor_session');
      const isSaActive = !!localStorage.getItem('spo_superadmin_session');
      // Prompt for login immediately at the beginning if no active authenticated session
      return !isFarmerActive && !isSupActive && !isSaActive;
    } catch {
      return true;
    }
  });
  const [isFarmerRegistrationModalOpen, setIsFarmerRegistrationModalOpen] = useState<boolean>(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState<boolean>(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState<boolean>(false);
  const [isSihDemoOpen, setIsSihDemoOpen] = useState<boolean>(false);
  const [isSihAuditOpen, setIsSihAuditOpen] = useState<boolean>(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | undefined>(undefined);

  // Authenticated session lifecycle handlers
  const handleFarmerLoginSuccess = (newFarmer: FarmerProfile) => {
    setFarmer(newFarmer);
    setIsFarmerLoginModalOpen(false);
    setCurrentRole('farmer');
    sessionStorage.setItem('spo_farmer_session_active', 'true');
    localStorage.setItem('agriseva_farmer', JSON.stringify(newFarmer));

    // Populate data for the active farmer session if currently empty
    setTokens(prev => {
      if (prev.length > 0) return prev;
      const farmerTokens = INITIAL_TOKENS.filter(t => t.kisanId === newFarmer.kisanId);
      return farmerTokens.length > 0 ? farmerTokens : [
        {
          ...INITIAL_TOKENS[0],
          id: `TOK-${Date.now().toString().slice(-4)}`,
          tokenNumber: `AS-${Math.floor(100 + Math.random() * 900)}`,
          kisanId: newFarmer.kisanId,
          farmerName: newFarmer.fullName,
          farmerPhone: newFarmer.phone
        }
      ];
    });

    setProcurementRecords(prev => {
      if (prev.length > 0) return prev;
      const records = INITIAL_PROCUREMENT.filter(p => p.kisanId === newFarmer.kisanId);
      return records.length > 0 ? records : INITIAL_PROCUREMENT.slice(0, 1);
    });

    setDbtTransactions(prev => {
      if (prev.length > 0) return prev;
      return DBT_TRANSACTIONS.slice(0, 2);
    });

    playAudioChime();
    auditLogger.log({
      action: 'FARMER_AUTHENTICATED',
      actorRole: 'FARMER',
      actorId: newFarmer.kisanId,
      targetEntity: 'FarmerProfile',
      targetId: newFarmer.id,
      description: `Farmer ${newFarmer.fullName} authenticated via multi-method login (${newFarmer.kisanId})`,
      metadata: {
        kisanId: newFarmer.kisanId,
        aadhaarMasked: `XXXX XXXX ${newFarmer.aadhaarLast4}`,
        phone: newFarmer.phone,
        email: newFarmer.email
      }
    });
    notificationService.send({
      type: 'GENERAL',
      title: language === 'hi' ? 'लॉगिन सफल' : 'Login Successful',
      titleHi: 'लॉगिन सफल',
      body: language === 'hi'
        ? `नमस्ते ${newFarmer.fullNameHi || newFarmer.fullName}! आप सफलतापूर्वक लॉगिन हो चुके हैं।`
        : `Welcome ${newFarmer.fullName}! You are securely logged in.`,
      bodyHi: `नमस्ते ${newFarmer.fullNameHi || newFarmer.fullName}! आप सफलतापूर्वक लॉगिन हो चुके हैं।`,
      channel: 'APP'
    });
  };

  const handleSupervisorLoginSuccess = (session: SupervisorSession) => {
    setSupervisorSession(session);
    setIsSupervisorModalOpen(false);
    setCurrentRole('supervisor');
    playAudioChime();
  };

  const handleSupervisorLogout = () => {
    sessionStorage.clear();
    if (supervisorSession) {
      auditLogger.log({
        action: 'SUPERVISOR_LOGGED_OUT',
        actorRole: 'SUPERVISOR',
        actorId: supervisorSession.supervisorId,
        targetEntity: 'Session',
        targetId: supervisorSession.terminalId,
        description: `Supervisor ${supervisorSession.officerName} cleanly terminated station session and purged session storage`
      });
    }
    setSupervisorSession(null);
    setCurrentRole('landing');
    playAudioChime();
  };

  const handleSuperAdminLoginSuccess = (session: SuperAdminSession) => {
    setSuperAdminSession(session);
    setIsSuperAdminModalOpen(false);
    setCurrentRole('superadmin');
    playAudioChime();
  };

  const handleSuperAdminLogout = () => {
    sessionStorage.clear();
    if (superAdminSession) {
      auditLogger.log({
        action: 'SUPER_ADMIN_LOGGED_OUT',
        actorRole: 'SUPER_ADMIN',
        actorId: superAdminSession.adminId,
        targetEntity: 'GovernancePortal',
        targetId: superAdminSession.gatewaySessionId,
        description: `Administrator ${superAdminSession.adminName} cleanly terminated governance session and purged session storage`
      });
    }
    setSuperAdminSession(null);
    setCurrentRole('landing');
    playAudioChime();
  };

  const handleFarmerClearSessionAndLogout = () => {
    signOutFromFirebase().catch(() => {});
    sessionStorage.clear();
    localStorage.removeItem('spo_supervisor_session');
    localStorage.removeItem('spo_superadmin_session');
    localStorage.removeItem('agriseva_farmer');
    localStorage.removeItem('agriseva_tokens');
    localStorage.removeItem('agriseva_procurements');
    localStorage.removeItem('agriseva_dbt');
    const farmerName = farmer?.fullName || 'Farmer';
    const kisanId = farmer?.kisanId || 'GUEST';
    setFarmer(null);
    setTokens([]);
    setProcurementRecords([]);
    setDbtTransactions([]);
    setSupervisorSession(null);
    setSuperAdminSession(null);
    setCurrentRole('landing');
    setIsFarmerLoginModalOpen(true);
    playAudioChime();
    auditLogger.log({
      action: 'FARMER_SESSION_PURGED',
      actorRole: 'FARMER',
      actorId: kisanId,
      targetEntity: 'SessionStorage',
      targetId: 'CLIENT_CACHE',
      description: `Farmer ${farmerName} cleanly purged session storage and reset operational cache`
    });
    notificationService.send({
      type: 'GENERAL',
      title: language === 'hi' ? 'सत्र साफ़ किया गया' : 'Session Purged & Cleared',
      titleHi: 'सत्र साफ़ किया गया',
      body: language === 'hi' ? 'सक्रिय सत्र और संवेदनशील परिचालन डेटा सुरक्षित रूप से साफ़ कर दिए गए हैं।' : 'Session storage and sensitive operational cache cleared.',
      bodyHi: 'सक्रिय सत्र और संवेदनशील परिचालन डेटा सुरक्षित रूप से साफ़ कर दिए गए हैं।',
      channel: 'APP'
    });
  };

  // Global keyboard shortcuts:
  // - CTRL+SHIFT+A / CMD+SHIFT+A: Opens Supervisor Operations Terminal (authenticates if needed)
  // - CTRL+SHIFT+S / CMD+SHIFT+S: Opens Strategic Super Admin Console (authenticates if needed)
  // - CTRL+SHIFT+D / CMD+SHIFT+D: Opens SIH Demo Simulation Drawer for Jury
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'A' || e.key === 'a') {
          e.preventDefault();
          if (supervisorSession) {
            setCurrentRole('supervisor');
          } else {
            setIsSupervisorModalOpen(true);
          }
        } else if (e.key === 'S' || e.key === 's') {
          e.preventDefault();
          if (superAdminSession) {
            setCurrentRole('superadmin');
          } else {
            setIsSuperAdminModalOpen(true);
          }
        } else if (e.key === 'D' || e.key === 'd') {
          e.preventDefault();
          setIsSihDemoOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [supervisorSession, superAdminSession]);

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

  // Check URL params for deep-link / jury access (e.g. ?role=supervisor or ?role=superadmin or ?demo=1)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      if (roleParam === 'supervisor') {
        if (supervisorSession) {
          setCurrentRole('supervisor');
        } else {
          setIsSupervisorModalOpen(true);
        }
      } else if (roleParam === 'superadmin') {
        if (superAdminSession) {
          setCurrentRole('superadmin');
        } else {
          setIsSuperAdminModalOpen(true);
        }
      }
      if (params.get('demo') === 'true' || params.get('demo') === '1') {
        setIsSihDemoOpen(true);
      }
    } catch {
      // Ignore if URLSearchParams not accessible
    }
  }, [supervisorSession, superAdminSession]);

  // Core synchronized application state
  const [farmer, setFarmer] = useState<FarmerProfile | null>(() => {
    try {
      const isFarmerActive = sessionStorage.getItem('spo_farmer_session_active') === 'true';
      if (!isFarmerActive) return null;
      const saved = localStorage.getItem('agriseva_farmer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tokens, setTokens] = useState<AgriToken[]>(() => {
    try {
      const isFarmerActive = sessionStorage.getItem('spo_farmer_session_active') === 'true';
      const isStaffActive = !!localStorage.getItem('spo_supervisor_session') || !!localStorage.getItem('spo_superadmin_session');
      const saved = localStorage.getItem('agriseva_tokens');
      if (saved) return JSON.parse(saved);
      if (isFarmerActive || isStaffActive) return INITIAL_TOKENS;
      return [];
    } catch {
      return [];
    }
  });

  const [procurementRecords, setProcurementRecords] = useState<ProcurementRecord[]>(() => {
    try {
      const isFarmerActive = sessionStorage.getItem('spo_farmer_session_active') === 'true';
      const isStaffActive = !!localStorage.getItem('spo_supervisor_session') || !!localStorage.getItem('spo_superadmin_session');
      const saved = localStorage.getItem('agriseva_procurements');
      if (saved) return JSON.parse(saved);
      if (isFarmerActive || isStaffActive) return INITIAL_PROCUREMENT;
      return [];
    } catch {
      return [];
    }
  });

  const [dbtTransactions, setDbtTransactions] = useState<DbtTransaction[]>(() => {
    try {
      const isFarmerActive = sessionStorage.getItem('spo_farmer_session_active') === 'true';
      const isStaffActive = !!localStorage.getItem('spo_supervisor_session') || !!localStorage.getItem('spo_superadmin_session');
      const saved = localStorage.getItem('agriseva_dbt');
      if (saved) return JSON.parse(saved);
      if (isFarmerActive || isStaffActive) return DBT_TRANSACTIONS;
      return [];
    } catch {
      return [];
    }
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

  // Real-time Firestore sync for tokens belonging to the authenticated farmer
  useEffect(() => {
    if (farmer && farmer.id) {
      const unsubscribe = syncFarmerTokensFromFirestore(farmer.id, (firestoreTokens) => {
        if (firestoreTokens && firestoreTokens.length > 0) {
          setTokens(firestoreTokens);
        }
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [farmer?.id]);

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
    saveTokenToFirestore(newToken);
    auditLogger.log({
      action: 'BOOKING_CREATED',
      actorRole: 'FARMER',
      actorId: farmer?.kisanId || newToken.kisanId,
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
      bankMasked: farmer?.bankAccount || 'XXXX-XXXX-8921',
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
  const activeToken = farmer
    ? (tokens.find(t => t.kisanId === farmer.kisanId && t.status !== 'Completed') || tokens.find(t => t.kisanId === farmer.kisanId))
    : undefined;

  return (
    <div className={`min-h-screen bg-[#F4F7F5] dark:bg-[#071711] text-[#063B2A] dark:text-[#F0FAF5] flex flex-col transition-colors duration-200 ${outdoorMode ? 'outdoor-contrast-mode' : ''}`}>
      {/* Public Header (Strictly Farmer/Citizen-focused, no role switcher) */}
      <AppHeader
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        outdoorMode={outdoorMode}
        onToggleOutdoorMode={() => setOutdoorMode(prev => !prev)}
        isOffline={isOffline}
        onToggleOffline={() => {
          setIsOffline(prev => !prev);
          playAudioChime();
        }}
        onOpenFarmerLogin={() => setIsFarmerLoginModalOpen(true)}
        onOpenSupervisorLogin={() => setIsSupervisorModalOpen(true)}
        onOpenSuperAdminLogin={() => setIsSuperAdminModalOpen(true)}
        farmerName={farmer ? farmer.fullName : undefined}
        currentRole={currentRole}
        onGoToLanding={() => setCurrentRole('landing')}
        onLogoutCurrentRole={() => {
          if (currentRole === 'supervisor') handleSupervisorLogout();
          else if (currentRole === 'superadmin') handleSuperAdminLogout();
          else if (currentRole === 'farmer') handleFarmerClearSessionAndLogout();
        }}
      />

      {/* Main Viewport Container: Switches based on authenticated role */}
      <div className="flex-1 w-full">
        {currentRole === 'landing' && (
          <PublicLandingGate
            language={language}
            onOpenFarmerLogin={() => setIsFarmerLoginModalOpen(true)}
            onOpenSupervisorLogin={() => setIsSupervisorModalOpen(true)}
            onOpenSuperAdminLogin={() => setIsSuperAdminModalOpen(true)}
            onOpenDemoDrawer={() => setIsSihDemoOpen(true)}
            onOpenRegistration={() => setIsFarmerRegistrationModalOpen(true)}
            onOpenVoiceMitra={() => setIsVoiceMitraOpen(true)}
            onLoginSuccess={handleFarmerLoginSuccess}
          />
        )}

        {currentRole === 'farmer' && farmer ? (
          <FarmerApp
            farmer={farmer}
            activeToken={activeToken}
            procurementRecords={procurementRecords}
            dbtTransactions={dbtTransactions}
            language={language}
            isOffline={isOffline}
            onAddToken={handleAddToken}
            onOpenVoiceMitra={() => setIsVoiceMitraOpen(true)}
            isVoiceMitraOpen={isVoiceMitraOpen}
            onCloseVoiceMitra={() => setIsVoiceMitraOpen(false)}
            onClearSessionAndLogout={handleFarmerClearSessionAndLogout}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            outdoorMode={outdoorMode}
            onToggleOutdoorMode={() => setOutdoorMode(prev => !prev)}
            onLanguageChange={setLanguage}
            onOpenLogin={() => setIsFarmerLoginModalOpen(true)}
          />
        ) : currentRole === 'farmer' ? (
          <PublicLandingGate
            language={language}
            onOpenFarmerLogin={() => setIsFarmerLoginModalOpen(true)}
            onOpenSupervisorLogin={() => setIsSupervisorModalOpen(true)}
            onOpenSuperAdminLogin={() => setIsSuperAdminModalOpen(true)}
            onOpenDemoDrawer={() => setIsSihDemoOpen(true)}
            onOpenRegistration={() => setIsFarmerRegistrationModalOpen(true)}
            onOpenVoiceMitra={() => setIsVoiceMitraOpen(true)}
            onOpenGeminiAssistant={() => setIsGeminiAssistantOpen(true)}
            onLoginSuccess={handleFarmerLoginSuccess}
          />
        ) : null}

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
            onBulkUpdateTokens={setTokens}
            language={language}
            onExit={handleSupervisorLogout}
            session={supervisorSession}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            onLanguageChange={setLanguage}
          />
        )}

        {currentRole === 'superadmin' && (
          <SuperAdminConsole
            language={language}
            onExit={handleSuperAdminLogout}
            session={superAdminSession}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            onLanguageChange={setLanguage}
          />
        )}
      </div>

      {/* Official Government Footer (Rendered in public mode across all screen sizes) */}
      {(currentRole === 'farmer' || currentRole === 'landing') && (
        <footer className="bg-[#063B2A] dark:bg-[#081B13] text-white border-t border-[#0B5D3B] dark:border-[#153A2C] py-6 px-4 sm:px-6 mt-auto transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
            <div className="text-center sm:text-left">
              <p className="font-bold text-white text-sm">
                SPO — Smart Procurement Orchestration
              </p>
              <p className="mt-0.5 text-xs text-[#DDF4E9]/80">
                Department of Agriculture & Farmers Welfare • Ministry of Agriculture & Farmers Welfare, Govt. of India
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-xs">
              <a href="tel:18001801551" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Kisan Helpline: 1800-180-1551</span>
              </a>

              <span>•</span>

              {/* Discreet Jury / Evaluator Demo Trigger */}
              <button
                onClick={() => setIsSihDemoOpen(true)}
                className="text-white/80 hover:text-amber-300 font-mono transition-colors underline decoration-dotted font-semibold"
                title="Open Controlled SIH Jury Demonstration Drawer (or press Ctrl+Shift+D)"
              >
                SIH Jury Console [Demo Simulation]
              </button>

              <span>•</span>

              {/* Discreet Technical Audit Matrix Link */}
              <button
                onClick={() => setIsSihAuditOpen(true)}
                className="text-white/80 hover:text-emerald-300 font-mono transition-colors underline decoration-dotted font-semibold"
                title="Inspect SIH Technical Architecture: Implemented vs Integration-Ready Status"
              >
                SIH Tech Audit Matrix
              </button>

              <span>•</span>

              {/* Discreet Supervisor Login Link */}
              <button
                onClick={() => {
                  if (supervisorSession) {
                    setCurrentRole('supervisor');
                  } else {
                    setIsSupervisorModalOpen(true);
                  }
                }}
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1 font-semibold"
                title="Authorized Mandi Board Personnel Login (or press Ctrl+Shift+A)"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Operator Login</span>
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Farmer Multi-Method Authentication Modal (Aadhaar, Mobile, Email, or QR) */}
      <FarmerLoginModal
        isOpen={isFarmerLoginModalOpen}
        onClose={() => setIsFarmerLoginModalOpen(false)}
        onLoginSuccess={handleFarmerLoginSuccess}
        language={language}
        currentFarmer={farmer}
        onOpenRegistration={() => {
          setIsFarmerLoginModalOpen(false);
          setIsFarmerRegistrationModalOpen(true);
        }}
      />

      {/* Farmer Self-Service Registration Modal (New Users) */}
      <FarmerRegistrationModal
        isOpen={isFarmerRegistrationModalOpen}
        onClose={() => setIsFarmerRegistrationModalOpen(false)}
        language={language}
        onRegistrationSuccess={(newFarmer) => {
          setIsFarmerRegistrationModalOpen(false);
          handleFarmerLoginSuccess(newFarmer);
        }}
      />

      {/* Universal Kisan Mitra Voice Assistant Modal (Visible & Accessible for everyone) */}
      <KisanMitraVoiceModal
        isOpen={isVoiceMitraOpen}
        onClose={() => setIsVoiceMitraOpen(false)}
        language={language}
        activeToken={activeToken}
        farmer={farmer || undefined}
        recentProcurement={procurementRecords[0]}
        recentDbt={dbtTransactions[0]}
      />

      {/* Floating Universal AI Assistant Buttons (Always visible on all screens) */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex items-center gap-2.5">
        {!isGeminiAssistantOpen && (
          <button
            type="button"
            onClick={() => setIsGeminiAssistantOpen(true)}
            title="Ask Krishi Sahayak AI (कृषि सहायक AI - Gemini & Maps)"
            className="h-12 sm:h-14 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-2xl flex items-center gap-2 transition-all active:scale-95 border-2 border-white dark:border-[#0E241C] ring-4 ring-emerald-500/20 cursor-pointer"
          >
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold font-serif-display hidden sm:inline">
              {language === 'hi' ? 'कृषि सहायक AI' : 'Krishi Sahayak AI'}
            </span>
          </button>
        )}

        {!isVoiceMitraOpen && (
          <button
            type="button"
            onClick={() => setIsVoiceMitraOpen(true)}
            title="Talk with Kisan Mitra (किसान मित्र आवाज)"
            className="h-12 sm:h-14 px-3.5 sm:px-4 rounded-full bg-[#168A5B] hover:bg-[#12734C] text-white shadow-2xl flex items-center gap-2 transition-all active:scale-95 border-2 border-white dark:border-[#0E241C] ring-4 ring-[#168A5B]/20 cursor-pointer"
          >
            <div className="relative flex items-center">
              <Volume2 className="w-5 h-5 text-amber-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#083324]" />
            </div>
            <span className="text-xs font-bold font-serif-display hidden sm:inline">
              {language === 'hi' ? 'किसान आवाज' : 'Voice AI'}
            </span>
          </button>
        )}
      </div>

      {/* Gemini Krishi Assistant & Google Maps Grounded Mandi Locator Modal */}
      <KrishiGeminiAssistant
        isOpen={isGeminiAssistantOpen}
        onClose={() => setIsGeminiAssistantOpen(false)}
        language={language}
        defaultLocation={farmer?.district ? `${farmer.district}, Maharashtra` : 'Wardha, Maharashtra'}
      />

      {/* Supervisor Secure Authentication Modal (Triggered by Ctrl+Shift+A or Operator Login) */}
      <SupervisorLoginModal
        isOpen={isSupervisorModalOpen}
        onClose={() => setIsSupervisorModalOpen(false)}
        onLoginSuccess={handleSupervisorLoginSuccess}
      />

      {/* Super Admin Secure Authentication Modal (Triggered by Ctrl+Shift+S) */}
      <SuperAdminLoginModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
        onLoginSuccess={handleSuperAdminLoginSuccess}
      />

      {/* Controlled SIH Jury Demonstration Console Drawer (Triggered by Ctrl+Shift+D or Footer Link) */}
      <SihDemoConsoleModal
        isOpen={isSihDemoOpen}
        onClose={() => setIsSihDemoOpen(false)}
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
