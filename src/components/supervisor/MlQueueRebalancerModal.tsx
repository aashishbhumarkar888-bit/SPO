import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Scale, 
  Clock, 
  TrendingDown, 
  AlertCircle,
  Truck,
  Check
} from 'lucide-react';
import { AgriToken, LanguageCode } from '../../types';
import { playAudioChime } from '../../utils/speech';

interface MlQueueRebalancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  tokens: AgriToken[];
  onApplyReallocations: (updatedTokens: AgriToken[]) => void;
}

interface MlPredictionItem {
  id: string;
  tokenNumber: string;
  crop: string;
  weight: number;
  moisture: number;
  currentCounter: number;
  distance_km: number;
  predicted_transit_mins: number;
  predicted_service_time_mins: number;
  ml_engine: string;
  confidence_score: number;
}

interface MlReallocationItem {
  id: string;
  tokenNumber: string;
  originalCounter: number;
  recommendedCounter: number;
  reallocated: boolean;
  predictedDurationMins: number;
  predictedWaitMins: number;
  reason: string;
}

interface MlResponse {
  status: string;
  summary: {
    totalTokens: number;
    activeCounters: number;
    counterLoadsMins: { [key: string]: number };
    counterTokenCounts: { [key: string]: number };
    averageWaitTimeMins: number;
    loadVariance: number;
    reallocationsRecommended: number;
    engine: string;
  };
  predictions: MlPredictionItem[];
  reallocations: MlReallocationItem[];
}

export const MlQueueRebalancerModal: React.FC<MlQueueRebalancerModalProps> = ({
  isOpen,
  onClose,
  language,
  tokens,
  onApplyReallocations
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mlData, setMlData] = useState<MlResponse | null>(null);
  const [applied, setApplied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunPythonMl = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setApplied(false);

    try {
      // Map active tokens to python model input
      const payloadTokens = tokens.map((t, idx) => ({
        id: t.id,
        tokenNumber: t.tokenNumber,
        weight: t.serviceDetails?.estimatedQuintals || 60,
        crop: t.serviceDetails?.cropType || 'Soybean',
        moisture: 12.0 + (idx * 0.7),
        counter: t.counterAssigned || (idx % 4) + 1,
        distance_km: 12 + (idx * 3)
      }));

      const res = await fetch('/api/ml/reallocate-and-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: payloadTokens,
          counters: 4
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setMlData(data);
        playAudioChime();
      } else {
        setErrorMsg(data.message || 'ML Optimization failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with Python ML backend');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (!mlData) return;

    // Apply counter reallocations to original tokens
    const reallocationMap = new Map<string, number>();
    mlData.reallocations.forEach(r => {
      reallocationMap.set(r.id, r.recommendedCounter);
    });

    const updated = tokens.map(t => {
      const rec = reallocationMap.get(t.id);
      if (rec !== undefined && rec !== t.counterAssigned) {
        return {
          ...t,
          counterAssigned: rec,
          estimatedWaitMins: Math.max(5, (t.estimatedWaitMins || 20) - 8)
        };
      }
      return t;
    });

    playAudioChime();
    onApplyReallocations(updated);
    setApplied(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#0E241C] rounded-3xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] overflow-hidden my-auto text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#063B2A] to-[#0B5D3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Python 3.10 + Pandas + Scikit-Learn
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif-display">
                {language === 'hi' ? 'एआई कतार पुनर्वितरण व सेवा समय भविष्यवाणी' : 'AI Queue Rebalancing & Service Time Predictor'}
              </h3>
              <p className="text-xs text-emerald-200/90">
                {language === 'hi' ? 'धर्मकांटा लोड संतुलन एवं वास्तविक समय कतार निवारण' : 'RandomForestRegressor Dynamic Weighbridge Optimization'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Model Description Banner */}
          <div className="p-4 rounded-2xl bg-[#F0F5F2] dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#063B2A] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#168A5B]" />
                <span>{language === 'hi' ? 'मशीन लर्निंग मॉडल विनिर्देश' : 'Machine Learning Model Pipeline'}</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'Pandas द्वारा डेटा सफाई और Scikit-Learn द्वारा वजन, नमी, जिंस जटिलता एवं वाहन प्रकार के आधार पर धर्मकांटा समय का पूर्वानुमान व कतार संतुलन।'
                  : 'Features: Gross weight, moisture %, commodity handling factor, vehicle hydraulic speed. Target: Service duration & wait time minimization.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunPythonMl}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 flex-shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Cpu className="w-4 h-4 text-amber-300" />
              )}
              <span>{isLoading ? (language === 'hi' ? 'मॉडल चल रहा है...' : 'Running ML Model...') : (language === 'hi' ? 'एमएल मॉडल निष्पादित करें' : 'Execute Python ML Engine')}</span>
            </button>
          </div>

          {mlData && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{language === 'hi' ? 'सक्रिय वाहन' : 'Active Vehicles'}</span>
                  <div className="text-lg font-bold font-mono text-slate-800 dark:text-white">{mlData.summary.totalTokens}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{language === 'hi' ? 'औसत प्रतीक्षा समय' : 'Avg Wait Time'}</span>
                  <div className="text-lg font-bold font-mono text-[#0B5D3B] dark:text-emerald-400">{mlData.summary.averageWaitTimeMins} min</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{language === 'hi' ? 'लोड भिन्नता (Variance)' : 'Load Variance'}</span>
                  <div className="text-lg font-bold font-mono text-amber-600">{mlData.summary.loadVariance}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{language === 'hi' ? 'पुनर्आवंटित सिफारिशें' : 'Reallocations'}</span>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{mlData.summary.reallocationsRecommended}</div>
                </div>
              </div>

              {/* Counter Load Breakdown */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A] space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {language === 'hi' ? 'काउन्टर लोड पूर्वानुमान (मिनट)' : 'Predicted Counter Load (Minutes)'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(mlData.summary.counterLoadsMins).map(([ctr, load]) => (
                    <div key={ctr} className="p-2 rounded-lg bg-slate-50 dark:bg-[#0E241C] border border-slate-200 dark:border-[#2B5E4A]/50">
                      <span className="text-[10px] text-slate-500 block font-semibold">{ctr.replace('_', ' ')}</span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{load} mins</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reallocation Recommendations Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {language === 'hi' ? 'टोकन अनुसार भविष्यवाणियां व काउन्टर समायोजन' : 'Predicted Service Duration & Reallocation Table'}
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2B5E4A]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-[#143026] text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-[#2B5E4A]">
                      <tr>
                        <th className="p-2.5">Token</th>
                        <th className="p-2.5">Crop</th>
                        <th className="p-2.5">Weight</th>
                        <th className="p-2.5">Pred. Transit</th>
                        <th className="p-2.5">Pred. Service Time</th>
                        <th className="p-2.5">Original</th>
                        <th className="p-2.5">Recommended</th>
                        <th className="p-2.5">Optimization</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#2B5E4A]/50 font-medium">
                      {mlData.reallocations.map((item, idx) => {
                        const pred = mlData.predictions[idx];
                        return (
                          <tr key={item.id} className={item.reallocated ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                            <td className="p-2.5 font-bold font-mono text-slate-900 dark:text-white">{item.tokenNumber}</td>
                            <td className="p-2.5">{pred?.crop}</td>
                            <td className="p-2.5 font-mono">{pred?.weight} Qtl</td>
                            <td className="p-2.5 font-mono">{pred?.predicted_transit_mins} min</td>
                            <td className="p-2.5 font-mono text-[#0B5D3B] dark:text-emerald-400 font-bold">{item.predictedDurationMins} min</td>
                            <td className="p-2.5">Counter {item.originalCounter}</td>
                            <td className="p-2.5 font-bold">
                              {item.reallocated ? (
                                <span className="text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded font-mono">
                                  Counter {item.recommendedCounter}
                                </span>
                              ) : (
                                <span className="text-slate-600 dark:text-slate-400">Counter {item.recommendedCounter}</span>
                              )}
                            </td>
                            <td className="p-2.5 text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={item.reason}>
                              {item.reason}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#143026] border-t border-slate-200 dark:border-[#2B5E4A] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs font-semibold cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>

          {mlData && (
            <button
              type="button"
              disabled={applied}
              onClick={handleApplyChanges}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{language === 'hi' ? 'पुनर्आवंटन लागू हो चुका है' : 'Reallocations Applied!'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'hi' ? 'सिफारिशें लागू करें (Apply Reallocations)' : 'Apply ML Reallocations'}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
