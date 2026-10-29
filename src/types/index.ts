export type UserRole = 'admin' | 'student';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  schoolClass?: string;
  photoURL?: string;
}

export interface VocabularyItem {
  id: string;
  arabic: string;
  latin?: string;
  indonesian: string;
  type?: 'isim' | 'fiil' | 'harf';
  exampleArabic?: string;
  exampleIndonesian?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  questionArabic: string;
  questionIndonesian: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | number; // index or boolean string or model answer
  explanation?: string;
}

export interface ReadingLesson {
  id: string;
  chapterNumber: number;
  titleArabic: string;
  titleIndonesian: string;
  theme: string;
  contentArabic: string;
  contentTranslation: string;
  vocabulary: VocabularyItem[];
  questions: QuizQuestion[];
  qawaidSummary?: {
    topic: string;
    description: string;
    examples: { arabic: string; explanation: string }[];
  };
  audioGuideText?: string;
}

export interface QuizSubmissionRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  textId: string;
  lessonTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  submittedAt: string;
}
