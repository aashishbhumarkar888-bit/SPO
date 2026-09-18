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
  Info,
  Calculator
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
      
      {/* 1. HERO SECTION (Faithful to design reference with High Contrast Clean Neutral White Base) */}
      <section className="bg-white dark:bg-[#0E241C] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#1D4334] p-5 sm:p-7 shadow-sm relative overflow-hidden transition-all">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left Welcome Text & Dynamic Info Pills */}
          <div className="flex-1 space-y-4 max-w-xl">
            {/* Top Row: Sprout Emblem + Greeting */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#062B1E] border border-emerald-500/40 flex items-center justify-center text-amber-300 shadow-md flex-shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#062B1E] dark:text-[#A7F3D0] uppercase tracking-wider block">
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
            <p className="text-xs sm:text-sm text-[#335345] dark:text-[#D1EAE0] leading-relaxed font-medium">
              {isHi 
                ? 'आपका स्मार्ट प्रोक्योरमेंट (मंडी) पोर्टल में स्वागत है। यहाँ आप अपनी पंजीकरण, टोकन स्थिति, मंडी केंद्र, और कई अन्य सेवाओं का लाभ उठा सकते हैं।' 
                : 'Welcome to the Smart Procurement (Mandi) Portal. Manage your registration, check live queue token status, locate procurement centers, and access fair MSP services.'}
            </p>

            {/* Live Weather & Mandi Location Widgets */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FEF9E8] dark:bg-[#2A2312] border border-[#FDE68A] dark:border-[#B45309] text-xs font-semibold text-[#854D0E] dark:text-[#FDE047] min-h-[40px]">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>28°C • {isHi ? 'हल्का बादल' : 'Partly Cloudy'}</span>
              </div>

              {/* Location Badge (Medium Priority Mint Green #D1EAE0 with Dark Green text) */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#D1EAE0] dark:bg-[#143D2D] border border-[#A7F3D0] dark:border-[#2B5E4A] text-xs font-bold text-[#062B1E] dark:text-[#A7F3D0] min-h-[40px]">
                <MapPin className="w-3.5 h-3.5 text-[#062B1E] dark:text-[#A7F3D0]" />
                <span>{farmer.district || (isHi ? 'भोपाल' : 'Bhopal')}, {farmer.state || (isHi ? 'मध्य प्रदेश' : 'Madhya Pradesh')}</span>
              </div>

              {/* Voice Readout Button */}
              <button
                type="button"
                onClick={handleListenHomeSummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EBF5FF] dark:bg-[#13283E] border border-[#BFDBFE] dark:border-[#1E40AF] text-xs font-bold text-[#1D4ED8] dark:text-[#93C5FD] hover:bg-blue-100 dark:hover:bg-[#1B3654] transition-colors cursor-pointer min-h-[40px] active:scale-95"
                title={isHi ? 'आवाज में सुनें' : 'Listen Status'}
              >
                <Volume2 className={`w-4 h-4 ${isSpeakingAudio ? 'animate-pulse text-blue-600' : ''}`} />
                <span>{isHi ? 'आवाज में सुनें' : 'Listen Audio'}</span>
              </button>
            </div>
          </div>

          {/* Right APMC Mandi Procurement Yard Illustration */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <MandiProcurementYardIllustration className="w-full h-auto drop-shadow-sm" />
          </div>
        </div>
      </section>

      {/* 2. त्वरित सेवाएँ (QUICK SERVICES - 5 CARDS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#062B1E] dark:text-[#F0FAF5] font-serif-display">
              {isHi ? 'त्वरित सेवाएँ' : 'Quick Services'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('booking')}
            className="text-xs font-bold text-[#168A5B] dark:text-[#6EE7B7] hover:underline flex items-center gap-1.5 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 min-h-[36px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isHi ? 'सभी सेवाएँ देखें' : 'View All Services'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Distinct Pastel Action Cards with Glassmorphism & High Contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => onNavigateToTab(srv.tabTarget)}
                className={`p-4 rounded-2xl border ${srv.bgColor} ${srv.borderColor} backdrop-blur-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[136px]`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0E241C] shadow-xs flex items-center justify-center mb-3">
                    <Icon className={`w-5 h-5 ${srv.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] leading-snug">
                    {isHi ? srv.titleHi : srv.titleEn}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#0B5D3B] dark:text-[#6EE7B7]">
                  <span>{isHi ? srv.descHi : srv.descEn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. THREE-COLUMN REAL-TIME INFORMATION PANELS (High-Contrast Clean White Neutral Base) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* PANEL 1: मेरी पंजीकरण स्थिति (My Registration Status) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#1D4334] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1D4334] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#D1EAE0] dark:bg-[#143D2D] text-[#062B1E] dark:text-[#A7F3D0]">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'मेरी पंजीकरण स्थिति' : 'My Registration Status'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('registration')}
                className="text-xs font-bold text-[#062B1E] dark:text-[#A7F3D0] hover:underline flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 min-h-[36px]"
              >
                <span>{isHi ? 'देखें सभी' : 'View all'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile & Crop Key Attributes */}
            <div className="space-y-3 pt-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-[#153A2C]">
                <span className="font-medium text-[#335345] dark:text-[#CBE7DB]">
                  {isHi ? 'किसान का नाम:' : 'Farmer Name:'}
                </span>
                <span className="font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? (farmer.fullNameHi || 'रामलाल यादव') : (farmer.fullName || 'Ramlal Yadav')}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-[#153A2C]">
                <span className="font-medium text-[#335345] dark:text-[#CBE7DB]">
                  {isHi ? 'किसान ID:' : 'Kisan ID:'}
                </span>
                <span className="font-mono font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {farmer.kisanId || 'MP-4587-2025'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-[#153A2C]">
                <span className="font-medium text-[#335345] dark:text-[#CBE7DB]">
                  {isHi ? 'पंजीकृत फसल:' : 'Registered Crop:'}
                </span>
                <span className="font-bold text-[#062B1E] dark:text-[#A7F3D0]">
                  {cropName}
                </span>
              </div>

              {/* Primary Status Badge (High Priority Dark Green #062B1E with crisp White text) */}
              <div className="flex items-center justify-between py-1.5">
                <span className="font-medium text-[#335345] dark:text-[#CBE7DB]">
                  {isHi ? 'पंजीकरण स्थिति:' : 'Status:'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#062B1E] text-white font-bold text-xs border border-emerald-500/40 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? 'सत्यापित (Aadhaar KYC)' : 'Verified (Aadhaar KYC)'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Card Summary (Medium Priority Mint Green #D1EAE0 with Dark Green text) */}
          <div className="p-3.5 rounded-xl bg-[#D1EAE0] dark:bg-[#143D2D] border border-[#A7F3D0] dark:border-[#2B5E4A] flex items-center justify-between text-xs text-[#062B1E] dark:text-[#F0FAF5]">
            <span className="font-bold">
              {isHi ? 'भूमि रकबा: 3.5 एकड़' : 'Land Area: 3.5 Acres'}
            </span>
            <span className="font-bold flex items-center gap-1.5 text-[#062B1E] dark:text-[#A7F3D0]">
              <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <span>{isHi ? 'पीएम-किसान पात्र' : 'PM-Kisan Active'}</span>
            </span>
          </div>
        </div>

        {/* PANEL 2: आज का मंडी भाव (Today's Mandi MSP / Rates) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#1D4334] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1D4334] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#E8FAF6] dark:bg-[#0E332A] text-[#0D9488]">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'आज का मंडी भाव' : "Today's Mandi Rates"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('prices')}
                className="text-xs font-bold text-[#062B1E] dark:text-[#A7F3D0] hover:underline flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 min-h-[36px]"
              >
                <span>{isHi ? 'देखें सभी' : 'View all'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Real-time rates list */}
            <div className="space-y-2 pt-2 text-xs sm:text-sm">
              {liveMandiBhav.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-[#153A2C] last:border-0 hover:bg-slate-50 dark:hover:bg-[#143026] px-1.5 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span className="font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                      {isHi ? item.cropHi : item.cropEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                      ₹ {item.price}
                      <span className="text-[11px] text-[#335345] dark:text-[#CBE7DB] font-normal"> / {isHi ? 'क्विंटल' : 'qtl'}</span>
                    </span>
                    {/* Medium Priority Mint Green Badge for price change */}
                    <span className="text-[11px] font-bold text-[#062B1E] dark:text-[#A7F3D0] bg-[#D1EAE0] dark:bg-[#143D2D] px-2 py-0.5 rounded-md border border-[#A7F3D0] dark:border-[#2B5E4A]">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Card Action: Open Price Calculator (High Priority Dark Green #062B1E Button) */}
          <button
            type="button"
            onClick={() => onNavigateToTab('prices')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#062B1E] hover:bg-[#042016] text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px] shadow-md active:scale-[0.99] border border-[#0D4430]"
          >
            <Calculator className="w-4 h-4 text-emerald-300" />
            <span>{isHi ? 'नमी कटौती व भुगतान कैलकुलेटर खोलें' : 'Open Moisture & Payout Calculator'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>

        {/* PANEL 3: मेरी कतार स्थिति (My Queue Status - Critical Action Card) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#1D4334] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1D4334] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#EBF5FF] dark:bg-[#13283E] text-[#2563EB]">
                  <Ticket className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'मेरी कतार स्थिति' : 'My Queue Status'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('queue')}
                className="text-xs font-bold text-[#062B1E] dark:text-[#A7F3D0] hover:underline flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 min-h-[36px]"
              >
                <span>{isHi ? 'देखें सभी' : 'View all'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Token Number & Status Pill (Medium Priority Mint Green Badge) */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#335345] dark:text-[#CBE7DB] block">
                  {isHi ? 'वर्तमान टोकन संख्या:' : 'Current Token Number:'}
                </span>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#062B1E] dark:text-[#F0FAF5] tracking-tight mt-0.5">
                  {activeToken ? activeToken.tokenNumber : 'A-143'}
                </p>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#D1EAE0] dark:bg-[#143D2D] text-[#062B1E] dark:text-[#A7F3D0] border border-[#A7F3D0] dark:border-[#2B5E4A]">
                {activeToken?.status === 'Completed' 
                  ? (isHi ? 'पूर्ण' : 'Completed') 
                  : (isHi ? 'प्रगति पर' : 'In Progress')}
              </span>
            </div>

            {/* 4-Stage Visual Progress Stepper with Mint Green Progress Bars */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#153A2C]">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line (Medium Priority Mint Green Bar) */}
                <div className="absolute top-3 left-4 right-4 h-1 bg-[#D1EAE0] dark:bg-[#143D2D] rounded-full -z-0"></div>

                {/* Stage 1: पंजीकरण (Registration - Done: Dark Green) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#062B1E] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-[#062B1E] dark:text-[#A7F3D0] mt-1">
                    {isHi ? 'पंजीकरण' : 'Reg.'}
                  </span>
                </div>

                {/* Stage 2: तौल (Weighing - Active Pulse with Mint Green Ring) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold ring-4 ring-[#D1EAE0] dark:ring-emerald-800/40 animate-pulse">
                    •
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                    {isHi ? 'तौल' : 'Weighing'}
                  </span>
                </div>

                {/* Stage 3: भुगतान (Payment) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-[#0E241C] border-2 border-slate-200 dark:border-[#2B5E4A] text-[#335345] dark:text-[#CBE7DB] flex items-center justify-center text-[10px] font-bold">
                    3
                  </div>
                  <span className="text-[10px] font-medium text-[#335345] dark:text-[#CBE7DB] mt-1">
                    {isHi ? 'भुगतान' : 'Payment'}
                  </span>
                </div>

                {/* Stage 4: समाप्त (Completed) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-[#0E241C] border-2 border-slate-200 dark:border-[#2B5E4A] text-[#335345] dark:text-[#CBE7DB] flex items-center justify-center text-[10px] font-bold">
                    4
                  </div>
                  <span className="text-[10px] font-medium text-[#335345] dark:text-[#CBE7DB] mt-1">
                    {isHi ? 'समाप्त' : 'Done'}
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Wait Time Details */}
            <div className="mt-4 space-y-2 text-xs font-medium">
              <p className="text-[#335345] dark:text-[#D1EAE0] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#062B1E] dark:text-[#A7F3D0] flex-shrink-0" />
                <span>{isHi ? 'मंडी केंद्र: भोपाल कृषि उपज मंडी समिति' : 'Centre: Bhopal APMC Mandi Yard'}</span>
              </p>
              <p className="text-[#335345] dark:text-[#D1EAE0] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>{isHi ? `अनुमानित प्रतीक्षा समय: ${activeToken?.estimatedWaitMins || 25} मिनट` : `Estimated Wait: ${activeToken?.estimatedWaitMins || 25} Mins`}</span>
              </p>
            </div>
          </div>

          {/* Action Button to Open QR Gate Pass (High Priority Dark Green #062B1E Primary CTA Button) */}
          <button
            type="button"
            onClick={() => {
              if (onOpenGatePassQr) {
                onOpenGatePassQr();
              } else {
                onNavigateToTab('queue');
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#062B1E] hover:bg-[#042016] text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer min-h-[46px] active:scale-[0.99] border border-[#0D4430]"
          >
            <QrCode className="w-4 h-4 text-emerald-300" />
            <span>{isHi ? 'डिजिटल गेट पास एवं QR कोड देखें' : 'View Digital QR Gate Pass'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>

      </section>

    </div>
  );
};
