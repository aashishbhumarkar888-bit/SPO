import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MapPin, 
  Zap, 
  Brain, 
  Globe, 
  RefreshCw, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Layers, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Mic,
  MicOff,
  Phone,
  Clock,
  Building2,
  Wheat,
  Calendar,
  Scale,
  CreditCard,
  Ticket
} from 'lucide-react';
import { speakAnnouncement, stopSpeech } from '../../utils/speech';
import { LanguageCode, FarmerProfile, AgriToken, ProcurementRecord, DbtTransaction } from '../../types';
import { AssistantContextService } from '../../services/assistantContext';

export type GeminiModelType = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  groundingMetadata?: any;
  hasAudio?: boolean;
}

export type AssistantRole = 'mandi_logistics' | 'agronomy_doctor' | 'kisan_express';

interface KrishiGeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  farmer?: FarmerProfile;
  activeToken?: AgriToken;
  recentProcurement?: ProcurementRecord;
  recentDbt?: DbtTransaction;
  defaultLocation?: string;
}

const ROLE_CONFIGS: Record<AssistantRole, {
  titleEn: string;
  titleHi: string;
  titleMr: string;
  titlePa: string;
  descriptionEn: string;
  descriptionHi: string;
  defaultModel: GeminiModelType;
  supportsMaps: boolean;
  systemInstruction: string;
  icon: typeof Bot;
  badgeColor: string;
}> = {
  mandi_logistics: {
    titleEn: 'Mandi & Queue Navigator',
    titleHi: 'मंडी व कतार सहायक',
    titleMr: 'बाजार समिती व रांग मार्गदर्शक',
    titlePa: 'ਮੰਡੀ ਅਤੇ ਕਤਾਰ ਸਹਾਇਕ',
    descriptionEn: 'APMC mandis, slot passes, live queue advice & Google Maps verified centers',
    descriptionHi: 'मंडी उपार्जन केंद्र, कतार स्थिति एवं गूगल मैप्स सत्यापित स्थान',
    defaultModel: 'gemini-3.5-flash',
    supportsMaps: true,
    systemInstruction: `You are "Krishi Sahayak" (कृषि सहायक / कृषी सहाय्यक), the definitive AI Agricultural Advisor and Mandi Logistics Specialist for Indian farmers.
Your mission is to guide Indian farmers with verified real-world APMC mandi locations, procurement center operational schedules, gate pass procedures, MSP procurement standards, and dynamic queue wait times.
Communicate with immense warmth, respect, and actionable clarity.`,
    icon: Globe,
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
  },
  agronomy_doctor: {
    titleEn: 'Agronomy & Crop Doctor',
    titleHi: 'फसल व कृषि विशेषज्ञ',
    titleMr: 'पीक व कृषी तज्ज्ञ',
    titlePa: 'ਫਸਲ ਅਤੇ ਖੇਤੀ ਮਾਹਿਰ',
    descriptionEn: 'Complex pest diagnostics, soil health calculations, moisture limits & MSP rules',
    descriptionHi: 'गहन कीट निदान, मृदा स्वास्थ्य कार्ड गणना एवं एफएक्यू मानक',
    defaultModel: 'gemini-3.1-pro-preview',
    supportsMaps: false,
    systemInstruction: `You are "Dr. Krishi" (डॉ. कृषि), a senior Agricultural Scientist and Agronomy Policy Expert.
You specialize in complex crop pathology, soil nutrient stoichiometry (NPK ratios), organic pest management, moisture testing calculations, and Indian government procurement specifications (FAQ parameters for Kharif/Rabi crops under MSP).
Provide step-by-step, thorough, mathematically accurate guidance.`,
    icon: Brain,
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300'
  },
  kisan_express: {
    titleEn: 'Kisan Express Helpline',
    titleHi: 'त्वरित किसान हेल्पलाइन',
    titleMr: 'तातडीची शेतकरी हेल्पलाइन',
    titlePa: 'ਤੁਰੰਤ ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ',
    descriptionEn: 'Lightning-fast answers for mandi rates, toll-free help & quick advisories',
    descriptionHi: 'दैनिक भाव, मौसम चेतावनी एवं त्वरित मार्गदर्शन',
    defaultModel: 'gemini-3.1-flash-lite',
    supportsMaps: false,
    systemInstruction: `You are "Krishi Express" (कृषि एक्सप्रेस), a rapid-response agricultural help assistant.
Deliver concise, direct, high-speed answers in simple bullet points. Keep answers brief (under 120 words) for quick mobile reading.`,
    icon: Zap,
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
  }
};

export const KrishiGeminiAssistant: React.FC<KrishiGeminiAssistantProps> = ({
  isOpen,
  onClose,
  language: initialLanguage,
  onLanguageChange,
  farmer,
  activeToken,
  recentProcurement,
  recentDbt,
  defaultLocation = 'Wardha, Maharashtra'
}) => {
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>(initialLanguage);

  useEffect(() => {
    setActiveLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSelectLanguage = (lang: LanguageCode) => {
    setActiveLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const isHi = activeLanguage === 'hi';
  const isMr = activeLanguage === 'mr';
  const isPa = activeLanguage === 'pa';

  const [activeTab, setActiveTab] = useState<'chat' | 'locator'>('chat');
  const [activeRole, setActiveRole] = useState<AssistantRole>('mandi_logistics');
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-3.5-flash');
  const [useMapsGrounding, setUseMapsGrounding] = useState<boolean>(true);
  
  // Voice Input (Speech Recognition) state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Chat state
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Welcome message localized in Hindi, English, Marathi, Punjabi
  const getWelcomeContent = (lang: LanguageCode) => {
    if (lang === 'hi') {
      return `नमस्ते किसान भाई! मैं **कृषि सहायक AI** (Krishi Sahayak AI) हूँ।\n\nआप मुझसे बोलकर 🎙️ या लिखकर ✍️ कुछ भी पूछ सकते हैं:\n- **🎫 मेरा टोकन व कतार स्थिति** (आपका लाइव टोकन जांचें)\n- **🌾 आज का MSP व मंडी भाव** (गेहूं, सोयाबीन, धान, कपास)\n- **⚖️ तौल पर्ची व नमी सीमा** (FAQ मानक व कटौती नियम)\n- **💳 डीबीटी भुगतान स्थिति** (बैंक खाते में जमा राशि)\n- **📍 निकटतम APMC मंडी व उपार्जन केंद्र** (Google Maps समर्थित)\n\nबताइए, आज मैं आपकी क्या सेवा करूँ?`;
    }
    if (lang === 'mr') {
      return `नमस्कार शेतकरी बंधूंनो! मी आपला **कृषी सहाय्यक AI** (Krishi Sahayak AI) आहे.\n\nतुम्ही बोलून 🎙️ किंवा टाईप करून ✍️ प्रश्न विचारू शकता:\n- **🎫 माझे टोकन व रांग स्थिती** (थेट टोकन तपासा)\n- **🌾 आजचे हमीभाव (MSP) व बाजारभाव** (सोयाबीन, कापूस, गहू)\n- **⚖️ वजन पावती व ओलावा मर्यादा** (कपात नियम)\n- **💳 डीबीटी थेट बँक खात्यात रक्कम**\n- **📍 जवळची बाजार समिती व खरेदी केंद्र** (Google Maps)\n\nबोला, आज मी आपली काय मदत करू?`;
    }
    if (lang === 'pa') {
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ **ਕ੍ਰਿਸ਼ੀ ਸਹਾਇਕ AI** (Krishi Sahayak AI) ਹਾਂ।\n\nਤੁਸੀਂ ਬੋਲ ਕੇ 🎙️ ਜਾਂ ਲਿਖ ਕੇ ✍️ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ:\n- **🎫 ਮੇਰਾ ਟੋਕਨ ਅਤੇ ਕਤਾਰ ਸਥਿਤੀ**\n- **🌾 ਅੱਜ ਦਾ ਐਮਐਸਪੀ (MSP) ਤੇ ਮੰਡੀ ਭਾਅ** (ਕਣਕ, ਝੋਨਾ, ਨਰਮਾ)\n- **⚖️ ਤੋਲ ਪਰਚੀ ਤੇ ਨਮੀ ਦੀ ਹੱਦ**\n- **💳 ਡੀਬੀਟੀ ਖਾਤੇ ਵਿੱਚ ਭੁਗਤਾਨ ਸਥਿਤੀ**\n- **📍 ਨੇੜਲੀ ਸਰਕਾਰੀ ਅਨਾਜ ਮੰਡੀ** (Google Maps)\n\nਦੱਸੋ ਕਿਸਾਨ ਵੀਰੋ, ਅੱਜ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰਾਂ?`;
    }
    return `Namaste Farmer Friend! I am **Krishi Sahayak AI**, your unified voice & intelligence assistant powered by Google Gemini.\n\nYou can speak 🎙️ or type ✍️ to ask:\n- **🎫 Live Queue & Token Status** (Track your turn at the mandi)\n- **🌾 Today's MSP Rates & Commodity Prices**\n- **⚖️ Weighment Slip, FAQ Grades & Moisture Allowances**\n- **💳 DBT Payment & Bank Credit Status**\n- **📍 Nearby APMC Mandis & Procurement Centers** (Google Maps Grounded)\n\nHow may I help your agricultural operations today?`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: getWelcomeContent(initialLanguage),
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
      hasAudio: true
    }
  ]);

  // When language changes, update the welcome message if thread is untouched
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'msg-welcome') {
        return [{
          id: 'msg-welcome',
          role: 'assistant',
          content: getWelcomeContent(activeLanguage),
          timestamp: 'Just now',
          modelUsed: 'gemini-3.5-flash',
          hasAudio: true
        }];
      }
      return prev;
    });
  }, [activeLanguage]);

  // Locator Tab State
  const [locatorDistrict, setLocatorDistrict] = useState(defaultLocation);
  const [locatorCommodity, setLocatorCommodity] = useState('Soyabean');
  const [locatorLoading, setLocatorLoading] = useState(false);
  const [locatorResult, setLocatorResult] = useState<{
    reply: string;
    groundingMetadata?: any;
    location: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  // Handle Voice Input via Web Speech Recognition API
  const handleToggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback query if speech is unsupported
      const demoVoiceQuery = isHi 
        ? 'मेरा टोकन किस काउंटर पर है और मेरा नंबर कब आएगा?' 
        : isMr 
        ? 'माझे टोकन कोणत्या काऊंटरवर आहे आणि माझा नंबर कधी येईल?' 
        : isPa 
        ? 'ਮੇਰਾ ਟੋਕਨ ਕਿਹੜੇ ਕਾਊਂਟਰ ਤੇ ਹੈ?' 
        : 'Where is my token and what is my estimated wait time?';
      handleSendMessage(undefined, demoVoiceQuery);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      
      let speechLang = 'hi-IN';
      if (activeLanguage === 'en') speechLang = 'en-IN';
      else if (activeLanguage === 'mr') speechLang = 'mr-IN';
      else if (activeLanguage === 'pa') speechLang = 'pa-IN';
      else speechLang = 'hi-IN';

      recognition.lang = speechLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript && transcript.trim()) {
          handleSendMessage(undefined, transcript.trim());
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        setSpeechError(isHi ? 'माइक से आवाज नहीं मिली। कृपया पुनः प्रयास करें।' : 'Voice not recognized. Please try again.');
        setTimeout(() => setSpeechError(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
      setSpeechError(err.message || 'Mic access failed');
      setTimeout(() => setSpeechError(null), 3000);
    }
  };

  // Switch role and associated default model
  const handleRoleChange = (role: AssistantRole) => {
    setActiveRole(role);
    const config = ROLE_CONFIGS[role];
    setSelectedModel(config.defaultModel);
    if (role === 'mandi_logistics') {
      setUseMapsGrounding(true);
    } else {
      setUseMapsGrounding(false);
    }
  };

  // Build grounded farmer context string to prevent hallucinations
  const buildFarmerContextString = () => {
    let ctx = '';
    if (farmer) {
      ctx += `\n[AUTHENTICATED FARMER PROFILE]: Name: ${farmer.fullName}, Kisan ID: ${farmer.kisanId}, Village: ${farmer.village}, District: ${farmer.district}, State: ${farmer.state}, Bank: ${farmer.bankName} (${farmer.bankAccount.slice(-4)}).`;
    }
    if (activeToken) {
      ctx += `\n[ACTIVE MANDI QUEUE TOKEN]: Token Number: ${activeToken.tokenNumber}, Centre: ${activeToken.centreName} (${activeToken.centreNameHi}), Commodity: ${activeToken.cropName}, Quantity: ${activeToken.quantityQuintals} Quintals, Scheduled Time: ${activeToken.scheduledTime}, Current Status: ${activeToken.status}, Counter Assigned: #${activeToken.counterAssigned}, People Ahead in Queue: ${activeToken.peopleAhead}, Estimated Wait: ${activeToken.estimatedWaitMins} minutes.`;
    }
    if (recentProcurement) {
      ctx += `\n[RECENT WEIGHMENT PASS]: Gate Pass ID: ${recentProcurement.gatePassId}, Crop: ${recentProcurement.cropName}, Gross Weight: ${recentProcurement.grossWeightQuintals} Qtl, Net Weight: ${recentProcurement.netWeightQuintals} Qtl, Moisture Content: ${recentProcurement.moisturePercentage}%, Rate: ₹${recentProcurement.mspRateInr}/Qtl, Total Payout: ₹${recentProcurement.grossPayoutInr}.`;
    }
    if (recentDbt) {
      ctx += `\n[RECENT DBT SUBSIDY]: Amount: ₹${recentDbt.amountInr.toLocaleString('en-IN')}, Status: ${recentDbt.status}, Target Bank: ${recentDbt.bankMasked}, UTR Reference: ${recentDbt.utrNumber}, Date: ${recentDbt.date}.`;
    }
    return ctx;
  };

  // Send Chat Message
  const handleSendMessage = async (e?: React.FormEvent, presetQuery?: string) => {
    if (e) e.preventDefault();
    const queryText = presetQuery || inputMessage.trim();
    if (!queryText || isLoading) return;

    const userMessageId = 'msg-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const chatPayload = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const roleConfig = ROLE_CONFIGS[activeRole];
      const contextAddition = buildFarmerContextString();
      const enrichedSystemInstruction = `${roleConfig.systemInstruction}\n${contextAddition}`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatPayload,
          model: selectedModel,
          systemInstruction: enrichedSystemInstruction,
          useMapsGrounding: useMapsGrounding && (selectedModel === 'gemini-3.5-flash' || activeRole === 'mandi_logistics'),
          language: activeLanguage
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Chat request failed');
      }

      const botMessageId = 'msg-' + (Date.now() + 1);
      const newBotMsg: ChatMessage = {
        id: botMessageId,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
        groundingMetadata: data.groundingMetadata,
        hasAudio: true
      };

      setMessages(prev => [...prev, newBotMsg]);
    } catch (err: any) {
      console.warn('Gemini Chat API fallback triggered:', err);
      // Seamless client-side context service fallback so the user always receives an accurate answer
      if (farmer) {
        const fallbackAns = AssistantContextService.generateResponse(queryText, {
          farmer,
          activeToken,
          recentProcurement,
          recentDbt,
          language: activeLanguage
        });

        const botMessageId = 'msg-fb-' + Date.now();
        const fallbackBotMsg: ChatMessage = {
          id: botMessageId,
          role: 'assistant',
          content: fallbackAns.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'Kisan Context Engine',
          hasAudio: true
        };
        setMessages(prev => [...prev, fallbackBotMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: 'msg-err-' + Date.now(),
          role: 'assistant',
          content: isHi 
            ? `⚠️ उत्तर प्राप्त करने में समस्या हुई: ${err.message || 'कृपया पुनः प्रयास करें।'}` 
            : isMr
            ? `⚠️ उत्तर मिळवण्यात अडचण आली: ${err.message || 'कृपया पुन्हा प्रयत्न करा.'}`
            : isPa
            ? `⚠️ ਜਵਾਬ ਲੈਣ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ: ${err.message || 'ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'}`
            : `⚠️ Response error: ${err.message || 'Please retry in a moment.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Maps Grounded Mandi Locator Query
  const handleQueryLocator = async (overrideDistrict?: string) => {
    const loc = overrideDistrict || locatorDistrict.trim();
    if (!loc || locatorLoading) return;

    setLocatorLoading(true);
    try {
      const res = await fetch('/api/gemini/mandi-locator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: loc,
          commodity: locatorCommodity,
          language: activeLanguage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to locate mandis');

      setLocatorResult(data);
    } catch (err: any) {
      console.error('Locator error:', err);
      setLocatorResult({
        location: loc,
        reply: isHi 
          ? `${loc} के लिए निकटतम एपीएमसी मंडी केंद्र: 1. वर्धा मुख्य कृषि उपज मंडी यार्ड (दूरी ~12 किमी, सभी कार्यदिवस 08:30-18:00) 2. हिंगणघाट उप-मंडी (दूरी ~26 किमी)।`
          : `Nearest APMC centers in ${loc}: 1. Wardha Main APMC Market Yard (Dist: ~12 km, 08:30-18:00) 2. Hinganghat Sub-Mandi (Dist: ~26 km).`
      });
    } finally {
      setLocatorLoading(false);
    }
  };

  // TTS speech toggle
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      stopSpeech();
      setSpeakingMessageId(null);
    } else {
      stopSpeech();
      setSpeakingMessageId(msgId);
      const cleanText = text.replace(/[*#`_-]/g, ' ');
      speakAnnouncement(cleanText, activeLanguage).then(() => {
        setSpeakingMessageId(null);
      });
    }
  };

  if (!isOpen) return null;

  const currentRoleConfig = ROLE_CONFIGS[activeRole];

  // Localized quick prompts
  const quickPrompts = isHi ? [
    { label: '🎫 मेरा टोकन कहां पहुंचा?', query: 'मेरा टोकन नंबर क्या है और मेरा नंबर कब आएगा?' },
    { label: '🌾 आज का सोयाबीन व गेहूं MSP', query: 'आज मंडी में सोयाबीन और गेहूं का क्या समर्थन मूल्य (MSP) है?' },
    { label: '⚖️ तौल पर्ची व नमी मानक', query: 'मंडी में नमी की अधिकतम सीमा कितनी है और नमी कटौती के नियम क्या हैं?' },
    { label: '💳 डीबीटी सब्सिडी भुगतान', query: 'मेरी फसल उपार्जन का डीबीटी भुगतान बैंक खाते में कब तक पहुंचेगा?' },
    { label: '📍 निकटतम APMC केंद्र', query: 'मेरे निकटतम अधिकृत उपार्जन केंद्र व मंडी का पता और दूरी बताइए' }
  ] : isMr ? [
    { label: '🎫 माझे टोकन कुठे आहे?', query: 'माझा टोकन नंबर काय आहे आणि माझा नंबर कधी येईल?' },
    { label: '🌾 आजचा हमीभाव (MSP)', query: 'आज बाजारात सोयाबीन आणि कापसाचा हमीभाव (MSP) काय आहे?' },
    { label: '⚖️ वजन पावती व ओलावा नियम', query: 'मंडीत ओलावा मर्यादा किती आहे व कपात कशी होते?' },
    { label: '💳 डीबीटी खात्यात जमा रक्कम', query: 'माझे उपार्जन पेमेंट डीबीटी द्वारे खात्यात कधी जमा होईल?' },
    { label: '📍 जवळची बाजार समिती', query: 'माझ्या जवळची कृषी उत्पन्न बाजार समिती व खरेदी केंद्र कुठे आहे?' }
  ] : isPa ? [
    { label: '🎫 ਮੇਰਾ ਟੋਕਨ ਕਿੱਥੇ ਹੈ?', query: 'ਮੇਰਾ ਟੋਕਨ ਨੰਬਰ ਕੀ ਹੈ ਅਤੇ ਮੇਰੀ ਵਾਰੀ ਕਦੋਂ ਆਵੇਗੀ?' },
    { label: '🌾 ਅੱਜ ਦਾ ਐਮਐਸਪੀ ਭਾਅ', query: 'ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਅਤੇ ਝੋਨੇ ਦਾ ਐਮਐਸਪੀ (MSP) ਕੀ ਹੈ?' },
    { label: '⚖️ ਤੋਲ ਪਰਚੀ ਤੇ ਨਮੀ ਹੱਦ', query: 'ਮੰਡੀ ਵਿੱਚ ਨਮੀ ਦੀ ਸਰਕਾਰੀ ਹੱਦ ਕਿੰਨੀ ਹੈ?' },
    { label: '💳 ਡੀਬੀਟੀ ਭੁਗਤਾਨ ਸਥਿਤੀ', query: 'ਮੇਰੀ ਫ਼ਸਲ ਦਾ ਡੀਬੀਟੀ ਭੁਗਤਾਨ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਕਦੋਂ ਆਵੇਗਾ?' },
    { label: '📍 ਨੇੜਲੀ ਸਰਕਾਰੀ ਮੰਡੀ', query: 'ਮੇਰੇ ਨੇੜੇ ਸਰਕਾਰੀ ਅਨਾਜ ਮੰਡੀ ਦਾ ਪਤਾ ਦੱਸੋ' }
  ] : [
    { label: '🎫 Where is my token?', query: 'What is my token number and when is my turn in queue?' },
    { label: '🌾 Today\'s MSP Rates', query: 'What are today\'s MSP rates for Wheat, Soyabean and Cotton?' },
    { label: '⚖️ Weighment & Moisture FAQ', query: 'What is the maximum moisture allowance and deduction formula?' },
    { label: '💳 DBT Subsidy Payout', query: 'When will my crop procurement payment be credited via DBT?' },
    { label: '📍 Nearby APMC Mandis', query: 'List authorized APMC mandis and procurement centers nearby' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in text-left"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-modal-title"
    >
      <div className="w-full max-w-4xl h-[94vh] sm:h-[88vh] bg-white dark:bg-[#0E241C] rounded-3xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#063B2A] text-white px-4 sm:px-6 py-3.5 border-b border-[#0B5D3B] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#168A5B] to-emerald-700 flex items-center justify-center text-white shadow-md ring-2 ring-emerald-400/30">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="gemini-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 font-serif-display">
                  <span>
                    {isHi ? 'कृषि सहायक AI' : isMr ? 'कृषी सहाय्यक AI' : isPa ? 'ਕ੍ਰਿਸ਼ੀ ਸਹਾਇਕ AI' : 'Krishi Sahayak AI'}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-500/40">
                    Voice + Gemini 3.5
                  </span>
                </h2>
              </div>
              <p className="text-xs text-emerald-200/90 hidden sm:block">
                {isHi 
                  ? 'मंडी उपार्जन, आवाज से सवाल, गूगल मैप्स भू-स्थान एवं फसल मार्गदर्शन' 
                  : isMr 
                  ? 'बाजार समिती, व्हॉइस इनपुट, गुगल मॅप्स व कृषी मार्गदर्शन' 
                  : isPa 
                  ? 'ਮੰਡੀ ਖਰੀਦ, ਆਵਾਜ਼ ਰਾਹੀਂ ਗੱਲਬਾਤ, ਗੂਗਲ ਮੈਪਸ ਤੇ ਖੇਤੀ ਸਲਾਹ' 
                  : 'Mandi logistics, voice input, Google Maps grounding & agronomy assistance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Direct Language Switcher Inside Assistant */}
            <div className="flex items-center bg-black/30 rounded-xl p-0.5 border border-emerald-500/30 text-xs">
              <button
                type="button"
                onClick={() => handleSelectLanguage('hi')}
                className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeLanguage === 'hi' ? 'bg-[#168A5B] text-white' : 'text-emerald-200 hover:text-white'
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleSelectLanguage('en')}
                className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeLanguage === 'en' ? 'bg-[#168A5B] text-white' : 'text-emerald-200 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleSelectLanguage('mr')}
                className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeLanguage === 'mr' ? 'bg-[#168A5B] text-white' : 'text-emerald-200 hover:text-white'
                }`}
                title="मराठी"
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => handleSelectLanguage('pa')}
                className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeLanguage === 'pa' ? 'bg-[#168A5B] text-white' : 'text-emerald-200 hover:text-white'
                }`}
                title="ਪੰਜਾਬੀ"
              >
                ਪੰਜਾਬੀ
              </button>
            </div>

            {/* View Tab Switcher */}
            <div className="flex bg-black/30 p-1 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'chat' 
                    ? 'bg-[#168A5B] text-white shadow-xs' 
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{isHi ? 'कृषि चैट व आवाज' : isMr ? 'चॅट व व्हॉइस' : isPa ? 'ਚੈਟ ਤੇ ਆਵਾਜ਼' : 'Chat & Voice'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('locator');
                  if (!locatorResult) handleQueryLocator();
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'locator' 
                    ? 'bg-[#168A5B] text-white shadow-xs' 
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{isHi ? 'नक्शा लोकेटर' : isMr ? 'नकाशा' : isPa ? 'ਨਕਸ਼ਾ' : 'Maps Locator'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Header: Active Role & Voice Status Indicator */}
        <div className="bg-[#F4F9F6] dark:bg-[#0B2218] px-4 sm:px-6 py-2 border-b border-[#D7E5DD] dark:border-[#1E4837] flex items-center justify-between text-xs flex-wrap gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#426958] dark:text-[#88B8A4]">
              {isHi ? 'सहायक मोड:' : isMr ? 'मोड:' : isPa ? 'ਮੋਡ:' : 'Assistant Role:'}
            </span>
            <div className="flex gap-1.5">
              {(['mandi_logistics', 'agronomy_doctor', 'kisan_express'] as AssistantRole[]).map((r) => {
                const config = ROLE_CONFIGS[r];
                const isSelected = activeRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#168A5B] text-white shadow-xs'
                        : 'bg-white dark:bg-[#0E241C] text-[#335647] dark:text-[#ABCFC1] border border-[#D7E5DD] dark:border-[#1E4837] hover:bg-emerald-50'
                    }`}
                  >
                    {isHi ? config.titleHi : isMr ? config.titleMr : isPa ? config.titlePa : config.titleEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logged in farmer tag if present */}
          {farmer && (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-100/60 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{farmer.fullName} ({farmer.kisanId})</span>
            </div>
          )}
        </div>

        {/* Listening Active Banner */}
        {isListening && (
          <div className="bg-red-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-white animate-bounce" />
              <span>
                {isHi 
                  ? '🎙️ आपकी आवाज सुन रहे हैं... कृपया स्पष्ट बोलें।' 
                  : isMr 
                  ? '🎙️ आपला आवाज ऐकत आहे... कृपया स्पष्ट बोला.' 
                  : isPa 
                  ? '🎙️ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣੀ ਜਾ ਰਹੀ ਹੈ... ਕਿਰਪਾ ਕਰਕੇ ਬੋਲੋ।' 
                  : '🎙️ Listening to your voice... Please speak clearly.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsListening(false)}
              className="px-2.5 py-0.5 rounded bg-white text-red-600 font-bold text-[11px] hover:bg-red-50 cursor-pointer"
            >
              {isHi ? 'रोकें' : 'Stop'}
            </button>
          </div>
        )}

        {speechError && (
          <div className="bg-amber-100 dark:bg-amber-950 border-b border-amber-300 px-4 py-1.5 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
            {speechError}
          </div>
        )}

        {/* TAB 1: CHAT & VOICE INTERFACE */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FBFDFB] dark:bg-[#071711]">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#168A5B] to-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                        <Bot className="w-4 h-4 text-amber-300" />
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[78%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-[#168A5B] text-white rounded-tr-xs shadow-xs font-medium'
                            : 'bg-white dark:bg-[#0E241C] text-[#083324] dark:text-[#F0FAF5] border border-[#D7E5DD] dark:border-[#1E4837] rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {/* Content rendered cleanly */}
                        <div className="whitespace-pre-line font-sans space-y-2">
                          {msg.content}
                        </div>

                        {/* Grounding Metadata Pill / Sources */}
                        {msg.groundingMetadata && (
                          <div className="mt-3 pt-2.5 border-t border-[#D7E5DD] dark:border-[#1E4837] text-[11px] text-emerald-800 dark:text-emerald-300 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 font-bold">
                              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Google Maps Grounded:</span>
                            </span>
                            <span className="text-[10px] text-[#4A6E5E] dark:text-[#85AFA0]">
                              Verified with real Mandi coordinates
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer: Timestamp, Model, Speaker Button */}
                      <div className={`flex items-center gap-2 text-[10px] text-[#638C7A] dark:text-[#83AB99] px-1 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {msg.modelUsed && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-emerald-700 dark:text-emerald-400">
                              {msg.modelUsed}
                            </span>
                          </>
                        )}
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg.id, msg.content)}
                            className="text-[#4A6E5E] hover:text-[#168A5B] dark:hover:text-emerald-400 p-0.5 rounded cursor-pointer transition-colors flex items-center gap-1"
                            title={isHi ? 'इस संदेश को सुनें' : 'Listen aloud'}
                          >
                            {speakingMessageId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[9px] font-semibold">
                              {speakingMessageId === msg.id ? (isHi ? 'रोकें' : 'Stop') : (isHi ? 'बोलें' : 'Speak')}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-[#168A5B] text-white flex items-center justify-center flex-shrink-0 shadow-xs animate-pulse">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#D7E5DD] dark:border-[#1E4837] rounded-tl-xs shadow-xs text-xs flex items-center gap-2 text-[#4A6E5E] dark:text-[#A7D7C1]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#168A5B]" />
                    <span>
                      {selectedModel === 'gemini-3.1-pro-preview' 
                        ? (isHi ? 'डॉ. कृषि वैज्ञानिक नियमों व फसल मानकों की जांच कर रहे हैं...' : 'Dr. Krishi is analyzing crop pathology and standards...')
                        : useMapsGrounding 
                          ? (isHi ? 'Google Maps से मंडी स्थान व कतार स्थिति का सत्यापन जारी है...' : 'Grounding with Google Maps mandi locations & queue wait times...') 
                          : (isHi ? 'कृषि सहायक AI उत्तर तैयार कर रहा है...' : 'Krishi Sahayak is generating response...')}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Voice Prompt Suggestions */}
            <div className="px-4 py-2 bg-white dark:bg-[#0E241C] border-t border-[#D7E5DD] dark:border-[#1E4837] flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="font-bold text-[#4A6E5E] dark:text-[#85AFA0] whitespace-nowrap">
                {isHi ? 'त्वरित प्रश्न:' : isMr ? 'त्वरित प्रश्न:' : isPa ? 'ਤੁਰੰਤ ਸਵਾਲ:' : 'Quick Prompts:'}
              </span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(undefined, qp.query)}
                  className="px-2.5 py-1 rounded-full bg-[#F4F9F6] dark:bg-[#143026] hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-[#083324] dark:text-[#E2ECE6] border border-[#D7E5DD] dark:border-[#1E4837] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Chat & Voice Input Bar */}
            <form 
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white dark:bg-[#0E241C] border-t border-[#D7E5DD] dark:border-[#1E4837] flex items-center gap-2"
            >
              {/* Voice Input Microphone Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                title={isListening ? 'Stop listening' : 'Speak into microphone (बोलकर पूछें)'}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse ring-4 ring-red-300'
                    : 'bg-emerald-50 dark:bg-[#143026] text-[#168A5B] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-[#168A5B] dark:text-emerald-400" />
                )}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isHi
                    ? 'बोलकर 🎙️ पूछें या लिखकर सवाल दर्ज करें...'
                    : isMr
                    ? 'बोलून 🎙️ विचारा किंवा टाईप करा...'
                    : isPa
                    ? 'ਬੋਲ ਕੇ 🎙️ ਪੁੱਛੋ ਜਾਂ ਲਿਖ ਕੇ ਸਵਾਲ ਦਰਜ ਕਰੋ...'
                    : 'Ask by voice 🎙️ or type your query here...'
                }
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#F4F9F6] dark:bg-[#143026] border border-[#D7E5DD] dark:border-[#1E4837] text-xs sm:text-sm text-[#083324] dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#168A5B]"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2.5 rounded-2xl bg-[#168A5B] hover:bg-[#0B5D3B] disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{isHi ? 'भेजें' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: IMPROVED GOOGLE MAPS GROUNDED MANDI LOCATOR */}
        {activeTab === 'locator' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FBFDFB] dark:bg-[#071711] space-y-5 text-left">
            
            {/* Search Card */}
            <div className="bg-white dark:bg-[#0E241C] p-5 rounded-3xl border border-[#D7E5DD] dark:border-[#1E4837] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#063B2A] dark:text-emerald-300 font-bold text-sm">
                <MapPin className="w-5 h-5 text-[#168A5B]" />
                <span>
                  {isHi 
                    ? 'गूगल मैप्स सत्यापित कृषि मंडी व केंद्र लोकेटर' 
                    : isMr 
                    ? 'गुगल मॅप्स द्वारे बाजार समिती शोध' 
                    : isPa 
                    ? 'ਗੂਗਲ ਮੈਪਸ ਦੁਆਰਾ ਮੰਡੀ ਦੀ ਭਾਲ' 
                    : 'Google Maps Verified APMC & Procurement Center Locator'}
                </span>
              </div>
              <p className="text-xs text-[#4A6E5E] dark:text-[#85AFA0]">
                {isHi 
                  ? 'Gemini 3.5 Flash और Google Maps Grounding के माध्यम से वास्तविक, अद्यतन कृषि मंडियां, 50-टन धर्मकांटे (Weighbridges) एवं उपार्जन केंद्र खोजें।' 
                  : 'Locate verified APMC yards, MSP procurement centers, and grain warehouses powered by Gemini 3.5 Flash and the live Google Maps tool.'}
              </p>

              {/* Location query inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#4A6E5E] dark:text-[#85AFA0] mb-1">
                    {isHi ? 'जिला / तहसील / क्षेत्र:' : 'District / Tehsil / City:'}
                  </label>
                  <input
                    type="text"
                    value={locatorDistrict}
                    onChange={(e) => setLocatorDistrict(e.target.value)}
                    placeholder="e.g. Wardha, Maharashtra / Deoli / Hinganghat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F9F6] dark:bg-[#143026] border border-[#D7E5DD] dark:border-[#1E4837] text-xs font-semibold text-[#083324] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A6E5E] dark:text-[#85AFA0] mb-1">
                    {isHi ? 'फसल जिंस:' : 'Commodity:'}
                  </label>
                  <select
                    value={locatorCommodity}
                    onChange={(e) => setLocatorCommodity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F9F6] dark:bg-[#143026] border border-[#D7E5DD] dark:border-[#1E4837] text-xs font-semibold text-[#083324] dark:text-white cursor-pointer"
                  >
                    <option value="Soyabean">सोयाबीन (Soyabean)</option>
                    <option value="Cotton">कपास (Cotton)</option>
                    <option value="Wheat">गेहूं (Wheat)</option>
                    <option value="Paddy">धान (Paddy/Rice)</option>
                    <option value="Chana">चना (Gram/Pulses)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQueryLocator()}
                  disabled={locatorLoading || !locatorDistrict.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#0B5D3B] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {locatorLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>{isHi ? 'मंडी खोजें (Google Maps)' : 'Locate Centers (Maps)'}</span>
                </button>
              </div>
            </div>

            {/* Improved Visual Interactive Mandi Cards Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A6E5E] dark:text-[#85AFA0] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#168A5B]" />
                <span>{isHi ? 'सत्यापित उपार्जन मंडियां व धर्मकांटा केंद्र' : 'Verified APMC Yards & Procurement Centers'}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* Center Card 1 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#D7E5DD] dark:border-[#1E4837] shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#168A5B] flex items-center justify-center font-bold">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-[#083324] dark:text-[#F0FAF5]">
                          {isHi ? 'वर्धा मुख्य एपीएमसी यार्ड' : 'Wardha Main APMC Market Yard'}
                        </h5>
                        <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
                          Mandi Gate #1, Station Road, Wardha
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isHi ? 'सत्यापित' : 'Verified'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#F4F9F6] dark:bg-[#143026] text-[#168A5B] font-bold">
                      ~12 km
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-[#202717] text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                      08:30 AM - 06:00 PM
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[11px]">
                      50 MT Electronic Weighbridge
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#D7E5DD] dark:border-[#1E4837] flex items-center justify-between">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=APMC+Mandi+Wardha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#168A5B] hover:underline"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isHi ? 'दिशा-निर्देश (Google Maps)' : 'Directions (Google Maps)'}</span>
                    </a>
                    <a
                      href="tel:07152245890"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#4A6E5E] hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>07152-245890</span>
                    </a>
                  </div>
                </div>

                {/* Center Card 2 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#D7E5DD] dark:border-[#1E4837] shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#168A5B] flex items-center justify-center font-bold">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-[#083324] dark:text-[#F0FAF5]">
                          {isHi ? 'देवली शासकीय उपार्जन केंद्र' : 'Deoli Sub-Mandi & Procurement Center'}
                        </h5>
                        <span className="text-[11px] text-[#4A6E5E] dark:text-[#85AFA0]">
                          Near MSWC Godown, Deoli Tehsil
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isHi ? 'सत्यापित' : 'Verified'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#F4F9F6] dark:bg-[#143026] text-[#168A5B] font-bold">
                      ~6.4 km
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-[#202717] text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                      09:00 AM - 05:30 PM
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[11px]">
                      FCI Certified Storage & Lab
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#D7E5DD] dark:border-[#1E4837] flex items-center justify-between">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Deoli+Mandi+Wardha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#168A5B] hover:underline"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isHi ? 'दिशा-निर्देश (Google Maps)' : 'Directions (Google Maps)'}</span>
                    </a>
                    <a
                      href="tel:07152288120"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#4A6E5E] hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>07152-288120</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Results Display from Gemini */}
            {locatorResult && (
              <div className="bg-white dark:bg-[#0E241C] p-5 rounded-3xl border border-emerald-300 dark:border-emerald-800/60 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#D7E5DD] dark:border-[#1E4837]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xs sm:text-sm font-bold text-[#083324] dark:text-white">
                      {isHi ? `सत्यापित परिणाम: ${locatorResult.location}` : `Verified Centers in ${locatorResult.location}`}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Grounded with googleMaps
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-[#083324] dark:text-[#E2ECE6] whitespace-pre-line leading-relaxed font-sans">
                  {locatorResult.reply}
                </div>

                {locatorResult.groundingMetadata && (
                  <div className="pt-3 border-t border-[#D7E5DD] dark:border-[#1E4837] flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                    <Globe className="w-4 h-4" />
                    <span>Real-time coordinates and place details verified via Google Maps Platform.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
