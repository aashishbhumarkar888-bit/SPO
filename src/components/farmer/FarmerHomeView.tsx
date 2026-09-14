import React from 'react';
import { 
  Tractor, 
  Store, 
  FlaskConical, 
  Wheat, 
  Volume2, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  CloudSun, 
  Droplets, 
  Wind, 
  MapPin, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { FarmerProfile, AgriToken, LanguageCode, ServiceType } from '../../types';
import { TRANSLATIONS } from '../../data/agriMockData';
import { speakAnnouncement } from '../../utils/speech';
import { IntegrationBadge } from '../common/IntegrationBadge';

interface FarmerHomeViewProps {
  farmer: FarmerProfile;
  activeToken?: AgriToken;
  language: LanguageCode;
  onNavigateToTab: (tab: string) => void;
  onSelectServiceToBook: (service: ServiceType) => void;
  onOpenVoiceMitra: () => void;
}

export const FarmerHomeView: React.FC<FarmerHomeViewProps> = ({
  farmer,
  activeToken,
  language,
  onNavigateToTab,
  onSelectServiceToBook,
  onOpenVoiceMitra
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSpeakPass = () => {
    if (!activeToken) return;
    const hiText = `नमस्ते ${farmer.fullNameHi}! आपका सक्रिय टोकन नंबर ${activeToken.tokenNumber} है। आपको काउंटर नंबर ${activeToken.counterAssigned} पर बुलाया गया है। अनुमानित समय लगभग ${activeToken.estimatedWaitMins} मिनट है।`;
    const enText = `Hello ${farmer.fullName}! Your active token is ${activeToken.tokenNumber} at Counter ${activeToken.counterAssigned}. Estimated wait time is approximately ${activeToken.estimatedWaitMins} minutes.`;
    speakAnnouncement(language === 'hi' ? hiText : enText, language === 'hi' ? 'hi' : 'en');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Editorial Farmer Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#063B2A] via-[#0B5D3B] to-[#168A5B] text-white p-5 sm:p-6 shadow-md border border-[#0B5D3B]">
        {/* Subtle decorative background watermarks */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
          <Wheat className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#DDF4E9] text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                {t.kisanId}: {farmer.kisanId}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>e-KYC</span>
              </span>
              <IntegrationBadge status="INTEGRATION-READY" spec="UIDAI OTP" featureId="AUD-07" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display tracking-tight text-white">
              {t.greeting} {language === 'hi' ? farmer.fullNameHi : farmer.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>{language === 'hi' ? farmer.villageHi : farmer.village}, {farmer.district} • {farmer.landParcels.reduce((acc, p) => acc + p.areaAcres, 0)} {language === 'hi' ? 'एकड़ भूमि' : 'Acres Farmland'}</span>
            </p>
          </div>

          {/* Weather & Field Spraying Status Indicator */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-400/20 text-amber-300 flex-shrink-0">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white flex-wrap">
                <span>28°C Wardha</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-400/30 text-emerald-200">
                  {language === 'hi' ? 'अनुकूल' : 'Optimal'}
                </span>
                <IntegrationBadge status="INTEGRATION-READY" spec="IMD" featureName="Weather Advisory" featureId="AUD-08" />
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">
                {t.weatherSunny}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Active Token Card (High-Contrast, Accessible, Central Focus) */}
      {activeToken ? (
        <section className="editorial-card rounded-2xl p-5 border-2 border-[#168A5B] bg-gradient-to-br from-[#FFFFFF] to-[#F6F9F7] shadow-lg relative overflow-hidden">
          <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B5D3B]">
                {t.activeToken} • {activeToken.centreName}
              </span>
              <IntegrationBadge status="SYNCED" spec="Offline Available" featureName="Digital Pass" featureId="AUD-05" />
            </div>
            
            <button
              onClick={handleSpeakPass}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#168A5B]/10 hover:bg-[#168A5B]/20 text-[#0B5D3B] text-xs font-bold transition-transform active:scale-95"
              title="Hear pass details in your language"
            >
              <Volume2 className="w-4 h-4 text-[#168A5B]" />
              <span>{language === 'hi' ? 'आवाज सुनें' : 'Listen'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Token display */}
            <div className="bg-[#063B2A] text-white rounded-xl p-4 text-center sm:text-left">
              <span className="text-[11px] text-[#DDF4E9] font-medium block">
                {language === 'hi' ? 'टोकन संख्या' : 'Token Number'}
              </span>
              <span className="text-3xl sm:text-4xl font-mono-numbers font-extrabold text-amber-300 tracking-wider">
                {activeToken.tokenNumber}
              </span>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
                <Clock className="w-3 h-3" />
                <span>{activeToken.scheduledTime}</span>
              </div>
            </div>

            {/* Counter and turn details */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#DDF4E9]/60 border border-[#168A5B]/20">
                <div>
                  <span className="text-xs text-[#063B2A]/70 block font-medium">
                    {language === 'hi' ? 'निर्दिष्ट काउंटर' : 'Assigned Counter'}
                  </span>
                  <span className="text-lg font-bold text-[#063B2A]">
                    {language === 'hi' ? `काउंटर नंबर ${activeToken.counterAssigned}` : `Counter ${activeToken.counterAssigned}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#063B2A]/70 block font-medium">
                    {language === 'hi' ? 'आपकी बारी' : 'Your Turn'}
                  </span>
                  <span className="text-sm font-bold text-[#168A5B]">
                    {activeToken.peopleAhead === 0 
                      ? (language === 'hi' ? 'अभी काउंटर पर जाएं' : 'Proceed Now!') 
                      : (language === 'hi' ? `आगे ${activeToken.peopleAhead} किसान` : `${activeToken.peopleAhead} Ahead`)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-xs text-[#063B2A]/70">
                  {language === 'hi' ? 'अनुमानित प्रतीक्षा:' : 'Est. wait:'} <strong>~{activeToken.estimatedWaitMins} {language === 'hi' ? 'मिनट' : 'mins'}</strong>
                </p>

                <button
                  onClick={() => onNavigateToTab('queue')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#168A5B] hover:text-[#0B5D3B] group"
                >
                  <span>{language === 'hi' ? 'पूरा डिजिटल पास देखें' : 'View Full Digital Pass'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Primary Action Tiles (Farmer-First, Large 56px+ Touch Targets, Clear Pictograms) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-serif-display text-[#063B2A]">
            {t.bookService}
          </h3>
          <span className="text-xs text-[#063B2A]/60">
            {language === 'hi' ? 'नजदीकी केंद्र पर तुरंत स्लॉट पाएं' : 'Instant slot booking'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tile 1: Machinery Hiring */}
          <button
            onClick={() => onSelectServiceToBook('Machinery')}
            className="editorial-card editorial-card-hover rounded-2xl p-5 text-left flex flex-col justify-between group min-h-[140px] border border-[#D7E3DC] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#DDF4E9] text-[#0B5D3B] flex items-center justify-center group-hover:bg-[#168A5B] group-hover:text-white transition-colors">
                <Tractor className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {language === 'hi' ? '50% अनुदान' : '50% Subsidy'}
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-bold text-[#063B2A] text-base group-hover:text-[#168A5B] transition-colors">
                {t.machineryHire}
              </h4>
              <p className="text-xs text-[#063B2A]/60 mt-0.5">
                {language === 'hi' ? 'ट्रैक्टर, रोटावेटर, स्प्रे ड्रोन' : 'Tractor, Harvester & Drone'}
              </p>
            </div>
          </button>

          {/* Tile 2: Mandi Slot & Weighbridge */}
          <button
            onClick={() => onSelectServiceToBook('MandiSlot')}
            className="editorial-card editorial-card-hover rounded-2xl p-5 text-left flex flex-col justify-between group min-h-[140px] border border-[#D7E3DC] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-[#D99121] group-hover:text-white transition-colors">
                <Store className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {language === 'hi' ? 'न्यूनतम समर्थन मूल्य' : 'MSP Fast-Track'}
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-bold text-[#063B2A] text-base group-hover:text-[#D99121] transition-colors">
                {t.mandiPass}
              </h4>
              <p className="text-xs text-[#063B2A]/60 mt-0.5">
                {language === 'hi' ? 'फसल तौल कांटा व गेट पास' : 'Weighbridge & Gate Entry'}
              </p>
            </div>
          </button>

          {/* Tile 3: Soil Testing Lab */}
          <button
            onClick={() => onSelectServiceToBook('SoilTest')}
            className="editorial-card editorial-card-hover rounded-2xl p-5 text-left flex flex-col justify-between group min-h-[140px] border border-[#D7E3DC] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center group-hover:bg-[#2878C8] group-hover:text-white transition-colors">
                <FlaskConical className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {language === 'hi' ? 'निःशुल्क' : 'Free SHC'}
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-bold text-[#063B2A] text-base group-hover:text-[#2878C8] transition-colors">
                {t.soilTesting}
              </h4>
              <p className="text-xs text-[#063B2A]/60 mt-0.5">
                {language === 'hi' ? 'मिट्टी जांच व खाद रिपोर्ट' : 'Nutrient & Moisture Audit'}
              </p>
            </div>
          </button>

          {/* Tile 4: Fertiliser Quota */}
          <button
            onClick={() => onSelectServiceToBook('Fertiliser')}
            className="editorial-card editorial-card-hover rounded-2xl p-5 text-left flex flex-col justify-between group min-h-[140px] border border-[#D7E3DC] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center group-hover:bg-[#7866D8] group-hover:text-white transition-colors">
                <Wheat className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {language === 'hi' ? 'POS आधार लिंक' : 'Aadhaar POS'}
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-bold text-[#063B2A] text-base group-hover:text-[#7866D8] transition-colors">
                {t.fertiliserQuota}
              </h4>
              <p className="text-xs text-[#063B2A]/60 mt-0.5">
                {language === 'hi' ? 'यूरिया / डीएपी सब्सिडी टोकन' : 'Urea & DAP Quota Token'}
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Live MSP Government Procurement Rates Ticker */}
      <section className="editorial-card rounded-2xl p-4 bg-white border border-[#D7E3DC]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#063B2A]">
            <TrendingUp className="w-4 h-4 text-[#168A5B]" />
            <span>{language === 'hi' ? 'सरकारी समर्थन मूल्य (MSP 2026-27)' : 'Live APMC MSP Procurement Rates'}</span>
          </div>
          <span className="text-[11px] text-[#063B2A]/60">
            {language === 'hi' ? 'वर्धा मंडी द्वारा सत्यापित' : 'Verified APMC Wardha'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6]">
            <span className="text-xs text-[#063B2A]/70 block">
              {language === 'hi' ? 'सोयाबीन (पीला)' : 'Soyabean (Yellow)'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono-numbers text-[#063B2A]">₹4,892</span>
              <span className="text-[10px] text-emerald-600 font-semibold">/Qtl</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6]">
            <span className="text-xs text-[#063B2A]/70 block">
              {language === 'hi' ? 'कपास (मध्यम रेशा)' : 'Cotton (Medium)'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono-numbers text-[#063B2A]">₹7,121</span>
              <span className="text-[10px] text-emerald-600 font-semibold">/Qtl</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6]">
            <span className="text-xs text-[#063B2A]/70 block">
              {language === 'hi' ? 'गेहूं (शरबती)' : 'Wheat (Sharbati)'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono-numbers text-[#063B2A]">₹2,275</span>
              <span className="text-[10px] text-emerald-600 font-semibold">/Qtl</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6]">
            <span className="text-xs text-[#063B2A]/70 block">
              {language === 'hi' ? 'चना (देसी)' : 'Gram / Chana'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono-numbers text-[#063B2A]">₹5,440</span>
              <span className="text-[10px] text-emerald-600 font-semibold">/Qtl</span>
            </div>
          </div>
        </div>
      </section>

      {/* Kisan Mitra Voice Prompt Card */}
      <section className="editorial-card rounded-2xl p-5 bg-gradient-to-r from-[#DDF4E9] to-[#FFFFFF] border border-[#168A5B]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#168A5B] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-[#063B2A] text-base">
              {language === 'hi' ? 'किसान मित्र आवाज सहायक' : 'Kisan Mitra AI Voice Support'}
            </h4>
            <p className="text-xs text-[#063B2A]/70 mt-0.5">
              {language === 'hi' 
                ? 'माइक दबाकर पूछें: "मेरा टोकन किस काउंटर पर है?" या "मंडी में आज का भाव?"' 
                : 'Tap mic to ask: "Where is my token?" or "Today\'s Mandi price"'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVoiceMitra}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span>{language === 'hi' ? 'आवाज से बात करें' : 'Talk with Voice'}</span>
        </button>
      </section>
    </div>
  );
};
