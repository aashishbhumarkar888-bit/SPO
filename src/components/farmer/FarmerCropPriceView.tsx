import React, { useState } from 'react';
import { 
  Wheat, 
  TrendingUp, 
  Scale, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  MapPin, 
  Calendar, 
  ArrowUpRight,
  Info,
  DollarSign,
  Droplets,
  Layers,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../../types';

interface CropPriceItem {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'Rabi' | 'Kharif';
  msp2025: number;
  currentMandiPrice: number;
  priceTrend: number; // percentage e.g. +2.1
  maxMoistureFAQ: number;
  standardDeductionPerPct: number;
  arrivalsTodayQuintals: number;
  highPrice: number;
  lowPrice: number;
}

const LIVE_CROP_PRICES: CropPriceItem[] = [
  {
    id: 'wheat',
    nameEn: 'Wheat (Sharbati / Mill)',
    nameHi: 'गेहूँ (शरबती / मिल क्वालिटी)',
    category: 'Rabi',
    msp2025: 2425,
    currentMandiPrice: 2450,
    priceTrend: 2.1,
    maxMoistureFAQ: 12.0,
    standardDeductionPerPct: 24.25,
    arrivalsTodayQuintals: 3420,
    highPrice: 2520,
    lowPrice: 2380
  },
  {
    id: 'gram',
    nameEn: 'Gram / Chana (Desi)',
    nameHi: 'चना (देसी चना)',
    category: 'Rabi',
    msp2025: 5440,
    currentMandiPrice: 5200,
    priceTrend: 1.3,
    maxMoistureFAQ: 12.0,
    standardDeductionPerPct: 54.40,
    arrivalsTodayQuintals: 1850,
    highPrice: 5350,
    lowPrice: 5050
  },
  {
    id: 'soybean',
    nameEn: 'Soybean (Yellow JS-335)',
    nameHi: 'सोयाबीन (पीला JS-335)',
    category: 'Kharif',
    msp2025: 4892,
    currentMandiPrice: 4800,
    priceTrend: 0.8,
    maxMoistureFAQ: 12.0,
    standardDeductionPerPct: 48.92,
    arrivalsTodayQuintals: 4200,
    highPrice: 4950,
    lowPrice: 4680
  },
  {
    id: 'mustard',
    nameEn: 'Mustard (Sarson)',
    nameHi: 'सरसों (राई / पीली सरसों)',
    category: 'Rabi',
    msp2025: 5650,
    currentMandiPrice: 5720,
    priceTrend: 1.9,
    maxMoistureFAQ: 9.0,
    standardDeductionPerPct: 56.50,
    arrivalsTodayQuintals: 980,
    highPrice: 5850,
    lowPrice: 5550
  },
  {
    id: 'maize',
    nameEn: 'Maize / Makka (Hybrid)',
    nameHi: 'मक्का (हाइब्रिड)',
    category: 'Kharif',
    msp2025: 2090,
    currentMandiPrice: 1950,
    priceTrend: 1.5,
    maxMoistureFAQ: 14.0,
    standardDeductionPerPct: 20.90,
    arrivalsTodayQuintals: 2100,
    highPrice: 2040,
    lowPrice: 1880
  },
  {
    id: 'paddy',
    nameEn: 'Paddy / Dhan (Common)',
    nameHi: 'धान (कॉमन ग्रेड-ए)',
    category: 'Kharif',
    msp2025: 2300,
    currentMandiPrice: 2300,
    priceTrend: 1.2,
    maxMoistureFAQ: 17.0,
    standardDeductionPerPct: 23.00,
    arrivalsTodayQuintals: 5120,
    highPrice: 2380,
    lowPrice: 2240
  }
];

const NEARBY_MANDIS = [
  { nameHi: 'भोपाल कृषि उपज मंडी समिति', nameEn: 'Bhopal APMC Mandi', distanceKm: 4.2, wheatPrice: 2450, gramPrice: 5200, arrivals: 'भारी' },
  { nameHi: 'सीहोर मंडी यार्ड', nameEn: 'Sehore Mandi Yard', distanceKm: 34.0, wheatPrice: 2465, gramPrice: 5180, arrivals: 'मध्यम' },
  { nameHi: 'विदिशा मुख्य मंडी', nameEn: 'Vidisha Main APMC', distanceKm: 52.5, wheatPrice: 2440, gramPrice: 5240, arrivals: 'सामान्य' },
  { nameHi: 'होशंगाबाद उपार्जन केंद्र', nameEn: 'Hoshangabad Centre', distanceKm: 68.0, wheatPrice: 2470, gramPrice: 5210, arrivals: 'उच्च' }
];

interface FarmerCropPriceViewProps {
  language: LanguageCode;
  onBookCrop?: (cropName: string) => void;
}

export const FarmerCropPriceView: React.FC<FarmerCropPriceViewProps> = ({
  language,
  onBookCrop
}) => {
  const isHi = language === 'hi';
  const [selectedCrop, setSelectedCrop] = useState<CropPriceItem>(LIVE_CROP_PRICES[0]);
  const [calcQuantity, setCalcQuantity] = useState<number>(50);
  const [calcMoisture, setCalcMoisture] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCrops = LIVE_CROP_PRICES.filter(c => 
    c.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Moisture deduction logic based on government procurement standard
  const excessMoisture = Math.max(0, calcMoisture - selectedCrop.maxMoistureFAQ);
  const deductionPerQuintal = excessMoisture * selectedCrop.standardDeductionPerPct;
  const effectivePricePerQuintal = Math.max(0, selectedCrop.msp2025 - deductionPerQuintal);
  const totalGrossPayout = calcQuantity * selectedCrop.msp2025;
  const totalDeductions = calcQuantity * deductionPerQuintal;
  const netEstimatedPayout = calcQuantity * effectivePricePerQuintal;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in text-[#083324] dark:text-[#F0FAF5]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#062B1E] to-[#0D4430] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#168A5B]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5" />
              {isHi ? 'न्यूनतम समर्थन मूल्य (MSP)' : 'Official MSP Rates'}
            </span>
            <span className="text-xs text-white/80 font-medium">
              {isHi ? 'सत्र 2025-26 • भारत सरकार' : 'Season 2025-26 • Govt of India'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isHi ? 'फसल व लाइव मंडी भाव निर्देशिका' : 'Crop & Live Mandi Price Directory'}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            {isHi 
              ? 'आधिकारिक न्यूनतम समर्थन मूल्य, दैनिक मंडी आवक, नमी कटौती कैलकुलेटर व निकटतम मंडी दरों की संपूर्ण जानकारी।' 
              : 'Official MSP, daily APMC arrivals, moisture deduction calculator, and nearby mandi price comparisons.'}
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'फसल खोजें...' : 'Search crop...'}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Main Grid: Crop Price Cards (Left) + Calculator & Mandi Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Crop Price Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-[#062B1E] dark:text-[#E2ECE6] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#168A5B]" />
              {isHi ? 'दैनिक उपार्जन एवं मंडी भाव' : 'Daily Procurement & Mandi Rates'}
            </h3>
            <span className="text-[11px] font-semibold text-[#4A6E5E] dark:text-[#85AFA0]">
              {isHi ? 'अपडेट: आज प्रातः 10:00 बजे' : 'Updated: Today 10:00 AM'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredCrops.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              return (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-[#143026] border-[#168A5B] shadow-sm ring-1 ring-[#168A5B]'
                      : 'bg-white dark:bg-[#0E241C] border-[#DCE7E1] dark:border-[#1D4334] hover:border-[#168A5B]/60 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EDF4F0] dark:bg-[#153A2C] text-[#0B5D3B] dark:text-[#6EE7B7]">
                        {crop.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#083324] dark:text-[#F0FAF5] mt-1.5">
                        {isHi ? crop.nameHi : crop.nameEn}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      ▲ +{crop.priceTrend}%
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#DCE7E1]/70 dark:border-[#1D4334] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-[#4A6E5E] dark:text-[#85AFA0] block">
                        {isHi ? 'सरकारी MSP' : 'Govt MSP'}
                      </span>
                      <span className="text-base font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                        ₹ {crop.msp2025.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-[#4A6E5E] dark:text-[#85AFA0]"> / कुं.</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-medium text-[#4A6E5E] dark:text-[#85AFA0] block">
                        {isHi ? 'मंडी औसत भाव' : 'Mandi Rate'}
                      </span>
                      <span className="text-base font-bold text-[#168A5B] dark:text-[#34D399]">
                        ₹ {crop.currentMandiPrice.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-[#4A6E5E] dark:text-[#85AFA0]"> / कुं.</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
                    <span>{isHi ? `मानक नमी: ≤${crop.maxMoistureFAQ}%` : `FAQ Moisture: ≤${crop.maxMoistureFAQ}%`}</span>
                    <span>{isHi ? `दैनिक आवक: ${crop.arrivalsTodayQuintals} कुं.` : `Arrivals: ${crop.arrivalsTodayQuintals} Qtl`}</span>
                  </div>

                  {onBookCrop && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookCrop(isHi ? crop.nameHi : crop.nameEn);
                      }}
                      className="mt-3 w-full py-1.5 text-xs font-bold rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>{isHi ? 'इस फसल के लिए स्लॉट बुक करें' : 'Book Slot For This Crop'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nearby Mandi Comparison Table */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-4 sm:p-5 shadow-xs">
            <h4 className="text-xs sm:text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              {isHi ? 'निकटवर्ती मंडियों में आज का भाव तुलना' : 'Nearby APMC Mandi Comparison'}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#DCE7E1] dark:border-[#1D4334] text-[#4A6E5E] dark:text-[#85AFA0] text-[11px]">
                    <th className="pb-2 font-semibold">{isHi ? 'मंडी केंद्र' : 'Mandi Center'}</th>
                    <th className="pb-2 font-semibold">{isHi ? 'सड़क दूरी' : 'Road Distance'}</th>
                    <th className="pb-2 font-semibold">{isHi ? 'गेहूँ भाव' : 'Wheat Rate'}</th>
                    <th className="pb-2 font-semibold">{isHi ? 'चना भाव' : 'Gram Rate'}</th>
                    <th className="pb-2 font-semibold text-right">{isHi ? 'आवक स्थिति' : 'Arrivals'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE7E1]/50 dark:divide-[#1D4334]/50">
                  {NEARBY_MANDIS.map((mandi, idx) => (
                    <tr key={idx} className="hover:bg-[#F4F7F5] dark:hover:bg-[#143026]/50 transition-colors">
                      <td className="py-2.5 font-bold text-[#083324] dark:text-[#F0FAF5]">
                        {isHi ? mandi.nameHi : mandi.nameEn}
                      </td>
                      <td className="py-2.5 text-[#4A6E5E] dark:text-[#85AFA0]">
                        ~{mandi.distanceKm} {isHi ? 'किमी' : 'km'}
                      </td>
                      <td className="py-2.5 font-semibold text-[#0B5D3B] dark:text-[#6EE7B7]">
                        ₹ {mandi.wheatPrice}
                      </td>
                      <td className="py-2.5 font-semibold text-[#083324] dark:text-[#F0FAF5]">
                        ₹ {mandi.gramPrice}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          {mandi.arrivals}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quality Specs & Moisture Deduction Calculator */}
        <div className="space-y-4">
          {/* Interactive Calculator */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DCE7E1] dark:border-[#1D4334] pb-3">
              <Calculator className="w-4 h-4 text-[#168A5B]" />
              <h4 className="text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5]">
                {isHi ? 'नमी व भुगतान कैलकुलेटर' : 'Moisture & Payout Calculator'}
              </h4>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4A6E5E] dark:text-[#85AFA0] block mb-1">
                {isHi ? 'चयनित फसल' : 'Selected Crop'}
              </label>
              <div className="p-2.5 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] text-xs font-bold text-[#083324] dark:text-[#F0FAF5] flex items-center justify-between">
                <span>{isHi ? selectedCrop.nameHi : selectedCrop.nameEn}</span>
                <span className="text-[#168A5B]">MSP ₹{selectedCrop.msp2025}</span>
              </div>
            </div>

            {/* Quantity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-[#4A6E5E] dark:text-[#85AFA0]">{isHi ? 'अनुमानित वजन' : 'Estimated Weight'}</span>
                <span className="font-bold text-[#062B1E] dark:text-[#F0FAF5]">{calcQuantity} {isHi ? 'क्विंटल' : 'Quintals'}</span>
              </div>
              <input
                type="range"
                min={5}
                max={250}
                step={5}
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(Number(e.target.value))}
                className="w-full accent-[#168A5B] cursor-pointer"
              />
            </div>

            {/* Moisture Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-[#4A6E5E] dark:text-[#85AFA0]">{isHi ? 'अनाज की नमी (%)' : 'Moisture Content (%)'}</span>
                <span className={`font-bold ${calcMoisture > selectedCrop.maxMoistureFAQ ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                  {calcMoisture}% {calcMoisture <= selectedCrop.maxMoistureFAQ ? (isHi ? '(मानक FAQ)' : '(FAQ Pass)') : (isHi ? '(कटौती योग्य)' : '(Deduction)')}
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={18}
                step={0.5}
                value={calcMoisture}
                onChange={(e) => setCalcMoisture(Number(e.target.value))}
                className="w-full accent-[#168A5B] cursor-pointer"
              />
              <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0] block mt-1">
                {isHi 
                  ? `मानक सीमा: ≤${selectedCrop.maxMoistureFAQ}%। अधिक नमी पर ₹${selectedCrop.standardDeductionPerPct}/% प्रति क्विंटल कटौती।`
                  : `Standard limit: ≤${selectedCrop.maxMoistureFAQ}%. Deduction: ₹${selectedCrop.standardDeductionPerPct}/% per quintal.`}
              </span>
            </div>

            {/* Calculation Breakdown */}
            <div className="p-3.5 rounded-xl bg-[#EDF4F0] dark:bg-[#143026] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#4A6E5E] dark:text-[#85AFA0]">{isHi ? 'कुल सकल मूल्य (MSP)' : 'Gross Value (MSP)'}</span>
                <span className="font-semibold">₹ {totalGrossPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
                <span>{isHi ? 'नमी कटौती' : 'Moisture Deduction'}</span>
                <span>- ₹ {totalDeductions.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-[#C2D8CD] dark:border-[#2B5E4A] flex items-center justify-between text-sm font-bold text-[#062B1E] dark:text-[#6EE7B7]">
                <span>{isHi ? 'अनुमानित कुल भुगतान' : 'Net Est. Payout'}</span>
                <span>₹ {netEstimatedPayout.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Quality FAQ Parameters Card */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-4 sm:p-5 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#062B1E] dark:text-[#F0FAF5] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#168A5B]" />
              {isHi ? 'मानक गुणवत्ता विनिर्देश (FAQ Grade A)' : 'FAQ Grade A Standards'}
            </h4>
            <ul className="space-y-2 text-xs text-[#2C5343] dark:text-[#BBDCD0]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#168A5B] mt-1.5 flex-shrink-0"></span>
                <span><strong>{isHi ? 'विदेशी कचरा / धूल:' : 'Foreign matter:'}</strong> {isHi ? 'अधिकतम 0.75% अनुमत' : 'Max 0.75% allowed'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#168A5B] mt-1.5 flex-shrink-0"></span>
                <span><strong>{isHi ? 'टूटे / क्षतिग्रस्त दाने:' : 'Damaged / broken grains:'}</strong> {isHi ? 'अधिकतम 2.0% अनुमत' : 'Max 2.0% allowed'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#168A5B] mt-1.5 flex-shrink-0"></span>
                <span><strong>{isHi ? 'अन्य खाद्यान्न मिश्रण:' : 'Other food grains:'}</strong> {isHi ? 'अधिकतम 1.0% अनुमत' : 'Max 1.0% allowed'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#168A5B] mt-1.5 flex-shrink-0"></span>
                <span><strong>{isHi ? 'कीट-मुक्त प्रमाणन:' : 'Pest infestation:'}</strong> {isHi ? 'पूर्णतया कीट व दुर्गंध रहित' : '100% insect and odor free'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
