import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sprout, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Scale, 
  Banknote, 
  PhoneCall, 
  KeyRound, 
  AlertCircle,
  X,
  Building2,
  CalendarCheck,
  FileText,
  UserPlus,
  Volume2,
  Sparkles,
  LogIn,
  Mail,
  Bot,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { FarmerProfile, LanguageCode } from '../../types';
import { FARMER_REGISTRY } from '../../data/agriMockData';
import { getTranslations } from '../../i18n';
import { playAudioChime } from '../../utils/speech';
import { signInWithGoogle } from '../../services/firebaseConfig';
import { handleGoogleUserLogin } from '../../services/firestoreDbService';

interface PublicLandingGateProps {
  language: LanguageCode;
  onOpenFarmerLogin: () => void;
  onOpenSupervisorLogin: () => void;
  onOpenSuperAdminLogin: () => void;
  onOpenDemoDrawer: () => void;
  onOpenRegistration?: () => void;
  onOpenVoiceMitra?: () => void;
  onOpenGeminiAssistant?: () => void;
  onLoginSuccess?: (farmer: FarmerProfile) => void;
}

export const PublicLandingGate: React.FC<PublicLandingGateProps> = ({
  language,
  onOpenFarmerLogin,
  onOpenSupervisorLogin,
  onOpenSuperAdminLogin,
  onOpenDemoDrawer,
  onOpenRegistration,
  onOpenVoiceMitra,
  onOpenGeminiAssistant,
  onLoginSuccess
}) => {
  const t = getTranslations(language);

  // Google sign in state
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Secret Key Prompt State
  const [isSecretKeyPromptOpen, setIsSecretKeyPromptOpen] = useState(false);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [secretKeyError, setSecretKeyError] = useState<string | null>(null);

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    if (!onLoginSuccess) return;
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        const farmer = await handleGoogleUserLogin(user);
        playAudioChime();
        onLoginSuccess(farmer);
      }
    } catch (err: any) {
      console.warn('Google sign in note:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setGoogleError(language === 'hi' ? 'गूगल लॉगिन विफल। कृपया पुनः प्रयास करें।' : 'Google Sign-in failed. Please retry.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Keyboard shortcut listener for authorized officers (Ctrl+Shift+A for Supervisor, Ctrl+Shift+S for Admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'A' || e.key === 'a') {
          e.preventDefault();
          onOpenSupervisorLogin();
        } else if (e.key === 'S' || e.key === 's') {
          e.preventDefault();
          onOpenSuperAdminLogin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSupervisorLogin, onOpenSuperAdminLogin]);

  // Handle Secret Key verification
  const handleVerifySecretKey = (e: React.FormEvent) => {
    e.preventDefault();
    const key = secretKeyInput.trim();

    if (!key) {
      setSecretKeyError(
        language === 'hi'
          ? 'कृपया अपनी विभागीय सुरक्षा कुंजी दर्ज करें।'
          : 'Please enter your departmental access key.'
      );
      return;
    }

    // Check against authorized departmental secret keys
    if (key === '1234' || key.toUpperCase() === 'SUP-WRD-01' || key.toLowerCase() === 'supervisor') {
      playAudioChime();
      setIsSecretKeyPromptOpen(false);
      setSecretKeyInput('');
      setSecretKeyError(null);
      onOpenSupervisorLogin();
    } else if (key === 'admin2026' || key.toUpperCase() === 'ADMIN-MH-STATE-01' || key.toLowerCase() === 'admin') {
      playAudioChime();
      setIsSecretKeyPromptOpen(false);
      setSecretKeyInput('');
      setSecretKeyError(null);
      onOpenSuperAdminLogin();
    } else {
      setSecretKeyError(
        language === 'hi'
          ? 'अमान्य सुरक्षा कुंजी। प्रवेश अस्वीकृत (Access Denied)।'
          : 'Invalid departmental secret key. Access denied.'
      );
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Official State / National Portal Crest */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] text-[#0B5D3B] dark:text-[#6EE7B7] text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#168A5B]" />
          <span>{language === 'hi' ? 'राष्ट्रीय ई-गवर्नेंस योजना • भारत सरकार' : 'National e-Governance Plan • Government of India'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif-display text-[#083324] dark:text-[#F0FAF5] tracking-tight">
          {language === 'hi' 
            ? 'कृषि उपज उपार्जन व पारदर्शी डिजिटल मंडी प्रणाली' 
            : 'Agricultural Procurement & Transparent Digital Mandi System'}
        </h1>

        <p className="text-sm sm:text-base text-[#4A6E5E] dark:text-[#85AFA0] leading-relaxed">
          {language === 'hi'
            ? 'किसान भाइयों हेतु पारदर्शी डिजिटल कतार, बिना कतार तौल पर्ची, एवं सीधा डीबीटी बैंक भुगतान।'
            : 'Empowering farmers with instant digital slot booking, verified weighbridge slips, and direct DBT bank transfers.'}
        </p>
      </div>

      {/* SECTION 1: PRIMARY CITIZEN / FARMER PORTAL HERO */}
      <div className="w-full bg-gradient-to-br from-[#0B5D3B] to-[#063B2A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#168A5B]/40 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Sprout className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Citizen Welcome & Description */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-[#063B2A] text-xs font-extrabold uppercase tracking-wider shadow-xs">
                {language === 'hi' ? '★ नागरिक / किसान सेवा' : '★ Citizen & Farmer Service'}
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                {language === 'hi' ? 'आधिकारिक सार्वजनिक पोर्टल' : 'Official Public Portal'}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white tracking-tight leading-snug">
                {language === 'hi' 
                  ? 'किसान भाईयों हेतु सरल लॉगिन (OTP आधारित)' 
                  : 'Easy Farmer Portal (Instant OTP Login)'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {language === 'hi'
                  ? 'किसानों को कोई पासवर्ड याद रखने की आवश्यकता नहीं है। केवल अपना पंजीकृत 10-अंकों का मोबाइल नंबर या आधार नंबर दर्ज करें और तत्काल OTP से प्रवेश करें।'
                  : 'Farmers do not need complex passwords. Simply enter your registered mobile number or Aadhaar card to log in securely with instant OTP verification.'}
              </p>
            </div>

            {/* 4 Citizen Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'डिजिटल कतार व टोकन' : 'Digital Token & QR Pass'}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    {language === 'hi' ? 'मंडी गेट पर त्वरित प्रवेश हेतु लाइव QR पास' : 'Instant gate QR pass & queue tracking'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'इलेक्ट्रॉनिक धर्मकांटा तौल' : 'Verified Weighbridge Slip'}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    {language === 'hi' ? 'सटीक वजन, नमी व ग्रेड की पारदर्शी रसीद' : 'Accurate gross/tare weight & moisture grade'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-2.5">
                <Banknote className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'प्रत्यक्ष डीबीटी बैंक भुगतान' : 'Direct DBT Bank Transfer'}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    {language === 'hi' ? 'एमएसपी राशि सीधे बैंक खाते में ट्रांसफर' : 'MSP amount credited directly via PFMS/NPCI'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'किसान मित्र व टोल-फ्री 1800' : 'Kisan Mitra & Toll-Free'}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    {language === 'hi' ? 'वॉयस व चैट द्वारा स्थानीय भाषा में सहायता' : 'Bilingual voice assistance & helpline'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Citizen Action Card */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0E241C] text-[#063B2A] dark:text-[#ECF8F2] p-5 sm:p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-[#2B5E4A] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#168A5B] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'प्रवेश प्रमाणीकरण' : 'Authentication Gate'}</span>
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                  {language === 'hi' ? 'लॉगिन आवश्यक' : 'Login Required'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#063B2A] dark:text-white font-serif-display">
                {language === 'hi' ? 'किसान भाई लॉगिन करें' : 'Farmer Sign In'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'मंडी सेवाएं, डिजिटल कतार टोकन व डीबीटी रसीद प्राप्त करने हेतु कृपया नीचे दिए गए माध्यम से लॉगिन करें।'
                  : 'Please sign in below with OTP or quick access to view live queue tokens, entry passes, and DBT payments.'}
              </p>
            </div>

            {/* Citizen Authentication Methods Overview */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A] space-y-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'hi' ? 'सत्यापित प्रवेश माध्यम:' : 'Official Access Methods:'}</span>
              </span>
              <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 pl-1">
                <li className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{language === 'hi' ? 'पंजीकृत मोबाइल नंबर पर त्वरित 4-अंकीय ओटीपी' : '4-Digit OTP on registered mobile number'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{language === 'hi' ? '12-अंकों का आधार नंबर और बायोमेट्रिक/ओटीपी सत्यापन' : '12-Digit Aadhaar authentication'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>{language === 'hi' ? 'सुरक्षित ईमेल ओटीपी (लाइव SMTP सत्यापन)' : 'Secure Email OTP (Live SMTP Relay)'}</span>
                </li>
              </ul>
            </div>

            {/* Direct Google Sign-In with Firebase Auth */}
            {onLoginSuccess && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#143026] hover:bg-slate-50 dark:hover:bg-[#1B3E31] text-slate-800 dark:text-white border border-slate-300 dark:border-[#2B5E4A] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>
                  {language === 'hi' 
                    ? 'गूगल द्वारा सत्यापित लॉगिन (Firebase Auth)' 
                    : 'Sign in with Google (Firebase Auth)'}
                </span>
              </button>
            )}

            {googleError && (
              <p className="text-[11px] text-red-600 dark:text-red-400 text-center">{googleError}</p>
            )}

            <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-[#2B5E4A]">
              <button
                type="button"
                onClick={onOpenFarmerLogin}
                className="w-full py-3 px-4 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-amber-300" />
                <span>{language === 'hi' ? 'मोबाइल / आधार / ईमेल OTP से लॉगिन करें' : 'Log In with Phone / Aadhaar / Email OTP'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {onOpenRegistration && (
                  <button
                    type="button"
                    onClick={onOpenRegistration}
                    className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 text-[#0B5D3B] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="truncate">{language === 'hi' ? 'नया पंजीकरण' : 'Register New'}</span>
                  </button>
                )}

                {onOpenGeminiAssistant && (
                  <button
                    type="button"
                    onClick={onOpenGeminiAssistant}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-300" />
                    <span className="truncate">{language === 'hi' ? 'कृषि सहायक AI' : 'Krishi Sahayak AI'}</span>
                  </button>
                )}

                {onOpenVoiceMitra && (
                  <button
                    type="button"
                    onClick={onOpenVoiceMitra}
                    className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="truncate">{language === 'hi' ? 'किसान आवाज AI' : 'Voice AI'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TRANSPARENT PROCUREMENT WORKFLOW */}
      <div className="w-full bg-white dark:bg-[#0E241C] border border-[#D7E3DC] dark:border-[#2B5E4A] rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#063B2A] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-[#168A5B]" />
          <span>{language === 'hi' ? 'पारदर्शी डिजिटल उपार्जन प्रक्रिया' : 'Transparent Procurement Workflow'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-[#F0F5F2] dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A] space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#168A5B] text-white text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-[#063B2A] dark:text-white">
                {language === 'hi' ? 'स्लॉट व ई-टोकन' : 'Slot Booking & Token'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {language === 'hi' ? 'फसल, वजन व तारीख चुनें और डिजिटल गेट पास प्राप्त करें।' : 'Select crop, estimated weight, and receive digital gate pass.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F0F5F2] dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A] space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#168A5B] text-white text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-[#063B2A] dark:text-white">
                {language === 'hi' ? 'धर्मकांटा व नमी परीक्षण' : 'Weighbridge & Quality QC'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {language === 'hi' ? 'इलेक्ट्रॉनिक कांटा द्वारा निष्पक्ष सकल व तौल वजन मापन।' : 'Electronic gross & tare weighing with instant moisture analysis.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F0F5F2] dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A] space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#168A5B] text-white text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-[#063B2A] dark:text-white">
                {language === 'hi' ? 'सीधा डीबीटी भुगतान' : 'Direct DBT Transfer'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {language === 'hi' ? 'PFMS / NPCI के माध्यम से एमएसपी राशि सीधे आधार लिंक बैंक खाते में।' : 'MSP procurement amount transferred directly to bank account via PFMS.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: STRICTLY GATED DEPARTMENTAL ACCESS (Hidden until Secret Keys entered) */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-[#D7E3DC]/60 dark:border-[#2B5E4A]/60 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'राष्ट्रीय ई-मंडी सुरक्षा मानक अनुपालित' : 'Complies with National e-Mandi Security Standards'}</span>
        </div>

        {/* Discreet trigger for departmental secret key authorization */}
        <button
          type="button"
          onClick={() => {
            setIsSecretKeyPromptOpen(true);
            setSecretKeyInput('');
            setSecretKeyError(null);
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Restricted official access: Press Ctrl+Shift+A or enter key"
        >
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === 'hi' ? 'विभागीय गुप्त प्रवेश (Staff Secret Access)' : 'Official Staff Secret Access'}</span>
        </button>
      </div>

      {/* SECRET KEY VERIFICATION MODAL (Departmental Gate) */}
      {isSecretKeyPromptOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#0E241C] rounded-2xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2B5E4A]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#063B2A] dark:text-white">
                    {language === 'hi' ? 'विभागीय सुरक्षा कुंजी दर्ज करें' : 'Enter Departmental Secret Key'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'hi' ? 'केवल अधिकृत मंडी व राज्य कर्मचारियों हेतु' : 'Authorized Personnel Access Only'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSecretKeyPromptOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'पर्यवेक्षक या सुपर एडमिन कंसोल तक पहुँचने के लिए अपनी अधिकृत गुप्त सुरक्षा कुंजी (Secret Key) दर्ज करें:'
                : 'Enter your authorized administrative secret key or PIN to access the supervisor or governance console:'}
            </p>

            <form onSubmit={handleVerifySecretKey} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'गुप्त कुंजी / पासकी (Secret Key / PIN):' : 'Secret Key / Access Code:'}
                </label>
                <input
                  type="password"
                  value={secretKeyInput}
                  onChange={(e) => {
                    setSecretKeyInput(e.target.value);
                    setSecretKeyError(null);
                  }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
                />
              </div>

              {secretKeyError && (
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{secretKeyError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSecretKeyPromptOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B5D3B] hover:bg-[#063B2A] text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सत्यापित करें और अनलॉक करें' : 'Verify & Unlock Terminal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
