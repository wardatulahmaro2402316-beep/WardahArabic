import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { ReadingReader } from './components/ReadingReader';
import { VocabularyExplorer } from './components/VocabularyExplorer';
import { SentenceAnalyzerModal } from './components/SentenceAnalyzerModal';
import { AdminPanel } from './components/AdminPanel';
import { AiTutorDrawer } from './components/AiTutorDrawer';
import { INITIAL_LESSONS } from './data/initialLessons';
import { ReadingLesson } from './types';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const MainApp: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();
  const [lessons, setLessons] = useState<ReadingLesson[]>(INITIAL_LESSONS);
  const [selectedLesson, setSelectedLesson] = useState<ReadingLesson>(INITIAL_LESSONS[0]);
  const [activeTab, setActiveTab] = useState<'reading' | 'vocab' | 'analyzer' | 'admin'>('reading');

  // AI Tutor drawer state
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [aiQuestionPrompt, setAiQuestionPrompt] = useState<string | undefined>(undefined);

  // Sentence Analyzer state
  const [analyzerTargetSentence, setAnalyzerTargetSentence] = useState<string | undefined>(undefined);

  // Load custom lessons from Firestore if available
  useEffect(() => {
    async function loadRemoteLessons() {
      try {
        const querySnapshot = await getDocs(collection(db, 'reading_texts'));
        if (!querySnapshot.empty) {
          const remoteList: ReadingLesson[] = [];
          querySnapshot.forEach((d) => {
            remoteList.push({ id: d.id, ...d.data() } as ReadingLesson);
          });
          // Merge with initial lessons
          const merged = [...INITIAL_LESSONS];
          remoteList.forEach((r) => {
            if (!merged.some((m) => m.id === r.id)) {
              merged.push(r);
            }
          });
          setLessons(merged);
        }
      } catch (e) {
        console.warn('Notice loading remote lessons:', e);
      }
    }
    loadRemoteLessons();
  }, []);

  const handleAddLesson = async (newLesson: ReadingLesson) => {
    const updated = [...lessons, newLesson];
    setLessons(updated);
    setSelectedLesson(newLesson);
    // Attempt saving to Firestore
    try {
      await setDoc(doc(db, 'reading_texts', newLesson.id), newLesson);
    } catch (e) {
      console.warn('Saved lesson locally:', e);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    const updated = lessons.filter((l) => l.id !== lessonId);
    setLessons(updated);
    if (selectedLesson.id === lessonId && updated.length > 0) {
      setSelectedLesson(updated[0]);
    }
  };

  const handleOpenAiWithQuestion = (question: string) => {
    setAiQuestionPrompt(question);
    setIsAiTutorOpen(true);
  };

  const handleOpenSentenceAnalyzer = (sentence: string) => {
    setAnalyzerTargetSentence(sentence);
    setActiveTab('analyzer');
  };

  // Enforce mandatory login: if not logged in, show LoginPage
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-emerald-300 text-sm font-semibold">
          Memuat Al-Qira'ah MA Kelas 10...
        </p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* App Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiTutor={() => {
          setAiQuestionPrompt(undefined);
          setIsAiTutorOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'reading' && (
          <ReadingReader
            lesson={selectedLesson}
            allLessons={lessons}
            onSelectLesson={setSelectedLesson}
            onAskAi={handleOpenAiWithQuestion}
            onAnalyzeSentence={handleOpenSentenceAnalyzer}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabularyExplorer
            lessons={lessons}
            onAskAi={handleOpenAiWithQuestion}
          />
        )}

        {activeTab === 'analyzer' && (
          <SentenceAnalyzerModal
            initialSentence={analyzerTargetSentence}
            onAskAi={handleOpenAiWithQuestion}
          />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminPanel
            lessons={lessons}
            onAddLesson={handleAddLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        )}
      </main>

      {/* Ustadz AI Tutor Side Drawer */}
      <AiTutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => {
          setIsAiTutorOpen(false);
          setAiQuestionPrompt(undefined);
        }}
        initialQuestion={aiQuestionPrompt}
        currentLessonContext={selectedLesson?.contentArabic}
        currentLessonTitle={`${selectedLesson?.titleIndonesian} (${selectedLesson?.titleArabic})`}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 py-6 border-t border-emerald-900 text-center text-xs space-y-1">
        <p className="font-semibold text-white">
          Al-Qira'ah MA Kelas 10 • Media Pembelajaran Bahasa Arab Berbasis Kurikulum Madrasah Aliyah
        </p>
        <p className="text-emerald-400">
          Dilengkapi Evaluasi Mandiri, Audio Qari, dan Asisten Tutor AI
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
