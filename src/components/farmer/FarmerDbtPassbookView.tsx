import React from 'react';
import { 
  Banknote, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ArrowDownLeft, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  CreditCard, 
  Lock 
} from 'lucide-react';
import { FarmerProfile, DbtTransaction, LanguageCode } from '../../types';
import { getTranslations } from '../../i18n';

interface FarmerDbtPassbookViewProps {
  farmer: FarmerProfile;
  transactions: DbtTransaction[];
  language: LanguageCode;
}

export const FarmerDbtPassbookView: React.FC<FarmerDbtPassbookViewProps> = ({
  farmer,
  transactions,
  language
}) => {
  const t = getTranslations(language);

  const totalCredited = transactions
    .filter(t => t.status === 'Credited')
    .reduce((acc, curr) => acc + curr.amountInr, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'Processing')
    .reduce((acc, curr) => acc + curr.amountInr, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in w-full">
      <div className="border-b border-[#E2ECE6] dark:border-[#1D4334] pb-4 transition-colors">
        <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-[#063B2A] dark:text-[#F0FAF5]">
          {t.dbtTitle}
        </h2>
        <p className="text-xs text-[#2C5343] dark:text-[#85AFA0] mt-0.5">
          {language === 'hi' 
            ? 'प्रत्यक्ष लाभ अंतरण (DBT) व आधार पेमेंट ब्रिज बैंक पासबुक' 
            : 'Direct Benefit Transfer (DBT) Aadhaar-linked statutory passbook'}
        </p>
      </div>

      {/* Aadhaar-Linked Bank Card */}
      <div className="rounded-2xl p-6 bg-[#063B2A] dark:bg-[#081B13] text-white shadow-[0_8px_30px_rgba(6,59,42,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative overflow-hidden border border-[#0B5D3B] dark:border-[#153A2C] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-white/15 dark:bg-white/10 text-[#DDF4E9]">
                NPCI Aadhaar Payment Bridge (APBS)
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>e-KYC Linked</span>
              </span>
            </div>

            <h3 className="text-lg font-bold text-white font-serif-display">{farmer.bankName}</h3>
            <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-amber-300 mt-1">
              {farmer.bankAccount}
            </p>
            <p className="text-xs text-white/70 mt-1">
              Account Holder: {language === 'hi' ? farmer.fullNameHi : farmer.fullName} • IFSC: {farmer.ifsc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/15 text-center sm:text-right">
            <span className="text-xs text-white/70 block">
              {language === 'hi' ? 'प्रक्रियाधीन राशि (Pending DBT):' : 'In-Transit / Processing:'}
            </span>
            <span className="text-2xl font-mono font-bold text-amber-300 block mt-0.5">
              ₹{pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-emerald-300 mt-0.5 block">
              Expected in 24-48 hrs via RBI Clearing
            </span>
          </div>
        </div>
      </div>

      {/* DBT Transaction Ledger */}
      <div className="rounded-2xl bg-white dark:bg-[#0E241C] border border-[#E2ECE6] dark:border-[#1D4334] p-5 sm:p-6 space-y-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B2A] dark:text-[#F0FAF5] font-serif-display">
            {language === 'hi' ? 'हालिया सरकारी डीबीटी अंतरण' : 'Direct Credit Transaction History'}
          </h4>
          <span className="text-xs text-[#57786B] dark:text-[#85AFA0] font-mono">
            PFMS Verified Records
          </span>
        </div>

        <div className="space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] hover:border-[#168A5B] dark:hover:border-[#22A872] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  txn.status === 'Credited'
                    ? 'bg-emerald-100 dark:bg-[#153A2C] text-emerald-800 dark:text-[#6EE7B7]'
                    : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                }`}>
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#063B2A] dark:text-[#F0FAF5] font-serif-display">{txn.scheme}</h5>
                  <p className="text-xs text-[#2C5343] dark:text-[#85AFA0] mt-0.5">
                    {language === 'hi' ? txn.descriptionHi : txn.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#57786B] dark:text-[#85AFA0] font-mono">
                    <span>UTR: {txn.utrNumber}</span>
                    <span>•</span>
                    <span>{txn.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="text-base sm:text-lg font-bold font-mono text-[#0B5D3B] dark:text-[#34D399] block">
                  +₹{txn.amountInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                  txn.status === 'Credited'
                    ? 'bg-[#DDF4E9] dark:bg-[#153A2C] text-[#063B2A] dark:text-[#6EE7B7] border border-[#168A5B]/30'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                }`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
