/**
 * Utility functions for Arabic text processing, Maharah Qira'ah analysis, and scoring
 */

// Regex for Arabic harakat / diacritics
const HARAKAT_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;

/**
 * Remove harakat (tashkeel) from Arabic string
 */
export function removeTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(HARAKAT_REGEX, '');
}

/**
 * Normalize Arabic characters for robust search and comparison
 * e.g., أ, إ, آ -> ا ; ة -> ه ; ى -> ي
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return removeTashkeel(text)
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Split Arabic reading text into clean words for interactive clickable vocabulary
 */
export function extractArabicWords(text: string): string[] {
  if (!text) return [];
  // Match Arabic letters + tashkeel (excluding Arabic punctuation marks like ، ؛ ؟ .)
  const words = text.match(/[\u0621-\u064A\u0671-\u06D3\u064B-\u065F]+/g);
  return words ? words.filter(w => w.trim().length > 0) : [];
}

/**
 * Calculate reading time in minutes and seconds
 * Standard Arabic reading speed for 10th-grade learners is ~70-90 words per minute
 */
export function calculateReadingStats(arabicText: string, wordsPerMinute = 80) {
  const words = extractArabicWords(arabicText);
  const wordCount = words.length;
  const estimatedMinutes = Math.max(1, Math.round(wordCount / wordsPerMinute));
  return {
    wordCount,
    estimatedMinutes,
  };
}

export type ArabicGrade = {
  letter: 'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Maqbul' | 'Rasib';
  arabicLabel: string;
  color: string;
  percentage: number;
};

/**
 * Convert score to Madrasah Aliyah Arabic assessment standard
 */
export function getArabicGrade(score: number, total: number): ArabicGrade {
  if (total <= 0) {
    return {
      letter: 'Rasib',
      arabicLabel: 'رَاسِب (Perlu Remedial)',
      color: 'text-rose-600',
      percentage: 0,
    };
  }

  const percentage = Math.round((score / total) * 100);

  if (percentage >= 90) {
    return {
      letter: 'Mumtaz',
      arabicLabel: 'مُمْتَاز (Sangat Baik / Istimewa)',
      color: 'text-emerald-600',
      percentage,
    };
  }
  if (percentage >= 80) {
    return {
      letter: 'Jayyid Jiddan',
      arabicLabel: 'جَيِّدٌ جِدًّا (Baik Sekali)',
      color: 'text-teal-600',
      percentage,
    };
  }
  if (percentage >= 70) {
    return {
      letter: 'Jayyid',
      arabicLabel: 'جَيِّد (Baik / KKM Tercapai)',
      color: 'text-blue-600',
      percentage,
    };
  }
  if (percentage >= 60) {
    return {
      letter: 'Maqbul',
      arabicLabel: 'مَقْبُوْل (Cukup)',
      color: 'text-amber-600',
      percentage,
    };
  }
  return {
    letter: 'Rasib',
    arabicLabel: 'رَاسِب (Remedial)',
    color: 'text-rose-600',
    percentage,
  };
}
