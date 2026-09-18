import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  Wheat, 
  Droplets, 
  FileCheck2, 
  Layers, 
  CreditCard,
  Building2,
  Phone,
  Globe,
  Sun,
  Moon,
  Eye,
  LogOut,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { FarmerProfile, LanguageCode } from '../../types';
import { getTranslations } from '../../i18n';
import { playAudioChime } from '../../utils/speech';

interface FarmerProfileLandViewProps {
  farmer: FarmerProfile;
  language: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  outdoorMode?: boolean;
  onToggleOutdoorMode?: () => void;
  onOpenVoiceMitra?: () => void;
  onClearSessionAndLogout: () => void;
  onOpenLogin?: () => void;
}

export const FarmerProfileLandView: React.FC<FarmerProfileLandViewProps> = ({
  farmer,
  language,
  onLanguageChange,
  theme = 'light',
  onToggleTheme,
  outdoorMode = false,
  onToggleOutdoorMode,
  onOpenVoiceMitra,
  onClearSessionAndLogout,
  onOpenLogin
}) => {
  const t = getTranslations(language);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const totalAcres = farmer.landParcels.reduce((sum, p) => sum + p.areaAcres, 0);

  const handleConfirmLogout = () => {
    playAudioChime();
    setShowLogoutConfirm(false);
    onClearSessionAndLogout();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in w-full pb-8">
      {/* Header */}
      <div className="border-b border-[#DCE7E1] dark:border-[#1D4334] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif-display text-[#083324] dark:text-[#F0FAF5]">
            {t.profileTitle}
          </h2>
          <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] mt-0.5">
            {language === 'hi' 
              ? 'डिजिटल किसान पहचान पत्र, भूलेख एवं खाता सुरक्षा प्रबंधन' 
              : 'Digital Farmer Identity, Land Records & Account Security Management'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#0B5D3B] dark:text-[#6EE7B7] bg-[#E7F7EF] dark:bg-[#0E2F23] border border-[#98BFA9] dark:border-[#2B5E4A] hover:bg-[#D4EFE0] transition-colors shadow-xs"
            >
              <User className="w-4 h-4 text-[#168A5B]" />
              <span>{language === 'hi' ? 'खाता बदलें / लॉगिन' : 'Switch Account / Login'}</span>
            </button>
          )}

          {/* Clear Session Quick Action */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 hover:bg-red-100 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>{t.clearSessionAndLogout}</span>
          </button>
        </div>
      </div>

      {/* Kisan Card Identity (Light-First Surface with Priority Colors) */}
      <div className="rounded-2xl p-6 bg-white dark:bg-[#0E241C] border border-slate-200 dark:border-[#1D4334] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#062B1E] text-white flex items-center justify-center font-serif-display text-2xl font-bold shadow-md border border-[#0D4430] flex-shrink-0">
            {farmer.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                {language === 'hi' ? farmer.fullNameHi : farmer.fullName}
              </h3>
              {/* High Priority Dark Green Status Badge */}
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#062B1E] text-white border border-emerald-500/40 shadow-xs">
                {t.ekycVerified}
              </span>
            </div>
            <p className="text-xs text-[#335345] dark:text-[#85AFA0] font-mono mt-0.5">
              {t.kisanId}: <strong>{farmer.kisanId}</strong> • Aadhaar: <span className="font-mono">XXXX XXXX {farmer.aadhaarLast4}</span>
            </p>
            <p className="text-xs text-[#335345] dark:text-[#85AFA0] mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#062B1E] dark:text-[#A7F3D0]" />
              <span>{farmer.village}, Taluka Wardha, {farmer.state}</span>
            </p>
          </div>
        </div>

        {/* Medium Priority Mint Green Land Summary Card */}
        <div className="p-4 rounded-xl bg-[#D1EAE0] dark:bg-[#143D2D] border border-[#A7F3D0] dark:border-[#2B5E4A] text-center sm:text-right">
          <span className="text-[11px] text-[#062B1E] dark:text-[#A7F3D0] block font-bold">
            {language === 'hi' ? 'कुल पंजीकृत भूमि' : 'Total Registered Land'}
          </span>
          <span className="text-2xl font-mono font-bold text-[#062B1E] dark:text-[#F0FAF5]">
            {totalAcres} Acres
          </span>
          <span className="text-[10px] text-[#062B1E] dark:text-[#A7F3D0] block mt-0.5 font-bold">
            Kharif Season Active
          </span>
        </div>
      </div>

      {/* Account & Mandi Role Information */}
      <div className="rounded-2xl bg-white dark:bg-[#0E241C] border border-[#DCE7E1] dark:border-[#1D4334] p-5 space-y-4 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#168A5B]" />
          <span>{language === 'hi' ? 'खाता विवरण व संबद्ध उपार्जन केंद्र' : 'Account Role & Mandi Center Details'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
              {language === 'hi' ? 'नागरिक भूमिका / प्रमाणीकरण' : 'Citizen Role & Clearance'}
            </span>
            <p className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5]">
              {language === 'hi' ? 'पंजीकृत कृषक (Registered Producer)' : 'Registered Farmer / Producer'}
            </p>
            <span className="text-[10px] text-[#0B5D3B] dark:text-[#6EE7B7] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>UIDAI Aadhaar Bio-eKYC Active</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
              {language === 'hi' ? 'संबद्ध उपार्जन मंडी केंद्र' : 'Registered Mandi Centre'}
            </span>
            <p className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5]">
              Wardha Model Mandi APMC Yard (CEN-1)
            </p>
            <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0]">
              Mandi Code: MH-WRD-041 • Distance: 8.4 km
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
              {language === 'hi' ? 'प्रत्यक्ष लाभ अंतरण (DBT) बैंक खाता' : 'Direct Benefit Transfer (DBT) Bank'}
            </span>
            <p className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5] font-mono">
              State Bank of India (SBI) •••• 4821
            </p>
            <span className="text-[10px] text-[#0B5D3B] dark:text-[#6EE7B7]">
              NPCI Aadhaar Payment Bridge (APBS) Linked
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
              {language === 'hi' ? 'पंजीकृत मोबाइल नंबर (SMS अलर्ट)' : 'Registered Mobile (SMS Alerts)'}
            </span>
            <p className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5] font-mono">
              +91 98234 ••••• (OTP Verified)
            </p>
            <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0]">
              Automated Mandi SMS & Gate Updates Active
            </span>
          </div>
        </div>
      </div>

      {/* Linked Land Parcels (7/12 Khasra) */}
      <div className="rounded-2xl bg-white dark:bg-[#0E241C] border border-[#DCE7E1] dark:border-[#1D4334] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#168A5B]" />
            <span>{t.landRecordsTitle}</span>
          </h4>
          <span className="text-xs text-[#4A6E5E] dark:text-[#85AFA0]">
            State Revenue Dept RoR (7/12 Digitized)
          </span>
        </div>

        <div className="space-y-3">
          {farmer.landParcels.map((parcel) => (
            <div
              key={parcel.id}
              className="p-4 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#083324] dark:text-[#F0FAF5] font-mono">
                    {t.khasraNumber}: {parcel.khasraNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334]">
                    {parcel.cropSeason}
                  </span>
                </div>
                <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] mt-1">
                  Primary Crop: <strong className="text-[#083324] dark:text-[#F0FAF5]">{parcel.primaryCrop}</strong> • {t.parcelArea}: <strong className="text-[#083324] dark:text-[#F0FAF5]">{parcel.areaAcres} Acres</strong>
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>{parcel.irrigationSource}</span>
                  </span>
                  <span>•</span>
                  <span className="font-mono">{t.soilHealthCard}: {parcel.soilHealthCardId}</span>
                </div>
              </div>

              <div className="sm:self-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5D3B] dark:text-[#6EE7B7] bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] px-3 py-1 rounded-lg">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Verified RoR</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language & Visual Preferences */}
      <div className="rounded-2xl bg-white dark:bg-[#0E241C] border border-[#DCE7E1] dark:border-[#1D4334] p-5 space-y-4 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#168A5B]" />
          <span>{language === 'hi' ? 'भाषा व प्रदर्शन प्राथमिकताएं' : 'Language & Display Preferences'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Language Picker */}
          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-2">
            <span className="text-[11px] font-medium text-[#4A6E5E] dark:text-[#85AFA0] block">
              {t.languageSelect}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onLanguageChange && onLanguageChange('hi')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-[#168A5B] text-white shadow-sm ring-1 ring-[#168A5B]'
                    : 'bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334] hover:bg-slate-100 dark:hover:bg-[#1A3C2F]'
                }`}
              >
                हिन्दी (HI)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange && onLanguageChange('en')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#168A5B] text-white shadow-sm ring-1 ring-[#168A5B]'
                    : 'bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334] hover:bg-slate-100 dark:hover:bg-[#1A3C2F]'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange && onLanguageChange('mr')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'mr'
                    ? 'bg-[#168A5B] text-white shadow-sm ring-1 ring-[#168A5B]'
                    : 'bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334] hover:bg-slate-100 dark:hover:bg-[#1A3C2F]'
                }`}
              >
                मराठी (MR)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange && onLanguageChange('pa')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'pa'
                    ? 'bg-[#168A5B] text-white shadow-sm ring-1 ring-[#168A5B]'
                    : 'bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334] hover:bg-slate-100 dark:hover:bg-[#1A3C2F]'
                }`}
              >
                ਪੰਜਾਬੀ (PA)
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-2">
            <span className="text-[11px] font-medium text-[#4A6E5E] dark:text-[#85AFA0] block">
              {language === 'hi' ? 'रंग थीम' : 'Visual Theme'}
            </span>
            <button
              onClick={onToggleTheme}
              className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
            >
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode (Primary)'}</span>
              {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
            </button>
          </div>

          {/* Outdoor Sunlight Mode */}
          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-2">
            <span className="text-[11px] font-medium text-[#4A6E5E] dark:text-[#85AFA0] block">
              {t.outdoorMode}
            </span>
            <button
              onClick={onToggleOutdoorMode}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                outdoorMode
                  ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-500 font-extrabold'
                  : 'bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334] hover:bg-slate-100'
              }`}
            >
              <span>{outdoorMode ? t.outdoorModeActive : (language === 'hi' ? 'खेत मोड चालू करें' : 'Sunlight Boost')}</span>
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Support & Kisan Mitra */}
      <div className="rounded-2xl bg-white dark:bg-[#0E241C] border border-[#DCE7E1] dark:border-[#1D4334] p-5 space-y-4 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-[#168A5B]" />
          <span>{language === 'hi' ? 'सहायता व संपर्क हेल्पलाइन' : 'Helpline & Assistant Support'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:18001801551"
            className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                  {t.tollFreeLabel}
                </span>
                <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                  {t.tollFree}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-700" />
          </a>

          <button
            type="button"
            onClick={onOpenVoiceMitra}
            className="p-3.5 rounded-xl bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] flex items-center justify-between hover:bg-[#DDF4E9] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#168A5B] text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0B5D3B] dark:text-[#6EE7B7] block">
                  {t.kisanMitraTitle}
                </span>
                <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
                  {language === 'hi' ? 'बोलकर या लिखकर प्रश्न पूछें' : 'Grounded voice & text guidance'}
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-[#168A5B]" />
          </button>
        </div>
      </div>

      {/* Security & Clear Session and Logout Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0E241C] border border-[#DCE7E1] dark:border-[#1D4334] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#168A5B]" />
            <span>{language === 'hi' ? 'सत्र सुरक्षा एवं लॉगआउट' : 'Session Security & Logout'}</span>
          </h4>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#E7F7EF] text-[#0B5D3B]">
            {t.sessionActiveStatus}
          </span>
        </div>

        <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] leading-relaxed">
          {t.clearSessionDesc}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
            Kisan ID: <strong className="font-mono text-[#083324] dark:text-[#F0FAF5]">{farmer.kisanId}</strong> • Local Token Cache Ready
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.clearSessionAndLogout}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0E241C] rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.clearSessionConfirm}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.clearSessionDesc}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.confirmLogout}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
