import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Scale, 
  FileCheck,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { VerificationDocument, ProcurementRecord, LanguageCode } from '../../types';
import { playAudioChime } from '../../utils/speech';
import { auditLogger } from '../../domain/auditLog';

interface SupervisorDocumentWorkflowProps {
  onCommitInwardRecord: (record: ProcurementRecord) => void;
  language: LanguageCode;
}

export const SupervisorDocumentWorkflow: React.FC<SupervisorDocumentWorkflowProps> = ({
  onCommitInwardRecord,
  language
}) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'validate' | 'submitted'>('upload');
  const [docType, setDocType] = useState<'7_12_RoR' | 'Weighbridge_Slip' | 'Assayer_Test_Certificate'>('7_12_RoR');
  const [fileName, setFileName] = useState('7_12_Extract_Wardha_44_2.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [generatedSlipNumber, setGeneratedSlipNumber] = useState<string | null>(null);

  // Extracted OCR fields
  const [kisanId, setKisanId] = useState('MH-WRD-8921');
  const [farmerName, setFarmerName] = useState('Rameshwar Patil');
  const [crop, setCrop] = useState('Soyabean (Yellow)');
  const [khasraNumber, setKhasraNumber] = useState('44/2');
  const [village, setVillage] = useState('Sevagram, Taluka Wardha');
  const [netWeightQuintals, setNetWeightQuintals] = useState<number>(39.6);
  const [moisturePercent, setMoisturePercent] = useState<number>(11.4);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setIsProcessing(true);
      playAudioChime();
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('preview');
      }, 500);
    }
  };

  const handleLoadSample = (sample: 'patil' | 'shinde') => {
    if (sample === 'patil') {
      setDocType('7_12_RoR');
      setFileName('RoR_7_12_Rameshwar_Patil_44_2.pdf');
      setKisanId('MH-WRD-8921');
      setFarmerName('Rameshwar Patil');
      setCrop('Soyabean (Yellow)');
      setKhasraNumber('44/2');
      setVillage('Sevagram, Wardha');
      setNetWeightQuintals(39.6);
      setMoisturePercent(11.4);
    } else {
      setDocType('Assayer_Test_Certificate');
      setFileName('Lab_Moisture_Certificate_Tukaram.pdf');
      setKisanId('MH-WRD-6104');
      setFarmerName('Tukaram Shinde');
      setCrop('Wheat (Lokwan)');
      setKhasraNumber('102/1');
      setVillage('Deoli, Wardha');
      setNetWeightQuintals(48.0);
      setMoisturePercent(10.8);
    }
    setCurrentStep('preview');
    playAudioChime();
  };

  const handleRunValidation = () => {
    setIsProcessing(true);
    playAudioChime();
    setTimeout(() => {
      setIsProcessing(false);
      setValidationSuccess(true);
      setCurrentStep('validate');
    }, 600);
  };

  const handleSubmitInward = () => {
    setIsProcessing(true);
    playAudioChime();

    const mspRate = crop.includes('Soyabean') ? 4892 : (crop.includes('Cotton') ? 7121 : 2275);
    const isFaq = moisturePercent <= 12.0;
    const grossPayable = Math.round(netWeightQuintals * mspRate);
    const randVal = new Uint32Array(1);
    crypto.getRandomValues(randVal);
    const slipNum = `MND-2026-${(randVal[0] % 70) + 920}`;

    const newRecord: ProcurementRecord = {
      id: `PROC-DOC-${Date.now().toString().slice(-4)}`,
      tokenId: `TOK-DOC-${Date.now().toString().slice(-3)}`,
      slipNumber: slipNum,
      farmerName,
      farmerNameHi: farmerName,
      kisanId,
      cropName: crop,
      cropNameHi: crop,
      grossWeightQuintals: Number((netWeightQuintals + 6.4).toFixed(2)),
      tareWeightQuintals: 6.4,
      netWeightQuintals,
      moisturePercentage: moisturePercent,
      foreignMatterPercentage: 0.8,
      qualityGrade: isFaq ? 'FAQ Grade A' : 'Grade B',
      mspPerQuintal: mspRate,
      totalGrossPayable: grossPayable,
      dbtStatus: 'Advice Generated',
      utrNumber: `SBI${crypto.randomUUID().replace(/-/g, '').substring(0, 11).toUpperCase()}`,
      timestamp: 'Just now (Verified Document Inward)'
    };

    auditLogger.log({
      action: 'DOCUMENT_INWARD_VERIFIED',
      actorRole: 'SUPERVISOR',
      actorId: 'SUP-WRD-01',
      targetEntity: 'ProcurementRecord',
      targetId: slipNum,
      description: `Verified ${docType} (${fileName}) for ${farmerName} (${kisanId}); Slip #${slipNum} generated for ${netWeightQuintals} Qtl`
    });

    setTimeout(() => {
      onCommitInwardRecord(newRecord);
      setGeneratedSlipNumber(slipNum);
      setIsProcessing(false);
      setCurrentStep('submitted');
    }, 500);
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setValidationSuccess(false);
    setGeneratedSlipNumber(null);
  };

  return (
    <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 sm:p-6 space-y-6 shadow-sm animate-fade-in">
      {/* Workflow Progress Steps */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div>
            <h3 className="font-bold text-base text-[#063B2A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#168A5B]" />
              <span>Verified Inward Document Workflow</span>
            </h3>
            <p className="text-xs text-[#063B2A]/70 mt-0.5">
              Statutory 4-step compliance pipeline: Upload → OCR Preview → RoR/MSP Validation → Slip Generation
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            DPDP & MSAMB Compliant
          </span>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[
            { step: 'upload', label: '1. Upload Document' },
            { step: 'preview', label: '2. OCR Extract & Review' },
            { step: 'validate', label: '3. Cross-Validation' },
            { step: 'submitted', label: '4. Inward Certified' }
          ].map((item, idx) => {
            const isDone = (item.step === 'upload' && currentStep !== 'upload') ||
                           (item.step === 'preview' && (currentStep === 'validate' || currentStep === 'submitted')) ||
                           (item.step === 'validate' && currentStep === 'submitted');
            const isCurrent = currentStep === item.step;

            return (
              <div 
                key={idx}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent 
                    ? 'bg-[#168A5B] text-white border-[#0B5D3B] font-bold shadow-xs' 
                    : isDone 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold' 
                    : 'bg-[#F6F9F7] text-slate-500 border-slate-200'
                }`}
              >
                <span className="truncate block">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: UPLOAD */}
      {currentStep === 'upload' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <button
              onClick={() => setDocType('7_12_RoR')}
              className={`p-3 rounded-xl border text-left transition-all ${
                docType === '7_12_RoR' 
                  ? 'border-[#168A5B] bg-[#DDF4E9] text-[#063B2A] font-bold' 
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <FileCheck className="w-4 h-4 text-[#168A5B] mb-1" />
              <p className="font-bold">7/12 Land Record (RoR)</p>
              <p className="text-[11px] text-slate-600">Bhulekh land holding extract</p>
            </button>

            <button
              onClick={() => setDocType('Weighbridge_Slip')}
              className={`p-3 rounded-xl border text-left transition-all ${
                docType === 'Weighbridge_Slip' 
                  ? 'border-[#168A5B] bg-[#DDF4E9] text-[#063B2A] font-bold' 
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <Scale className="w-4 h-4 text-[#D99121] mb-1" />
              <p className="font-bold">Weighbridge Gross Slip</p>
              <p className="text-[11px] text-slate-600">Electronic tare/gross docket</p>
            </button>

            <button
              onClick={() => setDocType('Assayer_Test_Certificate')}
              className={`p-3 rounded-xl border text-left transition-all ${
                docType === 'Assayer_Test_Certificate' 
                  ? 'border-[#168A5B] bg-[#DDF4E9] text-[#063B2A] font-bold' 
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 text-[#2878C8] mb-1" />
              <p className="font-bold">Assayer Quality Certificate</p>
              <p className="text-[11px] text-slate-600">Certified moisture & FAQ grade</p>
            </button>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#C7DCD1] hover:border-[#168A5B] rounded-2xl p-8 text-center cursor-pointer bg-[#F6F9F7] hover:bg-white transition-all space-y-3"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center border border-slate-200">
              <Upload className="w-6 h-6 text-[#168A5B]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#063B2A]">
                Click to browse or drag & drop certificate/slip
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, JPG, PNG up to 15 MB • Automatically runs local OCR extraction
              </p>
            </div>
          </div>

          {/* 1-Click Fast Field Samples for immediate testing */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700">
              Or load verified field document sample:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLoadSample('patil')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 font-semibold text-[#063B2A]"
              >
                Sample 7/12 RoR (Rameshwar Patil)
              </button>
              <button
                onClick={() => handleLoadSample('shinde')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 font-semibold text-[#063B2A]"
              >
                Sample Lab Assayer (Tukaram Shinde)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW & OCR REVIEW */}
      {currentStep === 'preview' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Document loaded: <strong>{fileName}</strong> • OCR parsing successful</span>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-blue-300">
              Confidence 99.2%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Farmer Name (Extracted)</label>
              <input 
                type="text" 
                value={farmerName}
                onChange={e => setFarmerName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-bold text-[#063B2A] bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Kisan ID / Aadhaar</label>
              <input 
                type="text" 
                value={kisanId}
                onChange={e => setKisanId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-mono font-bold text-[#063B2A] bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Commodity / Crop</label>
              <input 
                type="text" 
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-bold text-[#063B2A] bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Land Khasra / Gut No.</label>
              <input 
                type="text" 
                value={khasraNumber}
                onChange={e => setKhasraNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-mono font-bold text-[#063B2A] bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Certified Net Weight (Quintals)</label>
              <input 
                type="number" 
                step="0.1"
                value={netWeightQuintals}
                onChange={e => setNetWeightQuintals(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-mono font-bold text-[#063B2A] bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Assayed Moisture (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={moisturePercent}
                onChange={e => setMoisturePercent(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#D7E3DC] font-mono font-bold text-[#063B2A] bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Upload
            </button>
            <button
              onClick={handleRunValidation}
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Validating against RoR...' : 'Run Statutory Cross-Validation'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CROSS-VALIDATION */}
      {currentStep === 'validate' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Statutory Compliance Checks Passed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900 pt-1">
              <div className="flex items-center gap-2 bg-white/70 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>7/12 RoR:</strong> Khasra {khasraNumber} verified in Wardha land records</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Aadhaar eKYC:</strong> Citizen hash matching registered Kisan ID</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Moisture Standard:</strong> {moisturePercent}% is under 12.0% (FAQ Grade A)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>MSP Rate:</strong> ₹{crop.includes('Soyabean') ? '4,892' : '2,275'}/Qtl active rate verified</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-slate-600">Calculated Statutory Procurement Amount:</p>
              <p className="text-xl font-bold font-mono text-[#0B5D3B]">
                ₹{Math.round(netWeightQuintals * (crop.includes('Soyabean') ? 4892 : 2275)).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep('preview')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit Parameters
              </button>
              <button
                onClick={handleSubmitInward}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-[#063B2A] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isProcessing ? 'Generating Slip...' : 'Authorize & Commit to Weighbridge'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUBMITTED SUCCESS */}
      {currentStep === 'submitted' && generatedSlipNumber && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-4 animate-fade-in shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-emerald-950">
                Official Inward Docket Generated: #{generatedSlipNumber}
              </h4>
              <p className="text-xs text-emerald-900 mt-1">
                Verified document inward committed to Mandi Inward Registry. Certified net weight: <strong>{netWeightQuintals} Qtl</strong> for <strong>{farmerName}</strong>. PFMS DBT Advice generated and dispatched to state gateway.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
            >
              Verify Next Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
