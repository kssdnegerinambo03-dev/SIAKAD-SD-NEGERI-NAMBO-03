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
  wargaSekolah: string; // e.g. 'Hj. Siti Rohmah, S.Pd.SD'
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
