import test from 'node:test';
import assert from 'node:assert/strict';
import {
  removeTashkeel,
  normalizeArabic,
  extractArabicWords,
  calculateReadingStats,
  getArabicGrade,
} from './arabicText';

test('removeTashkeel correctly strips vowels and tanween', () => {
  const withHarakat = 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
  const stripped = removeTashkeel(withHarakat);
  assert.equal(stripped, 'الحمد لله رب العالمين');
});

test('normalizeArabic standardizes hamza and ta marbuta', () => {
  const text1 = 'أَحْمَدُ فِي الْمَدْرَسَةِ';
  const text2 = 'اَحمد في المدرسه';
  assert.equal(normalizeArabic(text1), normalizeArabic(text2));
});

test('extractArabicWords extracts word tokens accurately', () => {
  const phrase = 'عَزِيْزِي الطَّالِب، مَرْحَبًا بِكَ!';
  const words = extractArabicWords(phrase);
  assert.equal(words.length, 4);
  assert.equal(words[0], 'عَزِيْزِي');
  assert.equal(words[1], 'الطَّالِب');
});

test('calculateReadingStats returns correct word count and reading time', () => {
  const sample = 'هَذَا كِتَابٌ مُفِيْدٌ لِتَعَلُّمِ اللُّغَةِ الْعَرَبِيَّةِ';
  const stats = calculateReadingStats(sample, 60);
  assert.equal(stats.wordCount, 6);
  assert.equal(stats.estimatedMinutes, 1);
});

test('getArabicGrade evaluates percentages to MA grading scale', () => {
  const grade100 = getArabicGrade(10, 10);
  assert.equal(grade100.letter, 'Mumtaz');

  const grade80 = getArabicGrade(8, 10);
  assert.equal(grade80.letter, 'Jayyid Jiddan');

  const grade70 = getArabicGrade(7, 10);
  assert.equal(grade70.letter, 'Jayyid');

  const grade60 = getArabicGrade(6, 10);
  assert.equal(grade60.letter, 'Maqbul');

  const grade50 = getArabicGrade(5, 10);
  assert.equal(grade50.letter, 'Rasib');
});
