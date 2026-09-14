import React from 'react';
import { 
  PhoneCall, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Clock,
  ShieldAlert
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { getTranslations } from '../../i18n';

interface FarmerHelpSupportViewProps {
  language: LanguageCode;
  onOpenVoiceMitra: () => void;
}

export const FarmerHelpSupportView: React.FC<FarmerHelpSupportViewProps> = ({
  language,
  onOpenVoiceMitra
}) => {
  const t = getTranslations(language);

  const faqs = [
    {
      qEn: 'What happens if I arrive late past my allocated slot?',
      qHi: 'यदि मैं अपने आवंटित स्लॉट से देर से पहुंचता हूं तो क्या होगा?',
      aEn: 'The SPO dynamic allocation policy allows a 30-minute grace window. If exceeded, your token is moved to the dynamic overflow queue to ensure on-time farmers are not delayed, but your booking is not cancelled.',
      aHi: 'एस.पी.ओ नीति अनुसार 30 मिनट की छूट अवधि मिलती है। इसके बाद आपका टोकन डायनेमिक बफर कतार में स्वतः शामिल हो जाता है, स्लॉट रद्द नहीं होता।'
    },
    {
      qEn: 'What is the statutory moisture limit for Wheat/Soyabean MSP?',
      qHi: 'गेहूं व सोयाबीन के लिए सरकारी नमी की सीमा क्या है?',
      aEn: 'As per Ministry FAQ norms, maximum permissible moisture is 12.0%. Crops between 12-14% are subject to standard value deductions, while above 14% must be aerated in the Mandi drying yard.',
      aHi: 'सरकारी FAQ मानकों के अनुसार अधिकतम अनुमत नमी 12.0% है। 12 से 14% तक मानक कटौती होती है तथा 14% से अधिक होने पर सुखाने का निर्देश दिया जाता है।'
    },
    {
      qEn: 'How long does DBT take to credit to my bank account?',
      qHi: 'डीबीटी राशि बैंक खाते में पहुंचने में कितना समय लगता है?',
      aEn: 'Once the weighbridge supervisor signs the electronic slip (IS 9281), payment advice is pushed via PFMS to the NPCI Aadhaar Payment Bridge. Clearance typically completes within 24 to 48 banking hours.',
      aHi: 'इलेक्ट्रॉनिक तौल पर्ची जारी होने के बाद पीएफएमएस द्वारा आधार पेमेंट ब्रिज को सूचना भेजी जाती है। राशि 24 से 48 बैंकिंग घंटों में खाते में जमा हो जाती है।'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in w-full">
      <div className="border-b border-[#E4EBE6] pb-4">
        <h2 className="text-xl font-bold font-serif-display text-[#063B2A]">
          {language === 'hi' ? 'किसान सहायता एवं संपर्क केंद्र' : 'Kisan Help & Support Centre'}
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          {language === 'hi' 
            ? 'टोल-फ्री किसान कॉल सेंटर, मंडी गेट नियम व अक्सर पूछे जाने वाले प्रश्न' 
            : 'Toll-free Kisan helpline, Mandi yard rules & dispute resolution guidance'}
        </p>
      </div>

      {/* Primary Emergency Contact Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* National Kisan Call Centre */}
        <div className="bg-white rounded-2xl p-5 border border-[#D7E3DC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
              <PhoneCall className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-base text-[#063B2A]">
              {language === 'hi' ? 'राष्ट्रीय किसान कॉल सेंटर (टोल-फ्री)' : 'National Kisan Helpline (Toll-Free)'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {language === 'hi' ? '24x7 कृषि विशेषज्ञों व सहायता अधिकारियों से निःशुल्क बात करें' : 'Toll-free agricultural support available 24x7 in regional languages'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <a 
              href="tel:18001801551"
              className="w-full py-2.5 px-4 rounded-xl bg-[#063B2A] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>1800-180-1551 (Call Free)</span>
            </a>
          </div>
        </div>

        {/* Local Mandi Control Room */}
        <div className="bg-white rounded-2xl p-5 border border-[#D7E3DC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-[#168A5B]" />
            </div>
            <h3 className="font-bold text-base text-[#063B2A]">
              {language === 'hi' ? 'वर्धा उपार्जन केंद्र नियंत्रण कक्ष' : 'Wardha Kendra Control Room'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {language === 'hi' ? 'गेट इनवर्ड, तौल कांटा व भौतिक कतार सहायता कक्ष' : 'APMC yard gate inward, weighbridge assistance & dispute desk'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <a 
              href="tel:07152245100"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>07152-245100 (Mandi Desk)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Voice Assistant Support Callout */}
      <div className="bg-gradient-to-r from-[#DDF4E9] to-white rounded-2xl p-5 border border-[#168A5B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#063B2A] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-base text-[#063B2A]">
              {t.kisanMitraTitle}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {language === 'hi' 
                ? 'अपनी मातृभाषा में बोलकर स्लॉट, कतार व भुगतान की स्थिति जानें' 
                : 'Ask questions in your mother tongue regarding your appointment, queue, or payment'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVoiceMitra}
          className="px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span>{language === 'hi' ? 'आवाज सहायक प्रारंभ करें' : 'Open Voice Assistant'}</span>
        </button>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl p-5 border border-[#D7E3DC] shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B2A] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#168A5B]" />
          <span>{language === 'hi' ? 'महत्वपूर्ण नियम व समाधान' : 'Statutory Guidelines & FAQs'}</span>
        </h4>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#F6F9F7] border border-[#E4EBE6]">
              <h5 className="font-bold text-sm text-[#063B2A]">
                {language === 'hi' ? faq.qHi : faq.qEn}
              </h5>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {language === 'hi' ? faq.aHi : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
