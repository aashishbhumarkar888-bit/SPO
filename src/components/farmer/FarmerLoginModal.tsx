import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  Mail, 
  QrCode, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sprout, 
  ArrowRight, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Database,
  Upload,
  UserPlus
} from 'lucide-react';
import { 
  detectIdentifierType, 
  validateIdentifier, 
  authenticateFarmerAsync
} from '../../services/authService';
import { 
  CURRENT_FARMER,
  FARMER_REGISTRY
} from '../../data/agriMockData';
import { FarmerProfile, LanguageCode } from '../../types';
import { playAudioChime } from '../../utils/speech';
import { emailService } from '../../services/emailService';

interface FarmerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (farmer: FarmerProfile) => void;
  language: LanguageCode;
  currentFarmer?: FarmerProfile | null;
  onOpenRegistration?: () => void;
}

export const FarmerLoginModal: React.FC<FarmerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
  currentFarmer,
  onOpenRegistration
}) => {
  // Login modes: 'phone' | 'aadhaar' | 'email' | 'qr'
  const [activeMode, setActiveMode] = useState<'phone' | 'aadhaar' | 'email' | 'qr'>('phone');
  const [identifierInput, setIdentifierInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [inlineError, setInlineError] = useState<{ en?: string; hi?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (otpSent && otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpSent, otpCountdown]);

  if (!isOpen) return null;

  // Send Mobile / Aadhaar OTP
  const handleSendMobileOtp = () => {
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
      setOtpCode('1234'); // Demo OTP for quick testing
      setOtpNotice(language === 'hi' ? 'ओटीपी 1234 भेजा गया है।' : 'Verification OTP 1234 sent.');
      playAudioChime();
    }, 400);
  };

  // Send Email SMTP OTP
  const handleSendEmailOtp = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      setInlineError({
        en: 'Please enter a valid email address.',
        hi: 'कृपया एक वैध ईमेल पता दर्ज करें।'
      });
      return;
    }
    setInlineError(null);
    setIsSendingOtp(true);
    setOtpNotice(null);

    try {
      const data = await emailService.sendOtp(emailInput);
      setIsSendingOtp(false);
      setOtpSent(true);
      setOtpCountdown(60);

      if (data.previewOtp) {
        setOtpCode(data.previewOtp);
        setOtpNotice(
          language === 'hi'
            ? `ओटीपी कोड: ${data.previewOtp} (सत्यापन कोड)`
            : `Verification code: ${data.previewOtp}`
        );
      } else {
        setOtpNotice(
          language === 'hi'
            ? 'सत्यापन कोड आपके ईमेल पर सफलतापूर्वक भेजा गया है।'
            : 'Verification code dispatched to your email address.'
        );
      }
      playAudioChime();
    } catch (err: any) {
      setIsSendingOtp(false);
      setInlineError({ en: err.message || 'Failed to dispatch email verification code', hi: err.message || 'ईमेल कोड भेजने में विफल' });
    }
  };

  // Handle Submit Form (Phone / Aadhaar / Email)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (activeMode === 'email') {
      if (!otpCode.trim()) {
        setInlineError({ en: 'Please enter the verification code.', hi: 'कृपया सत्यापन कोड दर्ज करें।' });
        return;
      }
      setIsSubmitting(true);
      try {
        const data = await emailService.verifyOtp(emailInput, otpCode);
        setIsSubmitting(false);

        if (data.success) {
          // Find matching farmer or construct session
          const matched = FARMER_REGISTRY.find(f => f.email?.toLowerCase() === emailInput.toLowerCase()) || {
            ...CURRENT_FARMER,
            id: `FARM-EM-${Date.now().toString().slice(-4)}`,
            kisanId: `MH-WRD-${Date.now().toString().slice(-4)}`,
            fullName: emailInput.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
            fullNameHi: emailInput.split('@')[0],
            email: emailInput.toLowerCase()
          };
          playAudioChime();
          onLoginSuccess(matched);
        } else {
          setInlineError({ en: data.error || 'Invalid OTP code', hi: data.error || 'अमान्य सत्यापन कोड' });
        }
      } catch (err: any) {
        setIsSubmitting(false);
        setInlineError({ en: err.message || 'Verification failed', hi: 'सत्यापन विफल रहा' });
      }
      return;
    }

    // Mobile / Aadhaar Mode
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

    try {
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
        en: 'Verification error. Please retry.',
        hi: 'सत्यापन त्रुटि। कृपया पुनः प्रयास करें।'
      });
    }
  };

  // QR Smart Card instant authentication
  const handleQrLogin = (farmer: FarmerProfile) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      playAudioChime();
      onLoginSuccess(farmer);
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="farmer-login-title"
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0E241C] rounded-2xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] overflow-hidden my-auto transition-colors text-left"
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
                {language === 'hi' ? 'किसान लॉगिन (मल्टी-मेथड प्रमाणीकरण)' : 'Farmer Login (Multi-Method Auth)'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Current active session badge */}
          {currentFarmer && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">
                  {language === 'hi' ? 'सक्रिय किसान:' : 'Current User:'} <strong>{currentFarmer.fullName}</strong>
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                {currentFarmer.kisanId}
              </span>
            </div>
          )}

          {/* 4 Multi-Auth Mode Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-[#143026] rounded-xl border border-slate-200 dark:border-[#2B5E4A] text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveMode('phone');
                setOtpSent(false);
                setInlineError(null);
              }}
              className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                activeMode === 'phone'
                  ? 'bg-white dark:bg-[#063B2A] text-[#063B2A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#168A5B]" />
              <span>{language === 'hi' ? 'मोबाइल' : 'Mobile'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('aadhaar');
                setOtpSent(false);
                setInlineError(null);
              }}
              className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                activeMode === 'aadhaar'
                  ? 'bg-white dark:bg-[#063B2A] text-[#063B2A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-[#1D68BD]" />
              <span>{language === 'hi' ? 'आधार' : 'Aadhaar'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('email');
                setOtpSent(false);
                setInlineError(null);
              }}
              className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                activeMode === 'email'
                  ? 'bg-white dark:bg-[#063B2A] text-[#063B2A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'hi' ? 'ईमेल SMTP' : 'Email OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('qr');
                setInlineError(null);
              }}
              className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                activeMode === 'qr'
                  ? 'bg-white dark:bg-[#063B2A] text-[#063B2A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-purple-500" />
              <span>{language === 'hi' ? 'क्यूआर कार्ड' : 'QR Card'}</span>
            </button>
          </div>

          {/* QR Code Scan Mode */}
          {activeMode === 'qr' ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A] text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-[#0E241C] border-2 border-dashed border-[#168A5B] flex items-center justify-center text-[#168A5B]">
                <QrCode className="w-8 h-8 text-[#0B5D3B] dark:text-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                  {language === 'hi' ? 'स्मार्ट किसान कार्ड क्यूआर स्कैन' : 'Scan Smart Kisan Card QR'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'hi'
                    ? 'अपने किसान कार्ड या मंडी पास का क्यूआर कोड प्रस्तुत करें।'
                    : 'Present your Kisan ID pass or Mandi entry QR code for instant login.'}
                </p>
              </div>

              {/* QR Scanner or Image Upload */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#2B5E4A]">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsSubmitting(true);
                      setTimeout(() => {
                        setIsSubmitting(false);
                        const matched = FARMER_REGISTRY[0];
                        playAudioChime();
                        onLoginSuccess(matched);
                      }, 800);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-[#0E241C] border border-dashed border-[#168A5B] text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#168A5B]" />
                  <span>{language === 'hi' ? 'कार्ड क्यूआर फोटो अपलोड करें' : 'Upload Kisan QR Code Image'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Phone / Aadhaar / Email Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {activeMode === 'email' ? (
                /* Email Input */
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#063B2A] dark:text-[#E2ECE6] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'hi' ? 'ईमेल पता (SMTP प्रमाणीकरण)' : 'Email Address (SMTP Auth)'}</span>
                    </span>
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="farmer@gmail.com"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#168A5B]"
                    />
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={isSendingOtp || !emailInput.includes('@')}
                      className="px-3.5 py-2 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSendingOtp ? '...' : language === 'hi' ? 'ओटीपी भेजें' : 'Send Code'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Phone / Aadhaar Input */
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
                      type={activeMode === 'phone' ? 'tel' : 'text'}
                      value={identifierInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (activeMode === 'phone') {
                          setIdentifierInput(raw.replace(/\D/g, '').slice(0, 10));
                        } else {
                          const digitsOnly = raw.replace(/\D/g, '').slice(0, 12);
                          setIdentifierInput(digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 '));
                        }
                      }}
                      placeholder={activeMode === 'phone' ? '98224 81920' : '5678 1234 9082'}
                      className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs sm:text-sm font-mono tracking-wider focus:ring-2 focus:ring-[#168A5B]"
                    />

                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      disabled={isSendingOtp}
                      className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      {isSendingOtp ? '...' : language === 'hi' ? 'ओटीपी भेजें' : 'Send OTP'}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Notice message */}
              {otpNotice && (
                <div className="text-[11px] text-emerald-800 dark:text-emerald-200 bg-emerald-100/70 dark:bg-emerald-950/70 p-2 rounded-lg font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{otpNotice}</span>
                </div>
              )}

              {/* OTP Code Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#063B2A] dark:text-[#E2ECE6] block">
                  {language === 'hi' ? 'सत्यापन कोड (OTP) *' : 'Verification Code (OTP) *'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder={language === 'hi' ? 'ओटीपी दर्ज करें (उदा. 1234)' : 'Enter code (e.g. 1234)'}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs sm:text-sm font-mono text-center tracking-widest focus:ring-2 focus:ring-[#168A5B]"
                />
              </div>

              {inlineError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700 dark:text-red-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{language === 'hi' ? inlineError.hi : inlineError.en}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{language === 'hi' ? 'सत्यापित करें व लॉगिन करें' : 'Verify & Enter Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* CREATE NEW ACCOUNT LINK */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-[#1f382b] dark:to-[#143026] border border-amber-200 dark:border-[#2B5E4A] flex items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {language === 'hi' ? 'क्या आप नए किसान हैं?' : 'New to AgriSeva Mandi?'}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 block">
                {language === 'hi' ? 'नया खाता बनाएं व तुरंत किसान आईडी प्राप्त करें' : 'Register to get your Kisan ID & book mandi slots'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegistration?.();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? 'नया खाता बनाएं' : 'Create Account'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
