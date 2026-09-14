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
          ? 'राम-राम किसान भाई! मैं आपका किसान मित्र (Kisan Mitra) हूँ। आप बोलकर या लिखकर पूछ सकते हैं — जैसे टोकन स्थिति, मंडी भाव, या तौल पर्ची।'
          : 'Namaste Farmer Friend! I am your Kisan Mitra AI Assistant. You can speak or type to ask about your live token, mandi MSP rates, or weighment slip.',
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
    { label: '🌾 आज का गेहूं व सोयाबीन MSP भाव', query: 'आज मंडी में गेहूं और सोयाबीन का क्या भाव है?' },
    { label: '⚖️ तौल पर्ची व शुद्ध वजन', query: 'मेरी हालिया तौल पर्ची और कुल देय राशि कितनी है?' },
    { label: '💳 डीबीटी सब्सिडी का पैसा कब मिलेगा?', query: 'मंडी में बेची गई फसल का डीबीटी भुगतान कब तक बैंक में जमा होगा?' }
  ] : [
    { label: '🎫 Where is my token?', query: 'What is my token number and when is my turn?' },
    { label: '🌾 Today\'s MSP Rates', query: 'What are today\'s MSP rates for Wheat and Soyabean?' },
    { label: '⚖️ Weighment Slip Details', query: 'What is my net weight and total payable amount?' },
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

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
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
    setIsSpeaking(true);
    speakAnnouncement(text, language === 'hi' ? 'hi' : 'en').then(() => {
      setIsSpeaking(false);
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kisan-mitra-title"
    >
      <div 
        id="kisan-mitra-modal-card"
        className="w-full max-w-xl bg-white dark:bg-[#0E241C] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#C7DCD1] dark:border-[#2B5E4A] flex flex-col max-h-[85vh] overflow-hidden transition-colors"
      >
        {/* Modal Header */}
        <div className="bg-[#063B2A] dark:bg-[#081B13] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#0B5D3B] dark:border-[#153A2C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#168A5B] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="kisan-mitra-title" className="font-bold text-base sm:text-lg tracking-tight font-serif-display">
                  {language === 'hi' ? 'किसान मित्र (Kisan Mitra)' : 'Kisan Mitra AI Assistant'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-mono">
                  {language === 'hi' ? 'आवाज सक्रिय' : 'Voice Active'}
                </span>
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
                className="px-2.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs flex items-center gap-1 transition-colors"
                title="Stop Audio"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">{language === 'hi' ? 'रोकें' : 'Stop'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F7F5] dark:bg-[#071711] transition-colors">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#0B5D3B] dark:bg-[#168A5B] text-white rounded-br-none'
                    : 'bg-white dark:bg-[#0E241C] text-[#063B2A] dark:text-[#F0FAF5] border border-[#E2ECE6] dark:border-[#1D4334] rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                
                <div className="mt-2 flex items-center justify-between text-[11px] opacity-70 gap-2">
                  <span>{m.timestamp}</span>
                  {m.sender === 'mitra' && (
                    <button
                      onClick={() => handleSpeakText(m.text)}
                      className="flex items-center gap-1 text-[#0B5D3B] dark:text-[#34D399] font-bold hover:underline"
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
        <div className="p-3 bg-white dark:bg-[#0E241C] border-t border-[#E2ECE6] dark:border-[#1D4334] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 transition-colors">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q.query)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#DDF4E9] dark:bg-[#153A2C] text-[#0B5D3B] dark:text-[#6EE7B7] hover:bg-[#168A5B] hover:text-white dark:hover:bg-[#22A872] transition-all border border-[#168A5B]/20 flex-shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Audio Waveform / Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0E241C] border-t border-[#C7DCD1] dark:border-[#2B5E4A] flex items-center gap-2.5 transition-colors">
          {/* Big Accessible Mic Button */}
          <button
            onClick={handleToggleVoiceInput}
            title="Tap to Speak (बोलकर पूछने के लिए दबाएं)"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-md ${
              isListening
                ? 'bg-red-500 text-white ring-4 ring-red-300 animate-pulse'
                : 'bg-[#168A5B] hover:bg-[#0B5D3B] text-white'
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
            className="flex-1 bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] rounded-xl px-4 py-2.5 text-sm text-[#063B2A] dark:text-[#F0FAF5] focus:outline-none focus:ring-2 focus:ring-[#168A5B] placeholder:text-[#57786B] dark:placeholder:text-[#85AFA0]"
          />

          <button
            onClick={() => handleSendQuery(inputText)}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] dark:bg-[#168A5B] dark:hover:bg-[#22A872] disabled:opacity-40 text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
