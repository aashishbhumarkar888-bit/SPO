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
  CreditCard
} from 'lucide-react';
import { FarmerProfile, DbtTransaction, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/agriMockData';
import { IntegrationBadge } from '../common/IntegrationBadge';

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
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const totalCredited = transactions
    .filter(t => t.status === 'Credited')
    .reduce((acc, curr) => acc + curr.amountInr, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'Processing')
    .reduce((acc, curr) => acc + curr.amountInr, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-[#D7E3DC] pb-4">
        <h2 className="text-xl font-bold font-serif-display text-[#063B2A]">
          {t.dbtPayments}
        </h2>
        <p className="text-xs text-[#063B2A]/70 mt-0.5">
          {language === 'hi' 
            ? 'प्रत्यक्ष लाभ अंतरण (DBT) व सरकारी बैंक पासबुक' 
            : 'Direct Benefit Transfer (DBT) Aadhaar-linked passbook'}
        </p>
      </div>

      {/* Aadhaar-Linked Bank Card */}
      <div className="editorial-card rounded-3xl p-6 bg-gradient-to-br from-[#063B2A] to-[#0B5D3B] text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-[#DDF4E9]">
                NPCI Aadhaar Payment Bridge (APB)
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active for DBT</span>
              </span>
              <IntegrationBadge status="INTEGRATION-READY" spec="PFMS" featureName="DBT Passbook" featureId="AUD-06" />
            </div>

            <h3 className="text-lg font-bold">{farmer.bankName}</h3>
            <p className="font-mono-numbers text-xl tracking-widest text-amber-300 mt-1">
              {farmer.bankAccount}
            </p>
            <p className="text-xs text-white/70 mt-1">
              Account Holder: {farmer.fullName} • IFSC: {farmer.ifsc}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center sm:text-right">
            <span className="text-[11px] text-white/70 block">
              {language === 'hi' ? 'प्रक्रियाधीन राशि (Pending DBT):' : 'In-Transit / Processing:'}
            </span>
            <span className="text-2xl font-mono-numbers font-black text-amber-300 block mt-0.5">
              ₹{pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-emerald-300 mt-1 block">
              Expected in 24-48 hrs
            </span>
          </div>
        </div>
      </div>

      {/* DBT Transaction Ledger */}
      <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B2A]">
              {language === 'hi' ? 'हालिया सरकारी भुगतान लेनदेन' : 'Direct Credit Transaction History'}
            </h4>
            <IntegrationBadge status="INTEGRATION-READY" spec="PFMS Public API" />
          </div>
          <span className="text-xs text-[#063B2A]/60 font-mono">
            PFMS Verified
          </span>
        </div>

        <div className="space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="p-4 rounded-2xl bg-[#F6F9F7] border border-[#E4EBE6] hover:border-[#168A5B]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  txn.status === 'Credited'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#063B2A]">{txn.scheme}</h5>
                  <p className="text-xs text-[#063B2A]/70 mt-0.5">
                    {language === 'hi' ? txn.descriptionHi : txn.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#063B2A]/60 font-mono">
                    <span>UTR: {txn.utrNumber}</span>
                    <span>•</span>
                    <span>{txn.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="text-base font-bold font-mono-numbers text-[#0B5D3B] block">
                  +₹{txn.amountInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                  txn.status === 'Credited'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
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
