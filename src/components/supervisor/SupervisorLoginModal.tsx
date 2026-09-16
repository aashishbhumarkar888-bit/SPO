import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Building2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auditLogger } from '../../domain/auditLog';
import { SupervisorSession } from '../../types';
import { playAudioChime } from '../../utils/speech';
import { DemoCredentialsDirectory } from '../common/DemoCredentialsDirectory';
import { DemoAccountDirectoryItem } from '../../services/authService';
import { SEEDED_STAFF_ADMINS } from '../../services/firestoreDbService';
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface SupervisorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: SupervisorSession) => void;
}

export const SupervisorLoginModal: React.FC<SupervisorLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [supervisorId, setSupervisorId] = useState('SUP-WRD-01');
  const [centreId, setCentreId] = useState('CEN-1');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectDemoAccount = (account: DemoAccountDirectoryItem) => {
    if (account.identifiers.staffId) {
      setSupervisorId(account.identifiers.staffId);
    }
    if (account.demoPasscode) {
      setPasscode(account.demoPasscode);
    }
    setError(null);
  };

  if (!isOpen) return null;

  const centreNames: Record<string, string> = {
    'CEN-1': 'Wardha Central APMC Mandi Yard',
    'CEN-2': 'Sevagram Procurement Sub-Centre',
    'CEN-3': 'Deoli APMC Agricultural Hub',
    'CEN-A': 'Procurement Centre A (Mandi Yard #1)'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const staffRecord = SEEDED_STAFF_ADMINS.find(
        s => s.staffId.toLowerCase() === supervisorId.trim().toLowerCase()
      );

      if (!staffRecord) {
        throw new Error('Supervisor ID not recognized in staff registry.');
      }

      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, staffRecord.email, passcode);
      const idToken = await userCredential.user.getIdToken();

      // Establish secure server session
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server rejected staff session');
      }

      if (data.role !== 'supervisor') {
        throw new Error('Authenticated account does not have supervisor privileges');
      }

      const now = new Date();
      const expires = new Date(now.getTime() + 12 * 60 * 60 * 1000);
      const session: SupervisorSession = {
        supervisorId: staffRecord.staffId,
        officerName: staffRecord.fullName,
        designation: staffRecord.designation,
        centreId: centreId,
        centreName: centreNames[centreId] || staffRecord.centreName || 'Assigned Centre',
        loginTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokenExpiresAt: expires.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        terminalIp: '192.168.10.45 (Local APMC Intranet)',
        terminalId: 'APMC-WRD-TERM-04',
        clearanceLevel: staffRecord.clearanceLevel as any,
        activeShift: 'Standard Shift' as any
      };

      auditLogger.log({
        action: 'SUPERVISOR_AUTHENTICATED',
        actorRole: 'SUPERVISOR',
        actorId: session.supervisorId,
        targetEntity: 'OperationsConsole',
        targetId: session.centreId,
        description: `Supervisor ${session.officerName} (${session.supervisorId}) authenticated securely via Firebase & Server Session`
      });

      playAudioChime();
      onLoginSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
      auditLogger.log({
        action: 'SUPERVISOR_AUTH_FAILED',
        actorRole: 'SUPERVISOR',
        actorId: supervisorId,
        targetEntity: 'OperationsConsole',
        targetId: centreId,
        description: `Failed authentication attempt for supervisor ID ${supervisorId}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#0B5D3B]/20 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supervisor-login-title"
      >
        {/* Header */}
        <div className="bg-[#063B2A] text-white px-6 py-5 flex items-center justify-between border-b border-[#0B5D3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 id="supervisor-login-title" className="text-base font-bold text-white tracking-tight">
                Kendra Operations Terminal
              </h3>
              <p className="text-xs text-white/70">
                Department of Agriculture & Mandi Board Access
              </p>
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
              Authorized Supervisor ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                value={supervisorId}
                onChange={e => setSupervisorId(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#168A5B] bg-slate-50 font-mono"
                placeholder="e.g. SUP-WRD-01"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#063B2A] mb-1">
              Assigned Procurement Centre
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={centreId}
                onChange={e => setCentreId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#168A5B] bg-white font-medium text-[#063B2A]"
              >
                <option value="CEN-A">Procurement Centre A (Mandi Yard #1)</option>
                <option value="CEN-1">Wardha Central APMC Mandi Yard</option>
                <option value="CEN-2">Sevagram Procurement Sub-Centre</option>
                <option value="CEN-3">Deoli APMC Agricultural Hub</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#063B2A] mb-1">
              Terminal Passcode / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="password" 
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                required
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#168A5B] bg-white font-mono"
                placeholder="Enter PIN"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Official terminal credential required for field operations audit.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
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
              className="px-5 py-2 text-xs font-bold text-white bg-[#0B5D3B] hover:bg-[#063B2A] rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Operations Console'}
            </button>
          </div>

          {/* Test Environment Demo Credentials Panel */}
          {import.meta.env.DEV && (
            <DemoCredentialsDirectory
              filterRole="supervisor"
              onSelectAccount={handleSelectDemoAccount}
              defaultExpanded={true}
            />
          )}
        </form>
      </div>
    </div>
  );
};
