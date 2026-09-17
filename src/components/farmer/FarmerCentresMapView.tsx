import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Compass,
  Layers,
  Radio,
  Truck,
  Crosshair,
  Building,
  Scale
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
  const [mapViewMode, setMapViewMode] = useState<'route' | 'yard'>('route');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const filteredCentres = SERVICE_CENTRES.filter(c => {
    if (filterType === 'All') return true;
    if (filterType === 'Mandi') return c.type === 'APMC Mandi Yard';
    if (filterType === 'Kendra') return c.type === 'AgriSeva Kendra';
    if (filterType === 'Hub') return c.type === 'Custom Hiring Hub';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-[#D7E3DC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif-display text-[#063B2A] dark:text-[#F0FAF5]">
            {t.centresDirections}
          </h2>
          <p className="text-xs text-[#063B2A]/70 dark:text-emerald-200/70 mt-0.5">
            {language === 'hi' 
              ? 'निकटतम केंद्र, दूरी, लाइव कतार व जीपीएस दिशा निर्देश' 
              : language === 'mr'
              ? 'जवळचे खरेदी केंद्र, अंतर, थेट रांग आणि जीपीएस मार्ग'
              : language === 'pa'
              ? 'ਨੇੜਲੇ ਖਰੀਦ ਕੇਂਦਰ, ਦੂਰੀ, ਲਾਈਵ ਕਤਾਰ ਅਤੇ ਜੀਪੀਐਸ ਰੂਟ'
              : 'Nearby Kendras, APMC yards, live queue depth and GPS navigation'}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          {['All', 'Kendra', 'Mandi', 'Hub'].map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filterType === ft
                  ? 'bg-[#168A5B] text-white shadow-xs'
                  : 'bg-white dark:bg-[#143026] text-[#063B2A] dark:text-emerald-200 border border-[#D7E3DC] dark:border-[#2B5E4A] hover:bg-[#F0F5F2]'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Centre List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              onClick={() => setActiveCentre(centre)}
              className={`editorial-card rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                activeCentre.id === centre.id
                  ? 'border-[#168A5B] bg-[#DDF4E9]/40 dark:bg-[#184635]/60 shadow-md ring-2 ring-[#168A5B]/30'
                  : 'border-[#D7E3DC] dark:border-[#2B5E4A] bg-white dark:bg-[#0E241C] hover:border-[#168A5B]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {centre.type}
                  </span>
                  <h4 className="font-bold text-sm text-[#063B2A] dark:text-[#F0FAF5] mt-1.5">
                    {language === 'hi' ? centre.nameHi : centre.name}
                  </h4>
                  <p className="text-xs text-[#063B2A]/70 dark:text-emerald-200/80 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#168A5B]" />
                    <span>{centre.villageOrTown} • <strong>{centre.distanceKm} km</strong></span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#0B5D3B] dark:text-emerald-300 block">
                    {centre.currentQueueCount} waiting
                  </span>
                  <span className="text-[10px] text-[#063B2A]/60 dark:text-emerald-200/60">
                    ~{centre.avgWaitTimeMins} mins wait
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E4EBE6] dark:border-[#2B5E4A] flex items-center justify-between gap-2">
                <a
                  href={`tel:${centre.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-[#063B2A]/80 dark:text-emerald-200/80 font-medium hover:text-[#168A5B]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#168A5B]" />
                  <span>{centre.phone}</span>
                </a>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookAtCentre(centre);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {language === 'hi' ? 'स्लॉट लें' : 'Book Slot'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Interactive GPS Simulated Compass & Direction Box with Shapes & Animations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="editorial-card rounded-3xl p-5 bg-white dark:bg-[#0E241C] border border-[#D7E3DC] dark:border-[#2B5E4A] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#063B2A] dark:text-emerald-200 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#168A5B] animate-spin [animation-duration:8s]" />
                  <span>{mapViewMode === 'route' ? 'GPS Turn-by-Turn Route' : 'APMC Yard Layout & Bays'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  {activeCentre.distanceKm} km
                </span>
              </div>

              {/* View mode toggle button */}
              <div className="flex items-center gap-1 bg-[#F0F5F2] dark:bg-[#143026] p-0.5 rounded-xl border border-[#D7E3DC] dark:border-[#2B5E4A]">
                <button
                  type="button"
                  onClick={() => setMapViewMode('route')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    mapViewMode === 'route'
                      ? 'bg-[#168A5B] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-black'
                  }`}
                >
                  Route
                </button>
                <button
                  type="button"
                  onClick={() => setMapViewMode('yard')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    mapViewMode === 'yard'
                      ? 'bg-[#168A5B] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-black'
                  }`}
                >
                  Yard Map
                </button>
              </div>
            </div>

            {/* Simulated Vector Route & Yard Interactive Canvas */}
            <div className="h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-[#E8F2EC] to-[#D5EADF] dark:from-[#0B251B] dark:to-[#061B13] border border-[#C5DED0] dark:border-[#204E3D] relative overflow-hidden flex items-center justify-center p-4 select-none">
              
              {/* Animated background grid texture */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#168A5B_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

              {mapViewMode === 'route' ? (
                <>
                  {/* Concentric Radar Wave Shapes around farm */}
                  <div className="absolute left-12 bottom-12 w-28 h-28 rounded-full border border-emerald-500/20 animate-ping [animation-duration:3s]" />
                  <div className="absolute left-12 bottom-12 w-16 h-16 rounded-full border border-emerald-500/30" />

                  {/* Concentric Radar Wave Shapes around Mandi destination */}
                  <div className="absolute right-12 top-10 w-32 h-32 rounded-full border border-amber-500/20 animate-ping [animation-duration:2.5s]" />

                  {/* SVG Route Geometry */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B5D3B" />
                        <stop offset="50%" stopColor="#168A5B" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>

                    {/* Background highway corridor curve */}
                    <path
                      d="M 70 190 Q 150 140 220 155 T 380 75"
                      fill="none"
                      stroke="#8ABAA3"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.3"
                    />

                    {/* Active dashed navigation track */}
                    <path
                      d="M 70 190 Q 150 140 220 155 T 380 75"
                      fill="none"
                      stroke="url(#routeGradient)"
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      className={isNavigating ? 'animate-pulse' : ''}
                    />

                    {/* Geographic waypoint circles */}
                    <circle cx="220" cy="155" r="4" fill="#0B5D3B" />
                    <text x="210" y="145" fontSize="9" fill="#063B2A" fontWeight="bold">NH-361 Jn</text>
                  </svg>

                  {/* Animated Vehicle progressing along highway when navigating */}
                  {isNavigating && (
                    <div className="absolute left-32 bottom-24 bg-white dark:bg-[#0E241C] p-1.5 rounded-full shadow-lg border border-emerald-500 animate-bounce">
                      <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}

                  {/* Start pin: Your Farm */}
                  <div className="absolute left-6 bottom-6 bg-[#063B2A] text-white text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5 border border-white/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Your Farm (Wardha)</span>
                  </div>

                  {/* Destination pin: Active Centre */}
                  <div className="absolute right-6 top-6 bg-[#168A5B] text-white text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 ring-4 ring-emerald-400/40 border border-white/20">
                    <MapPin className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span>{activeCentre.name.split(' ')[0]} Mandi</span>
                  </div>
                </>
              ) : (
                /* YARD LAYOUT VIEW: Architectural Geometric Shapes for Mandi Complex */
                <div className="relative w-full h-full flex flex-col justify-between p-2">
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {/* Gate 1 & Security */}
                    <div className="rounded-xl border border-dashed border-emerald-600/60 bg-white/60 dark:bg-[#0E241C]/60 p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 dark:text-emerald-200">
                        <Crosshair className="w-3 h-3 text-emerald-600" />
                        <span>Gate 1 • RFID Entry</span>
                      </div>
                      <div className="bg-emerald-100 dark:bg-emerald-950/80 rounded p-1 text-[9px] text-emerald-800 dark:text-emerald-300 font-mono text-center">
                        Clear • 2 Trucks
                      </div>
                    </div>

                    {/* Central Weighbridge Bay */}
                    <div className="rounded-xl border-2 border-emerald-600 bg-emerald-500/10 p-2 flex flex-col justify-between shadow-inner">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-950 dark:text-emerald-100">
                        <Scale className="w-3 h-3 text-amber-500" />
                        <span>Weighbridge Bay #1</span>
                      </div>
                      <div className="text-[10px] text-emerald-800 dark:text-emerald-200 font-bold">
                        50T Electronic Scale
                      </div>
                      <div className="bg-amber-100 dark:bg-amber-950/80 rounded p-1 text-[9px] text-amber-900 dark:text-amber-200 font-mono text-center">
                        Active Weighment
                      </div>
                    </div>

                    {/* Grain Storage Warehouses */}
                    <div className="rounded-xl border border-dashed border-emerald-600/60 bg-white/60 dark:bg-[#0E241C]/60 p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 dark:text-emerald-200">
                        <Building className="w-3 h-3 text-emerald-600" />
                        <span>Shed A (Soybean)</span>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-950/80 rounded p-1 text-[9px] text-blue-900 dark:text-blue-200 font-mono text-center">
                        Moisture: 10.4%
                      </div>
                    </div>
                  </div>

                  {/* Foot traffic & farmer lounge */}
                  <div className="mt-2 p-2 rounded-xl bg-white/80 dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A] flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#063B2A] dark:text-emerald-300 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                      <span>Yard Bay #3: Unloading in Progress</span>
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      Cap: 150 Qtl/hr
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Live GPS Active Guidance Banner */}
            {isNavigating && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#153A2C] border border-emerald-300 dark:border-[#22A872] text-xs space-y-2 animate-fade-in transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" />
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
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
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
