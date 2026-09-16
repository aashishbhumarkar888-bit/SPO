import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  CreditCard, 
  FileText, 
  Download, 
  Eye, 
  Filter, 
  Sparkles, 
  Sprout, 
  Scale, 
  Building2, 
  Clock, 
  Check, 
  X,
  PhoneCall,
  Printer
} from 'lucide-react';
import { FarmerProfile, LanguageCode } from '../../types';
import { COMPREHENSIVE_SEED_FARMERS } from '../../services/firestoreDbService';
import { maskAadhaar } from '../../services/authService';
import { playAudioChime } from '../../utils/speech';

interface AdminFarmerRegistryTabProps {
  language: LanguageCode;
  userRole: 'supervisor' | 'superadmin';
}

export const AdminFarmerRegistryTab: React.FC<AdminFarmerRegistryTabProps> = ({
  language,
  userRole
}) => {
  const [farmersList, setFarmersList] = useState<FarmerProfile[]>(COMPREHENSIVE_SEED_FARMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({
    'FARM-8921': true,
    'FARM-10234': true,
    'FARM-10550': true,
    'FARM-10882': false
  });
  const [quotaApprovedMap, setQuotaApprovedMap] = useState<Record<string, boolean>>({
    'FARM-8921': true,
    'FARM-10234': true,
    'FARM-10550': false,
    'FARM-10882': false
  });
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Filtered farmers
  const filteredFarmers = farmersList.filter(f => {
    const matchesSearch = 
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.fullNameHi && f.fullNameHi.includes(searchQuery)) ||
      f.kisanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.includes(searchQuery) ||
      f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.aadhaarLast4 && f.aadhaarLast4.includes(searchQuery));
    
    const matchesVillage = selectedVillage === 'all' || f.village.toLowerCase().includes(selectedVillage.toLowerCase());
    return matchesSearch && matchesVillage;
  });

  const handleVerifyLandTitle = (farmerId: string) => {
    playAudioChime();
    setVerifiedMap(prev => ({ ...prev, [farmerId]: true }));
    setStatusFeedback(
      language === 'hi'
        ? `किसान ${farmerId} का 7/12 भू-अभिलेख डिजिटल रूप से सत्यापित हुआ!`
        : `7/12 Land Title record for ${farmerId} digitally verified against Mahabhulekh!`
    );
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleApproveQuota = (farmerId: string) => {
    playAudioChime();
    setQuotaApprovedMap(prev => ({ ...prev, [farmerId]: true }));
    setStatusFeedback(
      language === 'hi'
        ? `किसान ${farmerId} हेतु MSP उपार्जन कोटा (100 क्विंटल) स्वीकृत किया गया!`
        : `MSP Procurement Quota (100 Qtl) approved for ${farmerId}!`
    );
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleExportCsv = () => {
    playAudioChime();
    const csvHeader = 'KisanID,FullName,Phone,Village,District,LandAcres,AadhaarLast4,Bank,IFSC,KYCVerified\n';
    const csvRows = farmersList.map(f => 
      `"${f.kisanId}","${f.fullName}","${f.phone}","${f.village}","${f.district}","${f.totalLandAcres || 8.5}","${f.aadhaarLast4 || '9082'}","${f.bankName || 'SBI'}","${f.ifsc || 'SBIN0001842'}","${verifiedMap[f.id] ? 'YES' : 'PENDING'}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPO_Farmer_Registry_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Tab Header Banner */}
      <div className="bg-white dark:bg-[#0E241C] p-5 sm:p-6 rounded-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
              {userRole === 'superadmin' ? 'State Registry' : 'Kendra Registry'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'केवल अधिकृत अधिकारियों हेतु गोपनीय अभिलेख' : 'Confidential Records • Authorized Access Only'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-[#063B2A] dark:text-white tracking-tight">
            {language === 'hi' ? 'किसान पंजीयन, भू-अभिलेख व ई-केवाईसी डायरेक्टरी' : 'Farmer Registry, Land Records & e-KYC Directory'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {language === 'hi'
              ? 'मंडी क्षेत्र के समस्त पंजीकृत किसानों के 7/12 भू-अभिलेख, आधार ई-केवाईसी, प्रत्यक्ष बैंक डीबीटी विवरण व टोकन इतिहास।'
              : 'Official administrative repository of registered farmers, 7/12 land parcels, UIDAI e-KYC status, and DBT bank linkages.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#143026] hover:bg-slate-200 dark:hover:bg-[#1B4033] text-[#063B2A] dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-[#C7DCD1] dark:border-[#2B5E4A] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#168A5B]" />
            <span>{language === 'hi' ? 'CSV डाउनलोड' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {statusFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi' 
                ? 'किसान का नाम, किसान आईडी, मोबाइल नंबर, आधार (अंतिम 4 अंक) या गांव से खोजें...' 
                : 'Search by Farmer Name, Kisan ID, Mobile, Aadhaar last-4, or Village...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#168A5B]"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedVillage}
            onChange={e => setSelectedVillage(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#168A5B]"
          >
            <option value="all">{language === 'hi' ? 'समस्त गांव (All Villages)' : 'All Villages'}</option>
            <option value="Sevagram">Sevagram / Wardha Sector</option>
            <option value="Rampur">Rampur Sector</option>
            <option value="Seloo">Seloo Sector</option>
            <option value="Deoli">Deoli Sector</option>
          </select>
        </div>
      </div>

      {/* Farmers Data Table */}
      <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F7F5] dark:bg-[#143026] text-[#063B2A] dark:text-[#E2ECE6] border-b border-[#C7DCD1] dark:border-[#2B5E4A] font-bold">
                <th className="p-3.5">{language === 'hi' ? 'किसान आईडी व नाम' : 'Kisan ID & Farmer'}</th>
                <th className="p-3.5">{language === 'hi' ? 'संपर्क व आधार' : 'Contact & Aadhaar'}</th>
                <th className="p-3.5">{language === 'hi' ? 'गांव व भूमि (7/12)' : 'Village & Land Holding'}</th>
                <th className="p-3.5">{language === 'hi' ? 'डीबीटी बैंक खाता' : 'DBT Bank Account'}</th>
                <th className="p-3.5 text-center">{language === 'hi' ? 'ई-केवाईसी स्थिति' : 'e-KYC Status'}</th>
                <th className="p-3.5 text-right">{language === 'hi' ? 'विभागीय कार्रवाई' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2ECE6] dark:divide-[#2B5E4A]/60">
              {filteredFarmers.map(farmer => {
                const isLandVerified = verifiedMap[farmer.id] ?? true;
                const isQuotaApproved = quotaApprovedMap[farmer.id] ?? false;

                return (
                  <tr 
                    key={farmer.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#143026]/50 transition-colors"
                  >
                    {/* Farmer Name & Kisan ID */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#063B2A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                          {farmer.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {language === 'hi' && farmer.fullNameHi ? farmer.fullNameHi : farmer.fullName}
                          </div>
                          <div className="font-mono text-[11px] text-[#168A5B] dark:text-emerald-400 font-semibold">
                            {farmer.kisanId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Masked Aadhaar */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <div className="font-mono text-slate-800 dark:text-slate-200">
                          {farmer.phone}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          UID: {maskAadhaar(farmer.aadhaarLast4)}
                        </div>
                      </div>
                    </td>

                    {/* Village & Land */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{language === 'hi' && farmer.villageHi ? farmer.villageHi : farmer.village}, {farmer.district}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          7/12: {farmer.totalLandAcres || 8.5} Acres (Khasra 142/2A)
                        </div>
                      </div>
                    </td>

                    {/* Bank & DBT */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {farmer.bankName || 'State Bank of India'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {farmer.bankAccount || '•••• 4921'} • {farmer.ifsc || 'SBIN0001842'}
                        </div>
                      </div>
                    </td>

                    {/* KYC Status Badge */}
                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isLandVerified 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}>
                        {isLandVerified ? <Check className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{isLandVerified ? (language === 'hi' ? 'सत्यापित' : 'VERIFIED') : (language === 'hi' ? 'प्रतीक्षारत' : 'PENDING')}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer(farmer)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#143026] dark:hover:bg-[#1B4033] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title={language === 'hi' ? 'पूर्ण विवरण देखें' : 'View Full Dossier'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isLandVerified && (
                          <button
                            type="button"
                            onClick={() => handleVerifyLandTitle(farmer.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                          >
                            {language === 'hi' ? 'सत्यापित करें' : 'Verify 7/12'}
                          </button>
                        )}

                        {isLandVerified && !isQuotaApproved && (
                          <button
                            type="button"
                            onClick={() => handleApproveQuota(farmer.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                          >
                            {language === 'hi' ? 'कोटा स्वीकृत' : 'Approve Quota'}
                          </button>
                        )}

                        {isQuotaApproved && (
                          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            Quota: 100 Qtl
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Farmer Dossier Modal */}
      {selectedFarmer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white dark:bg-[#0E241C] rounded-2xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#063B2A] text-white p-5 flex items-center justify-between border-b border-[#0B5D3B]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#168A5B] flex items-center justify-center text-white font-bold">
                  <Sprout className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Official e-Samruddhi Kisan Dossier
                  </span>
                  <h3 className="text-base font-bold text-white font-serif-display">
                    {selectedFarmer.fullName} ({selectedFarmer.kisanId})
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Section 1: Official Identifiers */}
              <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] space-y-2">
                <h4 className="font-bold text-[#063B2A] dark:text-emerald-300 uppercase tracking-wider text-[10px]">
                  1. नागरिक एवं बायोमेट्रिक पहचान (UIDAI e-KYC)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Kisan ID</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">{selectedFarmer.kisanId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Aadhaar Card</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">{maskAadhaar(selectedFarmer.aadhaarLast4)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Mobile Number</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">{selectedFarmer.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Village / Taluka</span>
                    <strong className="text-slate-800 dark:text-slate-100">{selectedFarmer.village}, Wardha</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">PM-Kisan Linkage</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Active & Beneficiary</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">e-KYC Status</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Biometric Verified ✓</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Land Records (7/12 Mahabhulekh) */}
              <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] space-y-2">
                <h4 className="font-bold text-[#063B2A] dark:text-emerald-300 uppercase tracking-wider text-[10px]">
                  2. 7/12 भू-अभिलेख एवं फसल बुवाई (Mahabhulekh Sync)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Total Cultivated Area</span>
                    <strong className="text-slate-800 dark:text-slate-100">{selectedFarmer.totalLandAcres || 8.5} Acres</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Survey / Khasra No.</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">142/2A • Gat No. 89</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Sown Commodity</span>
                    <strong className="text-slate-800 dark:text-slate-100">Soyabean (Yellow) / Cotton</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Soil Health Card</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">SHC-MH-WRD-4892</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Irrigation Source</span>
                    <strong className="text-slate-800 dark:text-slate-100">Well & Drip Micro-irrigation</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">State MSP Entitlement</span>
                    <strong className="text-slate-800 dark:text-slate-100">Eligible (Up to 120 Qtl)</strong>
                  </div>
                </div>
              </div>

              {/* Section 3: DBT Bank Account */}
              <div className="p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] space-y-2">
                <h4 className="font-bold text-[#063B2A] dark:text-emerald-300 uppercase tracking-wider text-[10px]">
                  3. प्रत्यक्ष लाभ अंतरण (DBT) बैंक खाता विवरण
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Bank Name</span>
                    <strong className="text-slate-800 dark:text-slate-100">{selectedFarmer.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Account Number</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">{selectedFarmer.bankAccount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">IFSC Code</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">{selectedFarmer.ifsc}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">PFMS Mandate</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Valid & NPCI Mapped ✓</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Last MSP Credit</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-100">₹87,500 (Rabi Season)</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-[#143026] px-6 py-3.5 border-t border-[#C7DCD1] dark:border-[#2B5E4A] flex items-center justify-between">
              <a
                href={`tel:${selectedFarmer.phone.replace(/[^0-9+]/g, '')}`}
                className="px-3.5 py-2 rounded-xl border border-[#C7DCD1] dark:border-[#2B5E4A] text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 hover:bg-white dark:hover:bg-[#0E241C] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#168A5B]" />
                <span>{language === 'hi' ? 'किसान से संपर्क करें' : 'Call Farmer'}</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="px-4 py-2 rounded-xl bg-[#063B2A] text-white text-xs font-bold hover:bg-[#0B5D3B] transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'बंद करें' : 'Close Dossier'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
