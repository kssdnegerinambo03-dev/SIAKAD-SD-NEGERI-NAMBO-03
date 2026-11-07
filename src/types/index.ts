export type StudentStatus = 'Aktif' | 'Mutasi Keluar' | 'Berhenti DO' | 'Pindahan Masuk' | 'Lulus';

export type Religion = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';

export interface TransferInfo {
  asalSekolah: string;
  tanggalPindah: string;
  nomorSurat: string;
  alasan: string;
  kelasTujuanId: string;
}

export interface ExitInfo {
  sekolahTujuan?: string;
  tanggalKeluar: string;
  alasan: string;
  nomorSurat?: string;
}

export interface Student {
  nisn: string; // Unique ID
  nis: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: Religion;
  jenisKelamin: 'L' | 'P';
  nik: string;
  alamat: string;
  tinggiBadan?: number; // cm (optional)
  beratBadan?: number; // kg (optional)
  kelasId: string;
  status: StudentStatus;
  isPIP: boolean;
  ekskulIds: string[]; // Selected extracurricular activities
  transferInfo?: TransferInfo;
  exitInfo?: ExitInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ClassGroup {
  id: string;
  nama: string;
  jenis: 'Utama' | 'Ekskul';
  waliKelasId?: string; // Teacher ID
  pembinaId?: string; // Teacher or Staff ID
  deskripsi?: string;
  kapasitas?: number;
  hariLatihan?: string; // For Ekskul
  waktuLatihan?: string; // For Ekskul
}

export interface Teacher {
  id: string;
  nip: string; // NIP or '-'
  nuptk?: string;
  nama: string;
  gelar: string;
  jabatan: string; // e.g., 'Guru Kelas 1', 'Guru PJOK', 'Guru PAI', etc.
  jenisKelamin: 'L' | 'P';
  statusKepegawaian: 'PNS' | 'PPPK' | 'Honorer / GTT';
  golongan: string; // e.g., 'III/a', 'IX', '-'
  noHp: string;
  email: string;
  statusAktif: boolean;
  alamat?: string;
}

export interface Staff {
  id: string;
  nik: string;
  nip?: string;
  nama: string;
  tugas: string; // e.g. 'Kepala Tata Usaha', 'Operator Dapodik', 'Bendahara BOS', 'Penjaga Sekolah'
  statusKepegawaian: 'PNS' | 'PPPK' | 'Honorer / PTT';
  pendidikan: string; // e.g. 'S1 Administrasi', 'SMA/SMK'
  noHp: string;
  statusAktif: boolean;
  alamat?: string;
}

export interface TeachingHour {
  id: string;
  guruId: string;
  mataPelajaran: string;
  kelasId: string;
  jumlahJP: number; // Jam Pelajaran per minggu
  hari: string;
  jamMulai?: string;
  jamSelesai?: string;
}

export interface PerformancePractice {
  id: string;
  guruId: string;
  indikator: string; // e.g., 'Penerapan Disiplin Positif', 'Keteraturan Suasana Kelas', dll.
  catatanGuru: string;
  statusObservasi: 'Sudah' | 'Belum';
  skor: number; // 100 if sudah observasi
  tanggalObservasi?: string;
  catatanKepsek?: string;
  periode: string; // e.g., 'Semester Ganjil 2026/2027'

  // 1. Tahap Perencanaan (Pra-Observasi)
  targetPerilaku?: string; // Target perilaku fokus observasi
  upayaMempelajari?: string; // Upaya mempelajari materi/strategi
  jadwalRencana?: string; // Tanggal rencana pelaksanaan observasi
  jamRencana?: string; // Waktu pelaksanaan (contoh: 08.00 - 09.30)
  kelasTargetId?: string; // Rombel observasi (contoh: c-1a)
  mapelTarget?: string; // Mata pelajaran / materi observasi

  // 2. Tahap Pelaksanaan (Observasi Kelas Langsung)
  ratingObservasi?: 'Belum Dilakukan' | 'Dilakukan tapi Belum Efektif' | 'Dilakukan dan Efektif';
  fokusPengamatan?: string; // Fokus pengamatan tindakan guru di kelas
  catatanPengamatanKepsek?: string; // Catatan pengamatan observer/Kepala Sekolah

  // 3. Tahap Umpan Balik & Pasca-Observasi (Tindak Lanjut)
  refleksiPascaObservasi?: string; // Refleksi guru setelah diobservasi
  umpanBalikKepsek?: string; // Umpan balik & rekomendasi Kepala Sekolah
  rencanaTindakLanjut?: string; // Rencana tindak lanjut pengembangan kompetensi
  skorTindakLanjut?: number; // Skor tindak lanjut
}

export interface PerformanceBerAKHLAK {
  id: string;
  guruId: string;
  berorientasiPelayanan: string;
  akuntabel: string;
  kompeten: string;
  harmonis: string;
  loyal: string;
  adaptif: string;
  kolaboratif: string;
  catatan: string;
  tanggal: string;
  statusEvaluasi: 'Memenuhi Ekspektasi' | 'Di Atas Ekspektasi' | 'Perlu Perbaikan';
}

export interface AdditionalTask {
  id: string;
  guruId: string;
  namaTugas: string; // e.g., 'Wali Kelas', 'Pembina Pramuka', 'Koordinator P5', 'Pengelola BOS'
  refleksi: string;
  buktiDukung?: string;
  status: 'Selesai' | 'Dalam Proses' | 'Belum';
  tanggal: string;
}

export interface AttendanceRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD (TA 2026-2027)
  bulan: string; // '2026-07' to '2027-06'
  kelasId: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  totalSiswa: number;
  catatan?: string;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  nss?: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  alamat: string;
  tahunAjaran: string; // '2026-2027'
  semester: 'Ganjil' | 'Genap';
  email: string;
  telepon: string;
  kodePos: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  logoUrl?: string;
}

export type PerformancePredicate =
  | 'Sangat Baik (Di Atas Ekspektasi)'
  | 'Baik (Memenuhi Ekspektasi)'
  | 'Butuh Perbaikan'
  | 'Kurang';

export interface TeacherReportCard {
  id: string;
  guruId: string;
  tahunAjaran: string; // '2026-2027'
  semester: 'Ganjil' | 'Genap' | 'Tahunan';
  predikatKinerja: PerformancePredicate;
  nilaiSkorAkhir: number; // 0 - 100
  catatanKepsek: string;
  rekomendasiKepsek: string;
  tanggalPenetapan: string;
  status: 'Draf' | 'Disetujui Kepala Sekolah';
}

export interface ManualAgeRecap {
  id: string;
  bulan: string; // e.g. '2026-07' to '2027-06'
  kelasId: string;
  lessThan6L: number;
  lessThan6P: number;
  age6L: number;
  age6P: number;
  age7L: number;
  age7P: number;
  age8L: number;
  age8P: number;
  age9L: number;
  age9P: number;
  age10L: number;
  age10P: number;
  age11L: number;
  age11P: number;
  age12L: number;
  age12P: number;
  moreThan12L: number;
  moreThan12P: number;
  updatedAt?: string;
}

export type SchoolRole = 'Kepala Sekolah' | 'Guru Kelas' | 'Guru Mapel' | 'Operator Dapodik' | 'Staf Tata Usaha';

export interface SyncAuditLog {
  id: string;
  timestamp: string; // ISO or formatted
  wargaSekolah: string; // e.g. 'Nurhaeni, S.Pd.'
  peran: SchoolRole;
  lingkup: string; // e.g. 'Kelas 1A', 'Praktik Kinerja', 'Presensi', 'Profil Sekolah', 'Database Pusat'
  jenisAksi: 'Tambah' | 'Ubah' | 'Hapus' | 'Import Excel' | 'Sinkronisasi' | 'Pemulihan';
  judul: string;
  rincianPerubahan: string;
  statusSinkron: 'Tersinkron ke Server' | 'Pending Sinkron';
  diverifikasiKepsek: boolean;
  catatanKepsek?: string;
  waktuVerifikasi?: string;
}

// ==========================================
// KURIKULUM MERDEKA & PEMBELAJARAN MENDALAM
// (DEEP LEARNING TA 2026-2027 KEMENDIKBUD)
// ==========================================

export type CurriculumFase = 'Fase A' | 'Fase B' | 'Fase C';

export interface LearningOutcomeCP {
  id: string;
  fase: CurriculumFase;
  kelas: string[]; // e.g. ['Kelas 1', 'Kelas 2']
  mataPelajaran: string;
  elemen: string;
  deskripsiCP: string;
}

export interface LearningObjectiveTP {
  id: string;
  cpId: string;
  kodeTP: string; // e.g. 'TP-KA.1.1'
  mataPelajaran: string;
  fase: CurriculumFase;
  kelasTarget: string; // e.g. 'Kelas 1'
  semester: 'Ganjil' | 'Genap';
  materiPokok: string;
  tujuanDeskripsi: string;
  alokasiJP: number;
  dimensiProfilLulusan: string[];
  indikatorKetercapaian: string[];
  urutanATP: number;
}

export interface ProtaItem {
  id: string;
  kodeTP: string;
  materiPokok: string;
  semester: 'Ganjil' | 'Genap';
  alokasiJP: number;
  perkiraanBulan: string; // e.g. 'Juli - Agustus'
}

export interface ProtaRecord {
  id: string;
  kelasId: string;
  mataPelajaran: string;
  tahunAjaran: string; // '2026-2027'
  guruPengampu: string;
  totalJPEfektif: number;
  items: ProtaItem[];
  catatan?: string;
  updatedAt: string;
}

export interface PromesItem {
  id: string;
  kodeTP: string;
  materiPokok: string;
  alokasiJP: number;
  // Distribution of JP by Month and Week: key format "M1_W1" to "M6_W5"
  distribusiMingguan: Record<string, number>;
}

export interface PromesRecord {
  id: string;
  kelasId: string;
  mataPelajaran: string;
  tahunAjaran: string; // '2026-2027'
  semester: 'Ganjil' | 'Genap';
  guruPengampu: string;
  totalJPSemester: number;
  items: PromesItem[];
  agendaKhusus?: Record<string, string>; // e.g. STS, SAS, Libur Semester
  catatan?: string;
  updatedAt: string;
}

export interface AssessmentRubricLevel {
  aspek: string;
  perluBimbingan: string; // 0 - 69
  cukup: string; // 70 - 79
  baik: string; // 80 - 89
  sangatBaik: string; // 90 - 100
}

export interface IndividualQuestion {
  nomor: number;
  bentuk: 'Pilihan Ganda' | 'Uraian Singkat' | 'HOTS';
  pertanyaan: string;
  pilihan?: string[];
  kunciJawaban: string;
  bobotSkor: number;
}

export interface GroupChallenge {
  judulTantangan: string;
  petunjukKelompok: string;
  skenarioKasus: string;
  tugasKolaboratif: string[];
  kriteriaPenilaian: Array<{ aspek: string; bobot: string; deskripsi: string }>;
}

export interface StructuredLKPD {
  judulLKPD: string;
  identitasKelompok?: boolean;
  petunjukPengerjaan: string[];
  tujuanAktivitas: string;
  alatDanBahan: string[];
  langkahEksplorasi: string[];
  tabelAktivitasKerja?: string;
  pertanyaanDiskusiReflektif: string[];
  refleksiDiri: string;
}

export interface DeepLearningModule {
  id: string;
  tpId: string;
  kodeModul: string;
  mataPelajaran: string;
  kelasId: string;
  kelasNama: string;
  fase: CurriculumFase;
  alokasiWaktu: string; // e.g. '2 JP (2 x 35 Menit)'
  pertemuanKe: number;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  tanggalAjar?: string;

  // I. Identifikasi
  guruPenyusun: string;
  nipGuruPenyusun: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kesiapanBelajarMurid: string;
  dimensiProfilLulusan: string[];
  prinsipDeepLearning: {
    mindful: string; // Berkesadaran
    meaningful: string; // Bermakna
    joyful: string; // Menggembirakan
    olahDimensi: string[]; // ['Olahpikir', 'Olahhati', 'Olahrasa', 'Olahraga']
  };

  // II. Desain Pembelajaran
  desainPembelajaran: {
    tujuanSpesifik: string;
    praktikPedagogis: string; // Problem Based Learning, Unplugged Coding, dsb.
    lingkunganBelajar: string;
    kemitraan: string;
    pemanfaatanDigitalAI: string;
  };

  // III. Pengalaman Belajar (Siklus Memahami, Mengaplikasi, Merefleksi)
  pengalamanBelajar: {
    kegiatanAwal: {
      alokasiMenit: number;
      langkah: string[];
      pertanyaanPemantik: string[];
    };
    kegiatanInti: {
      alokasiMenit: number;
      memahami: string[]; // Mindful & Bermakna
      mengaplikasi: string[]; // Joyful & Bermakna (coding/praktik)
      merefleksi: string[]; // Mindful & Joyful
    };
    kegiatanPenutup: {
      alokasiMenit: number;
      langkah: string[];
      tindakLanjut: string;
    };
  };

  // IV. Asesmen & Bahan Ajar Autentik (Lengkap dengan Instrumen, Soal Individu, Kelompok & LKPD)
  asesmenAutentik: {
    formatifAwal: string;
    formatifProses: string;
    sumatif: string;
    rubrik: AssessmentRubricLevel[];
    bahanAjarRingkas: string;
    lembarKerjaSiswa: string;

    // Instrumen Penilaian Lengkap Kurikulum Merdeka Mendalam
    bentukJenis?: {
      diagnostikAwal: string;
      formatifProses: string;
      sumatifAkhir: string;
      teknikInstrumen: string[];
    };
    soalIndividu?: {
      petunjuk: string;
      daftarSoal: IndividualQuestion[];
      totalSkor: number;
    };
    soalKelompok?: GroupChallenge;
    lkpdLengkap?: StructuredLKPD;
  };

  updatedAt: string;
}

export type UserPasswordMap = Record<string, string>;

// ==========================================
// ANALISIS HARI EFEKTIF (SESUAI KALENDER PENDIDIKAN)
// ==========================================

export interface BulanHariEfektif {
  bulan: string; // e.g. 'Juli 2026'
  kodeBulan: string; // '2026-07'
  semester: 'Ganjil' | 'Genap';
  jumlahHariKalender: number;
  mingguEfektif: number;
  hariEfektif: number;
  hariLibur: number;
  keteranganKegiatan: string[];
}

export interface AgendaPendidikan {
  id: string;
  tanggalMulai: string; // YYYY-MM-DD
  tanggalSelesai?: string; // YYYY-MM-DD
  kegiatan: string;
  semester: 'Ganjil' | 'Genap';
  kategori: 'MPLS' | 'STS' | 'ASAS' | 'ASAJ' | 'Libur' | 'Rapor' | 'Kegiatan Khusus';
  keterangan?: string;
}

export interface AnalisisHariEfektifRecord {
  id: string;
  tahunAjaran: string; // '2026-2027'
  semester: 'Ganjil' | 'Genap' | 'Setahun';
  kelasTarget: string; // 'Semua Kelas' | 'Kelas 1' .. 'Kelas 6'
  mataPelajaran?: string; // Optional per-mapel calculation
  jamPerMinggu?: number;
  totalHariEfektif: number;
  totalMingguEfektif: number;
  totalJamEfektif?: number;
  daftarBulan: BulanHariEfektif[];
  agendaPendidikan: AgendaPendidikan[];
  catatan?: string;
  updatedAt: string;
}

// ==========================================
// JADWAL PELAJARAN (HARIAN & JAM PELAJARAN 35 MENIT)
// ==========================================

export type HariBelajar = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface JadwalSlot {
  id: string;
  hari: HariBelajar;
  jamKe: number; // 0 for Pembiasaan/Upacara/Senam, 1 s.d. 7 for JP Pelajaran
  jamMulai: string; // e.g. '07.00'
  jamSelesai: string; // e.g. '07.35'
  mataPelajaran: string;
  guruPengampu: string;
  isIstirahat?: boolean;
  ruangan?: string;
  catatan?: string;
}

export interface JadwalPelajaranRecord {
  id: string;
  kelasId: string; // e.g. 'c-1a'
  kelasNama: string; // e.g. 'Kelas 1A'
  waliKelas: string;
  tahunAjaran: string; // '2026-2027'
  semester: 'Ganjil' | 'Genap';
  durasiPerJP: number; // 35 menit per JP
  slots: JadwalSlot[];
  updatedAt: string;
}
