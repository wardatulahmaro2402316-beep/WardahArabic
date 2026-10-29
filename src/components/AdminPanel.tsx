import React, { useState, useEffect } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  Save,
  X,
  FileText,
  Calendar,
} from 'lucide-react';
import { ReadingLesson, QuizSubmissionRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface AdminPanelProps {
  lessons: ReadingLesson[];
  onAddLesson: (newLesson: ReadingLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  lessons,
  onAddLesson,
  onDeleteLesson,
}) => {
  const { user } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'lessons' | 'scores' | 'new-lesson'>('lessons');
  const [submissions, setSubmissions] = useState<QuizSubmissionRecord[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);

  // Form state for creating a new lesson
  const [newChapterNum, setNewChapterNum] = useState<number>(lessons.length + 1);
  const [newTitleArabic, setNewTitleArabic] = useState('');
  const [newTitleIndo, setNewTitleIndo] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newContentArabic, setNewContentArabic] = useState('');
  const [newContentTranslation, setNewContentTranslation] = useState('');

  // Fetch student quiz scores from Firestore or local storage
  const fetchScores = async () => {
    setLoadingScores(true);
    try {
      const snapshot = await getDocs(collection(db, 'quiz_submissions'));
      const list: QuizSubmissionRecord[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as QuizSubmissionRecord);
      });

      // Also merge local scores if any
      const local = JSON.parse(localStorage.getItem('alqiraah_scores') || '[]');
      const combined = [...list, ...local];
      // Deduplicate by ID or submission time
      const unique = Array.from(new Map(combined.map(item => [item.submittedAt + item.userEmail, item])).values());
      setSubmissions(unique);
    } catch (err) {
      console.warn('Firestore get submissions fallback:', err);
      const local = JSON.parse(localStorage.getItem('alqiraah_scores') || '[]');
      setSubmissions(local);
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleArabic || !newTitleIndo || !newContentArabic) return;

    const newLesson: ReadingLesson = {
      id: `bab-${newChapterNum}-${Date.now()}`,
      chapterNumber: Number(newChapterNum),
      titleArabic: newTitleArabic,
      titleIndonesian: newTitleIndo,
      theme: newTheme || 'القراءة لِلصَّفِّ العَاشِرِ',
      contentArabic: newContentArabic,
      contentTranslation: newContentTranslation,
      vocabulary: [
        {
          id: `v-${Date.now()}-1`,
          arabic: newTitleArabic.split(' ')[0] || 'كَلِمَةٌ',
          indonesian: newTitleIndo.split(' ')[0] || 'Kata',
        },
      ],
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: 'multiple-choice',
          questionArabic: 'عَمَّ يَتَحَدَّثُ هَذَا النَّصُّ؟',
          questionIndonesian: 'Tentang apakah teks bacaan ini berbicara?',
          options: [newTitleIndo, 'مَوْضُوْعٌ آخَرُ', 'لَيْسَ مِمَّا ذُكِرَ'],
          correctAnswer: 0,
          explanation: 'Sesuai dengan judul bab.',
        },
      ],
    };

    onAddLesson(newLesson);
    // Reset form
    setNewTitleArabic('');
    setNewTitleIndo('');
    setNewTheme('');
    setNewContentArabic('');
    setNewContentTranslation('');
    setActiveAdminTab('lessons');
  };

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Panel Pengampu / Admin</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Dasbor Guru Pengampu Maharah Qira'ah MA Kelas 10
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Login sebagai: <strong className="text-amber-300">{user?.email}</strong> ({user?.displayName})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('new-lesson')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Materi Qira'ah</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveAdminTab('lessons')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeAdminTab === 'lessons'
              ? 'bg-emerald-800 text-amber-300 shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kelola Teks Qira'ah ({lessons.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveAdminTab('scores');
            fetchScores();
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeAdminTab === 'scores'
              ? 'bg-emerald-800 text-amber-300 shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Riwayat Nilai Latihan Siswa ({submissions.length})</span>
        </button>
      </div>

      {/* Tab: Kelola Teks Qira'ah */}
      {activeAdminTab === 'lessons' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span>Daftar Modul Teks Qira'ah MA Kelas 10</span>
          </h3>

          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs">
                      Bab {lesson.chapterNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Tema: {lesson.theme}
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {lesson.titleIndonesian}
                  </div>
                  <div className="font-['Amiri'] text-2xl font-bold text-emerald-950 mt-1" dir="rtl">
                    {lesson.titleArabic}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center gap-4">
                    <span>{lesson.vocabulary.length} Kosakata</span>
                    <span>•</span>
                    <span>{lesson.questions.length} Soal Evaluasi</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => onDeleteLesson(lesson.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Hapus materi ini"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Form Tambah Materi Qira'ah */}
      {activeAdminTab === 'new-lesson' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                <span>Formulir Tambah Materi Teks Qira'ah Baru</span>
              </h3>
              <p className="text-xs text-slate-500">
                Lengkapi judul bahasa Arab berharakat, judul bahasa Indonesia, dan naskah bacaan
              </p>
            </div>
            <button
              onClick={() => setActiveAdminTab('lessons')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateLesson} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nomor Bab:
                </label>
                <input
                  type="number"
                  min="1"
                  value={newChapterNum}
                  onChange={(e) => setNewChapterNum(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tema Bab:
                </label>
                <input
                  type="text"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  placeholder="Contoh: الهواية / المدرسة"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Teks Bahasa Arab (Berharakat):
                </label>
                <input
                  type="text"
                  value={newTitleArabic}
                  onChange={(e) => setNewTitleArabic(e.target.value)}
                  placeholder="Contoh: التَّعَارُفُ فِي الفَصْلِ"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-['Amiri'] text-xl focus:ring-2 focus:ring-emerald-700 text-right"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Teks Bahasa Indonesia:
                </label>
                <input
                  type="text"
                  value={newTitleIndo}
                  onChange={(e) => setNewTitleIndo(e.target.value)}
                  placeholder="Contoh: Perkenalan di Kelas Baru"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Naskah Bacaan Qira'ah (Teks Arab Berharakat Lengkap):
              </label>
              <textarea
                rows={6}
                value={newContentArabic}
                onChange={(e) => setNewContentArabic(e.target.value)}
                placeholder="Tuliskan naskah teks qira'ah di sini dengan harakat lengkap..."
                className="w-full p-3.5 rounded-xl border border-slate-300 font-['Amiri'] text-2xl leading-loose focus:ring-2 focus:ring-emerald-700 text-right"
                dir="rtl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Terjemahan Bahasa Indonesia:
              </label>
              <textarea
                rows={4}
                value={newContentTranslation}
                onChange={(e) => setNewContentTranslation(e.target.value)}
                placeholder="Terjemahan teks per paragraf..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm leading-relaxed focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveAdminTab('lessons')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Teks Qira'ah</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Riwayat Nilai Latihan Siswa */}
      {activeAdminTab === 'scores' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span>Daftar Riwayat Nilai Maharah Qira'ah Siswa</span>
            </h3>

            <button
              onClick={fetchScores}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Perbarui Data
            </button>
          </div>

          {loadingScores ? (
            <div className="py-8 text-center text-xs text-slate-500">Memuat data nilai siswa...</div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Belum ada riwayat pengerjaan latihan siswa. Nilai akan otomatis muncul ketika siswa menyelesaikan kuis pemahaman.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">Materi Qira'ah</th>
                    <th className="py-3 px-4">Skor</th>
                    <th className="py-3 px-4">Predikat</th>
                    <th className="py-3 px-4">Waktu Pengerjaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {sub.userName}
                        <div className="text-[11px] text-slate-400 font-normal">{sub.userEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">{sub.lessonTitle}</td>
                      <td className="py-3.5 px-4 font-extrabold text-base text-emerald-800">
                        {sub.score}/100
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          {sub.grade || 'Mumtaz'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
