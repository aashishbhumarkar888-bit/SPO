import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  QrCode, 
  ExternalLink,
  ShieldCheck,
  FileText,
  Radio,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LanguageCode, AgriToken } from '../../types';

interface FarmerVehicleTrackingViewProps {
  language: LanguageCode;
  activeToken?: AgriToken;
  onOpenGatePassQr?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const FarmerVehicleTrackingView: React.FC<FarmerVehicleTrackingViewProps> = ({
  language,
  activeToken,
  onOpenGatePassQr,
  onNavigateToTab
}) => {
  const isHi = language === 'hi';
  const [vehicleReg, setVehicleReg] = useState<string>('MP-04-HE-8921');
  const [vehicleType, setVehicleType] = useState<string>('Tractor Trolley (Mahindra 575 DI)');
  const [driverName, setDriverName] = useState<string>('सुखदेव यादव (Sukhdev Yadav)');
  const [driverPhone, setDriverPhone] = useState<string>('+91 98260 11928');
  const [transitStage, setTransitStage] = useState<number>(2); // 1: Departed, 2: In-transit, 3: Gate Entry, 4: Weighbridge, 5: Cleared

  const stages = [
    { id: 1, labelHi: 'खेत से प्रस्थान', labelEn: 'Departed Farm', time: '09:15 AM', done: true },
    { id: 2, labelHi: 'मार्ग में (जीपीएस सक्रिय)', labelEn: 'In Transit (GPS Live)', time: '09:40 AM', active: true },
    { id: 3, labelHi: 'मंडी गेट सत्यापन', labelEn: 'Gate Verification', time: 'अनुमानित 10:15 AM' },
    { id: 4, labelHi: 'सकल तौल कांटा', labelEn: 'Gross Weighbridge', time: 'अनुमानित 10:35 AM' },
    { id: 5, labelHi: 'अनलोडिंग व खाली तौल', labelEn: 'Tare Weighment & Out', time: 'अनुमानित 11:10 AM' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-[#083324] dark:text-[#F0FAF5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B1E] to-[#124A35] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#168A5B]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              {isHi ? 'वाहन एवं गेट आवागमन ट्रैकिंग' : 'Vehicle & Gate Transit'}
            </span>
            <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isHi ? 'लाइव जीपीएस टेलीमैटिक्स' : 'Live GPS Telematics'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isHi ? 'कृषि उपज वाहन आवागमन ट्रैकिंग' : 'Agricultural Vehicle In-Transit Tracking'}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            {isHi 
              ? 'खेत से मंडी गेट तक आपके वाहन की वास्तविक स्थिति, चालक संपर्क, एवं डिजिटल गेट पास की जानकारी।' 
              : 'Real-time vehicle transit tracking from farm to APMC yard gate, driver contact, and fast-track digital gate pass.'}
          </p>
        </div>

        {/* Action Button: Gate Pass */}
        {onOpenGatePassQr && (
          <button
            onClick={onOpenGatePassQr}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-sm transition-all cursor-pointer self-start md:self-center"
          >
            <QrCode className="w-4 h-4" />
            <span>{isHi ? 'डिजिटल गेट पास दिखाएं' : 'View Gate QR Pass'}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Vehicle Telematics & Route Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Route & Transit Stages */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Vehicle Status Card */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E7F7EF] dark:bg-[#143026] text-[#168A5B] flex items-center justify-center font-bold text-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {isHi ? 'पंजीकृत वाहन' : 'Registered Vehicle'}
                  </span>
                  <h3 className="text-base font-bold text-[#083324] dark:text-[#F0FAF5] mt-1 font-mono">
                    {vehicleReg}
                  </h3>
                  <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0]">
                    {vehicleType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-amber-500 animate-pulse" />
                  {isHi ? 'मार्ग में • गति: 32 किमी/घंटा' : 'In Transit • 32 km/h'}
                </span>
              </div>
            </div>

            {/* In-Transit ETA & Route Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#2B5E4A]">
                <span className="text-[10px] font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block">
                  {isHi ? 'अनुमानित आगमन समय' : 'Estimated Arrival'}
                </span>
                <span className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#168A5B]" />
                  ~18 {isHi ? 'मिनट' : 'mins'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#2B5E4A]">
                <span className="text-[10px] font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block">
                  {isHi ? 'शेष दूरी' : 'Remaining Distance'}
                </span>
                <span className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] flex items-center gap-1 mt-0.5">
                  <Navigation className="w-3.5 h-3.5 text-[#168A5B]" />
                  6.4 {isHi ? 'किमी' : 'km'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#2B5E4A]">
                <span className="text-[10px] font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block">
                  {isHi ? 'गंतव्य मंडी गेट' : 'Destination Gate'}
                </span>
                <span className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {isHi ? 'गेट नं. 2 (उपार्जन)' : 'Gate #2 (Procurement)'}
                </span>
              </div>
            </div>

            {/* Transit Progress Stepper */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-[#062B1E] dark:text-[#F0FAF5] mb-3">
                {isHi ? 'मंडी प्रवेश एवं तौल प्रक्रिया चरण' : 'Gate Entry & Weighment Stages'}
              </h4>

              <div className="relative border-l-2 border-[#DCE7E1] dark:border-[#2B5E4A] ml-3.5 space-y-4 py-1">
                {stages.map((stage, idx) => {
                  const isDone = idx < transitStage;
                  const isCurrent = idx === transitStage - 1;

                  return (
                    <div key={stage.id} className="relative pl-6">
                      <span className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                        isDone 
                          ? 'bg-[#168A5B] border-[#168A5B] text-white' 
                          : isCurrent 
                            ? 'bg-amber-400 border-white ring-4 ring-amber-400/20' 
                            : 'bg-white dark:bg-[#0E241C] border-[#DCE7E1] dark:border-[#2B5E4A]'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </span>

                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className={`text-xs font-bold ${
                            isCurrent ? 'text-amber-700 dark:text-amber-400' : isDone ? 'text-[#062B1E] dark:text-[#F0FAF5]' : 'text-[#4A6E5E] dark:text-[#85AFA0]'
                          }`}>
                            {isHi ? stage.labelHi : stage.labelEn}
                          </p>
                          <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0]">
                            {stage.time}
                          </span>
                        </div>

                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            {isHi ? 'वर्तमान स्थिति' : 'Active'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gate Congestion & Traffic Advisory */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-4 sm:p-5 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                {isHi ? 'मंडी यार्ड ट्रैफिक एवं लेन एडवाइजरी' : 'Mandi Yard Traffic Advisory'}
              </h4>
              <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] mt-0.5">
                {isHi 
                  ? 'गेट नं. 2 पर वर्तमान में 8 ट्रैक्टर कतार में हैं। अनुमानित गेट क्लीयरेंस समय 12 मिनट है। कृपया इलेक्ट्रॉनिक तौल कांटा लेन-ए में प्रवेश करें।' 
                  : 'Currently 8 tractors in queue at Gate #2. Average clearance time is 12 minutes. Proceed directly to Weighbridge Scale Lane-A upon arrival.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Driver & Pass Information */}
        <div className="space-y-4">
          {/* Driver Contact Card */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-4 sm:p-5 shadow-xs space-y-3.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] flex items-center gap-2 border-b border-[#DCE7E1] dark:border-[#1D4334] pb-2.5">
              <Phone className="w-4 h-4 text-[#168A5B]" />
              {isHi ? 'वाहन चालक विवरण' : 'Driver Contact Info'}
            </h4>

            <div>
              <span className="text-[10px] font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block">
                {isHi ? 'चालक का नाम' : 'Driver Full Name'}
              </span>
              <p className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5] mt-0.5">
                {driverName}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block">
                {isHi ? 'संपर्क मोबाइल' : 'Mobile Number'}
              </span>
              <p className="text-xs font-mono font-bold text-[#083324] dark:text-[#F0FAF5] mt-0.5">
                {driverPhone}
              </p>
            </div>

            <a
              href={`tel:${driverPhone.replace(/\s+/g, '')}`}
              className="w-full py-2 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isHi ? 'चालक को कॉल करें' : 'Call Driver Now'}</span>
            </a>
          </div>

          {/* Quick Gate Verification Pass */}
          <div className="bg-emerald-50/60 dark:bg-[#143026] rounded-2xl border border-[#98BFA9] dark:border-[#2B5E4A] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#168A5B] dark:text-[#6EE7B7]" />
              <h4 className="text-xs sm:text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                {isHi ? 'ई-मंडी प्रवेश गेट पास' : 'e-Mandi Gate Pass'}
              </h4>
            </div>

            <p className="text-[11px] text-[#2C5343] dark:text-[#85AFA0]">
              {isHi 
                ? 'गेट ऑपरेटर द्वारा इस क्यूआर कोड को स्कैन करते ही आपका वाहन सीधे तौल कांटे पर अग्रेषित किया जाएगा।' 
                : 'Security guard at Gate #2 will scan this QR to authorize direct entry to Weighbridge Scale.'}
            </p>

            <div className="p-3 bg-white dark:bg-[#0E241C] rounded-xl border border-[#DCE7E1] dark:border-[#1D4334] text-center space-y-1.5">
              <span className="text-[10px] font-bold text-[#4A6E5E] dark:text-[#85AFA0] block">
                {isHi ? 'गेट पास टोकन कोड' : 'Gate Pass Token'}
              </span>
              <p className="text-base font-mono font-bold text-[#083324] dark:text-[#F0FAF5] tracking-wider">
                {activeToken ? activeToken.tokenNumber : 'AS-143-GATE'}
              </p>
            </div>

            {onOpenGatePassQr && (
              <button
                onClick={onOpenGatePassQr}
                className="w-full py-2 text-xs font-bold rounded-xl border border-[#168A5B] text-[#0B5D3B] dark:text-[#6EE7B7] hover:bg-[#168A5B] hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{isHi ? 'बड़ा QR कोड खोलें' : 'Open Full Gate QR'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
