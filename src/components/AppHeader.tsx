import React, { useState, useEffect } from 'react';
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
  Home,
  Bell,
  ChevronDown
} from 'lucide-react';
import { LanguageCode, AppRole } from '../types';
import { getTranslations } from '../i18n';
import { notificationService } from '../services/notificationService';

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
  onOpenNotifications?: () => void;
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
  onLogoutCurrentRole,
  onOpenNotifications
}) => {
  const isHi = language === 'hi';
  const t = getTranslations(language);
  const [unreadCount, setUnreadCount] = useState<number>(() => notificationService.getUnreadCount());

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount());
    });
    return unsub;
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#062B1E] dark:bg-[#051F15] text-white border-b border-[#0D4430] shadow-md transition-colors w-full">
      {/* Universal Government Top Strip */}
      <div className="bg-[#042016] text-[#A7D7C1] text-[11px] font-medium px-4 sm:px-6 py-1 border-b border-[#0A3825] w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#DDF4E9]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isHi ? 'कृषि एवं किसान कल्याण मंत्रालय • भारत सरकार' : 'Ministry of Agriculture & Farmers Welfare • Govt of India'}</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden md:inline text-white/70">
              {isHi ? 'राष्ट्रीय ई-मंडी उपार्जन नेटवर्क' : 'National e-Mandi Procurement Network'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
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
              <span className="hidden sm:inline">{isOffline ? t.offlineCached : t.onlineSync}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Smart Mandi Brand & Universal Farmer Bar (Directly matching design reference) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 w-full">
        
        {/* Left Brand Identity: Golden Sprout + Smart Mandi + किसान सेवा पोर्टल */}
        <div 
          onClick={onGoToLanding}
          className={`flex items-center gap-3 ${onGoToLanding ? 'cursor-pointer group' : ''}`}
          role={onGoToLanding ? 'button' : undefined}
          title={onGoToLanding ? t.returnToPortalGateway : undefined}
        >
          {/* Circular Golden Sprout Badge */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0D4A34] flex items-center justify-center text-amber-400 shadow-sm border border-[#168A5B]/50 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-bold font-serif-display text-white tracking-tight leading-tight">
                Smart Mandi
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#12533C] text-emerald-300 border border-[#168A5B]/40 hidden md:inline-block">
                {currentRole === 'landing' ? (isHi ? 'पोर्टल प्रवेश' : 'Portal Gateway') : currentRole === 'supervisor' ? (isHi ? 'मंडी पर्यवेक्षक' : 'Supervisor') : currentRole === 'superadmin' ? (isHi ? 'राज्य प्रशासन' : 'Super Admin') : (isHi ? 'किसान पोर्टल' : 'Farmer Portal')}
              </span>
            </div>
            <p className="text-[11px] font-medium text-amber-300/90 leading-tight">
              {isHi ? 'किसान सेवा पोर्टल' : 'Farmer Service Portal'}
            </p>
          </div>
        </div>

        {/* Center Slogan Banner (As shown in screenshot) */}
        <div className="hidden xl:flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-[#083827] border border-[#168A5B]/40 text-xs font-semibold text-emerald-200 tracking-wide flex items-center gap-2">
            <span>🌱</span>
            <span>{isHi ? 'किसान का भरोसा • डिजिटल मंडी • समृद्ध भारत' : 'Trust of Farmer • Digital Mandi • Prosperous India'}</span>
          </div>
        </div>

        {/* Right Universal Actions: Toll-Free Pill, Notifications, Language, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Toll-Free Support Pill (Directly from design reference) */}
          <a 
            href="tel:18001801551" 
            title={isHi ? 'किसान टोल-फ्री हेल्पलाइन' : 'Kisan Toll-Free Helpline'} 
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-bold text-xs px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-400/40 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="font-mono">1800-180-1551</span>
            <span className="hidden sm:inline text-[10px] font-normal text-amber-200/80">({isHi ? 'टोल-फ्री' : 'Toll-Free'})</span>
          </a>

          {/* Notification Bell with Badge */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-[#083827] hover:bg-[#0C4E37] text-emerald-200 border border-[#168A5B]/40 transition-all cursor-pointer"
            title={isHi ? 'सूचनाएं' : 'Notifications'}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center px-1 border-2 border-[#062B1E]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Multilingual Selector (Dropdown matching screenshot) */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-emerald-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              aria-label="Language selector"
              className="pl-7 pr-3 py-1.5 text-xs font-bold bg-[#083827] hover:bg-[#0C4E37] border border-[#168A5B]/40 rounded-xl text-emerald-200 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer transition-colors"
            >
              <option value="hi" className="bg-[#062B1E] text-white">हिन्दी</option>
              <option value="en" className="bg-[#062B1E] text-white">English</option>
              <option value="mr" className="bg-[#062B1E] text-white">मराठी</option>
              <option value="pa" className="bg-[#062B1E] text-white">ਪੰਜਾਬੀ</option>
            </select>
          </div>

          {/* Outdoor Sunlight Mode Toggle */}
          <button
            onClick={onToggleOutdoorMode}
            title={outdoorMode ? t.outdoorModeActive : t.outdoorMode}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all hidden md:flex items-center justify-center ${
              outdoorMode 
                ? 'bg-amber-400 text-black border-black ring-2 ring-amber-500' 
                : 'bg-[#083827] text-emerald-200 border-[#168A5B]/40 hover:bg-[#0C4E37]'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? t.switchLightMode : t.switchDarkMode}
            className="p-2 rounded-xl text-xs font-semibold bg-[#083827] hover:bg-[#0C4E37] text-emerald-200 border border-[#168A5B]/40 transition-all hidden md:flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-300" />}
          </button>

          {/* Role / Farmer Account Button */}
          {currentRole === 'landing' && onOpenFarmerLogin && (
            <button
              onClick={onOpenFarmerLogin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#168A5B] hover:bg-[#1E9E6B] text-white transition-all shadow-sm cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'लॉगिन करें' : 'Sign In'}</span>
            </button>
          )}

          {currentRole === 'farmer' && onOpenFarmerLogin && (
            <button
              onClick={onOpenFarmerLogin}
              title={farmerName ? `Signed in as ${farmerName}` : t.kisanLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0D4A34] text-white border border-[#168A5B]/60 hover:bg-[#125A3F] transition-all shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-[10px]">
                {farmerName ? farmerName.charAt(0) : 'K'}
              </div>
              <span className="hidden sm:inline">
                {farmerName ? farmerName.split(' ')[0] : (isHi ? 'किसान' : 'Farmer')}
              </span>
            </button>
          )}

          {/* Sign Out for Authenticated Roles */}
          {(currentRole === 'farmer' || currentRole === 'supervisor' || currentRole === 'superadmin') && onLogoutCurrentRole && (
            <button
              onClick={onLogoutCurrentRole}
              title={isHi ? 'लॉगआउट' : 'Sign Out'}
              className="p-2 rounded-xl text-xs font-bold bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/40 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
