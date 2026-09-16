import React, { useState, useEffect } from 'react';
import { 
  Home, 
  UserCheck, 
  Ticket, 
  MapPin, 
  Wheat, 
  Truck, 
  BarChart3, 
  HelpCircle,
  Volume2, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  QrCode,
  Calendar,
  Scale,
  Banknote,
  Bell,
  User
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
import { FarmerCentresMapView } from './FarmerCentresMapView';
import { FarmerCropPriceView } from './FarmerCropPriceView';
import { FarmerVehicleTrackingView } from './FarmerVehicleTrackingView';
import { FarmerProcurementView } from './FarmerProcurementView';
import { FarmerDbtPassbookView } from './FarmerDbtPassbookView';
import { FarmerProfileLandView } from './FarmerProfileLandView';
import { FarmerHelpSupportView } from './FarmerHelpSupportView';
import { KisanMitraVoiceModal } from './KisanMitraVoiceModal';
import { MandiGateQrModal } from './MandiGateQrModal';
import { SidebarFarmerGraphic } from '../common/AgriIllustrations';
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
  const isHi = language === 'hi';
  const t = getTranslations(language);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [bookingService, setBookingService] = useState<ServiceType>('MandiSlot');
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(() => notificationService.getUnreadCount());
  const [isGateQrOpen, setIsGateQrOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setUnreadNotifsCount(notificationService.getUnreadCount());
    });
    return unsub;
  }, []);

  const handleStartBooking = (service: ServiceType) => {
    setBookingService(service);
    setActiveTab('booking');
  };

  const handleBookingCompleted = (newToken: AgriToken) => {
    onAddToken(newToken);
    setActiveTab('queue');
  };

  // The 8 Core Destinations matching the screenshot navigation
  const navItems = [
    { 
      id: 'home', 
      labelHi: 'मुख्य पृष्ठ', 
      labelEn: 'Home', 
      icon: Home 
    },
    { 
      id: 'registration', 
      labelHi: 'मेरी पंजीकरण', 
      labelEn: 'My Registration', 
      icon: UserCheck 
    },
    { 
      id: 'queue', 
      labelHi: 'टोकन / कतार स्थिति', 
      labelEn: 'Token / Queue', 
      icon: Ticket, 
      badge: activeToken ? (isHi ? 'लाइव' : 'Live') : undefined 
    },
    { 
      id: 'mandi', 
      labelHi: 'मंडी केंद्र खोजें', 
      labelEn: 'Mandi Centers', 
      icon: MapPin 
    },
    { 
      id: 'prices', 
      labelHi: 'फसल व मूल्य जानकारी', 
      labelEn: 'Crops & Prices', 
      icon: Wheat 
    },
    { 
      id: 'tracking', 
      labelHi: 'वाहन ट्रैकिंग', 
      labelEn: 'Vehicle Tracking', 
      icon: Truck 
    },
    { 
      id: 'reports', 
      labelHi: 'रिपोर्ट / विश्लेषण', 
      labelEn: 'Reports & DBT', 
      icon: BarChart3 
    },
    { 
      id: 'help', 
      labelHi: 'मदद एवं सहायता', 
      labelEn: 'Help & Support', 
      icon: HelpCircle 
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#071711] flex flex-col text-[#083324] dark:text-[#F0FAF5] selection:bg-[#E7F7EF] selection:text-[#083324] transition-colors duration-200">
      
      {/* Layout Container: Desktop Deep Forest Green Sidebar + Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row pb-28 lg:pb-12">
        
        {/* DESKTOP SIDE NAVIGATION BAR (Forest Green matching design reference) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 p-5 pr-2">
          <div className="sticky top-28 bg-[#062B1E] dark:bg-[#051F15] rounded-3xl border border-[#0D4430] p-3.5 shadow-md space-y-2 text-white transition-colors">
            
            {/* Farmer identity in sidebar */}
            <div className="p-3 mb-1 rounded-2xl bg-[#0B3A29] border border-[#168A5B]/40">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                {isHi ? 'सत्यापित किसान' : 'Verified Farmer'}
              </span>
              <p className="text-xs font-bold font-mono text-white truncate mt-0.5">
                {farmer.kisanId}
              </p>
              <p className="text-xs text-emerald-200 truncate font-semibold">
                {isHi ? farmer.fullNameHi : farmer.fullName}
              </p>
            </div>

            {/* Desktop Navigation items matching screenshot */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.id === 'queue' && activeTab === 'booking');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#168A5B] text-white font-bold shadow-sm'
                        : 'text-emerald-100/80 hover:text-white hover:bg-[#0B3A29]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-300'}`} />
                      <span className="whitespace-nowrap">{isHi ? item.labelHi : item.labelEn}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Graphic: Indian Farmer in Turban holding phone + 'स्मार्ट किसान सशक्त किसान' */}
            <div className="pt-2">
              <SidebarFarmerGraphic className="w-full h-auto rounded-2xl shadow-xs" />
            </div>

            {/* Voice Assistant direct trigger */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenVoiceMitra}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-black flex-shrink-0" />
                <span className="truncate">{isHi ? 'किसान मित्र आवाज से पूछें' : 'Ask Kisan Mitra Voice'}</span>
              </button>
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-7">
          
          {/* 1. HOME VIEW (Faithful to design reference) */}
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
              onOpenGatePassQr={() => setIsGateQrOpen(true)}
            />
          )}

          {/* 2. REGISTRATION VIEW (Land Parcels, Khasra, Soil Health Card) */}
          {activeTab === 'registration' && (
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

          {/* 3. TOKEN / LIVE QUEUE VIEW */}
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
              <div className="max-w-2xl mx-auto p-8 sm:p-12 bg-white dark:bg-[#0E241C] rounded-3xl border border-[#DCE7E1] dark:border-[#1D4334] text-center space-y-4 shadow-sm transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF8F0] dark:bg-[#143026] text-[#168A5B] flex items-center justify-center mx-auto">
                  <Ticket className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#083324] dark:text-[#F0FAF5] font-serif-display">
                  {t.noActiveAppointment}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A6E5E] dark:text-[#85AFA0] max-w-md mx-auto leading-relaxed">
                  {t.noActiveAppointmentDesc}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('booking')}
                  className="px-6 py-3 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {t.bookNewSlotButton}
                </button>
              </div>
            )
          )}

          {/* 3B. BOOKING WIZARD SUB-VIEW */}
          {activeTab === 'booking' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {activeToken && (
                <div className="p-4 sm:p-5 bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#2B5E4A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                  <div>
                    <span className="text-[11px] font-bold text-[#168A5B] dark:text-[#34D399] uppercase tracking-wider block">
                      {isHi ? 'सक्रिय निर्धारित स्लॉट' : 'Active Scheduled Slot'}
                    </span>
                    <h3 className="text-base font-bold text-[#083324] dark:text-[#F0FAF5] mt-0.5">
                      {activeToken.tokenNumber} • {activeToken.serviceType}
                    </h3>
                    <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] mt-0.5">
                      {isHi ? `परिचालन विंडो: ${activeToken.scheduledTime}` : `Scheduled Window: ${activeToken.scheduledTime}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('queue')}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white flex items-center gap-1.5 self-start sm:self-center transition-all active:scale-95 shadow-xs"
                  >
                    <span>{t.actionViewPass}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <FarmerBookingWizard
                farmer={farmer}
                initialService={bookingService}
                language={language}
                onBookingComplete={handleBookingCompleted}
                onCancel={() => setActiveTab('home')}
              />
            </div>
          )}

          {/* 4. MANDI LOCATOR VIEW */}
          {activeTab === 'mandi' && (
            <FarmerCentresMapView
              language={language}
              onBookAtCentre={() => setActiveTab('booking')}
            />
          )}

          {/* 5. CROP & PRICE DIRECTORY (MSP & Mandi Bhav) */}
          {activeTab === 'prices' && (
            <FarmerCropPriceView
              language={language}
              onBookCrop={(crop) => {
                setBookingService('MandiSlot');
                setActiveTab('booking');
              }}
            />
          )}

          {/* 6. VEHICLE TRANSIT & GATE TRACKING */}
          {activeTab === 'tracking' && (
            <FarmerVehicleTrackingView
              language={language}
              activeToken={activeToken}
              onOpenGatePassQr={() => setIsGateQrOpen(true)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {/* 7. REPORTS / WEIGHMENT & DBT PASSBOOK */}
          {activeTab === 'reports' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <FarmerProcurementView
                records={procurementRecords}
                language={language}
                onNavigateToTab={setActiveTab}
              />

              <div className="border-t border-[#DCE7E1] dark:border-[#1D4334] pt-6">
                <FarmerDbtPassbookView
                  farmer={farmer}
                  transactions={dbtTransactions}
                  language={language}
                />
              </div>
            </div>
          )}

          {/* 8. HELP & SUPPORT / GRIEVANCE */}
          {activeTab === 'help' && (
            <FarmerHelpSupportView
              language={language}
              onOpenVoiceMitra={onOpenVoiceMitra}
            />
          )}

        </main>
      </div>

      {/* 
        MOBILE / TABLET BOTTOM NAVIGATION DOCK (Matching all 8 destinations from screenshot)
      */}
      <nav 
        aria-label="Farmer Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#062B1E]/95 backdrop-blur-md border-t border-[#0D4430] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] px-1.5 py-1.5 transition-colors"
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none gap-1 py-0.5 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'queue' && activeTab === 'booking');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 min-w-[72px] sm:min-w-[84px] min-h-[50px] py-1.5 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive
                    ? 'text-white font-bold bg-[#168A5B] shadow-xs'
                    : 'text-emerald-200/80 hover:text-white hover:bg-[#0B3A29]'
                }`}
              >
                {item.badge && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}

                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-300'}`} />
                <span className="text-[10px] leading-tight whitespace-nowrap">
                  {isHi ? item.labelHi : item.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating Kisan Mitra Voice Assistant Button (With speech indicator) */}
      <div className="fixed bottom-20 lg:bottom-8 right-5 z-40 flex items-center gap-2">
        <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-white dark:bg-[#0E241C] border border-[#DCE7E1] dark:border-[#1D4334] text-xs font-bold text-[#062B1E] dark:text-[#F0FAF5] shadow-lg animate-bounce">
          <span>{isHi ? 'आवाज से पूछें ➜' : 'Ask by Voice ➜'}</span>
        </div>

        <button
          type="button"
          onClick={onOpenVoiceMitra}
          title="Talk with Kisan Mitra (किसान मित्र आवाज)"
          className="h-14 px-4 rounded-full bg-[#168A5B] hover:bg-[#0B5D3B] text-white shadow-2xl flex items-center gap-2.5 transition-all active:scale-95 border-2 border-white dark:border-[#0E241C] ring-4 ring-[#168A5B]/30 cursor-pointer"
        >
          <div className="relative flex items-center">
            <Volume2 className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#062B1E]" />
          </div>
          <span className="text-xs font-bold font-serif-display">
            {isHi ? 'किसान मित्र ❯' : 'Kisan Mitra ❯'}
          </span>
        </button>
      </div>

      {/* Kisan Mitra Voice Assistant Modal */}
      <KisanMitraVoiceModal
        isOpen={isVoiceMitraOpen}
        onClose={onCloseVoiceMitra}
        language={language}
        activeToken={activeToken}
        farmer={farmer}
        recentProcurement={procurementRecords[0]}
        recentDbt={dbtTransactions[0]}
      />

      {/* Mandi Gate Pass Digital QR Modal */}
      {activeToken && (
        <MandiGateQrModal
          isOpen={isGateQrOpen}
          onClose={() => setIsGateQrOpen(false)}
          token={activeToken}
          farmer={farmer}
          language={language}
        />
      )}

    </div>
  );
};
