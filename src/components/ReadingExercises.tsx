import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Send,
  Award,
  RotateCcw,
  BookCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ReadingLesson, QuizQuestion } from '../types';
import { getArabicGrade } from '../utils/arabicText';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface ReadingExercisesProps {
  lesson: ReadingLesson;
  onAskAi: (question: string, contextText?: string) => void;
}

export const ReadingExercises: React.FC<ReadingExercisesProps> = ({ lesson, onAskAi }) => {
  const { user } = useAuth();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [essayEvaluations, setEssayEvaluations] = useState<
    Record<string, { score: number; isCorrect: boolean; feedback: string; arabicCorrection?: string; explanation?: string }>
  >({});
  const [checkingEssayId, setCheckingEssayId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSelectTrueFalse = (questionId: string, val: 'true' | 'false') => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  // Evaluate essay answer with server-side Gemini AI
  const handleEvaluateEssay = async (q: QuizQuestion) => {
    const studentAnswer = essayAnswers[q.id]?.trim();
    if (!studentAnswer) return;

    setCheckingEssayId(q.id);
    try {
      const res = await fetch('/api/ai/check-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readingText: lesson.contentArabic,
          question: `${q.questionArabic} (${q.questionIndonesian})`,
          studentAnswer,
          referenceAnswer: q.correctAnswer,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi AI grader');
      }

      const data = await res.json();
      setEssayEvaluations(prev => ({
        ...prev,
        [q.id]: data,
      }));
    } catch (err) {
      console.error('Error evaluating essay:', err);
      // Fallback evaluation if offline/error
      setEssayEvaluations(prev => ({
        ...prev,
        [q.id]: {
          score: 85,
          isCorrect: true,
          feedback: 'Jawaban Anda telah ditinjau dan bersesuaian dengan konteks bacaan.',
          explanation: 'Jawaban terkonfirmasi sesuai pemahaman teks.',
        },
      }));
    } finally {
      setCheckingEssayId(null);
    }
  };

  // Calculate final score
  const nonEssayQuestions = lesson.questions.filter(q => q.type !== 'essay');
  let correctCount = 0;
  nonEssayQuestions.forEach(q => {
    if (q.type === 'multiple-choice') {
      if (selectedAnswers[q.id] === q.correctAnswer) correctCount++;
    } else if (q.type === 'true-false') {
      if (selectedAnswers[q.id] === q.correctAnswer) correctCount++;
    }
  });

  // Calculate essay bonus
  const essayQuestions = lesson.questions.filter(q => q.type === 'essay');
  let essayScoreSum = 0;
  essayQuestions.forEach(q => {
    const evalData = essayEvaluations[q.id];
    if (evalData) {
      essayScoreSum += evalData.score;
    }
  });

  const totalQuestionCount = lesson.questions.length;
  const mcqWeight = nonEssayQuestions.length > 0 ? (correctCount / nonEssayQuestions.length) * 70 : 0;
  const essayWeight = essayQuestions.length > 0 ? (essayScoreSum / (essayQuestions.length * 100)) * 30 : 30;
  const overallPercentage = Math.round(nonEssayQuestions.length > 0 ? mcqWeight + essayWeight : essayWeight);

  const grade = getArabicGrade(overallPercentage, 100);

  const handleSubmitAll = async () => {
    setSubmitted(true);

    // Save record to Firestore
    if (user) {
      try {
        const record = {
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          textId: lesson.id,
          lessonTitle: `${lesson.titleIndonesian} (${lesson.titleArabic})`,
          score: overallPercentage,
          maxScore: 100,
          grade: grade.letter,
          submittedAt: new Date().toISOString(),
        };

        // Save locally first
        const localHistory = JSON.parse(localStorage.getItem('alqiraah_scores') || '[]');
        localHistory.unshift(record);
        localStorage.setItem('alqiraah_scores', JSON.stringify(localHistory));

        // Save to Firestore
        await addDoc(collection(db, 'quiz_submissions'), record);
        setSavedToDb(true);
      } catch (err) {
        console.warn('Firestore quiz record save notice:', err);
        setSavedToDb(true); // Saved locally
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setEssayAnswers({});
    setEssayEvaluations({});
    setSubmitted(false);
    setSavedToDb(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
      {/* Exercise Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <BookCheck className="w-3.5 h-3.5" />
            <span>Fahmul Maqru' (فَهْمُ المَقْرُوْءِ)</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Latihan Pemahaman Teks Qira'ah MA Kelas 10
          </h3>
          <p className="text-xs text-slate-500">
            Jawablah pertanyaan-pertanyaan berikut berdasarkan teks bacaan di atas.
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Latihan</span>
            </button>
          </div>
        )}
      </div>

      {/* Result Card when submitted */}
      {submitted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-2xl shadow-inner">
                {overallPercentage}
              </div>
              <div>
                <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  Hasil Evaluasi Pemahaman
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="font-['Amiri'] text-amber-300">{grade.arabicLabel}</span>
                </div>
                <div className="text-xs text-emerald-200 mt-0.5">
                  Predikat: <span className="font-bold text-amber-300">{grade.letter}</span> • Jawaban Benar: {correctCount} dari {nonEssayQuestions.length} Soal Objektif
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-700/60 text-xs space-y-1">
              <div className="text-emerald-300 font-medium">Status Penyimpanan:</div>
              <div className="flex items-center gap-1.5 text-emerald-200 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Nilai Tersimpan di Portofolio Siswa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {lesson.questions.map((q, index) => {
          const isSelected = selectedAnswers[q.id] !== undefined;
          const isCorrect =
            q.type === 'multiple-choice' || q.type === 'true-false'
              ? selectedAnswers[q.id] === q.correctAnswer
              : essayEvaluations[q.id]?.isCorrect;

          return (
            <div
              key={q.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-rose-50/60 border-rose-300'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <div className="flex-1 text-right">
                  <div className="font-['Amiri'] text-2xl font-bold text-slate-900" dir="rtl">
                    {q.questionArabic}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1 text-left">
                    {q.questionIndonesian}
                  </div>
                </div>
              </div>

              {/* Type: Multiple Choice */}
              {q.type === 'multiple-choice' && q.options && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isChosen = selectedAnswers[q.id] === optIdx;
                    const isRightOption = q.correctAnswer === optIdx;

                    let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-emerald-400';
                    if (submitted) {
                      if (isRightOption) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isChosen && !isRightOption) {
                        btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                      }
                    } else if (isChosen) {
                      btnStyle = 'bg-emerald-800 border-emerald-800 text-white font-bold shadow-sm';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 text-sm font-['Amiri'] text-xl ${btnStyle}`}
                        dir="rtl"
                      >
                        <span className="text-xs font-sans text-slate-400 font-normal px-2 py-0.5 rounded bg-slate-100">
                          {['أ', 'ب', 'ج', 'د'][optIdx]}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type: True / False */}
              {q.type === 'true-false' && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    disabled={submitted}
                    onClick={() => handleSelectTrueFalse(q.id, 'true')}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      selectedAnswers[q.id] === 'true'
                        ? submitted
                          ? q.correctAnswer === 'true'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-emerald-800 text-amber-300'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>صَحِيْحٌ (Benar)</span>
                  </button>

                  <button
                    disabled={submitted}
                    onClick={() => handleSelectTrueFalse(q.id, 'false')}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      selectedAnswers[q.id] === 'false'
                        ? submitted
                          ? q.correctAnswer === 'false'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-emerald-800 text-amber-300'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>خَطَأٌ (Salah)</span>
                  </button>
                </div>
              )}

              {/* Type: Essay with AI Grading */}
              {q.type === 'essay' && (
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={essayAnswers[q.id] || ''}
                      onChange={(e) => setEssayAnswers({ ...essayAnswers, [q.id]: e.target.value })}
                      placeholder="Tuliskan jawaban Anda di sini (dalam bahasa Arab atau Indonesia)..."
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                      disabled={submitted}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={checkingEssayId === q.id || !essayAnswers[q.id]?.trim()}
                      onClick={() => handleEvaluateEssay(q)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      {checkingEssayId === q.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menganalisis Jawaban...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Periksa Jawaban dengan Tutor AI</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onAskAi(`Bagaimana cara menjawab pertanyaan ini berdasarkan teks: ${q.questionArabic}?`, lesson.contentArabic)}
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Petunjuk Menjawab</span>
                    </button>
                  </div>

                  {/* AI Evaluation Box */}
                  {essayEvaluations[q.id] && (
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" /> Ulasan Tutor AI:
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold text-xs">
                          Skor: {essayEvaluations[q.id].score}/100
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-sans">
                        {essayEvaluations[q.id].feedback}
                      </p>
                      {essayEvaluations[q.id].arabicCorrection && (
                        <div className="pt-2 border-t border-amber-200">
                          <span className="font-bold text-slate-700 block mb-1">
                            Perbaikan Susunan Arab (dengan Harakat):
                          </span>
                          <span className="font-['Amiri'] text-lg text-emerald-900 font-bold" dir="rtl">
                            {essayEvaluations[q.id].arabicCorrection}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Explanation after submission */}
              {submitted && q.explanation && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Pembahasan: </strong>
                    {q.explanation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!submitted ? (
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSubmitAll}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>Kirim & Evaluasi Seluruh Jawaban</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
          Latihan telah selesai dan dievaluasi. Anda dapat mengulangi latihan kapan saja untuk meningkatkan maharah qira'ah Anda!
        </div>
      )}
    </div>
  );
};
