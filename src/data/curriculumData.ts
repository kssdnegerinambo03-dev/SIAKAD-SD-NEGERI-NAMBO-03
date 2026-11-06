import {
  LearningOutcomeCP,
  LearningObjectiveTP,
  ProtaRecord,
  PromesRecord,
  DeepLearningModule,
  CurriculumFase
} from '../types';

export const DIMENSI_PROFIL_LULUSAN = [
  'Keimanan & Ketaqwaan kepada Tuhan YME',
  'Kewargaan & Kebangsaan',
  'Penalaran Kritis',
  'Kreativitas',
  'Kolaborasi (Gotong Royong)',
  'Kemandirian',
  'Kesehatan & Kebugaran',
  'Komunikasi Efektif'
];

export const MATA_PELAJARAN_LIST = [
  'Pendidikan Agama Islam dan Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
  'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  'Seni Rupa',
  'Bahasa Inggris',
  'Koding & Kecerdasan Artifisial'
];

export const FASE_MAP: Record<string, CurriculumFase> = {
  'c-1a': 'Fase A',
  'c-1b': 'Fase A',
  'c-2a': 'Fase A',
  'c-2b': 'Fase A',
  'c-3a': 'Fase B',
  'c-3b': 'Fase B',
  'c-4a': 'Fase B',
  'c-4b': 'Fase B',
  'c-5a': 'Fase C',
  'c-5b': 'Fase C',
  'c-6a': 'Fase C',
  'c-6b': 'Fase C'
};

export const KELAS_LABEL_MAP: Record<string, string> = {
  'c-1a': 'Kelas 1A',
  'c-1b': 'Kelas 1B',
  'c-2a': 'Kelas 2A',
  'c-2b': 'Kelas 2B',
  'c-3a': 'Kelas 3A',
  'c-3b': 'Kelas 3B',
  'c-4a': 'Kelas 4A',
  'c-4b': 'Kelas 4B',
  'c-5a': 'Kelas 5A',
  'c-5b': 'Kelas 5B',
  'c-6a': 'Kelas 6A',
  'c-6b': 'Kelas 6B'
};

// =========================================================================
// 1. CAPAIAN PEMBELAJARAN LENGKAP (SK BSKAP 046/H/KR/2025 & SDN NAMBO 03)
// SEMUA 9 MATA PELAJARAN, SEMUA ELEMEN, DAN SEMUA FASE A, B, C
// =========================================================================
export const initialCapaianPembelajaran: LearningOutcomeCP[] = [
  // --- 1. PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI ---
  {
    id: 'cp-pai-1-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Al-Qur’an Hadis',
    deskripsiCP: 'Memahami huruf hijaiah berharakat, huruf hijaiah bersambung, Surah al-Fatihah, beberapa surah pendek Al-Qur’an, dan hadis tentang kebersihan.'
  },
  {
    id: 'cp-pai-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Al-Qur’an Hadis',
    deskripsiCP: 'Memahami beberapa surah pendek, ayat Al-Qur’an dan hadis tentang kewajiban salat dan menjaga hubungan baik dengan sesama.'
  },
  {
    id: 'cp-pai-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Al-Qur’an Hadis',
    deskripsiCP: 'Memahami beberapa surah pendek dan ayat Al-Qur’an serta hadis tentang keragaman dan persaudaraan sesama manusia.'
  },
  {
    id: 'cp-pai-2-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Akidah',
    deskripsiCP: 'Memahami rukun iman, iman kepada Allah Swt., beberapa asmaulhusna, dan iman kepada malaikat-malaikat Allah Swt.'
  },
  {
    id: 'cp-pai-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Akidah',
    deskripsiCP: 'Memahami sifat-sifat Allah Swt., beberapa asmaulhusna, iman kepada kitab-kitab Allah Swt. dan rasul-rasul Allah Swt.'
  },
  {
    id: 'cp-pai-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Akidah',
    deskripsiCP: 'Memahami beberapa asmaulhusna, iman kepada hari akhir, qada’ dan qadr, serta hikmah beriman kepada takdir Allah Swt.'
  },
  {
    id: 'cp-pai-3-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Akhlak',
    deskripsiCP: 'Memahami akhlak terhadap Allah Swt. dengan menyucikan dan memuji-Nya, dan akhlak terhadap diri sendiri serta sesama seperti berkata santun, jujur, dan berterima kasih.'
  },
  {
    id: 'cp-pai-3-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Akhlak',
    deskripsiCP: 'Memahami akhlak kepada kedua orang tua, guru, sesama manusia dengan sikap saling menghormati, tolong-menolong, dan menjaga kelestarian lingkungan hidup.'
  },
  {
    id: 'cp-pai-3-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Akhlak',
    deskripsiCP: 'Memahami akhlak mulia dalam pergaulan bermasyarakat, sikap pemaaf, toleransi (tasamuh), dan kepedulian sosial terhadap anak yatim dan dhuafa.'
  },
  {
    id: 'cp-pai-4-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Fikih',
    deskripsiCP: 'Memahami rukun Islam, syahadatain, tata cara bersuci (taharah/wudu), dan tata cara salat fardu lima waktu.'
  },
  {
    id: 'cp-pai-4-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Fikih',
    deskripsiCP: 'Memahami ketentuan salat berjamaah, salat rawatib, salat jumat, serta ketentuan puasa Ramadan.'
  },
  {
    id: 'cp-pai-4-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Fikih',
    deskripsiCP: 'Memahami ketentuan zakat, infak, sedekah, kurban, dan tata cara ibadah haji serta makanan halal dan haram.'
  },
  {
    id: 'cp-pai-5-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Sejarah Peradaban Islam',
    deskripsiCP: 'Memahami kisah keteladanan Nabi Adam a.s., Nabi Nuh a.s., dan masa kanak-kanak Nabi Muhammad saw.'
  },
  {
    id: 'cp-pai-5-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Sejarah Peradaban Islam',
    deskripsiCP: 'Memahami kisah keteladanan Nabi Ibrahim a.s., Nabi Ismail a.s., dan masa kerasulan serta dakwah Nabi Muhammad saw.'
  },
  {
    id: 'cp-pai-5-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    elemen: 'Sejarah Peradaban Islam',
    deskripsiCP: 'Memahami kisah kepemimpinan Khulafaur Rasyidin dan perjuangan Wali Songo dalam menyebarkan ajaran Islam di Nusantara secara damai.'
  },

  // --- 2. PENDIDIKAN PANCASILA ---
  {
    id: 'cp-pp-1-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Pancasila',
    deskripsiCP: 'Mengenal bendera negara, lagu kebangsaan, simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila, serta menerapkan nilai-nilai Pancasila di lingkungan keluarga dan sekolah.'
  },
  {
    id: 'cp-pp-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Pancasila',
    deskripsiCP: 'Mengidentifikasi makna sila-sila Pancasila, dan penerapannya dalam kehidupan sehari-hari di lingkungan sekolah dan masyarakat.'
  },
  {
    id: 'cp-pp-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Pancasila',
    deskripsiCP: 'Memahami sejarah kelahiran Pancasila, kedudukan Pancasila sebagai dasar negara, pandangan hidup, dan ideologi negara, serta menguraikan keterkaitan antarsila dalam Pancasila sebagai kesatuan utuh.'
  },
  {
    id: 'cp-pp-2-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
    deskripsiCP: 'Mengenal aturan di lingkungan keluarga dan sekolah, menceritakan contoh sikap mematuhi dan tidak mematuhi aturan, serta menunjukkan hak dan kewajiban anak di rumah dan sekolah.'
  },
  {
    id: 'cp-pp-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
    deskripsiCP: 'Mengidentifikasi hak dan kewajiban sebagai anggota keluarga, warga sekolah, dan warga masyarakat, serta menerapkan aturan dalam musyawarah mufakat sederhana.'
  },
  {
    id: 'cp-pp-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
    deskripsiCP: 'Menganalisis norma dan aturan hukum tertulis dan tidak tertulis di masyarakat, serta hak dan kewajiban warga negara dalam UUD NRI Tahun 1945 secara konsisten.'
  },
  {
    id: 'cp-pp-3-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Bhinneka Tunggal Ika',
    deskripsiCP: 'Mengenal identitas diri, menghargai keberagaman fisik, jenis kelamin, dan hobi teman sebaya di sekolah dengan rukun dan saling menyayangi.'
  },
  {
    id: 'cp-pp-3-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Bhinneka Tunggal Ika',
    deskripsiCP: 'Menghargai keragaman suku bangsa, bahasa daerah, agama, dan budaya di lingkungan tempat tinggal serta memupuk sikap toleransi dan gotong royong.'
  },
  {
    id: 'cp-pp-3-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Bhinneka Tunggal Ika',
    deskripsiCP: 'Menyajikan kekayaan budaya dan kearifan lokal Nusantara, menghargai keragaman suku, bahasa, dan agama sebagai anugerah Tuhan YME, serta menolak diskriminasi.'
  },
  {
    id: 'cp-pp-4-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Negara Kesatuan Republik Indonesia',
    deskripsiCP: 'Mengenal lingkungan rumah dan sekolah sebagai bagian dari wilayah NKRI serta menunjukkan sikap peduli dan cinta lingkungan sekitar.'
  },
  {
    id: 'cp-pp-4-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Negara Kesatuan Republik Indonesia',
    deskripsiCP: 'Mengenal susunan wilayah desa/kelurahan dan kecamatan tempat tinggal, serta menjaga keutuhan lingkungan sekitar dan bangga bertanah air Indonesia.'
  },
  {
    id: 'cp-pp-4-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Pancasila',
    elemen: 'Negara Kesatuan Republik Indonesia',
    deskripsiCP: 'Memahami makna Proklamasi Kemerdekaan, batas wilayah NKRI secara geografis, dan berpartisipasi menjaga persatuan dan kesatuan bangsa dari ancaman perpecahan.'
  },

  // --- 3. BAHASA INDONESIA ---
  {
    id: 'cp-bin-1-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Menyimak',
    deskripsiCP: 'Bersikap menjadi penyimak yang baik, memahami pesan lisan dan informasi dari media audio, teks aural instruksi lisan sederhana, serta merespons tuturan lisan dengan santun.'
  },
  {
    id: 'cp-bin-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Menyimak',
    deskripsiCP: 'Menganalisis informasi berupa fakta, ide pokok, dan ide pendukung dari teks aural (teks yang dibacakan/didengar) dan media audiovisual secara kritis.'
  },
  {
    id: 'cp-bin-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Menyimak',
    deskripsiCP: 'Menganalisis ide pokok, tujuan tuturan, dan pesan tersirat serta membedakan fakta dan opini dari teks aural atau presentasi lisan multimodal secara mendalam.'
  },
  {
    id: 'cp-bin-2-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Membaca dan Memirsa',
    deskripsiCP: 'Membaca kata-kata yang sering ditemui sehari-hari dengan fasih, memaknai kosakata baru dari teks yang dibaca atau tayangan yang dipirsa dengan bantuan ilustrasi.'
  },
  {
    id: 'cp-bin-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Membaca dan Memirsa',
    deskripsiCP: 'Membaca teks narasi dan deskripsi dengan lancar, mengidentifikasi pesan moral, alur cerita, dan karakter tokoh serta menggunakan kamus untuk mencari makna kosakata.'
  },
  {
    id: 'cp-bin-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Membaca dan Memirsa',
    deskripsiCP: 'Membaca kritis teks eksplanasi, eksposisi, dan sastra, mengidentifikasi sudut pandang penulis, membandingkan isi dua teks bertopik sama, dan mengapresiasi keindahan gaya bahasa.'
  },
  {
    id: 'cp-bin-3-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Berbicara dan Mempresentasikan',
    deskripsiCP: 'Berbicara dengan volume dan intonasi yang tepat, menceritakan kembali suatu informasi atau dongeng secara runtut, dan bertanya jawab secara santun.'
  },
  {
    id: 'cp-bin-3-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Berbicara dan Mempresentasikan',
    deskripsiCP: 'Mempresentasikan gagasan dengan volume dan intonasi yang jelas, berdiskusi aktif memecahkan masalah dalam kelompok dengan santun dan argumentatif.'
  },
  {
    id: 'cp-bin-3-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Berbicara dan Mempresentasikan',
    deskripsiCP: 'Menyampaikan presentasi persuasif, memandu diskusi kelompok, menanggapi sanggahan secara santun dan logis, serta berpidato atau membaca puisi dengan penghayatan.'
  },
  {
    id: 'cp-bin-4-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Menulis',
    deskripsiCP: 'Menulis huruf, suku kata, dan kata dengan bentuk dan spasi yang benar, serta menulis kalimat sederhana dengan menggunakan huruf kapital dan tanda titik.'
  },
  {
    id: 'cp-bin-4-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Menulis',
    deskripsiCP: 'Menulis teks narasi, deskripsi, dan petunjuk prosedur dengan kaidah ejaan, tanda baca, serta struktur kalimat yang runtut dan bermakna.'
  },
  {
    id: 'cp-bin-4-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Bahasa Indonesia',
    elemen: 'Menulis',
    deskripsiCP: 'Menulis teks laporan investigasi, eksplanasi ilmiah sederhana, dan karya kreatif (cerpen/puisi) dengan struktur teratur, diksi kaya, dan kaidah tata bahasa baku.'
  },

  // --- 4. MATEMATIKA ---
  {
    id: 'cp-mat-1-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Matematika',
    elemen: 'Bilangan',
    deskripsiCP: 'Memahami bilangan cacah sampai 100, nilai tempat (puluhan dan satuan), membandingkan dan mengurutkan bilangan, serta melakukan penjumlahan dan pengurangan sampai 20 dengan benda konkret.'
  },
  {
    id: 'cp-mat-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Matematika',
    elemen: 'Bilangan',
    deskripsiCP: 'Memahami bilangan cacah sampai 10.000, operasi penjumlahan, pengurangan, perkalian, dan pembagian, serta konsep pecahan senilai, pecahan desimal, dan persen sederhana.'
  },
  {
    id: 'cp-mat-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Matematika',
    elemen: 'Bilangan',
    deskripsiCP: 'Memahami operasi hitung campuran bilangan cacah sampai 1.000.000, operasi penjumlahan, pengurangan, perkalian, dan pembagian pecahan biasa, campuran, desimal, serta rasio dan proporsi.'
  },
  {
    id: 'cp-mat-2-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Matematika',
    elemen: 'Aljabar',
    deskripsiCP: 'Mengenali, meniru, dan melanjutkan pola gambar atau obyek sederhana berulang, serta memahami makna simbol kesamaan "=" pada kalimat penjumlahan sederhana.'
  },
  {
    id: 'cp-mat-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Matematika',
    elemen: 'Aljabar',
    deskripsiCP: 'Menemukan nilai yang belum diketahui dalam sebuah kalimat matematika yang melibatkan penjumlahan, pengurangan, atau perkalian bilangan cacah.'
  },
  {
    id: 'cp-mat-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Matematika',
    elemen: 'Aljabar',
    deskripsiCP: 'Menyatakan situasi nyata ke dalam bentuk kalimat matematika dengan variabel, menemukan pola barisan bilangan, dan menyelesaikan persamaan linear sederhana.'
  },
  {
    id: 'cp-mat-3-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Matematika',
    elemen: 'Pengukuran',
    deskripsiCP: 'Membandingkan panjang dan berat benda secara langsung atau menggunakan satuan tidak baku, serta mengenal satuan waktu (jam, hari, bulan).'
  },
  {
    id: 'cp-mat-3-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Matematika',
    elemen: 'Pengukuran',
    deskripsiCP: 'Mengukur panjang dan berat menggunakan satuan baku (cm, m, gram, kg), menentukan hubungan antarsatuan, serta mengukur luas dan keliling bangun datar.'
  },
  {
    id: 'cp-mat-3-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Matematika',
    elemen: 'Pengukuran',
    deskripsiCP: 'Menghitung keliling dan luas lingkaran, serta volume bangun ruang (kubus, balok, prisma) menggunakan satuan baku (cm3, m3, liter).'
  },
  {
    id: 'cp-mat-4-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Matematika',
    elemen: 'Geometri',
    deskripsiCP: 'Mengenal bangun datar (segitiga, segi empat, lingkaran) dan bangun ruang (balok, kubus, bola) sederhana serta mengelompokkannya berdasarkan bentuk.'
  },
  {
    id: 'cp-mat-4-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Matematika',
    elemen: 'Geometri',
    deskripsiCP: 'Mendeskripsikan ciri-ciri berbagai bentuk bangun datar (sisi, sudut) dan menyusun serta mengurai (komposisi/dekomposisi) bangun datar.'
  },
  {
    id: 'cp-mat-4-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Matematika',
    elemen: 'Geometri',
    deskripsiCP: 'Mengkonstruksi dan mengurai jaring-jaring bangun ruang (kubus dan balok), serta menentukan lokasi titik pada sistem koordinat Kartesius sederhana.'
  },
  {
    id: 'cp-mat-5-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Matematika',
    elemen: 'Analisis Data dan Peluang',
    deskripsiCP: 'Mengurutkan, menyortir, dan mengelompokkan data konkret ke dalam tabel gambar atau piktogram sederhana.'
  },
  {
    id: 'cp-mat-5-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Matematika',
    elemen: 'Analisis Data dan Peluang',
    deskripsiCP: 'Mengumpulkan, menyajikan, dan menganalisis data menggunakan diagram batang dan tabel frekuensi sederhana.'
  },
  {
    id: 'cp-mat-5-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Matematika',
    elemen: 'Analisis Data dan Peluang',
    deskripsiCP: 'Membandingkan dan menyajikan data dalam bentuk diagram garis dan diagram lingkaran, menentukan mean, median, modus, serta memahami konsep peluang kejadian sederhana.'
  },

  // --- 5. ILMU PENGETAHUAN ALAM DAN SOSIAL (IPAS) ---
  {
    id: 'cp-ipas-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    elemen: 'Pemahaman IPAS',
    deskripsiCP: 'Menganalisis hubungan antara bentuk dan fungsi bagian tubuh tumbuhan/hewan, daur hidup makhluk hidup, wujud zat dan perubahannya, bentuk energi dan pemanfaatannya, interaksi sosial di lingkungan tempat tinggal, serta peranan uang dan kegiatan ekonomi masyarakat.'
  },
  {
    id: 'cp-ipas-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    elemen: 'Pemahaman IPAS',
    deskripsiCP: 'Menganalisis sistem organ tubuh manusia (pernapasan, pencernaan, peredaran darah), jaring-jaring makanan dalam ekosistem, gelombang cahaya dan bunyi, sifat magnet dan listrik, struktur bumi, tata surya, posisi geografis Indonesia, serta sejarah perjuangan bangsa Indonesia.'
  },
  {
    id: 'cp-ipas-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    elemen: 'Keterampilan Proses',
    deskripsiCP: 'Mengamati fenomena ilmiah, membuat hipotesis sederhana, melakukan penyelidikan terbimbing, mencatat data hasil pengamatan, menarik kesimpulan, dan mengomunikasikannya.'
  },
  {
    id: 'cp-ipas-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    elemen: 'Keterampilan Proses',
    deskripsiCP: 'Merencanakan dan melakukan penyelidikan ilmiah mandiri, menggunakan alat ukur secara tepat, menganalisis data kuantitatif dan kualitatif, mengevaluasi proses ilmiah, dan mempresentasikan hasil penyelidikan dengan percaya diri.'
  },

  // --- 6. BAHASA INGGRIS ---
  {
    id: 'cp-eng-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Bahasa Inggris',
    elemen: 'Menyimak - Berbicara',
    deskripsiCP: 'Memahami instruksi sederhana, merespons salam (greetings), memperkenalkan diri, menyebutkan benda, hewan, warna, dan angka dalam bahasa Inggris dengan pengucapan yang jelas.'
  },
  {
    id: 'cp-eng-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Bahasa Inggris',
    elemen: 'Menyimak - Berbicara',
    deskripsiCP: 'Berkomunikasi aktif dalam dialog pendek sehari-hari, menanyakan dan memberikan informasi tentang kegiatan rutin (daily activities), hobi, dan arah mata angin.'
  },
  {
    id: 'cp-eng-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Bahasa Inggris',
    elemen: 'Membaca - Memirsa',
    deskripsiCP: 'Membaca dan memahami kata-kata serta frasa bergambar sederhana dalam teks pendek bahasa Inggris.'
  },
  {
    id: 'cp-eng-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Bahasa Inggris',
    elemen: 'Membaca - Memirsa',
    deskripsiCP: 'Membaca dan merespons teks deskriptif dan naratif pendek, menemukan ide pokok dan kosakata kontekstual bahasa Inggris.'
  },
  {
    id: 'cp-eng-3-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Bahasa Inggris',
    elemen: 'Menulis - Mempresentasikan',
    deskripsiCP: 'Menuliskan kosakata dan kalimat pendek terarah dalam bahasa Inggris dibantu contoh visual.'
  },
  {
    id: 'cp-eng-3-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Bahasa Inggris',
    elemen: 'Menulis - Mempresentasikan',
    deskripsiCP: 'Menulis teks pendek mandiri seperti kartu ucapan, jadwal kegiatan, dan cerita bergambar dengan ejaan yang benar.'
  },

  // --- 7. SENI RUPA ---
  {
    id: 'cp-sn-1-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Seni Rupa',
    elemen: 'Mengalami (Experiencing)',
    deskripsiCP: 'Mengenali dan menyebutkan unsur-unsur rupa (titik, garis, bentuk, warna primer) dalam benda-benda di sekitar dan karya seni rupa.'
  },
  {
    id: 'cp-sn-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Seni Rupa',
    elemen: 'Mengalami (Experiencing)',
    deskripsiCP: 'Mengidentifikasi unsur rupa (garis, bentuk, tekstur, ruang) dan prinsip desain (keseimbangan, pola) dalam karya seni rupa lingkungan sekitar.'
  },
  {
    id: 'cp-sn-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Seni Rupa',
    elemen: 'Mengalami (Experiencing)',
    deskripsiCP: 'Menjelaskan unsur rupa, prinsip desain, dan gaya seni rupa Nusantara maupun mancanegara secara terperinci.'
  },
  {
    id: 'cp-sn-2-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Seni Rupa',
    elemen: 'Menciptakan (Making/Creating)',
    deskripsiCP: 'Membuat karya seni rupa dua dimensi dan tiga dimensi sederhana dengan mengeksplorasi garis, bentuk, dan warna secara bebas dan gembira.'
  },
  {
    id: 'cp-sn-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Seni Rupa',
    elemen: 'Menciptakan (Making/Creating)',
    deskripsiCP: 'Menghasilkan karya seni rupa berdasarkan pengamatan terhadap lingkungan sekitar dengan menerapkan proporsi, komposisi, dan teknik campuran.'
  },
  {
    id: 'cp-sn-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Seni Rupa',
    elemen: 'Menciptakan (Making/Creating)',
    deskripsiCP: 'Menciptakan karya seni rupa kontekstual dengan teknik cetak, anyaman, kolase, atau lukis yang menunjukkan kreativitas dan orisinalitas tinggi.'
  },

  // --- 8. PENDIDIKAN JASMANI, OLAHRAGA, DAN KESEHATAN (PJOK) ---
  {
    id: 'cp-pjok-1-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemen: 'Terampil Bergerak',
    deskripsiCP: 'Mempraktikkan keterampilan gerak fundamental (lokomotor, non-lokomotor, dan manipulatif) dalam permainan sederhana dan aktivitas jasmani yang menyenangkan.'
  },
  {
    id: 'cp-pjok-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemen: 'Terampil Bergerak',
    deskripsiCP: 'Menerapkan variasi dan kombinasi pola gerak dasar lokomotor, non-lokomotor, dan manipulatif dalam berbagai permainan bola besar, bola kecil, dan senam lantai.'
  },
  {
    id: 'cp-pjok-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemen: 'Terampil Bergerak',
    deskripsiCP: 'Mempraktikkan modifikasi pola gerak spesifik dalam olahraga beregu, atletik, bela diri tradisional, serta aktivitas kebugaran jasmani secara terkoordinasi.'
  },
  {
    id: 'cp-pjok-2-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemen: 'Memilih Hidup Sehat',
    deskripsiCP: 'Mengenal kebersihan diri (mencuci tangan, merawat gigi, memakai pakaian bersih), makanan bergizi seimbang, dan istirahat yang cukup.'
  },
  {
    id: 'cp-pjok-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemen: 'Memilih Hidup Sehat',
    deskripsiCP: 'Memahami cara menjaga kebersihan lingkungan sekolah dan rumah, pencegahan penyakit menular, serta penanganan cedera ringan (P3K).'
  },
  {
    id: 'cp-pjok-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemen: 'Memilih Hidup Sehat',
    deskripsiCP: 'Memahami perubahan fisik masa pubertas, bahaya rokok dan narkoba, serta pola hidup bugar sepanjang hayat.'
  },

  // --- 9. KODING & KECERDASAN ARTIFISIAL ---
  {
    id: 'cp-ka-1-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    elemen: 'Berpikir Komputasional (BK Unplugged)',
    deskripsiCP: 'Menerapkan berpikir komputasional sederhana melalui dekomposisi masalah sehari-hari, pengenalan pola gerak berulang, dan perancangan algoritma instruksi langkah terarah secara unplugged menggunakan kartu logika dan labirin lantai.'
  },
  {
    id: 'cp-ka-2-a',
    fase: 'Fase A',
    kelas: ['Kelas 1', 'Kelas 2'],
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    elemen: 'Literasi Digital & Pengenalan Kecerdasan Artifisial',
    deskripsiCP: 'Memahami konsep dasar teknologi digital, mengenali sistem kecerdasan artifisial ramah anak (seperti pengenalan suara dan wajah), serta menerapkan etika dan keamanan data diri di lingkungan digital.'
  },
  {
    id: 'cp-ka-1-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    elemen: 'Algoritma & Pemrograman Blok Visual',
    deskripsiCP: 'Merancang alur logika terstruktur dengan urutan (sekuens) dan pengulangan (looping) menggunakan platform koding blok visual (ScratchJr/Blockly) untuk membuat animasi interaktif dan cerita pendek edukatif.'
  },
  {
    id: 'cp-ka-2-b',
    fase: 'Fase B',
    kelas: ['Kelas 3', 'Kelas 4'],
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    elemen: 'Kecerdasan Artifisial & Literasi Data',
    deskripsiCP: 'Memahami cara sistem kecerdasan artifisial belajar dari data (pola visual/audio), mengorganisasi data sederhana ke dalam tabel, dan mematuhi etika bermedia digital.'
  },
  {
    id: 'cp-ka-1-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    elemen: 'Berpikir Komputasional & Algoritma Lanjut',
    deskripsiCP: 'Memecahkan persoalan komputasional terstruktur dengan variabel, pengkondisian bersyarat (if-then-else), fungsi sederhana, dan debugging kode pada proyek game edukatif.'
  },
  {
    id: 'cp-ka-2-c',
    fase: 'Fase C',
    kelas: ['Kelas 5', 'Kelas 6'],
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    elemen: 'Literasi, Etika & Pemanfaatan Kecerdasan Artifisial',
    deskripsiCP: 'Memahami konsep dasar bagaimana model kecerdasan artifisial bekerja, menyimulasikan klasifikasi pola data, merumuskan prompt cerdas etis, serta mengevaluasi dampak sosial dan etika teknologi AI bagi kehidupan manusia.'
  }
];

// =========================================================================
// 2. DAFTAR TUJUAN PEMBELAJARAN (TP) RESMI LENGKAP DARI DOKUMEN 2026-2027
// =========================================================================
export const initialTujuanPembelajaran: LearningObjectiveTP[] = [
  // === 1. PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI ===
  // FASE A
  {
    id: 'tp-pai-a-1',
    cpId: 'cp-pai-1-a',
    kodeTP: 'TP-PAI.1.1',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Huruf Hijaiah Berharakat & Bersambung',
    tujuanDeskripsi: 'Mengenal dan melafalkan huruf hijaiyah berharakat tunggal dan huruf bersambung dengan fasih sesuai makhraj.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Menyebutkan 28 huruf hijaiyah dengan harakat fathah, kasrah, dan dammah.',
      'Melafalkan huruf hijaiyah bersambung sederhana.',
      'Menuliskan bentuk huruf hijaiyah tunggal secara mandiri.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-pai-a-2',
    cpId: 'cp-pai-1-a',
    kodeTP: 'TP-PAI.1.2',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Surah Al-Fatihah & Surah Pendek Pilihan',
    tujuanDeskripsi: 'Membaca dan menghafal Surah Al-Fatihah dan surah pendek pilihan dengan tartil dan makhraj yang benar.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Kemandirian'],
    indikatorKetercapaian: [
      'Membaca Surah Al-Fatihah ayat 1-7 dengan lancar.',
      'Menghafal Surah Al-Ikhlas dan Surah Al-Falaq.',
      'Menjelaskan pesan inti Surah Al-Fatihah sebagai induk Al-Qur’an.'
    ],
    urutanATP: 2
  },
  {
    id: 'tp-pai-a-3',
    cpId: 'cp-pai-1-a',
    kodeTP: 'TP-PAI.1.3',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Hadis tentang Kebersihan Sebagian dari Iman',
    tujuanDeskripsi: 'Menjelaskan isi pokok hadis tentang kebersihan dan mempraktikkan hidup bersih sebagai bagian dari keimanan.',
    alokasiJP: 6,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Kesehatan & Kebugaran'],
    indikatorKetercapaian: [
      'Menghafalkan bunyi hadis tentang kebersihan secara ringkas.',
      'Membiasakan cuci tangan dan menjaga kebersihan badan serta pakaian.',
      'Menjaga kebersihan ruang kelas dan halaman SDN Nambo 03.'
    ],
    urutanATP: 3
  },
  {
    id: 'tp-pai-a-4',
    cpId: 'cp-pai-2-a',
    kodeTP: 'TP-PAI.1.4',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Rukun Iman & Asmaulhusna Ar-Rahman Ar-Rahim',
    tujuanDeskripsi: 'Menyebutkan enam rukun iman dan meneladani makna Asmaulhusna Ar-Rahman serta Ar-Rahim dalam kasih sayang sesama.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Menyebutkan urutan 6 rukun iman secara runut.',
      'Menjelaskan makna Allah Maha Pengasih dan Maha Penyayang.',
      'Menunjukkan sikap menyayangi teman dan anggota keluarga.'
    ],
    urutanATP: 4
  },
  {
    id: 'tp-pai-a-5',
    cpId: 'cp-pai-4-a',
    kodeTP: 'TP-PAI.1.5',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Tata Cara Bersuci (Wudu) & Salat Fardu',
    tujuanDeskripsi: 'Mempraktikkan tata cara wudu secara runtut dan mendemonstrasikan gerakan salat fardu dengan tertib.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Kemandirian'],
    indikatorKetercapaian: [
      'Melafalkan niat dan doa setelah wudu.',
      'Mempraktikkan 8 urutan wudu dengan air bersih.',
      'Menirukan gerakan takbiratul ihram hingga salam dengan khusyuk.'
    ],
    urutanATP: 5
  },

  // FASE B (PAI)
  {
    id: 'tp-pai-b-1',
    cpId: 'cp-pai-1-b',
    kodeTP: 'TP-PAI.3.1',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Surah Pendek & Kewajiban Salat',
    tujuanDeskripsi: 'Menjelaskan isi pokok dari beberapa surah pendek dan hadis tentang kewajiban salat serta menjaga hubungan baik dengan sesama.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Membaca Surah An-Nasr dan Al-Kautsar dengan kaidah tajwid.',
      'Menjelaskan hikmah mendirikan salat tepat waktu.',
      'Mencontohkan perbuatan menjaga silaturahmi dengan teman.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-pai-b-2',
    cpId: 'cp-pai-2-b',
    kodeTP: 'TP-PAI.3.2',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Sifat Wajib Allah & Kitab-Kitab Suci',
    tujuanDeskripsi: 'Mengidentifikasi sifat-sifat wajib bagi Allah Swt., asmaulhusna Al-Alim Al-Khabir, serta makna beriman kepada kitab-kitab suci.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Menyebutkan 4 nama kitab suci beserta nabi penerimanya.',
      'Mengartikan makna Al-Alim dan Al-Khabir.',
      'Menunjukkan sikap jujur dan gemar menuntut ilmu.'
    ],
    urutanATP: 2
  },

  // FASE C (PAI)
  {
    id: 'tp-pai-c-1',
    cpId: 'cp-pai-1-c',
    kodeTP: 'TP-PAI.5.1',
    mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Keragaman & Persaudaraan (Surah Al-Hujurat: 13)',
    tujuanDeskripsi: 'Menjelaskan isi kandungan ayat Al-Qur’an dan hadis tentang pentingnya menghargai keragaman serta persaudaraan sesama manusia.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Keimanan & Ketaqwaan kepada Tuhan YME', 'Kewargaan & Kebangsaan', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Membaca Surah Al-Hujurat ayat 13 dengan hukum tajwid mad dan ikhfa.',
      'Menganalisis sebab diciptakannya manusia berbangsa-bangsa dan bersuku-suku.',
      'Menunjukkan sikap tasamuh (toleransi) di sekolah dan masyarakat.'
    ],
    urutanATP: 1
  },

  // === 2. PENDIDIKAN PANCASILA ===
  // FASE A
  {
    id: 'tp-pp-a-1',
    cpId: 'cp-pp-1-a',
    kodeTP: 'TP-PP.1.1',
    mataPelajaran: 'Pendidikan Pancasila',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Simbol Negara: Bendera, Lagu Kebangsaan & Garuda Pancasila',
    tujuanDeskripsi: 'Mengenal identitas negara seperti bendera Merah Putih, lagu kebangsaan Indonesia Raya, dan lambang negara Garuda Pancasila.',
    alokasiJP: 6,
    dimensiProfilLulusan: ['Kewargaan & Kebangsaan', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Mengenal arti warna merah dan putih pada bendera nasional.',
      'Menyanyikan lagu kebangsaan Indonesia Raya dengan sikap berdiri tegak khidmat.',
      'Menyebutkan lambang burung Garuda sebagai lambang kebanggaan negara.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-pp-a-2',
    cpId: 'cp-pp-1-a',
    kodeTP: 'TP-PP.1.2',
    mataPelajaran: 'Pendidikan Pancasila',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Simbol & Sila-Sila Pancasila',
    tujuanDeskripsi: 'Mengidentifikasi 5 simbol pada perisai Garuda Pancasila dan melafalkan bunyi sila-sila Pancasila secara berurutan.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kewargaan & Kebangsaan', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Memasangkan gambar bintang, rantai, pohon beringin, kepala banteng, dan padi-kapas dengan silanya.',
      'Menghafal bunyi sila kesatu sampai kelima tanpa tertukar.',
      'Menghubungkan simbol bintang dengan keimanan kepada Tuhan YME.'
    ],
    urutanATP: 2
  },
  {
    id: 'tp-pp-a-3',
    cpId: 'cp-pp-1-a',
    kodeTP: 'TP-PP.1.3',
    mataPelajaran: 'Pendidikan Pancasila',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Penerapan Nilai Pancasila di Rumah & Sekolah',
    tujuanDeskripsi: 'Memberikan contoh penerapan nilai-nilai Pancasila dalam kehidupan sehari-hari di lingkungan keluarga dan sekolah.',
    alokasiJP: 6,
    dimensiProfilLulusan: ['Kolaborasi (Gotong Royong)', 'Kemandirian'],
    indikatorKetercapaian: [
      'Menceritakan pengalaman berdoa bersama sebelum makan dan belajar.',
      'Membantu teman yang terjatuh atau meminjamkan alat tulis secara ikhlas.',
      'Menaati antrean cuci tangan dan membuang sampah pada tempatnya.'
    ],
    urutanATP: 3
  },
  {
    id: 'tp-pp-a-4',
    cpId: 'cp-pp-2-a',
    kodeTP: 'TP-PP.1.4',
    mataPelajaran: 'Pendidikan Pancasila',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Aturan di Rumah dan di Sekolah',
    tujuanDeskripsi: 'Mengidentifikasi aturan-aturan yang berlaku di rumah dan sekolah serta melaksanakan hak dan kewajiban anak secara tertib.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kemandirian', 'Kewargaan & Kebangsaan'],
    indikatorKetercapaian: [
      'Menyebutkan 3 aturan tertib di rumah (merapikan tempat tidur, minta izin saat bepergian).',
      'Menaati tata tertib kelas SDN Nambo 03 (datang tepat waktu, memperhatikan guru).',
      'Membedakan hak mendapatkan kasih sayang dan kewajiban belajar.'
    ],
    urutanATP: 4
  },

  // FASE B (PENDIDIKAN PANCASILA)
  {
    id: 'tp-pp-b-1',
    cpId: 'cp-pp-1-b',
    kodeTP: 'TP-PP.3.1',
    mataPelajaran: 'Pendidikan Pancasila',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Makna Sila-Sila Pancasila dalam Kehidupan Sosial',
    tujuanDeskripsi: 'Mengidentifikasi makna sila-sila Pancasila dan menerapkannya dalam musyawarah kelas serta sikap gotong royong.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kewargaan & Kebangsaan', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Menjelaskan makna musyawarah mufakat pada sila keempat.',
      'Mempraktikkan pemilihan ketua regu secara demokratis dan santun.',
      'Melaksanakan piket kebersihan kelas bersama-sama dengan gembira.'
    ],
    urutanATP: 1
  },

  // FASE C (PENDIDIKAN PANCASILA)
  {
    id: 'tp-pp-c-1',
    cpId: 'cp-pp-1-c',
    kodeTP: 'TP-PP.5.1',
    mataPelajaran: 'Pendidikan Pancasila',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Sejarah Kelahiran Pancasila & Ideologi Bangsa',
    tujuanDeskripsi: 'Menganalisis sejarah perumusan Pancasila oleh para pendiri bangsa dan menyajikan kedudukan Pancasila sebagai pandangan hidup bangsa.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kewargaan & Kebangsaan', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Menceritakan sidang BPUPKI dan pidato Ir. Soekarno 1 Juni 1945.',
      'Menguraikan Piagam Jakarta dan penetapan UUD 1945 tanggal 18 Agustus 1945.',
      'Menunjukkan komitmen mempertahankan ideologi Pancasila dari radikalisme.'
    ],
    urutanATP: 1
  },

  // === 3. BAHASA INDONESIA ===
  // FASE A
  {
    id: 'tp-bin-a-1',
    cpId: 'cp-bin-1-a',
    kodeTP: 'TP-BIN.1.1',
    mataPelajaran: 'Bahasa Indonesia',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Mengenal Bunyi Huruf & Membaca Suku Kata',
    tujuanDeskripsi: 'Mengenal bunyi huruf vokal dan konsonan, merangkai huruf menjadi suku kata dan kata yang sering ditemui sehari-hari.',
    alokasiJP: 10,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Komunikasi Efektif'],
    indikatorKetercapaian: [
      'Melafalkan fonem vokal (a, i, u, e, o) dan konsonan awal kata.',
      'Membaca kata dua suku kata berpola KV-KV (buku, bola, sapu) secara lancar.',
      'Menuliskan kata yang didengar dengan ejaan yang tepat.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-bin-a-2',
    cpId: 'cp-bin-2-a',
    kodeTP: 'TP-BIN.1.2',
    mataPelajaran: 'Bahasa Indonesia',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Menyimak Cerita & Menemukan Informasi Pokok',
    tujuanDeskripsi: 'Menyimak cerita fabel dan dongeng anak dengan fokus serta menjawab pertanyaan apa, siapa, dan di mana terkait isi cerita.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Komunikasi Efektif'],
    indikatorKetercapaian: [
      'Menunjukkan sikap menyimak aktif tanpa menyela pembicara.',
      'Menjawab 3 pertanyaan kunci terkait tokoh dan alur cerita.',
      'Menceritakan kembali alur dongeng dengan kalimat sendiri secara runtut.'
    ],
    urutanATP: 2
  },
  {
    id: 'tp-bin-a-3',
    cpId: 'cp-bin-3-a',
    kodeTP: 'TP-BIN.1.3',
    mataPelajaran: 'Bahasa Indonesia',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Berbicara Santun: Kalimat Permintaan Maaf & Tolong',
    tujuanDeskripsi: 'Menyampaikan ungkapan tolong, maaf, terima kasih, dan permisi secara lisan dalam interaksi sehari-hari dengan santun.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Komunikasi Efektif', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Mengucapkan kata tolong saat membutuhkan bantuan teman atau guru.',
      'Meminta maaf dengan tulus ketika melakukan kesalahan.',
      'Bermain peran situasi meminta izin di depan kelas dengan intonasi jelas.'
    ],
    urutanATP: 3
  },
  {
    id: 'tp-bin-a-4',
    cpId: 'cp-bin-4-a',
    kodeTP: 'TP-BIN.1.4',
    mataPelajaran: 'Bahasa Indonesia',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Menulis Kalimat Sederhana dengan Huruf Kapital & Tanda Titik',
    tujuanDeskripsi: 'Menulis kalimat sederhana dengan spasi rapi, penggunaan huruf kapital di awal kalimat, dan tanda titik di akhir kalimat.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kemandirian', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Menulis huruf tegak bersambung atau lepas secara proporsional.',
      'Menggunakan huruf kapital pada awal kalimat dan nama orang.',
      'Menempatkan tanda titik pada akhir kalimat pernyataan.'
    ],
    urutanATP: 4
  },

  // FASE B (BAHASA INDONESIA)
  {
    id: 'tp-bin-b-1',
    cpId: 'cp-bin-2-b',
    kodeTP: 'TP-BIN.3.1',
    mataPelajaran: 'Bahasa Indonesia',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Menemukan Ide Pokok Paragraf & Kosakata Baru',
    tujuanDeskripsi: 'Mengidentifikasi ide pokok dan ide pendukung pada teks narasi serta menemukan arti kosakata baru menggunakan kamus.',
    alokasiJP: 10,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Komunikasi Efektif'],
    indikatorKetercapaian: [
      'Menemukan kalimat utama dalam setiap paragraf.',
      'Membuat peta pikiran (mind map) sederhana isi bacaan.',
      'Menyusun 3 kalimat baru menggunakan kosakata yang baru dipelajari.'
    ],
    urutanATP: 1
  },

  // FASE C (BAHASA INDONESIA)
  {
    id: 'tp-bin-c-1',
    cpId: 'cp-bin-4-c',
    kodeTP: 'TP-BIN.5.1',
    mataPelajaran: 'Bahasa Indonesia',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Menulis Teks Eksplanasi Ilmiah & Laporan Investigasi',
    tujuanDeskripsi: 'Menyusun teks eksplanasi tentang fenomena alam/sosial dengan struktur sebab-akibat yang logis dan kaidah bahasa baku.',
    alokasiJP: 10,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas', 'Komunikasi Efektif'],
    indikatorKetercapaian: [
      'Menyusun struktur teks eksplanasi: pernyataan umum, deretan penjelas, dan simpulan.',
      'Menggunakan konjungsi kausalitas (karena, sehingga, oleh sebab itu).',
      'Mempresentasikan hasil tulisan di hadapan teman kelas secara komunikatif.'
    ],
    urutanATP: 1
  },

  // === 4. MATEMATIKA ===
  // FASE A
  {
    id: 'tp-mat-a-1',
    cpId: 'cp-mat-1-a',
    kodeTP: 'TP-MAT.1.1',
    mataPelajaran: 'Matematika',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Mengenal Bilangan Cacah Sampai 20 & Menghitung Maju/Mundur',
    tujuanDeskripsi: 'Menunjukkan pemahaman bilangan cacah sampai 20, menghitung banyak benda konkret, membaca dan menuliskan lambang bilangannya.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kemandirian'],
    indikatorKetercapaian: [
      'Membilang benda secara runtut dari 1 sampai 20.',
      'Menulis lambang bilangan dan nama bilangan 1-20.',
      'Membandingkan dua kumpulan benda menggunakan kata lebih banyak, lebih sedikit, atau sama banyak.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-mat-a-2',
    cpId: 'cp-mat-1-a',
    kodeTP: 'TP-MAT.1.2',
    mataPelajaran: 'Matematika',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Operasi Penjumlahan & Pengurangan Bilangan Sampai 10',
    tujuanDeskripsi: 'Melakukan operasi penjumlahan dan pengurangan bilangan cacah sampai 10 menggunakan benda konkret, jari tangan, dan garis bilangan.',
    alokasiJP: 10,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
    indikatorKetercapaian: [
      'Menjumlahkan dua bilangan hasil maksimal 10 dengan media kelereng/stik es krim.',
      'Menyelesaikan soal cerita pengurangan sampai 10 dalam kehidupan sehari-hari.',
      'Menjelaskan arti simbol tambah (+), kurang (-), dan sama dengan (=).'
    ],
    urutanATP: 2
  },
  {
    id: 'tp-mat-a-3',
    cpId: 'cp-mat-4-a',
    kodeTP: 'TP-MAT.1.3',
    mataPelajaran: 'Matematika',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Mengenal Bentuk Bangun Datar & Bangun Ruang',
    tujuanDeskripsi: 'Mengidentifikasi dan mengelompokkan bentuk bangun datar (segitiga, segi empat, lingkaran) dan bangun ruang (balok, kubus, tabung, bola).',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
    indikatorKetercapaian: [
      'Menyebutkan benda di kelas SDN Nambo 03 yang berbentuk persegi, lingkaran, dan segitiga.',
      'Menggambar bangun datar segitiga, persegi, dan lingkaran dengan rapi.',
      'Menyusun pola pengubinan sederhana dari potongan kertas warna-warni.'
    ],
    urutanATP: 3
  },
  {
    id: 'tp-mat-a-4',
    cpId: 'cp-mat-3-a',
    kodeTP: 'TP-MAT.1.4',
    mataPelajaran: 'Matematika',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Pengukuran Panjang & Berat Satuan Tidak Baku',
    tujuanDeskripsi: 'Membandingkan panjang dan berat benda menggunakan jengkal, langkah kaki, klip kertas, atau gantungan baju timbangan sederhana.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Mengukur panjang meja belajar menggunakan jengkal tangan.',
      'Membandingkan benda yang lebih berat dan lebih ringan secara langsung.',
      'Mencatat data hasil pengukuran kelompok ke dalam tabel bergambar.'
    ],
    urutanATP: 4
  },

  // FASE B (MATEMATIKA)
  {
    id: 'tp-mat-b-1',
    cpId: 'cp-mat-1-b',
    kodeTP: 'TP-MAT.3.1',
    mataPelajaran: 'Matematika',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Operasi Perkalian & Pembagian Bilangan Cacah',
    tujuanDeskripsi: 'Memahami konsep perkalian sebagai penjumlahan berulang dan pembagian sebagai pengurangan berulang sampai bilangan 100.',
    alokasiJP: 12,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kemandirian'],
    indikatorKetercapaian: [
      'Menghafal tabel perkalian 1 sampai 10 secara terstruktur.',
      'Menyelesaikan soal pembagian tanpa sisa.',
      'Memecahkan masalah kontekstual pembagian jatah buah/pensil dalam kehidupan nyata.'
    ],
    urutanATP: 1
  },

  // FASE C (MATEMATIKA)
  {
    id: 'tp-mat-c-1',
    cpId: 'cp-mat-1-c',
    kodeTP: 'TP-MAT.5.1',
    mataPelajaran: 'Matematika',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Operasi Penjumlahan & Pengurangan Pecahan Beda Penyebut',
    tujuanDeskripsi: 'Menyelesaikan operasi hitung penjumlahan dan pengurangan pecahan biasa dan campuran dengan penyebut berbeda menggunakan konsep KPK.',
    alokasiJP: 12,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
    indikatorKetercapaian: [
      'Menentukan KPK dari penyebut dua pecahan yang berbeda.',
      'Mengubah pecahan campuran menjadi pecahan biasa.',
      'Menyelesaikan soal cerita kontekstual pembagian kue/tanah dalam bentuk pecahan.'
    ],
    urutanATP: 1
  },

  // === 5. ILMU PENGETAHUAN ALAM DAN SOSIAL (IPAS) ===
  // FASE B
  {
    id: 'tp-ipas-b-1',
    cpId: 'cp-ipas-1-b',
    kodeTP: 'TP-IPAS.3.1',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Bentuk & Fungsi Bagian Tubuh Tumbuhan',
    tujuanDeskripsi: 'Menganalisis hubungan antara akar, batang, daun, bunga, dan buah dengan fungsinya bagi kelangsungan hidup tumbuhan dan fotosintesis.',
    alokasiJP: 10,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
    indikatorKetercapaian: [
      'Mengamati spesimen tanaman di taman sekolah SDN Nambo 03.',
      'Membedakan jenis akar tunggang dan akar serabut.',
      'Menjelaskan proses fotosintesis pada daun yang menghasilkan oksigen dan karbohidrat.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-ipas-b-2',
    cpId: 'cp-ipas-1-b',
    kodeTP: 'TP-IPAS.3.2',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Wujud Zat & Perubahan Wujud Benda',
    tujuanDeskripsi: 'Mengidentifikasi sifat wujud zat padat, cair, dan gas serta perubahan wujud (mencair, membeku, menguap, mengembun) dalam kehidupan sehari-hari.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Mendemonstrasikan percobaan es mencair dan air mendidih.',
      'Menyebutkan contoh peristiwa mengembun pada gelas air dingin.',
      'Menyimpulkan sifat volume dan bentuk pada masing-masing wujud zat.'
    ],
    urutanATP: 2
  },

  // FASE C (IPAS)
  {
    id: 'tp-ipas-c-1',
    cpId: 'cp-ipas-1-c',
    kodeTP: 'TP-IPAS.5.1',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Sistem Pernapasan & Pencernaan Manusia',
    tujuanDeskripsi: 'Menganalisis organ pernapasan dan pencernaan manusia serta mempraktikkan pola hidup sehat untuk merawat kesehatan organ tubuh.',
    alokasiJP: 10,
    dimensiProfilLulusan: ['Kesehatan & Kebugaran', 'Penalaran Kritis'],
    indikatorKetercapaian: [
      'Menjelaskan alur masuknya oksigen dari hidung, tenggorokan hingga alveolus paru-paru.',
      'Menguraikan fungsi lambung, usus halus, dan usus besar dalam pencernaan makanan.',
      'Menyusun menu gizi seimbang harian untuk mencegah penyakit maag dan sembelit.'
    ],
    urutanATP: 1
  },

  // === 6. BAHASA INGGRIS ===
  // FASE B
  {
    id: 'tp-eng-b-1',
    cpId: 'cp-eng-1-b',
    kodeTP: 'TP-ENG.3.1',
    mataPelajaran: 'Bahasa Inggris',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Greetings, Self Introduction & Classroom Objects',
    tujuanDeskripsi: 'Merespons salam tegur sapa, memperkenalkan nama dan umur, serta menyebutkan benda-benda di dalam ruang kelas dalam bahasa Inggris.',
    alokasiJP: 6,
    dimensiProfilLulusan: ['Komunikasi Efektif', 'Kewargaan & Kebangsaan'],
    indikatorKetercapaian: [
      'Mengucapkan "Good morning, How are you?" dan meresponsnya dengan ramah.',
      'Memperkenalkan diri: "My name is... I am 8 years old".',
      'Menyebutkan benda kelas: "book, pencil, ruler, whiteboard, desk".'
    ],
    urutanATP: 1
  },

  // FASE C (BAHASA INGGRIS)
  {
    id: 'tp-eng-c-1',
    cpId: 'cp-eng-1-c',
    kodeTP: 'TP-ENG.5.1',
    mataPelajaran: 'Bahasa Inggris',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Daily Activities & Telling the Time',
    tujuanDeskripsi: 'Menceritakan kegiatan sehari-hari (daily routines) dan membaca jam (telling the time) menggunakan simple present tense.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Komunikasi Efektif', 'Kemandirian'],
    indikatorKetercapaian: [
      'Menyebutkan waktu: "It is seven o\'clock, half past seven".',
      'Menyusun 5 kalimat rutin harian (wake up, take a bath, go to school).',
      'Melakukan dialog tanya jawab tentang hobi dengan teman sebaya.'
    ],
    urutanATP: 1
  },

  // === 7. SENI RUPA ===
  // FASE A
  {
    id: 'tp-sn-a-1',
    cpId: 'cp-sn-1-a',
    kodeTP: 'TP-SR.1.1',
    mataPelajaran: 'Seni Rupa',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Eksplorasi Garis, Bentuk & Warna Primer',
    tujuanDeskripsi: 'Mengenal unsur seni rupa (garis lurus, lengkung, warna merah, kuning, biru) dan menggambar ekspresi bebas dengan gembira.',
    alokasiJP: 6,
    dimensiProfilLulusan: ['Kreativitas', 'Kemandirian'],
    indikatorKetercapaian: [
      'Menyebutkan warna primer (merah, kuning, biru).',
      'Menggambar kombinasi aneka garis membentuk pemandangan alam.',
      'Menceritakan hasil lukisan sendiri dengan rasa percaya diri.'
    ],
    urutanATP: 1
  },

  // FASE B (SENI RUPA)
  {
    id: 'tp-sn-b-1',
    cpId: 'cp-sn-2-b',
    kodeTP: 'TP-SR.3.1',
    mataPelajaran: 'Seni Rupa',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Membuat Karya Kolase & Anyaman Sederhana',
    tujuanDeskripsi: 'Menghasilkan karya seni rupa teknik kolase dari bahan alam (daun kering, biji-bijian) dengan komposisi seimbang dan rapi.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kreativitas', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Mengumpulkan bahan alam ramah lingkungan di sekitar sekolah.',
      'Menempel bahan alam mengikuti pola gambar fauna/flora.',
      'Mengapresiasi keunikan karya seni teman sekelas secara santun.'
    ],
    urutanATP: 1
  },

  // FASE C (SENI RUPA)
  {
    id: 'tp-sn-c-1',
    cpId: 'cp-sn-2-c',
    kodeTP: 'TP-SR.5.1',
    mataPelajaran: 'Seni Rupa',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Motif Hias Tradisional Nusantara & Ragam Batik',
    tujuanDeskripsi: 'Menciptakan motif hias dekoratif terinspirasi dari batik daerah Jawa Barat (Bogor/Sunda) dengan prinsip irama dan keselarasan.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kreativitas', 'Kewargaan & Kebangsaan'],
    indikatorKetercapaian: [
      'Mengenal motif batik kujang dan daun teh khas Bogor.',
      'Menggambar pola dekoratif berulang pada kertas gambar.',
      'Mewarnai karya menggunakan teknik gradasi warna yang harmonis.'
    ],
    urutanATP: 1
  },

  // === 8. PENDIDIKAN JASMANI, OLAHRAGA, DAN KESEHATAN (PJOK) ===
  // FASE A
  {
    id: 'tp-pjok-a-1',
    cpId: 'cp-pjok-1-a',
    kodeTP: 'TP-PJOK.1.1',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Pola Gerak Dasar Lokomotor: Jalan, Lari, & Lompat',
    tujuanDeskripsi: 'Mempraktikkan gerak dasar berjalan lurus, berlari zig-zag, dan melompat rintangan rendah dalam bentuk permainan sirkuit ceria.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kesehatan & Kebugaran', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Berjalan tegak mengikuti garis lurus tanpa goyah.',
      'Berlari lincah menghindari rintangan kerucut (cone).',
      'Melompat dengan tumpuan dua kaki dan mendarat aman.'
    ],
    urutanATP: 1
  },

  // FASE B (PJOK)
  {
    id: 'tp-pjok-b-1',
    cpId: 'cp-pjok-1-b',
    kodeTP: 'TP-PJOK.3.1',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Kombinasi Gerak Manipulatif Permainan Bola Besar',
    tujuanDeskripsi: 'Mempraktikkan variasi menendang, menghentikan, dan menggiring bola sepak secara berpasangan dengan koordinasi yang baik.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kesehatan & Kebugaran', 'Kolaborasi (Gotong Royong)'],
    indikatorKetercapaian: [
      'Menendang bola menggunakan kaki bagian dalam dengan arah tepat.',
      'Menghentikan bola yang bergulir di tanah.',
      'Bermain operan bola beregu dengan menjunjung sportivitas dan kerjasama.'
    ],
    urutanATP: 1
  },

  // FASE C (PJOK)
  {
    id: 'tp-pjok-c-1',
    cpId: 'cp-pjok-1-c',
    kodeTP: 'TP-PJOK.5.1',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Permainan Bola Voli & Kebugaran Jasmani',
    tujuanDeskripsi: 'Mempraktikkan teknik dasar passing bawah dan servis bawah bola voli serta melakukan latihan daya tahan jantung (jogging/interval).',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Kesehatan & Kebugaran', 'Kemandirian'],
    indikatorKetercapaian: [
      'Melakukan passing bawah dengan posisi tangan rapat dan lutut ditekuk.',
      'Mengoperkan bola melewati net kepada rekan satu regu.',
      'Mengukur denyut nadi sebelum dan sesudah aktivitas kebugaran.'
    ],
    urutanATP: 1
  },

  // === 9. KODING & KECERDASAN ARTIFISIAL ===
  // FASE A
  {
    id: 'tp-ka-1-1',
    cpId: 'cp-ka-1-a',
    kodeTP: 'TP-KA.1.1',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Logika Langkah Terarah & Robot Sahabat (BK Unplugged)',
    tujuanDeskripsi: 'Menerapkan berpikir komputasional dengan menyusun urutan kartu panah (maju, belok kanan, belok kiri) untuk mengarahkan teman sebagai robot menuju tujuan.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kolaborasi (Gotong Royong)', 'Kreativitas'],
    indikatorKetercapaian: [
      'Mengidentifikasi arah maju, mundur, kanan, dan kiri pada grid petak lantai.',
      'Menyusun minimal 4 kartu instruksi langkah berurutan secara logis.',
      'Melakukan koreksi langkah (debugging) jika simulasi robot keluar dari jalur petak.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-ka-1-2',
    cpId: 'cp-ka-1-a',
    kodeTP: 'TP-KA.1.2',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Ganjil',
    materiPokok: 'Pengenalan Pola Warna & Bentuk Berulang (Pattern Recognition)',
    tujuanDeskripsi: 'Mengidentifikasi dan melengkapi pola urutan warna, angka, dan bentuk simetris yang berulang untuk memecahkan teka-teki logika visual.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
    indikatorKetercapaian: [
      'Menemukan aturan pengulangan pada deret warna (misal: merah-kuning-hijau berulang).',
      'Memprediksi objek selanjutnya pada labirin teka-teki logika.',
      'Membuat gelang pola manik-manik logika berulang secara mandiri.'
    ],
    urutanATP: 2
  },
  {
    id: 'tp-ka-1-3',
    cpId: 'cp-ka-2-a',
    kodeTP: 'TP-KA.1.3',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    fase: 'Fase A',
    kelasTarget: 'Kelas 1',
    semester: 'Genap',
    materiPokok: 'Pengenalan Kecerdasan Artifisial: Sensor Suara & Wajah',
    tujuanDeskripsi: 'Mengenal teknologi cerdas di kehidupan sehari-hari (asisten suara ponsel, kamera pendeteksi senyum) dan mempraktikkan etika penggunaan gawai yang sehat.',
    alokasiJP: 6,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kewargaan & Kebangsaan'],
    indikatorKetercapaian: [
      'Menyebutkan 3 contoh benda teknologi yang memiliki kemampuan cerdas.',
      'Membedakan mana yang merupakan perintah manusia dan mana respon mesin.',
      'Menerapkan aturan waktu layar (screen time) sehat dan sopan santun digital.'
    ],
    urutanATP: 3
  },

  // FASE B (KODING & AI)
  {
    id: 'tp-ka-3-1',
    cpId: 'cp-ka-1-b',
    kodeTP: 'TP-KA.3.1',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Ganjil',
    materiPokok: 'Pemrograman Blok Visual: Animasi Gerak Sprite (ScratchJr)',
    tujuanDeskripsi: 'Membuat animasi cerita bergambar interaktif dengan menyusun blok perintah gerak, suara, dan dialog sprite secara berurutan.',
    alokasiJP: 10,
    dimensiProfilLulusan: ['Kreativitas', 'Penalaran Kritis', 'Komunikasi Efektif'],
    indikatorKetercapaian: [
      'Memilih latar panggung dan karakter sprite sesuai tema cerita.',
      'Menyusun blok instruksi "Start on Green Flag" diikuti balok gerak dan suara.',
      'Menjalankan program dan membagikan karya animasi kepada teman sekelas.'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-ka-3-2',
    cpId: 'cp-ka-2-b',
    kodeTP: 'TP-KA.3.2',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    fase: 'Fase B',
    kelasTarget: 'Kelas 3',
    semester: 'Genap',
    materiPokok: 'Bagaimana AI Mengenali Gambar (Computer Vision Ramah Anak)',
    tujuanDeskripsi: 'Memahami bagaimana model kecerdasan artifisial mengenali benda melalui klasifikasi contoh gambar konkret dan menjaga privasi data pribadi.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kewargaan & Kebangsaan'],
    indikatorKetercapaian: [
      'Mengelompokkan 10 gambar hewan berdasarkan ciri fisik yang dapat dikenali AI.',
      'Menjelaskan bahwa komputer belajar dari data yang dimasukkan oleh manusia.',
      'Menjaga kerahasiaan foto dan data pribadi saat beraktivitas di internet.'
    ],
    urutanATP: 2
  },

  // FASE C (KODING & AI)
  {
    id: 'tp-ka-5-1',
    cpId: 'cp-ka-1-c',
    kodeTP: 'TP-KA.5.1',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Ganjil',
    materiPokok: 'Logika Percabangan (If-Then) & Game Edukasi Sederhana',
    tujuanDeskripsi: 'Membuat game kuis edukatif atau tangkap objek menggunakan blok visual (Scratch) dengan mengintegrasikan variabel skor dan percabangan kondisi (if-then).',
    alokasiJP: 12,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas', 'Kemandirian'],
    indikatorKetercapaian: [
      'Membuat variabel "Skor" yang bertambah saat objek tertangkap.',
      'Menerapkan balok kondisi "jika menyentuh warna / sprite maka tambah poin".',
      'Melakukan pengujian permainan dan perbaikan kesalahan program (debugging).'
    ],
    urutanATP: 1
  },
  {
    id: 'tp-ka-5-2',
    cpId: 'cp-ka-2-c',
    kodeTP: 'TP-KA.5.2',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    fase: 'Fase C',
    kelasTarget: 'Kelas 5',
    semester: 'Genap',
    materiPokok: 'Etika Prompting Generatif & Dampak Kecerdasan Artifisial',
    tujuanDeskripsi: 'Merumuskan instruksi (prompt) yang jelas, sopan, dan etis kepada model AI untuk mencari ide pembelajaran serta menganalisis dampak positif dan negatif teknologi AI.',
    alokasiJP: 8,
    dimensiProfilLulusan: ['Penalaran Kritis', 'Komunikasi Efektif', 'Kewargaan & Kebangsaan'],
    indikatorKetercapaian: [
      'Menuliskan prompt instruksi yang spesifik untuk membuat rangkuman materi.',
      'Memverifikasi kebenaran fakta jawaban AI terhadap buku sumber terpercaya.',
      'Mendiskusikan pentingnya kejujuran akademik dan larangan plagiarisme digital.'
    ],
    urutanATP: 2
  }
];

// =========================================================================
// 3. PROGRAM TAHUNAN (PROTA) CONTOH LENGKAP TA 2026-2027
// =========================================================================
export const initialProtaRecords: ProtaRecord[] = [
  {
    id: 'prota-c-1a-koding',
    kelasId: 'c-1a',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    tahunAjaran: '2026-2027',
    guruPengampu: 'Dian Purnamasari, S.Pd.',
    totalJPEfektif: 36,
    items: [
      {
        id: 'prow-1',
        kodeTP: 'TP-KA.1.1',
        materiPokok: 'Logika Langkah Terarah & Robot Sahabat (BK Unplugged)',
        semester: 'Ganjil',
        alokasiJP: 8,
        perkiraanBulan: 'Juli - Agustus'
      },
      {
        id: 'prow-2',
        kodeTP: 'TP-KA.1.2',
        materiPokok: 'Pengenalan Pola Warna & Bentuk Berulang (Pattern Recognition)',
        semester: 'Ganjil',
        alokasiJP: 8,
        perkiraanBulan: 'September - Oktober'
      },
      {
        id: 'prow-3',
        kodeTP: 'TP-KA.1.3',
        materiPokok: 'Pengenalan Kecerdasan Artifisial: Sensor Suara & Wajah',
        semester: 'Genap',
        alokasiJP: 10,
        perkiraanBulan: 'Januari - Februari'
      },
      {
        id: 'prow-4',
        kodeTP: 'TP-KA.1.4',
        materiPokok: 'Etika Komputasi & Proyek Mini Robot Sahabat',
        semester: 'Genap',
        alokasiJP: 10,
        perkiraanBulan: 'Maret - Mei'
      }
    ],
    catatan: 'Disusun sesuai Dokumen Capaian Pembelajaran Kurikulum Merdeka Terintegrasi Koding & AI SD Negeri Nambo 03 TA 2026-2027.',
    updatedAt: new Date().toISOString()
  }
];

// =========================================================================
// 4. PROGRAM SEMESTER (PROMES) CONTOH LENGKAP TA 2026-2027
// =========================================================================
export const initialPromesRecords: PromesRecord[] = [
  {
    id: 'promes-c-1a-koding-ganjil',
    kelasId: 'c-1a',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    tahunAjaran: '2026-2027',
    semester: 'Ganjil',
    guruPengampu: 'Dian Purnamasari, S.Pd.',
    totalJPSemester: 16,
    items: [
      {
        id: 'prom-1',
        kodeTP: 'TP-KA.1.1',
        materiPokok: 'Logika Langkah Terarah & Robot Sahabat',
        alokasiJP: 8,
        distribusiMingguan: {
          'M1_W3': 2,
          'M1_W4': 2,
          'M2_W1': 2,
          'M2_W2': 2
        }
      },
      {
        id: 'prom-2',
        kodeTP: 'TP-KA.1.2',
        materiPokok: 'Pengenalan Pola Warna & Bentuk Berulang',
        alokasiJP: 8,
        distribusiMingguan: {
          'M3_W1': 2,
          'M3_W2': 2,
          'M3_W3': 2,
          'M3_W4': 2
        }
      }
    ],
    catatan: 'Minggu Efektif Semester Ganjil TA 2026-2027 SDN Nambo 03 Klapanunggal.',
    updatedAt: new Date().toISOString()
  }
];

// =========================================================================
// 5. MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING MODEL RESMI KEMENDIKBUD)
// =========================================================================
export const initialDeepLearningModules: DeepLearningModule[] = [
  {
    id: 'ma-dl-ka-1a-01',
    tpId: 'tp-ka-1-1',
    kodeModul: 'MA-DL-KA-1A-01',
    mataPelajaran: 'Koding & Kecerdasan Artifisial',
    kelasId: 'c-1a',
    kelasNama: 'Kelas 1A',
    fase: 'Fase A',
    alokasiWaktu: '2 JP (2 x 35 Menit)',
    pertemuanKe: 1,
    tahunAjaran: '2026-2027',
    semester: 'Ganjil',
    tanggalAjar: '2026-07-20',

    guruPenyusun: 'Dian Purnamasari, S.Pd.',
    nipGuruPenyusun: '199106242022212000',
    kepalaSekolah: 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.',
    nipKepalaSekolah: '198607172014062001',

    // 1. Identifikasi & Kesiapan Belajar
    kesiapanBelajarMurid: 'Berdasarkan asesmen diagnostik awal di Kelas 1A, murid menunjukkan antusiasme fisik dan rasa ingin tahu yang tinggi. 80% murid sudah mampu membedakan arah kanan dan kiri dengan bantuan visual, sedangkan 20% memerlukan pendampingan konkret (scaffolding).',
    dimensiProfilLulusan: [
      'Penalaran Kritis',
      'Kolaborasi (Gotong Royong)',
      'Kreativitas',
      'Komunikasi Efektif'
    ],
    prinsipDeepLearning: {
      mindful: 'Peserta didik berkesadaran penuh memahami fungsi instruksi yang runtut dalam memandu gerakan teman agar tidak menabrak rintangan.',
      meaningful: 'Mengaitkan alur instruksi algoritma langkah dengan kegiatan sehari-hari di rumah (misal: urutan memakai sepatu dan mencuci tangan).',
      joyful: 'Pembelajaran disajikan melalui permainan interaktif gerak "Robot Sahabat" di atas labirin lantai yang menggembirakan.',
      olahDimensi: ['Olahpikir', 'Olahhati', 'Olahrasa', 'Olahraga']
    },

    // 2. Desain Pembelajaran
    desainPembelajaran: {
      tujuanSpesifik: 'Peserta didik mampu menyusun minimal 4 kartu instruksi arah (maju, belok kanan, belok kiri) secara runtut untuk mengarahkan teman sebagai robot menuju kotak bintang di lantai labirin tanpa kesalahan.',
      praktikPedagogis: 'Pembelajaran Berbasis Permainan Logika Unplugged (Game-Based Learning & Experiential Learning)',
      lingkunganBelajar: 'Ruang kelas Kelas 1A yang ditata terbuka dengan labirin garis petak lantai berukuran 4x4 meter, aman, cerah, dan ramah anak.',
      kemitraan: 'Melibatkan komunikasi dengan orang tua melalui buku penghubung untuk mengajak anak menceritakan urutan aktivitas harian di rumah.',
      pemanfaatanDigitalAI: 'Pengenalan konsep dasar bagaimana komputer dan robot cerdas digerakkan oleh sekumpulan instruksi (kode) yang ditulis oleh manusia.'
    },

    // 3. Pengalaman Belajar (Siklus Memahami - Mengaplikasi - Merefleksi)
    pengalamanBelajar: {
      kegiatanAwal: {
        alokasiMenit: 10,
        langkah: [
          'Guru menyapa murid dengan ceria, mengajak berdoa bersama, dan mengecek kehadiran.',
          'Mindful Check-in: Latihan olah nafas tenang "Tepuk Fokus & Hela Nafas Damai" untuk memusatkan perhatian belajar.',
          'Apersepsi: Guru memperagakan gerakan robot kaku yang kebingungan karena belum diberi kartu perintah petunjuk arah.',
          'Guru menyampaikan tujuan belajar hari ini: "Hari ini kita semua akan menjadi programmer cilik yang memprogram teman kita menjadi Robot Sahabat!"'
        ],
        pertanyaanPemantik: [
          'Bagaimana cara kita memberi tahu jalan kepada robot agar tidak tersesat atau menabrak dinding?',
          'Mengapa urutan perintah itu tidak boleh tertukar?'
        ]
      },
      kegiatanInti: {
        alokasiMenit: 50,
        memahami: [
          'Tahap 1 (Memahami - Berkesadaran & Bermakna): Guru menunjukkan 3 kartu panah logika: Kartu Hijau (Maju 1 Langkah), Kartu Kuning (Belok Kanan), dan Kartu Biru (Belok Kiri).',
          'Murid bersama-sama mempraktikkan arti masing-masing kartu dengan melangkah di tempat.',
          'Murid berdiskusi mengidentifikasi arah tujuan di labirin lantai petak 4x4.'
        ],
        mengaplikasi: [
          'Tahap 2 (Mengaplikasi - Bermakna & Menggembirakan): Murid dibagi ke dalam kelompok kecil berpasangan (Programmer dan Robot).',
          'Murid programmer memilih dan menyusun deretan kartu instruksi di meja perencana.',
          'Murid robot melangkah di atas labirin lantai mengikuti kartu yang dibuka satu per satu oleh rekannya.',
          'Jika robot menemui balok halangan (kotak batu), murid secara kritis berdiskusi mengubah urutan kartu (debugging langkah).'
        ],
        merefleksi: [
          'Tahap 3 (Merefleksi - Mindful & Joyful): Setiap kelompok berbagi pengalaman saat berhasil mencapai garis finis kotak bintang.',
          'Seluruh kelas memberikan tepuk tangan meriah dan apresiasi jempol atas kerja sama kelompok.',
          'Murid mendiskusikan perasaan mereka ketika memprogram teman dan diprogram sebagai robot.'
        ]
      },
      kegiatanPenutup: {
        alokasiMenit: 10,
        langkah: [
          'Guru bersama murid menyimpulkan inti pembelajaran: Komputer dan robot sangat taat pada urutan instruksi yang tepat.',
          'Refleksi emosi: Murid mengangkat kartu emoji senang/sangat senang atas proses belajar hari ini.',
          'Guru memberikan penguatan positif atas semangat gotong royong dan ketertiban seluruh murid.',
          'Doa bersama dan salam penutup.'
        ],
        tindakLanjut: 'Murid diajak mencoba mempraktikkan urutan langkah merapikan alat tulis saat sampai di rumah.'
      }
    },

    // 4. Asesmen Autentik & Rubrik KKTP
    asesmenAutentik: {
      formatifAwal: 'Observasi kesiapan dan tanya jawab interaktif diagnostik mengenai pemahaman arah kanan, kiri, maju, dan mundur.',
      formatifProses: 'Lembar observasi ketepatan menyusun deretan kartu panah dan kerja sama aktif dalam kelompok simulasi labirin.',
      sumatif: 'Unjuk kerja autentik: Menyusun algoritma 4 langkah pada lembar aktivitas kartu terarah menuju target tanpa menabrak halangan.',
      rubrik: [
        {
          aspek: 'Ketepatan Penyusunan Alur Algoritma (Logika Langkah)',
          perluBimbingan: 'Belum mampu menyusun urutan kartu arah dengan benar; arah langkah masih sering tertukar (< 70).',
          cukup: 'Mampu menyusun 2-3 langkah instruksi dengan arahan dan bimbingan guru (70-79).',
          baik: 'Mampu menyusun 4 langkah instruksi secara tepat dan mandiri menuju target (80-89).',
          sangatBaik: 'Sangat mandiri, mampu menyusun rute alternatif efisien dan melakukan debugging saat terjadi kesalahan langkah (90-100).'
        },
        {
          aspek: 'Kolaborasi & Nilai Berkesadaran (Joyful & Mindful)',
          perluBimbingan: 'Pasif atau mendominasi teman; belum sabar menunggu giliran (< 70).',
          cukup: 'Cukup aktif bekerja sama bila diingatkan oleh guru atau teman (70-79).',
          baik: 'Bekerja sama dengan antusias, menghargai giliran teman, dan bergembira (80-89).',
          sangatBaik: 'Menjadi teladan kerja sama, sangat suportif, santun, dan menciptakan suasana ceria bagi tim (90-100).'
        }
      ],
      bahanAjarRingkas: `RINGKASAN BAHAN AJAR SISWA & GURU
SD NEGERI NAMBO 03 KLAPANUNGGAL - KABUPATEN BOGOR
Mata Pelajaran : Koding & Kecerdasan Artifisial
Kelas / Fase   : Kelas 1A / Fase A
Materi Pokok   : Logika Langkah Terarah & Robot Sahabat (BK Unplugged)

1. KONSEP DASAR:
- Algoritma adalah urutan langkah terarah dan logis untuk menyelesaikan sebuah tugas.
- Robot dan komputer membutuhkan perintah yang jelas dari manusia agar dapat bergerak dengan benar.
- Tiga Perintah Dasar Robot Sahabat:
  [↑] MAJU        : Melangkah 1 kotak lurus ke depan
  [→] BELOK KANAN : Memutar badan menghadap ke arah tangan kanan
  [←] BELOK KIRI  : Memutar badan menghadap ke arah tangan kiri

2. NILAI UTAMA:
- Teliti, sabar, dan tidak takut salah. Jika langkah salah, kita perbaiki bersama-sama (Debugging)!`,
      lembarKerjaSiswa: `LEMBAR KERJA PESERTA DIDIK (LKPD) PEMBELAJARAN MENDALAM
SD NEGERI NAMBO 03
Nama Murid : ________________________   Kelas : 1A
Mata Pelajaran : Koding & AI           Tanggal : ____________

TANTANGAN MISI ROBOT SAHABAT!
1. Bantu Robot Sahabat mengambil Bintang Emas di ujung petak!
2. Gambarkan panah [↑ MAJU], [→ KANAN], atau [← KIRI] di kotak bawah ini:
   [ Langkah 1 ] -> [ Langkah 2 ] -> [ Langkah 3 ] -> [ Langkah 4 ]

REFLEKSI PERASAANKU HARI INI:
Bagaimana perasaanmu belajar memprogram teman hari ini?
[ ] Sangat Gembira  [ ] Gembira  [ ] Perlu Latihan Lagi`,

      // Instrumen Penilaian Lengkap Kurikulum Merdeka Mendalam
      bentukJenis: {
        diagnostikAwal: 'Asesmen diagnostik non-kognitif & kognitif: Mengidentifikasi kesiapan motorik serta pemahaman arah orientasi spasial (kanan, kiri, maju, mundur).',
        formatifProses: 'Asesmen formatif berkelanjutan: Observasi keterlibatan aktif, cek kelancaran simulasi unplugged kartu logika berpasangan, dan bimbingan langsung (scaffolding).',
        sumatifAkhir: 'Asesmen sumatif lingkup materi: Tes tertulis pemahaman pola urutan kartu (Pilihan Ganda & Uraian HOTS) dan unjuk kerja simulasi labirin logika.',
        teknikInstrumen: [
          'Teknik Observasi: Lembar Pengamatan Sikap Gotong Royong dan Bernalar Kritis',
          'Teknik Tes Kinerja: Praktik Simulasi Unplugged "Robot Sahabat" di Labirin Lantai 4x4',
          'Teknik Tes Tertulis: Lembar Soal Evaluasi Individu (5 Butir Soal Terstruktur)',
          'Teknik Portofolio: Hasil Pengerjaan LKPD Terstruktur dan Jurnal Refleksi Mandiri'
        ]
      },
      soalIndividu: {
        petunjuk: 'Jawablah pertanyaan di bawah ini dengan teliti, cermat, dan mandiri!',
        daftarSoal: [
          {
            nomor: 1,
            bentuk: 'Pilihan Ganda',
            pertanyaan: 'Urutan langkah-langkah yang teratur dan jelas untuk menyelesaikan suatu tugas disebut...',
            pilihan: ['A. Algoritma / Perintah Runtut', 'B. Mencontek', 'C. Lompat Tali', 'D. Melamun'],
            kunciJawaban: 'A. Algoritma / Perintah Runtut',
            bobotSkor: 15
          },
          {
            nomor: 2,
            bentuk: 'Pilihan Ganda',
            pertanyaan: 'Jika Robot Sahabat ingin melangkah 1 kotak lurus ke depan, kartu perintah yang harus ditunjukkan adalah...',
            pilihan: ['A. Panah Belok Kiri', 'B. Panah Maju Ke Depan (↑)', 'C. Panah Mundur', 'D. Panah Berhenti'],
            kunciJawaban: 'B. Panah Maju Ke Depan (↑)',
            bobotSkor: 15
          },
          {
            nomor: 3,
            bentuk: 'Pilihan Ganda',
            pertanyaan: 'Di depan Robot Sahabat terdapat balok batu rintangan. Tindakan yang paling tepat agar tidak menabrak rintangan adalah...',
            pilihan: ['A. Menabraknya terus', 'B. Memutar arah / belok lalu maju ke jalan aman', 'C. Duduk menangis', 'D. Mematikan robot'],
            kunciJawaban: 'B. Memutar arah / belok lalu maju ke jalan aman',
            bobotSkor: 20
          },
          {
            nomor: 4,
            bentuk: 'Uraian Singkat',
            pertanyaan: 'Tuliskan secara runtut 3 langkah yang kamu lakukan saat hendak berangkat ke sekolah di pagi hari!',
            kunciJawaban: 'Mandi/mencuci muka -> Mengenakan seragam sekolah yang rapi -> Sarapan pagi dan berpamitan kepada orang tua.',
            bobotSkor: 25
          },
          {
            nomor: 5,
            bentuk: 'HOTS',
            pertanyaan: 'Budi menyusun kartu: [MAJU] -> [MAJU] -> [BELOK KANAN] -> [MAJU]. Ternyata temannya malah menabrak kursi di sebelah kanan. Apa yang harus diperbaiki Budi dan bagaimana sikapnya yang baik?',
            kunciJawaban: 'Budi harus memeriksa kembali arah belokan (mungkin harus belok kiri atau melangkah mundur) dan memperbaikinya dengan tenang (debugging), serta mendengarkan masukan rekannya dengan sopan.',
            bobotSkor: 25
          }
        ],
        totalSkor: 100
      },
      soalKelompok: {
        judulTantangan: 'Proyek Kolaborasi Kelompok: Misi Penyelamatan Bintang Emas di Labirin Sekolah',
        petunjukKelompok: 'Bentuk tim beranggotakan 3-4 murid. Bagilah peran: 1 orang Arsitek Kode (Penyusun Kartu), 1 orang Navigator (Pemberi Aba-aba), dan 1-2 orang Robot Penjelajah.',
        skenarioKasus: 'Robot Penjelajah harus membawa persediaan air dari Pos A menuju Tenda Relawan di Pos B. Namun, terdapat 2 petak rintangan lumpur di tengah jalur yang tidak boleh dilalui.',
        tugasKolaboratif: [
          'Amati peta lantai 4x4 dan diskusikan jalur alternatif yang paling aman dan tercepat.',
          'Susun 5 kartu perintah arah secara berurutan di papan perencana kelompok.',
          'Uji coba algoritma bersama: Arsitek membacakan kartu, Robot melangkah sesuai aba-aba Navigator.',
          'Lakukan evaluasi bersama tim: Apakah ada langkah yang salah? Catat dan diskusikan cara perbaikannya!'
        ],
        kriteriaPenilaian: [
          { aspek: 'Kekompakan & Pembagian Peran', bobot: '30%', deskripsi: 'Seluruh anggota kelompok aktif terlibat, saling menghargai pendapat, dan tidak berebut giliran.' },
          { aspek: 'Ketepatan Alur Perintah (Bebas Tabrakan)', bobot: '40%', deskripsi: 'Robot berhasil mencapai tujuan tanpa menginjak petak rintangan lumpur.' },
          { aspek: 'Kreativitas & Kemampuan Debugging', bobot: '30%', deskripsi: 'Mampu menemukan jalur efisien dan cepat memperbaiki urutan kartu saat terjadi kesalahan.' }
        ]
      },
      lkpdLengkap: {
        judulLKPD: 'LEMBAR KERJA PESERTA DIDIK (LKPD) DEEP LEARNING: KODING UNPLUGGED KELAS 1',
        identitasKelompok: true,
        tujuanAktivitas: 'Peserta didik dapat memahami konsep urutan instruksi (algoritma), menyusun rute langkah berkesadaran tanpa layar, dan merefleksikan kerja sama gotong royong.',
        alatDanBahan: [
          'Kartu Panah Arah (Maju Hijau, Belok Kanan Kuning, Belok Kiri Biru)',
          'Papan Petak Labirin 4x4 meter di lantai kelas',
          'Miniatur Bintang Emas dan Balok Halangan',
          'Alat tulis dan pensil warna'
        ],
        petunjukPengerjaan: [
          'Berdoalah sebelum memulai kegiatan bersama teman sekelompokmu.',
          'Tuliskan nama anggota kelompok pada kolom identitas di atas.',
          'Ikuti arahan guru dalam menyusun kartu instruksi panah secara tertib.',
          'Diskusikan setiap keputusan arah dengan ramah dan dengarkan pendapat teman.'
        ],
        langkahEksplorasi: [
          'Langkah 1: Letakkan miniatur Robot Sahabat pada kotak awal (START).',
          'Langkah 2: Amati posisi Kotak Bintang (FINISH) dan rintangan balok kayu.',
          'Langkah 3: Rencanakan rute terpendek dan susun 4 kartu panah secara mendatar di meja kerjamu.',
          'Langkah 4: Jalankan Robot Sahabat langkah demi langkah sesuai urutan kartu yang telah disusun.'
        ],
        tabelAktivitasKerja: 'Tabel Checklist Uji Coba Jalur Labirin:\n- Uji Coba 1: Apakah robot berhasil melewati rintangan? [Ya / Belum]\n- Uji Coba 2: Berapa jumlah kartu instruksi yang dibutuhkan? [.... Kartu]\n- Uji Coba 3: Apakah ada perintah yang perlu diganti? [Tuliskan bila ada]',
        pertanyaanDiskusiReflektif: [
          'Apa yang terjadi jika ada satu kartu instruksi yang terbalik urutannya?',
          'Bagaimana perasaan kelompokmu ketika berhasil memandu robot sampai ke bintang emas?',
          'Apa manfaat bersikap sabar dan mendengarkan teman saat menyusun kode bersama?'
        ],
        refleksiDiri: 'Beri tanda centang (√) pada gambar emoji yang mewakili perasaan belajarmu hari ini: [ ] Luar Biasa Gembira  [ ] Gembira  [ ] Ingin Mencoba Lagi Besok'
      }
    },

    updatedAt: new Date().toISOString()
  }
];
