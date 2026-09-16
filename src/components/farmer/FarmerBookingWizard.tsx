import React, { useState } from 'react';
import { 
  Tractor, 
  Store, 
  FlaskConical, 
  Wheat, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  QrCode, 
  Phone,
  Volume2
} from 'lucide-react';
import { 
  ServiceType, 
  ServiceCentre, 
  ServiceSlot, 
  FarmerProfile, 
  AgriToken, 
  LanguageCode 
} from '../../types';
import { SERVICE_CENTRES, MOCK_SLOTS, TRANSLATIONS } from '../../data/agriMockData';
import { speakAnnouncement, playAudioChime } from '../../utils/speech';
import { IntegrationBadge } from '../common/IntegrationBadge';

interface FarmerBookingWizardProps {
  farmer: FarmerProfile;
  initialService?: ServiceType;
  preselectedService?: ServiceType;
  language: LanguageCode;
  onBookingComplete?: (newToken: AgriToken) => void;
  onBookingCompleted?: (newToken: AgriToken) => void;
  onCancel: () => void;
}

export const FarmerBookingWizard: React.FC<FarmerBookingWizardProps> = ({
  farmer,
  initialService,
  preselectedService = 'MandiSlot',
  language,
  onBookingComplete,
  onBookingCompleted,
  onCancel
}) => {
  const activeInitial = initialService || preselectedService;
  const notifyComplete = onBookingComplete || onBookingCompleted || (() => {});
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceType>(activeInitial);
  const [selectedCentre, setSelectedCentre] = useState<ServiceCentre>(SERVICE_CENTRES[0]);
  const [selectedSlot, setSelectedSlot] = useState<ServiceSlot>(MOCK_SLOTS[2]); // Default to smart slot
  const [approxQuintals, setApproxQuintals] = useState<number>(40);
  const [selectedCrop, setSelectedCrop] = useState<string>('Soyabean (Yellow)');
  const [selectedMachinery, setSelectedMachinery] = useState<string>('Swaraj 855 FE (52 HP) + Rotavator');
  const [acreage, setAcreage] = useState<number>(3.5);

  const [confirmedToken, setConfirmedToken] = useState<AgriToken | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleConfirmBooking = () => {
    playAudioChime();

    const randArray = new Uint32Array(1);
    crypto.getRandomValues(randArray);
    const randomNum = (randArray[0] % 88) + 111;
    const tokenStr = `AS-${randomNum}`;

    const newToken: AgriToken = {
      id: `TOK-${randomNum}`,
      tokenNumber: tokenStr,
      farmerId: farmer.id,
      farmerName: farmer.fullName,
      farmerNameHi: farmer.fullNameHi,
      farmerPhone: farmer.phone,
      kisanId: farmer.kisanId,
      serviceType: selectedService,
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      centreNameHi: selectedCentre.nameHi,
      scheduledTime: `${selectedSlot.date}, ${selectedSlot.timeRange}`,
      counterAssigned: selectedService === 'MandiSlot' ? 2 : (selectedService === 'Machinery' ? 1 : 3),
      status: 'Waiting',
      estimatedWaitMins: selectedSlot.congestion === 'Low' ? 10 : 25,
      peopleAhead: selectedSlot.congestion === 'Low' ? 1 : 4,
      priority: false,
      issueTimestamp: 'Just now',
      qrCodeValue: `AGRISEVA-PASS-${tokenStr}-${farmer.kisanId}`,
      serviceDetails: {
        cropName: selectedCrop,
        approxQuintals: approxQuintals,
        machineryType: selectedMachinery,
        acreage: acreage
      }
    };

    setConfirmedToken(newToken);
    setStep(4);

    // Audio announcement
    const speakText = language === 'hi'
      ? `बधाई हो ${farmer.fullNameHi}! आपका टोकन नंबर ${tokenStr} सफलतापूर्वक बुक हो गया है। आपका समय ${selectedSlot.date} को ${selectedSlot.timeRange} है।`
      : `Congratulations ${farmer.fullName}! Your token ${tokenStr} is confirmed for ${selectedSlot.date}, ${selectedSlot.timeRange}.`;

    speakAnnouncement(speakText, language === 'hi' ? 'hi' : 'en');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Wizard Progress Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-[#D7E3DC] pb-4">
        <div>
          <button
            onClick={step > 1 && step < 4 ? () => setStep(step - 1) : onCancel}
            className="flex items-center gap-1.5 text-xs font-bold text-[#063B2A]/70 hover:text-[#063B2A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step === 4 ? (language === 'hi' ? 'वापस' : 'Done') : (language === 'hi' ? 'पीछे जाएं' : 'Back')}</span>
          </button>
          <h2 className="text-xl font-bold font-serif-display text-[#063B2A] mt-1">
            {step === 1 && (language === 'hi' ? '१. सेवा चुनें' : '1. Select Service')}
            {step === 2 && (language === 'hi' ? '२. केंद्र चुनें' : '2. Choose Centre')}
            {step === 3 && (language === 'hi' ? '३. स्मार्ट स्लॉट व समय' : '3. Smart Slot Pacing')}
            {step === 4 && (language === 'hi' ? '४. डिजिटल पास पुष्टि' : '4. Token Confirmed')}
          </h2>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                s === step
                  ? 'bg-[#168A5B] text-white ring-2 ring-emerald-500/30'
                  : s < step
                  ? 'bg-[#DDF4E9] text-[#0B5D3B]'
                  : 'bg-[#F0F4F2] text-slate-400'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-[#063B2A]/70">
            {language === 'hi' ? 'आप किस कृषि सेवा का स्लॉट बुक करना चाहते हैं?' : 'Which agricultural service do you require today?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedService('Machinery')}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 ${
                selectedService === 'Machinery'
                  ? 'border-[#168A5B] bg-[#DDF4E9]/50 shadow-sm'
                  : 'border-[#D7E3DC] bg-white hover:border-[#168A5B]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center flex-shrink-0">
                <Tractor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#063B2A]">{t.machineryHire}</h4>
                <p className="text-xs text-[#063B2A]/60 mt-0.5">Tractor, Rotavator & Harvester</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  SMAM 50% Subsidy
                </span>
              </div>
            </button>

            <button
              onClick={() => setSelectedService('MandiSlot')}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 ${
                selectedService === 'MandiSlot'
                  ? 'border-[#D99121] bg-amber-50 shadow-sm'
                  : 'border-[#D7E3DC] bg-white hover:border-[#D99121]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#063B2A]">{t.mandiPass}</h4>
                <p className="text-xs text-[#063B2A]/60 mt-0.5">Weighbridge & Grain Inward</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Direct DBT Payment
                </span>
              </div>
            </button>

            <button
              onClick={() => setSelectedService('SoilTest')}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 ${
                selectedService === 'SoilTest'
                  ? 'border-[#2878C8] bg-blue-50 shadow-sm'
                  : 'border-[#D7E3DC] bg-white hover:border-[#2878C8]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#063B2A]">{t.soilTesting}</h4>
                <p className="text-xs text-[#063B2A]/60 mt-0.5">Mobile Soil Lab & Nutrient Card</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Free Soil Health Card
                </span>
              </div>
            </button>

            <button
              onClick={() => setSelectedService('Fertiliser')}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 ${
                selectedService === 'Fertiliser'
                  ? 'border-[#7866D8] bg-purple-50 shadow-sm'
                  : 'border-[#D7E3DC] bg-white hover:border-[#7866D8]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center flex-shrink-0">
                <Wheat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#063B2A]">{t.fertiliserQuota}</h4>
                <p className="text-xs text-[#063B2A]/60 mt-0.5">Urea / DAP Aadhaar POS Token</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Guaranteed Stock
                </span>
              </div>
            </button>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Choose Service Centre */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-[#063B2A]/70">
            {language === 'hi' 
              ? 'आपके निकटतम उपलब्ध केंद्र (दूरी व कतार अनुसार):' 
              : 'Available service centres near your village:'}
          </p>

          <div className="space-y-3">
            {SERVICE_CENTRES.map((centre) => (
              <div
                key={centre.id}
                onClick={() => setSelectedCentre(centre)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  selectedCentre.id === centre.id
                    ? 'border-[#168A5B] bg-[#DDF4E9]/40 shadow-sm'
                    : 'border-[#D7E3DC] bg-white hover:border-[#168A5B]/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#D7E3DC] text-[#0B5D3B] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#168A5B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#063B2A]">
                      {language === 'hi' ? centre.nameHi : centre.name}
                    </h4>
                    <p className="text-xs text-[#063B2A]/60 mt-0.5">
                      {centre.villageOrTown} • {centre.distanceKm} km away
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {centre.operatingHours}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Queue: {centre.currentQueueCount} waiting
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <span className="text-xs font-mono-numbers font-bold text-[#063B2A] block">
                    ~{centre.avgWaitTimeMins} mins
                  </span>
                  <span className="text-[10px] text-[#063B2A]/60">Avg Wait Time</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-[#D7E3DC] text-xs font-bold text-[#063B2A]"
            >
              {language === 'hi' ? 'पिछला' : 'Previous'}
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span>{language === 'hi' ? 'स्लॉट चुनें' : 'Choose Slot'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Smart Slot Recommendation & Service Input */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Specific input for selected service */}
          {selectedService === 'MandiSlot' && (
            <div className="p-4 rounded-2xl bg-white border border-[#D7E3DC] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A]">
                {language === 'hi' ? 'फसल विवरण भरें' : 'Crop Procurement Details'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#063B2A]/70 font-medium block mb-1">
                    {language === 'hi' ? 'फसल का प्रकार' : 'Crop Type'}
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                  >
                    <option value="Soyabean (Yellow)">Soyabean (Yellow) - MSP ₹4,892/Q</option>
                    <option value="Cotton (Medium Staple)">Cotton (Medium Staple) - MSP ₹7,121/Q</option>
                    <option value="Wheat (Lokwan)">Wheat (Lokwan) - MSP ₹2,275/Q</option>
                    <option value="Gram (Chana)">Gram (Chana) - MSP ₹5,440/Q</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#063B2A]/70 font-medium block mb-1">
                    {language === 'hi' ? 'अनुमानित वजन (क्विंटल)' : 'Approx Weight (Quintals)'}
                  </label>
                  <input
                    type="number"
                    value={approxQuintals}
                    onChange={(e) => setApproxQuintals(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedService === 'Machinery' && (
            <div className="p-4 rounded-2xl bg-white border border-[#D7E3DC] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#063B2A]">
                {language === 'hi' ? 'यंत्र व रकबा विवरण' : 'Machinery & Acreage Details'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#063B2A]/70 font-medium block mb-1">
                    {language === 'hi' ? 'मशीन चुनें' : 'Select Machinery'}
                  </label>
                  <select
                    value={selectedMachinery}
                    onChange={(e) => setSelectedMachinery(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                  >
                    <option value="Swaraj 855 FE (52 HP) + Rotavator">Swaraj 855 FE (52 HP) + Rotavator (₹450/hr)</option>
                    <option value="Garuda Kisan 16L Drone Sprayer">Garuda Kisan 16L Drone Sprayer (₹320/hr)</option>
                    <option value="Preet 987 Combine Harvester">Preet 987 Combine Harvester (₹1,250/hr)</option>
                    <option value="Mahindra Yuvo 575 DI">Mahindra Yuvo 575 DI (47 HP) (₹420/hr)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#063B2A]/70 font-medium block mb-1">
                    {language === 'hi' ? 'खेत का रकबा (एकड़)' : 'Land Acreage'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={acreage}
                    onChange={(e) => setAcreage(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-bold bg-[#F6F9F7] border border-[#D7E3DC] rounded-xl text-[#063B2A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Smart Slot Recommendation Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#DDF4E9] to-[#FFFFFF] border border-[#168A5B]/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#168A5B] text-amber-300 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#0B5D3B] block">
                  {language === 'hi' ? 'स्मार्ट स्लॉट अनुशंसा (Smart Slot Recommendation)' : 'Smart Slot Recommendation Engine'}
                </span>
                <IntegrationBadge status="LIVE" spec="Client Algorithm" featureName="Smart Slot Recommendation" featureId="AUD-01" />
              </div>
              <p className="text-[#063B2A]/80 mt-0.5">
                {language === 'hi' 
                  ? 'मौसम पूर्वानुमान (धूप) और गेट कतार डेटा के आधार पर, कल सुबह 08:30 का समय आपके लिए सर्वोत्तम है।'
                  : 'Based on IMD weather (0% rain) and gate pacing, tomorrow 08:30 AM will save ~45 minutes in line.'}
              </p>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#063B2A] block">
              {language === 'hi' ? 'उपलब्ध समय स्लॉट:' : 'Available Time Slots:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MOCK_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedSlot.id === slot.id
                      ? 'border-[#168A5B] bg-[#DDF4E9]/30 shadow-sm ring-1 ring-[#168A5B]'
                      : 'border-[#D7E3DC] bg-white hover:border-[#168A5B]/40'
                  }`}
                >
                  {slot.isRecommended && (
                    <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#168A5B] text-white flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{language === 'hi' ? 'सर्वोत्तम समय' : 'Best Slot'}</span>
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#063B2A]/70">{slot.date}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      slot.congestion === 'Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : slot.congestion === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {slot.congestion} Queue
                    </span>
                  </div>

                  <h5 className="font-bold text-sm font-mono-numbers text-[#063B2A] mt-1">
                    {slot.timeRange}
                  </h5>

                  <span className="text-[11px] text-[#063B2A]/60 block mt-1">
                    {slot.availableSpots} {language === 'hi' ? 'स्थान शेष' : 'spots available'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl border border-[#D7E3DC] text-xs font-bold text-[#063B2A]"
            >
              {language === 'hi' ? 'पिछला' : 'Previous'}
            </button>
            <button
              onClick={handleConfirmBooking}
              className="px-6 py-3 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <span>{language === 'hi' ? 'टोकन पास बुक करें' : 'Confirm & Generate Pass'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Token Confirmed & Digital Entry Pass */}
      {step === 4 && confirmedToken && (
        <div className="space-y-4 animate-scale-up">
          <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center mb-2 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 font-serif-display">
              {language === 'hi' ? 'टोकन पास सफलतापूर्वक तैयार!' : 'Service Pass Generated!'}
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              {language === 'hi' 
                ? `एसएमएस द्वारा पुष्टि टोकन आपके मोबाइल (${farmer.phone}) पर भेज दी गई है।`
                : `SMS confirmation dispatched to ${farmer.phone}.`}
            </p>
          </div>

          {/* Digital Boarding Pass */}
          <div className="editorial-card rounded-2xl border-2 border-[#168A5B] overflow-hidden shadow-xl bg-white">
            <div className="bg-[#063B2A] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DDF4E9]">
                  AgriSeva Digital Entry Pass
                </span>
                <h4 className="text-sm font-bold mt-0.5">{confirmedToken.centreName}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/70 block">Token Number</span>
                <span className="text-2xl font-mono-numbers font-extrabold text-amber-300">
                  {confirmedToken.tokenNumber}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[#063B2A]/60 block font-medium">Farmer</span>
                  <strong className="text-[#063B2A]">{confirmedToken.farmerName}</strong>
                </div>
                <div>
                  <span className="text-[#063B2A]/60 block font-medium">Kisan ID</span>
                  <strong className="text-[#063B2A] font-mono">{confirmedToken.kisanId}</strong>
                </div>
                <div>
                  <span className="text-[#063B2A]/60 block font-medium">Scheduled Time</span>
                  <strong className="text-[#063B2A]">{confirmedToken.scheduledTime}</strong>
                </div>
                <div>
                  <span className="text-[#063B2A]/60 block font-medium">Counter</span>
                  <strong className="text-[#168A5B] text-sm">Counter {confirmedToken.counterAssigned}</strong>
                </div>
              </div>

              {/* QR Code and verification barcode placeholder */}
              <div className="pt-3 border-t border-dashed border-[#D7E3DC] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-lg p-1.5 flex items-center justify-center">
                    <QrCode className="w-11 h-11 text-white" />
                  </div>
                  <div className="text-[11px] text-[#063B2A]/70">
                    <p className="font-bold text-[#063B2A]">Gate Scanner Ready</p>
                    <p>Show this QR code at Mandi / Kendra security kiosk</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const text = language === 'hi' 
                      ? `टोकन संख्या ${confirmedToken.tokenNumber}, केंद्र ${confirmedToken.centreName}, समय ${confirmedToken.scheduledTime}।`
                      : `Token ${confirmedToken.tokenNumber} at ${confirmedToken.centreName}.`;
                    speakAnnouncement(text, language === 'hi' ? 'hi' : 'en');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DDF4E9] text-[#0B5D3B] text-xs font-bold hover:bg-[#168A5B] hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'आवाज में सुनें' : 'Listen'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => notifyComplete(confirmedToken)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              {language === 'hi' ? 'लाइव कतार में देखें' : 'View in Live Queue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
