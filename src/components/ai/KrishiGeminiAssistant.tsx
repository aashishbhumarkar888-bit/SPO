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
  ChevronDown
} from 'lucide-react';
import { speakAnnouncement, stopSpeech } from '../../utils/speech';
import { LanguageCode } from '../../types';

export type GeminiModelType = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  groundingMetadata?: any;
}

export type AssistantRole = 'mandi_logistics' | 'agronomy_doctor' | 'kisan_express';

interface KrishiGeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  defaultLocation?: string;
}

const ROLE_CONFIGS: Record<AssistantRole, {
  titleEn: string;
  titleHi: string;
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
    descriptionEn: 'APMC mandis, slot passes, live queue advice & Google Maps verified centers',
    descriptionHi: 'मंडी उपार्जन केंद्र, कतार स्थिति एवं गूगल मैप्स सत्यापित स्थान',
    defaultModel: 'gemini-3.5-flash',
    supportsMaps: true,
    systemInstruction: `You are "Mandi Sahayak" (मंडी सहायक), an expert agricultural logistics advisor for the Smart Mandi & Procurement Orchestration platform in India.
Your mission is to guide Indian farmers with verified real-world APMC mandi locations, procurement center operational schedules, gate pass procedures, MSP procurement standards, and dynamic queue wait times.
Communicate warmly in clear, accessible bilingual Hindi and English.
When asked about mandis, centers, roads, distances, or locations, provide ground-accurate location details using Google Maps data.`,
    icon: Globe,
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
  },
  agronomy_doctor: {
    titleEn: 'Agronomy & Crop Doctor',
    titleHi: 'फसल व कृषि विशेषज्ञ',
    descriptionEn: 'Complex pest diagnostics, soil health calculations, moisture limits & MSP rules',
    descriptionHi: 'गहन कीट निदान, मृदा स्वास्थ्य कार्ड गणना एवं एफएक्यू मानक',
    defaultModel: 'gemini-3.1-pro-preview',
    supportsMaps: false,
    systemInstruction: `You are "Dr. Krishi" (डॉ. कृषि), a senior Agricultural Scientist and Agronomy Policy Expert.
You specialize in complex crop pathology, soil nutrient stoichiometry (NPK ratios), organic pest management, moisture testing calculations, and Indian government procurement specifications (FAQ parameters for Kharif/Rabi crops under MSP).
Provide step-by-step, thorough, mathematically accurate guidance. Respond respectfully in bilingual Hindi and English.`,
    icon: Brain,
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300'
  },
  kisan_express: {
    titleEn: 'Kisan Express Helpline',
    titleHi: 'त्वरित किसान हेल्पलाइन',
    descriptionEn: 'Lightning-fast answers for mandi rates, toll-free help & quick advisories',
    descriptionHi: 'दैनिक भाव, मौसम चेतावनी एवं त्वरित मार्गदर्शन',
    defaultModel: 'gemini-3.1-flash-lite',
    supportsMaps: false,
    systemInstruction: `You are "Kisan Mitra Express" (किसान मित्र एक्सप्रेस), a rapid-response agricultural help assistant.
Deliver concise, direct, high-speed answers in simple bullet points. Keep answers brief (under 120 words) for quick mobile reading. Communicate in bilingual Hindi and English.`,
    icon: Zap,
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
  }
};

export const KrishiGeminiAssistant: React.FC<KrishiGeminiAssistantProps> = ({
  isOpen,
  onClose,
  language,
  defaultLocation = 'Wardha, Maharashtra'
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'locator'>('chat');
  const [activeRole, setActiveRole] = useState<AssistantRole>('mandi_logistics');
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-3.5-flash');
  const [useMapsGrounding, setUseMapsGrounding] = useState<boolean>(true);
  
  // Chat state
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: language === 'hi'
        ? `नमस्ते किसान भाई! मैं **कृषि सहायक AI** हूँ।\n\nमैं आपकी सहायता कर सकता हूँ:\n- **निकटतम APMC मंडी व उपार्जन केंद्र खोजना** (Google Maps आधारित)\n- **फसल उपार्जन स्लॉट बुकिंग व कतार स्थिति की जानकारी**\n- **समर्थन मूल्य (MSP) एवं एफएक्यू (FAQ) गुणवत्ता मानक**\n- **फसल रोग व उर्वरक गणना**\n\nआप नीचे दिए गए विकल्पों में से मॉडल या भूमिका बदल सकते हैं। बताइए, आज मैं आपकी क्या मदद करूँ?`
        : `Namaste Farmer Brother! I am **Krishi Sahayak AI**, powered by Google Gemini.\n\nI can assist you with:\n- **Locating Authorized APMC Mandis & Procurement Centers** (Google Maps Grounded)\n- **Slot Pass Booking & Queue Token Flow**\n- **Minimum Support Price (MSP) Rates & FAQ Quality Standards**\n- **Crop Pathology & Fertilizer Calculations**\n\nHow may I help your farm operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash'
    }
  ]);

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

  // Update model when role changes
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

    // Append to local thread
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation payload for multi-turn chat
      // Map existing messages to Gemini format (exclude initial welcome if desired, or include all)
      const chatPayload = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const roleConfig = ROLE_CONFIGS[activeRole];

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatPayload,
          model: selectedModel,
          systemInstruction: roleConfig.systemInstruction,
          useMapsGrounding: useMapsGrounding && (selectedModel === 'gemini-3.5-flash' || activeRole === 'mandi_logistics')
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
        groundingMetadata: data.groundingMetadata
      };

      setMessages(prev => [...prev, newBotMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: language === 'hi' 
          ? `⚠️ उत्तर प्राप्त करने में त्रुटि: ${err.message || 'कृपया पुनः प्रयास करें।'}` 
          : `⚠️ Response error: ${err.message || 'Please retry in a moment.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
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
          commodity: locatorCommodity
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to locate mandis');

      setLocatorResult(data);
    } catch (err: any) {
      console.error('Locator error:', err);
      setLocatorResult({
        location: loc,
        reply: `Unable to retrieve verified map centers for ${loc}: ${err.message}`
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
      // Clean markdown characters for pleasant vocalization
      const cleanText = text.replace(/[*#`_-]/g, ' ');
      speakAnnouncement(cleanText, language === 'hi' ? 'hi' : 'en').then(() => {
        setSpeakingMessageId(null);
      });
    }
  };

  if (!isOpen) return null;

  const currentRoleConfig = ROLE_CONFIGS[activeRole];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-left"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-modal-title"
    >
      <div className="w-full max-w-4xl h-[92vh] sm:h-[88vh] bg-white dark:bg-[#0E241C] rounded-2xl shadow-2xl border border-[#C7DCD1] dark:border-[#2B5E4A] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#063B2A] text-white px-4 sm:px-6 py-3.5 border-b border-[#0B5D3B] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="gemini-modal-title" className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{language === 'hi' ? 'कृषि सहायक AI' : 'Krishi Sahayak AI'}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                    Gemini 3.5 Grounded
                  </span>
                </h2>
              </div>
              <p className="text-xs text-emerald-200/90 hidden sm:block">
                {language === 'hi' ? 'मंडी उपार्जन, गूगल मैप्स भू-स्थान एवं फसल मार्गदर्शन' : 'Procurement logistics, Google Maps grounding & agronomy assistance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Tab Switcher */}
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'chat' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'चैटबॉट' : 'Chat'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('locator');
                  if (!locatorResult) handleQueryLocator();
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'locator' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'hi' ? 'मंडी लोकेटर' : 'Maps Locator'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Header: Role & Model Configuration Controls */}
        <div className="bg-[#F4F7F5] dark:bg-[#143026] px-4 sm:px-6 py-2.5 border-b border-[#D7E3DC] dark:border-[#2B5E4A] flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          
          {/* Role selector buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap hidden md:inline">
              {language === 'hi' ? 'भूमिका:' : 'Role:'}
            </span>
            {(['mandi_logistics', 'agronomy_doctor', 'kisan_express'] as AssistantRole[]).map((roleKey) => {
              const roleInfo = ROLE_CONFIGS[roleKey];
              const isSelected = activeRole === roleKey;
              const IconComp = roleInfo.icon;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleChange(roleKey)}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? `${roleInfo.badgeColor} shadow-xs border`
                      : 'bg-white dark:bg-[#0E241C] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2B5E4A] hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? roleInfo.titleHi : roleInfo.titleEn}</span>
                </button>
              );
            })}
          </div>

          {/* Model Selector and Grounding Badge */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Model Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#0E241C] px-2 py-1 rounded-lg border border-slate-200 dark:border-[#2B5E4A]">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Model:
              </span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as GeminiModelType)}
                className="bg-transparent text-[11px] font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (General & Maps)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
              </select>
            </div>

            {/* Google Maps Grounding Toggle */}
            <button
              type="button"
              onClick={() => {
                if (selectedModel !== 'gemini-3.5-flash') {
                  setSelectedModel('gemini-3.5-flash');
                }
                setUseMapsGrounding(!useMapsGrounding);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                useMapsGrounding
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : 'bg-white dark:bg-[#0E241C] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#2B5E4A]'
              }`}
              title="Grounding with Google Maps uses live geospatial data"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Google Maps Grounding</span>
              <span className="sm:hidden">Maps</span>
              <span className="text-[9px] px-1 rounded bg-black/20">
                {useMapsGrounding ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: MULTI-TURN CHAT INTERFACE */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-[#091A14]">
            
            {/* Scrollable Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[#0B5D3B] text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                        <Bot className="w-4 h-4 text-amber-300" />
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-[#0B5D3B] text-white rounded-tr-xs shadow-xs'
                            : 'bg-white dark:bg-[#0E241C] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#2B5E4A] rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {/* Message Content rendered cleanly */}
                        <div className="whitespace-pre-line font-sans space-y-2">
                          {msg.content}
                        </div>

                        {/* Grounding Metadata Pill / Sources */}
                        {msg.groundingMetadata && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#2B5E4A] text-[11px] text-emerald-800 dark:text-emerald-300 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 font-bold">
                              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Google Maps Verified Data:</span>
                            </span>
                            {msg.groundingMetadata.webSearchQueries && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                Grounded on live Mandi sources
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer: Timestamp, Model Used, Speech Audio */}
                      <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {msg.modelUsed && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400">
                              {msg.modelUsed}
                            </span>
                          </>
                        )}
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg.id, msg.content)}
                            className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-0.5 rounded cursor-pointer transition-colors"
                            title="Listen to this message"
                          >
                            {speakingMessageId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-[#0B5D3B] text-white flex items-center justify-center flex-shrink-0 shadow-xs animate-pulse">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0E241C] border border-slate-200 dark:border-[#2B5E4A] rounded-tl-xs shadow-xs text-xs flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>
                      {selectedModel === 'gemini-3.1-pro-preview' 
                        ? 'Dr. Krishi is evaluating complex agronomy & policy rules...'
                        : useMapsGrounding 
                          ? 'Checking live Google Maps Mandi locations & logistics...' 
                          : 'Krishi Sahayak is generating response...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 bg-white dark:bg-[#0E241C] border-t border-slate-200 dark:border-[#2B5E4A] flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="font-bold text-slate-400 whitespace-nowrap">
                {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick Prompts:'}
              </span>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, language === 'hi' ? 'वर्धा जिले के प्रमुख सोयाबीन उपार्जन केंद्र व उनके पते बताइए' : 'List key Soyabean procurement centers and APMC mandis near Wardha')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#143026] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2B5E4A] whitespace-nowrap transition-colors cursor-pointer"
              >
                📍 {language === 'hi' ? 'निकटतम सोयाबीन उपार्जन केंद्र' : 'Nearby Soyabean Centers'}
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, language === 'hi' ? 'सोयाबीन का समर्थन मूल्य (MSP) और नमी की अधिकतम अनुमति सीमा क्या है?' : 'What is the current Soyabean MSP rate and maximum moisture allowance at mandi?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#143026] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2B5E4A] whitespace-nowrap transition-colors cursor-pointer"
              >
                🌾 {language === 'hi' ? 'MSP भाव व नमी सीमा' : 'MSP Rates & Moisture FAQ'}
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, language === 'hi' ? 'मंडी में टोकन जनरेट करने के लिए कौन से दस्तावेज आवश्यक हैं?' : 'What documents are required for digital token generation at the mandi?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#143026] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2B5E4A] whitespace-nowrap transition-colors cursor-pointer"
              >
                📑 {language === 'hi' ? 'टोकन दस्तावेज नियम' : 'Token Documentation'}
              </button>
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white dark:bg-[#0E241C] border-t border-slate-200 dark:border-[#2B5E4A] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'मंडी, स्लॉट पास, या फसल संबंधी अपना सवाल यहाँ पूछें...'
                    : 'Ask about mandis, slot booking, MSP, or crop guidance...'
                }
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A] text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#0B5D3B]"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hi' ? 'भेजें' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: DEDICATED GOOGLE MAPS GROUNDED MANDI LOCATOR */}
        {activeTab === 'locator' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#091A14] space-y-5 text-left">
            <div className="bg-white dark:bg-[#0E241C] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#2B5E4A] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <MapPin className="w-5 h-5 text-[#0B5D3B]" />
                <span>{language === 'hi' ? 'गूगल मैप्स समर्थित उपार्जन केंद्र लोकेटर' : 'Google Maps Grounded Mandi & Center Locator'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'hi' 
                  ? 'Gemini 3.5 Flash और Google Maps Grounding के माध्यम से वास्तविक, अद्यतन कृषि मंडियां, कांटे (Weighbridges) एवं वेयरहाउस खोजें।' 
                  : 'Locate verified APMC yards, MSP procurement centers, and grain warehouses powered by Gemini 3.5 Flash and the live Google Maps tool.'}
              </p>

              {/* Location query inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'जिला / तहसील / क्षेत्र:' : 'District / Tehsil / City:'}
                  </label>
                  <input
                    type="text"
                    value={locatorDistrict}
                    onChange={(e) => setLocatorDistrict(e.target.value)}
                    placeholder="e.g. Wardha, Maharashtra / Deoli Tehsil / Hinganghat"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A] text-xs font-semibold text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'फसल जिंस:' : 'Commodity:'}
                  </label>
                  <select
                    value={locatorCommodity}
                    onChange={(e) => setLocatorCommodity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#143026] border border-slate-200 dark:border-[#2B5E4A] text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="Soyabean">सोयाबीन (Soyabean)</option>
                    <option value="Cotton">कपास (Cotton)</option>
                    <option value="Wheat">गेहूं (Wheat)</option>
                    <option value="Paddy">धान (Paddy/Rice)</option>
                    <option value="Chana">चना (Gram/Pulses)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleQueryLocator()}
                  disabled={locatorLoading || !locatorDistrict.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {locatorLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>{language === 'hi' ? 'स्थान खोजें (Google Maps)' : 'Locate Centers (Maps)'}</span>
                </button>
              </div>
            </div>

            {/* Results Display */}
            {locatorResult && (
              <div className="bg-white dark:bg-[#0E241C] p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B5E4A]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                      {language === 'hi' ? `सत्यापित परिणाम: ${locatorResult.location}` : `Verified Centers in ${locatorResult.location}`}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Grounded with googleMaps
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {locatorResult.reply}
                </div>

                {locatorResult.groundingMetadata && (
                  <div className="pt-3 border-t border-slate-100 dark:border-[#2B5E4A] flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
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
