import React from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Wheat, 
  Droplets, 
  FileCheck2, 
  Layers, 
  Download,
  CreditCard
} from 'lucide-react';
import { FarmerProfile, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/agriMockData';
import { IntegrationBadge } from '../common/IntegrationBadge';

interface FarmerProfileLandViewProps {
  farmer: FarmerProfile;
  language: LanguageCode;
}

export const FarmerProfileLandView: React.FC<FarmerProfileLandViewProps> = ({
  farmer,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const totalAcres = farmer.landParcels.reduce((sum, p) => sum + p.areaAcres, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-[#D7E3DC] pb-4">
        <h2 className="text-xl font-bold font-serif-display text-[#063B2A]">
          {t.profileLand}
        </h2>
        <p className="text-xs text-[#063B2A]/70 mt-0.5">
          {language === 'hi' 
            ? 'डिजिटल किसान पहचान पत्र व भूलेख (7/12 खसरा विवरण)' 
            : 'Digital Farmer Identity & Land Record (Bhulekh Khasra) Ledger'}
        </p>
      </div>

      {/* Kisan Card Identity */}
      <div className="editorial-card rounded-3xl p-6 bg-white border border-[#D7E3DC] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#168A5B] to-[#063B2A] text-white flex items-center justify-center font-serif-display text-2xl font-bold shadow-md ring-2 ring-emerald-500/20 flex-shrink-0">
            {farmer.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#063B2A]">
                {language === 'hi' ? farmer.fullNameHi : farmer.fullName}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified Kisan
              </span>
            </div>
            <p className="text-xs text-[#063B2A]/70 font-mono mt-0.5">
              ID: {farmer.kisanId} • Aadhaar: •••• •••• {farmer.aadhaarLast4}
            </p>
            <p className="text-xs text-[#063B2A]/70 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#168A5B]" />
              <span>{farmer.village}, Taluka Wardha, {farmer.state}</span>
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#DDF4E9]/60 border border-[#168A5B]/30 text-center sm:text-right">
          <span className="text-[11px] text-[#063B2A]/70 block font-medium">Total Registered Land</span>
          <span className="text-2xl font-mono-numbers font-bold text-[#0B5D3B]">
            {totalAcres} Acres
          </span>
          <span className="text-[10px] text-emerald-800 block mt-0.5 font-semibold">
            Kharif Season Active
          </span>
        </div>
      </div>

      {/* Linked Land Parcels (7/12 Khasra) */}
      <div className="editorial-card rounded-2xl bg-white border border-[#D7E3DC] p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B2A] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#168A5B]" />
              <span>{language === 'hi' ? 'भूलेख खसरा भूखंड विवरण' : 'Registered Land Parcels (Bhulekh 7/12)'}</span>
            </h4>
            <IntegrationBadge status="INTEGRATION-READY" spec="Mahabhulekh" featureName="Land Records (7/12)" featureId="AUD-07" />
          </div>
          <span className="text-xs text-[#063B2A]/60">
            State Revenue Dept RoR
          </span>
        </div>

        <div className="space-y-3">
          {farmer.landParcels.map((parcel) => (
            <div
              key={parcel.id}
              className="p-4 rounded-2xl bg-[#F6F9F7] border border-[#E4EBE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#063B2A] font-mono">
                    Khasra No: {parcel.khasraNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {parcel.cropSeason}
                  </span>
                </div>
                <p className="text-xs text-[#063B2A]/70 mt-1">
                  Primary Crop: <strong>{parcel.primaryCrop}</strong> • Area: <strong>{parcel.areaAcres} Acres</strong>
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#063B2A]/60">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>{parcel.irrigationSource}</span>
                  </span>
                  <span>•</span>
                  <span className="font-mono">SHC: {parcel.soilHealthCardId}</span>
                </div>
              </div>

              <div className="sm:self-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#168A5B] bg-[#DDF4E9] px-3 py-1 rounded-lg">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Verified Parcel</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
