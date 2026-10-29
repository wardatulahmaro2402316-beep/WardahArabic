import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Languages,
  BookOpen,
  Filter,
  Sparkles,
} from 'lucide-react';
import { ReadingLesson, VocabularyItem } from '../types';
import { createArabicSpeechPlayer } from '../utils/audioPlayer';
import { removeTashkeel } from '../utils/arabicText';

interface VocabularyExplorerProps {
  lessons: ReadingLesson[];
  onAskAi: (q: string) => void;
}

export const VocabularyExplorer: React.FC<VocabularyExplorerProps> = ({ lessons, onAskAi }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const speechController = React.useMemo(() => createArabicSpeechPlayer(), []);

  // Aggregate vocabulary items
  const allVocab: (VocabularyItem & { chapterNumber: number; chapterTitle: string })[] = [];
  lessons.forEach((l) => {
    l.vocabulary.forEach((v) => {
      allVocab.push({
        ...v,
        chapterNumber: l.chapterNumber,
        chapterTitle: l.titleIndonesian,
      });
    });
  });

  const filteredVocab = allVocab.filter((item) => {
    const matchesChapter = selectedChapter === 'all' || item.chapterNumber === selectedChapter;
    const cleanSearch = searchTerm.trim().toLowerCase();
    if (!cleanSearch) return matchesChapter;

    const arabicMatch = removeTashkeel(item.arabic).toLowerCase().includes(cleanSearch);
    const indoMatch = item.indonesian.toLowerCase().includes(cleanSearch);
    const latinMatch = item.latin?.toLowerCase().includes(cleanSearch);

    return matchesChapter && (arabicMatch || indoMatch || latinMatch);
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <Languages className="w-3.5 h-3.5" />
              <span>Mu'jam al-Mufradat (مُعْجَمُ المُفْرَدَاتِ)</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Kamus Kosakata Maharah Qira'ah MA Kelas 10
            </h2>
            <p className="text-xs text-slate-500">
              Kumpulan kosakata penting kurikulum bahasa Arab Madrasah Aliyah lengkap dengan audio pengucapan dan contoh kalimat
            </p>
          </div>

          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-auto">
            Total {filteredVocab.length} Kosakata
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari arti dalam bahasa Indonesia atau kata Arab..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedChapter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedChapter === 'all'
                  ? 'bg-emerald-800 text-amber-300 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Bab
            </button>
            {lessons.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedChapter(l.chapterNumber)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedChapter === l.chapterNumber
                    ? 'bg-emerald-800 text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Bab {l.chapterNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vocab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  Bab {item.chapterNumber} • {item.type || 'isim'}
                </span>
                <button
                  onClick={() => speechController.speak(item.arabic, 0.85)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors"
                  title="Dengarkan pengucapan"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2 text-right">
                <span className="font-['Amiri'] text-3xl font-bold text-slate-900" dir="rtl">
                  {item.arabic}
                </span>
              </div>

              {item.latin && (
                <div className="text-xs text-slate-400 italic mt-1">{item.latin}</div>
              )}

              <div className="mt-2 text-sm font-bold text-emerald-950">
                {item.indonesian}
              </div>
            </div>

            {item.exampleArabic && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                <div className="text-xs font-semibold text-slate-400">Contoh Kalimat:</div>
                <div className="font-['Amiri'] text-base text-slate-800 text-right leading-relaxed" dir="rtl">
                  {item.exampleArabic}
                </div>
                {item.exampleIndonesian && (
                  <div className="text-xs text-slate-500">{item.exampleIndonesian}</div>
                )}
              </div>
            )}

            <div className="mt-3 pt-2 flex justify-end">
              <button
                onClick={() => onAskAi(`Jelaskan bentuk jamak, tasrif, atau sinonim dari kata "${item.arabic}" (${item.indonesian})`)}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Pelajari Lebih Dalam</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVocab.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
          Tidak ditemukan kosakata dengan kata kunci "{searchTerm}".
        </div>
      )}
    </div>
  );
};
