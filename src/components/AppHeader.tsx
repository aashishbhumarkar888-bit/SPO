import React from 'react';
import { 
  Sprout, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Globe, 
  Sun, 
  WifiOff, 
  PhoneCall, 
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { RoleMode, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/agriMockData';

interface AppHeaderProps {
  currentRole: RoleMode;
  onRoleChange: (role: RoleMode) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  outdoorMode: boolean;
  onToggleOutdoorMode: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  mobileFrameMode: boolean;
  onToggleMobileFrame: () => void;
  onOpenSihAudit?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  outdoorMode,
  onToggleOutdoorMode,
  isOffline,
  onToggleOffline,
  mobileFrameMode,
  onToggleMobileFrame,
  onOpenSihAudit
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E4EBE6] backdrop-blur-md bg-opacity-95 shadow-[0_2px_12px_rgba(6,59,42,0.04)]">
      {/* Top utility alert ribbon for national portal & offline status */}
      <div className="bg-[#063B2A] text-[#DDF4E9] text-[11px] font-medium px-4 py-1.5 flex items-center justify-between border-b border-[#0B5D3B]">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#168A5B] animate-pulse"></span>
              AgriSeva • भारत सरकार / Government of India (NeGPA)
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/80">
              Wardha District Pilot Kendra (Vidarbha Agro-Zone)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Toll-Free IVR / Call Centre */}
            <a 
              href="tel:18001801551" 
              title="Kisan Call Centre Toll-Free" 
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-medium px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>1800-180-1551</span>
              <span className="hidden sm:inline text-[10px] opacity-80">(Toll-Free)</span>
            </a>

            {/* Offline Mode Indicator */}
            <button
              onClick={onToggleOffline}
              title="Toggle Offline Resilience Simulation"
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all font-semibold ${
                isOffline 
                  ? 'bg-amber-500 text-black animate-pulse' 
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30'
              }`}
            >
              <WifiOff className="w-3 h-3" />
              <span>{isOffline ? 'Offline: Cached' : 'Online Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#168A5B] to-[#0B5D3B] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 ring-2 ring-emerald-500/20">
            <Sprout className="w-6 h-6 text-[#DDF4E9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif-display text-[#063B2A] tracking-tight">
                {t.appName}
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DDF4E9] text-[#0B5D3B] border border-[#168A5B]/30">
                Kisan First
              </span>
            </div>
            <p className="text-xs text-[#063B2A]/60 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Role Selector Tabs (Inspired by deliberate editorial craft) */}
        <nav aria-label="Role Switcher" className="hidden lg:flex items-center p-1 bg-[#F0F5F2] rounded-full border border-[#D7E3DC]">
          <button
            onClick={() => onRoleChange('farmer')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'farmer'
                ? 'bg-[#168A5B] text-white shadow-sm'
                : 'text-[#063B2A]/70 hover:text-[#063B2A] hover:bg-white/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <div className="text-left leading-tight">
              <span className="block font-bold">Kisan Mitra</span>
              <span className="text-[9px] opacity-80 block font-normal">Helps Farmer • 70%</span>
            </div>
          </button>

          <button
            onClick={() => onRoleChange('supervisor')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'supervisor'
                ? 'bg-[#0B5D3B] text-white shadow-sm'
                : 'text-[#063B2A]/70 hover:text-[#063B2A] hover:bg-white/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <div className="text-left leading-tight">
              <span className="block font-bold">Command Center</span>
              <span className="text-[9px] opacity-80 block font-normal">Field Operations • 20%</span>
            </div>
          </button>

          <button
            onClick={() => onRoleChange('superadmin')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'superadmin'
                ? 'bg-[#063B2A] text-white shadow-sm'
                : 'text-[#063B2A]/70 hover:text-[#063B2A] hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <div className="text-left leading-tight">
              <span className="block font-bold">Super Admin</span>
              <span className="text-[9px] opacity-80 block font-normal">Governance • 10%</span>
            </div>
          </button>
        </nav>

        {/* Right Controls: SIH Audit Trigger, Mobile Toggle, Outdoor Mode, Language */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* SIH Evaluation Architecture Audit Trigger */}
          {onOpenSihAudit && (
            <button
              onClick={onOpenSihAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300 transition-all active:scale-95 shadow-2xs"
              title="SIH Technical Architecture Audit (Confirmed vs Integration-Ready)"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="hidden sm:inline">SIH Tech Audit</span>
            </button>
          )}

          {/* Mobile frame toggle (for testing mobile-first farmer view on wide screens) */}
          {currentRole === 'farmer' && (
            <button
              onClick={onToggleMobileFrame}
              title={mobileFrameMode ? "Switch to Responsive View" : "Switch to Mobile Device Preview"}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                mobileFrameMode 
                  ? 'bg-[#168A5B] text-white border-[#168A5B]' 
                  : 'bg-white text-[#063B2A] border-[#D7E3DC] hover:bg-[#F0F5F2]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">{mobileFrameMode ? "Mobile Frame" : "Wide View"}</span>
            </button>
          )}

          {/* Outdoor Sunlight Contrast Toggle */}
          <button
            onClick={onToggleOutdoorMode}
            title="Toggle Outdoor Glare High-Contrast Mode (धूप में स्पष्ट देखें)"
            className={`p-2 rounded-lg text-xs border transition-colors ${
              outdoorMode 
                ? 'bg-amber-400 text-black border-black font-bold' 
                : 'bg-white text-[#063B2A] border-[#D7E3DC] hover:bg-[#F0F5F2]'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Multilingual Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-[#0B5D3B] pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="pl-7 pr-4 py-1.5 text-xs font-semibold bg-white border border-[#D7E3DC] rounded-lg text-[#063B2A] focus:outline-none focus:ring-2 focus:ring-[#168A5B] cursor-pointer"
            >
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Role Switcher Drawer Bar */}
      <div className="lg:hidden px-4 py-2 border-t border-[#E4EBE6] bg-[#F6F9F7] flex items-center justify-around gap-1">
        <button
          onClick={() => onRoleChange('farmer')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors ${
            currentRole === 'farmer'
              ? 'bg-[#168A5B] text-white'
              : 'text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          Kisan Mitra (70%)
        </button>
        <button
          onClick={() => onRoleChange('supervisor')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors ${
            currentRole === 'supervisor'
              ? 'bg-[#0B5D3B] text-white'
              : 'text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          Command Center (20%)
        </button>
        <button
          onClick={() => onRoleChange('superadmin')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors ${
            currentRole === 'superadmin'
              ? 'bg-[#063B2A] text-white'
              : 'text-[#063B2A] bg-white border border-[#D7E3DC]'
          }`}
        >
          Super Admin (10%)
        </button>
      </div>
    </header>
  );
};
