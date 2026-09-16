import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Building2, X, AlertCircle, KeyRound, Globe, Award } from 'lucide-react';
import { SuperAdminSession } from '../../types';
import { auditLogger } from '../../domain/auditLog';
import { playAudioChime } from '../../utils/speech';
import { DemoCredentialsDirectory } from '../common/DemoCredentialsDirectory';
import { DemoAccountDirectoryItem } from '../../services/authService';
import { SEEDED_STAFF_ADMINS } from '../../services/firestoreDbService';
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface SuperAdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: SuperAdminSession) => void;
}

export const SuperAdminLoginModal: React.FC<SuperAdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [adminId, setAdminId] = useState('ADMIN-MH-STATE-01');
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectDemoAccount = (account: DemoAccountDirectoryItem) => {
    if (account.identifiers.staffId) {
      setAdminId(account.identifiers.staffId);
    }
    if (account.demoPasscode) {
      setPassphrase(account.demoPasscode);
    }
    setError(null);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const staffRecord = SEEDED_STAFF_ADMINS.find(
        s => s.staffId.toLowerCase() === adminId.trim().toLowerCase()
      );

      if (!staffRecord) {
        throw new Error('Admin ID not recognized in state registry.');
      }

      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, staffRecord.email, passphrase);
      const idToken = await userCredential.user.getIdToken();

      // Establish secure server session
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server rejected gateway session');
      }

      if (data.role !== 'superadmin') {
        throw new Error('Authenticated account does not have LEVEL-4 privileges');
      }

      const now = new Date();
      const expires = new Date(now.getTime() + 12 * 60 * 60 * 1000);
      const session: SuperAdminSession = {
        adminId: staffRecord.staffId,
        adminName: staffRecord.fullName,
        designation: staffRecord.designation,
        department: 'Department of Agriculture, Govt. of Maharashtra & MoA&FW',
        state: 'Maharashtra',
        district: 'Statewide',
        loginTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokenExpiresAt: expires.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gatewaySessionId: `MSAMB-SEC-${crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase()}`,
        terminalIp: '10.42.0.1 (NIC Secure GovNet)',
        clearanceLevel: staffRecord.clearanceLevel as any
      };

      auditLogger.log({
        action: 'SUPER_ADMIN_AUTHENTICATED',
        actorRole: 'SUPER_ADMIN',
        actorId: session.adminId,
        targetEntity: 'GovernancePortal',
        targetId: 'MSAMB_GATEWAY',
        description: `Super Admin ${session.adminName} (${session.adminId}) established authenticated state governance session via Firebase Auth`
      });

      playAudioChime();
      onLoginSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
      auditLogger.log({
        action: 'SUPER_ADMIN_AUTH_FAILED',
        actorRole: 'SUPER_ADMIN',
        actorId: adminId,
        targetEntity: 'GovernancePortal',
        targetId: 'MSAMB_GATEWAY',
        description: `Unauthorized state policy gateway access attempt for ID ${adminId}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#063B2A]/30 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-login-title"
      >
        {/* Header */}
        <div className="bg-[#063B2A] text-white px-6 py-5 flex items-center justify-between border-b border-[#0B5D3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center border border-amber-400/40">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                  LEVEL-4 RESTRICTED
                </span>
              </div>
              <h3 id="superadmin-login-title" className="text-base font-bold text-white tracking-tight">
                Strategic State Policy Gateway
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisory banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-amber-950 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>NIC e-Governance Gateway • MSAMB Central Cloud Node</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#063B2A] mb-1">
              Authorized State Officer ID / Cadre Token
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B2A] bg-slate-50 font-mono"
                placeholder="e.g. ADMIN-MH-STATE-01"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#063B2A] mb-1">
              Master Passphrase / Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="password" 
                value={passphrase}
                onChange={e => setPassphrase(e.target.value)}
                required
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B2A] bg-white font-mono"
                placeholder="Enter PIN"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Protected by Section 43A IT Act & Digital Personal Data Protection (DPDP) Act 2023.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#063B2A] hover:bg-[#0B5D3B] rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{loading ? 'Verifying Gateway...' : 'Authenticate & Enter'}</span>
            </button>
          </div>

          {/* Test Environment Demo Credentials Panel */}
          {import.meta.env.DEV && (
            <DemoCredentialsDirectory
              filterRole="superadmin"
              onSelectAccount={handleSelectDemoAccount}
              defaultExpanded={true}
            />
          )}
        </form>
      </div>
    </div>
  );
};
