import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  DollarSign,
  UserCheck,
  Check,
  RotateCcw,
  Wheat,
  QrCode
} from 'lucide-react';
import { LanguageCode, AgriToken, FarmerProfile } from '../../types';

export interface VehicleOption {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  namePa: string;
  type: string;
  capacityQuintals: string;
  baseFare: number;
  ratePerKm: number;
  iconType: 'tractor' | 'mini' | 'heavy' | 'ev';
  recommendedFor: string;
  imageDesc: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'tractor_trolley',
    nameEn: 'Tractor Trolley (Mahindra / Swaraj)',
    nameHi: 'ट्रैक्टर ट्रॉली (महिंद्रा 575 / स्वराज 744)',
    nameMr: 'ट्रॅक्टर ट्रॉली (महिंद्रा / स्वराज)',
    namePa: 'ਟਰੈਕਟਰ ਟਰਾਲੀ (ਮਹਿੰਦਰਾ / ਸਵਰਾਜ)',
    type: 'Tractor Trolley',
    capacityQuintals: '40 - 70 Quintals',
    baseFare: 750,
    ratePerKm: 24,
    iconType: 'tractor',
    recommendedFor: 'Wheat, Soybean, Paddy & Bulk Grains',
    imageDesc: 'Heavy Duty 4-Wheel Hydraulic Trolley'
  },
  {
    id: 'mini_truck',
    nameEn: 'Mini Truck (Tata Ace / Bolero Maxi)',
    nameHi: 'छोटा हाथी / बोलेरो मैक्सी ट्रक',
    nameMr: 'छोटा हत्ती / बोलेरो मॅक्सी ट्रक',
    namePa: 'ਛੋਟਾ ਹਾਥੀ / ਬੋਲੇਰੋ ਮੈਕਸੀ ਟਰੱਕ',
    type: 'Mini Truck',
    capacityQuintals: '20 - 35 Quintals',
    baseFare: 550,
    ratePerKm: 20,
    iconType: 'mini',
    recommendedFor: 'Pulses, Mustard, Oilseeds & Vegetables',
    imageDesc: 'Fast Dispatch, All-Weather Covered Bed'
  },
  {
    id: 'heavy_truck',
    nameEn: 'Medium Commercial Truck (Eicher / Tata)',
    nameHi: 'बड़ा वाणिज्यिक ट्रक (आयशर / टाटा 1612)',
    nameMr: 'मोठा व्यावसायिक ट्रक (आयशर / टाटा)',
    namePa: 'ਵੱਡਾ ਵਪਾਰਕ ਟਰੱਕ (ਆਈਸ਼ਰ / ਟਾਟਾ)',
    type: 'Commercial Truck',
    capacityQuintals: '100 - 160 Quintals',
    baseFare: 1400,
    ratePerKm: 34,
    iconType: 'heavy',
    recommendedFor: 'Cooperative Farmer Shared Loads',
    imageDesc: 'High Capacity 6-Wheeler for Long Hauls'
  },
  {
    id: 'electric_cargo',
    nameEn: 'Electric Green Agri Cargo (EV 3-Wheeler)',
    nameHi: 'इलेक्ट्रिक ग्रीन एग्री कार्गो (ई-लोडर)',
    nameMr: 'इलेक्ट्रिक ग्रीन ॲग्री कार्गो (ई-लोडर)',
    namePa: 'ਇਲੈਕਟ੍ਰਿਕ ਗ੍ਰੀਨ ਐਗਰੀ ਕਾਰਗੋ (ਈ-ਲੋਡਰ)',
    type: 'Electric EV',
    capacityQuintals: '12 - 18 Quintals',
    baseFare: 350,
    ratePerKm: 14,
    iconType: 'ev',
    recommendedFor: 'Short Farm-to-Mandi Runs & Zero Fuel Emissions',
    imageDesc: 'Eco-Friendly, Lowest Cost per km'
  }
];

interface BookingRecord {
  bookingId: string;
  vehicleName: string;
  vehicleReg: string;
  driverName: string;
  driverPhone: string;
  pickupLocation: string;
  destinationMandi: string;
  commodity: string;
  quantityQuintals: number;
  pickupDate: string;
  pickupSlot: string;
  estimatedCost: number;
  arrivalOtp: string;
  status: 'Confirmed' | 'En Route' | 'Completed';
}

interface FarmerBookVehicleViewProps {
  language: LanguageCode;
  farmer?: FarmerProfile;
  activeToken?: AgriToken;
  onOpenGatePassQr?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const FarmerBookVehicleView: React.FC<FarmerBookVehicleViewProps> = ({
  language,
  farmer,
  activeToken,
  onOpenGatePassQr,
  onNavigateToTab
}) => {
  const isHi = language === 'hi';
  const isMr = language === 'mr';
  const isPa = language === 'pa';

  // Form states
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('tractor_trolley');
  const [pickupVillage, setPickupVillage] = useState<string>(
    farmer ? `${farmer.village}, ${farmer.district}` : 'Deoli Khurd, Wardha'
  );
  const [destinationMandi, setDestinationMandi] = useState<string>('Wardha Main APMC Market Yard (14 km)');
  const [commodity, setCommodity] = useState<string>(activeToken?.cropName || 'Soyabean (JS-335)');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(activeToken?.quantityQuintals || 45);
  const [pickupDate, setPickupDate] = useState<string>('Tomorrow, 07:30 AM');
  const [pickupSlot, setPickupSlot] = useState<string>('Morning (07:00 AM - 10:00 AM)');
  const [needLaborLoading, setNeedLaborLoading] = useState<boolean>(true);
  const [bookingSuccess, setBookingSuccess] = useState<BookingRecord | null>(null);

  // Active bookings list
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      bookingId: 'BK-VEH-9214',
      vehicleName: 'Tractor Trolley (Mahindra 575 DI)',
      vehicleReg: 'MP-04-HE-8921',
      driverName: 'सुखदेव यादव (Sukhdev Yadav)',
      driverPhone: '+91 98260 11928',
      pickupLocation: farmer?.village || 'Deoli Khurd, Wardha',
      destinationMandi: 'Wardha Main APMC Mandi Yard',
      commodity: 'Soyabean (JS-335)',
      quantityQuintals: 45,
      pickupDate: 'Today',
      pickupSlot: 'Morning 08:30 AM',
      estimatedCost: 1086,
      arrivalOtp: '4819',
      status: 'Confirmed'
    }
  ]);

  const selectedVehicle = VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId) || VEHICLE_OPTIONS[0];

  // Estimated distance extraction from destination string (e.g. "14 km")
  const distanceMatch = destinationMandi.match(/(\d+)\s*km/);
  const estimatedKm = distanceMatch ? parseInt(distanceMatch[1], 10) : 15;

  const vehicleBase = selectedVehicle.baseFare;
  const distanceFare = estimatedKm * selectedVehicle.ratePerKm;
  const laborAddon = needLaborLoading ? 250 : 0;
  const grossTotal = vehicleBase + distanceFare + laborAddon;
  const subsidyDiscount = Math.round(grossTotal * 0.15); // 15% Kisan Parivahan Subsidy
  const netEstimatedPayable = grossTotal - subsidyDiscount;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookingId = `BK-VEH-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newRecord: BookingRecord = {
      bookingId: newBookingId,
      vehicleName: isHi ? selectedVehicle.nameHi : isMr ? selectedVehicle.nameMr : isPa ? selectedVehicle.namePa : selectedVehicle.nameEn,
      vehicleReg: `MH-${Math.floor(10 + Math.random() * 89)}-AG-${Math.floor(1000 + Math.random() * 9000)}`,
      driverName: 'रमेश कुमार चौधरी (Ramesh Choudhary)',
      driverPhone: '+91 94250 87311',
      pickupLocation: pickupVillage,
      destinationMandi: destinationMandi,
      commodity: commodity,
      quantityQuintals: quantityQuintals,
      pickupDate: pickupDate,
      pickupSlot: pickupSlot,
      estimatedCost: netEstimatedPayable,
      arrivalOtp: otp,
      status: 'Confirmed'
    };

    setBookings([newRecord, ...bookings]);
    setBookingSuccess(newRecord);
  };

  const getVehicleName = (v: VehicleOption) => {
    if (isHi) return v.nameHi;
    if (isMr) return v.nameMr;
    if (isPa) return v.namePa;
    return v.nameEn;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in text-[#083324] dark:text-[#F0FAF5]">
      {/* Decorative Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#062B1E] via-[#0B3A29] to-[#124A35] rounded-3xl p-6 sm:p-7 text-white shadow-md border border-[#168A5B]/30">
        {/* Subtle decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-32 -top-12 w-48 h-48 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-xl bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-xs">
                <Truck className="w-4 h-4" />
                <span>
                  {isHi ? 'कृषि उपज वाहन बुकिंग' : isMr ? 'कृषी उत्पादन वाहन बुकिंग' : isPa ? 'ਖੇਤੀ ਉਪਜ ਵਾਹਨ ਬੁਕਿੰਗ' : 'Agri Transport Booking'}
                </span>
              </span>
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>
                  {isHi ? '15% किसान परिवहन सब्सिडी लागू' : '15% Kisan Transport Subsidy'}
                </span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif-display">
              {isHi 
                ? 'खेत से मंडी तक वाहन बुक करें' 
                : isMr 
                ? 'शेतातून बाजारपेठेत वाहन बुक करा' 
                : isPa 
                ? 'ਖੇਤ ਤੋਂ ਮੰਡੀ ਤੱਕ ਵਾਹਨ ਬੁੱਕ ਕਰੋ' 
                : 'Book Farm-to-Mandi Grain Transport'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              {isHi 
                ? 'सत्यापित ट्रैक्टर ट्रॉली, छोटा हाथी एवं पिकअप वाहन उचित सरकारी अनुमोदित दरों पर सीधे आपके खेत पर उपलब्ध।' 
                : 'Book verified tractor trolleys, mini trucks, and pickup haulers at pre-approved transparent rates directly to your farm gate.'}
            </p>
          </div>

          {/* Quick gate pass action */}
          {onOpenGatePassQr && (
            <button
              onClick={onOpenGatePassQr}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-[#062B1E] font-bold text-xs shadow-sm transition-all cursor-pointer self-start md:self-center"
            >
              <QrCode className="w-4 h-4 text-[#168A5B]" />
              <span>{isHi ? 'डिजिटल गेट पास' : 'Gate Pass QR'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Booking Success Modal Banner */}
      {bookingSuccess && (
        <div className="bg-emerald-50 dark:bg-[#143528] border-2 border-emerald-500 rounded-2xl p-5 shadow-md animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                {isHi ? 'सफल बुकिंग' : 'Booking Confirmed'}
              </span>
              <h3 className="text-base font-bold text-[#062B1E] dark:text-[#E2ECE6] mt-1">
                {bookingSuccess.bookingId} — {bookingSuccess.vehicleName}
              </h3>
              <p className="text-xs text-[#38604F] dark:text-[#A7D7C1] mt-0.5">
                {isHi ? 'चालक:' : 'Driver:'} <strong>{bookingSuccess.driverName}</strong> ({bookingSuccess.driverPhone}) • {isHi ? 'वाहन:' : 'Vehicle:'} <strong className="font-mono">{bookingSuccess.vehicleReg}</strong>
              </p>
              <div className="mt-2 inline-flex items-center gap-2 bg-white dark:bg-[#0E241C] px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-700 text-xs">
                <span className="text-slate-500 dark:text-slate-400">{isHi ? 'चालक सत्यापन ओटीपी:' : 'Arrival Verification OTP:'}</span>
                <span className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-300 tracking-wider">
                  {bookingSuccess.arrivalOtp}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setBookingSuccess(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all self-end sm:self-center cursor-pointer"
          >
            {isHi ? 'ठीक है' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Main Grid: Booking Engine (Left 2 Cols) + Transparent Rate Calculator (Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Step 1: Vehicle Category Selection */}
          <div className="bg-white dark:bg-[#0E241C] rounded-3xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#168A5B] text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'उपयुक्त वाहन का चयन करें' : 'Select Transport Vehicle'}
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0]">
                {VEHICLE_OPTIONS.length} {isHi ? 'विकल्प उपलब्ध' : 'options available'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {VEHICLE_OPTIONS.map((veh) => {
                const isSelected = selectedVehicleId === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => setSelectedVehicleId(veh.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-[#143026] border-[#168A5B] shadow-sm ring-2 ring-[#168A5B]/40'
                        : 'bg-[#FBFDFB] dark:bg-[#0A1D16] border-[#DCE7E1] dark:border-[#1D4334] hover:border-[#168A5B]/50 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected 
                            ? 'bg-[#168A5B] text-white' 
                            : 'bg-[#E7F7EF] dark:bg-[#123829] text-[#168A5B]'
                        }`}>
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#083324] dark:text-[#F0FAF5] leading-tight">
                            {getVehicleName(veh)}
                          </h4>
                          <span className="text-[11px] font-semibold text-[#168A5B] dark:text-[#34D399] block mt-0.5">
                            {veh.capacityQuintals}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#168A5B] text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] mt-3 line-clamp-1">
                      {veh.recommendedFor}
                    </p>

                    <div className="mt-2.5 pt-2.5 border-t border-[#DCE7E1]/60 dark:border-[#1D4334] flex items-center justify-between text-xs">
                      <span className="text-[#4A6E5E] dark:text-[#85AFA0]">
                        {isHi ? 'मूल किराया:' : 'Base Fare:'} <strong>₹{veh.baseFare}</strong>
                      </span>
                      <span className="font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                        ₹{veh.ratePerKm}/km
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Pickup, Destination & Commodity */}
          <form onSubmit={handleConfirmBooking} className="bg-white dark:bg-[#0E241C] rounded-3xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#168A5B] text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                {isHi ? 'स्थान, उपज व समय विवरण' : 'Trip & Commodity Details'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pickup location */}
              <div>
                <label className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block mb-1.5">
                  {isHi ? 'खेत / गांव पिकअप स्थान' : 'Pickup Farm / Village'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    required
                    value={pickupVillage}
                    onChange={(e) => setPickupVillage(e.target.value)}
                    placeholder="e.g. Village Deoli, Wardha"
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#DCE7E1] dark:border-[#1D4334] bg-white dark:bg-[#0A1D16] text-[#083324] dark:text-[#F0FAF5] focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
                  />
                </div>
              </div>

              {/* Destination Mandi */}
              <div>
                <label className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block mb-1.5">
                  {isHi ? 'गंतव्य एपीएमसी मंडी / उपार्जन केंद्र' : 'Destination APMC Mandi'}
                </label>
                <select
                  value={destinationMandi}
                  onChange={(e) => setDestinationMandi(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#DCE7E1] dark:border-[#1D4334] bg-white dark:bg-[#0A1D16] text-[#083324] dark:text-[#F0FAF5] focus:outline-none focus:ring-2 focus:ring-[#168A5B] cursor-pointer"
                >
                  <option value="Wardha Main APMC Market Yard (14 km)">Wardha Main APMC Market Yard (14 km)</option>
                  <option value="Bhopal Karond APMC Mandi (22 km)">Bhopal Karond APMC Mandi (22 km)</option>
                  <option value="Sehore Krishi Upaj Mandi (35 km)">Sehore Krishi Upaj Mandi (35 km)</option>
                  <option value="Vidisha District Grain Mandi (48 km)">Vidisha District Grain Mandi (48 km)</option>
                  <option value="Hoshangabad Procurement Center (55 km)">Hoshangabad Procurement Center (55 km)</option>
                </select>
              </div>

              {/* Commodity */}
              <div>
                <label className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block mb-1.5">
                  {isHi ? 'उपज / फसल का नाम' : 'Crop / Commodity to Transport'}
                </label>
                <div className="relative">
                  <Wheat className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    required
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    placeholder="e.g. Soyabean (JS-335) or Wheat"
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#DCE7E1] dark:border-[#1D4334] bg-white dark:bg-[#0A1D16] text-[#083324] dark:text-[#F0FAF5] focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block mb-1.5">
                  {isHi ? 'अनुमानित मात्रा (क्विंटल)' : 'Approx. Quantity (Quintals)'}
                </label>
                <input
                  type="number"
                  min={5}
                  max={250}
                  required
                  value={quantityQuintals}
                  onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#DCE7E1] dark:border-[#1D4334] bg-white dark:bg-[#0A1D16] text-[#083324] dark:text-[#F0FAF5] focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block mb-1.5">
                  {isHi ? 'पिकअप तारीख' : 'Pickup Date'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="text"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#DCE7E1] dark:border-[#1D4334] bg-white dark:bg-[#0A1D16] text-[#083324] dark:text-[#F0FAF5] focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
                  />
                </div>
              </div>

              {/* Time slot */}
              <div>
                <label className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block mb-1.5">
                  {isHi ? 'समय स्लॉट' : 'Time Slot'}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#DCE7E1] dark:border-[#1D4334] bg-white dark:bg-[#0A1D16] text-[#083324] dark:text-[#F0FAF5] focus:outline-none focus:ring-2 focus:ring-[#168A5B] cursor-pointer"
                  >
                    <option value="Morning (07:00 AM - 10:00 AM)">Morning (07:00 AM - 10:00 AM)</option>
                    <option value="Noon (11:00 AM - 02:00 PM)">Noon (11:00 AM - 02:00 PM)</option>
                    <option value="Evening (03:00 PM - 06:00 PM)">Evening (03:00 PM - 06:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Helper Labor Addon Toggle */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-[#1E2619] border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                  {isHi ? 'खेत पर लोडिंग हेतु श्रमिक सहायता (+₹250)' : 'Farm Loading Labor Assistance (+₹250)'}
                </h5>
                <p className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] mt-0.5">
                  {isHi ? '2 प्रशिक्षित हमाल आपके खेत पर बोरियां लोड करने में सहयोग करेंगे' : '2 trained loaders will assist in bagging & loading onto vehicle'}
                </p>
              </div>

              <input
                type="checkbox"
                checked={needLaborLoading}
                onChange={(e) => setNeedLaborLoading(e.target.checked)}
                className="w-5 h-5 accent-[#168A5B] rounded cursor-pointer"
              />
            </div>

            {/* Submit Booking Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-[#168A5B] hover:bg-[#0E6C45] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-amber-300" />
              <span>
                {isHi ? 'वाहन बुकिंग की पुष्टि करें (तत्काल कन्फर्मेशन)' : 'Confirm Transport Booking (Instant Dispatch)'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right 1 Col: Transparent Fare Summary & Bookings List */}
        <div className="space-y-5">
          
          {/* Fare Breakdown Card */}
          <div className="bg-white dark:bg-[#0E241C] rounded-3xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
              <DollarSign className="w-4 h-4 text-[#168A5B]" />
              <h4 className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                {isHi ? 'पारदर्शी किराया अनुमान' : 'Fare Estimate'}
              </h4>
            </div>

            <div className="p-3 rounded-2xl bg-[#F4F7F5] dark:bg-[#143026] text-xs">
              <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] block font-semibold">
                {isHi ? 'चयनित वाहन' : 'Selected Vehicle'}
              </span>
              <span className="font-bold text-[#083324] dark:text-[#F0FAF5] text-sm block mt-0.5">
                {getVehicleName(selectedVehicle)}
              </span>
              <span className="text-[11px] text-[#168A5B] font-semibold mt-1 inline-block">
                ~{estimatedKm} km road distance
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#2C5343] dark:text-[#BBDCD0]">
              <div className="flex items-center justify-between">
                <span>{isHi ? 'मूल प्रस्थान शुल्क (Base Fare)' : 'Base Booking Charge'}</span>
                <span className="font-semibold">₹ {vehicleBase}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{isHi ? `दूरी किराया (${estimatedKm} किमी @ ₹${selectedVehicle.ratePerKm}/किमी)` : `Distance (${estimatedKm} km @ ₹${selectedVehicle.ratePerKm}/km)`}</span>
                <span className="font-semibold">₹ {distanceFare}</span>
              </div>
              {needLaborLoading && (
                <div className="flex items-center justify-between">
                  <span>{isHi ? 'खेत लोडिंग सहायता' : 'Loading Assistance'}</span>
                  <span className="font-semibold">₹ 250</span>
                </div>
              )}
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>{isHi ? 'किसान परिवहन सब्सिडी (15%)' : 'Kisan Transport Subsidy (15%)'}</span>
                <span>- ₹ {subsidyDiscount}</span>
              </div>

              <div className="pt-3 border-t border-[#DCE7E1] dark:border-[#1D4334] flex items-center justify-between text-base font-bold text-[#062B1E] dark:text-[#6EE7B7]">
                <span>{isHi ? 'देय अनुमानित राशि' : 'Total Est. Fare'}</span>
                <span>₹ {netEstimatedPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] bg-[#EDF4F0] dark:bg-[#143026] p-2.5 rounded-xl leading-relaxed">
              {isHi 
                ? 'ℹ️ चालक का भुगतान मंडी में तुलाई व गेट एंट्री पूर्ण होने के पश्चात नकद अथवा सीधे यूपीआई द्वारा किया जा सकता है।' 
                : 'ℹ️ Fare can be settled via UPI or cash upon successful unloading at the APMC yard.'}
            </p>
          </div>

          {/* Active / Past Bookings */}
          <div className="bg-white dark:bg-[#0E241C] rounded-3xl border border-[#DCE7E1] dark:border-[#1D4334] p-5 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{isHi ? 'सक्रिय वाहन बुकिंग' : 'Your Vehicle Bookings'}</span>
            </h4>

            <div className="space-y-3">
              {bookings.map((item) => (
                <div 
                  key={item.bookingId} 
                  className="p-3.5 rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] bg-[#FBFDFB] dark:bg-[#0A1D16] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                      {item.bookingId}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {item.status}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-[#083324] dark:text-[#F0FAF5]">
                    {item.vehicleName}
                  </h5>

                  <p className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
                    {item.destinationMandi} • {item.commodity} ({item.quantityQuintals} Qtl)
                  </p>

                  <div className="pt-2 border-t border-[#DCE7E1]/60 dark:border-[#1D4334] flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      ₹ {item.estimatedCost}
                    </span>
                    <a
                      href={`tel:${item.driverPhone}`}
                      className="inline-flex items-center gap-1 font-bold text-[#168A5B] hover:underline text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{isHi ? 'चालक से बात करें' : 'Call Driver'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
