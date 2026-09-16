import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  User, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  Mail, 
  CreditCard,
  Building2,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  SEEDED_DEMO_ACCOUNTS, 
  DemoAccountDirectoryItem, 
  isDemoEnvironment 
} from '../../services/authService';
import { LanguageCode } from '../../types';

interface DemoCredentialsDirectoryProps {
  language?: LanguageCode;
  onSelectAccount?: (account: DemoAccountDirectoryItem, preferredIdentifier: string) => void;
  filterRole?: 'farmer' | 'supervisor' | 'superadmin';
  defaultExpanded?: boolean;
}

export const DemoCredentialsDirectory: React.FC<DemoCredentialsDirectoryProps> = ({
  language = 'en',
  onSelectAccount,
  filterRole,
  defaultExpanded = true
}) => {
  // CRITICAL HARD CONSTRAINT: Exclude completely from any production build
  if (!isDemoEnvironment()) {
    return null;
  }

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'farmer' | 'supervisor' | 'superadmin'>(
    filterRole || 'all'
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(!defaultExpanded);

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const accounts = SEEDED_DEMO_ACCOUNTS.filter(acc => {
    if (filterRole) return acc.role === filterRole;
    if (activeTab !== 'all') return acc.role === activeTab;
    return true;
  });

  return (
    <div className="mt-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 dark:border-amber-500/20 overflow-hidden transition-all text-left">
      {/* Clearly-Labeled Test Environment Banner */}
      <div 
        onClick={() => setIsCollapsed(prev => !prev)}
        className="px-4 py-3 bg-amber-500/10 dark:bg-amber-900/30 border-b border-amber-500/20 flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-300">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/40">
                {language === 'hi' ? 'केवल परीक्षण/डेमो' : 'DEMO ONLY'}
              </span>
              <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100">
                {language === 'hi' 
                  ? 'डेमो क्रेडेंशियल डायरेक्टरी (Demo Access)' 
                  : 'Demo Credentials Directory (Evaluator Access)'}
              </h4>
            </div>
            <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
              {language === 'hi'
                ? 'मूल्यांकन हेतु पूर्व-कॉन्फ़िगर किए गए सुरक्षित मॉक खाते। उत्पादन में उपलब्ध नहीं।'
                : 'Deterministic seeded test accounts for end-to-end evaluation. Excluded in production.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-amber-700 dark:text-amber-300 hover:text-amber-900 p-1"
          aria-label={isCollapsed ? "Expand Demo Directory" : "Collapse Demo Directory"}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-3.5 space-y-3">
          {/* Role filter tabs (if not locked to single role) */}
          {!filterRole && (
            <div className="flex items-center gap-1.5 pb-1 overflow-x-auto">
              {(['all', 'farmer', 'supervisor', 'superadmin'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white/60 dark:bg-black/30 text-amber-900 dark:text-amber-200 hover:bg-white dark:hover:bg-black/50 border border-amber-500/20'
                  }`}
                >
                  {tab === 'all' && (language === 'hi' ? 'सभी खाते' : 'All Roles')}
                  {tab === 'farmer' && (language === 'hi' ? 'किसान (Farmer)' : 'Farmer')}
                  {tab === 'supervisor' && (language === 'hi' ? 'पर्यवेक्षक (Supervisor)' : 'Supervisor')}
                  {tab === 'superadmin' && (language === 'hi' ? 'सुपर एडमिन (State Admin)' : 'Super Admin')}
                </button>
              ))}
            </div>
          )}

          {/* Account Cards */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {accounts.map(acc => (
              <div 
                key={acc.id}
                className="p-3 rounded-xl bg-white dark:bg-[#0E241C] border border-amber-400/30 dark:border-amber-500/20 shadow-xs space-y-2"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      acc.role === 'farmer' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                        : acc.role === 'supervisor'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {acc.role === 'farmer' && <User className="w-3.5 h-3.5" />}
                      {acc.role === 'supervisor' && <Building2 className="w-3.5 h-3.5" />}
                      {acc.role === 'superadmin' && <Award className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {language === 'hi' ? acc.personNameHi : acc.personName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {acc.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {acc.designation}
                      </p>
                    </div>
                  </div>

                  {/* Seeded badge */}
                  <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-300/40">
                    Seeded Mock
                  </span>
                </div>

                {/* Identifiers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {/* Mobile Identifier */}
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-emerald-600" />
                      <span>Mobile:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {acc.identifiers.mobile}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.identifiers.mobile, `${acc.id}-mob`)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Copy mobile number"
                      >
                        {copiedKey === `${acc.id}-mob` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                      {onSelectAccount && (
                        <button
                          type="button"
                          onClick={() => onSelectAccount(acc, acc.identifiers.mobile)}
                          className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Aadhaar Identifier */}
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-amber-600" />
                      <span>Aadhaar:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200" title="Masked demo Aadhaar">
                        {acc.identifiers.aadhaarMasked}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.identifiers.aadhaarMasked, `${acc.id}-aadh`)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Copy Aadhaar"
                      >
                        {copiedKey === `${acc.id}-aadh` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                      {onSelectAccount && (
                        <button
                          type="button"
                          onClick={() => onSelectAccount(acc, '')}
                          className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-[9px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Email Identifier */}
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between col-span-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-600" />
                      <span>Email:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-slate-800 dark:text-slate-200 text-[10px] truncate max-w-[180px] sm:max-w-none">
                        {acc.identifiers.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.identifiers.email, `${acc.id}-email`)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Copy email address"
                      >
                        {copiedKey === `${acc.id}-email` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                      {onSelectAccount && (
                        <button
                          type="button"
                          onClick={() => onSelectAccount(acc, acc.identifiers.email)}
                          className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[9px] font-bold text-blue-800 dark:text-blue-300 hover:bg-blue-200"
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Staff ID / ID for Supervisor & Super Admin */}
                  {acc.identifiers.staffId && (
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Official ID:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {acc.identifiers.staffId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(acc.identifiers.staffId || '', `${acc.id}-staff`)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          {copiedKey === `${acc.id}-staff` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Plaintext Demo Password / PIN (Strictly in this demo panel only) */}
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/40 flex items-center justify-between">
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                      {language === 'hi' ? acc.passcodeLabelHi : acc.passcodeLabel}:
                    </span>
                    <div className="flex items-center justify-between group mt-1">
                      <span className="font-mono text-lg font-semibold tracking-widest text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800/50">
                        {acc.demoPasscode || 'N/A'}
                      </span>
                      {acc.demoPasscode && (
                        <button 
                          type="button"
                          className="text-slate-400 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopy(acc.demoPasscode!, `${acc.id}-pin`)}
                          title="Copy Code"
                        >
                          {copiedKey === `${acc.id}-pin` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footnote on test scenario */}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                  ℹ️ {acc.notes}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-amber-500/20 text-[10px] text-amber-800/80 dark:text-amber-300/70 flex items-center justify-between">
            <span>🛡️ Protected: Seeded mock fixtures only. Never accesses real user data.</span>
            <span className="font-mono">BUILD_ENV: NON-PROD DEMO</span>
          </div>
        </div>
      )}
    </div>
  );
};
