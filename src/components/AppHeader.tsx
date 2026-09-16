import React from 'react';
import { 
  Sprout, 
  Globe, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  PhoneCall, 
  Building2,
  ShieldCheck,
  Eye,
  User,
  LogOut,
  Home
} from 'lucide-react';
import { LanguageCode, AppRole } from '../types';
import { getTranslations } from '../i18n';

interface AppHeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  outdoorMode: boolean;
  onToggleOutdoorMode: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenFarmerLogin?: () => void;
  onOpenSupervisorLogin?: () => void;
  onOpenSuperAdminLogin?: () => void;
  farmerName?: string;
  currentRole?: AppRole;
  onGoToLanding?: () => void;
  onLogoutCurrentRole?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  outdoorMode,
  onToggleOutdoorMode,
  isOffline,
  onToggleOffline,
  onOpenFarmerLogin,
  onOpenSupervisorLogin,
  onOpenSuperAdminLogin,
  farmerName,
  currentRole = 'farmer',
  onGoToLanding,
  onLogoutCurrentRole
}) => {
  const t = getTranslations(language);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0E241C] border-b border-[#E2ECE6] dark:border-[#1D4334] shadow-[0_2px_12px_rgba(6,59,42,0.03)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)] transition-colors w-full">
      {/* Official National Agriculture Portal Header Strip */}
      <div className="bg-[#063B2A] dark:bg-[#081B13] text-[#DDF4E9] text-[11px] font-medium px-4 sm:px-6 py-1.5 border-b border-[#0B5D3B] dark:border-[#153A2C] w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold tracking-wide text-[#ECF8F2]">
              <span className="w-2 h-2 rounded-full bg-[#22A872] animate-soft-pulse"></span>
              <span>{t.govtMinistry}</span>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden md:inline text-white/80">
              {t.mandiLocation}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            {/* Toll-Free Kisan Helpline */}
            <a 
              href="tel:18001801551" 
              title={t.tollFreeLabel} 
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-medium px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span className="font-mono">{t.tollFree}</span>
              <span className="hidden sm:inline text-[10px] opacity-80">(Toll-Free)</span>
            </a>

            {/* Offline Resilience Indicator */}
            <button
              onClick={onToggleOffline}
              title={isOffline ? "Currently running on cached local records" : "Live cloud connection active"}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all font-semibold ${
                isOffline 
                  ? 'bg-amber-400 text-black border border-amber-600' 
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30'
              }`}
            >
              {isOffline ? <WifiOff className="w-3 h-3 text-black" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
              <span className="hidden xs:inline">{isOffline ? t.offlineCached : t.onlineSync}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand, Identity & Universal Citizen Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 w-full">
        {/* Brand identity - Clickable to return to Portal Gateway if onGoToLanding provided */}
        <div 
          onClick={onGoToLanding}
          className={`flex items-center gap-3 ${onGoToLanding ? 'cursor-pointer group' : ''}`}
          role={onGoToLanding ? 'button' : undefined}
          title={onGoToLanding ? t.returnToPortalGateway : undefined}
        >
          <div className="w-10 h-10 rounded-xl bg-[#063B2A] dark:bg-[#143026] flex items-center justify-center text-white shadow-sm border border-[#168A5B]/40 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold font-serif-display text-[#063B2A] dark:text-[#F0FAF5] tracking-tight">
                {t.brandName}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#DDF4E9] dark:bg-[#153A2C] text-[#063B2A] dark:text-[#6EE7B7] border border-[#168A5B]/30 hidden sm:inline-block">
                {currentRole === 'landing' ? t.portalGateway : currentRole === 'supervisor' ? t.roleSupervisorTitle : currentRole === 'superadmin' ? t.roleAdminTitle : t.roleFarmerTitle}
              </span>
            </div>
            <p className="text-[11px] text-[#2C5343] dark:text-[#85AFA0] hidden md:block">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Global Controls: Theme Toggle, Sunlight/Outdoor Mode, Language Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Back to Gateway Portal button if inside authenticated role */}
          {currentRole !== 'landing' && onGoToLanding && (
            <button
              onClick={onGoToLanding}
              title={t.gatewayHome}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#C7DCD1] dark:border-[#2B5E4A] bg-[#F4F7F5] dark:bg-[#143026] text-[#063B2A] dark:text-[#ECF8F2] hover:bg-white dark:hover:bg-[#1A3C2F] transition-all"
            >
              <Home className="w-3.5 h-3.5 text-[#168A5B]" />
              <span className="hidden lg:inline">{t.portalGateway}</span>
            </button>
          )}

          {/* Outdoor Sunlight Mode (High-contrast for bright outdoors) */}
          <button
            onClick={onToggleOutdoorMode}
            title={outdoorMode ? t.outdoorModeActive : t.outdoorMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              outdoorMode 
                ? 'bg-amber-400 text-black border-black shadow-sm ring-2 ring-amber-500' 
                : 'bg-[#F4F7F5] dark:bg-[#143026] text-[#063B2A] dark:text-[#ECF8F2] border-[#C7DCD1] dark:border-[#2B5E4A] hover:bg-white dark:hover:bg-[#1A3C2F]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">{t.outdoorMode}</span>
          </button>

          {/* Theme Toggle (Light / Dark Mode) */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? t.switchLightMode : t.switchDarkMode}
            aria-label="Toggle visual theme"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#C7DCD1] dark:border-[#2B5E4A] bg-[#F4F7F5] dark:bg-[#143026] text-[#063B2A] dark:text-[#ECF8F2] hover:bg-white dark:hover:bg-[#1A3C2F] transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">{t.lightMode}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                <span className="hidden md:inline">{t.darkMode}</span>
              </>
            )}
          </button>

          {/* Multilingual Selector with Genuine State Change */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-[#0B5D3B] dark:text-[#6EE7B7] pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              aria-label={t.languageSelect}
              className="pl-7 pr-3 py-1.5 text-xs font-semibold bg-[#F4F7F5] dark:bg-[#143026] hover:bg-white dark:hover:bg-[#1A3C2F] border border-[#C7DCD1] dark:border-[#2B5E4A] rounded-lg text-[#063B2A] dark:text-[#ECF8F2] focus:outline-none focus:ring-2 focus:ring-[#168A5B] cursor-pointer transition-colors"
            >
              <option value="hi" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">हिन्दी (Hindi)</option>
              <option value="en" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">English</option>
              <option value="mr" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">मराठी (Marathi)</option>
              <option value="pa" className="bg-white dark:bg-[#0E241C] text-black dark:text-white">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>

          {/* Citizen Farmer Login / Account Action */}
          {currentRole === 'landing' && onOpenFarmerLogin && (
            <button
              onClick={onOpenFarmerLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#168A5B] hover:bg-[#0B5D3B] text-white transition-all shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.kisanLogin}</span>
            </button>
          )}

          {currentRole === 'farmer' && onOpenFarmerLogin && (
            <button
              onClick={onOpenFarmerLogin}
              title={farmerName ? `Signed in as ${farmerName}` : t.kisanLogin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#E7F7EF] dark:bg-[#143026] text-[#0B5D3B] dark:text-[#6EE7B7] border border-[#98BFA9] dark:border-[#2B5E4A] hover:bg-[#D4EFE0] dark:hover:bg-[#1A3C2F] transition-all shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#168A5B] flex-shrink-0" />
              <span className="hidden sm:inline font-bold">
                {farmerName ? farmerName.split(' ')[0] : t.kisanLogin}
              </span>
            </button>
          )}

          {/* Exit / Logout for Authenticated Farmer, Operator or Super Admin */}
          {(currentRole === 'farmer' || currentRole === 'supervisor' || currentRole === 'superadmin') && onLogoutCurrentRole && (
            <button
              onClick={onLogoutCurrentRole}
              title="Sign Out Session"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">{t.signOut}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
