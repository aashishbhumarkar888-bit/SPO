import React, { useState } from 'react';
import { 
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
  Server,
  Terminal,
  FileCheck
} from 'lucide-react';
import { SuperAdminSession, LanguageCode } from '../../types';
import { playAudioChime } from '../../utils/speech';
import { auditLogger } from '../../domain/auditLog';

interface SuperAdminProfileTabProps {
  session?: SuperAdminSession | null;
  language: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onLogout: () => void;
}

export const SuperAdminProfileTab: React.FC<SuperAdminProfileTabProps> = ({
  session,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  onLogout
}) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const adminName = session?.adminName || 'Sanjay V. Deshmukh, IAS';
  const adminId = session?.adminId || 'ADMIN-MH-STATE-01';
  const designation = session?.designation || 'Principal Secretary & State Mandi Board Commissioner';
  const department = session?.department || 'Department of Agriculture, Govt. of Maharashtra';
  const clearanceLevel = session?.clearanceLevel || 'LEVEL-4_STATE_GOVERNANCE';
  const loginTime = session?.loginTime || '07:30 AM';
  const tokenExpiresAt = session?.tokenExpiresAt || '07:30 PM';
  const gatewaySession = session?.gatewaySession || 'MSAMB-SEC-892104';

  const handleChangeMasterPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(null);

    if (currentPin !== 'admin123' && currentPin !== '9999') {
      setPinChangeError('Current Master Passphrase is incorrect. (Default demo pass: admin123)');
      return;
    }

    if (newPin.length < 6) {
      setPinChangeError('New Passphrase must be at least 6 characters');
      return;
    }

    if (newPin !== confirmPin) {
      setPinChangeError('New Passphrase and confirmation do not match');
      return;
    }

    setIsChangingPin(true);
    playAudioChime();
    setTimeout(() => {
      setIsChangingPin(false);
      setPinChangeSuccess('Master Passphrase updated successfully. Propagated to NIC State Security Directory.');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      auditLogger.log({
        action: 'SUPER_ADMIN_PASSWORD_CHANGED',
        actorRole: 'SUPER_ADMIN',
        actorId: adminId,
        targetEntity: 'StateGovernanceAuth',
        targetId: gatewaySession,
        description: `Administrator ${adminId} rotated governance credential`
      });
    }, 500);
  };

  const handleConfirmLogout = () => {
    playAudioChime();
    sessionStorage.clear();
    auditLogger.log({
      action: 'SUPER_ADMIN_LOGGED_OUT',
      actorRole: 'SUPER_ADMIN',
      actorId: adminId,
      targetEntity: 'GovernancePortal',
      targetId: 'MSAMB-CENTRAL',
      description: `Administrator ${adminId} cleanly purged session storage and terminated strategic governance session`
    });
    onLogout();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Administrator Identity Card */}
      <div className="rounded-2xl p-6 bg-white border border-[#D7E3DC] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#063B2A] text-white flex items-center justify-center font-serif-display text-2xl font-bold shadow-sm flex-shrink-0 border-2 border-emerald-400">
            {adminName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#063B2A]">
                {adminName}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300">
                {clearanceLevel}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              ID: <strong className="font-mono text-[#063B2A]">{adminId}</strong> • {designation}
            </p>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#168A5B]" />
              <span>{department}</span>
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

      {/* Grid: Infrastructure Session Status & Root Authority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Session Status */}
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E4EBE6] pb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#168A5B]" />
              <span>Secure Gateway Connection</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              NIC GovNet Active
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-[#063B2A]">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Gateway Session Token:</span>
              <span className="font-mono font-bold">{gatewaySession}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Security Gateway:</span>
              <span className="font-mono font-semibold">10.42.0.1 (NIC Secure Tunnel)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Session Initialized:</span>
              <span className="font-mono font-semibold">{loginTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Token Expiry:</span>
              <span className="font-mono font-semibold text-amber-700">{tokenExpiresAt}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Cluster Status:</span>
              <span className="font-semibold text-emerald-800">12 / 12 District APMCs Synced</span>
            </div>
          </div>
        </div>

        {/* Root Policy Authority */}
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E4EBE6] pb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#168A5B]" />
              <span>Governance Authority Privileges</span>
            </h4>
            <span className="text-xs text-purple-800 font-mono font-bold">SUPER ADMIN</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Dynamic Minimum Support Price (MSP) Rate Alteration', allowed: true },
              { label: 'Moisture Tolerance Band Adjustment (&lt;12% FAQ)', allowed: true },
              { label: 'Emergency All-Kendra SMS / Voice Broadcast', allowed: true },
              { label: 'Mandi Board Staff Access & RBAC Role Provisioning', allowed: true },
              { label: 'Direct Benefit Transfer (DBT) PFMS Batch Clearance', allowed: true }
            ].map((perm, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <span className="text-slate-700 font-medium">
                  {perm.label}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Authorized
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Master Passphrase */}
      <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4 shadow-sm">
        <div className="border-b border-[#E4EBE6] pb-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-[#168A5B]" />
            <span>Rotate Governance Passphrase</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic key for signing state-level MSP policy changes and emergency broadcasts
          </p>
        </div>

        {pinChangeError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{pinChangeError}</span>
          </div>
        )}

        {pinChangeSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{pinChangeSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangeMasterPin} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Current Passphrase</label>
            <input
              type="password"
              value={currentPin}
              onChange={e => setCurrentPin(e.target.value)}
              placeholder="Demo: admin123"
              required
              className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-mono text-sm bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-600 block mb-1">New Passphrase</label>
            <input
              type="password"
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              placeholder="Min 6 characters"
              required
              className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-mono text-sm bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-600 block mb-1">Confirm Passphrase</label>
            <input
              type="password"
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
              placeholder="Repeat new passphrase"
              required
              className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-mono text-sm bg-white"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPin}
              className="px-5 py-2 rounded-xl bg-[#063B2A] hover:bg-[#0B5D3B] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              {isChangingPin ? 'Updating Passphrase...' : 'Update Master Passphrase'}
            </button>
          </div>
        </form>
      </div>

      {/* Terminal Settings: Theme & Language */}
      <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4 shadow-sm">
        <div className="border-b border-[#E4EBE6] pb-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#168A5B]" />
            <span>Governance Interface Preferences</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 block mb-1.5">Language</label>
            <select
              value={language}
              onChange={e => onLanguageChange?.(e.target.value as LanguageCode)}
              className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-semibold text-[#063B2A] bg-[#F6F9F7]"
            >
              <option value="en">English (Official State Gazette)</option>
              <option value="hi">हिन्दी (National Agriculture Portal)</option>
              <option value="mr">मराठी (State APMC Administration)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-600 block mb-1.5">Visual Theme</label>
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-full p-2.5 rounded-xl border border-[#D7E3DC] bg-[#F6F9F7] font-semibold text-[#063B2A] flex items-center justify-between hover:bg-slate-100 transition-colors"
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
                Clear Session & Terminate Governance Session?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are about to exit the Strategic State Governance Console. Active session storage will be cleared, your administrative credentials invalidated, and you will return to the public citizen portal without preserving sensitive operational cache.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Keep Console Open
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
