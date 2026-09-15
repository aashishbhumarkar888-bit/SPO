import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sprout, 
  Lock, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  KeyRound,
  AlertTriangle,
  Smartphone,
  CreditCard,
  Scale,
  Receipt,
  Banknote,
  PhoneCall,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { getTranslations } from '../../i18n';

interface PublicLandingGateProps {
  language: LanguageCode;
  onOpenFarmerLogin: () => void;
  onOpenSupervisorLogin: () => void;
  onOpenSuperAdminLogin: () => void;
  onOpenDemoDrawer: () => void;
}

export const PublicLandingGate: React.FC<PublicLandingGateProps> = ({
  language,
  onOpenFarmerLogin,
  onOpenSupervisorLogin,
  onOpenSuperAdminLogin,
  onOpenDemoDrawer
}) => {
  const t = getTranslations(language);
  const [showDepartmentalDetails, setShowDepartmentalDetails] = useState(true);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Official State / National Portal Crest */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
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

      {/* SECTION 1: PRIMARY CITIZEN / FARMER PORTAL HERO (Direct citizen entry point) */}
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
                {language === 'hi' ? '★ नागरिक / किसान पोर्टल' : '★ Citizen & Farmer Portal'}
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                {language === 'hi' ? 'आधिकारिक सार्वजनिक सेवा' : 'Official Public Service'}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white tracking-tight leading-snug">
                {language === 'hi' 
                  ? 'किसान भाईयों हेतु सरल लॉगिन (OTP आधारित)' 
                  : 'Easy Farmer Portal (No Passwords Required)'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {language === 'hi'
                  ? 'किसानों को कोई गुप्त पासवर्ड याद रखने की जरूरत नहीं है। केवल अपना 10-अंकों का मोबाइल नंबर या 12-अंकों का आधार नंबर दर्ज करें और तत्काल OTP द्वारा लॉगिन करें।'
                  : 'Farmers do not need complex administrative passwords. Simply enter your registered 10-digit mobile or 12-digit Aadhaar to log in with instant OTP verification.'}
              </p>
            </div>

            {/* 4 Citizen Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'डिजिटल कतार व टोकन' : 'Digital Token & E-Pass'}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    {language === 'hi' ? 'घर बैठे स्लॉट बुक करें, मंडी में भीड़ से बचें' : 'Book advance slot & skip mandi queues'}
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
          <div className="lg:col-span-5 bg-white dark:bg-[#0E241C] text-[#063B2A] dark:text-[#ECF8F2] p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-[#2B5E4A] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#168A5B] dark:text-emerald-400 uppercase tracking-wider">
                  {language === 'hi' ? 'त्वरित नागरिक प्रवेश' : 'Citizen Self-Service'}
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                  {language === 'hi' ? 'OTP सत्यापन' : 'Instant OTP'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#063B2A] dark:text-white font-serif-display">
                {language === 'hi' ? 'किसान पोर्टल में प्रवेश करें' : 'Sign In as a Farmer'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'hi'
                  ? 'अपने पंजीकृत मोबाइल नंबर या आधार नंबर द्वारा तत्काल 4-अंकीय OTP से लॉगिन करें।'
                  : 'Enter using your registered mobile number or Aadhaar card with a fast 4-digit verification code.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#063B2A] dark:text-emerald-300 font-semibold">
                <UserCheck className="w-4 h-4 text-[#168A5B]" />
                <span>{language === 'hi' ? 'उपलब्ध डेमो किसान खाते:' : 'Available Demo Farmer Accounts:'}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div>• Rameshwar Patil (Wardha)</div>
                <div>• Ramesh Kumar (Rampur)</div>
                <div>• Sunita Bai (Seloo)</div>
                <div>• Baburao D. (Deoli)</div>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-[#C7DCD1]/60 dark:border-[#2B5E4A]/60">
                {language === 'hi' ? 'डेमो OTP: 1234 (पहले से भरा हुआ)' : 'Demo OTP: 1234 (Pre-filled for testing)'}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenFarmerLogin}
              className="w-full py-3.5 px-5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'किसान लॉगिन करें (OTP आधारित)' : 'Enter Farmer Portal (Phone/Aadhaar OTP)'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEPARTMENTAL & OFFICIAL ACCESS ZONE */}
      <div className="w-full space-y-4 pt-4">
        {/* Section Header with Security Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C7DCD1] dark:border-[#2B5E4A] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#063B2A] dark:text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'विभागीय एवं प्रशासनिक प्रवेश' : 'Restricted Departmental & Staff Portals'}</span>
                <span className="text-[10px] font-mono bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                  {language === 'hi' ? 'केवल अधिकृत अधिकारियों हेतु' : 'Authorized Personnel Only'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'hi'
                  ? 'धर्मकांटा तौल प्रमाणन, सरकारी फंड व नीति नियंत्रण हेतु सरकारी सुरक्षा कुंजी (Secret PIN / Passkey) अनिवार्य है।'
                  : 'Protected by official Employee IDs & Secret Passkeys for statutory weighbridge certification and MSP fund release.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDepartmentalDetails(!showDepartmentalDetails)}
            className="text-xs text-[#0B5D3B] dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{showDepartmentalDetails ? (language === 'hi' ? 'संक्षिप्त करें' : 'Hide Details') : (language === 'hi' ? 'विवरण देखें' : 'Show Details')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDepartmentalDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Informational Security Notice explaining WHY admin has secret keys */}
        {showDepartmentalDetails && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">
                {language === 'hi'
                  ? 'प्रशासनिक कुंजियों (Admin Secret Keys / PIN) की आवश्यकता क्यों है?'
                  : 'Why are Secret Keys & Passcodes Required for Staff Logins?'}
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                {language === 'hi'
                  ? 'मंडी पर्यवेक्षक इलेक्ट्रॉनिक धर्मकांटे के तौल आंकड़ों (सकल/तौल भार) को अंतिम रूप देते हैं और किसानों के बैंक खाते में लाखों रुपयों के सरकारी डीबीटी भुगतान की संस्तुति करते हैं। इसलिए केवल अधिकृत विभागीय आईडी एवं सुरक्षा पिन वाले कर्मचारी ही इन टर्मिनलों को संचालित कर सकते हैं।'
                  : 'Mandi Supervisors certify live physical weighbridge gross/tare data and authorize lakhs of rupees in government MSP DBT fund disbursements. State Admins control statewide procurement quotas. Therefore, they are protected with official Staff IDs, field terminal PINs, and cryptographic audit logging.'}
              </p>
            </div>
          </div>
        )}

        {/* 2 Dedicated Officer / Admin Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Staff Role 1: Mandi Supervisor Terminal */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                      {language === 'hi' ? 'मंडी परिचालन' : 'Mandi Operations'}
                    </span>
                    <h4 className="text-base font-bold text-[#063B2A] dark:text-white">
                      {language === 'hi' ? 'उपार्जन केंद्र पर्यवेक्षक टर्मिनल' : 'Mandi Yard Supervisor Terminal'}
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Level-2 Clearance
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'इलेक्ट्रॉनिक धर्मकांटा तौल सत्यापन, नमी व गुणवत्ता अस्वीकृति, एवं टोकन कतार कॉलिंग।'
                  : 'Electronic weighbridge gross/tare certification, moisture quality inspection, and queue counter calling.'}
              </p>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#143026] p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span>{language === 'hi' ? 'अधिकृत आईडी:' : 'Authorized ID:'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">SUP-WRD-01</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{language === 'hi' ? 'सुरक्षा पिन:' : 'Security PIN:'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">1234</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSupervisorLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1D68BD] hover:bg-[#165096] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पर्यवेक्षक टर्मिनल प्रमाणीकरण' : 'Supervisor Authentication'}</span>
            </button>
          </div>

          {/* Staff Role 2: Super Admin Governance Portal */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {language === 'hi' ? 'राज्य नीति प्राधिकरण' : 'State Policy Authority'}
                    </span>
                    <h4 className="text-base font-bold text-[#063B2A] dark:text-white">
                      {language === 'hi' ? 'सुपर एडमिन गवर्नेंस कंसोल' : 'Super Admin Governance Gateway'}
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Level-4 Clearance
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'राज्य-स्तरीय उपार्जन निगरानी, आपातकालीन स्लॉट व कोटा विन्यास, एवं कानूनी ऑडिट लॉग।'
                  : 'Statewide procurement monitoring, emergency district quota overrides, and tamper-evident audit logs.'}
              </p>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#143026] p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span>{language === 'hi' ? 'अधिकृत आईडी:' : 'Authorized ID:'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">ADMIN-MH-STATE-01</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{language === 'hi' ? 'मास्टर पासफ्रेज:' : 'Governance Passphrase:'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">admin2026</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSuperAdminLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#063B2A] hover:bg-[#0B5D3B] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'प्रशासनिक कंसोल प्रवेश' : 'Super Admin Access'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: EVALUATOR / JURY QUICK SWITCHER BAR */}
      <div className="w-full p-4 rounded-2xl bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] dark:border-[#2B5E4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#168A5B] flex-shrink-0" />
          <span className="text-[#083324] dark:text-[#F0FAF5] font-medium">
            <strong>{t.sihModeBadge}:</strong>{' '}
            {language === 'hi'
              ? 'मूल्यांकनकर्ता एवं जूरी सदस्यों हेतु त्वरित परिदृश्य व सभी 4 किसान तथा 2 प्रशासनिक खातों की डायरेक्ट स्विचिंग'
              : 'Direct switcher for SIH evaluators & jury members across all 4 seeded farmers and official administrative terminals.'}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenDemoDrawer}
          className="px-4 py-1.5 rounded-lg bg-white dark:bg-[#0E241C] text-[#0B5D3B] dark:text-[#6EE7B7] border border-[#98BFA9] hover:bg-[#F4F7F5] dark:hover:bg-[#143026] font-bold text-xs self-start sm:self-center transition-colors flex-shrink-0 cursor-pointer"
        >
          {t.demoDrawerBtn}
        </button>
      </div>

    </div>
  );
};
