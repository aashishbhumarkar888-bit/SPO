import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Ticket, 
  Scale, 
  Banknote, 
  User, 
  Bell, 
  HelpCircle,
  Volume2, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  FarmerProfile, 
  AgriToken, 
  LanguageCode, 
  ProcurementRecord, 
  DbtTransaction,
  ServiceType
} from '../../types';
import { FarmerHomeView } from './FarmerHomeView';
import { FarmerBookingWizard } from './FarmerBookingWizard';
import { FarmerLiveQueueView } from './FarmerLiveQueueView';
import { FarmerProcurementView } from './FarmerProcurementView';
import { FarmerDbtPassbookView } from './FarmerDbtPassbookView';
import { FarmerProfileLandView } from './FarmerProfileLandView';
import { FarmerNotificationsView } from './FarmerNotificationsView';
import { FarmerHelpSupportView } from './FarmerHelpSupportView';
import { KisanMitraVoiceModal } from './KisanMitraVoiceModal';
import { notificationService } from '../../services/notificationService';
import { getTranslations } from '../../i18n';

interface FarmerAppProps {
  farmer: FarmerProfile;
  activeToken?: AgriToken;
  procurementRecords: ProcurementRecord[];
  dbtTransactions: DbtTransaction[];
  language: LanguageCode;
  isOffline: boolean;
  onAddToken: (token: AgriToken) => void;
  onOpenVoiceMitra: () => void;
  isVoiceMitraOpen: boolean;
  onCloseVoiceMitra: () => void;
  onClearSessionAndLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  outdoorMode?: boolean;
  onToggleOutdoorMode?: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
  onOpenLogin?: () => void;
}

export const FarmerApp: React.FC<FarmerAppProps> = ({
  farmer,
  activeToken,
  procurementRecords,
  dbtTransactions,
  language,
  isOffline,
  onAddToken,
  onOpenVoiceMitra,
  isVoiceMitraOpen,
  onCloseVoiceMitra,
  onClearSessionAndLogout,
  theme = 'light',
  onToggleTheme,
  outdoorMode = false,
  onToggleOutdoorMode,
  onLanguageChange,
  onOpenLogin
}) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [bookingService, setBookingService] = useState<ServiceType>('MandiSlot');
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(() => notificationService.getUnreadCount());

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setUnreadNotifsCount(notificationService.getUnreadCount());
    });
    return unsub;
  }, []);

  const t = getTranslations(language);

  const handleStartBooking = (service: ServiceType) => {
    setBookingService(service);
    setActiveTab('booking');
  };

  const handleBookingCompleted = (newToken: AgriToken) => {
    onAddToken(newToken);
    setActiveTab('queue');
  };

  // Explicit 8 destinations required by specification
  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'booking', label: t.navBooking, icon: Calendar },
    { id: 'queue', label: t.navQueue, icon: Ticket, badge: activeToken ? (language === 'hi' ? 'लाइव' : 'Live') : undefined },
    { id: 'procurement', label: t.navProcurement, icon: Scale },
    { id: 'dbt', label: t.navPayments, icon: Banknote },
    { id: 'notifications', label: t.navNotifications, icon: Bell, count: unreadNotifsCount },
    { id: 'profile', label: t.navProfile, icon: User },
    { id: 'help', label: t.navHelp, icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F6] dark:bg-[#071711] flex flex-col text-[#083324] dark:text-[#F0FAF5] selection:bg-[#E7F7EF] selection:text-[#083324] transition-colors duration-200">
      {/* Layout Container: Desktop Sidebar + Main Content Flow */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row pb-28 lg:pb-12">
        {/* Desktop Side Navigation Bar (All 8 destinations with Icon + Text) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 p-6 pr-2">
          <div className="sticky top-28 bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-3 shadow-sm space-y-1.5 transition-colors">
            {/* Farmer identity in sidebar */}
            <div className="p-3 mb-2 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#2B5E4A] transition-colors">
              <span className="text-[11px] font-bold text-[#4A6E5E] dark:text-[#85AFA0] uppercase tracking-wider block">
                {t.kisanId}
              </span>
              <p className="text-sm font-bold font-mono text-[#083324] dark:text-[#F0FAF5]">
                {farmer.kisanId}
              </p>
              <p className="text-xs text-[#0B5D3B] dark:text-[#6EE7B7] truncate mt-0.5 font-medium">
                {language === 'hi' ? farmer.fullNameHi : farmer.fullName}
              </p>
            </div>

            {/* Desktop Navigation items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E7F7EF] dark:bg-[#153A2C] text-[#083324] dark:text-[#6EE7B7] border-l-4 border-[#168A5B] dark:border-[#22A872] font-bold shadow-xs'
                      : 'text-[#4A6E5E] dark:text-[#85AFA0] hover:text-[#083324] dark:hover:text-white hover:bg-[#F5F8F6] dark:hover:bg-[#143026]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#168A5B] dark:text-[#22A872]' : 'text-[#4A6E5E] dark:text-[#85AFA0]'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#168A5B] dark:bg-[#22A872] text-white">
                        {item.badge}
                      </span>
                    )}
                    {item.count && item.count > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600 text-white">
                        {item.count}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}

            {/* Voice Assistant direct trigger in sidebar */}
            <div className="pt-3 mt-2 border-t border-[#DCE7E1] dark:border-[#1D4334]">
              <button
                type="button"
                onClick={onOpenVoiceMitra}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#12734C] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span className="truncate">{language === 'hi' ? 'किसान मित्र आवाज' : 'Kisan Mitra Voice'}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8">
          {activeTab === 'home' && (
            <FarmerHomeView
              farmer={farmer}
              activeToken={activeToken}
              recentProcurement={procurementRecords[0]}
              recentDbt={dbtTransactions[0]}
              language={language}
              onNavigateToTab={setActiveTab}
              onSelectServiceToBook={handleStartBooking}
              onOpenVoiceMitra={onOpenVoiceMitra}
            />
          )}

          {activeTab === 'booking' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Active booking notification card if token exists */}
              {activeToken && (
                <div className="p-4 sm:p-5 bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#2B5E4A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                  <div>
                    <span className="text-[11px] font-bold text-[#168A5B] dark:text-[#34D399] uppercase tracking-wider block">
                      {language === 'hi' ? 'सक्रिय निर्धारित स्लॉट' : 'Active Scheduled Slot'}
                    </span>
                    <h3 className="text-base font-bold text-[#083324] dark:text-[#F0FAF5] mt-0.5">
                      {activeToken.tokenNumber} • {activeToken.serviceType} at {language === 'hi' && activeToken.centreNameHi ? activeToken.centreNameHi : activeToken.centreName}
                    </h3>
                    <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] mt-0.5">
                      {language === 'hi' ? `परिचालन विंडो: ${activeToken.scheduledTime}` : `Scheduled Window: ${activeToken.scheduledTime}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('queue')}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#168A5B] hover:bg-[#12734C] text-white flex items-center gap-1.5 self-start sm:self-center transition-all active:scale-95 shadow-xs"
                  >
                    <span>{t.actionViewPass}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Wizard to schedule / reschedule */}
              <FarmerBookingWizard
                farmer={farmer}
                initialService={bookingService}
                language={language}
                onBookingComplete={handleBookingCompleted}
                onCancel={() => setActiveTab('home')}
              />
            </div>
          )}

          {activeTab === 'queue' && (
            activeToken ? (
              <FarmerLiveQueueView
                token={activeToken}
                farmer={farmer}
                language={language}
                isOffline={isOffline}
                onNavigateToTab={setActiveTab}
              />
            ) : (
              <div className="max-w-2xl mx-auto p-8 sm:p-12 bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] text-center space-y-4 shadow-sm transition-colors">
                <Ticket className="w-12 h-12 text-[#4A6E5E] dark:text-[#85AFA0] mx-auto" />
                <h3 className="text-lg font-bold text-[#083324] dark:text-[#F0FAF5] font-serif-display">{t.noActiveAppointment}</h3>
                <p className="text-xs sm:text-sm text-[#4A6E5E] dark:text-[#85AFA0] max-w-md mx-auto leading-relaxed">{t.noActiveAppointmentDesc}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('booking')}
                  className="px-6 py-3 rounded-xl bg-[#168A5B] hover:bg-[#12734C] text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  {t.bookNewSlotButton}
                </button>
              </div>
            )
          )}

          {activeTab === 'procurement' && (
            <FarmerProcurementView
              records={procurementRecords}
              language={language}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'dbt' && (
            <FarmerDbtPassbookView
              farmer={farmer}
              transactions={dbtTransactions}
              language={language}
            />
          )}

          {activeTab === 'notifications' && (
            <FarmerNotificationsView
              language={language}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <FarmerProfileLandView
              farmer={farmer}
              language={language}
              onLanguageChange={onLanguageChange}
              theme={theme}
              onToggleTheme={onToggleTheme}
              outdoorMode={outdoorMode}
              onToggleOutdoorMode={onToggleOutdoorMode}
              onOpenVoiceMitra={onOpenVoiceMitra}
              onClearSessionAndLogout={onClearSessionAndLogout}
              onOpenLogin={onOpenLogin}
            />
          )}

          {activeTab === 'help' && (
            <FarmerHelpSupportView
              language={language}
              onOpenVoiceMitra={onOpenVoiceMitra}
            />
          )}
        </main>
      </div>

      {/* 
        MOBILE / TABLET BOTTOM NAVIGATION DOCK
        All 8 destinations are included with Icon + text label together.
        Horizontal scrolling with smooth snap, generous touch targets (≥48px), and high contrast active state.
      */}
      <nav 
        aria-label="Farmer Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E241C]/95 backdrop-blur-md border-t border-[#DCE7E1] dark:border-[#1D4334] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 transition-colors"
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none gap-1.5 py-0.5 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 min-w-[76px] sm:min-w-[88px] min-h-[52px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive
                    ? 'text-[#083324] dark:text-[#6EE7B7] font-bold bg-[#E7F7EF] dark:bg-[#153A2C] border-b-2 border-[#168A5B] dark:border-[#22A872] shadow-xs'
                    : 'text-[#4A6E5E] dark:text-[#85AFA0] hover:text-[#083324] dark:hover:text-white hover:bg-[#F5F8F6]'
                }`}
              >
                {item.count && item.count > 0 ? (
                  <span className="absolute top-1 right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center">
                    {item.count}
                  </span>
                ) : null}

                {item.badge && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#168A5B] dark:bg-[#34D399] animate-pulse" />
                )}

                <Icon className={`w-4 h-4 ${isActive ? 'text-[#168A5B] dark:text-[#22A872]' : 'text-[#4A6E5E] dark:text-[#85AFA0]'}`} />
                <span className="text-[11px] leading-tight whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating Kisan Mitra Voice Assistant Button */}
      <div className="fixed bottom-20 lg:bottom-8 right-5 z-40">
        <button
          type="button"
          onClick={onOpenVoiceMitra}
          title="Talk with Kisan Mitra (किसान मित्र आवाज)"
          className="h-14 px-4 rounded-full bg-[#168A5B] hover:bg-[#12734C] text-white shadow-xl flex items-center gap-2.5 transition-all active:scale-95 border-2 border-white dark:border-[#0E241C] ring-4 ring-[#168A5B]/20"
        >
          <div className="relative flex items-center">
            <Volume2 className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#083324]" />
          </div>
          <span className="text-xs font-bold font-serif-display hidden sm:inline">
            {language === 'hi' ? 'किसान मित्र' : 'Kisan Mitra'}
          </span>
        </button>
      </div>

      {/* Kisan Mitra Voice Dialog */}
      <KisanMitraVoiceModal
        isOpen={isVoiceMitraOpen}
        onClose={onCloseVoiceMitra}
        language={language}
        activeToken={activeToken}
        farmer={farmer}
        recentProcurement={procurementRecords[0]}
        recentDbt={dbtTransactions[0]}
      />
    </div>
  );
};
