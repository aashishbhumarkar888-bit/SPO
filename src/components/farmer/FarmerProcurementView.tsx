import React from 'react';
import { 
  Scale, 
  Droplets, 
  CheckCircle2, 
  FileText, 
  Banknote, 
  ArrowRight, 
  Volume2, 
  Download, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Layers 
} from 'lucide-react';
import { ProcurementRecord, LanguageCode } from '../../types';
import { getTranslations } from '../../i18n';
import { speakAnnouncement, playAudioChime } from '../../utils/speech';

interface FarmerProcurementViewProps {
  records: ProcurementRecord[];
  language: LanguageCode;
  onNavigateToTab: (tab: string) => void;
}

export const FarmerProcurementView: React.FC<FarmerProcurementViewProps> = ({
  records,
  language,
  onNavigateToTab
}) => {
  const activeRecord = records[0];
  const t = getTranslations(language);

  const handleSpeakSummary = () => {
    if (!activeRecord) return;
    playAudioChime();
    const hi = `उपार्जन तौल पर्ची क्रमांक ${activeRecord.slipNumber}। फसल ${activeRecord.cropNameHi}। शुद्ध वजन ${activeRecord.netWeightQuintals} क्विंटल। नमी ${activeRecord.moisturePercentage}%। न्यूनतम समर्थन मूल्य ₹${activeRecord.mspPerQuintal} के अनुसार कुल देय राशि ₹${Math.round(activeRecord.totalGrossPayable).toLocaleString('en-IN')} है।`;
    const en = `Procurement weighment slip ${activeRecord.slipNumber} for ${activeRecord.cropName}. Net weight is ${activeRecord.netWeightQuintals} quintals with ${activeRecord.moisturePercentage}% moisture. Total gross payable at MSP is Rupees ${Math.round(activeRecord.totalGrossPayable).toLocaleString('en-IN')}.`;
    speakAnnouncement(language === 'hi' ? hi : en, language === 'hi' ? 'hi' : 'en');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2ECE6] dark:border-[#1D4334] pb-4 transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-[#063B2A] dark:text-[#F0FAF5]">
            {t.weighbridgeTitle}
          </h2>
          <p className="text-xs text-[#2C5343] dark:text-[#85AFA0] mt-0.5">
            {language === 'hi' ? 'मानक इलेक्ट्रॉनिक तौल कांटा (IS 9281) व गुणवत्ता सत्यापन रिकॉर्ड' : 'Electronic Weighbridge (IS 9281 Certified) & Quality Grading Record'}
          </p>
        </div>

        {activeRecord && (
          <button
            onClick={handleSpeakSummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DDF4E9] dark:bg-[#153A2C] hover:bg-[#168A5B] dark:hover:bg-[#22A872] hover:text-white text-[#063B2A] dark:text-[#6EE7B7] text-xs font-bold self-start sm:self-center transition-all active:scale-95 shadow-xs touch-target-48"
          >
            <Volume2 className="w-4 h-4 text-[#168A5B] dark:text-[#34D399]" />
            <span>{t.listenAudio}</span>
          </button>
        )}
      </div>

      {activeRecord ? (
        <div className="space-y-6">
          {/* Main Official Weighbridge Slip */}
          <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-[0_8px_30px_rgba(6,59,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-colors">
            {/* Top Slip Banner */}
            <div className="bg-[#063B2A] dark:bg-[#081B13] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0B5D3B] dark:border-[#153A2C]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DDF4E9]">
                    APMC Weighment Receipt (Form 6A)
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-display">
                  {language === 'hi' 
                    ? (activeRecord.centreNameHi || 'वर्धा एपीएमसी उपार्जन केंद्र') 
                    : (activeRecord.centreName || 'Wardha APMC Procurement Kendra')}
                </h3>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-white/70 block uppercase font-mono">{t.slipNumberLabel}</span>
                <span className="text-lg sm:text-xl font-mono font-bold text-amber-300">
                  {activeRecord.slipNumber}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Weight Measurements Grid (Gross, Tare, Net) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Gross Weight */}
                <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#E2ECE6] dark:border-[#1D4334] transition-colors">
                  <span className="text-[11px] font-bold text-[#57786B] dark:text-[#85AFA0] uppercase tracking-wide block">
                    {t.grossWeight}
                  </span>
                  <p className="text-2xl font-bold font-mono text-[#063B2A] dark:text-[#F0FAF5] mt-1">
                    {(activeRecord.grossWeightKg ?? Math.round(activeRecord.grossWeightQuintals * 100)).toLocaleString('en-IN')} <span className="text-xs font-normal text-[#57786B] dark:text-[#85AFA0]">kg</span>
                  </p>
                  <span className="text-[11px] text-[#57786B] dark:text-[#85AFA0] block mt-0.5">
                    Vehicle + Commodity
                  </span>
                </div>

                {/* Tare Weight */}
                <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#E2ECE6] dark:border-[#1D4334] transition-colors">
                  <span className="text-[11px] font-bold text-[#57786B] dark:text-[#85AFA0] uppercase tracking-wide block">
                    {t.tareWeight}
                  </span>
                  <p className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300 mt-1">
                    {(activeRecord.tareWeightKg ?? Math.round(activeRecord.tareWeightQuintals * 100)).toLocaleString('en-IN')} <span className="text-xs font-normal text-[#57786B] dark:text-[#85AFA0]">kg</span>
                  </p>
                  <span className="text-[11px] text-[#57786B] dark:text-[#85AFA0] block mt-0.5">
                    Empty Tractor/Trolley
                  </span>
                </div>

                {/* Net Weight (Dominant) */}
                <div className="p-4 rounded-xl bg-[#DDF4E9] dark:bg-[#153A2C] border-2 border-[#168A5B] dark:border-[#22A872] transition-colors">
                  <span className="text-[11px] font-bold text-[#063B2A] dark:text-[#F0FAF5] uppercase tracking-wide block">
                    {t.netWeight}
                  </span>
                  <p className="text-2xl font-bold font-mono text-[#063B2A] dark:text-[#F0FAF5] mt-1">
                    {activeRecord.netWeightQuintals} <span className="text-xs font-bold text-[#0B5D3B] dark:text-[#34D399]">Quintals</span>
                  </p>
                  <span className="text-[11px] text-[#0B5D3B] dark:text-[#34D399] font-bold block mt-0.5">
                    ({(activeRecord.netWeightKg ?? Math.round(activeRecord.netWeightQuintals * 100)).toLocaleString('en-IN')} kg net)
                  </span>
                </div>
              </div>

              {/* Quality & FAQ Analysis */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] space-y-3 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold text-[#063B2A] dark:text-[#F0FAF5] uppercase tracking-wider font-serif-display">
                    {language === 'hi' ? 'गुणवत्ता व नमी परीक्षण रिपोर्ट' : 'Quality & Moisture Assay Report'}
                  </h4>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#DDF4E9] dark:bg-[#153A2C] text-[#063B2A] dark:text-[#6EE7B7] border border-[#168A5B]/30">
                    Grade {activeRecord.qualityGrade} (FAQ Passed)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                  <div>
                    <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{t.cropLabel}</span>
                    <strong className="text-[#063B2A] dark:text-[#F0FAF5]">{language === 'hi' ? activeRecord.cropNameHi : activeRecord.cropName}</strong>
                  </div>
                  <div>
                    <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{t.moisturePercent}</span>
                    <strong className="text-[#063B2A] dark:text-[#F0FAF5] font-mono">{activeRecord.moisturePercentage}% (≤ 12% Max)</strong>
                  </div>
                  <div>
                    <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{t.foreignMatter}</span>
                    <strong className="text-[#063B2A] dark:text-[#F0FAF5] font-mono">{activeRecord.foreignMatterPercentage}% (Clean)</strong>
                  </div>
                  <div>
                    <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{t.mspRate}</span>
                    <strong className="text-[#063B2A] dark:text-[#F0FAF5] font-mono">₹{activeRecord.mspPerQuintal} / Qtl</strong>
                  </div>
                </div>
              </div>

              {/* Net Gross Calculation */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#DDF4E9]/80 via-white to-[#DDF4E9]/80 dark:from-[#153A2C] dark:via-[#0E241C] dark:to-[#153A2C] border border-[#168A5B]/40 dark:border-[#22A872]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                <div>
                  <span className="text-[11px] font-bold text-[#57786B] dark:text-[#85AFA0] uppercase tracking-wider block">
                    {t.totalPayable}
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#063B2A] dark:text-[#F0FAF5] mt-0.5">
                    ₹{Math.round(activeRecord.totalGrossPayable).toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-[#0B5D3B] dark:text-[#34D399] mt-0.5">
                    {language === 'hi' ? 'बिना किसी आढ़त या बिचौलिए की कटौती के सीधे बैंक खाते में देय' : 'Calculated at statutory MSP with zero intermediary deductions'}
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToTab('dbt')}
                  className="px-6 py-3 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] dark:bg-[#168A5B] dark:hover:bg-[#22A872] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 self-start sm:self-center touch-target-48"
                >
                  <span>{t.actionTrackPayment}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slip Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#57786B] dark:text-[#85AFA0] pt-2 border-t border-[#E2ECE6] dark:border-[#1D4334]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#168A5B] dark:text-[#22A872]" />
                  <span>Certified Digital Weigh Slip • APMC Mandi Inward</span>
                </div>
                <span className="font-mono text-[11px]">Terminal: WB-01 • Sensor SN: IS9281-2026-9812</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 sm:p-14 bg-white dark:bg-[#0E241C] rounded-2xl border border-[#E2ECE6] dark:border-[#1D4334] text-center space-y-4 shadow-sm transition-colors">
          <Scale className="w-12 h-12 text-[#57786B] dark:text-[#85AFA0] mx-auto" />
          <h4 className="text-base sm:text-lg font-bold text-[#063B2A] dark:text-[#F0FAF5] font-serif-display">
            {language === 'hi' ? 'कोई हालिया तौल रिकॉर्ड उपलब्ध नहीं' : 'No Weighment Record Yet'}
          </h4>
          <p className="text-xs sm:text-sm text-[#2C5343] dark:text-[#85AFA0] max-w-md mx-auto leading-relaxed">
            {language === 'hi' 
              ? 'जब आपका वाहन मंडी केंद्र पर पहुंचेगा और तौल कांटे पर वजन पूर्ण होगा, तब इलेक्ट्रॉनिक पर्ची यहां स्वतः उपलब्ध हो जाएगी।' 
              : 'Once your vehicle reports to the Mandi Kendra and completes electronic weighment, your official receipt will appear here automatically.'}
          </p>
        </div>
      )}
    </div>
  );
};
