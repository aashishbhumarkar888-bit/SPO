import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Clock,
  Wheat,
  RotateCcw
} from 'lucide-react';
import { LanguageCode, AgriToken, FarmerProfile, ProcurementRecord, DbtTransaction } from '../../types';
import { speakAnnouncement, stopSpeech } from '../../utils/speech';
import { IntegrationBadge } from '../common/IntegrationBadge';
import { AssistantContextService } from '../../services/assistantContext';
import { CURRENT_FARMER } from '../../data/agriMockData';

interface KisanMitraVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  activeToken?: AgriToken;
  farmer?: FarmerProfile;
  recentProcurement?: ProcurementRecord;
  recentDbt?: DbtTransaction;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mitra';
  text: string;
  timestamp: string;
  hasAudio?: boolean;
}

export const KisanMitraVoiceModal: React.FC<KisanMitraVoiceModalProps> = ({
  isOpen,
  onClose,
  language,
  activeToken,
  farmer,
  recentProcurement,
  recentDbt
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: '1',
        sender: 'mitra',
        text: language === 'hi' 
          ? 'राम-राम किसान भाई! मैं आपका किसान मित्र (Kisan Mitra) हूँ। आप बोलकर या लिखकर पूछ सकते हैं — जैसे टोकन स्थिति, मंडी भाव, या ट्रैक्टर बुकिंग।'
          : 'Namaste Farmer Friend! I am your Kisan Mitra AI Assistant. You can speak or type to ask about your live token, mandi MSP rates, or machinery booking.',
        timestamp: 'Just now',
        hasAudio: true
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickQuestions = language === 'hi' ? [
    { label: '🎫 मेरा टोकन कहां पहुंचा?', query: 'मेरा टोकन नंबर क्या है और मेरा नंबर कब आएगा?' },
    { label: '🌾 आज का सोयाबीन MSP भाव', query: 'आज मंडी में सोयाबीन और कपास का क्या भाव है?' },
    { label: '🚜 ट्रैक्टर या ड्रोन कैसे बुक करें?', query: 'मुझे खेत की जुताई के लिए ट्रैक्टर बुक करना है।' },
    { label: '💳 डीबीटी सब्सिडी का पैसा कब मिलेगा?', query: 'मंडी में बेची गई फसल का डीबीटी भुगतान कब तक बैंक में जमा होगा?' }
  ] : [
    { label: '🎫 Where is my token?', query: 'What is my token number and when is my turn?' },
    { label: '🌾 Today\'s Soyabean MSP Rate', query: 'What are today\'s MSP rates for Soyabean and Cotton?' },
    { label: '🚜 How to hire a tractor/drone?', query: 'How do I book a tractor or drone for field spraying?' },
    { label: '💳 When will my DBT payout arrive?', query: 'When will my crop procurement payment be credited via DBT?' }
  ];

  const handleSendQuery = (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuery,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Grounded answer logic via AssistantContextService
    setTimeout(() => {
      const activeFarmer = farmer || CURRENT_FARMER;
      const result = AssistantContextService.generateResponse(userQuery, {
        farmer: activeFarmer,
        activeToken,
        recentProcurement,
        recentDbt,
        language
      });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mitra',
        text: result.text,
        timestamp: 'Just now',
        hasAudio: true
      };

      setMessages(prev => [...prev, botMsg]);

      // Auto-speak response in chosen language
      setIsSpeaking(true);
      speakAnnouncement(result.text, language === 'hi' ? 'hi' : 'en').then(() => {
        setIsSpeaking(false);
      });
    }, 450);
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check speech recognition
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: prompt user with sample voice text
      const demoVoiceQuery = language === 'hi' ? 'मेरा टोकन किस काउंटर पर है?' : 'Where is my token and what is my wait time?';
      handleSendQuery(demoVoiceQuery);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakAnnouncement(text, language === 'hi' ? 'hi' : 'en').then(() => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#063B2A]/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#D7E3DC] flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#063B2A] via-[#0B5D3B] to-[#168A5B] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-emerald-400/40">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base tracking-wide">
                  {language === 'hi' ? 'किसान मित्र (Kisan Mitra)' : 'Kisan Mitra AI Assistant'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                  {language === 'hi' ? 'आवाज सहायक' : 'Voice Active'}
                </span>
                <IntegrationBadge status="LIVE" spec="Speech & NLU" featureName="Voice Bot" featureId="AUD-10" />
              </div>
              <p className="text-xs text-white/80">
                {language === 'hi' ? 'सरल भाषा में पूछें • सुनिए और समझिए' : 'Ask in Hindi or English • Speak or Listen'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isSpeaking && (
              <button
                onClick={() => { stopSpeech(); setIsSpeaking(false); }}
                className="p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white text-xs flex items-center gap-1"
                title="Stop Audio"
              >
                <VolumeX className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline">रोकें</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F6F9F7]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#168A5B] text-white rounded-br-none'
                    : 'bg-white text-[#063B2A] border border-[#E4EBE6] rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                
                <div className="mt-2 flex items-center justify-between text-[11px] opacity-70 gap-2">
                  <span>{m.timestamp}</span>
                  {m.sender === 'mitra' && (
                    <button
                      onClick={() => handleSpeakText(m.text)}
                      className="flex items-center gap-1 text-[#0B5D3B] font-bold hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'दोबारा सुनें' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-white border-t border-[#E4EBE6] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q.query)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#DDF4E9] text-[#0B5D3B] hover:bg-[#168A5B] hover:text-white transition-all border border-[#168A5B]/20 flex-shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Audio Waveform / Input Bar */}
        <div className="p-3 bg-white border-t border-[#D7E3DC] flex items-center gap-2">
          {/* Big Accessible Mic Button */}
          <button
            onClick={handleToggleVoiceInput}
            title="Tap to Speak (बोलकर पूछने के लिए दबाएं)"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-md ${
              isListening
                ? 'bg-red-500 text-white ring-4 ring-red-300 animate-pulse'
                : 'bg-[#168A5B] text-white hover:bg-[#0B5D3B]'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(inputText)}
            placeholder={
              language === 'hi' 
                ? 'बोलें या अपनी समस्या यहाँ लिखें...' 
                : 'Speak or type your query here...'
            }
            className="flex-1 bg-[#F0F5F2] border border-[#D7E3DC] rounded-xl px-4 py-2.5 text-sm text-[#063B2A] focus:outline-none focus:ring-2 focus:ring-[#168A5B]"
          />

          <button
            onClick={() => handleSendQuery(inputText)}
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-xl bg-[#0B5D3B] disabled:opacity-40 text-white flex items-center justify-center hover:bg-[#063B2A] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
