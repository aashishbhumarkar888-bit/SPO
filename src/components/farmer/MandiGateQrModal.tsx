import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  QrCode, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Truck, 
  User, 
  Scale, 
  Sparkles,
  Volume2
} from 'lucide-react';
import QRCode from 'qrcode';
import { AgriToken, FarmerProfile, LanguageCode } from '../../types';
import { playAudioChime, speakAnnouncement } from '../../utils/speech';

interface MandiGateQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: AgriToken;
  farmer: FarmerProfile;
  language: LanguageCode;
}

export const MandiGateQrModal: React.FC<MandiGateQrModalProps> = ({
  isOpen,
  onClose,
  token,
  farmer,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  // Structured QR pass payload
  const qrPayload = JSON.stringify({
    system: 'SPO-AGRISEVA',
    type: 'MANDI_GATE_INWARD_PASS',
    tokenId: token.id,
    tokenNumber: token.tokenNumber,
    kisanId: farmer.kisanId,
    farmerName: farmer.fullName,
    commodity: token.serviceDetails?.cropName || 'Soyabean',
    slotTime: token.scheduledTime,
    counterAssigned: token.counterAssigned,
    gateLane: 'Gate Inward #1 (Fast-Track ANPR)',
    vehicleNumber: token.vehicleNumber || 'MH-31-AG-4921',
    validDate: new Date().toISOString().split('T')[0],
    securityHash: `SIG-${token.tokenNumber}-${farmer.kisanId.replace(/[^0-9]/g, '')}`
  });

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qrPayload,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#063B2A',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        },
        (error) => {
          if (!error) {
            setQrGenerated(true);
          } else {
            console.error('Error generating QR code', error);
          }
        }
      );
    }
  }, [isOpen, qrPayload]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(token.tokenNumber);
    setCopied(true);
    playAudioChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    playAudioChime();
    window.print();
  };

  const handleAudioPass = () => {
    playAudioChime();
    const hi = `मंडी गेट ई-पास। टोकन संख्या ${token.tokenNumber}, किसान श्री ${farmer.fullNameHi || farmer.fullName}। गेट नंबर 1 पर यह क्यूआर कोड स्कैन कराएं।`;
    const en = `Mandi Gate E-Pass. Token number ${token.tokenNumber}, Farmer ${farmer.fullName}. Present this QR pass at Mandi Gate 1 for priority entry.`;
    speakAnnouncement(language === 'hi' ? hi : en, language === 'hi' ? 'hi' : 'en');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-pass-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#0E241C] rounded-2xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] overflow-hidden my-auto transition-colors">
        
        {/* Pass Header Banner */}
        <div className="bg-[#063B2A] text-white p-5 flex items-center justify-between border-b border-[#0B5D3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#168A5B] flex items-center justify-center text-white shadow-xs">
              <QrCode className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {language === 'hi' ? 'आधिकारिक गेट ई-पास' : 'Official Mandi Gate E-Pass'}
                </span>
              </div>
              <h3 id="qr-pass-title" className="text-base font-bold text-white tracking-tight font-serif-display mt-0.5">
                {language === 'hi' ? 'मंडी प्रवेश द्वार क्यूआर पास' : 'Gate Inward Fast-Track QR'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close pass"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pass Body Content */}
        <div className="p-5 sm:p-6 space-y-4 text-center">
          
          {/* Mandi Name & Token Badge */}
          <div className="space-y-1">
            <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0] font-medium flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#168A5B]" />
              <span>Wardha Central APMC Mandi Yard • Gate Inward #1</span>
            </p>
            <div className="inline-block px-4 py-1 rounded-full bg-[#E7F7EF] dark:bg-[#153A2C] border border-[#98BFA9] dark:border-[#2B5E4A]">
              <span className="text-xs text-[#063B2A] dark:text-emerald-300 font-bold uppercase tracking-wide">
                {language === 'hi' ? 'टोकन संख्या' : 'Active Token'}:{' '}
                <strong className="text-lg font-mono text-[#0B5D3B] dark:text-emerald-400">
                  #{token.tokenNumber}
                </strong>
              </span>
            </div>
          </div>

          {/* Scannable QR Code Canvas Box */}
          <div className="relative mx-auto w-[240px] p-3 rounded-2xl bg-white border-2 border-[#168A5B] shadow-inner flex flex-col items-center justify-center">
            {/* Corner styling accents */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#168A5B]"></div>
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#168A5B]"></div>
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#168A5B]"></div>
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#168A5B]"></div>

            <canvas 
              ref={canvasRef} 
              className="rounded-lg max-w-full h-auto"
              aria-label={`Scannable QR code for token ${token.tokenNumber}`}
            />

            <div className="mt-1 text-[10px] font-mono text-slate-500 font-semibold tracking-wider">
              AUTH: SPO-WHD-{token.tokenNumber}-{farmer.kisanId}
            </div>
          </div>

          {/* Gate Scanning Instructions */}
          <div className="p-3 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-[#063B2A] dark:text-white font-bold border-b border-[#C7DCD1]/60 dark:border-[#2B5E4A]/60 pb-1.5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#168A5B]" />
                <span>{language === 'hi' ? 'गेट सत्यापन विवरण' : 'Gate Verification Details'}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                VALID TODAY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{language === 'hi' ? 'किसान का नाम' : 'Farmer'}</span>
                <strong className="text-slate-800 dark:text-slate-100">{farmer.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{language === 'hi' ? 'किसान आईडी' : 'Kisan ID'}</span>
                <strong className="text-slate-800 dark:text-slate-100 font-mono">{farmer.kisanId}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{language === 'hi' ? 'उपज व वजन' : 'Commodity'}</span>
                <strong className="text-slate-800 dark:text-slate-100">
                  {token.serviceDetails?.cropName || 'Soyabean'} ({token.serviceDetails?.quantityQuintals || '45'} Qtl)
                </strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{language === 'hi' ? 'आबंटित काउंटर' : 'Assigned Counter'}</span>
                <strong className="text-slate-800 dark:text-slate-100 font-mono">Counter #{token.counterAssigned}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{language === 'hi' ? 'स्लॉट समय' : 'Slot Time'}</span>
                <strong className="text-slate-800 dark:text-slate-100 font-mono">{token.scheduledTime}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{language === 'hi' ? 'पंजीकृत वाहन' : 'Vehicle'}</span>
                <strong className="text-slate-800 dark:text-slate-100 font-mono">{token.vehicleNumber || 'MH-31-AG-4921'}</strong>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0] leading-tight">
            {language === 'hi'
              ? 'मंडी प्रवेश द्वार पर यह क्यूआर कोड स्वचालित स्कैनर अथवा सुरक्षा गार्ड को दिखाएं। गेट बूम बैरियर तुरंत खुल जाएगा।'
              : 'Present this digital QR pass at the Mandi Inward boom barrier scanner for instant ANPR logging and priority gate entry.'}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyCode}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A3C2F] dark:hover:bg-[#23503F] text-[#063B2A] dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'टोकन कॉपी' : 'Copy ID')}</span>
            </button>

            <button
              type="button"
              onClick={handleAudioPass}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A3C2F] dark:hover:bg-[#23503F] text-[#063B2A] dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Speak announcement"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#168A5B]" />
              <span>{language === 'hi' ? 'ऑडियो' : 'Audio'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
