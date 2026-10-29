import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Eye,
  EyeOff,
  Type,
  Sparkles,
  ChevronRight,
  GraduationCap,
  ListCheck,
  Languages,
} from 'lucide-react';
import { ReadingLesson, VocabularyItem } from '../types';
import { createArabicSpeechPlayer } from '../utils/audioPlayer';
import { removeTashkeel, calculateReadingStats } from '../utils/arabicText';
import { ReadingExercises } from './ReadingExercises';

interface ReadingReaderProps {
  lesson: ReadingLesson;
  allLessons: ReadingLesson[];
  onSelectLesson: (lesson: ReadingLesson) => void;
  onAskAi: (question: string, contextText?: string) => void;
  onAnalyzeSentence: (sentence: string) => void;
}

export const ReadingReader: React.FC<ReadingReaderProps> = ({
  lesson,
  allLessons,
  onSelectLesson,
  onAskAi,
  onAnalyzeSentence,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'text' | 'vocab' | 'qawaid' | 'exercise'>('text');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(0.85);
  const [showHarakat, setShowHarakat] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');
  const [selectedWord, setSelectedWord] = useState<{ word: string; vocab?: VocabularyItem } | null>(null);

  const speechController = React.useMemo(() => createArabicSpeechPlayer(), []);

  // Stop speech when changing lesson or unmounting
  useEffect(() => {
    speechController.stop();
    setIsPlaying(false);
    setSelectedWord(null);
    return () => {
      speechController.stop();
    };
  }, [lesson.id, speechController]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      speechController.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speechController.speak(lesson.contentArabic, playbackRate, () => {
        setIsPlaying(false);
      });
    }
  };

  const handlePlayWord = (wordText: string) => {
    speechController.speak(wordText, 0.8);
  };

  const stats = calculateReadingStats(lesson.contentArabic);

  const fontClasses = {
    normal: 'text-2xl leading-loose',
    large: 'text-3xl leading-[2.6rem]',
    xl: 'text-4xl leading-[3.4rem]',
  }[fontSize];

  // Match words from vocabulary list
  const findVocab = (word: string) => {
    const cleanWord = removeTashkeel(word).trim();
    return lesson.vocabulary.find(v => removeTashkeel(v.arabic).includes(cleanWord) || cleanWord.includes(removeTashkeel(v.arabic)));
  };

  return (
    <div className="space-y-6">
      {/* Chapter Selection Bar */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 overflow-x-auto flex items-center gap-2">
        {allLessons.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              onSelectLesson(l);
              setActiveSubTab('text');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              l.id === lesson.id
                ? 'bg-emerald-800 text-amber-300 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-900/20 flex items-center justify-center text-xs font-bold">
              {l.chapterNumber}
            </span>
            <span className="font-['Amiri'] text-base" dir="rtl">{l.titleArabic}</span>
          </button>
        ))}
      </div>

      {/* Lesson Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-700">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Bab {lesson.chapterNumber}</span> • <span>Tema: {lesson.theme}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lesson.titleIndonesian}
            </h2>
            <div className="font-['Amiri'] text-3xl sm:text-4xl text-amber-200 mt-2" dir="rtl">
              {lesson.titleArabic}
            </div>
          </div>

          {/* Quick reading stats */}
          <div className="flex items-center gap-3 bg-emerald-950/60 backdrop-blur-sm p-3.5 rounded-2xl border border-emerald-700/50 self-start md:self-auto">
            <div className="text-center px-3 border-r border-emerald-800">
              <div className="text-xs text-emerald-300">Kosakata</div>
              <div className="text-lg font-bold text-white">{stats.wordCount} Kata</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-emerald-300">Estimasi Baca</div>
              <div className="text-lg font-bold text-amber-300">{stats.estimatedMinutes} Menit</div>
            </div>
          </div>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="mt-8 pt-4 border-t border-emerald-700/60 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('text')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'text'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Teks & Audio Qira'ah</span>
          </button>

          <button
            onClick={() => setActiveSubTab('vocab')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'vocab'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Mufradat Bab ({lesson.vocabulary.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('exercise')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'exercise'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>Latihan Pemahaman ({lesson.questions.length})</span>
          </button>

          {lesson.qawaidSummary && (
            <button
              onClick={() => setActiveSubTab('qawaid')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeSubTab === 'qawaid'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Kaidah Qawa'id</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'text' && (
        <div className="space-y-6">
          {/* Reader Toolbar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  isPlaying
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Hentikan Audio' : 'Putar Audio Qari'}</span>
              </button>

              {/* Speed selector */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold text-slate-700">
                {[0.75, 0.85, 1.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      if (isPlaying) {
                        speechController.speak(lesson.contentArabic, rate);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      playbackRate === rate ? 'bg-white shadow text-emerald-800 font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    {rate === 0.75 ? 'Lambat' : rate === 0.85 ? 'Santai' : 'Normal'}
                  </button>
                ))}
              </div>
            </div>

            {/* View Customizations */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tashkeel toggle */}
              <button
                onClick={() => setShowHarakat(!showHarakat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  showHarakat
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="Tampilkan atau sembunyikan harakat untuk latihan membaca tanpa harakat"
              >
                {showHarakat ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showHarakat ? 'Harakat Aktif' : 'Teks Gundul'}</span>
              </button>

              {/* Translation toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  showTranslation
                    ? 'bg-teal-50 text-teal-800 border-teal-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{showTranslation ? 'Tutup Terjemah' : 'Lihat Terjemah'}</span>
              </button>

              {/* Font size adjuster */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-bold text-slate-700">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'normal' ? 'bg-white shadow text-emerald-800' : ''}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'large' ? 'bg-white shadow text-emerald-800' : ''}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize('xl')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'xl' ? 'bg-white shadow text-emerald-800' : ''}`}
                >
                  A++
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Arabic Reading Surface */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <div className="mb-4 text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Sparkles className="w-4 h-4" /> Tips: Klik kata apapun dalam teks untuk melihat arti kosakata atau memutar pengucapannya!
              </span>
              <button
                onClick={() => onAnalyzeSentence(lesson.contentArabic.split('\n')[0] || '')}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 underline underline-offset-2"
              >
                Bedah Nahwu Kalimat Pertama
              </button>
            </div>

            {/* Arabic Paragraphs */}
            <div className="space-y-6">
              {lesson.contentArabic.split('\n\n').map((paragraph, pIdx) => {
                const words = paragraph.split(' ');
                const displayParagraph = showHarakat ? paragraph : removeTashkeel(paragraph);

                return (
                  <div key={pIdx} className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 transition-colors">
                    <p
                      dir="rtl"
                      className={`font-['Amiri'] ${fontClasses} text-slate-900 text-right select-text tracking-wide`}
                    >
                      {words.map((wordWithPunc, wIdx) => {
                        const cleanWord = removeTashkeel(wordWithPunc);
                        const vocab = findVocab(wordWithPunc);
                        const isMatch = Boolean(vocab);

                        return (
                          <span
                            key={wIdx}
                            onClick={() => {
                              setSelectedWord({
                                word: wordWithPunc,
                                vocab,
                              });
                              handlePlayWord(wordWithPunc);
                            }}
                            className={`inline-block px-1 rounded cursor-pointer transition-all ${
                              isMatch
                                ? 'hover:bg-amber-100 hover:text-amber-900 decoration-amber-400 underline decoration-dotted underline-offset-8'
                                : 'hover:bg-emerald-100 hover:text-emerald-900'
                            }`}
                            title="Klik untuk arti kata & audio"
                          >
                            {showHarakat ? wordWithPunc : removeTashkeel(wordWithPunc)}{' '}
                          </span>
                        );
                      })}
                    </p>

                    {/* Optional Inline Indonesian Translation */}
                    {showTranslation && (
                      <div className="mt-4 pt-3 border-t border-slate-200 text-sm text-slate-700 leading-relaxed font-sans bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        <span className="font-semibold text-emerald-800 text-xs block mb-1">
                          Terjemahan Alinea {pIdx + 1}:
                        </span>
                        {lesson.contentTranslation.split('\n\n')[pIdx] || ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Word Popover / Action Card */}
          {selectedWord && (
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-['Amiri'] text-2xl font-bold text-slate-900" dir="rtl">
                    {selectedWord.word}
                  </span>
                  <button
                    onClick={() => handlePlayWord(selectedWord.word)}
                    className="p-1.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                    title="Dengarkan pengucapan kata"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {selectedWord.vocab?.type && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900 uppercase">
                      {selectedWord.vocab.type}
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-800">
                  <span className="font-bold">Arti / Makna: </span>
                  {selectedWord.vocab?.indonesian || 'Klik tombol tanya AI untuk terjemahan lengkap dan konteks kalimat.'}
                </div>
                {selectedWord.vocab?.exampleArabic && (
                  <div className="text-xs text-slate-600 font-['Amiri']" dir="rtl">
                    مثال: {selectedWord.vocab.exampleArabic}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAskAi(`Apa makna, kedudukan nahwu, dan contoh kalimat dari kata "${selectedWord.word}" dalam teks qira'ah ini?`, lesson.contentArabic)}
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tanya Tutor AI</span>
                </button>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary SubTab */}
      {activeSubTab === 'vocab' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-emerald-700" />
              <span>Daftar Mufradat Penting (Bab {lesson.chapterNumber})</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {lesson.vocabulary.length} Kosakata Kunci
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.vocabulary.map((vocab) => (
              <div
                key={vocab.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => handlePlayWord(vocab.arabic)}
                      className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                      title="Dengarkan pengucapan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="font-['Amiri'] text-2xl font-bold text-slate-900" dir="rtl">
                      {vocab.arabic}
                    </span>
                  </div>
                  {vocab.latin && (
                    <div className="text-xs text-slate-500 italic mt-1">{vocab.latin}</div>
                  )}
                  <div className="mt-2 text-sm font-semibold text-emerald-900">
                    {vocab.indonesian}
                  </div>
                </div>

                {vocab.exampleArabic && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs space-y-1">
                    <div className="font-['Amiri'] text-base text-slate-800 text-right" dir="rtl">
                      {vocab.exampleArabic}
                    </div>
                    {vocab.exampleIndonesian && (
                      <div className="text-slate-500">{vocab.exampleIndonesian}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercises SubTab (MCQ, True/False, AI Essay) */}
      {activeSubTab === 'exercise' && (
        <ReadingExercises
          lesson={lesson}
          onAskAi={onAskAi}
        />
      )}

      {/* Qawa'id SubTab */}
      {activeSubTab === 'qawaid' && lesson.qawaidSummary && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {lesson.qawaidSummary.topic}
              </h3>
              <p className="text-xs text-slate-500">
                Kaidah Tata Bahasa Arab Penunjang Pemahaman Qira'ah MA Kelas 10
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-sm text-slate-800 leading-relaxed">
            {lesson.qawaidSummary.description}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Contoh Kalimat & Pembahasannya:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.qawaidSummary.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-['Amiri'] text-xl text-emerald-900 text-right font-bold" dir="rtl">
                    {ex.arabic}
                  </div>
                  <div className="text-xs text-slate-700 leading-normal">
                    {ex.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onAskAi(`Jelaskan kaidah ${lesson.qawaidSummary?.topic} secara lebih mendalam dengan contoh-contoh yang ada dalam teks qira'ah bab ${lesson.chapterNumber}`, lesson.contentArabic)}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tanya Penjelasan Kaidah ke Ustadz AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
