import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sprout, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Send,
  RefreshCw,
  Database
} from 'lucide-react';
import { 
  detectIdentifierType, 
  validateIdentifier, 
  authenticateFarmerAsync, 
  maskAadhaar,
  DetectedIdentifierType,
  isDemoEnvironment,
  DemoAccountDirectoryItem
} from '../../services/authService';
import { FarmerProfile, LanguageCode } from '../../types';
import { DemoCredentialsDirectory } from '../common/DemoCredentialsDirectory';
import { playAudioChime } from '../../utils/speech';

interface FarmerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (farmer: FarmerProfile) => void;
  language: LanguageCode;
  currentFarmer?: FarmerProfile;
}

export const FarmerLoginModal: React.FC<FarmerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
  currentFarmer
}) => {
  // Login modes: 'phone' or 'aadhaar'
  const [activeMode, setActiveMode] = useState<'phone' | 'aadhaar'>('phone');
  const [identifierInput, setIdentifierInput] = useState('9822481920');
  const [otpCode, setOtpCode] = useState('1234');
  const [otpSent, setOtpSent] = useState(true);
  const [otpCountdown, setOtpCountdown] = useState(30);
  const [inlineError, setInlineError] = useState<{ en?: string; hi?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Live detection of identifier type
  const detectedType = detectIdentifierType(identifierInput);

  useEffect(() => {
    if (otpSent && otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpSent, otpCountdown]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    const val = validateIdentifier(identifierInput);
    if (!val.isValid) {
      setInlineError({ en: val.errorEn, hi: val.errorHi });
      return;
    }
    setInlineError(null);
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setOtpCountdown(30);
      setOtpCode('1234'); // Pre-fill with demo OTP for effortless login
      playAudioChime();
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate identifier
    const validation = validateIdentifier(identifierInput);
    if (!validation.isValid) {
      setInlineError({ en: validation.errorEn, hi: validation.errorHi });
      return;
    }

    if (!otpCode.trim()) {
      setInlineError({
        en: 'Please enter the 4-digit OTP (Demo OTP: 1234).',
        hi: 'कृपया 4-अंकीय ओटीपी दर्ज करें (डेमो ओटीपी: 1234)।'
      });
      return;
    }

    setIsSubmitting(true);
    setInlineError(null);

    try {
      // Async authentication with Firestore lookup and seeded fallback
      const result = await authenticateFarmerAsync(identifierInput, otpCode);
      setIsSubmitting(false);

      if (result.success && result.farmer) {
        playAudioChime();
        onLoginSuccess(result.farmer);
      } else {
        setInlineError({
          en: result.errorEn || 'Authentication failed. Please check your number/Aadhaar.',
          hi: result.errorHi || 'प्रमाणीकरण विफल। कृपया अपने नंबर या आधार की पुष्टि करें।'
        });
      }
    } catch {
      setIsSubmitting(false);
      setInlineError({
        en: 'Verification error. Please retry or use demo credentials.',
        hi: 'सत्यापन त्रुटि। कृपया पुनः प्रयास करें या डेमो क्रेडेंशियल चुनें।'
      });
    }
  };

  const handleSelectFromDemoDirectory = (
    account: DemoAccountDirectoryItem, 
    preferredIdentifier: string
  ) => {
    setIdentifierInput(preferredIdentifier);
    setOtpCode(account.demoPasscode || '1234');
    setOtpSent(true);
    setInlineError(null);
    if (account.identifiers.aadhaarFull && preferredIdentifier.includes(' ')) {
      setActiveMode('aadhaar');
    } else {
      setActiveMode('phone');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="farmer-login-title"
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0E241C] rounded-2xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] overflow-hidden my-auto transition-colors"
      >
        {/* Modal Header */}
        <div className="bg-[#063B2A] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#0B5D3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#168A5B] flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/10 text-emerald-300 border border-white/20">
                  {language === 'hi' ? 'नागरिक / किसान पोर्टल' : 'Citizen Self-Service'}
                </span>
                <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Firestore Synced</span>
                </span>
              </div>
              <h3 id="farmer-login-title" className="text-base font-bold text-white tracking-tight font-serif-display">
                {language === 'hi' ? 'सरल किसान लॉगिन (OTP आधारित)' : 'Easy Farmer Login (Phone / Aadhaar OTP)'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Current active session badge (if logged in) */}
          {currentFarmer && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">
                  {language === 'hi' ? 'सक्रिय खाता:' : 'Currently signed in as:'}{' '}
                  <strong>{currentFarmer.fullName}</strong> ({currentFarmer.kisanId})
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold">
                {maskAadhaar(currentFarmer.aadhaarLast4)}
              </span>
            </div>
          )}

          {/* Simple Tab Switcher: Phone + OTP vs Aadhaar + OTP */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-[#143026] rounded-xl border border-slate-200 dark:border-[#2B5E4A]">
            <button
              type="button"
              onClick={() => {
                setActiveMode('phone');
                setIdentifierInput('9822481920');
                setOtpCode('1234');
                setInlineError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'phone'
                  ? 'bg-white dark:bg-[#063B2A] text-[#063B2A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#168A5B]" />
              <span>{language === 'hi' ? 'मोबाइल नंबर + OTP' : 'Phone Number + OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('aadhaar');
                setIdentifierInput('5678 1234 9082');
                setOtpCode('1234');
                setInlineError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'aadhaar'
                  ? 'bg-white dark:bg-[#063B2A] text-[#063B2A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#1D68BD]" />
              <span>{language === 'hi' ? 'आधार कार्ड + OTP' : 'Aadhaar Card + OTP'}</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier Input Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#063B2A] dark:text-[#E2ECE6] flex items-center gap-1.5">
                  <span>
                    {activeMode === 'phone'
                      ? (language === 'hi' ? '10-अंकों का मोबाइल नंबर' : '10-Digit Mobile Number')
                      : (language === 'hi' ? '12-अंकों का आधार नंबर' : '12-Digit Aadhaar Number')}
                  </span>
                  <span className="text-red-500">*</span>
                </label>

                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {language === 'hi' ? 'सरल व सुरक्षित' : 'Simple & Direct'}
                </span>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none">
                  {activeMode === 'phone' ? (
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                <input
                  type="text"
                  value={identifierInput}
                  onChange={(e) => {
                    setIdentifierInput(e.target.value);
                    setInlineError(null);
                  }}
                  placeholder={
                    activeMode === 'phone'
                      ? (language === 'hi' ? 'उदा. 9822481920' : 'e.g. 9822481920')
                      : (language === 'hi' ? 'उदा. 5678 1234 9082' : 'e.g. 5678 1234 9082')
                  }
                  className={`w-full pl-9 pr-24 py-2.5 rounded-xl border text-xs sm:text-sm font-medium bg-white dark:bg-[#071711] text-[#063B2A] dark:text-[#ECF8F2] focus:outline-none focus:ring-2 transition-all ${
                    inlineError 
                      ? 'border-red-400 focus:ring-red-400/40' 
                      : 'border-[#C7DCD1] dark:border-[#2B5E4A] focus:ring-[#168A5B]'
                  }`}
                  autoComplete="username"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#168A5B] hover:bg-[#12734C] text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 disabled:opacity-60"
                >
                  {isSendingOtp ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  <span>{otpSent ? (language === 'hi' ? 'ओटीपी पुनः भेजें' : 'Resend OTP') : (language === 'hi' ? 'ओटीपी भेजें' : 'Get OTP')}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {activeMode === 'phone'
                  ? (language === 'hi' ? 'पंजीकृत मोबाइल नंबर पर 4-अंकीय ओटीपी प्राप्त करें।' : 'Receive instant 4-digit verification OTP on your mobile.')
                  : (language === 'hi' ? 'आधार से लिंक मोबाइल नंबर पर सत्यापन कोड भेजा जाएगा।' : 'Secure OTP will be verified against UIDAI registered record.')}
              </p>
            </div>

            {/* OTP Code Input */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#F6F9F7] dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#063B2A] dark:text-[#E2ECE6] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#168A5B]" />
                  <span>{language === 'hi' ? 'प्राप्त 4-अंकीय ओटीपी (OTP) दर्ज करें' : 'Enter 4-Digit OTP'}</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                  Demo OTP: 1234
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setInlineError(null);
                  }}
                  placeholder="1234"
                  className="w-full px-4 py-2 text-center tracking-widest font-mono text-base font-bold rounded-lg border border-[#C7DCD1] dark:border-[#2B5E4A] bg-white dark:bg-[#071711] text-[#063B2A] dark:text-[#ECF8F2] focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span>{language === 'hi' ? 'डेमो उपयोग हेतु OTP 1234 पहले से भरा है' : 'Demo OTP (1234) is pre-filled for convenience'}</span>
                {otpCountdown > 0 && (
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">
                    {otpCountdown}s
                  </span>
                )}
              </div>
            </div>

            {/* Inline Error Message */}
            {inlineError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-800 dark:text-red-200 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">{language === 'hi' ? inlineError.hi : inlineError.en}</p>
                  {language === 'hi' && inlineError.en && (
                    <p className="text-[10px] text-red-600 dark:text-red-300">{inlineError.en}</p>
                  )}
                  {language !== 'hi' && inlineError.hi && (
                    <p className="text-[10px] text-red-600 dark:text-red-300">{inlineError.hi}</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'hi' ? 'सत्यापन जारी है...' : 'Verifying OTP & Logging In...'}</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'hi' ? 'ओटीपी सत्यापित करें और लॉगिन करें' : 'Verify OTP & Enter Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* UIDAI Compliance & Privacy Notice */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'UIDAI व DPDPA अनुपालन: पूर्ण आधार नंबर कभी भी पोस्ट-लॉगिन या सादे पाठ में प्रदर्शित नहीं किया जाता है (केवल XXXX XXXX 1234 स्वरूप)।'
                : 'UIDAI & DPDPA Compliant: Full Aadhaar numbers are never displayed or stored in plaintext post-authentication (strictly masked as XXXX XXXX 1234).'}
            </span>
          </div>

          {/* Seeded Farmers Demo Credentials Directory */}
          <DemoCredentialsDirectory
            language={language}
            filterRole="farmer"
            onSelectAccount={handleSelectFromDemoDirectory}
            defaultExpanded={true}
          />
        </div>
      </div>
    </div>
  );
};
