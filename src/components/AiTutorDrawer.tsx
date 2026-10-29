import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  HelpCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { createArabicSpeechPlayer } from '../utils/audioPlayer';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  currentLessonContext?: string;
  currentLessonTitle?: string;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  initialQuestion,
  currentLessonContext,
  currentLessonTitle,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-intro',
      sender: 'ai',
      text: `أَهْلًا وَسَهْلًا بِكُمْ!
Saya adalah **Ustadz AI**, tutor interaktif Maharah Qira'ah MA Kelas 10.
Silakan tanyakan apa saja seputar teks bacaan, kosakata sulit (mufradat), harakat, kaidah nahwu-shorof dasar, atau cara memahami isi teks.`,
      time: 'Baru saja',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechController = React.useMemo(() => createArabicSpeechPlayer(), []);

  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          contextText: currentLessonContext || '',
          title: currentLessonTitle || 'Teks Qiraah MA 10',
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi server Ustadz AI.');
      }

      const data = await res.json();
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Maaf, belum ada jawaban dari tutor.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kendala pada Ustadz AI.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ ${errorMsg}\nSilakan pastikan koneksi internet stabil atau coba pertanyaan lain.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakArabic = (text: string) => {
    // Extract Arabic words from response
    const arabicParts = text.match(/[\u0600-\u06FF\s،؛؟!]+/g);
    if (arabicParts && arabicParts.length > 0) {
      speechController.speak(arabicParts.join(' '), 0.85);
    } else {
      speechController.speak(text, 0.85);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                Ustadz AI <span className="text-[10px] bg-emerald-800 px-1.5 py-0.5 rounded text-amber-300 font-semibold">Tutor Qira'ah</span>
              </h3>
              <p className="text-[11px] text-emerald-200">
                Didukung Gemini AI Server-Side
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Lesson Badge */}
        {currentLessonTitle && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-900 flex items-center gap-1.5 font-medium truncate">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">Konteks: {currentLessonTitle}</span>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => speakArabic(m.text)}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      title="Dengarkan pelafalan Arab"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Putar Audio</span>
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 italic p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
              <span>Ustadz AI sedang memproses penjelasan...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto flex gap-1.5 text-xs">
          {[
            'Jelaskan kaidah nahwu di paragraf 1',
            'Sebutkan 3 kosakata kunci & artinya',
            'Bagaimana cara membaca waqaf di sini?',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 whitespace-nowrap text-[11px] font-medium transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan mufradat, harakat, atau kaidah..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
