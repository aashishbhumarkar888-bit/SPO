import React from 'react';
import { 
  Scale, 
  Droplets, 
  CheckCircle2, 
  FileText, 
  Banknote, 
  ArrowRight, 
  Volume2, 
  Sparkles, 
  Download, 
  ShieldCheck 
} from 'lucide-react';
import { ProcurementRecord, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/agriMockData';
import { speakAnnouncement } from '../../utils/speech';
import { IntegrationBadge } from '../common/IntegrationBadge';

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
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSpeakSummary = () => {
    if (!activeRecord) return;
    const hi = `उपार्जन पर्ची क्रमांक ${activeRecord.slipNumber}। फसल: ${activeRecord.cropNameHi}। कुल शुद्ध वजन ${activeRecord.netWeightQuintals} क्विंटल। नमी का स्तर ${activeRecord.moisturePercentage}% जो कि मानक ग्रेड ए के अनुकूल है। सरकारी समर्थन मूल्य ₹${activeRecord.mspPerQuintal} प्रति क्विंटल के अनुसार कुल देय राशि ₹${activeRecord.totalGrossPayable.toLocaleString('en-IN')} है।`;
    const en = `Procurement Slip ${activeRecord.slipNumber} for ${activeRecord.cropName}. Net weight is ${activeRecord.netWeightQuintals} quintals with ${activeRecord.moisturePercentage}% moisture. Total payable amount at MSP is Rupees ${activeRecord.totalGrossPayable.toLocaleString('en-IN')}.`;
    speakAnnouncement(language === 'hi' ? hi : en, language === 'hi' ? 'hi' : 'en');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D7E3DC] pb-4">
        <div>
          <h2 className="text-xl font-bold font-serif-display text-[#063B2A]">
            {t.procurementJourney}
          </h2>
          <p className="text-xs text-[#063B2A]/70 mt-0.5">
            {language === 'hi' ? 'पारदर्शी तौल कांटा, नमी जांच व डीबीटी भुगतान पर्ची' : 'Transparent weighbridge weight, moisture grading & DBT receipt'}
          </p>
        </div>

        <button
          onClick={handleSpeakSummary}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#168A5B]/10 hover:bg-[#168A5B]/20 text-[#0B5D3B] text-xs font-bold self-start sm:self-center transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4 text-[#168A5B]" />
          <span>{language === 'hi' ? 'पर्ची का ब्यौरा सुनें' : 'Listen to Slip Summary'}</span>
        </button>
      </div>

      {activeRecord && (
        <div className="editorial-card rounded-3xl border-2 border-[#168A5B] bg-white overflow-hidden shadow-xl">
          {/* Slip Header */}
          <div className="bg-[#063B2A] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-emerald-700/80 text-emerald-100 text-[10px] font-mono uppercase font-bold">
                  Official APMC Inward Slip
                </span>
                <span className="text-xs text-white/70">{activeRecord.timestamp}</span>
                <IntegrationBadge status="LIVE" spec="IS 9281" featureName="Net Tare Engine" featureId="AUD-02" />
              </div>
              <h3 className="text-xl font-mono-numbers font-bold text-amber-300 mt-1">
                {activeRecord.slipNumber}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-mono">
                {activeRecord.qualityGrade}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 4 Key Weight & Lab Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F6F9F7] border border-[#E4EBE6]">
                <span className="text-xs text-[#063B2A]/60 block font-medium">Gross Weight</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold font-mono-numbers text-[#063B2A]">
                    {activeRecord.grossWeightQuintals}
                  </span>
                  <span className="text-xs text-[#063B2A]/70">Qtl</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Loaded Trolley</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F9F7] border border-[#E4EBE6]">
                <span className="text-xs text-[#063B2A]/60 block font-medium">Tare Weight</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold font-mono-numbers text-[#D95353]">
                    -{activeRecord.tareWeightQuintals}
                  </span>
                  <span className="text-xs text-[#063B2A]/70">Qtl</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Empty Vehicle</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 block font-bold">Net Crop Weight</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono-numbers text-emerald-900">
                    {activeRecord.netWeightQuintals}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold">Qtl</span>
                </div>
                <span className="text-[10px] text-emerald-700 mt-0.5 block font-medium">Billable Crop Lot</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-xs text-blue-800 block font-bold">Moisture Sensor</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono-numbers text-blue-900">
                    {activeRecord.moisturePercentage}%
                  </span>
                </div>
                <span className="text-[10px] text-blue-700 mt-0.5 block font-medium">
                  FAQ &lt;12% Approved
                </span>
              </div>
            </div>

            {/* MSP Calculation Breakdown */}
            <div className="p-5 rounded-2xl bg-[#DDF4E9]/40 border border-[#168A5B]/30 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B5D3B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#168A5B]" />
                <span>{language === 'hi' ? 'समर्थन मूल्य गणना (MSP Breakdown)' : 'Official MSP Valuation Breakdown'}</span>
              </h4>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm border-b border-[#168A5B]/20 pb-3">
                <span className="text-[#063B2A]">
                  {language === 'hi' ? activeRecord.cropNameHi : activeRecord.cropName} ({activeRecord.qualityGrade})
                </span>
                <span className="font-mono text-[#063B2A] font-semibold">
                  {activeRecord.netWeightQuintals} Qtl × ₹{activeRecord.mspPerQuintal}/Qtl
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs text-[#063B2A]/70 block">
                    {language === 'hi' ? 'कुल देय सरकारी राशि:' : 'Total Gross Payout Payable:'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-mono-numbers font-black text-[#0B5D3B]">
                    ₹{activeRecord.totalGrossPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {activeRecord.dbtStatus}
                    </span>
                    <IntegrationBadge status="INTEGRATION-READY" spec="PFMS" featureName="DBT Advice" featureId="AUD-06" />
                  </div>
                  <span className="text-[11px] text-[#063B2A]/60 block mt-1 font-mono">
                    PFMS UTR: {activeRecord.utrNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => onNavigateToTab('dbt')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <Banknote className="w-4 h-4 text-amber-300" />
                <span>{language === 'hi' ? 'डीबीटी बैंक पासबुक देखें' : 'View DBT Bank Passbook'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] text-[#063B2A]/60 text-center sm:text-right">
                Certified by APMC Mandi Weighbridge Operator: <strong>Sunil Meshram</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
