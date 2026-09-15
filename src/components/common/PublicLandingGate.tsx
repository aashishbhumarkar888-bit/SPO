import React from 'react';
import { 
  ShieldCheck, 
  Sprout, 
  Lock, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { getTranslations } from '../../i18n';

interface PublicLandingGateProps {
  language: LanguageCode;
  onOpenFarmerLogin: () => void;
  onOpenSupervisorLogin: () => void;
  onOpenSuperAdminLogin: () => void;
  onOpenDemoDrawer: () => void;
}

export const PublicLandingGate: React.FC<PublicLandingGateProps> = ({
  language,
  onOpenFarmerLogin,
  onOpenSupervisorLogin,
  onOpenSuperAdminLogin,
  onOpenDemoDrawer
}) => {
  const t = getTranslations(language);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Official State / National Portal Crest */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] text-[#0B5D3B] dark:text-[#6EE7B7] text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#168A5B]" />
          <span>{t.landingPortalTag}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif-display text-[#083324] dark:text-[#F0FAF5] tracking-tight">
          {t.landingMainTitle}
        </h1>

        <p className="text-sm sm:text-base text-[#4A6E5E] dark:text-[#85AFA0] leading-relaxed">
          {t.landingSubtitle}
        </p>
      </div>

      {/* Role Selection Gate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {/* Role 1: Kisan / Farmer Portal (Green Accent) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] flex items-center justify-center text-[#0B5D3B] dark:text-[#6EE7B7]">
              <Sprout className="w-6 h-6 text-[#168A5B]" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#168A5B] dark:text-[#34D399]">
                {t.roleFarmerCitizenService}
              </span>
              <h2 className="text-lg font-bold text-[#083324] dark:text-[#F0FAF5] mt-0.5">
                {t.roleFarmerTitle}
              </h2>
            </div>

            <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] leading-relaxed">
              {t.roleFarmerDesc}
            </p>

            <ul className="text-xs text-[#1F4A38] dark:text-[#BBDCD0] space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#168A5B] flex-shrink-0" />
                <span>{t.roleFarmerB1}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#168A5B] flex-shrink-0" />
                <span>{t.roleFarmerB2}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#168A5B] flex-shrink-0" />
                <span>{t.roleFarmerB3}</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onOpenFarmerLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#168A5B] hover:bg-[#12734C] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{t.roleFarmerBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Role 2: Mandi Supervisor Terminal (Blue Accent) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 border border-[#BFDBFE] dark:border-blue-800 flex items-center justify-center text-[#1D68BD] dark:text-blue-300">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D68BD] dark:text-blue-400">
                {t.roleSupervisorService}
              </span>
              <h2 className="text-lg font-bold text-[#083324] dark:text-[#F0FAF5] mt-0.5">
                {t.roleSupervisorTitle}
              </h2>
            </div>

            <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] leading-relaxed">
              {t.roleSupervisorDesc}
            </p>

            <ul className="text-xs text-[#1F4A38] dark:text-[#BBDCD0] space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1D68BD] flex-shrink-0" />
                <span>{t.roleSupervisorB1}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1D68BD] flex-shrink-0" />
                <span>{t.roleSupervisorB2}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1D68BD] flex-shrink-0" />
                <span>{t.roleSupervisorB3}</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onOpenSupervisorLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1D68BD] hover:bg-[#165096] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t.roleSupervisorBtn}</span>
          </button>
        </div>

        {/* Role 3: State Super Admin / Policy Authority (Yellow & Deep Green Accent) */}
        <div className="bg-white dark:bg-[#0E241C] rounded-2xl border border-[#DCE7E1] dark:border-[#1D4334] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FEFCE8] dark:bg-yellow-950/40 border border-[#FDE047] dark:border-yellow-700 flex items-center justify-center text-[#854D0E] dark:text-yellow-300">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#854D0E] dark:text-yellow-400">
                {t.roleAdminService}
              </span>
              <h2 className="text-lg font-bold text-[#083324] dark:text-[#F0FAF5] mt-0.5">
                {t.roleAdminTitle}
              </h2>
            </div>

            <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] leading-relaxed">
              {t.roleAdminDesc}
            </p>

            <ul className="text-xs text-[#1F4A38] dark:text-[#BBDCD0] space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#854D0E] dark:text-yellow-400 flex-shrink-0" />
                <span>{t.roleAdminB1}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#854D0E] dark:text-yellow-400 flex-shrink-0" />
                <span>{t.roleAdminB2}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#854D0E] dark:text-yellow-400 flex-shrink-0" />
                <span>{t.roleAdminB3}</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onOpenSuperAdminLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#063B2A] hover:bg-[#0B5D3B] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.roleAdminBtn}</span>
          </button>
        </div>
      </div>

      {/* Evaluator / Jury Quick Access Bar */}
      <div className="w-full p-4 rounded-2xl bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] dark:border-[#2B5E4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#168A5B] flex-shrink-0" />
          <span className="text-[#083324] dark:text-[#F0FAF5] font-medium">
            <strong>{t.sihModeBadge}:</strong>{' '}
            {t.sihModeDesc}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenDemoDrawer}
          className="px-4 py-1.5 rounded-lg bg-white dark:bg-[#0E241C] text-[#0B5D3B] dark:text-[#6EE7B7] border border-[#98BFA9] hover:bg-[#F4F7F5] dark:hover:bg-[#143026] font-bold text-xs self-start sm:self-center transition-colors flex-shrink-0"
        >
          {t.demoDrawerBtn}
        </button>
      </div>
    </div>
  );
};
