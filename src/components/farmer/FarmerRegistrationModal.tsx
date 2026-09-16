import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  Building2, 
  CreditCard, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  FileText,
  ShieldCheck,
  Send
} from 'lucide-react';
import { FarmerProfile, LanguageCode, LandParcel } from '../../types';
import { playAudioChime } from '../../utils/speech';
import { saveFarmerToFirestore } from '../../services/firestoreDbService';

interface FarmerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onRegistrationSuccess: (newFarmer: FarmerProfile) => void;
}

export const FarmerRegistrationModal: React.FC<FarmerRegistrationModalProps> = ({
  isOpen,
  onClose,
  language,
  onRegistrationSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Personal & Contact
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  // Step 2: Location & Land Holding
  const [stateName, setStateName] = useState('Maharashtra');
  const [district, setDistrict] = useState('Wardha');
  const [tehsil, setTehsil] = useState('Deoli');
  const [village, setVillage] = useState('');
  const [landAcres, setLandAcres] = useState('4.5');
  const [khasraNumber, setKhasraNumber] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('Soybean');

  // Step 3: Banking & Identity for DBT
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle sending SMTP OTP to verify email
  const handleSendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg(language === 'hi' ? 'कृपया एक वैध ईमेल पता दर्ज करें' : 'Please enter a valid email address');
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg(null);
    setOtpNotice(null);

    try {
      const res = await fetch('/api/auth/send-smtp-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName: fullName || 'किसान भाई' })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpNotice(
          language === 'hi'
            ? 'सत्यापन कोड आपके ईमेल पर सफलतापूर्वक भेजा गया है।'
            : 'Verification code dispatched to your email address.'
        );
      } else {
        setErrorMsg(data.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      setErrorMsg('Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle verifying Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) {
      setErrorMsg(language === 'hi' ? 'कृपया 6-अंकीय ओटीपी दर्ज करें' : 'Please enter the 6-digit OTP');
      return;
    }
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/verify-smtp-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: emailOtp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        playAudioChime();
        setOtpNotice(language === 'hi' ? 'ईमेल सफलतापूर्वक सत्यापित हो गया!' : 'Email successfully verified!');
      } else {
        setErrorMsg(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setErrorMsg('Verification failed');
    }
  };

  // Step navigation validations
  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setErrorMsg(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
        return;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!village.trim()) {
        setErrorMsg(language === 'hi' ? 'कृपया अपने गांव का नाम दर्ज करें' : 'Please enter your village name');
        return;
      }
      if (!khasraNumber.trim()) {
        setErrorMsg(language === 'hi' ? 'कृपया खसरा या 7/12 सर्वे संख्या दर्ज करें' : 'Please enter your Khasra / Survey number');
        return;
      }
      setStep(3);
    }
  };

  // Final submission: generate Kisan ID & create farmer
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length < 12) {
      setErrorMsg(language === 'hi' ? 'कृपया 12 अंकों का आधार नंबर दर्ज करें' : 'Please enter a 12-digit Aadhaar number');
      return;
    }
    if (!bankAccount.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया बैंक खाता संख्या दर्ज करें' : 'Please enter bank account number');
      return;
    }

    setIsSubmitting(true);

    try {
      const randArray = new Uint32Array(1);
      crypto.getRandomValues(randArray);
      const uniqueSuffix = (randArray[0] % 9000) + 1000;
      const randomId = `FARM-${Date.now().toString().slice(-4)}${uniqueSuffix}`;
      const stateCode = stateName.slice(0, 2).toUpperCase();
      const distCode = district.slice(0, 3).toUpperCase();
      const generatedKisanId = `${stateCode}-${distCode}-${uniqueSuffix}`;
      const last4 = cleanAadhaar.slice(-4);

      const newParcel: LandParcel = {
        id: `PARCEL-${uniqueSuffix}`,
        khasraNumber: khasraNumber.trim(),
        areaAcres: parseFloat(landAcres) || 4.0,
        cropSeason: 'Kharif',
        primaryCrop: primaryCrop,
        primaryCropHi: primaryCrop,
        soilHealthCardId: `SHC-${distCode}-${uniqueSuffix}`,
        irrigationSource: 'Borewell & Canal'
      };

      const newFarmerProfile: FarmerProfile = {
        id: randomId,
        kisanId: generatedKisanId,
        aadhaarLast4: last4,
        fullName: fullName.trim(),
        fullNameHi: fullName.trim(),
        phone: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
        email: email.trim() || undefined,
        village: village.trim(),
        villageHi: village.trim(),
        district: district.trim(),
        state: stateName.trim(),
        bankAccount: bankAccount.trim(),
        bankName: bankName.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        landParcels: [newParcel],
        pmKisanBeneficiary: true
      };

      // Save to Firestore and local state
      await saveFarmerToFirestore(newFarmerProfile);
      playAudioChime();
      onRegistrationSuccess(newFarmerProfile);
      onClose();
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#0E241C] rounded-3xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] overflow-hidden my-auto text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B5D3B] to-[#063B2A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif-display">
                {language === 'hi' ? 'नया किसान पंजीकरण (Create Account)' : 'New Farmer Registration'}
              </h3>
              <p className="text-xs text-emerald-200/90">
                {language === 'hi' ? 'डिजिटल मंडी व सीधा डीबीटी खाता जोड़ें' : 'Digital Mandi & Direct DBT Enrollment'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Indicator */}
        <div className="px-6 py-3 bg-[#F0F5F2] dark:bg-[#143026] border-b border-[#D7E3DC] dark:border-[#2B5E4A] flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#0B5D3B] dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#0B5D3B] text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
            <span>{language === 'hi' ? 'व्यक्तिगत व संपर्क' : 'Contact & Auth'}</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300 dark:bg-[#2B5E4A]" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#0B5D3B] dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#0B5D3B] text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
            <span>{language === 'hi' ? 'भूमि व फसल' : 'Land & Crop'}</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300 dark:bg-[#2B5E4A]" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#0B5D3B] dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#0B5D3B] text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
            <span>{language === 'hi' ? 'डीबीटी बैंक व आधार' : 'DBT Bank'}</span>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Personal & Contact */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'किसान का पूरा नाम (Full Name) *' : 'Farmer Full Name *'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. ज्ञानेश्वर विट्ठलराव पाटिल' : 'e.g. Rameshwar V. Patil'}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#168A5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#168A5B]" />
                  <span>{language === 'hi' ? '10-अंकीय मोबाइल नंबर *' : '10-Digit Mobile Number *'}</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 rounded-l-xl bg-slate-200 dark:bg-[#1f4034] text-slate-700 dark:text-slate-200 text-xs font-bold border border-r-0 border-slate-300 dark:border-[#2B5E4A]">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3 py-2.5 rounded-r-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#168A5B]"
                  />
                </div>
              </div>

              {/* SMTP Auth Email Verification */}
              <div className="p-3.5 rounded-xl bg-[#F0F5F2] dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#063B2A] dark:text-emerald-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#168A5B]" />
                    <span>{language === 'hi' ? 'ईमेल पता (SMTP प्रमाणीकरण / सूचनाएं)' : 'Email Address (SMTP Auth / Alerts)'}</span>
                  </label>
                  {otpVerified && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    disabled={otpVerified}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer.name@gmail.com"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-white dark:bg-[#0E241C] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#168A5B]"
                  />
                  {!otpVerified && (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={isSendingOtp || !email.includes('@')}
                      className="px-3 py-2 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSendingOtp ? '...' : language === 'hi' ? 'ओटीपी भेजें' : 'Send OTP'}</span>
                    </button>
                  )}
                </div>

                {otpNotice && (
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60 p-2 rounded-lg font-medium">
                    {otpNotice}
                  </div>
                )}

                {otpSent && !otpVerified && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder={language === 'hi' ? '6-अंकीय कोड' : '6-digit OTP'}
                      className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#2B5E4A] bg-white dark:bg-[#0E241C] text-xs font-mono text-center tracking-widest focus:ring-2 focus:ring-[#168A5B]"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      {language === 'hi' ? 'कोड सत्यापित करें' : 'Verify Code'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Location & Land Records */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'राज्य (State)' : 'State'}
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'जिला (District)' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'तहसील / ब्लॉक (Tehsil)' : 'Tehsil'}
                  </label>
                  <input
                    type="text"
                    value={tehsil}
                    onChange={(e) => setTehsil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'गांव (Village) *' : 'Village *'}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. सिंदी (रेल्वे)' : 'e.g. Sindi'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'कुल कृषि भूमि (एकड़)' : 'Total Land (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={landAcres}
                    onChange={(e) => setLandAcres(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'खसरा / 7-12 सर्वे नं. *' : 'Khasra / Survey No. *'}
                  </label>
                  <input
                    type="text"
                    value={khasraNumber}
                    onChange={(e) => setKhasraNumber(e.target.value)}
                    placeholder="उदा. 48/1-C"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'मुख्य बोई गई फसल (Primary Crop)' : 'Primary Sown Crop'}
                </label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="Soybean">सोयाबीन (Soybean)</option>
                  <option value="Cotton">कपास (Cotton)</option>
                  <option value="Wheat">गेहूं (Wheat)</option>
                  <option value="Chana">चना (Gram / Chana)</option>
                  <option value="Tur">अरहर / तूर (Pigeon Pea)</option>
                  <option value="Maize">मक्का (Maize)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Banking & Identity for Direct DBT */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#168A5B]" />
                  <span>{language === 'hi' ? '12-अंकीय आधार कार्ड संख्या *' : '12-Digit Aadhaar Card Number *'}</span>
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={aadhaarNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                    setAadhaarNumber(formatted);
                  }}
                  placeholder="XXXX XXXX XXXX"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs sm:text-sm font-mono tracking-wider focus:ring-2 focus:ring-[#168A5B]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  {language === 'hi' ? 'यूआईडीएआई नियमों के अनुसार केवल अंतिम 4 अंक सुरक्षित रूप से सहेजे जाएंगे।' : 'Complies with UIDAI guidelines: only masked last 4 digits stored.'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#168A5B]" />
                  <span>{language === 'hi' ? 'डीबीटी बैंक खाता संख्या *' : 'DBT Bank Account Number *'}</span>
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                  placeholder="30894561230"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#168A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'बैंक का नाम' : 'Bank Name'}
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'आईएफएससी कोड (IFSC)' : 'IFSC Code'}
                  </label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="SBIN0001234"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-slate-900 dark:text-white text-xs font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#143026] border-t border-slate-200 dark:border-[#2B5E4A] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setStep((prev) => (prev - 1) as 1 | 2);
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {language === 'hi' ? '← पीछे जाएं' : '← Back'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs font-semibold cursor-pointer"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'hi' ? 'आगे बढ़ें →' : 'Continue →'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitRegistration}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? (language === 'hi' ? 'पंजीयन हो रहा है...' : 'Registering...') : (language === 'hi' ? 'खाता बनाएं व लॉगिन करें' : 'Create Account & Sign In')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
