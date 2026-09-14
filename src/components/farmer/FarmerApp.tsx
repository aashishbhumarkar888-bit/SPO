import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PlusCircle, 
  Ticket, 
  Scale, 
  Banknote, 
  User, 
  MapPin, 
  Volume2, 
  Sparkles,
  Smartphone,
  PhoneCall,
  Bell
} from 'lucide-react';
import { 
  FarmerProfile, 
  AgriToken, 
  LanguageCode, 
  ProcurementRecord, 
  DbtTransaction,
  ServiceType,
  ServiceCentre
} from '../../types';
import { FarmerHomeView } from './FarmerHomeView';
import { FarmerBookingWizard } from './FarmerBookingWizard';
import { FarmerLiveQueueView } from './FarmerLiveQueueView';
import { FarmerProcurementView } from './FarmerProcurementView';
import { FarmerDbtPassbookView } from './FarmerDbtPassbookView';
import { FarmerProfileLandView } from './FarmerProfileLandView';
import { FarmerCentresMapView } from './FarmerCentresMapView';
import { FarmerNotificationsView } from './FarmerNotificationsView';
import { KisanMitraVoiceModal } from './KisanMitraVoiceModal';
import { notificationService } from '../../services/notificationService';
import { TRANSLATIONS } from '../../data/agriMockData';

interface FarmerAppProps {
  farmer: FarmerProfile;
  activeToken?: AgriToken;
  procurementRecords: ProcurementRecord[];
  dbtTransactions: DbtTransaction[];
  language: LanguageCode;
  isOffline: boolean;
  mobileFrameMode: boolean;
  onAddToken: (token: AgriToken) => void;
  onOpenVoiceMitra: () => void;
  isVoiceMitraOpen: boolean;
  onCloseVoiceMitra: () => void;
}

export const FarmerApp: React.FC<FarmerAppProps> = ({
  farmer,
  activeToken,
  procurementRecords,
  dbtTransactions,
  language,
  isOffline,
  mobileFrameMode,
  onAddToken,
  onOpenVoiceMitra,
  isVoiceMitraOpen,
  onCloseVoiceMitra
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

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleStartBooking = (service: ServiceType) => {
    setBookingService(service);
    setActiveTab('book');
  };

  const handleBookingCompleted = (newToken: AgriToken) => {
    onAddToken(newToken);
    setActiveTab('queue');
  };

  const handleBookAtSpecificCentre = (centre: ServiceCentre) => {
    setBookingService('MandiSlot');
    setActiveTab('book');
  };

  const content = (
    <div className="flex flex-col min-h-[calc(100vh-120px)] pb-24">
      {/* Sub-view Content */}
      <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
        {activeTab === 'home' && (
          <FarmerHomeView
            farmer={farmer}
            activeToken={activeToken}
            language={language}
            onNavigateToTab={setActiveTab}
            onSelectServiceToBook={handleStartBooking}
            onOpenVoiceMitra={onOpenVoiceMitra}
          />
        )}

        {activeTab === 'book' && (
          <FarmerBookingWizard
            farmer={farmer}
            preselectedService={bookingService}
            language={language}
            onBookingCompleted={handleBookingCompleted}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'queue' && activeToken && (
          <FarmerLiveQueueView
            token={activeToken}
            farmer={farmer}
            language={language}
            isOffline={isOffline}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'queue' && !activeToken && (
          <div className="text-center py-16 space-y-4 editorial-card rounded-2xl p-6">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-[#063B2A]">
              {language === 'hi' ? 'कोई सक्रिय टोकन नहीं है' : 'No Active Token'}
            </h3>
            <p className="text-xs text-[#063B2A]/60 max-w-sm mx-auto">
              {language === 'hi' 
                ? 'आपने वर्तमान में कोई कतार टोकन नहीं लिया है। नई सेवा बुक करने के लिए नीचे बटन दबाएं।' 
                : 'You have no current appointment. Book a new slot to get your live queue pass.'}
            </p>
            <button
              onClick={() => setActiveTab('book')}
              className="px-5 py-2.5 rounded-xl bg-[#168A5B] text-white font-bold text-xs"
            >
              {t.bookService}
            </button>
          </div>
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

        {activeTab === 'profile' && (
          <FarmerProfileLandView
            farmer={farmer}
            language={language}
          />
        )}

        {activeTab === 'centres' && (
          <FarmerCentresMapView
            language={language}
            onBookAtCentre={handleBookAtSpecificCentre}
          />
        )}

        {activeTab === 'notifications' && (
          <FarmerNotificationsView
            language={language}
            onNavigateToTab={setActiveTab}
          />
        )}
      </div>

      {/* Farmer Bottom Navigation (56px+ Touch Targets, High Contrast, Icons + Bilingual Text) */}
      <nav 
        aria-label="Farmer Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D7E3DC] shadow-[0_-4px_20px_rgba(6,59,42,0.06)]"
      >
        <div className="max-w-xl mx-auto px-2 py-1.5 flex items-center justify-around gap-1">
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all touch-target-56 ${
              activeTab === 'home'
                ? 'text-[#168A5B] font-bold bg-[#DDF4E9]/60'
                : 'text-[#063B2A]/60 hover:text-[#063B2A]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight leading-none">
              {language === 'hi' ? 'होम' : 'Home'}
            </span>
          </button>

          {/* Book */}
          <button
            onClick={() => setActiveTab('book')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all touch-target-56 ${
              activeTab === 'book'
                ? 'text-[#168A5B] font-bold bg-[#DDF4E9]/60'
                : 'text-[#063B2A]/60 hover:text-[#063B2A]'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] tracking-tight leading-none">
              {language === 'hi' ? 'बुकिंग' : 'Book'}
            </span>
          </button>

          {/* Live Pass */}
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative touch-target-56 ${
              activeTab === 'queue'
                ? 'text-[#168A5B] font-bold bg-[#DDF4E9]/60'
                : 'text-[#063B2A]/60 hover:text-[#063B2A]'
            }`}
          >
            {activeToken && (
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
            <Ticket className="w-5 h-5" />
            <span className="text-[10px] tracking-tight leading-none">
              {language === 'hi' ? 'टोकन' : 'Pass'}
            </span>
          </button>

          {/* Mandi & Weighbridge */}
          <button
            onClick={() => setActiveTab('procurement')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all touch-target-56 ${
              activeTab === 'procurement'
                ? 'text-[#168A5B] font-bold bg-[#DDF4E9]/60'
                : 'text-[#063B2A]/60 hover:text-[#063B2A]'
            }`}
          >
            <Scale className="w-5 h-5" />
            <span className="text-[10px] tracking-tight leading-none">
              {language === 'hi' ? 'तौल पर्ची' : 'Mandi'}
            </span>
          </button>

          {/* DBT Passbook */}
          <button
            onClick={() => setActiveTab('dbt')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all touch-target-56 ${
              activeTab === 'dbt'
                ? 'text-[#168A5B] font-bold bg-[#DDF4E9]/60'
                : 'text-[#063B2A]/60 hover:text-[#063B2A]'
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-[10px] tracking-tight leading-none">
              {language === 'hi' ? 'डीबीटी' : 'DBT'}
            </span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative touch-target-56 ${
              activeTab === 'notifications'
                ? 'text-[#168A5B] font-bold bg-[#DDF4E9]/60'
                : 'text-[#063B2A]/60 hover:text-[#063B2A]'
            }`}
          >
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
            <Bell className="w-5 h-5" />
            <span className="text-[10px] tracking-tight leading-none">
              {language === 'hi' ? 'अलर्ट' : 'Alerts'}
            </span>
          </button>

          {/* Profile & 7/12 */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all touch-target-56 ${
              activeTab === 'profile'
                ? 'text-[#168A5B] font-bold bg-[#DDF4E9]/60'
                : 'text-[#063B2A]/60 hover:text-[#063B2A]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-tight leading-none">
              {language === 'hi' ? 'भूमि' : 'Profile'}
            </span>
          </button>
        </div>
      </nav>

      {/* Floating 56px Voice Assistant Trigger */}
      <div className="fixed bottom-20 right-5 z-40">
        <button
          onClick={onOpenVoiceMitra}
          title="Kisan Mitra AI Voice Support (किसान मित्र आवाज)"
          className="w-14 h-14 rounded-full bg-[#168A5B] hover:bg-[#0B5D3B] text-white shadow-2xl flex items-center justify-center transition-transform active:scale-90 ring-4 ring-emerald-500/20"
        >
          <div className="relative">
            <Volume2 className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-emerald-950"></span>
          </div>
        </button>
      </div>

      {/* Voice Assistant Dialog */}
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

  // If mobileFrameMode is toggled on wide screens, frame it inside a clean smartphone bezel!
  if (mobileFrameMode) {
    return (
      <div className="py-6 px-4 flex items-center justify-center bg-[#E5EFE9]/60 min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-[430px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-800 overflow-hidden relative flex flex-col min-h-[820px] max-h-[90vh]">
          {/* Simulated Mobile Status Notch */}
          <div className="bg-slate-800 text-white text-[11px] px-6 py-1 flex items-center justify-between select-none">
            <span className="font-semibold font-mono">11:06</span>
            <div className="w-20 h-3.5 bg-black rounded-full mx-auto"></div>
            <span className="text-[10px]">5G • 98%</span>
          </div>

          {/* Device Scroll Area */}
          <div className="flex-1 overflow-y-auto">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render full fluid responsive view
  return content;
};
