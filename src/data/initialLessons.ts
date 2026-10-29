import { ReadingLesson } from '../types';

export const INITIAL_LESSONS: ReadingLesson[] = [
  {
    id: 'bab-1-taaruf',
    chapterNumber: 1,
    titleArabic: 'التَّعَارُفُ وَالْبَيَانَاتُ الشَّخْصِيَّةُ',
    titleIndonesian: 'Perkenalan dan Identitas Diri di Madrasah',
    theme: 'التحية والتعارف',
    contentArabic: `اِسْمِيْ فَرْحَانُ. أَنَا طَالِبٌ جَدِيْدٌ فِي المَدْرَسَةِ الثَّانَوِيَّةِ الإِسْلَامِيَّةِ الحُكُوْمِيَّةِ الأُوْلَى. جِئْتُ مِنْ مَدِيْنَةِ سُوْرَابَايَا، وَأَسْكُنُ الآنَ فِي شَارِعِ أَحْمَدَ يَانِي رَقْمَ عَشَرَةٍ.

فِي هَذَا الصَّبَاحِ، التَقَيْتُ بِزَمِيْلِيْ أَحْمَدَ أَمَامَ بَابِ الفَصْلِ. سَلَّمْتُ عَلَيْهِ قَائِلًا: "السَّلَامُ عَلَيْكُمْ يَا أَخِيْ!" فَأَجَابَ بِلُطْفٍ: "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، أَهْلًا وَسَهْلًا بِكَ!". قُلْتُ لَهُ: "أَهْلًا بِكَ، أَنَا مَسْرُوْرٌ بِمَعْرِفَتِكَ".

نَحْنُ نَدْرُسُ فِي الفَصْلِ العَاشِرِ قِسْمَ العُلُوْمِ الدِّيْنِيَّةِ. أَمَّا هِوَايَتِي فَهِيَ قِرَاءَةُ الكُتُبِ الإِسْلَامِيَّةِ وَلَعِبُ كُرَةِ القَدَمِ. أَمَّا أَحْمَدُ فَهِوَايَتُهُ الرَّسْمُ وَالخَطُّ العَرَبِيُّ. نَرْجُو أَنْ نَكُوْنَ طُلَّابًا نَاجِحِيْنَ نَنْفَعُ دِيْنَنَا وَوَطَنَنَا.`,
    contentTranslation: `Nama saya Farhan. Saya adalah siswa baru di Madrasah Aliyah Negeri (MAN) 1. Saya berasal dari kota Surabaya, dan sekarang tinggal di Jalan Ahmad Yani nomor 10.

Pada pagi hari ini, saya bertemu dengan teman saya Ahmad di depan pintu kelas. Saya mengucapkan salam kepadanya seraya berkata: "Assalamu'alaikum wahai saudaraku!" Lalu ia menjawab dengan ramah: "Wa'alaikumsalam warahmatullahi wabarakatuh, selamat datang!". Saya berkata kepadanya: "Terima kasih, saya sangat senang berkenalan denganmu."

Kami belajar di kelas sepuluh jurusan Keagamaan. Adapun hobi saya adalah membaca buku-buku keislaman dan bermain sepak bola. Sedangkan Ahmad hobinya melukis dan kaligrafi Arab. Kami berharap menjadi siswa-siswa yang sukses dan bermanfaat bagi agama dan tanah air kami.`,
    vocabulary: [
      {
        id: 'v1',
        arabic: 'طَالِبٌ جَدِيْدٌ',
        latin: 'Thoolibun jadiidun',
        indonesian: 'Siswa baru',
        type: 'isim',
        exampleArabic: 'فَرْحَانُ طَالِبٌ جَدِيْدٌ فِي المَدْرَسَةِ',
        exampleIndonesian: 'Farhan adalah siswa baru di madrasah',
      },
      {
        id: 'v2',
        arabic: 'التَقَيْتُ',
        latin: 'Iltaqaitu',
        indonesian: 'Saya telah bertemu',
        type: 'fiil',
        exampleArabic: 'التَقَيْتُ بِصَدِيْقِيْ فِي المَسْجِدِ',
        exampleIndonesian: 'Saya bertemu teman saya di masjid',
      },
      {
        id: 'v3',
        arabic: 'مَسْرُوْرٌ',
        latin: 'Masruurun',
        indonesian: 'Senang / gembira',
        type: 'isim',
        exampleArabic: 'أَنَا مَسْرُوْرٌ بِلِقَائِكُمْ',
        exampleIndonesian: 'Saya senang berjumpa dengan kalian',
      },
      {
        id: 'v4',
        arabic: 'الخَطُّ العَرَبِيُّ',
        latin: 'Al-Khoththul Arabiyyu',
        indonesian: 'Kaligrafi Arab',
        type: 'isim',
        exampleArabic: 'يُحِبُّ أَحْمَدُ تَعَلُّمَ الخَطِّ العَرَبِيِّ',
        exampleIndonesian: 'Ahmad suka belajar kaligrafi Arab',
      },
    ],
    questions: [
      {
        id: 'q1-1',
        type: 'multiple-choice',
        questionArabic: 'مَنْ هُوَ الطَّالِبُ الجَدِيْدُ فِي النَّصِّ؟',
        questionIndonesian: 'Siapakah siswa baru yang diceritakan dalam teks?',
        options: ['أَحْمَدُ', 'فَرْحَانُ', 'عُمَرُ', 'عُثْمَانُ'],
        correctAnswer: 1,
        explanation: 'Farhan adalah siswa baru di MAN 1 (اسْمِيْ فَرْحَانُ. أَنَا طَالِبٌ جَدِيْدٌ).',
      },
      {
        id: 'q1-2',
        type: 'true-false',
        questionArabic: 'فَرْحَانُ يَسْكُنُ فِي مَدِيْنَةِ جَاكَرْتَا الآنَ.',
        questionIndonesian: 'Farhan tinggal di Jakarta sekarang.',
        correctAnswer: 'false',
        explanation: 'Salah. Farhan sekarang tinggal di Jalan Ahmad Yani nomor 10 (asal Surabaya).',
      },
      {
        id: 'q1-3',
        type: 'multiple-choice',
        questionArabic: 'مَا هِيَ هِوَايَةُ أَحْمَدَ؟',
        questionIndonesian: 'Apakah hobi Ahmad?',
        options: [
          'قِرَاءَةُ الكُتُبِ',
          'لَعِبُ كُرَةِ القَدَمِ',
          'الرَّسْمُ وَالخَطُّ العَرَبِيُّ',
          'السِّبَاحَةُ',
        ],
        correctAnswer: 2,
        explanation: 'Hobi Ahmad adalah melukis dan kaligrafi Arab (هِوَايَتُهُ الرَّسْمُ وَالخَطُّ العَرَبِيُّ).',
      },
      {
        id: 'q1-4',
        type: 'essay',
        questionArabic: 'فِي أَيِّ فَصْلٍ وَقِسْمٍ يَدْرُسُ فَرْحَانُ وَأَحْمَدُ؟',
        questionIndonesian: 'Di kelas dan jurusan apa Farhan dan Ahmad belajar?',
        correctAnswer: 'فِي الفَصْلِ العَاشِرِ قِسْمَ العُلُوْمِ الدِّيْنِيَّةِ',
        explanation: 'Keduanya belajar di kelas sepuluh jurusan Keagamaan.',
      },
    ],
    qawaidSummary: {
      topic: 'الضَّمِيْرُ المُنْفَصِلُ وَالمُتَّصِلُ (Dhomir Munfashil & Muttashil)',
      description: 'Kata ganti dalam bahasa Arab dibagi menjadi yang berdiri sendiri (munfashil seperti: أَنَا, نَحْنُ, هُوَ) dan yang tersambung (muttashil seperti: يْ pada اسْمِيْ, هُ pada لَهُ).',
      examples: [
        { arabic: 'أَنَا طَالِبٌ', explanation: "أَنَا adalah Dhomir Munfashil (Saya) berkedudukan sebagai Mubtada'." },
        { arabic: 'اسْمِيْ فَرْحَانُ', explanation: "يْ pada اسْمِيْ adalah Dhomir Muttashil Lil Mutakallim (Nama-ku)." },
      ],
    },
  },
  {
    id: 'bab-2-usrah',
    chapterNumber: 2,
    titleArabic: 'الأُسْرَةُ وَالْبَيْتُ السَّعِيْدُ',
    titleIndonesian: 'Keluarga dan Rumah yang Bahagia',
    theme: 'الأسرة والبيت',
    contentArabic: `عَائِلَتِيْ عَائِلَةٌ سَعِيْدَةٌ وَمُتَرَابِطَةٌ. نَسْكُنُ فِي بَيْتٍ جَمِيْلٍ وَنَظِيْفٍ قَرِيْبٍ مِنَ المَسْجِدِ. يَتَكَوَّنُ بَيْتُنَا مِنْ غُرْفَةِ الجُلُوْسِ، وَغُرْفَةِ النَّوْمِ، وَالمَطْبَخِ، وَالمَكْتَبَةِ الصَّغِيْرَةِ.

وَالِدِيْ اسْمُهُ السَّيِّدُ إِبْرَاهِيْمُ، وَهُوَ مُدَرِّسُ اللُّغَةِ العَرَبِيَّةِ فِي المَدْرَسَةِ. يُحِبُّ التَّدْرِيْسَ كَثِيْرًا وَيُعَلِّمُ التَّلَامِيْذَ بِصَبْرٍ وَإِخْلَاصٍ. وَوَالِدَتِيْ اسْمُهَا السَّيِّدَةُ فَاطِمَةُ، هِيَ رَبَّةُ بَيْتٍ مَاهِرَةٌ، تَقُوْمُ بِإِعْدَادِ الطَّعَامِ اللَّذِيْذِ لَنَا كُلَّ يَوْمٍ.

لِيْ أُخْتٌ صَغِيْرَةٌ اسْمُهَا عَائِشَةُ، تَدْرُسُ فِي المَدْرَسَةِ الاِبْتِدَائِيَّةِ. فِي المَسَاءِ، نَجْتَمِعُ جَمِيْعًا فِي غُرْفَةِ الجُلُوْسِ، فَنَقْرَأُ القُرْآنَ الكَرِيْمَ وَنَسْتَمِعُ إِلَى نَصَائِحِ أَبِيْنَا الغَالِيْ. إِنَّ حَيَاةَ أُسْرَتِنَا مَلِيْئَةٌ بِالمَحَبَّةِ وَالتَّعَاوُنِ.`,
    contentTranslation: `Keluargaku adalah keluarga yang bahagia dan harmonis. Kami tinggal di rumah yang indah dan bersih dekat dengan masjid. Rumah kami terdiri dari ruang tamu, kamar tidur, dapur, dan perpustakaan kecil.

Ayahku bernama Bapak Ibrahim, beliau adalah guru bahasa Arab di madrasah. Beliau sangat menyukai mengajar dan mendidik para murid dengan penuh sabar dan ikhlas. Ibuku bernama Ibu Fatimah, beliau adalah ibu rumah tangga yang terampil, menyiapkan makanan lezat untuk kami setiap hari.

Saya memiliki adik perempuan bernama Aisyah, ia belajar di Madrasah Ibtidaiyah. Pada malam hari, kami semua berkumpul di ruang tamu, membaca Al-Qur'an dan menyimak nasihat ayah kami yang tercinta. Sungguh kehidupan keluarga kami diliputi kasih sayang dan tolong-menolong.`,
    vocabulary: [
      {
        id: 'v2-1',
        arabic: 'عَائِلَةٌ سَعِيْدَةٌ',
        latin: "A'ilatun sa'iidah",
        indonesian: 'Keluarga bahagia',
        type: 'isim',
        exampleArabic: 'نَحْنُ نَعِيْشُ فِي عَائِلَةٍ سَعِيْدَةٍ',
        exampleIndonesian: 'Kami hidup dalam keluarga bahagia',
      },
      {
        id: 'v2-2',
        arabic: 'رَبَّةُ بَيْتٍ',
        latin: 'Robbatu baitin',
        indonesian: 'Ibu rumah tangga',
        type: 'isim',
        exampleArabic: 'أُمِّيْ رَبَّةُ بَيْتٍ مَاهِرَةٌ',
        exampleIndonesian: 'Ibuku seorang ibu rumah tangga yang terampil',
      },
      {
        id: 'v2-3',
        arabic: 'نَجْتَمِعُ',
        latin: 'Najtami’u',
        indonesian: 'Kami berkumpul',
        type: 'fiil',
        exampleArabic: 'نَجْتَمِعُ فِي غُرْفَةِ الجُلُوْسِ لَيْلًا',
        exampleIndonesian: 'Kami berkumpul di ruang tamu pada malam hari',
      },
    ],
    questions: [
      {
        id: 'q2-1',
        type: 'multiple-choice',
        questionArabic: 'مَا مِهْنَةُ وَالِدِ الكَاتِبِ؟',
        questionIndonesian: 'Apa profesi ayah si penulis?',
        options: ['طَبِيْبٌ', 'مُدَرِّسُ اللُّغَةِ العَرَبِيَّةِ', 'مُهَنْدِسٌ', 'تَاجِرٌ'],
        correctAnswer: 1,
        explanation: 'Ayah beliau adalah guru bahasa Arab (مُدَرِّسُ اللُّغَةِ العَرَبِيَّةِ فِي المَدْرَسَةِ).',
      },
      {
        id: 'q2-2',
        type: 'true-false',
        questionArabic: 'عَائِشَةُ تَدْرُسُ فِي الجَامِعَةِ الكَبِيْرَةِ.',
        questionIndonesian: 'Aisyah belajar di perguruan tinggi / universitas.',
        correctAnswer: 'false',
        explanation: 'Salah. Aisyah adalah adik kecil yang belajar di Madrasah Ibtidaiyah (MI).',
      },
      {
        id: 'q2-3',
        type: 'essay',
        questionArabic: 'مَاذَا تَفْعَلُ الأُسْرَةُ فِي غُرْفَةِ الجُلُوْسِ فِي المَسَاءِ؟',
        questionIndonesian: 'Apa yang dilakukan keluarga di ruang tamu pada malam hari?',
        correctAnswer: 'يَقْرَؤُوْنَ القُرْآنَ الكَرِيْمَ وَيَسْتَمِعُوْنَ إِلَى نَصَائِحِ أَبِيْهِمْ',
        explanation: 'Mereka membaca Al-Quran dan mendengarkan nasihat ayah mereka.',
      },
    ],
    qawaidSummary: {
      topic: "المُبْتَدَأُ وَالخَبَرُ (Mubtada' dan Khabar)",
      description: "Jumlah Ismiyyah tersusun dari Mubtada' (subjek isim yang marfu') dan Khabar (predikat pelengkap makna).",
      examples: [
        { arabic: 'البَيْتُ جَمِيْلٌ', explanation: "البَيْتُ adalah Mubtada' marfu' dengan dhommah, dan جَمِيْلٌ adalah Khabar." },
        { arabic: 'وَالِدِيْ مُدَرِّسٌ', explanation: 'Kombinasi isim marfu dan khabar yang menerangkan pekerjaannya.' },
      ],
    },
  },
  {
    id: 'bab-3-madrasah',
    chapterNumber: 3,
    titleArabic: 'المَدْرَسَةُ وَمَرَافِقُهَا العَامَّةُ',
    titleIndonesian: 'Madrasah dan Fasilitas Penunjang Belajar',
    theme: 'المدرسة',
    contentArabic: `مَدْرَسَتُنَا مَدْرَسَةٌ كَبِيْرَةٌ وَمَشْهُوْرَةٌ. تَقَعُ المَدْرَسَةُ وَسَطَ المَدِيْنَةِ، وَفِيْهَا مَرَافِقُ كَثِيْرَةٌ تُسَاعِدُ الطُّلَّابَ عَلَى التَّعَلُّمِ وَالتَّفَوُّقِ.

مِنْ أَهَمِّ المَرَافِقِ فِي مَدْرَسَتِنَا: المَكْتَبَةُ المَرْكَزِيَّةُ. المَكْتَبَةُ وَاسِعَةٌ وَمُنَظَّمَةٌ، فِيْهَا رُفُوْفٌ مَلِيْئَةٌ بِكُتُبِ الدِّيْنِ، وَاللُّغَةِ، وَالعُلُوْمِ الحَدِيْثَةِ. يَذْهَبُ الطُّلَّابُ إِلَى المَكْتَبَةِ فِي وَقْتِ الاِسْتِرَاحَةِ لِلقِرَاءَةِ وَاسْتِعَارَةِ الكُتُبِ.

وَفِي المَدْرَسَةِ أَيْضًا مَسْجِدٌ جَمِيْلٌ يُسَمَّى "مَسْجِدَ النُّوْرِ". يُؤَدِّي فِيْهِ الطُّلَّابُ وَالمُعَلِّمُوْنَ صَلَاةَ الظُّهْرِ جَمَاعَةً كُلَّ يَوْمٍ. وَبِجَانِبِ المَسْجِدِ مَيْدَانٌ رِيَاضِيٌّ لِأَلْعَابِ كُرَةِ القَدَمِ وَكُرَةِ الطَّائِرَةِ، إِضَافَةً إِلَى مُخْتَبَرِ اللُّغَاتِ الَّذِيْ نَتَدَرَّبُ فِيْهِ عَلَى الاِسْتِمَاعِ وَالمُحَادَثَةِ.`,
    contentTranslation: `Madrasah kami adalah madrasah yang besar dan terkenal. Madrasah ini terletak di tengah kota, dan di dalamnya terdapat banyak fasilitas yang membantu para siswa untuk belajar dan berprestasi.

Di antara fasilitas terpenting di madrasah kami adalah: Perpustakaan Pusat. Perpustakaan ini luas dan tertata rapi, di dalamnya terdapat rak-rak yang penuh dengan buku-buku agama, bahasa, dan sains modern. Para siswa pergi ke perpustakaan pada waktu istirahat untuk membaca dan meminjam buku.

Di madrasah juga terdapat masjid yang indah bernama "Masjid An-Nur". Di sanalah para siswa dan guru melaksanakan shalat Zhuhur berjamaah setiap hari. Di samping masjid terdapat lapangan olahraga untuk bermain sepak bola dan bola voli, selain laboratorium bahasa tempat kami berlatih menyimak dan bercakap-cakap.`,
    vocabulary: [
      {
        id: 'v3-1',
        arabic: 'مَرَافِقُ عَامَّةٌ',
        latin: "Maroo-fiqu 'aammah",
        indonesian: 'Fasilitas umum',
        type: 'isim',
        exampleArabic: 'فِي مَدْرَسَتِنَا مَرَافِقُ عَامَّةٌ مُتَطَوِّرَةٌ',
        exampleIndonesian: 'Di madrasah kami terdapat fasilitas umum yang maju',
      },
      {
        id: 'v3-2',
        arabic: 'اسْتِعَارَةُ الكُتُبِ',
        latin: "Isti'aarotul kutub",
        indonesian: 'Peminjaman buku',
        type: 'isim',
        exampleArabic: 'يَذْهَبُ الطَّالِبُ لِاسْتِعَارَةِ الكِتَابِ',
        exampleIndonesian: 'Siswa pergi untuk meminjam buku',
      },
      {
        id: 'v3-3',
        arabic: 'مُخْتَبَرُ اللُّغَاتِ',
        latin: 'Mukhtabarul lughaat',
        indonesian: 'Laboratorium bahasa',
        type: 'isim',
        exampleArabic: 'نَتَدَرَّبُ فِي مُخْتَبَرِ اللُّغَاتِ مَرَّتَيْنِ فِي الأُسْبُوْعِ',
        exampleIndonesian: 'Kami berlatih di lab bahasa dua kali sepekan',
      },
    ],
    questions: [
      {
        id: 'q3-1',
        type: 'multiple-choice',
        questionArabic: 'مَا اسْمُ مَسْجِدِ المَدْرَسَةِ فِي النَّصِّ؟',
        questionIndonesian: 'Apa nama masjid madrasah dalam teks?',
        options: ['مَسْجِدُ التَّقْوَى', 'مَسْجِدُ النُّوْرِ', 'مَسْجِدُ الإِخْلَاصِ', 'مَسْجِدُ الفَلَاحِ'],
        correctAnswer: 1,
        explanation: 'Nama masjidnya adalah Masjid An-Nur (يُسَمَّى "مَسْجِدَ النُّوْرِ").',
      },
      {
        id: 'q3-2',
        type: 'true-false',
        questionArabic: 'يُؤَدِّي الطُّلَّابُ صَلَاةَ الظُّهْرِ مُنْفَرِدِيْنَ كُلَّ وَاحِدٍ بِمُفْرَدِهِ.',
        questionIndonesian: 'Siswa melaksanakan shalat Zhuhur sendirian secara terpisah.',
        correctAnswer: 'false',
        explanation: 'Salah. Mereka shalat Zhuhur berjamaah bersama bapak/ibu guru (صَلَاةَ الظُّهْرِ جَمَاعَةً).',
      },
      {
        id: 'q3-3',
        type: 'essay',
        questionArabic: 'مَاذَا يَفْعَلُ الطُّلَّابُ فِي مُخْتَبَرِ اللُّغَاتِ؟',
        questionIndonesian: 'Apa yang dilakukan siswa di laboratorium bahasa?',
        correctAnswer: 'يَتَدَرَّبُوْنَ عَلَى الاِسْتِمَاعِ وَالمُحَادَثَةِ',
        explanation: 'Mereka berlatih menyimak (istima) dan bercakap-cakap (muhadatsah).',
      },
    ],
    qawaidSummary: {
      topic: 'تَقْدِيْمُ الخَبَرِ عَلَى المُبْتَدَأِ (Taqdimul Khabar / Khobar Muqaddam)',
      description: 'Khabar berupa Syibhul Jumlah (zhorof atau jar-majrur) yang didahulukan sebelum Mubtada Nakirah (Mubtada Muakhkhar).',
      examples: [
        { arabic: 'فِي المَدْرَسَةِ مَسْجِدٌ', explanation: "فِي المَدْرَسَةِ adalah Khabar Muqaddam, dan مَسْجِدٌ adalah Mubtada' Mu'akhkhar." },
        { arabic: 'أَمَامَ الفَصْلِ سَاحَةٌ', explanation: 'Keterangan tempat didepan mendahului kata benda nakiroh.' },
      ],
    },
  },
  {
    id: 'bab-4-hayah',
    chapterNumber: 4,
    titleArabic: 'الحَيَاةُ اليَوْمِيَّةُ لِلطَّالِبِ النَّاجِحِ',
    titleIndonesian: 'Rutinitas Keseharian Siswa Berprestasi',
    theme: 'الحياة اليومية',
    contentArabic: `يَسْتَيْقِظُ عُمَرُ مِنَ النَّوْمِ مُبَكِّرًا فِي السَّاعَةِ الرَّابِعَةِ صَبَاحًا عِنْدَ أَذَانِ الفَجْرِ. يَتَوَضَّأُ عُمَرُ ثُمَّ يَذْهَبُ إِلَى المَسْجِدِ لِأَدَاءِ صَلَاةِ الصُّبْحِ مَعَ الجَمَاعَةِ.

بَعْدَ الصَّلَاةِ، يَقْرَأُ عُمَرُ صَفْحَتَيْنِ مِنَ القُرْآنِ الكَرِيْمِ، ثُمَّ يُرَاجِعُ دُرُوْسَهُ مَثْنَى مَثْنَى. فِي السَّاعَةِ السَّادِسَةِ، يَسْتَحِمُّ عُمَرُ، وَيَلْبَسُ الزِّيَّ المَدْرَسِيَّ، ثُمَّ يَتَنَاوَلُ طَعَامَ الفُطُوْرِ مَعَ أُسْرَتِهِ سَوِيًّا.

يَتَوَجَّهُ عُمَرُ إِلَى المَدْرَسَةِ بِالدَّرَّاجَةِ، لِأَنَّ المَدْرَسَةَ لَيْسَتْ بَعِيْدَةً عَنْ بَيْتِهِ. تَبْدَأُ الحِصَّةُ الأُوْلَى فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا. يَسْتَمِعُ عُمَرُ لِشَرْحِ المُعَلِّمِ بِانْتِبَاهٍ، وَلَا يَشْتَغِلُ بِشَيْءٍ آخَرَ. وَفِي المَسَاءِ يُؤَدِّي وَاجِبَاتِهِ المَنْزِلِيَّةَ قَبْلَ أَنْ يَنَامَ فِي السَّاعَةِ التَّاسِعَةِ وَالنِّصْفِ لَيْلًا.`,
    contentTranslation: `Umar bangun tidur lebih awal pada pukul empat pagi saat azan Subuh berkumandang. Umar berwudhu lalu pergi ke masjid untuk menunaikan shalat Subuh berjamaah.

Setelah shalat, Umar membaca dua halaman Al-Qur'an, lalu mengulang pelajaran-pelajarannya. Pada pukul enam, Umar mandi, mengenakan seragam sekolah, lalu menyantap sarapan pagi bersama keluarganya.

Umar berangkat ke madrasah naik sepeda, karena madrasah tidak jauh dari rumahnya. Jam pelajaran pertama dimulai pada pukul tujuh pagi. Umar menyimak penjelasan guru dengan penuh perhatian, tanpa menyibukkan diri dengan hal lain. Di malam hari ia mengerjakan PR sekolah sebelum tidur pada pukul 21.30 malam.`,
    vocabulary: [
      {
        id: 'v4-1',
        arabic: 'يَسْتَيْقِظُ مُبَكِّرًا',
        latin: 'Yastaiqizhu mubakkiron',
        indonesian: 'Bangun pagi-pagi sekali',
        type: 'fiil',
        exampleArabic: 'أَنَا أَسْتَيْقِظُ مُبَكِّرًا كُلَّ يَوْمٍ',
        exampleIndonesian: 'Saya bangun pagi-pagi sekali setiap hari',
      },
      {
        id: 'v4-2',
        arabic: 'طَعَامُ الفُطُوْرِ',
        latin: "Tha'aamul futhuur",
        indonesian: 'Sarapan pagi',
        type: 'isim',
        exampleArabic: 'تَنَاوَلْتُ طَعَامَ الفُطُوْرِ قَبْلَ الذَّهَابِ',
        exampleIndonesian: 'Saya menyantap sarapan pagi sebelum berangkat',
      },
      {
        id: 'v4-3',
        arabic: 'الوَاجِبُ المَنْزِلِيُّ',
        latin: 'Al-waajibul manziliyy',
        indonesian: 'Pekerjaan rumah (PR)',
        type: 'isim',
        exampleArabic: 'كَتَبَ عُمَرُ الوَاجِبَ المَنْزِلِيَّ بِدِقَّةٍ',
        exampleIndonesian: 'Umar mengerjakan PR dengan teliti',
      },
    ],
    questions: [
      {
        id: 'q4-1',
        type: 'multiple-choice',
        questionArabic: 'فِي أَيِّ سَاعَةٍ يَسْتَيْقِظُ عُمَرُ مِنَ النَّوْمِ؟',
        questionIndonesian: 'Pukul berapa Umar bangun tidur?',
        options: [
          'فِي السَّاعَةِ السَّادِسَةِ',
          'فِي السَّاعَةِ الرَّابِعَةِ صَبَاحًا',
          'فِي السَّاعَةِ الخَامِسَةِ وَالنِّصْفِ',
          'فِي السَّاعَةِ السَّابِعَةِ',
        ],
        correctAnswer: 1,
        explanation: 'Umar bangun pukul 4 pagi saat azan Subuh (فِي السَّاعَةِ الرَّابِعَةِ صَبَاحًا).',
      },
      {
        id: 'q4-2',
        type: 'true-false',
        questionArabic: 'يَذْهَبُ عُمَرُ إِلَى المَدْرَسَةِ رَاكِبًا السَّيَّارَةَ السَّرِيْعَةَ.',
        questionIndonesian: 'Umar pergi ke sekolah menaiki mobil cepat.',
        correctAnswer: 'false',
        explanation: 'Salah. Umar mengendarai sepeda (بِالدَّرَّاجَةِ) karena jaraknya dekat.',
      },
      {
        id: 'q4-3',
        type: 'essay',
        questionArabic: 'مَتَى يَنَامُ عُمَرُ لَيْلًا؟',
        questionIndonesian: 'Kapan Umar tidur pada malam hari?',
        correctAnswer: 'فِي السَّاعَةِ التَّاسِعَةِ وَالنِّصْفِ لَيْلًا',
        explanation: 'Umar tidur pada pukul sembilan lewat tiga puluh menit (21.30).',
      },
    ],
    qawaidSummary: {
      topic: "الفِعْلُ المُضَارِعُ وَتَصْرِيْفُهُ مَعَ الضَّمَائِرِ (Fi'il Mudhari')",
      description: "Fi'il Mudhari menunjukkan perbuatan saat ini atau masa depan. Berubah awalan huruf mudhara'ah (Anaitu: أ، ن، ي، ت) sesuai dhomir.",
      examples: [
        { arabic: 'هُوَ يَسْتَيْقِظُ', explanation: 'Awalan Ya untuk dhomir Huwa.' },
        { arabic: 'أَنَا أَسْتَيْقِظُ', explanation: 'Awalan Hamzah untuk dhomir Ana.' },
      ],
    },
  },
];
