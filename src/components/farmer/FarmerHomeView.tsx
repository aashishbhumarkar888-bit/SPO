import React, { useState, useEffect } from 'react';
import { 
  Sprout,
  UserCheck, 
  Ticket, 
  MapPin, 
  Truck, 
  Wheat, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  ArrowRight, 
  ArrowUpRight,
  Sun,
  ShieldCheck,
  Building2,
  FileText,
  AlertCircle,
  QrCode,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { 
  FarmerProfile, 
  AgriToken, 
  LanguageCode, 
  ServiceType, 
  ProcurementRecord, 
  DbtTransaction 
} from '../../types';
import { getTranslations } from '../../i18n';
import { speakAnnouncement, playAudioChime } from '../../utils/speech';
import { MandiProcurementYardIllustration } from '../common/AgriIllustrations';

interface FarmerHomeViewProps {
  farmer: FarmerProfile;
  activeToken?: AgriToken;
  recentProcurement?: ProcurementRecord;
  recentDbt?: DbtTransaction;
  language: LanguageCode;
  onNavigateToTab: (tab: string) => void;
  onSelectServiceToBook: (service: ServiceType) => void;
  onOpenVoiceMitra: () => void;
  onOpenGatePassQr?: () => void;
}

export const FarmerHomeView: React.FC<FarmerHomeViewProps> = ({
  farmer,
  activeToken,
  recentProcurement,
  recentDbt,
  language,
  onNavigateToTab,
  onSelectServiceToBook,
  onOpenVoiceMitra,
  onOpenGatePassQr
}) => {
  const isHi = language === 'hi';
  const t = getTranslations(language);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  // Derive crop display name
  const cropName = activeToken?.serviceDetails?.cropName 
    ? (isHi && activeToken.serviceDetails.cropNameHi ? activeToken.serviceDetails.cropNameHi : activeToken.serviceDetails.cropName)
    : (farmer.landParcels[0]?.primaryCropHi && isHi 
        ? farmer.landParcels[0].primaryCropHi 
        : (farmer.landParcels[0]?.primaryCrop || (isHi ? 'गेहूँ (शरबती)' : 'Wheat (Sharbati)')));

  // Voice announcement of the home dashboard status
  const handleListenHomeSummary = () => {
    setIsSpeakingAudio(true);
    playAudioChime();

    const tokenText = activeToken 
      ? `आपका वर्तमान टोकन क्रमांक ${activeToken.tokenNumber} है। अनुमानित प्रतीक्षा समय ${activeToken.estimatedWaitMins || 25} मिनट है।`
      : 'आपका कोई आगामी टोकन सक्रिय नहीं है। आप नया टोकन बुक कर सकते हैं।';

    const textHi = `नमस्कार ${farmer.fullNameHi || 'किसान भाई'}। स्मार्ट प्रोक्योरमेंट मंडी पोर्टल में आपका स्वागत है। आपकी पंजीकरण स्थिति सत्यापित है। ${tokenText} आज भोपाल मंडी में गेहूँ का भाव ₹2,450 प्रति क्विंटल है।`;
    const textEn = `Welcome ${farmer.fullName || 'Farmer'} to Smart Mandi Procurement Portal. Your registration status is verified. ${activeToken ? `Your token number is ${activeToken.tokenNumber}.` : 'No active queue token.'} Today's wheat price is Rupees 2,450 per quintal.`;

    speakAnnouncement(isHi ? textHi : textEn, isHi ? 'hi' : 'en');
    setTimeout(() => setIsSpeakingAudio(false), 4000);
  };

  // 5 Quick Services matching the exact design reference
  const quickServices = [
    {
      id: 'registration',
      titleHi: 'पंजीकरण करें',
      titleEn: 'Register Land & Crop',
      descHi: 'नई पंजीकरण के लिए ➔',
      descEn: 'For new registration ➔',
      icon: UserCheck,
      bgColor: 'bg-[#EAF8F0] dark:bg-[#143026]',
      borderColor: 'border-[#C2E8D2] dark:border-[#2B5E4A]',
      iconColor: 'text-[#168A5B] dark:text-[#34D399]',
      badgeColor: 'bg-[#168A5B] text-white',
      tabTarget: 'registration'
    },
    {
      id: 'queue',
      titleHi: 'टोकन / कतार स्थिति',
      titleEn: 'Token / Queue Status',
      descHi: 'अपना टोकन देखें ➔',
      descEn: 'View your token ➔',
      icon: Ticket,
      bgColor: 'bg-[#EBF5FF] dark:bg-[#13283E]',
      borderColor: 'border-[#BFDBFE] dark:border-[#1E40AF]',
      iconColor: 'text-[#2563EB] dark:text-[#60A5FA]',
      badgeColor: 'bg-[#2563EB] text-white',
      tabTarget: 'queue'
    },
    {
      id: 'mandi',
      titleHi: 'मंडी केंद्र खोजें',
      titleEn: 'Find Mandi Centers',
      descHi: 'नजदीकी केंद्र की जानकारी ➔',
      descEn: 'Nearest centre info ➔',
      icon: MapPin,
      bgColor: 'bg-[#FEF9E8] dark:bg-[#342A12]',
      borderColor: 'border-[#FDE68A] dark:border-[#B45309]',
      iconColor: 'text-[#D97706] dark:text-[#FBBF24]',
      badgeColor: 'bg-[#D97706] text-white',
      tabTarget: 'mandi'
    },
    {
      id: 'tracking',
      titleHi: 'वाहन ट्रैकिंग',
      titleEn: 'Vehicle Tracking',
      descHi: 'अपना वाहन देखें ➔',
      descEn: 'Track your vehicle ➔',
      icon: Truck,
      bgColor: 'bg-[#F4EFFE] dark:bg-[#2A1D44]',
      borderColor: 'border-[#DDD6FE] dark:border-[#7C3AED]',
      iconColor: 'text-[#7C3AED] dark:text-[#A78BFA]',
      badgeColor: 'bg-[#7C3AED] text-white',
      tabTarget: 'tracking'
    },
    {
      id: 'prices',
      titleHi: 'फसल व मूल्य जानकारी',
      titleEn: 'Crop & Price Info',
      descHi: 'आज का भाव देखें ➔',
      descEn: 'View today rates ➔',
      icon: Wheat,
      bgColor: 'bg-[#E8FAF6] dark:bg-[#0E332A]',
      borderColor: 'border-[#A7F3D0] dark:border-[#059669]',
      iconColor: 'text-[#0D9488] dark:text-[#2DD4BF]',
      badgeColor: 'bg-[#0D9488] text-white',
      tabTarget: 'prices'
    }
  ];

  // Daily MSP & Mandi Rates matching the screenshot
  const liveMandiBhav = [
    { cropHi: 'गेहूँ', cropEn: 'Wheat', price: '2,450', change: '+2.1%', icon: '🌾' },
    { cropHi: 'चना', cropEn: 'Gram', price: '5,200', change: '+1.3%', icon: '🌰' },
    { cropHi: 'सोयाबीन', cropEn: 'Soybean', price: '4,800', change: '+0.8%', icon: '🌽' },
    { cropHi: 'मक्का', cropEn: 'Maize', price: '1,950', change: '+1.5%', icon: '🌽' },
    { cropHi: 'धान', cropEn: 'Paddy', price: '2,300', change: '+1.2%', icon: '🌾' }
  ];

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in text-[#083324] dark:text-[#F0FAF5] max-w-7xl mx-auto">
      
      {/* 1. HERO SECTION (Faithful to design reference image) */}
      <section className="bg-white dark:bg-[#0E241C] rounded-2xl sm:rounded-3xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 sm:p-7 shadow-[0_2px_12px_rgba(6,59,42,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)] relative overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left Welcome Text & Dynamic Info Pills */}
          <div className="flex-1 space-y-4 max-w-xl">
            {/* Top Row: Sprout Emblem + Greeting */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#168A5B] flex items-center justify-center text-amber-300 shadow-sm flex-shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#168A5B] dark:text-[#6EE7B7] uppercase tracking-wider block">
                  {isHi ? 'राष्ट्रीय उपार्जन पोर्टल' : 'National Procurement Portal'}
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#062B1E] dark:text-[#F0FAF5] font-serif-display">
                  {isHi 
                    ? `नमस्कार, ${farmer.fullNameHi ? farmer.fullNameHi.split(' ')[0] : 'किसान भाई'} ! 👋` 
                    : `Welcome, ${farmer.fullName ? farmer.fullName.split(' ')[0] : 'Farmer'} ! 👋`}
                </h1>
              </div>
            </div>

            {/* Description Subtext */}
            <p className="text-xs sm:text-sm text-[#3E6554] dark:text-[#BBDCD0] leading-relaxed">
              {isHi 
                ? 'आपका स्मार्ट प्रोक्योरमेंट (मंडी) पोर्टल में स्वागत है। यहाँ आप अपनी पंजीकरण, टोकन स्थिति, मंडी केंद्र, और कई अन्य सेवाओं का लाभ उठा सकते हैं।' 
                : 'Welcome to the Smart Procurement (Mandi) Portal. Manage your registration, check live queue token status, locate procurement centers, and access fair MSP services.'}
            </p>

            {/* Live Weather & Mandi Location Widgets */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF9E8] dark:bg-[#2A2312] border border-[#FDE68A] dark:border-[#B45309] text-xs font-semibold text-[#854D0E] dark:text-[#FDE047]">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>28°C • {isHi ? 'हल्का बादल' : 'Partly Cloudy'}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF8F0] dark:bg-[#143026] border border-[#C2E8D2] dark:border-[#2B5E4A] text-xs font-semibold text-[#0B5D3B] dark:text-[#6EE7B7]">
                <MapPin className="w-3.5 h-3.5 text-[#168A5B]" />
                <span>{farmer.district || (isHi ? 'भोपाल' : 'Bhopal')}, {farmer.state || (isHi ? 'मध्य प्रदेश' : 'Madhya Pradesh')}</span>
              </div>

              {/* Voice Readout Button */}
              <button
                onClick={handleListenHomeSummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF5FF] dark:bg-[#13283E] border border-[#BFDBFE] dark:border-[#1E40AF] text-xs font-semibold text-[#1D4ED8] dark:text-[#93C5FD] hover:bg-blue-100 transition-colors cursor-pointer"
                title={isHi ? 'आवाज में सुनें' : 'Listen Status'}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeakingAudio ? 'animate-pulse text-blue-600' : ''}`} />
                <span>{isHi ? 'आवाज में सुनें' : 'Listen Audio'}</span>
              </button>
            </div>
          </div>

          {/* Right APMC Mandi Procurement Yard Illustration (Directly from design reference) */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <MandiProcurementYardIllustration className="w-full h-auto drop-shadow-sm" />
          </div>
        </div>
      </section>

      {/* 2. त्वरित सेवाएँ (QUICK SERVICES - 5 CARDS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#062B1E] dark:text-[#F0FAF5] font-serif-display">
              {isHi ? 'त्वरित सेवाएँ' : 'Quick Services'}
            </h2>
          </div>

          <button
            onClick={() => onNavigateToTab('booking')}
            className="text-xs font-bold text-[#168A5B] dark:text-[#6EE7B7] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isHi ? 'सभी सेवाएँ देखें' : 'View All Services'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* 5 Distinct Pastel Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => onNavigateToTab(srv.tabTarget)}
                className={`p-4 rounded-2xl border ${srv.bgColor} ${srv.borderColor} hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[128px]`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0E241C] shadow-xs flex items-center justify-center mb-3">
                    <Icon className={`w-5 h-5 ${srv.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                    {isHi ? srv.titleHi : srv.titleEn}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#0B5D3B] dark:text-[#6EE7B7]">
                  <span>{isHi ? srv.descHi : srv.descEn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. THREE-COLUMN REAL-TIME INFORMATION PANELS (As shown in screenshot) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* PANEL 1: मेरी पंजीकरण स्थिति (My Registration Status) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAF2ED] dark:border-[#1D4334] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#EAF8F0] dark:bg-[#143026] text-[#168A5B]">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'मेरी पंजीकरण स्थिति' : 'My Registration Status'}
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('registration')}
                className="text-xs font-semibold text-[#168A5B] dark:text-[#6EE7B7] hover:underline flex items-center gap-0.5"
              >
                <span>{isHi ? 'देखें सभी' : 'View all'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Profile & Crop Key Attributes */}
            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#F4F7F5] dark:border-[#153A2C]">
                <span className="text-[#4A6E5E] dark:text-[#85AFA0]">
                  {isHi ? 'किसान का नाम:' : 'Farmer Name:'}
                </span>
                <span className="font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? (farmer.fullNameHi || 'रामलाल यादव') : (farmer.fullName || 'Ramlal Yadav')}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#F4F7F5] dark:border-[#153A2C]">
                <span className="text-[#4A6E5E] dark:text-[#85AFA0]">
                  {isHi ? 'किसान ID:' : 'Kisan ID:'}
                </span>
                <span className="font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
                  {farmer.kisanId || 'MP-4587-2025'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#F4F7F5] dark:border-[#153A2C]">
                <span className="text-[#4A6E5E] dark:text-[#85AFA0]">
                  {isHi ? 'पंजीकृत फसल:' : 'Registered Crop:'}
                </span>
                <span className="font-bold text-[#0B5D3B] dark:text-[#6EE7B7]">
                  {cropName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[#4A6E5E] dark:text-[#85AFA0]">
                  {isHi ? 'पंजीकरण स्थिति:' : 'Status:'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E7F7EF] dark:bg-[#143026] text-[#0B5D3B] dark:text-[#6EE7B7] font-bold text-[11px] border border-[#98BFA9] dark:border-[#2B5E4A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#168A5B]" />
                  <span>{isHi ? 'सत्यापित' : 'Verified'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Card Summary */}
          <div className="p-3 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#2B5E4A] flex items-center justify-between text-[11px]">
            <span className="text-[#4A6E5E] dark:text-[#85AFA0]">
              {isHi ? 'भूमि रकबा: 3.5 एकड़' : 'Land Area: 3.5 Acres'}
            </span>
            <span className="font-semibold text-[#0B5D3B] dark:text-[#6EE7B7] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHi ? 'पीएम-किसान पात्र' : 'PM-Kisan Active'}
            </span>
          </div>
        </div>

        {/* PANEL 2: आज का मंडी भाव (Today's Mandi MSP / Rates) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAF2ED] dark:border-[#1D4334] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#E8FAF6] dark:bg-[#0E332A] text-[#0D9488]">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'आज का मंडी भाव' : "Today's Mandi Rates"}
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('prices')}
                className="text-xs font-semibold text-[#168A5B] dark:text-[#6EE7B7] hover:underline flex items-center gap-0.5"
              >
                <span>{isHi ? 'देखें सभी' : 'View all'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Real-time rates list matching screenshot */}
            <div className="space-y-2.5 pt-2 text-xs">
              {liveMandiBhav.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-1 border-b border-[#F4F7F5] dark:border-[#153A2C] last:border-0 hover:bg-[#F8FAF8] dark:hover:bg-[#143026] px-1 rounded transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span className="font-semibold text-[#083324] dark:text-[#F0FAF5]">
                      {isHi ? item.cropHi : item.cropEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                      ₹ {item.price}
                      <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] font-normal"> / {isHi ? 'क्विंटल' : 'qtl'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Card Action: Open Price Calculator */}
          <button
            onClick={() => onNavigateToTab('prices')}
            className="w-full py-2 rounded-xl bg-[#EAF8F0] dark:bg-[#143026] hover:bg-[#D7F3E2] dark:hover:bg-[#1C4436] text-[#0B5D3B] dark:text-[#6EE7B7] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isHi ? 'नमी कटौती व भुगतान कैलकुलेटर खोलें' : 'Open Moisture & Payout Calculator'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PANEL 3: मेरी कतार स्थिति (My Queue Status) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAF2ED] dark:border-[#1D4334] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#EBF5FF] dark:bg-[#13283E] text-[#2563EB]">
                  <Ticket className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'मेरी कतार स्थिति' : 'My Queue Status'}
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('queue')}
                className="text-xs font-semibold text-[#168A5B] dark:text-[#6EE7B7] hover:underline flex items-center gap-0.5"
              >
                <span>{isHi ? 'देखें सभी' : 'View all'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Active Token Number & Status Pill */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block">
                  {isHi ? 'वर्तमान टोकन संख्या:' : 'Current Token Number:'}
                </span>
                <p className="text-2xl font-bold font-mono text-[#062B1E] dark:text-[#F0FAF5] tracking-tight mt-0.5">
                  {activeToken ? activeToken.tokenNumber : 'A-143'}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                {activeToken?.status === 'Completed' 
                  ? (isHi ? 'पूर्ण' : 'Completed') 
                  : (isHi ? 'प्रगति पर' : 'In Progress')}
              </span>
            </div>

            {/* 4-Stage Visual Progress Stepper (As shown in screenshot) */}
            <div className="mt-4 pt-3 border-t border-[#F4F7F5] dark:border-[#153A2C]">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-[#DCE7E1] dark:bg-[#2B5E4A] -z-0"></div>

                {/* Stage 1: पंजीकरण (Registration) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#168A5B] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-[#0B5D3B] dark:text-[#6EE7B7] mt-1">
                    {isHi ? 'पंजीकरण' : 'Reg.'}
                  </span>
                </div>

                {/* Stage 2: तौल (Weighing - Active Pulse) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold ring-4 ring-amber-400/20 animate-pulse">
                    •
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                    {isHi ? 'तौल' : 'Weighing'}
                  </span>
                </div>

                {/* Stage 3: भुगतान (Payment) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-[#0E241C] border-2 border-[#DCE7E1] dark:border-[#2B5E4A] text-[#4A6E5E] flex items-center justify-center text-[10px]">
                    3
                  </div>
                  <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] mt-1">
                    {isHi ? 'भुगतान' : 'Payment'}
                  </span>
                </div>

                {/* Stage 4: समाप्त (Completed) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-[#0E241C] border-2 border-[#DCE7E1] dark:border-[#2B5E4A] text-[#4A6E5E] flex items-center justify-center text-[10px]">
                    4
                  </div>
                  <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] mt-1">
                    {isHi ? 'समाप्त' : 'Done'}
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Wait Time Details */}
            <div className="mt-4 space-y-1.5 text-xs">
              <p className="text-[#3E6554] dark:text-[#BBDCD0] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#168A5B]" />
                <span>{isHi ? 'मंडी केंद्र: भोपाल कृषि उपज मंडी समिति' : 'Centre: Bhopal APMC Mandi Yard'}</span>
              </p>
              <p className="text-[#3E6554] dark:text-[#BBDCD0] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{isHi ? `अनुमानित प्रतीक्षा समय: ${activeToken?.estimatedWaitMins || 25} मिनट` : `Estimated Wait: ${activeToken?.estimatedWaitMins || 25} Mins`}</span>
              </p>
            </div>
          </div>

          {/* Action Button to Open QR Gate Pass */}
          <button
            onClick={() => {
              if (onOpenGatePassQr) {
                onOpenGatePassQr();
              } else {
                onNavigateToTab('queue');
              }
            }}
            className="w-full py-2 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{isHi ? 'डिजिटल गेट पास एवं QR कोड देखें' : 'View Digital QR Gate Pass'}</span>
          </button>
        </div>

      </section>

    </div>
  );
};
