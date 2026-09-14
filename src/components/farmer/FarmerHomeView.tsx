import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Ticket, 
  Scale, 
  Banknote, 
  Bell, 
  ArrowRight, 
  Volume2, 
  Building2, 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  ChevronRight, 
  FileCheck,
  ShieldCheck,
  Wheat,
  CloudSun,
  Navigation,
  ExternalLink,
  HelpCircle,
  QrCode,
  Layers
} from 'lucide-react';
import { FarmerProfile, AgriToken, LanguageCode, ServiceType, ProcurementRecord, DbtTransaction } from '../../types';
import { getTranslations } from '../../i18n';
import { normalizeStatus, STATUS_DEFINITIONS } from '../../domain/statusModel';
import { speakAnnouncement, playAudioChime } from '../../utils/speech';
import { notificationService, AppNotification } from '../../services/notificationService';

interface FarmerHomeViewProps {
  farmer: FarmerProfile;
  activeToken?: AgriToken;
  recentProcurement?: ProcurementRecord;
  recentDbt?: DbtTransaction;
  language: LanguageCode;
  onNavigateToTab: (tab: string) => void;
  onSelectServiceToBook: (service: ServiceType) => void;
  onOpenVoiceMitra: () => void;
}

export const FarmerHomeView: React.FC<FarmerHomeViewProps> = ({
  farmer,
  activeToken,
  recentProcurement,
  recentDbt,
  language,
  onNavigateToTab,
  onSelectServiceToBook,
  onOpenVoiceMitra
}) => {
  const t = getTranslations(language);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => notificationService.getAll());
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  
  useEffect(() => {
    const unsub = notificationService.subscribe(updated => setNotifications(updated));
    return unsub;
  }, []);

  const standardStatus = activeToken ? normalizeStatus(activeToken.status) : 'BOOKED';
  const statusMeta = STATUS_DEFINITIONS[standardStatus];

  // Derive crop & quantity values safely without fabricated defaults
  const cropName = activeToken?.serviceDetails?.cropName 
    ? (language === 'hi' && activeToken.serviceDetails.cropNameHi ? activeToken.serviceDetails.cropNameHi : activeToken.serviceDetails.cropName)
    : (recentProcurement?.cropName 
        ? (language === 'hi' && recentProcurement.cropNameHi ? recentProcurement.cropNameHi : recentProcurement.cropName)
        : (language === 'hi' ? 'फसल अनिर्धारित' : 'Crop unassigned'));
  
  const bookedQuintals = activeToken?.serviceDetails?.approxQuintals;
  const processedQuintals = (recentProcurement && typeof recentProcurement.netWeightQuintals === 'number') 
    ? recentProcurement.netWeightQuintals 
    : undefined;
  const remainingQuintals = (typeof bookedQuintals === 'number' && typeof processedQuintals === 'number')
    ? Math.max(0, bookedQuintals - (activeToken?.status === 'Completed' ? bookedQuintals : processedQuintals))
    : (typeof bookedQuintals === 'number' && activeToken?.status === 'Completed' ? 0 : bookedQuintals);

  // Determine primary next action based on current state
  const getNextAction = () => {
    if (!activeToken) {
      return {
        label: t.bookNewSlotButton,
        action: () => onNavigateToTab('booking'),
        description: t.noActiveAppointmentDesc
      };
    }
    if (activeToken.status === 'Completed') {
      return {
        label: t.actionTrackPayment,
        action: () => onNavigateToTab('dbt'),
        description: language === 'hi' ? 'तौल पर्ची व डीबीटी भुगतान सलाह जारी की जा चुकी है।' : 'Procurement completed. Track PFMS DBT credit status.'
      };
    }
    if (activeToken.status === 'Weighbridge') {
      return {
        label: t.actionViewWeighment,
        action: () => onNavigateToTab('procurement'),
        description: language === 'hi' ? 'वाहन इलेक्ट्रॉनिक तौल कांटे पर उपस्थित है।' : 'Vehicle at weighbridge scale. Check gross & tare weight.'
      };
    }
    if (activeToken.status === 'Called' || activeToken.status === 'At Counter') {
      return {
        label: `${t.actionReportCounter} ${activeToken.counterAssigned}`,
        action: () => onNavigateToTab('queue'),
        description: language === 'hi' ? `आपका टोकन काउंटर #${activeToken.counterAssigned} पर पुकारा गया है।` : `Your token has been called to Counter #${activeToken.counterAssigned}.`
      };
    }
    if (activeToken.status === 'Waiting' && activeToken.peopleAhead <= 2) {
      return {
        label: t.actionProceedGate,
        action: () => onNavigateToTab('queue'),
        description: language === 'hi' ? 'आपकी बारी जल्द आने वाली है। गेट प्रवेश हेतु तैयार रहें।' : 'Your turn is approaching. Move toward Mandi gate inward.'
      };
    }
    return {
      label: t.actionViewPass,
      action: () => onNavigateToTab('queue'),
      description: language === 'hi' ? 'गेट सत्यापन हेतु डिजिटल ई-पास व बारकोड सुरक्षित रखें।' : 'Keep your digital e-pass ready for gate entry.'
    };
  };

  const nextAction = getNextAction();

  // Audio voiceover for pass details
  const handleSpeakPass = () => {
    if (!activeToken) return;
    if (isSpeakingAudio) return;
    playAudioChime();
    setIsSpeakingAudio(true);
    const qtyTextHi = typeof bookedQuintals === 'number' ? `की पंजीकृत मात्रा ${bookedQuintals} क्विंटल है।` : 'का स्लॉट निर्धारित है।';
    const qtyTextEn = typeof bookedQuintals === 'number' ? `, ${bookedQuintals} quintals` : '';
    const hi = `नमस्ते ${farmer.fullNameHi}! आपका ई-पास टोकन नंबर ${activeToken.tokenNumber} है। उपार्जन केंद्र ${activeToken.centreNameHi || activeToken.centreName} में काउंटर नंबर ${activeToken.counterAssigned} निर्धारित है। आपकी फसल ${cropName} ${qtyTextHi} अनुमानित प्रतीक्षा समय लगभग ${activeToken.estimatedWaitMins} मिनट है।`;
    const en = `Hello ${farmer.fullName}! Your token number is ${activeToken.tokenNumber} for ${cropName}${qtyTextEn} at ${activeToken.centreName}. Counter ${activeToken.counterAssigned} assigned. Estimated waiting time is approximately ${activeToken.estimatedWaitMins} minutes.`;
    speakAnnouncement(language === 'hi' ? hi : en, language === 'hi' ? 'hi' : 'en').then(() => {
      setIsSpeakingAudio(false);
    });
  };

  // Determine active step index in procurement journey (0 to 4)
  const getJourneyStepIndex = () => {
    if (!activeToken) return 0;
    if (activeToken.status === 'Completed' || recentDbt?.status === 'Credited') return 4;
    if (activeToken.status === 'DBT Released' || recentProcurement) return 3;
    if (activeToken.status === 'Weighbridge') return 2;
    if (activeToken.status === 'Called' || activeToken.status === 'At Counter' || activeToken.status === 'Quality Check') return 1;
    return 0;
  };

  const currentStepIdx = getJourneyStepIndex();

  const journeySteps = [
    { title: t.stepGate, desc: language === 'hi' ? 'गेट प्रवेश व ANPR वाहन आगमन' : 'Gate Inward & ANPR Entry' },
    { title: t.stepCounter, desc: language === 'hi' ? 'दस्तावेज़ व 7/12 खतौनी जांच' : '7/12 & Doc Verification' },
    { title: t.stepWeighbridge, desc: language === 'hi' ? 'इलेक्ट्रॉनिक तौल (IS 9281)' : 'Gross & Tare Weighment' },
    { title: t.stepQuality, desc: language === 'hi' ? 'नमी व FAQ ग्रेड निर्धारण' : 'Moisture & Grading' },
    { title: t.stepPayment, desc: language === 'hi' ? 'PFMS बैंक सीधा अंतरण' : 'Direct Benefit Transfer' }
  ];

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-10">
      {/* 
        PRIORITY 1-7 & 11: 
        PRIMARY HERO OPERATIONAL CARD (Current Booking, Queue Position, Arrival Times, Quantities & Next Action)
        Clean, bright, light-first surface: Warm white / light sage
      */}
      <section className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] shadow-[0_2px_12px_rgba(8,51,36,0.06)] overflow-hidden transition-colors">
        {/* Card Header: Token Number, Kendra Name & Status Badge */}
        <div className="bg-[#F5F8F6] dark:bg-[#143026] px-5 sm:px-6 py-4 border-b border-[#DCE7E1] dark:border-[#1D4334] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] flex items-center justify-center text-[#0B5D3B] dark:text-[#6EE7B7]">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-serif-display text-[#083324] dark:text-[#F0FAF5]">
                  {t.todayAppointmentTitle}
                </span>
                {activeToken && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-[#E7F7EF] text-[#0B5D3B] border border-[#98BFA9]">
                    {activeToken.tokenNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#168A5B]" />
                <span>{activeToken?.centreName || 'Wardha Model APMC Mandi Yard'} (CEN-1)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeToken && (
              <button
                type="button"
                onClick={handleSpeakPass}
                disabled={isSpeakingAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#DCE7E1] dark:border-[#1D4334] text-xs font-bold hover:bg-slate-100 transition-colors active:scale-95 shadow-xs"
                title={t.listenAudio}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeakingAudio ? 'text-[#168A5B] animate-pulse' : 'text-[#0B5D3B]'}`} />
                <span>{isSpeakingAudio ? (language === 'hi' ? 'सुनाया जा रहा है...' : 'Playing...') : t.listenAudio}</span>
              </button>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F7EF] text-[#0B5D3B] border border-[#98BFA9]">
              {language === 'hi' ? statusMeta.labelHi : statusMeta.labelEn}
            </span>
          </div>
        </div>

        {activeToken ? (
          <div className="p-5 sm:p-6 space-y-6">
            {/* 
              PRIMARY METRICS (Priorities 2, 3, 4, 5):
              Queue position, expected arrival time, reach-by deadline, remaining time
            */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* Priority 2: Queue Position */}
              <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
                <span className="text-[11px] font-bold text-[#4A6E5E] dark:text-[#85AFA0] uppercase tracking-wider block">
                  {t.queuePositionLabel}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
                    {activeToken.status === 'Called' ? (language === 'hi' ? 'सक्रिय' : 'Serving') : `#${activeToken.peopleAhead + 1}`}
                  </span>
                </div>
                <span className="text-[11px] text-[#0B5D3B] dark:text-[#6EE7B7] font-semibold block">
                  {activeToken.peopleAhead} {t.peopleAheadLabel}
                </span>
              </div>

              {/* Priority 3: Expected Arrival Time */}
              <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
                <span className="text-[11px] font-bold text-[#4A6E5E] dark:text-[#85AFA0] uppercase tracking-wider block">
                  {t.expectedArrival}
                </span>
                <p className="text-lg font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
                  10:30 AM
                </p>
                <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block">
                  Slot: {activeToken.scheduledTime}
                </span>
              </div>

              {/* Priority 4: Reach-by / Attendance Time */}
              <div className="p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-amber-950/20 border border-[#FDE68A] dark:border-amber-900/40 space-y-1">
                <span className="text-[11px] font-bold text-[#92400E] dark:text-amber-300 uppercase tracking-wider block">
                  {t.reachByDeadline}
                </span>
                <p className="text-lg font-mono font-bold text-[#92400E] dark:text-amber-200">
                  10:15 AM
                </p>
                <span className="text-[10px] text-[#92400E] dark:text-amber-400 block font-medium">
                  {language === 'hi' ? '15 मिनट गेट बफर सहित' : '15 min gate entry buffer'}
                </span>
              </div>

              {/* Priority 5: Remaining Time */}
              <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
                <span className="text-[11px] font-bold text-[#4A6E5E] dark:text-[#85AFA0] uppercase tracking-wider block">
                  {t.remainingTime}
                </span>
                <p className="text-lg font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
                  ~{activeToken.estimatedWaitMins} mins
                </p>
                <span className="text-[11px] text-[#0B5D3B] dark:text-[#6EE7B7] block font-medium">
                  Counter #{activeToken.counterAssigned}
                </span>
              </div>
            </div>

            {/* 
              COMMODITY & QUANTITIES (Priorities 6, 7):
              Crop, booked quantity, processed quantity, remaining quantity
            */}
            <div className="p-4 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE7E1] dark:border-[#1D4334] pb-2.5">
                <div className="flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-[#168A5B]" />
                  <span className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5]">
                    {t.cropLabel}: <strong>{cropName}</strong>
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#0E241C] text-[#0B5D3B] dark:text-[#6EE7B7] border border-[#DCE7E1] dark:border-[#1D4334] self-start sm:self-auto">
                  {recentProcurement && typeof recentProcurement.mspPerQuintal === 'number'
                    ? `Statutory MSP: ₹${recentProcurement.mspPerQuintal.toLocaleString('en-IN')} / ${language === 'hi' ? 'क्विंटल' : 'Quintal'} (${recentProcurement.qualityGrade || 'Grade FAQ'})`
                    : (language === 'hi' ? 'एमएसपी दर: गुणवत्ता ग्रेडिंग उपरांत' : 'Statutory MSP: Subject to Grade Certification')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center sm:text-left">
                <div>
                  <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
                    {t.bookedQuantityLabel}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
                    {typeof bookedQuintals === 'number' ? `${bookedQuintals} Qtl` : '—'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
                    {language === 'hi' ? 'तौल हो चुकी मात्रा' : 'Processed'}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#0B5D3B] dark:text-[#6EE7B7]">
                    {typeof processedQuintals === 'number' ? `${processedQuintals} Qtl` : (language === 'hi' ? 'प्रतीक्षारत' : 'Pending')}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
                    {t.remainingQuantityLabel}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
                    {typeof remainingQuintals === 'number' ? `${remainingQuintals} Qtl` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* 
              PRIORITY 11: DOMINANT NEXT ACTION CALLOUT
              Restrained agricultural green button with clear instruction
            */}
            <div className="p-4 rounded-xl bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#0B5D3B] dark:text-[#6EE7B7] block">
                  {t.primaryNextAction}
                </span>
                <p className="text-xs font-semibold text-[#083324] dark:text-[#F0FAF5]">
                  {nextAction.description}
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={nextAction.action}
                  className="px-5 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#12734C] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{nextAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTab('queue')}
                  className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0E241C] hover:bg-slate-100 text-[#083324] dark:text-[#F0FAF5] text-xs font-semibold border border-[#DCE7E1] dark:border-[#1D4334] transition-colors"
                >
                  {language === 'hi' ? 'ई-पास देखें' : 'View Pass'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F7EF] text-[#168A5B] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-base text-[#083324] dark:text-[#F0FAF5]">
                {t.noActiveAppointment}
              </h3>
              <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] leading-relaxed">
                {t.noActiveAppointmentDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('booking')}
              className="px-5 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#12734C] text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookNewSlotButton}</span>
            </button>
          </div>
        )}
      </section>

      {/* 
        PRIORITY 8: PROCUREMENT PROGRESS (5-Stage Visual Progression)
      */}
      <section className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#168A5B]" />
            <span>{t.journeyTitle}</span>
          </h3>
          <span className="text-[11px] font-bold text-[#0B5D3B] dark:text-[#6EE7B7] bg-[#E7F7EF] dark:bg-[#153A2C] px-2.5 py-0.5 rounded-full border border-[#98BFA9]">
            Stage {currentStepIdx + 1} of 5 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {journeySteps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isPending = idx > currentStepIdx;

            return (
              <div 
                key={step.title}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'bg-[#E7F7EF] dark:bg-[#153A2C] border-[#168A5B] shadow-xs' 
                    : isCompleted 
                    ? 'bg-[#F5F8F6] dark:bg-[#143026] border-[#DCE7E1] dark:border-[#1D4334]' 
                    : 'bg-white dark:bg-[#0E241C] border-dashed border-[#DCE7E1] dark:border-[#1D4334] opacity-75'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCompleted 
                      ? 'bg-[#168A5B] text-white' 
                      : isCurrent 
                      ? 'bg-[#083324] text-white ring-2 ring-[#168A5B]' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-bold truncate ${
                    isCurrent ? 'text-[#083324] dark:text-[#F0FAF5]' : 'text-[#4A6E5E] dark:text-[#85AFA0]'
                  }`}>
                    {step.title}
                  </span>
                </div>
                <p className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] leading-snug">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 
        PRIORITY 9: PAYMENT STATUS & ADVICE SUMMARY
      */}
      <section className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-2">
            <Banknote className="w-4 h-4 text-[#168A5B]" />
            <span>{t.dbtTitle}</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigateToTab('dbt')}
            className="text-xs text-[#168A5B] font-bold hover:underline flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'पासबुक देखें' : 'View Passbook'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
              {language === 'hi' ? 'कुल देय सरकारी राशि' : 'Net MSP Gross Amount'}
            </span>
            {(() => {
              if (!recentProcurement) {
                return (
                  <>
                    <p className="text-base sm:text-lg font-bold text-[#4A6E5E] dark:text-[#85AFA0]">
                      {language === 'hi' ? 'भुगतान प्रतीक्षारत' : 'Payment pending'}
                    </p>
                    <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] block">
                      {language === 'hi' ? 'तौल व गुणवत्ता ग्रेडिंग उपरांत उपलब्ध' : 'Available upon weighbridge weighment & grading'}
                    </span>
                  </>
                );
              }

              const grossPayable = recentProcurement.totalGrossPayable;

              if (grossPayable === undefined || grossPayable === null || isNaN(grossPayable)) {
                return (
                  <>
                    <p className="text-base sm:text-lg font-bold text-[#4A6E5E] dark:text-[#85AFA0]">
                      {language === 'hi' ? 'राशि अभी उपलब्ध नहीं' : 'Not yet available'}
                    </p>
                    <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] block">
                      {language === 'hi' ? `तौल पर्ची #${recentProcurement.slipNumber} • दर सत्यापन जारी` : `Slip #${recentProcurement.slipNumber} • Rate verification pending`}
                    </span>
                  </>
                );
              }

              const isZero = grossPayable === 0;
              return (
                <>
                  <p className="text-xl font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
                    ₹{isZero ? '0' : Math.round(grossPayable).toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-[#0B5D3B] dark:text-[#6EE7B7] block font-semibold">
                    {typeof recentProcurement.netWeightQuintals === 'number' && typeof recentProcurement.mspPerQuintal === 'number'
                      ? `${recentProcurement.netWeightQuintals} ${language === 'hi' ? 'क्विंटल' : 'Quintals'} × ₹${recentProcurement.mspPerQuintal.toLocaleString('en-IN')} MSP`
                      : `Slip #${recentProcurement.slipNumber}`}
                  </span>
                </>
              );
            })()}
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
              {t.bankAccount}
            </span>
            <p className="text-sm font-mono font-bold text-[#083324] dark:text-[#F0FAF5]">
              {farmer.bankName || 'Aadhaar Seeded Bank'} • {farmer.bankAccount}
            </p>
            <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] block">
              {t.npciNotice}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] space-y-1">
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] block font-medium">
              {language === 'hi' ? 'डीबीटी अंतरण स्थिति' : 'Disbursement Status'}
            </span>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold ${
              recentDbt?.status === 'Credited'
                ? 'bg-[#E7F7EF] text-[#0B5D3B] border border-[#98BFA9]'
                : recentDbt?.status === 'Processing'
                ? 'bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                : 'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {recentDbt?.status === 'Credited' 
                  ? t.statusCredited 
                  : recentDbt?.status === 'Processing' 
                  ? t.statusProcessing 
                  : recentProcurement?.dbtStatus 
                  ? recentProcurement.dbtStatus 
                  : (language === 'hi' ? 'प्रतीक्षारत' : 'Pending')}
              </span>
            </div>
            <p className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] font-mono mt-1">
              {recentDbt?.utrNumber 
                ? `UTR: ${recentDbt.utrNumber}` 
                : recentProcurement?.utrNumber 
                ? `Ref: ${recentProcurement.utrNumber}` 
                : (language === 'hi' ? 'यूटीआर नंबर अंतरण पश्चात जारी होगा' : 'UTR assigned post clearing')}
            </p>
          </div>
        </div>
      </section>

      {/* 
        PRIORITY 10: NOTIFICATIONS & ALERTS
      */}
      <section className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 sm:p-6 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#083324] dark:text-[#F0FAF5] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#168A5B]" />
            <span>{t.navNotifications}</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigateToTab('notifications')}
            className="text-xs text-[#168A5B] font-bold hover:underline flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'} ({notifications.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.slice(0, 2).map((notif) => (
            <div 
              key={notif.id}
              className="p-3 rounded-xl bg-[#F5F8F6] dark:bg-[#143026] border border-[#DCE7E1] dark:border-[#1D4334] flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5] block">
                  {language === 'hi' ? notif.titleHi : notif.title}
                </span>
                <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] leading-snug">
                  {language === 'hi' ? notif.bodyHi : notif.body}
                </p>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {notif.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        FARMER IDENTITY, LAND QUOTA & WEATHER ADVISORY STRIP
      */}
      <section className="bg-white dark:bg-[#0E241C] rounded-2xl p-5 border border-[#DCE7E1] dark:border-[#1D4334] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#E7F7EF] text-[#0B5D3B] border border-[#98BFA9]">
              {t.kisanId}: {farmer.kisanId}
            </span>
            <span className="text-xs text-[#0B5D3B] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t.ekycVerified}</span>
            </span>
          </div>
          <h4 className="text-base font-bold font-serif-display text-[#083324] dark:text-[#F0FAF5]">
            {t.greeting} {language === 'hi' ? farmer.fullNameHi : farmer.fullName}
          </h4>
          <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#168A5B]" />
            <span>{farmer.village}, Taluka Wardha • {farmer.landParcels.reduce((acc, p) => acc + p.areaAcres, 0)} {t.farmlandTotal}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#F5F8F6] dark:bg-[#143026] px-3.5 py-2.5 rounded-xl border border-[#DCE7E1] dark:border-[#1D4334]">
          <CloudSun className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-[#083324] dark:text-[#F0FAF5] block">28°C Wardha APMC</span>
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">{t.weatherAdvisory}</span>
          </div>
        </div>
      </section>

      {/* Kisan Mitra Quick Assistant Banner */}
      <div className="p-4 rounded-2xl bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#168A5B] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0B5D3B] dark:text-[#6EE7B7] block">
              {t.kisanMitraTitle}
            </span>
            <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
              {language === 'hi' ? 'टोकन, कतार, तौल पर्ची या भुगतान के बारे में बोलकर पूछें' : 'Ask about tokens, wait times, weighment slip or DBT payments'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenVoiceMitra}
          className="px-4 py-2 rounded-xl bg-[#168A5B] hover:bg-[#12734C] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex-shrink-0"
        >
          {language === 'hi' ? 'बात करें' : 'Talk Now'}
        </button>
      </div>
    </div>
  );
};
