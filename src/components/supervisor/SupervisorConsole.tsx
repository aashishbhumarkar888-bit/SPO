import React, { useState } from 'react';
import { 
  Users, 
  Scale, 
  Tractor, 
  BarChart3, 
  Volume2, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Send, 
  FileSpreadsheet, 
  Radio, 
  BatteryMedium, 
  Fuel, 
  Sparkles,
  PhoneCall,
  Flame,
  FileCheck,
  User,
  LogOut,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import { 
  AgriToken, 
  ProcurementRecord, 
  MachineryAsset, 
  LanguageCode, 
  QueueStatus,
  SupervisorSession 
} from '../../types';
import { playAudioChime, speakAnnouncement, announceTokenCall } from '../../utils/speech';
import { IntegrationBadge } from '../common/IntegrationBadge';
import { SupervisorQuickReport } from './SupervisorQuickReport';
import { SupervisorDocumentWorkflow } from './SupervisorDocumentWorkflow';
import { SupervisorProfileTab } from './SupervisorProfileTab';
import { AdminFarmerRegistryTab } from '../common/AdminFarmerRegistryTab';
import { DynamicExcelDashboard } from '../common/DynamicExcelDashboard';
import { MlQueueRebalancerModal } from './MlQueueRebalancerModal';
import { Cpu } from 'lucide-react';

interface SupervisorConsoleProps {
  tokens: AgriToken[];
  onUpdateTokenStatus: (tokenId: string, status: QueueStatus) => void;
  onTogglePriority: (tokenId: string) => void;
  onReassignCounter: (tokenId: string, counter: number) => void;
  onCallToken: (token: AgriToken) => void;
  procurementRecords: ProcurementRecord[];
  onAddProcurement: (record: ProcurementRecord) => void;
  fleet: MachineryAsset[];
  onDispatchAsset: (assetId: string, farmerName: string, village: string) => void;
  onRecallAsset: (assetId: string) => void;
  onBulkUpdateTokens?: (tokens: AgriToken[]) => void;
  language: LanguageCode;
  onExit?: () => void;
  session?: SupervisorSession | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const SupervisorConsole: React.FC<SupervisorConsoleProps> = ({
  tokens,
  onUpdateTokenStatus,
  onTogglePriority,
  onReassignCounter,
  onCallToken,
  procurementRecords,
  onAddProcurement,
  fleet,
  onDispatchAsset,
  onRecallAsset,
  onBulkUpdateTokens,
  language,
  onExit,
  session,
  theme,
  onToggleTheme,
  onLanguageChange
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'weighbridge' | 'excel-dashboard' | 'fleet' | 'farmers' | 'reports' | 'profile'>('queue');
  const [isMlModalOpen, setIsMlModalOpen] = useState(false);
  const [weighbridgeMode, setWeighbridgeMode] = useState<'document' | 'scale'>('document');
  const [counterFilter, setCounterFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Weighbridge terminal form state
  const [newGross, setNewGross] = useState<number>(45.8);
  const [newTare, setNewTare] = useState<number>(6.2);
  const [newMoisture, setNewMoisture] = useState<number>(11.4);
  const [newCrop, setNewCrop] = useState<string>('Soyabean (Yellow)');
  const [newFarmerName, setNewFarmerName] = useState<string>('Rameshwar Patil');
  const [newKisanId, setNewKisanId] = useState<string>('MH-WRD-8921');
  const [weighbridgeSuccessMsg, setWeighbridgeSuccessMsg] = useState<string | null>(null);

  // Dispatch modal state
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MachineryAsset | null>(null);
  const [dispatchFarmer, setDispatchFarmer] = useState('');
  const [dispatchVillage, setDispatchVillage] = useState('Sevagram Sector-1');

  // Calculated weights
  const netWeight = Math.max(0, Number((newGross - newTare).toFixed(2)));
  const mspRate = newCrop.includes('Soyabean') ? 4892 : (newCrop.includes('Cotton') ? 7121 : 2275);
  const isFaqGradeA = newMoisture <= 12.0;
  const moistureDeduction = isFaqGradeA ? 0 : Math.round((newMoisture - 12.0) * (mspRate * 0.01) * netWeight);
  const grossPayable = Math.max(0, Math.round(netWeight * mspRate - moistureDeduction));

  const handleCallNextFarmer = (tok: AgriToken) => {
    playAudioChime();
    onCallToken(tok);
    announceTokenCall(tok.tokenNumber, tok.counterAssigned, tok.farmerName);
  };

  const handleRecordWeighbridge = () => {
    playAudioChime();
    const newRecord: ProcurementRecord = {
      id: `PROC-${Date.now().toString().slice(-4)}`,
      tokenId: `TOK-${Date.now().toString().slice(-3)}`,
      slipNumber: `MND-2026-${Math.floor(Date.now() % 1000)}`,
      farmerName: newFarmerName,
      farmerNameHi: newFarmerName,
      kisanId: newKisanId,
      cropName: newCrop,
      cropNameHi: newCrop,
      grossWeightQuintals: newGross,
      tareWeightQuintals: newTare,
      netWeightQuintals: netWeight,
      moisturePercentage: newMoisture,
      foreignMatterPercentage: 0.9,
      qualityGrade: isFaqGradeA ? 'FAQ Grade A' : 'Grade B',
      mspPerQuintal: mspRate,
      totalGrossPayable: grossPayable,
      dbtStatus: 'Advice Generated',
      utrNumber: `SBI${crypto.randomUUID().replace(/-/g, '').substring(0, 11).toUpperCase()}`,
      timestamp: 'Just now'
    };

    onAddProcurement(newRecord);
    setWeighbridgeSuccessMsg(`Weighbridge Entry Saved! Slip #${newRecord.slipNumber} created with Net Weight ${netWeight} Qtl. Total Statutory DBT Advice: ₹${grossPayable.toLocaleString('en-IN')}`);
    setTimeout(() => setWeighbridgeSuccessMsg(null), 7000);
  };

  const handleExportCsvManifest = () => {
    playAudioChime();
    const headers = ['Slip Number', 'Token ID', 'Kisan ID', 'Farmer Name', 'Crop Name', 'Net Weight (Qtl)', 'Gross Weight (Qtl)', 'Tare Weight (Qtl)', 'Moisture %', 'Grade', 'MSP Rate (INR)', 'Payable Amount (INR)', 'DBT Status', 'UTR Number', 'Timestamp'];
    const rows = procurementRecords.map(r => [
      `"${r.slipNumber}"`,
      `"${r.tokenId}"`,
      `"${r.kisanId}"`,
      `"${r.farmerName}"`,
      `"${r.cropName}"`,
      r.netWeightQuintals,
      r.grossWeightQuintals || (r.netWeightQuintals + 5),
      r.tareWeightQuintals || 5,
      r.moisturePercentage,
      `"${r.qualityGrade}"`,
      r.mspPerQuintal,
      r.totalGrossPayable,
      `"${r.dbtStatus}"`,
      `"${r.utrNumber || 'PENDING'}"`,
      `"${r.timestamp}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `APMC_Wardha_Daily_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTokens = tokens.filter(t => {
    if (counterFilter !== 'all' && t.counterAssigned !== counterFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.tokenNumber.toLowerCase().includes(q) ||
        t.farmerName.toLowerCase().includes(q) ||
        t.kisanId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Official Terminal Header */}
      <div className="bg-[#063B2A] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#0B5D3B] shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF4E9]">
              Official Operations Terminal • Kendra Console
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-display text-white">
            Wardha APMC Central Procurement Hub
          </h2>
          <p className="text-xs text-white/70 mt-0.5">
            Operator: <strong>{session?.officerName || 'D. S. Kulkarni'}</strong> ({session?.supervisorId || 'SUP-WRD-01'}) • Station: {session?.terminalId || 'TERM-04'} • Shift Active
          </p>
        </div>

        {onExit && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-300" />
              <span>Station Profile</span>
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2 text-xs font-bold bg-red-600/80 hover:bg-red-600 text-white rounded-xl border border-red-500/50 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
              title="Lock Terminal and Return to Public Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Exit</span>
            </button>
          </div>
        )}
      </div>

      {/* Supervisor Top Operational Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="editorial-card rounded-2xl p-4 border border-[#D7E3DC] bg-white">
          <div className="flex items-center justify-between text-xs text-[#063B2A]/60 font-medium">
            <span>Live Tokens in Kendra</span>
            <Users className="w-4 h-4 text-[#168A5B]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono-numbers text-[#063B2A]">
              {tokens.filter(t => t.status !== 'Completed').length}
            </span>
            <span className="text-xs text-amber-700 font-semibold">Active Queue</span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-4 border border-[#D7E3DC] bg-white">
          <div className="flex items-center justify-between text-xs text-[#063B2A]/60 font-medium">
            <span>Weighbridge Inward Today</span>
            <Scale className="w-4 h-4 text-[#D99121]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono-numbers text-[#063B2A]">
              {procurementRecords.reduce((acc, r) => acc + r.netWeightQuintals, 0).toFixed(1)}
            </span>
            <span className="text-xs text-[#063B2A]/70">Quintals</span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-4 border border-[#D7E3DC] bg-white">
          <div className="flex items-center justify-between text-xs text-[#063B2A]/60 font-medium">
            <span>Fleet Deployed in Fields</span>
            <Tractor className="w-4 h-4 text-[#2878C8]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono-numbers text-[#063B2A]">
              {fleet.filter(f => f.status === 'In-Field' || f.status === 'Dispatched').length}/{fleet.length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Units Out</span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-4 border border-[#D7E3DC] bg-white">
          <div className="flex items-center justify-between text-xs text-[#063B2A]/60 font-medium">
            <span>DBT Advice Generated</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2 flex-wrap">
            <span className="text-2xl font-bold font-mono-numbers text-[#0B5D3B]">
              ₹{(procurementRecords.reduce((acc, r) => acc + r.totalGrossPayable, 0) / 100000).toFixed(1)}L
            </span>
            <span className="text-xs text-emerald-700 font-semibold">PFMS Ready</span>
            <IntegrationBadge status="INTEGRATION-READY" spec="PFMS" featureName="DBT Advice" featureId="AUD-06" />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D7E3DC] pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-[#F0F5F2] rounded-xl border border-[#D7E3DC]">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'queue'
                ? 'bg-[#168A5B] text-white shadow-xs'
                : 'text-[#063B2A]/70 hover:text-[#063B2A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Live Queue & Counters</span>
          </button>

          <button
            onClick={() => setActiveTab('weighbridge')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'weighbridge'
                ? 'bg-[#168A5B] text-white shadow-xs'
                : 'text-[#063B2A]/70 hover:text-[#063B2A]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Weighbridge & Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('excel-dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'excel-dashboard'
                ? 'bg-[#0B5D3B] text-white shadow-xs'
                : 'text-[#063B2A]/70 hover:text-[#063B2A]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'hi' ? 'एक्सेल ऑटो-डैशबोर्ड' : 'Dynamic Excel BI'}</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'fleet'
                ? 'bg-[#168A5B] text-white shadow-xs'
                : 'text-[#063B2A]/70 hover:text-[#063B2A]'
            }`}
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>Machinery Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-[#168A5B] text-white shadow-xs'
                : 'text-[#063B2A]/70 hover:text-[#063B2A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Pacing & Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('farmers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'farmers'
                ? 'bg-[#168A5B] text-white shadow-xs'
                : 'text-[#063B2A]/70 hover:text-[#063B2A]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'किसान डायरेक्टरी' : 'Farmer Registry'}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#168A5B] text-white shadow-xs'
                : 'text-[#063B2A]/70 hover:text-[#063B2A]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Terminal</span>
          </button>
        </div>

        <span className="text-xs text-[#063B2A]/70 font-semibold">
          Supervisor: <strong>{session?.officerName || 'D. S. Kulkarni'} ({session?.centreId || 'Wardha Hub'})</strong>
        </span>
      </div>

      {/* TAB 1: Live Queue & Multi-Counter Management */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-white border border-[#D7E3DC] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#063B2A] uppercase tracking-wider">
                Counter Dispatch & Priority Management
              </span>
              <IntegrationBadge status="SYNCED" spec="Local PWA" featureName="Queue Sync" featureId="AUD-05" />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMlModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Run Python + Pandas + Scikit-Learn Dynamic Queue Rebalancer"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'hi' ? 'एआई कतार संतुलन (Python ML)' : 'AI Queue Rebalancer (ML)'}</span>
              </button>
              <span className="text-xs text-[#063B2A]/70 hidden sm:inline">
                Active Kendra: Wardha Central APMC • 4 Counters Active
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#D7E3DC]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search token, farmer name, Kisan ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-[#063B2A]/70 flex-shrink-0">Counter:</span>
              {['all', 1, 2, 3, 4].map((c) => (
                <button
                  key={c}
                  onClick={() => setCounterFilter(c as number | 'all')}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                    counterFilter === c
                      ? 'bg-[#0B5D3B] text-white'
                      : 'bg-[#F0F5F2] text-[#063B2A] hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? 'All (1-4)' : `Counter ${c}`}
                </button>
              ))}
            </div>
          </div>

          {/* Tokens Operational Roster Table */}
          <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#063B2A]">
                <thead className="bg-[#F0F5F2] text-[#063B2A]/80 font-bold border-b border-[#D7E3DC] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Token / Priority</th>
                    <th className="py-3 px-4">Farmer Details</th>
                    <th className="py-3 px-4">Service Category</th>
                    <th className="py-3 px-4">Assigned Counter</th>
                    <th className="py-3 px-4">Wait & Pacing</th>
                    <th className="py-3 px-4">Live Status</th>
                    <th className="py-3 px-4 text-right">Officer Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4EBE6]">
                  {filteredTokens.map((tok) => (
                    <tr 
                      key={tok.id} 
                      className={`hover:bg-[#F6F9F7] transition-colors ${
                        tok.status === 'Called' ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      {/* Token Number & Priority Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onTogglePriority(tok.id)}
                            title={tok.priority ? "High priority flagged" : "Flag priority"}
                            className={`p-1 rounded transition-colors ${
                              tok.priority ? 'text-red-600 bg-red-100' : 'text-slate-300 hover:text-red-400'
                            }`}
                          >
                            <Flame className="w-4 h-4" />
                          </button>
                          <span className="font-mono-numbers font-bold text-sm text-[#063B2A]">
                            {tok.tokenNumber}
                          </span>
                        </div>
                      </td>

                      {/* Farmer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#063B2A]">{tok.farmerName}</div>
                        <div className="text-[11px] text-[#063B2A]/60 font-mono">{tok.kisanId} • {tok.farmerPhone}</div>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#DDF4E9] text-[#0B5D3B]">
                          {tok.serviceType}
                        </span>
                      </td>

                      {/* Assigned Counter selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={tok.counterAssigned}
                          onChange={(e) => onReassignCounter(tok.id, Number(e.target.value))}
                          className="px-2 py-1 bg-[#F6F9F7] border border-[#D7E3DC] rounded-lg text-xs font-bold text-[#063B2A]"
                        >
                          <option value={1}>Counter 1 (Machinery)</option>
                          <option value={2}>Counter 2 (Mandi Weigh)</option>
                          <option value={3}>Counter 3 (Fertiliser)</option>
                          <option value={4}>Counter 4 (Soil Lab)</option>
                        </select>
                      </td>

                      {/* Wait & Turn */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-xs block">~{tok.estimatedWaitMins} mins</span>
                        <span className="text-[10px] text-slate-500">{tok.peopleAhead} ahead</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          tok.status === 'Called'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : tok.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tok.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleCallNextFarmer(tok)}
                          className="px-3 py-1.5 rounded-lg bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                          title="Call Farmer (Voice chime + Public Address)"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Call Next</span>
                        </button>

                        <button
                          onClick={() => onUpdateTokenStatus(tok.id, 'Completed')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold"
                          title="Mark Completed"
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Digital Weighbridge & Moisture Analysis Terminal */}
      {activeTab === 'weighbridge' && (
        <div className="space-y-4">
          {/* Sub-mode selector: Verified Document Workflow vs Manual Weighbridge Scale Input */}
          <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#D7E3DC] flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#063B2A] uppercase tracking-wider">
                Inward Processing Channel:
              </span>
              <div className="flex items-center gap-1.5 bg-[#F0F5F2] p-1 rounded-xl border border-[#D7E3DC]">
                <button
                  onClick={() => setWeighbridgeMode('document')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    weighbridgeMode === 'document'
                      ? 'bg-[#168A5B] text-white shadow-xs'
                      : 'text-[#063B2A]/70 hover:text-[#063B2A]'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Verified Document Inward (Upload & Validate)</span>
                </button>
                <button
                  onClick={() => setWeighbridgeMode('scale')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    weighbridgeMode === 'scale'
                      ? 'bg-[#168A5B] text-white shadow-xs'
                      : 'text-[#063B2A]/70 hover:text-[#063B2A]'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Direct Scale Input (IS 9281)</span>
                </button>
              </div>
            </div>

            <IntegrationBadge status="LIVE" spec="IS 9281 + RoR" featureName="Mandi Inward Pipeline" featureId="AUD-02" />
          </div>

          {weighbridgeMode === 'document' ? (
            <SupervisorDocumentWorkflow
              onCommitInwardRecord={(rec) => {
                onAddProcurement(rec);
                setWeighbridgeSuccessMsg(`Verified Document Inward: Docket #${rec.slipNumber} committed for ${rec.farmerName} (${rec.netWeightQuintals} Qtl). PFMS DBT advice generated.`);
              }}
              language={language}
            />
          ) : (
            <>
              {weighbridgeSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#153A2C] border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-3 animate-fade-in shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-bold leading-relaxed">{weighbridgeSuccessMsg}</span>
                  </div>
                  <button
                    onClick={() => setWeighbridgeSuccessMsg(null)}
                    className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 text-xs font-bold underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Inward Terminal Form */}
          <div className="lg:col-span-7 editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E4EBE6] pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-[#063B2A] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#168A5B]" />
                  <span>Digital Weighbridge Terminal (Wardha APMC Yard #2)</span>
                </h3>
                <IntegrationBadge status="LIVE" spec="IS 9281 Net Tare" featureName="Weighbridge Terminal" featureId="AUD-02" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Calibrated & Certified (IS 9281)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-[#063B2A]/70 font-semibold block mb-1">Farmer Name</label>
                <input
                  type="text"
                  value={newFarmerName}
                  onChange={(e) => setNewFarmerName(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#063B2A]/70 font-semibold block mb-1">Kisan ID / Aadhaar</label>
                <input
                  type="text"
                  value={newKisanId}
                  onChange={(e) => setNewKisanId(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#063B2A]/70 font-semibold block mb-1">Crop Variety</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                >
                  <option value="Soyabean (Yellow)">Soyabean (Yellow) - MSP ₹4,892/Q</option>
                  <option value="Cotton (Medium Staple)">Cotton (Medium Staple) - MSP ₹7,121/Q</option>
                  <option value="Wheat (Lokwan)">Wheat (Lokwan) - MSP ₹2,275/Q</option>
                  <option value="Gram (Chana)">Gram (Chana) - MSP ₹5,440/Q</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#063B2A]/70 font-semibold block mb-1">Moisture Meter Reading (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMoisture}
                  onChange={(e) => setNewMoisture(Number(e.target.value))}
                  className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#063B2A]/70 font-semibold block mb-1">Gross Loaded Weight (Quintals)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newGross}
                  onChange={(e) => setNewGross(Number(e.target.value))}
                  className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#063B2A]/70 font-semibold block mb-1">Vehicle Tare Weight (Quintals)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newTare}
                  onChange={(e) => setNewTare(Number(e.target.value))}
                  className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                />
              </div>
            </div>

            {/* Calculated Result Preview Card */}
            <div className="p-4 rounded-2xl bg-[#DDF4E9]/40 border border-[#168A5B]/30 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-xl border border-[#D7E3DC]">
                  <span className="text-[10px] text-slate-500 block">Net Weight</span>
                  <span className="text-base font-bold font-mono-numbers text-[#063B2A]">{netWeight} Qtl</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#D7E3DC]">
                  <span className="text-[10px] text-slate-500 block">Quality Grade</span>
                  <span className={`text-xs font-bold block mt-0.5 ${isFaqGradeA ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isFaqGradeA ? 'FAQ Grade A' : 'Moisture Deduction'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#D7E3DC]">
                  <span className="text-[10px] text-slate-500 block">Total DBT Advice</span>
                  <span className="text-base font-bold font-mono-numbers text-[#0B5D3B]">
                    ₹{grossPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRecordWeighbridge}
                className="w-full py-3 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <FileCheck className="w-4 h-4" />
                <span>Issue APMC Weigh Slip & Release DBT Advice</span>
              </button>
            </div>
          </div>

          {/* Right: Recent Inward Procurement Slips */}
          <div className="lg:col-span-5 editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-3 shadow-sm">
            <h3 className="font-bold text-sm text-[#063B2A]">
              Today's Inward Slips Manifest
            </h3>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {procurementRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-numbers font-bold text-[#063B2A]">{rec.slipNumber}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {rec.qualityGrade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#063B2A]/80">
                    <span>{rec.farmerName}</span>
                    <span className="font-mono font-bold">{rec.netWeightQuintals} Qtl</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#E4EBE6] text-[11px]">
                    <span className="text-slate-500">Moisture: {rec.moisturePercentage}%</span>
                    <strong className="text-[#0B5D3B]">₹{rec.totalGrossPayable.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* TAB 3: Machinery Fleet & Telemetry Dispatch */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-white border border-[#D7E3DC] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#063B2A] uppercase tracking-wider">
                CHC Farm Machinery Fleet (SMAM Scheme Telemetry)
              </span>
              <IntegrationBadge status="INTEGRATION-READY" spec="AIS-140 GPS" featureName="Fleet Telemetry" featureId="AUD-09" />
            </div>
            <span className="text-xs text-[#063B2A]/70">
              Active CHC: Wardha Central Hub • 4 Units Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {fleet.map((unit) => (
              <div
                key={unit.id}
                className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-4.5 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {unit.code}
                    </span>
                    <h4 className="font-bold text-sm text-[#063B2A] mt-1">{unit.name}</h4>
                    <p className="text-xs text-[#063B2A]/60 font-mono">{unit.registrationNumber}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    unit.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : unit.status === 'In-Field'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                {/* Battery/Fuel Telemetry Gauge */}
                <div className="p-2.5 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[#063B2A]/70">
                      {unit.category === 'Garuda Drone Sprayer' ? <BatteryMedium className="w-3.5 h-3.5 text-emerald-600" /> : <Fuel className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{unit.category === 'Garuda Drone Sprayer' ? 'Battery' : 'Diesel Fuel'}</span>
                    </span>
                    <span className="font-mono font-bold text-xs">{unit.fuelBatteryLevel}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        unit.fuelBatteryLevel > 50 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${unit.fuelBatteryLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Deployment details */}
                <div className="text-xs space-y-1 text-[#063B2A]/80">
                  <p>Operator: <strong>{unit.operatorName}</strong></p>
                  <p>Rental: <strong>₹{unit.hourlyRentalInr}/hr</strong> (50% SMAM)</p>
                  <p>Today's Coverage: <strong>{unit.acresCoveredToday} Acres</strong></p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#E4EBE6] flex items-center justify-between gap-2">
                  <a
                    href={`tel:${unit.operatorPhone}`}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#063B2A]"
                    title="Call Operator"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>

                  {unit.status === 'Available' ? (
                    <button
                      onClick={() => {
                        setSelectedAsset(unit);
                        setDispatchModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold"
                    >
                      Dispatch to Farm
                    </button>
                  ) : (
                    <button
                      onClick={() => onRecallAsset(unit.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-[#063B2A] text-xs font-semibold"
                    >
                      Recall to Hub
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Dispatch Modal */}
          {dispatchModalOpen && selectedAsset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white rounded-2xl p-5 space-y-4 border border-[#D7E3DC] shadow-xl">
                <h3 className="font-bold text-sm text-[#063B2A]">
                  Dispatch {selectedAsset.name} to Field Sector
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Target Farmer</label>
                    <input
                      type="text"
                      placeholder="e.g. Rameshwar Patil"
                      value={dispatchFarmer}
                      onChange={(e) => setDispatchFarmer(e.target.value)}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Sector / Village Location</label>
                    <input
                      type="text"
                      value={dispatchVillage}
                      onChange={(e) => setDispatchVillage(e.target.value)}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDispatchModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDispatchAsset(selectedAsset.id, dispatchFarmer || 'Rameshwar Patil', dispatchVillage);
                      setDispatchModalOpen(false);
                      playAudioChime();
                    }}
                    className="px-4 py-2 bg-[#168A5B] text-white rounded-xl text-xs font-bold"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Official Dynamic Excel & CSV Live Dashboard */}
      {activeTab === 'excel-dashboard' && (
        <DynamicExcelDashboard
          language={language}
          adminRole="supervisor"
        />
      )}

      {/* TAB 4: Pacing & Daily Manifest Reports */}
      {activeTab === 'reports' && (
        <SupervisorQuickReport
          tokens={tokens}
          procurementRecords={procurementRecords}
          language={language}
          centreName="Wardha APMC Central Procurement Hub"
          onExportCsv={handleExportCsvManifest}
        />
      )}

      {/* TAB: Official Farmers Registry & e-KYC Verification */}
      {activeTab === 'farmers' && (
        <AdminFarmerRegistryTab
          language={language}
          userRole="supervisor"
        />
      )}

      {/* TAB 5: Supervisor Profile & Station Security */}
      {activeTab === 'profile' && (
        <SupervisorProfileTab
          session={session}
          language={language}
          onLanguageChange={onLanguageChange}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onLogout={onExit || (() => {})}
        />
      )}

      {/* Machine Learning Queue Rebalancer Modal (Python + Pandas + Scikit-Learn) */}
      <MlQueueRebalancerModal
        isOpen={isMlModalOpen}
        onClose={() => setIsMlModalOpen(false)}
        language={language}
        tokens={tokens}
        onApplyReallocations={(updated) => {
          if (onBulkUpdateTokens) {
            onBulkUpdateTokens(updated);
          }
        }}
      />
    </div>
  );
};
