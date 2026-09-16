import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Building2, 
  Clock, 
  Globe, 
  Sun, 
  Moon, 
  LogOut, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Laptop,
  Radio,
  FileText
} from 'lucide-react';
import { SupervisorSession, LanguageCode } from '../../types';
import { playAudioChime } from '../../utils/speech';
import { auditLogger } from '../../domain/auditLog';

interface SupervisorProfileTabProps {
  session?: SupervisorSession | null;
  language: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onLogout: () => void;
}

export const SupervisorProfileTab: React.FC<SupervisorProfileTabProps> = ({
  session,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  onLogout
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fallback defaults if session was initiated via URL parameter
  const officerName = session?.officerName || 'Dnyaneshwar S. Kulkarni';
  const supervisorId = session?.supervisorId || 'SUP-WRD-01';
  const designation = session?.designation || 'Mandi Board Field Officer & Kendra Supervisor';
  const centreName = session?.centreName || 'Wardha Central APMC Mandi Yard';
  const centreId = session?.centreId || 'CEN-1';
  const loginTime = session?.loginTime || '08:00 AM';
  const tokenExpiresAt = session?.tokenExpiresAt || '02:00 PM';
  const terminalIp = session?.terminalIp || '192.168.10.45 (Local APMC Intranet)';
  const terminalId = session?.terminalId || 'APMC-WRD-TERM-04';
  const clearanceLevel = session?.clearanceLevel || 'LEVEL-2_MANDI_SUPERVISOR';
  const activeShift = session?.activeShift || 'Morning (08:00 - 14:00)';



  const handleConfirmLogout = () => {
    playAudioChime();
    sessionStorage.clear();
    auditLogger.log({
      action: 'SUPERVISOR_LOGGED_OUT',
      actorRole: 'SUPERVISOR',
      actorId: supervisorId,
      targetEntity: 'OperationsConsole',
      targetId: centreId,
      description: `Supervisor ${supervisorId} cleanly purged session storage and terminated session from terminal ${terminalId}`
    });
    onLogout();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Officer Identity Card */}
      <div className="rounded-2xl p-6 bg-white border border-[#D7E3DC] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#063B2A] text-white flex items-center justify-center font-serif-display text-2xl font-bold shadow-sm flex-shrink-0">
            {officerName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#063B2A]">
                {officerName}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                {clearanceLevel}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              ID: <strong className="font-mono text-[#063B2A]">{supervisorId}</strong> • {designation}
            </p>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#168A5B]" />
              <span>{centreName} ({centreId})</span>
            </p>
          </div>
        </div>

        {/* Prominent Clear Session and Logout Button */}
        <div className="flex flex-col sm:items-end gap-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Clear Session & Logout</span>
          </button>
          <span className="text-[11px] text-slate-500 font-mono">
            Session TTL: Valid until {tokenExpiresAt}
          </span>
        </div>
      </div>

      {/* Grid: Session Status & Operational Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Session Status */}
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E4EBE6] pb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-[#168A5B]" />
              <span>Terminal & Session State</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active & Synced
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-[#063B2A]">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Terminal Station:</span>
              <span className="font-mono font-bold">{terminalId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Station IP / Network:</span>
              <span className="font-mono font-semibold">{terminalIp}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Authenticated At:</span>
              <span className="font-mono font-semibold">{loginTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Token Expiry:</span>
              <span className="font-mono font-semibold text-amber-700">{tokenExpiresAt}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Assigned Operational Shift:</span>
              <span className="font-semibold text-emerald-800">{activeShift}</span>
            </div>
          </div>
        </div>

        {/* Operational Permissions Matrix */}
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E4EBE6] pb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#168A5B]" />
              <span>Role Permissions (RBAC)</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono">ROLE: SUPERVISOR</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Token Priority Override & Reassignment', allowed: true },
              { label: 'Weighbridge Net Weight Certification (IS 9281)', allowed: true },
              { label: 'Direct Benefit Transfer (DBT) Advice Generation', allowed: true },
              { label: 'Custom Hiring Centre (CHC) Fleet Dispatch', allowed: true },
              { label: 'State-wide MSP Policy Configuration', allowed: false }
            ].map((perm, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <span className={perm.allowed ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                  {perm.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  perm.allowed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {perm.allowed ? 'Granted' : 'Super Admin Only'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Terminal Settings: Theme & Language */}
      <div className="editorial-card rounded-2xl bg-white dark:bg-[#0E241C] border border-[#D7E3DC] dark:border-[#1D4334] p-5 space-y-4 shadow-sm">
        <div className="border-b border-[#E4EBE6] dark:border-[#1D4334] pb-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A] dark:text-[#6EE7B7] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#168A5B]" />
            <span>Terminal Language & Interface Preferences</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 dark:text-[#A3C7B8] block mb-1.5">Operational Interface Language</label>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={e => onLanguageChange?.(e.target.value as LanguageCode)}
                className="w-full p-2.5 rounded-xl border border-[#D7E3DC] dark:border-[#1D4334] font-semibold text-[#063B2A] dark:text-[#F0FAF5] bg-[#F6F9F7] dark:bg-[#143026] cursor-pointer"
              >
                <option value="hi" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">हिन्दी (Hindi)</option>
                <option value="en" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">English</option>
                <option value="mr" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">मराठी (Marathi)</option>
                <option value="pa" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-600 dark:text-[#A3C7B8] block mb-1.5">Visual Theme</label>
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-full p-2.5 rounded-xl border border-[#D7E3DC] dark:border-[#1D4334] bg-[#F6F9F7] dark:bg-[#143026] font-semibold text-[#063B2A] dark:text-[#F0FAF5] flex items-center justify-between hover:bg-slate-100 dark:hover:bg-[#1A3C2F] transition-colors"
            >
              <span>Current Theme: <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong></span>
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-emerald-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                Clear Session & Terminate Terminal?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are about to exit the authorized Kendra Operations Terminal for <strong>{centreName}</strong>. Active session storage will be cleared, your session token invalidated, and you will be returned to the public portal without preserving sensitive operational cache.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Keep Working
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm active:scale-95"
              >
                Clear Session & Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
