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
  Sparkles
} from 'lucide-react';
import { 
  detectIdentifierType, 
  validateIdentifier, 
  authenticateFarmer, 
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
  const [identifierInput, setIdentifierInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inlineError, setInlineError] = useState<{ en?: string; hi?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  // Live detection of identifier type
  const detectedType = detectIdentifierType(identifierInput);

  // Clear errors on input change
  useEffect(() => {
    if (touched) {
      const val = validateIdentifier(identifierInput);
      if (val.isValid || !identifierInput.trim()) {
        setInlineError(null);
      } else {
        setInlineError({ en: val.errorEn, hi: val.errorHi });
      }
    }
  }, [identifierInput, touched]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    // 1. Format validation before submission
    const validation = validateIdentifier(identifierInput);
    if (!validation.isValid) {
      setInlineError({ en: validation.errorEn, hi: validation.errorHi });
      return;
    }

    if (!passcode.trim()) {
      setInlineError({
        en: 'Please enter your 4-digit security PIN or OTP (Demo: 1234).',
        hi: 'कृपया अपना 4-अंकीय सुरक्षा पिन या ओटीपी दर्ज करें (डेमो: 1234)।'
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // 2. Authenticate
      const result = authenticateFarmer(identifierInput, passcode);
      setIsSubmitting(false);

      if (result.success && result.farmer) {
        setInlineError(null);
        playAudioChime();
        onLoginSuccess(result.farmer);
      } else {
        setInlineError({
          en: result.errorEn || 'Authentication failed. Please verify your credentials.',
          hi: result.errorHi || 'प्रमाणीकरण विफल। कृपया अपने विवरण की पुष्टि करें।'
        });
      }
    }, 350);
  };

  const handleSelectFromDemoDirectory = (
    account: DemoAccountDirectoryItem, 
    preferredIdentifier: string
  ) => {
    setIdentifierInput(preferredIdentifier);
    setPasscode(account.demoPasscode);
    setTouched(true);
    setInlineError(null);
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
              </div>
              <h3 id="farmer-login-title" className="text-base font-bold text-white tracking-tight font-serif-display">
                {language === 'hi' ? 'किसान लॉगिन व खाता अभिगम' : 'Kisan Farmer Sign-In'}
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
          {/* Current active session badge (if switching) */}
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tri-Method Identifier Input Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#063B2A] dark:text-[#E2ECE6] flex items-center gap-1.5">
                  <span>
                    {language === 'hi'
                      ? 'पहचानकर्ता दर्ज करें (आधार / मोबाइल / ईमेल)'
                      : 'Login Identifier (Aadhaar / Mobile / Email)'}
                  </span>
                  <span className="text-red-500">*</span>
                </label>

                {/* Dynamic live mode detection badge */}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  detectedType === 'aadhaar' 
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700' 
                    : detectedType === 'mobile' 
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : detectedType === 'email'
                    ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {detectedType === 'aadhaar' && (
                    <>
                      <CreditCard className="w-3 h-3 text-amber-700" />
                      <span>{language === 'hi' ? 'आधार (12 अंक)' : 'Aadhaar (12 Digits)'}</span>
                    </>
                  )}
                  {detectedType === 'mobile' && (
                    <>
                      <Smartphone className="w-3 h-3 text-emerald-700" />
                      <span>{language === 'hi' ? 'मोबाइल (10 अंक)' : 'Mobile (10 Digits)'}</span>
                    </>
                  )}
                  {detectedType === 'email' && (
                    <>
                      <Mail className="w-3 h-3 text-blue-700" />
                      <span>{language === 'hi' ? 'ईमेल पता' : 'Email Address'}</span>
                    </>
                  )}
                  {detectedType === 'unknown' && (
                    <span>{language === 'hi' ? 'स्वचालित पहचान सक्रिय' : 'Auto-detecting type'}</span>
                  )}
                </span>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none">
                  {detectedType === 'aadhaar' && <CreditCard className="w-4 h-4 text-amber-600" />}
                  {detectedType === 'mobile' && <Smartphone className="w-4 h-4 text-emerald-600" />}
                  {detectedType === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                  {detectedType === 'unknown' && <HelpCircle className="w-4 h-4 text-slate-400" />}
                </div>

                <input
                  type="text"
                  value={identifierInput}
                  onChange={(e) => {
                    setIdentifierInput(e.target.value);
                  }}
                  onBlur={() => setTouched(true)}
                  placeholder={
                    language === 'hi'
                      ? '12-अंक आधार, 10-अंक मोबाइल या ईमेल पता दर्ज करें'
                      : 'Enter 12-digit Aadhaar, 10-digit mobile, or email'
                  }
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium bg-white dark:bg-[#071711] text-[#063B2A] dark:text-[#ECF8F2] focus:outline-none focus:ring-2 transition-all ${
                    inlineError 
                      ? 'border-red-400 focus:ring-red-400/40' 
                      : 'border-[#C7DCD1] dark:border-[#2B5E4A] focus:ring-[#168A5B]'
                  }`}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              {/* Inline format hint */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'hi'
                  ? 'बिना मोड चुने सीधे टाइप करें: 12 अंकों का आधार, 10 अंकों का मोबाइल या @ युक्त ईमेल'
                  : 'Type naturally without picking a mode: 12-digit Aadhaar, 10-digit mobile, or email with @'}
              </p>
            </div>

            {/* Password / PIN / OTP Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#063B2A] dark:text-[#E2ECE6]">
                  {language === 'hi' ? 'सुरक्षा पिन / ओटीपी (Security PIN)' : 'Security PIN / OTP'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                  Demo PIN: 1234
                </span>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={language === 'hi' ? '4-अंकीय पिन दर्ज करें (उदा. 1234)' : 'Enter 4-digit PIN (Demo: 1234)'}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#C7DCD1] dark:border-[#2B5E4A] text-xs sm:text-sm font-medium bg-white dark:bg-[#071711] text-[#063B2A] dark:text-[#ECF8F2] focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Inline Error Message (Bilingual) */}
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
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>{language === 'hi' ? 'सत्यापन जारी है...' : 'Authenticating...'}</span>
              ) : (
                <>
                  <span>{language === 'hi' ? 'सुरक्षित किसान लॉगिन' : 'Sign In to Farmer Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & UIDAI Compliance Notice */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'UIDAI व DPDPA अनुपालन: पूर्ण आधार नंबर कभी भी पोस्ट-लॉगिन या सादे पाठ में प्रदर्शित नहीं किया जाता है (केवल XXXX XXXX 1234 स्वरूप)।'
                : 'UIDAI & DPDPA Compliant: Full Aadhaar numbers are never displayed or stored in plaintext post-authentication (strictly masked as XXXX XXXX 1234).'}
            </span>
          </div>

          {/* Part B: Demo Credentials Directory (Strictly visible in non-prod / demo environment) */}
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
