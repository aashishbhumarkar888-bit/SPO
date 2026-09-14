import React from 'react';
import { 
  Volume2, 
  Clock, 
  UserCheck, 
  Scale, 
  Banknote, 
  QrCode, 
  PhoneCall, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  WifiOff
} from 'lucide-react';
import { AgriToken, LanguageCode, FarmerProfile } from '../../types';
import { TRANSLATIONS } from '../../data/agriMockData';
import { speakAnnouncement, playAudioChime } from '../../utils/speech';
import { IntegrationBadge } from '../common/IntegrationBadge';

interface FarmerLiveQueueViewProps {
  token: AgriToken;
  farmer: FarmerProfile;
  language: LanguageCode;
  isOffline: boolean;
  onNavigateToTab: (tab: string) => void;
}

export const FarmerLiveQueueView: React.FC<FarmerLiveQueueViewProps> = ({
  token,
  farmer,
  language,
  isOffline,
  onNavigateToTab
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleAudioBroadcast = () => {
    playAudioChime();
    const hi = `ध्यान दें! टोकन संख्या ${token.tokenNumber}, किसान श्री ${farmer.fullNameHi}। कृपया काउंटर नंबर ${token.counterAssigned} पर पधारें। आपसे आगे ${token.peopleAhead} किसान हैं।`;
    const en = `Attention please! Token number ${token.tokenNumber}, ${farmer.fullName}. Please proceed to Counter ${token.counterAssigned}. There is ${token.peopleAhead} person ahead of you.`;
    speakAnnouncement(language === 'hi' ? hi : en, language === 'hi' ? 'hi' : 'en');
  };

  const steps = [
    { title: 'Gate Inward', titleHi: 'गेट प्रवेश', done: true, current: false },
    { title: 'Counter Verification', titleHi: 'काउंटर सत्यापन', done: token.status !== 'Waiting', current: token.status === 'Called' || token.status === 'At Counter' },
    { title: 'Weighbridge & Lab', titleHi: 'तौल कांटा व जांच', done: token.status === 'Weighbridge' || token.status === 'DBT Released' || token.status === 'Completed', current: token.status === 'Weighbridge' },
    { title: 'DBT Payment Advice', titleHi: 'डीबीटी भुगतान पर्ची', done: token.status === 'DBT Released' || token.status === 'Completed', current: token.status === 'DBT Released' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Offline Mode Cache Status Banner if offline */}
      {isOffline && (
        <div className="p-3.5 rounded-2xl bg-amber-500 text-black border border-amber-600 flex items-center gap-3 font-semibold shadow-md">
          <WifiOff className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <div className="text-xs">
            <span className="font-bold block">Offline Pass Active (स्थानीय कैश सुरक्षित)</span>
            <span>No internet required. Present your token number <strong>{token.tokenNumber}</strong> or SMS backup code to the Kendra officer.</span>
          </div>
        </div>
      )}

      {/* Hero Pass Header */}
      <div className="editorial-card rounded-3xl border-2 border-[#168A5B] bg-white overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-[#063B2A] to-[#0B5D3B] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#DDF4E9] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {language === 'hi' ? 'लाइव डिजिटल कतार पास' : 'Live Digital Queue Pass'}
              </span>
              <IntegrationBadge status="SYNCED" spec="Offline Available" featureName="Digital Pass" featureId="AUD-05" />
            </div>
            <h3 className="text-base font-bold mt-1 text-white">
              {language === 'hi' ? token.centreNameHi : token.centreName}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-white/70 block">Token Number</span>
            <span className="text-3xl sm:text-4xl font-mono-numbers font-black text-amber-300">
              {token.tokenNumber}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Turn status alert box */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            token.status === 'Called'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : token.status === 'Completed'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-[#DDF4E9]/50 border-[#168A5B]/30 text-[#063B2A]'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                token.status === 'Called'
                  ? 'bg-amber-500 text-white animate-bounce'
                  : 'bg-[#168A5B] text-white'
              }`}>
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base">
                    {token.status === 'Called' 
                      ? (language === 'hi' ? `काउंटर ${token.counterAssigned} पर पधारें` : `Proceed to Counter ${token.counterAssigned}`) 
                      : (language === 'hi' ? `स्थिति: ${token.status}` : `Status: ${token.status}`)}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-current">
                    {token.status}
                  </span>
                </div>
                <p className="text-xs opacity-80 mt-0.5">
                  {token.peopleAhead === 0 
                    ? (language === 'hi' ? 'आपकी बारी आ चुकी है!' : 'It is your turn right now!') 
                    : (language === 'hi' ? `आपसे आगे ${token.peopleAhead} किसान हैं • ~${token.estimatedWaitMins} मिनट` : `${token.peopleAhead} farmers ahead • ~${token.estimatedWaitMins} mins wait`)}
                </p>
              </div>
            </div>

            <button
              onClick={handleAudioBroadcast}
              className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0B5D3B] shadow-xs active:scale-95 transition-transform"
              title="Hear bilingual voice announcement"
            >
              <Volume2 className="w-5 h-5 text-[#168A5B]" />
            </button>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B2A]/70">
              {language === 'hi' ? 'उपार्जन व सेवा चरण:' : 'Service Stage Timeline:'}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    st.current
                      ? 'border-[#168A5B] bg-[#DDF4E9] ring-2 ring-[#168A5B]/30'
                      : st.done
                      ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold mb-1">
                    {st.done && !st.current ? '✓ ' : ''}
                    {language === 'hi' ? st.titleHi : st.title}
                  </div>
                  <span className="text-[10px] font-medium block">
                    {st.current ? 'Active Now' : st.done ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer & Lot Details breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F6F9F7] border border-[#E4EBE6] text-xs">
            <div>
              <span className="text-[#063B2A]/60 block font-medium">Farmer Name</span>
              <strong className="text-[#063B2A]">{farmer.fullName}</strong>
            </div>
            <div>
              <span className="text-[#063B2A]/60 block font-medium">Kisan ID</span>
              <strong className="text-[#063B2A] font-mono">{farmer.kisanId}</strong>
            </div>
            <div>
              <span className="text-[#063B2A]/60 block font-medium">Service</span>
              <strong className="text-[#063B2A]">{token.serviceType}</strong>
            </div>
            <div>
              <span className="text-[#063B2A]/60 block font-medium">Scheduled</span>
              <strong className="text-[#063B2A]">{token.scheduledTime}</strong>
            </div>
          </div>

          {/* QR Code and Gate Barcode Footer */}
          <div className="border-t border-[#E4EBE6] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <div className="text-xs text-[#063B2A]/70">
                <p className="font-bold text-[#063B2A]">Gate Kiosk Verification</p>
                <p className="text-[11px]">Valid at Wardha APMC & AgriSeva Gate #1</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">HASH: 8921-AS108-SECURE</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:07152245100"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#D7E3DC] hover:bg-slate-50 text-xs font-bold text-[#063B2A] flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#168A5B]" />
                <span>Call Helpdesk</span>
              </a>

              <button
                onClick={() => onNavigateToTab('procurement')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{language === 'hi' ? 'तौल पर्ची देखें' : 'View Weigh Slip'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
