import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Compass
} from 'lucide-react';
import { ServiceCentre, LanguageCode } from '../../types';
import { SERVICE_CENTRES, TRANSLATIONS } from '../../data/agriMockData';
import { speakAnnouncement } from '../../utils/speech';

interface FarmerCentresMapViewProps {
  language: LanguageCode;
  onBookAtCentre: (centre: ServiceCentre) => void;
}

export const FarmerCentresMapView: React.FC<FarmerCentresMapViewProps> = ({
  language,
  onBookAtCentre
}) => {
  const [activeCentre, setActiveCentre] = useState<ServiceCentre>(SERVICE_CENTRES[0]);
  const [filterType, setFilterType] = useState<string>('All');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const filteredCentres = SERVICE_CENTRES.filter(c => {
    if (filterType === 'All') return true;
    if (filterType === 'Mandi') return c.type === 'APMC Mandi Yard';
    if (filterType === 'Kendra') return c.type === 'AgriSeva Kendra';
    if (filterType === 'Hub') return c.type === 'Custom Hiring Hub';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-[#D7E3DC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif-display text-[#063B2A]">
            {t.centresDirections}
          </h2>
          <p className="text-xs text-[#063B2A]/70 mt-0.5">
            {language === 'hi' 
              ? 'निकटतम केंद्र, दूरी, लाइव कतार व दिशा निर्देश' 
              : 'Nearby Kendras, APMC yards, live queue depth and GPS navigation'}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          {['All', 'Kendra', 'Mandi', 'Hub'].map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filterType === ft
                  ? 'bg-[#168A5B] text-white'
                  : 'bg-white text-[#063B2A] border border-[#D7E3DC] hover:bg-[#F0F5F2]'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Centre List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              onClick={() => setActiveCentre(centre)}
              className={`editorial-card rounded-2xl p-4.5 border-2 transition-all cursor-pointer ${
                activeCentre.id === centre.id
                  ? 'border-[#168A5B] bg-[#DDF4E9]/30 shadow-md ring-1 ring-[#168A5B]'
                  : 'border-[#D7E3DC] hover:border-[#168A5B]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {centre.type}
                  </span>
                  <h4 className="font-bold text-sm text-[#063B2A] mt-1.5">
                    {language === 'hi' ? centre.nameHi : centre.name}
                  </h4>
                  <p className="text-xs text-[#063B2A]/70 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#168A5B]" />
                    <span>{centre.villageOrTown} • <strong>{centre.distanceKm} km</strong></span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#0B5D3B] block">
                    {centre.currentQueueCount} waiting
                  </span>
                  <span className="text-[10px] text-[#063B2A]/60">
                    ~{centre.avgWaitTimeMins} mins wait
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E4EBE6] flex items-center justify-between gap-2">
                <a
                  href={`tel:${centre.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-[#063B2A]/80 font-medium hover:text-[#168A5B]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#168A5B]" />
                  <span>{centre.phone}</span>
                </a>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookAtCentre(centre);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold transition-all shadow-xs"
                >
                  {language === 'hi' ? 'स्लॉट लें' : 'Book Slot'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Interactive GPS Simulated Compass & Direction Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="editorial-card rounded-3xl p-5 bg-white border border-[#D7E3DC] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#168A5B]" />
                <span>GPS Turn-by-Turn Route</span>
              </span>
              <span className="text-xs font-bold text-[#168A5B]">
                {activeCentre.distanceKm} km from Sevagram
              </span>
            </div>

            {/* Simulated Vector Route Canvas */}
            <div className="h-56 rounded-2xl bg-[#E8F2EC] border border-[#C5DED0] relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#168A5B_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 60 160 Q 180 80 320 60"
                  fill="none"
                  stroke="#168A5B"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                />
              </svg>

              {/* Start pin */}
              <div className="absolute left-10 bottom-8 bg-[#063B2A] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Your Farm</span>
              </div>

              {/* End pin */}
              <div className="absolute right-10 top-10 bg-[#168A5B] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ring-4 ring-emerald-400/30">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{activeCentre.name.split(' ')[0]}</span>
              </div>
            </div>

            {/* Live GPS Active Guidance Banner */}
            {isNavigating && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#153A2C] border border-emerald-300 dark:border-[#22A872] text-xs space-y-2 animate-fade-in transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'hi' ? 'लाइव जीपीएस मार्गदर्शन सक्रिय' : 'Live GPS Guidance Active'}</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                    Speed: 28 km/h • ETA: 14 min
                  </span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-100 text-[11px] leading-relaxed">
                  {language === 'hi' 
                    ? 'अगला मोड़: 400 मीटर बाद, एपीएमसी कृषि बाईपास कॉरिडोर की ओर बाएं मुड़ें।' 
                    : 'Next turn: In 400m, keep left towards APMC Agricultural Bypass Corridor Gate #2.'}
                </p>
              </div>
            )}

            {/* Directions Steps */}
            <div className="p-3.5 rounded-xl bg-[#F6F9F7] dark:bg-[#143026] border border-[#E4EBE6] dark:border-[#1D4334] text-xs space-y-2 text-[#063B2A] dark:text-[#F0FAF5] transition-colors">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#168A5B] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <p>{language === 'hi' ? 'सेवाग्राम-वर्धा राज्य राजमार्ग की ओर उत्तर दिशा में जाएं (2.1 किमी)' : 'Head North towards Sevagram-Wardha State Highway (2.1 km)'}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#168A5B] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <p>{language === 'hi' ? 'एपीएमसी किसान गेट #2 से सीधे तौल कांटा कतार लेन में प्रवेश करें' : 'Turn right at APMC Kisan Gate #2 into Weighbridge Queue Bay'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setIsNavigating(prev => !prev);
                  const msg = language === 'hi'
                    ? `${activeCentre.nameHi || activeCentre.name} हेतु जीपीएस मार्गदर्शन शुरू। दूरी 4.2 किलोमीटर। सीधे जाएं।`
                    : `GPS guidance started for ${activeCentre.name}. Distance 4.2 kilometers. Proceed towards Gate 2.`;
                  speakAnnouncement(msg, language === 'hi' ? 'hi' : 'en');
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isNavigating
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-[#063B2A] hover:bg-[#0B5D3B] text-white'
                }`}
              >
                <Navigation className="w-4 h-4 text-emerald-300" />
                <span>
                  {isNavigating
                    ? (language === 'hi' ? 'मार्गदर्शन रोकें' : 'Stop Navigation')
                    : (language === 'hi' ? 'नेविगेशन शुरू करें' : 'Start Turn-by-Turn GPS')}
                </span>
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeCentre.name + ', Wardha, Maharashtra')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl border border-[#C7DCD1] dark:border-[#2B5E4A] bg-white dark:bg-[#143026] text-[#063B2A] dark:text-[#F0FAF5] hover:bg-[#F4F7F5] dark:hover:bg-[#1C3E32] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#168A5B]" />
                <span>Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
