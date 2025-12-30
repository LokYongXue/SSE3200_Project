import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Shield, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { GeminiService } from '../services/geminiService';

interface ChatBotProps {
  initialMessage?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: initialMessage ? `I see you're interested in ${initialMessage}. How can I assist you with that?` : "Hi there! I'm your Mind.IO assistant. I can help match you with a counsellor or just listen if you need to vent. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await GeminiService.chat(userMsg.text, history);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary/10 p-3 flex justify-between items-center border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-full">
            <Bot size={18} />
          </div>
          <span className="font-semibold text-primary text-sm">Mind.IO AI Support</span>
        </div>
        <button 
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all ${isAnonymous ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          <Shield size={12} />
          {isAnonymous ? 'Anon Mode ON' : 'Anon Mode OFF'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-teal-500'} text-white`}>
                {msg.role === 'user' ? (isAnonymous ? <Shield size={14}/> : <UserIcon size={14}/>) : <Bot size={14}/>}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-teal-500" />
              <span className="text-xs text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isAnonymous ? "Type anonymously..." : "Type a message..."}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;