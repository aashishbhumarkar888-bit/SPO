import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings2, 
  Sliders, 
  Languages, 
  Megaphone, 
  Building2, 
  Users, 
  CheckCircle2, 
  Save, 
  AlertTriangle, 
  Plus, 
  Radio, 
  Sparkles,
  Volume2,
  User,
  LogOut
} from 'lucide-react';
import { BusinessRuleConfig, LanguageCode, SuperAdminSession } from '../../types';
import { INITIAL_BUSINESS_RULES } from '../../data/agriMockData';
import { speakAnnouncement, playAudioChime } from '../../utils/speech';
import { IntegrationBadge } from '../common/IntegrationBadge';
import { SuperAdminProfileTab } from './SuperAdminProfileTab';

interface SuperAdminConsoleProps {
  language: LanguageCode;
  onExit?: () => void;
  session?: SuperAdminSession | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({ 
  language, 
  onExit,
  session,
  theme,
  onToggleTheme,
  onLanguageChange 
}) => {
  const [activeTab, setActiveTab] = useState<'network' | 'rules' | 'users' | 'languages' | 'broadcast' | 'profile'>('rules');
  const [rules, setRules] = useState<BusinessRuleConfig>(INITIAL_BUSINESS_RULES);
  const [broadcastText, setBroadcastText] = useState(INITIAL_BUSINESS_RULES.alertEmergencyBroadcast);
  const [broadcastTextHi, setBroadcastTextHi] = useState(INITIAL_BUSINESS_RULES.alertEmergencyBroadcastHi);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Mock RBAC users
  const [adminUsers, setAdminUsers] = useState([
    { id: 'USR-1', name: 'D. S. Kulkarni', role: 'Kendra Supervisor', centre: 'Wardha Central Kendra', status: 'Active' },
    { id: 'USR-2', name: 'Sunil Meshram', role: 'Weighbridge Operator', centre: 'APMC Mandi Yard #2', status: 'Active' },
    { id: 'USR-3', name: 'Dr. Anita Roy', role: 'Chief Agronomist & Lab Head', centre: 'Mobile Soil Health Hub', status: 'Active' },
    { id: 'USR-4', name: 'Pravin Wankhede', role: 'Drone Fleet Lead', centre: 'Sevagram Hub', status: 'Active' }
  ]);

  const [rulesSavedMsg, setRulesSavedMsg] = useState<string | null>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Kendra Supervisor');
  const [newStaffCentre, setNewStaffCentre] = useState('Wardha Central Kendra');

  const handleSaveRules = () => {
    playAudioChime();
    setRulesSavedMsg('Business Rules & Dynamic MSP Policy Engine updated successfully across all 12 Kendras! Synchronized with MSAMB state gateway.');
    setTimeout(() => setRulesSavedMsg(null), 6000);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    const newOfficer = {
      id: `USR-${adminUsers.length + 1}`,
      name: newStaffName.trim(),
      role: newStaffRole,
      centre: newStaffCentre,
      status: 'Active'
    };
    setAdminUsers(prev => [...prev, newOfficer]);
    setNewStaffName('');
    setIsAddStaffOpen(false);
    playAudioChime();
  };

  const handleSendBroadcast = () => {
    playAudioChime();
    setBroadcastSuccess(true);
    speakAnnouncement(broadcastTextHi, 'hi');
    setTimeout(() => setBroadcastSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Super Admin Top Banner */}
      <div className="bg-[#063B2A] text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#0B5D3B]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[#DDF4E9] text-[10px] font-bold uppercase tracking-wider">
              Strategic State Governance Portal
            </span>
            <span className="text-xs text-emerald-300 font-mono">DISTRICT: WARDHA (ZONE-IV)</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-display tracking-tight text-white">
            SPO — Strategic Policy & Governance Console
          </h2>
          <p className="text-xs text-white/70 mt-1">
            Configure dynamic MSP procurement rules, moisture standards, allocation policy, and state-level directives.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <span className="text-[10px] text-white/70 block">Connected Kendras</span>
            <span className="text-xl font-mono-numbers font-bold text-emerald-300">12 / 12 Online</span>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-[#063B2A] border-emerald-400 font-extrabold shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-2 text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white rounded-xl border border-red-500 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Securely exit governance console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Console</span>
            </button>
          )}
        </div>
      </div>

      {/* Super Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#D7E3DC] pb-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'rules'
              ? 'bg-[#063B2A] text-white shadow-xs'
              : 'text-[#063B2A]/70 hover:text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Policy & Business Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'network'
              ? 'bg-[#063B2A] text-white shadow-xs'
              : 'text-[#063B2A]/70 hover:text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Centres Network (12)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'users'
              ? 'bg-[#063B2A] text-white shadow-xs'
              : 'text-[#063B2A]/70 hover:text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Role Permissions (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'broadcast'
              ? 'bg-[#063B2A] text-white shadow-xs'
              : 'text-[#063B2A]/70 hover:text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Emergency Broadcaster</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'profile'
              ? 'bg-[#063B2A] text-white shadow-xs'
              : 'text-[#063B2A]/70 hover:text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Security</span>
        </button>
      </div>

      {/* TAB 1: Business Rules & MSP Engine */}
      {activeTab === 'rules' && (
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-6 space-y-6 shadow-sm">
          {rulesSavedMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-400 text-emerald-950 flex items-center justify-between gap-3 text-xs font-bold animate-fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{rulesSavedMsg}</span>
              </div>
              <button
                onClick={() => setRulesSavedMsg(null)}
                className="text-emerald-700 hover:text-emerald-950 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-[#E4EBE6] pb-4">
            <div>
              <h3 className="font-bold text-base text-[#063B2A]">
                Dynamic Agricultural Policy & MSP Pricing Engine
              </h3>
              <p className="text-xs text-[#063B2A]/70 mt-0.5">
                Parameters take immediate effect across all weighbridges and farmer booking algorithms
              </p>
            </div>

            <button
              onClick={handleSaveRules}
              className="px-5 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Policy Changes</span>
            </button>
          </div>

          {/* MSP Table Editor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B2A]">
              Minimum Support Prices (MSP) & FAQ Moisture Limits
            </h4>

            <div className="overflow-x-auto border border-[#D7E3DC] rounded-xl">
              <table className="w-full text-left text-xs text-[#063B2A]">
                <thead className="bg-[#F0F5F2] font-bold border-b border-[#D7E3DC] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Crop Variety</th>
                    <th className="py-3 px-4">Govt MSP (₹/Quintal)</th>
                    <th className="py-3 px-4">Max Moisture for FAQ Grade A</th>
                    <th className="py-3 px-4">Deduction / % Moisture Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4EBE6]">
                  {rules.mspRates.map((rate, idx) => (
                    <tr key={idx} className="hover:bg-[#F6F9F7]">
                      <td className="py-3 px-4 font-bold">{rate.crop}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={rate.msp}
                          onChange={(e) => {
                            const newMsp = Number(e.target.value);
                            setRules(prev => {
                              const updated = [...prev.mspRates];
                              updated[idx].msp = newMsp;
                              return { ...prev, mspRates: updated };
                            });
                          }}
                          className="w-28 p-1.5 border rounded-lg font-mono font-bold"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          step="0.1"
                          value={rate.maxMoistureFAQ}
                          onChange={(e) => {
                            const newMoist = Number(e.target.value);
                            setRules(prev => {
                              const updated = [...prev.mspRates];
                              updated[idx].maxMoistureFAQ = newMoist;
                              return { ...prev, mspRates: updated };
                            });
                          }}
                          className="w-24 p-1.5 border rounded-lg font-mono font-bold"
                        />
                        <span className="ml-1 text-slate-500">%</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        ₹{rate.deductionPerMoisturePoint.toFixed(2)}/Q
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mechanization and Pacing Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6] space-y-2">
              <label className="text-xs font-bold text-[#063B2A] block">
                SMAM Machinery Rental Subsidy (%)
              </label>
              <input
                type="number"
                value={rules.subsidyDiscountPctSmallFarmers}
                onChange={(e) => setRules(prev => ({ ...prev, subsidyDiscountPctSmallFarmers: Number(e.target.value) }))}
                className="w-full p-2 text-xs font-bold bg-white border rounded-lg"
              />
              <span className="text-[10px] text-slate-500 block">Applied to farmers under 2 hectares</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6] space-y-2">
              <label className="text-xs font-bold text-[#063B2A] block">
                Hourly Queue Pacing Limit (Farmers/Hour)
              </label>
              <input
                type="number"
                value={rules.queuePacingPerHour}
                onChange={(e) => setRules(prev => ({ ...prev, queuePacingPerHour: Number(e.target.value) }))}
                className="w-full p-2 text-xs font-bold bg-white border rounded-lg"
              />
              <span className="text-[10px] text-slate-500 block">Limits gate vehicular congestion</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6] space-y-2">
              <label className="text-xs font-bold text-[#063B2A] block">
                Max Daily Bookings Per Farmer
              </label>
              <input
                type="number"
                value={rules.maxDailyBookingsPerFarmer}
                onChange={(e) => setRules(prev => ({ ...prev, maxDailyBookingsPerFarmer: Number(e.target.value) }))}
                className="w-full p-2 text-xs font-bold bg-white border rounded-lg"
              />
              <span className="text-[10px] text-slate-500 block">Prevents hoarding of hiring slots</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Centres Network Status */}
      {activeTab === 'network' && (
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#063B2A]">
              District Service Centres & APMC Yards (Wardha Sector)
            </h3>
            <span className="text-xs text-emerald-700 font-bold">100% Operational Uptime</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { name: 'Wardha Central AgriSeva Kendra', type: 'Main Kendra', queue: 6, tonnage: '42.2 MT' },
              { name: 'APMC Mandi Yard & Weighbridge', type: 'Procurement Yard', queue: 14, tonnage: '128.6 MT' },
              { name: 'Sevagram Custom Hiring Hub', type: 'Machinery Depot', queue: 3, tonnage: '18.4 MT' },
              { name: 'Deoli Sub-Mandi Procurement', type: 'Procurement Yard', queue: 9, tonnage: '64.1 MT' },
              { name: 'Hinganghat Cotton Terminal', type: 'Cotton Special Hub', queue: 11, tonnage: '95.0 MT' },
              { name: 'Arvi Agro-Tech Center', type: 'Sub-Kendra', queue: 4, tonnage: '22.0 MT' }
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6] space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-xs text-[#063B2A]">{c.name}</h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>Current Queue: <strong>{c.queue} waiting</strong></span>
                  <span>Daily: <strong>{c.tonnage}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RBAC Users */}
      {activeTab === 'users' && (
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#063B2A]">
              Role-Based Access Control & Staff Roster
            </h3>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#168A5B] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#0B5D3B] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>
          </div>

          {/* Add Staff Modal */}
          {isAddStaffOpen && (
            <form onSubmit={handleAddStaffSubmit} className="p-4 rounded-xl bg-[#F6F9F7] border border-[#C7DCD1] space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-[#063B2A] uppercase tracking-wider">
                  Add New Mandi / Kendra Staff Officer
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#063B2A]/70 font-semibold mb-1">Officer Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Shinde"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#C7DCD1] bg-white text-[#063B2A] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#063B2A]/70 font-semibold mb-1">Designation / Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#C7DCD1] bg-white text-[#063B2A] font-medium"
                  >
                    <option value="Kendra Supervisor">Kendra Supervisor</option>
                    <option value="Weighbridge Operator">Weighbridge Operator</option>
                    <option value="Quality Assayer">Quality Assayer</option>
                    <option value="Fleet Dispatcher">Fleet Dispatcher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#063B2A]/70 font-semibold mb-1">Assigned Kendra</label>
                  <select
                    value={newStaffCentre}
                    onChange={(e) => setNewStaffCentre(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#C7DCD1] bg-white text-[#063B2A] font-medium"
                  >
                    <option value="Wardha Central Kendra">Wardha Central Kendra</option>
                    <option value="APMC Mandi Yard #2">APMC Mandi Yard #2</option>
                    <option value="Sevagram Hub">Sevagram Hub</option>
                    <option value="Deoli Sub-Yard">Deoli Sub-Yard</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold shadow-xs"
                >
                  Confirm & Add Officer
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto border border-[#D7E3DC] rounded-xl">
            <table className="w-full text-left text-xs text-[#063B2A]">
              <thead className="bg-[#F0F5F2] font-bold border-b border-[#D7E3DC] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Assigned Centre</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EBE6]">
                {adminUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F6F9F7]">
                    <td className="py-3 px-4 font-bold">{u.name}</td>
                    <td className="py-3 px-4">{u.role}</td>
                    <td className="py-3 px-4 text-slate-600">{u.centre}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Emergency Weather & Pest Broadcaster */}
      {activeTab === 'broadcast' && (
        <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E4EBE6] pb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-[#063B2A] flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-red-500" />
                  <span>State-Wide Emergency Weather & Advisory Broadcaster</span>
                </h3>
                <IntegrationBadge status="INTEGRATION-READY" spec="m-Kisan IVR" featureName="Voice Broadcaster" featureId="AUD-10" />
              </div>
              <p className="text-xs text-[#063B2A]/70 mt-0.5">
                Dispatches urgent voice bulletins, SMS, and in-app emergency alerts to all registered farmers in the district.
              </p>
            </div>
          </div>

          {broadcastSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Broadcast dispatched to 14,892 registered farmer handsets via SMS and Kisan Vani Voice!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#063B2A] block mb-1">
                Hindi Emergency Announcement (किसान वाणी आवाज संदेश)
              </label>
              <textarea
                rows={3}
                value={broadcastTextHi}
                onChange={(e) => setBroadcastTextHi(e.target.value)}
                className="w-full p-3 text-xs bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#063B2A] block mb-1">
                English SMS & IVR Text
              </label>
              <textarea
                rows={2}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full p-3 text-xs bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => speakAnnouncement(broadcastTextHi, 'hi')}
                className="px-4 py-2.5 rounded-xl border border-[#D7E3DC] text-xs font-bold text-[#063B2A] flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-[#168A5B]" />
                <span>Preview Audio</span>
              </button>

              <button
                onClick={handleSendBroadcast}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Dispatch District Emergency Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Administrator Profile, Session Status & Security */}
      {activeTab === 'profile' && (
        <SuperAdminProfileTab
          session={session}
          language={language}
          onLanguageChange={onLanguageChange}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onLogout={onExit || (() => {})}
        />
      )}
    </div>
  );
};
