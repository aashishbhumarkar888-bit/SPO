import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Cpu, 
  FileCode2, 
  ArrowRight,
  Database,
  Sparkles,
  Server,
  Lock,
  WifiOff,
  RefreshCw,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { INTEGRATION_AUDIT_DATA } from '../../data/agriMockData';
import { IntegrationStatusBadge, IntegrationAuditItem } from '../../types';
import { INTEGRATION_DEFINITIONS } from './IntegrationBadge';

interface SihEvaluationInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedId?: string;
}

export const SihEvaluationInspector: React.FC<SihEvaluationInspectorProps> = ({
  isOpen,
  onClose,
  initialSelectedId
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | IntegrationStatusBadge>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(initialSelectedId || 'AUD-01');
  const [activeTab, setActiveTab] = useState<'matrix' | 'judge-faq' | 'definitions'>('matrix');

  useEffect(() => {
    if (initialSelectedId) {
      setExpandedId(initialSelectedId);
      setActiveTab('matrix');
    }
  }, [initialSelectedId]);

  if (!isOpen) return null;

  const filteredAudits = INTEGRATION_AUDIT_DATA.filter(item => {
    const matchesFilter = selectedFilter === 'ALL' || item.status === selectedFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      item.featureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subsystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productionIntegration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badgeTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countByStatus: Record<IntegrationStatusBadge, number> = {
    'LIVE': INTEGRATION_AUDIT_DATA.filter(a => a.status === 'LIVE').length,
    'SYNCED': INTEGRATION_AUDIT_DATA.filter(a => a.status === 'SYNCED').length,
    'INTEGRATION-READY': INTEGRATION_AUDIT_DATA.filter(a => a.status === 'INTEGRATION-READY').length,
    'PROPOSED': INTEGRATION_AUDIT_DATA.filter(a => a.status === 'PROPOSED').length,
  };

  const getStatusColor = (status: IntegrationStatusBadge) => {
    switch (status) {
      case 'LIVE':
        return {
          pill: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
          accent: 'border-emerald-500'
        };
      case 'SYNCED':
        return {
          pill: 'bg-sky-100 text-sky-900 border-sky-300',
          dot: 'bg-sky-600',
          accent: 'border-sky-500'
        };
      case 'INTEGRATION-READY':
        return {
          pill: 'bg-purple-100 text-purple-900 border-purple-300',
          dot: 'bg-purple-600',
          accent: 'border-purple-500'
        };
      case 'PROPOSED':
      default:
        return {
          pill: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
          accent: 'border-amber-500'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-[#D7E3DC] shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#063B2A] text-white p-5 sm:p-6 flex items-start justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-[10px] font-mono uppercase font-bold tracking-wider">
                SIH Technical Architecture Audit
              </span>
              <span className="text-xs text-amber-300 font-mono">
                Truth-in-Engineering Protocol
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
              System Architecture & Integration Readiness Matrix
            </h2>
            <p className="text-xs text-white/80 mt-1 max-w-3xl leading-relaxed">
              <strong>Core Engineering Boundary:</strong> AgriSeva does not pretend that unavailable government infrastructure is already integrated. It provides a working operational prototype with clearly defined production integration boundaries.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation Tabs */}
        <div className="bg-[#0B5D3B] text-white/90 px-6 py-2.5 border-t border-emerald-800 flex-shrink-0 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'matrix' 
                  ? 'bg-white text-[#063B2A] shadow-xs' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              8-Point Integration Dossiers ({INTEGRATION_AUDIT_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('judge-faq')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'judge-faq' 
                  ? 'bg-white text-[#063B2A] shadow-xs' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Judge Honesty Q&A</span>
            </button>
            <button
              onClick={() => setActiveTab('definitions')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'definitions' 
                  ? 'bg-white text-[#063B2A] shadow-xs' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Immutable Badge Definitions
            </button>
          </div>

          <div className="text-[11px] font-mono text-emerald-200 hidden md:block">
            SIH 2024 Finalist Evaluation Dossier
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#063B2A] bg-[#FAFBFB]">
          {/* TAB 1: Complete 8-Point Dossiers */}
          {activeTab === 'matrix' && (
            <div className="space-y-5">
              {/* Immutable Definition Bar (Quick reference) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                {(['LIVE', 'SYNCED', 'INTEGRATION-READY', 'PROPOSED'] as IntegrationStatusBadge[]).map(status => {
                  const def = INTEGRATION_DEFINITIONS[status];
                  const color = getStatusColor(status);
                  const isSelected = selectedFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedFilter(isSelected ? 'ALL' : status)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-[#063B2A] ring-2 ring-[#063B2A]/20 bg-white shadow-sm' 
                          : 'border-[#D7E3DC] bg-white hover:border-[#0B5D3B]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${color.pill}`}>
                          {status} ({countByStatus[status]})
                        </span>
                        <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                      </div>
                      <p className="text-[11px] text-[#063B2A]/80 line-clamp-2 leading-tight">
                        {def.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#D7E3DC]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search feature, API protocol, target system, or fallback..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#D7E3DC] text-xs focus:outline-hidden focus:border-[#168A5B] bg-[#F6F9F7]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedFilter === 'ALL'
                        ? 'bg-[#063B2A] text-white'
                        : 'bg-[#F0F5F2] text-[#063B2A] hover:bg-slate-200'
                    }`}
                  >
                    All ({INTEGRATION_AUDIT_DATA.length})
                  </button>
                  <button
                    onClick={() => {
                      if (expandedId) setExpandedId(null);
                      else setExpandedId(filteredAudits[0]?.id || null);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F0F5F2] text-[#063B2A] hover:bg-slate-200 transition-colors"
                  >
                    {expandedId ? 'Collapse View' : 'Expand Details'}
                  </button>
                </div>
              </div>

              {/* Dossier Cards List */}
              <div className="space-y-4">
                {filteredAudits.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const color = getStatusColor(item.status);

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                        isExpanded 
                          ? 'border-[#168A5B] shadow-md ring-1 ring-[#168A5B]/30' 
                          : 'border-[#D7E3DC] hover:border-[#168A5B]/60 shadow-2xs'
                      }`}
                    >
                      {/* Summary Banner Bar */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F6F9F7]/60 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${color.pill}`}>
                            {item.status} · {item.badgeTag}
                          </span>

                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-[#063B2A]">
                              {item.featureName}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#063B2A]/70">
                              <span className="font-mono text-[#168A5B] font-bold">{item.subsystem}</span>
                              <span>•</span>
                              <span>Target: {item.productionIntegration.split(' ')[0]} {item.productionIntegration.split(' ')[1]}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-semibold text-[#168A5B] hidden sm:inline">
                            {isExpanded ? 'Hide Dossier' : 'Inspect 8-Point Dossier'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-[#168A5B]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* 8-Point Detailed Architectural Breakdown */}
                      {isExpanded && (
                        <div className="p-5 sm:p-6 border-t border-[#E4EBE6] bg-gradient-to-b from-[#F6F9F7] to-white space-y-5">
                          {/* Judge Direct Honesty Box */}
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <div className="font-bold text-amber-900 uppercase font-mono tracking-wider text-[11px]">
                                SIH Evaluator Question: "{item.judgeFaq.question}"
                              </div>
                              <p className="font-sans text-xs text-amber-950 font-medium leading-relaxed">
                                {item.judgeFaq.answer}
                              </p>
                            </div>
                          </div>

                          {/* 2-Column Core Architecture Comparison: Prototype vs Production */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* What works now */}
                            <div className="p-4 rounded-xl bg-white border border-[#D7E3DC] shadow-2xs space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#063B2A]">
                                <Cpu className="w-4 h-4 text-[#168A5B]" />
                                <span>1. Current Prototype (What Works Now)</span>
                              </div>
                              <p className="text-xs text-[#063B2A]/90 leading-relaxed">
                                {item.currentPrototype}
                              </p>
                            </div>

                            {/* Production Integration */}
                            <div className="p-4 rounded-xl bg-white border border-[#D7E3DC] shadow-2xs space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B5D3B]">
                                <Server className="w-4 h-4 text-purple-600" />
                                <span>2. Production Integration (External Service)</span>
                              </div>
                              <p className="text-xs text-[#063B2A]/90 leading-relaxed font-mono text-[11px]">
                                {item.productionIntegration}
                              </p>
                            </div>
                          </div>

                          {/* 3-Step Data Flow */}
                          <div className="p-4 rounded-xl bg-white border border-[#D7E3DC] shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#063B2A]">
                              <ArrowRight className="w-4 h-4 text-emerald-600" />
                              <span>3. Data Flow Specification (Input → Processing → Output)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div className="p-3 rounded-lg bg-[#FAFBFB] border border-[#E4EBE6]">
                                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                  Input Payload
                                </span>
                                <p className="text-[#063B2A]/85 text-[11px] leading-relaxed">
                                  {item.dataFlow.input}
                                </p>
                              </div>

                              <div className="p-3 rounded-lg bg-[#FAFBFB] border border-[#E4EBE6]">
                                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                  Processing Logic
                                </span>
                                <p className="text-[#063B2A]/85 text-[11px] leading-relaxed">
                                  {item.dataFlow.processing}
                                </p>
                              </div>

                              <div className="p-3 rounded-lg bg-[#FAFBFB] border border-[#E4EBE6]">
                                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                  Output Artifact
                                </span>
                                <p className="text-[#063B2A]/85 text-[11px] leading-relaxed">
                                  {item.dataFlow.output}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Security, Auth, Offline & Failure Fallback Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                            {/* 4. Authentication */}
                            <div className="p-3.5 rounded-xl bg-white border border-[#D7E3DC] space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[#063B2A] font-bold text-[11px] uppercase tracking-wider">
                                <Lock className="w-3.5 h-3.5 text-blue-600" />
                                <span>4. Authentication</span>
                              </div>
                              <p className="text-[11px] text-[#063B2A]/80 leading-relaxed font-mono">
                                {item.authentication}
                              </p>
                            </div>

                            {/* 5. Offline Behaviour */}
                            <div className="p-3.5 rounded-xl bg-white border border-[#D7E3DC] space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[#063B2A] font-bold text-[11px] uppercase tracking-wider">
                                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                                <span>5. Offline Mode</span>
                              </div>
                              <p className="text-[11px] text-[#063B2A]/80 leading-relaxed">
                                {item.offlineBehaviour}
                              </p>
                            </div>

                            {/* 6. Failure Handling */}
                            <div className="p-3.5 rounded-xl bg-white border border-[#D7E3DC] space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[#063B2A] font-bold text-[11px] uppercase tracking-wider">
                                <RefreshCw className="w-3.5 h-3.5 text-orange-600" />
                                <span>6. Fallback Strategy</span>
                              </div>
                              <p className="text-[11px] text-[#063B2A]/80 leading-relaxed">
                                {item.failureHandling}
                              </p>
                            </div>

                            {/* 7. Security & Privacy */}
                            <div className="p-3.5 rounded-xl bg-white border border-[#D7E3DC] space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[#063B2A] font-bold text-[11px] uppercase tracking-wider">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>7. Security & Privacy</span>
                              </div>
                              <p className="text-[11px] text-[#063B2A]/80 leading-relaxed font-mono text-[10px]">
                                {item.security}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Judge Honesty Q&A Fast Directory */}
          {activeTab === 'judge-faq' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                <h3 className="font-bold text-sm mb-1 text-emerald-900">
                  Direct Answers to Hard Technical Questions
                </h3>
                <p className="text-emerald-800/90 leading-relaxed">
                  During SIH hackathon evaluation, judges frequently probe whether external APIs (like PFMS, Mahabhulekh, or IMD) are live or simulated. AgriSeva adheres to strict honesty:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {INTEGRATION_AUDIT_DATA.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-[#D7E3DC] shadow-2xs space-y-2 hover:border-[#168A5B] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#168A5B]">
                        {item.featureName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getStatusColor(item.status).pill}`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#063B2A]">
                      "{item.judgeFaq.question}"
                    </h4>

                    <p className="text-xs text-[#063B2A]/85 leading-relaxed bg-[#F6F9F7] p-2.5 rounded-xl border border-[#E4EBE6]">
                      {item.judgeFaq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Immutable Badge Definitions Reference */}
          {activeTab === 'definitions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F6F9F7] border border-[#D7E3DC] text-xs text-[#063B2A]">
                <h3 className="font-bold text-sm text-[#063B2A] mb-1">
                  Product-Wide Immutable Classification Schema
                </h3>
                <p className="text-[#063B2A]/80 leading-relaxed">
                  Every technical badge displayed across AgriSeva's Farmer, Supervisor, and Super Admin interfaces strictly adheres to these non-negotiable definitions:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['LIVE', 'SYNCED', 'INTEGRATION-READY', 'PROPOSED'] as IntegrationStatusBadge[]).map(badgeKey => {
                  const def = INTEGRATION_DEFINITIONS[badgeKey];
                  const color = getStatusColor(badgeKey);
                  return (
                    <div 
                      key={badgeKey} 
                      className="p-5 rounded-2xl bg-white border border-[#D7E3DC] shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-md font-mono text-xs font-bold border ${color.pill}`}>
                          {def.title}
                        </span>
                        <span className={`w-3 h-3 rounded-full ${color.dot}`} />
                      </div>

                      <p className="text-sm font-semibold text-[#063B2A]">
                        {def.desc}
                      </p>

                      <div className="pt-2 border-t border-[#E4EBE6] text-xs text-[#063B2A]/70">
                        <strong className="block text-[11px] text-[#063B2A] uppercase font-mono mb-1">
                          Evaluator Meaning:
                        </strong>
                        {badgeKey === 'LIVE' && (
                          <span>The logic runs right in front of you. If you click it or calculate, it executes code immediately.</span>
                        )}
                        {badgeKey === 'SYNCED' && (
                          <span>Operates across screens or local device storage. Retains full utility even when 4G network is severed.</span>
                        )}
                        {badgeKey === 'INTEGRATION-READY' && (
                          <span>The exact data payload, form fields, and response handlers exist in the code; connecting to the government backend only requires official API credentials.</span>
                        )}
                        {badgeKey === 'PROPOSED' && (
                          <span>Acknowledged as a high-value Phase 2 roadmap extension; not pretending to have code running today.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F0F5F2] border-t border-[#D7E3DC] flex items-center justify-between text-xs text-[#063B2A]/80 flex-shrink-0">
          <span className="font-mono text-[11px]">
            AgriSeva • Truth-in-Engineering Architecture Standard
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#063B2A] hover:bg-[#0B5D3B] text-white font-bold transition-colors"
          >
            Close Tech Audit
          </button>
        </div>
      </div>
    </div>
  );
};
