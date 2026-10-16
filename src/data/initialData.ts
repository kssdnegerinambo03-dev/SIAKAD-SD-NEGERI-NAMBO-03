import {
  SchoolProfile,
  ClassGroup,
  Teacher,
  Staff,
  Student,
  TeachingHour,
  PerformancePractice,
  PerformanceBerAKHLAK,
  AdditionalTask,
  AttendanceRecord,
  SyncAuditLog
} from '../types';

export const initialSchoolProfile: SchoolProfile = {
  namaSekolah: 'SD Negeri Nambo 03',
  npsn: '20200352',
  kepalaSekolah: 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.',
  nipKepalaSekolah: '198607172014062001',
  alamat: 'Jl. Raya Nambo Bantarkopo RT 001/004 Desa Bantarjati Kecamatan Klapanunggal Kabupaten Bogor',
  tahunAjaran: '2026-2027',
  semester: 'Ganjil',
  email: 'kssdnegerinambo03@gmail.com',
  telepon: '(021) 82490352',
  kodePos: '16710',
  desa: 'Bantarjati',
  kecamatan: 'Klapanunggal',
  kabupaten: 'Kabupaten Bogor',
  provinsi: 'Jawa Barat',
  logoUrl: '/logo_nambo_03.jpg'
};

export const initialClasses: ClassGroup[] = [
  { id: 'c-1a', nama: 'Kelas 1A', jenis: 'Utama', waliKelasId: 't-1', kapasitas: 32, deskripsi: 'Kelas 1 Reguler A' },
  { id: 'c-1b', nama: 'Kelas 1B', jenis: 'Utama', waliKelasId: 't-2', kapasitas: 32, deskripsi: 'Kelas 1 Reguler B' },
  { id: 'c-2a', nama: 'Kelas 2A', jenis: 'Utama', waliKelasId: 't-3', kapasitas: 32, deskripsi: 'Kelas 2 Reguler A' },
  { id: 'c-2b', nama: 'Kelas 2B', jenis: 'Utama', waliKelasId: 't-4', kapasitas: 32, deskripsi: 'Kelas 2 Reguler B' },
  { id: 'c-3a', nama: 'Kelas 3A', jenis: 'Utama', waliKelasId: 't-5', kapasitas: 32, deskripsi: 'Kelas 3 Reguler A' },
  { id: 'c-3b', nama: 'Kelas 3B', jenis: 'Utama', waliKelasId: 't-6', kapasitas: 32, deskripsi: 'Kelas 3 Reguler B' },
  { id: 'c-4a', nama: 'Kelas 4A', jenis: 'Utama', waliKelasId: 't-7', kapasitas: 32, deskripsi: 'Kelas 4 Fase B Kurikulum Merdeka' },
  { id: 'c-4b', nama: 'Kelas 4B', jenis: 'Utama', waliKelasId: 't-8', kapasitas: 32, deskripsi: 'Kelas 4 Fase B Kurikulum Merdeka' },
  { id: 'c-5a', nama: 'Kelas 5A', jenis: 'Utama', waliKelasId: 't-9', kapasitas: 32, deskripsi: 'Kelas 5 Fase C Kurikulum Merdeka' },
  { id: 'c-5b', nama: 'Kelas 5B', jenis: 'Utama', waliKelasId: 't-10', kapasitas: 32, deskripsi: 'Kelas 5 Fase C Kurikulum Merdeka' },
  { id: 'c-6a', nama: 'Kelas 6A', jenis: 'Utama', waliKelasId: 't-11', kapasitas: 32, deskripsi: 'Kelas 6 Persiapan Kelulusan' },
  { id: 'c-6b', nama: 'Kelas 6B', jenis: 'Utama', waliKelasId: 't-12', kapasitas: 32, deskripsi: 'Kelas 6 Persiapan Kelulusan' },
  // Ekskul
  { id: 'e-pramuka', nama: 'Pramuka Siaga & Penggalang', jenis: 'Ekskul', pembinaId: 't-13', hariLatihan: 'Jumat', waktuLatihan: '14.00 - 16.00 WIB', deskripsi: 'Ekstrakurikuler Wajib Kepanduan' },
  { id: 'e-futsal', nama: 'Futsal & Olahraga', jenis: 'Ekskul', pembinaId: 't-13', hariLatihan: 'Sabtu', waktuLatihan: '08.00 - 10.00 WIB', deskripsi: 'Pembinaan Bakat Atletik Siswa' },
  { id: 'e-tari', nama: 'Seni Tari Tradisional Sunda', jenis: 'Ekskul', pembinaId: 't-5', hariLatihan: 'Rabu', waktuLatihan: '14.00 - 15.30 WIB', deskripsi: 'Pelestarian Budaya Tari Jaipong & Sunda' },
  { id: 'e-silat', nama: 'Pencak Silat', jenis: 'Ekskul', pembinaId: 't-7', hariLatihan: 'Kamis', waktuLatihan: '15.00 - 16.30 WIB', deskripsi: 'Seni Bela Diri Tradisional Nusantara' },
  { id: 'e-marawis', nama: 'Marawis & Qasidah', jenis: 'Ekskul', pembinaId: 't-14', hariLatihan: 'Selasa', waktuLatihan: '14.00 - 15.30 WIB', deskripsi: 'Kesenian Musik Islami dan Sholawat' },
  { id: 'e-dokter', nama: 'Dokter Kecil & UKS', jenis: 'Ekskul', pembinaId: 't-3', hariLatihan: 'Senin', waktuLatihan: '14.00 - 15.00 WIB', deskripsi: 'Pelayanan Kesehatan dan P3K Sekolah' },
  { id: 'e-sains', nama: 'Klub Sains & Matematika', jenis: 'Ekskul', pembinaId: 't-9', hariLatihan: 'Sabtu', waktuLatihan: '10.00 - 11.30 WIB', deskripsi: 'Persiapan Olimpiade OSN SD' }
];

export const initialTeachers: Teacher[] = [
  { id: 't-1', nip: '197904122008012015', nuptk: '4532757659200022', nama: 'Hj. Siti Rohmah', gelar: 'S.Pd.SD', jabatan: 'Wali Kelas 1A', jenisKelamin: 'P', statusKepegawaian: 'PNS', golongan: 'IV/a', noHp: '081287654301', email: 'siti.rohmah@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-2', nip: '198402152010012018', nuptk: '6743762664210043', nama: 'Dewi Lestari', gelar: 'S.Pd.', jabatan: 'Wali Kelas 1B', jenisKelamin: 'P', statusKepegawaian: 'PNS', golongan: 'III/c', noHp: '081287654302', email: 'dewi.lestari@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-3', nip: '198906232019032009', nuptk: '8954767669300054', nama: 'Nurul Hidayah', gelar: 'S.Pd.', jabatan: 'Wali Kelas 2A', jenisKelamin: 'P', statusKepegawaian: 'PPPK', golongan: 'IX', noHp: '081398765403', email: 'nurul.hidayah@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-4', nip: '-', nuptk: '1243765667300065', nama: 'Rina Marlina', gelar: 'S.Pd.', jabatan: 'Wali Kelas 2B', jenisKelamin: 'P', statusKepegawaian: 'Honorer / GTT', golongan: '-', noHp: '085712345604', email: 'rina.marlina@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-5', nip: '198208102009022007', nuptk: '3456760662200076', nama: 'Eni Maryani', gelar: 'S.Pd.SD', jabatan: 'Wali Kelas 3A', jenisKelamin: 'P', statusKepegawaian: 'PNS', golongan: 'III/d', noHp: '081234567805', email: 'eni.maryani@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-6', nip: '199105182022212011', nuptk: '5678769671300087', nama: 'Fitri Handayani', gelar: 'S.Pd.', jabatan: 'Wali Kelas 3B', jenisKelamin: 'P', statusKepegawaian: 'PPPK', golongan: 'IX', noHp: '081987654306', email: 'fitri.handayani@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-7', nip: '198511052014061002', nuptk: '7890763665100098', nama: 'Asep Saepudin', gelar: 'S.Pd.', jabatan: 'Wali Kelas 4A', jenisKelamin: 'L', statusKepegawaian: 'PNS', golongan: 'III/b', noHp: '081345678907', email: 'asep.saepudin@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-8', nip: '-', nuptk: '9012768670200109', nama: 'Dini Anggraeni', gelar: 'S.Pd.', jabatan: 'Wali Kelas 4B', jenisKelamin: 'P', statusKepegawaian: 'Honorer / GTT', golongan: '-', noHp: '087812345608', email: 'dini.anggraeni@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-9', nip: '198003152006041008', nuptk: '2345758660100110', nama: 'Bambang Supriyanto', gelar: 'S.Pd.SD, M.Pd.', jabatan: 'Wali Kelas 5A', jenisKelamin: 'L', statusKepegawaian: 'PNS', golongan: 'IV/a', noHp: '081298765409', email: 'bambang.s@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-10', nip: '199009122020122014', nuptk: '4567768670300121', nama: 'Ika Pratiwi', gelar: 'S.Pd.', jabatan: 'Wali Kelas 5B', jenisKelamin: 'P', statusKepegawaian: 'PPPK', golongan: 'IX', noHp: '081356789010', email: 'ika.pratiwi@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-11', nip: '197507191998031003', nuptk: '6789753655100132', nama: 'Drs. H. Mulyadi', gelar: 'M.M.Pd.', jabatan: 'Wali Kelas 6A', jenisKelamin: 'L', statusKepegawaian: 'PNS', golongan: 'IV/b', noHp: '081123456711', email: 'mulyadi@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-12', nip: '198810242015032004', nuptk: '8901766668200143', nama: 'Sri Wahyuni', gelar: 'S.Pd.', jabatan: 'Wali Kelas 6B', jenisKelamin: 'P', statusKepegawaian: 'PNS', golongan: 'III/c', noHp: '081267890112', email: 'sri.wahyuni@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-13', nip: '199203142023211005', nuptk: '1234770672100154', nama: 'Rian Permana', gelar: 'S.Pd.Jas.', jabatan: 'Guru PJOK & Pembina Pramuka', jenisKelamin: 'L', statusKepegawaian: 'PPPK', golongan: 'IX', noHp: '085678901213', email: 'rian.permana@sdnnambo03.sch.id', statusAktif: true },
  { id: 't-14', nip: '198701052011011009', nuptk: '3456765666100165', nama: 'Ustadz Ahmad Fauzi', gelar: 'S.Pd.I.', jabatan: 'Guru PAI & Budi Pekerti', jenisKelamin: 'L', statusKepegawaian: 'PNS', golongan: 'III/c', noHp: '081278901214', email: 'ahmad.fauzi@sdnnambo03.sch.id', statusAktif: true }
];

export const initialStaff: Staff[] = [
  { id: 's-1', nik: '3201241508820001', nip: '198208152012121003', nama: 'Dedi Kurniawan', tugas: 'Kepala Tata Usaha & Urusan Kepegawaian', statusKepegawaian: 'PNS', pendidikan: 'S1 Administrasi Publik', noHp: '081234000101', statusAktif: true, alamat: 'Nambo RT 02/03' },
  { id: 's-2', nik: '3201242005930004', nip: '-', nama: 'Rizky Ramadhan', tugas: 'Operator Dapodik & Aset Sekolah', statusKepegawaian: 'Honorer / PTT', pendidikan: 'D3 Manajemen Informatika', noHp: '085712000202', statusAktif: true, alamat: 'Bantarjati RT 01/04' },
  { id: 's-3', nik: '3201244809890002', nip: '198909182023212006', nama: 'Siti Aminah', tugas: 'Bendahara BOS & Keuangan', statusKepegawaian: 'PPPK', pendidikan: 'S1 Akuntansi', noHp: '081398000303', statusAktif: true, alamat: 'Klapanunggal RT 03/02' },
  { id: 's-4', nik: '3201241004780005', nip: '-', nama: 'Pak Sukardi', tugas: 'Penjaga Sekolah & Keamanan', statusKepegawaian: 'Honorer / PTT', pendidikan: 'SMA', noHp: '087812000404', statusAktif: true, alamat: 'Bantarkopo RT 01/04' }
];

import { officialStudentsData } from './studentsData';

export const initialStudents: Student[] = officialStudentsData;

export const initialTeachingHours: TeachingHour[] = [
  { id: 'th-1', guruId: 't-1', mataPelajaran: 'Tematik / Guru Kelas', kelasId: 'c-1a', jumlahJP: 24, hari: 'Senin - Jumat', jamMulai: '07.00', jamSelesai: '11.30' },
  { id: 'th-2', guruId: 't-2', mataPelajaran: 'Tematik / Guru Kelas', kelasId: 'c-1b', jumlahJP: 24, hari: 'Senin - Jumat', jamMulai: '07.00', jamSelesai: '11.30' },
  { id: 'th-3', guruId: 't-3', mataPelajaran: 'Tematik / Guru Kelas', kelasId: 'c-2a', jumlahJP: 24, hari: 'Senin - Jumat', jamMulai: '07.00', jamSelesai: '12.00' },
  { id: 'th-4', guruId: 't-7', mataPelajaran: 'Matematika & IPAS', kelasId: 'c-4a', jumlahJP: 14, hari: 'Senin - Rabu', jamMulai: '07.00', jamSelesai: '12.30' },
  { id: 'th-5', guruId: 't-7', mataPelajaran: 'Bahasa Indonesia & PPKn', kelasId: 'c-4a', jumlahJP: 12, hari: 'Kamis - Jumat', jamMulai: '07.00', jamSelesai: '11.30' },
  { id: 'th-6', guruId: 't-13', mataPelajaran: 'Pendidikan Jasmani (PJOK)', kelasId: 'c-1a', jumlahJP: 4, hari: 'Selasa', jamMulai: '07.00', jamSelesai: '09.20' },
  { id: 'th-7', guruId: 't-13', mataPelajaran: 'Pendidikan Jasmani (PJOK)', kelasId: 'c-2a', jumlahJP: 4, hari: 'Rabu', jamMulai: '07.00', jamSelesai: '09.20' },
  { id: 'th-8', guruId: 't-13', mataPelajaran: 'Pendidikan Jasmani (PJOK)', kelasId: 'c-4a', jumlahJP: 4, hari: 'Kamis', jamMulai: '07.00', jamSelesai: '09.20' },
  { id: 'th-9', guruId: 't-13', mataPelajaran: 'Pendidikan Jasmani (PJOK)', kelasId: 'c-6a', jumlahJP: 4, hari: 'Jumat', jamMulai: '07.00', jamSelesai: '09.20' },
  { id: 'th-10', guruId: 't-14', mataPelajaran: 'Pendidikan Agama Islam', kelasId: 'c-1a', jumlahJP: 4, hari: 'Senin', jamMulai: '08.00', jamSelesai: '10.20' },
  { id: 'th-11', guruId: 't-14', mataPelajaran: 'Pendidikan Agama Islam', kelasId: 'c-3a', jumlahJP: 4, hari: 'Selasa', jamMulai: '08.00', jamSelesai: '10.20' },
  { id: 'th-12', guruId: 't-14', mataPelajaran: 'Pendidikan Agama Islam', kelasId: 'c-5a', jumlahJP: 4, hari: 'Rabu', jamMulai: '08.00', jamSelesai: '10.20' }
];

export const initialPractices: PerformancePractice[] = [
  {
    id: 'pp-1',
    guruId: 't-1',
    indikator: 'Penerapan Disiplin Positif',
    catatanGuru: 'Membangun kesepakatan kelas bersama peserta didik kelas 1A dan memfasilitasi restitusi saat terjadi pelanggaran.',
    statusObservasi: 'Sudah',
    skor: 100,
    tanggalObservasi: '2026-09-15',
    catatanKepsek: 'Sangat baik, guru menerapkan kesepakatan kelas dengan bahasa afirmatif dan ramah anak.',
    periode: 'Semester Ganjil 2026/2027',
    // 1. Perencanaan
    targetPerilaku: 'Guru mengajak peserta didik menyepakati aturan dan konsekuensi positif secara partisipatif di awal tema.',
    upayaMempelajari: 'Mempelajari modul Pelatihan Mandiri PMM Topik Disiplin Positif dan panduan restitusi anak usia dini/fase A.',
    jadwalRencana: '2026-09-15',
    jamRencana: '08.00 - 09.30 WIB',
    kelasTargetId: 'c-1a',
    mapelTarget: 'Pendidikan Pancasila - Kesepakatan Kelas',
    // 2. Pelaksanaan
    ratingObservasi: 'Dilakukan dan Efektif',
    fokusPengamatan: 'Guru mendengarkan pandangan setiap siswa, tidak menggunakan hukuman fisik/verbal, dan menggunakan nada suara tenang.',
    catatanPengamatanKepsek: 'Pengelolaan kelas sangat hangat dan kondusif. Seluruh siswa kelas 1A tampak antusias dan merasa aman.',
    // 3. Umpan Balik
    refleksiPascaObservasi: 'Sebagian siswa pemalu mulai berani bersuara. Ke depannya saya akan menyiapkan stiker simbol apresiasi perilaku positif.',
    umpanBalikKepsek: 'Pertahankan pendekatan humanis ini dan bagikan praktik baik (best practice) pada rapat KKG mini sekolah.',
    rencanaTindakLanjut: 'Mengikuti Webinar PMM Komunitas Belajar tentang Pendekatan Restitusi pada Fase A serta berdiskusi dengan guru kelas 1B.',
    skorTindakLanjut: 100
  },
  {
    id: 'pp-2',
    guruId: 't-7',
    indikator: 'Keteraturan Suasana Kelas',
    catatanGuru: 'Membuat transisi aktivitas pembelajaran yang terstruktur dan responsif terhadap dinamika fokus siswa.',
    statusObservasi: 'Sudah',
    skor: 100,
    tanggalObservasi: '2026-09-22',
    catatanKepsek: 'Suasana kelas kondusif, siswa antusias berkolaborasi dalam kelompok IPAS.',
    periode: 'Semester Ganjil 2026/2027',
    // 1. Perencanaan
    targetPerilaku: 'Guru memberikan instruksi yang terstruktur dan menggunakan sinyal transisi yang jelas saat pergantian aktivitas kelompok.',
    upayaMempelajari: 'Mengunduh panduan manajemen kelas interaktif dan berdiskusi dengan rekan sejawat di Gugus Klapanunggal.',
    jadwalRencana: '2026-09-22',
    jamRencana: '09.30 - 11.00 WIB',
    kelasTargetId: 'c-4a',
    mapelTarget: 'IPAS - Wujud Zat dan Perubahannya',
    // 2. Pelaksanaan
    ratingObservasi: 'Dilakukan dan Efektif',
    fokusPengamatan: 'Alur percobaan sains terkoordinasi dengan baik. Lembar kerja peserta didik (LKPD) dimengerti semua kelompok.',
    catatanPengamatanKepsek: 'Pengaturan waktu (time management) sangat rapi dan siswa disiplin membersihkan meja kerja laboratorium mini.',
    // 3. Umpan Balik
    refleksiPascaObservasi: 'Eksperimen berjalan lancar, namun alokasi waktu untuk presentasi hasil masih perlu ditambah sekitar 10 menit.',
    umpanBalikKepsek: 'Metode eksperimen sudah tepat sasaran. Pertimbangkan pemanfaatan media digital Chromebook untuk merekam hasil pengamatan.',
    rencanaTindakLanjut: 'Menyusun rubrik presentasi kelompok interaktif dan mengintegrasikannya dengan asesmen formatif.',
    skorTindakLanjut: 98
  },
  {
    id: 'pp-3',
    guruId: 't-13',
    indikator: 'Aktivitas Interaktif',
    catatanGuru: 'Melibatkan seluruh siswa dalam permainan pemanasan PJOK berpasangan yang inklusif tanpa membedakan gender.',
    statusObservasi: 'Belum',
    skor: 0,
    periode: 'Semester Ganjil 2026/2027',
    // 1. Perencanaan
    targetPerilaku: 'Guru memfasilitasi kegiatan belajar yang memberi peran setara pada semua peserta didik dalam aktivitas gerak dasar.',
    upayaMempelajari: 'Mempelajari asesmen gerak adaptif untuk anak berkebutuhan khusus dan modifikasi permainan tradisional.',
    jadwalRencana: '2026-10-20',
    jamRencana: '07.00 - 08.30 WIB',
    kelasTargetId: 'c-2a',
    mapelTarget: 'PJOK - Pola Gerak Dasar Lokomotor',
    // 2. Pelaksanaan
    ratingObservasi: 'Belum Dilakukan',
    fokusPengamatan: 'Rencana observasi terjadwal pada pekan ke-3 Oktober 2026 di lapangan olahraga SD Negeri Nambo 03.',
    catatanPengamatanKepsek: 'Menunggu jadwal pelaksanaan observasi kelas tatap muka.',
    // 3. Umpan Balik
    refleksiPascaObservasi: 'Persiapan modul ajar dan sarana bola keranjang mini sudah siap 100%.',
    umpanBalikKepsek: 'Siapkan lembar penilaian observasi sebelum pelaksanaan.',
    rencanaTindakLanjut: 'Pelaksanaan observasi sesuai jadwal kalender akademik.',
    skorTindakLanjut: 0
  }
];

export const initialBerAKHLAK: PerformanceBerAKHLAK[] = [
  {
    id: 'ba-1',
    guruId: 't-1',
    berorientasiPelayanan: 'Ramah dan sabar menyambut siswa kelas 1 di gerbang sekolah serta sigap melayani konsultasi wali murid.',
    akuntabel: 'Tepat waktu hadir sebelum jam 06.45 WIB dan menyusun modul ajar lengkap sebelum semester dimulai.',
    kompeten: 'Mengikuti pelatihan Kurikulum Merdeka Fase A daring dari Ditjen GTK Kemendikbudristek.',
    harmonis: 'Menghargai keragaman latar belakang siswa dan menjaga hubungan kekeluargaan sesama rekan sejawat.',
    loyal: 'Mematuhi arahan Kepala Sekolah dan menjunjung integritas nama baik SD Negeri Nambo 03.',
    adaptif: 'Memanfaatkan media Chromebook bantuan pemerintah untuk pengenalan literasi digital siswa.',
    kolaboratif: 'Bekerja sama dengan orang tua murid paguyuban kelas untuk penataan sudut baca kelas.',
    catatan: 'Keteladanan yang sangat baik bagi pendidik lainnya.',
    tanggal: '2026-09-30',
    statusEvaluasi: 'Di Atas Ekspektasi'
  },
  {
    id: 'ba-2',
    guruId: 't-7',
    berorientasiPelayanan: 'Memberikan bimbingan remedial khusus setelah jam pelajaran bagi siswa yang belum tuntas capaian belajar.',
    akuntabel: 'Mengelola administrasi absensi dan nilai siswa dengan transparan di sistem sekolah.',
    kompeten: 'Berhasil membimbing siswa dalam lomba O2SN tingkat kecamatan Klapanunggal.',
    harmonis: 'Menjadi penengah dan menciptakan kebersamaan dalam kegiatan ekstrakurikuler bela diri.',
    loyal: 'Mengutamakan kepentingan sekolah di atas kepentingan pribadi saat persiapan akreditasi.',
    adaptif: 'Menggunakan proyektor interaktif dan quiz gamifikasi pembelajaran.',
    kolaboratif: 'Bersinergi dengan guru PJOK dan guru PAI untuk integrasi materi Profil Pelajar Pancasila.',
    catatan: 'Dedikasi tinggi dan komunikatif.',
    tanggal: '2026-10-05',
    statusEvaluasi: 'Memenuhi Ekspektasi'
  }
];

export const initialAdditionalTasks: AdditionalTask[] = [
  {
    id: 'at-1',
    guruId: 't-1',
    namaTugas: 'Wali Kelas 1A',
    refleksi: 'Telah melaksanakan pendampingan adaptasi lingkungan sekolah baru (MPLS), pemetaan minat bakat awal, serta komunikasi mingguan bersama paguyuban wali murid kelas 1A.',
    buktiDukung: 'SK Pembagian Tugas Guru TA 2026-2027 No. 421.2/015/SDN-N03/VII/2026',
    status: 'Selesai',
    tanggal: '2026-09-28'
  },
  {
    id: 'at-2',
    guruId: 't-13',
    namaTugas: 'Pembina Pramuka Gugus Depan',
    refleksi: 'Mengadakan latihan rutin mingguan setiap Jumat, pelantikan siaga mula dan bantu, serta persiapan Perkemahan Satu Hari (Persari).',
    buktiDukung: 'Program Kerja Gudep 03-045 & Daftar Hadir Latihan',
    status: 'Dalam Proses',
    tanggal: '2026-10-02'
  },
  {
    id: 'at-3',
    guruId: 't-9',
    namaTugas: 'Koordinator Projek Penguatan Profil Pelajar Pancasila (P5)',
    refleksi: 'Menyusun modul proyek tema Kearifan Lokal pembuatan anyaman bambu Nambo dan Gaya Hidup Berkelanjutan pengelolaan sampah sekolah.',
    buktiDukung: 'Modul P5 Semester Ganjil 2026/2027',
    status: 'Selesai',
    tanggal: '2026-09-25'
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  // --- SEMESTER GANJIL TA 2026/2027 (Juli - Desember 2026) ---
  // Juli 2026
  { id: 'att-1', tanggal: '2026-07-20', bulan: '2026-07', kelasId: 'c-1a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Hari pertama efektif KBM' },
  { id: 'att-2', tanggal: '2026-07-20', bulan: '2026-07', kelasId: 'c-1b', hadir: 30, sakit: 1, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'Semua tertib' },
  { id: 'att-3', tanggal: '2026-07-20', bulan: '2026-07', kelasId: 'c-2a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Hadir 100%' },
  { id: 'att-4', tanggal: '2026-07-20', bulan: '2026-07', kelasId: 'c-4a', hadir: 30, sakit: 1, izin: 0, alpa: 1, totalSiswa: 32, catatan: '1 siswa izin sakit' },
  { id: 'att-5', tanggal: '2026-07-20', bulan: '2026-07', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lengkap' },

  // Agustus 2026
  { id: 'att-6', tanggal: '2026-08-14', bulan: '2026-08', kelasId: 'c-1a', hadir: 31, sakit: 0, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'Persiapan HUT RI' },
  { id: 'att-7', tanggal: '2026-08-14', bulan: '2026-08', kelasId: 'c-2a', hadir: 30, sakit: 2, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Flu batuk 2 anak' },
  { id: 'att-8', tanggal: '2026-08-14', bulan: '2026-08', kelasId: 'c-4a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'KBM berjalan lancar' },
  { id: 'att-9', tanggal: '2026-08-14', bulan: '2026-08', kelasId: 'c-6a', hadir: 31, sakit: 0, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'Kondusif' },

  // September 2026
  { id: 'att-10', tanggal: '2026-09-18', bulan: '2026-09', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lengkap hadir' },
  { id: 'att-11', tanggal: '2026-09-18', bulan: '2026-09', kelasId: 'c-2a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Sakit surat dokter' },
  { id: 'att-12', tanggal: '2026-09-18', bulan: '2026-09', kelasId: 'c-4a', hadir: 30, sakit: 1, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'Asesmen Sumatif' },
  { id: 'att-13', tanggal: '2026-09-18', bulan: '2026-09', kelasId: 'c-6a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lancar' },

  // Oktober 2026
  { id: 'att-14', tanggal: '2026-10-15', bulan: '2026-10', kelasId: 'c-1a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Kondisi sehat' },
  { id: 'att-15', tanggal: '2026-10-15', bulan: '2026-10', kelasId: 'c-1b', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Hadir 100%' },
  { id: 'att-16', tanggal: '2026-10-15', bulan: '2026-10', kelasId: 'c-2a', hadir: 31, sakit: 0, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'Izin urusan keluarga' },
  { id: 'att-17', tanggal: '2026-10-15', bulan: '2026-10', kelasId: 'c-3a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lengkap' },
  { id: 'att-18', tanggal: '2026-10-15', bulan: '2026-10', kelasId: 'c-4a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Praktik IPAS' },
  { id: 'att-19', tanggal: '2026-10-15', bulan: '2026-10', kelasId: 'c-5a', hadir: 30, sakit: 1, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'P5 Budidaya' },
  { id: 'att-20', tanggal: '2026-10-15', bulan: '2026-10', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Hadir 100%' },

  // November 2026
  { id: 'att-21', tanggal: '2026-11-16', bulan: '2026-11', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Persiapan PAS' },
  { id: 'att-22', tanggal: '2026-11-16', bulan: '2026-11', kelasId: 'c-2a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Tertib' },
  { id: 'att-23', tanggal: '2026-11-16', bulan: '2026-11', kelasId: 'c-3a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'KBM berjalan baik' },
  { id: 'att-24', tanggal: '2026-11-16', bulan: '2026-11', kelasId: 'c-5a', hadir: 31, sakit: 0, izin: 1, alpa: 0, totalSiswa: 32, catatan: '1 izin keluarga' },
  { id: 'att-25', tanggal: '2026-11-16', bulan: '2026-11', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Try out berjalan lancar' },

  // Desember 2026
  { id: 'att-26', tanggal: '2026-12-11', bulan: '2026-12', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Pembagian Rapot Semester Ganjil' },
  { id: 'att-27', tanggal: '2026-12-11', bulan: '2026-12', kelasId: 'c-2a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Semua hadir' },
  { id: 'att-28', tanggal: '2026-12-11', bulan: '2026-12', kelasId: 'c-4a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Pentas seni kelas' },
  { id: 'att-29', tanggal: '2026-12-11', bulan: '2026-12', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lengkap hadir' },

  // --- SEMESTER GENAP TA 2026/2027 (Januari - Juni 2027) ---
  // Januari 2027
  { id: 'att-30', tanggal: '2027-01-11', bulan: '2027-01', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Awal KBM Semester Genap' },
  { id: 'att-31', tanggal: '2027-01-11', bulan: '2027-01', kelasId: 'c-1b', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Kondusif' },
  { id: 'att-32', tanggal: '2027-01-11', bulan: '2027-01', kelasId: 'c-2a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Hadir 100%' },
  { id: 'att-33', tanggal: '2027-01-11', bulan: '2027-01', kelasId: 'c-3a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Semangat baru semester genap' },
  { id: 'att-34', tanggal: '2027-01-11', bulan: '2027-01', kelasId: 'c-5a', hadir: 31, sakit: 0, izin: 1, alpa: 0, totalSiswa: 32, catatan: '1 siswa izin' },
  { id: 'att-35', tanggal: '2027-01-11', bulan: '2027-01', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Bimbingan intensif' },

  // Februari 2027
  { id: 'att-36', tanggal: '2027-02-15', bulan: '2027-02', kelasId: 'c-1a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'KBM berjalan baik' },
  { id: 'att-37', tanggal: '2027-02-15', bulan: '2027-02', kelasId: 'c-2a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Tertib' },
  { id: 'att-38', tanggal: '2027-02-15', bulan: '2027-02', kelasId: 'c-4a', hadir: 31, sakit: 0, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'Praktik lapangan' },
  { id: 'att-39', tanggal: '2027-02-15', bulan: '2027-02', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Simulasi ujian' },

  // Maret 2027
  { id: 'att-40', tanggal: '2027-03-12', bulan: '2027-03', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'PTS Semester Genap' },
  { id: 'att-41', tanggal: '2027-03-12', bulan: '2027-03', kelasId: 'c-2a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Pelaksanaan PTS tertib' },
  { id: 'att-42', tanggal: '2027-03-12', bulan: '2027-03', kelasId: 'c-3a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Hadir 100%' },
  { id: 'att-43', tanggal: '2027-03-12', bulan: '2027-03', kelasId: 'c-5a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lengkap' },
  { id: 'att-44', tanggal: '2027-03-12', bulan: '2027-03', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Uji kompetensi' },

  // April 2027
  { id: 'att-45', tanggal: '2027-04-16', bulan: '2027-04', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Kegiatan Ramadhan & Budi Pekerti' },
  { id: 'att-46', tanggal: '2027-04-16', bulan: '2027-04', kelasId: 'c-2a', hadir: 31, sakit: 0, izin: 1, alpa: 0, totalSiswa: 32, catatan: 'Pesantren kilat' },
  { id: 'att-47', tanggal: '2027-04-16', bulan: '2027-04', kelasId: 'c-4a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Zakat fitrah sekolah' },
  { id: 'att-48', tanggal: '2027-04-16', bulan: '2027-04', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Ujian Sekolah Utama' },

  // Mei 2027
  { id: 'att-49', tanggal: '2027-05-14', bulan: '2027-05', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Asesmen Akhir Semester' },
  { id: 'att-50', tanggal: '2027-05-14', bulan: '2027-05', kelasId: 'c-2a', hadir: 31, sakit: 1, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lancar' },
  { id: 'att-51', tanggal: '2027-05-14', bulan: '2027-05', kelasId: 'c-3a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Kondusif' },
  { id: 'att-52', tanggal: '2027-05-14', bulan: '2027-05', kelasId: 'c-5a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Gelar karya P5' },
  { id: 'att-53', tanggal: '2027-05-14', bulan: '2027-05', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Persiapan pelepasan kelas 6' },

  // Juni 2027
  { id: 'att-54', tanggal: '2027-06-18', bulan: '2027-06', kelasId: 'c-1a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Pembagian Rapot Kenaikan Kelas' },
  { id: 'att-55', tanggal: '2027-06-18', bulan: '2027-06', kelasId: 'c-1b', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Lengkap 100%' },
  { id: 'att-56', tanggal: '2027-06-18', bulan: '2027-06', kelasId: 'c-2a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Kenaikan kelas tertib' },
  { id: 'att-57', tanggal: '2027-06-18', bulan: '2027-06', kelasId: 'c-3a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Semua naik kelas' },
  { id: 'att-58', tanggal: '2027-06-18', bulan: '2027-06', kelasId: 'c-4a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Rapot dibagikan' },
  { id: 'att-59', tanggal: '2027-06-18', bulan: '2027-06', kelasId: 'c-5a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Kondusif' },
  { id: 'att-60', tanggal: '2027-06-18', bulan: '2027-06', kelasId: 'c-6a', hadir: 32, sakit: 0, izin: 0, alpa: 0, totalSiswa: 32, catatan: 'Pelepasan & Kelulusan 100%' }
];

export const initialTeacherReportCards = [
  {
    id: 'rc-1',
    guruId: 't-1',
    tahunAjaran: '2026-2027',
    semester: 'Ganjil' as const,
    predikatKinerja: 'Sangat Baik (Di Atas Ekspektasi)' as const,
    nilaiSkorAkhir: 96,
    catatanKepsek: 'Ibu Hj. Siti Rohmah menunjukkan kepemimpinan pembelajaran yang luar biasa dalam memfasilitasi adaptasi siswa kelas 1 dan penguatan iklim positif.',
    rekomendasiKepsek: 'Dipertahankan dan dijadikan guru pamong bagi rekan sejawat dalam implementasi Kurikulum Merdeka Fase A.',
    tanggalPenetapan: '2026-12-15',
    status: 'Disetujui Kepala Sekolah' as const
  },
  {
    id: 'rc-2',
    guruId: 't-7',
    tahunAjaran: '2026-2027',
    semester: 'Ganjil' as const,
    predikatKinerja: 'Baik (Memenuhi Ekspektasi)' as const,
    nilaiSkorAkhir: 91,
    catatanKepsek: 'Pak Asep konsisten dan akuntabel mengelola pembelajaran IPAS dan kegiatan pencak silat sekolah.',
    rekomendasiKepsek: 'Terus tingkatkan pemanfaatan platform asesmen digital untuk variasi formatif.',
    tanggalPenetapan: '2026-12-15',
    status: 'Disetujui Kepala Sekolah' as const
  },
  {
    id: 'rc-3',
    guruId: 't-13',
    tahunAjaran: '2026-2027',
    semester: 'Ganjil' as const,
    predikatKinerja: 'Baik (Memenuhi Ekspektasi)' as const,
    nilaiSkorAkhir: 88,
    catatanKepsek: 'Pak Rian sangat aktif melatih ekstrakurikuler kepanduan pramuka dan membina kesehatan kebugaran peserta didik.',
    rekomendasiKepsek: 'Segera melengkapi administrasi observasi kelas sebelum batas akhir semester.',
    tanggalPenetapan: '2026-12-15',
    status: 'Disetujui Kepala Sekolah' as const
  }
];

export const initialManualAgeRecaps = [
  {
    id: 'ar-1',
    bulan: '2026-10',
    kelasId: 'c-1a',
    lessThan6L: 0,
    lessThan6P: 0,
    age6L: 1,
    age6P: 0,
    age7L: 1,
    age7P: 1,
    age8L: 0,
    age8P: 0,
    age9L: 0,
    age9P: 0,
    age10L: 0,
    age10P: 0,
    age11L: 0,
    age11P: 0,
    age12L: 0,
    age12P: 0,
    moreThan12L: 0,
    moreThan12P: 0,
    updatedAt: '2026-10-15T08:00:00Z'
  }
];

export const initialSyncLogs: SyncAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-16 07:15:20',
    wargaSekolah: 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.',
    peran: 'Kepala Sekolah',
    lingkup: 'Database Pusat',
    jenisAksi: 'Sinkronisasi',
    judul: 'Sinkronisasi Master Database Semester Ganjil 2026/2027',
    rincianPerubahan: 'Pembaruan data 395 siswa aktif dan validasi kelengkapan berkas Dapodik SDN Nambo 03',
    statusSinkron: 'Tersinkron ke Server',
    diverifikasiKepsek: true,
    catatanKepsek: 'Data telah divalidasi sesuai Buku Induk dan dokumen resmi sekolah.',
    waktuVerifikasi: '2026-10-16 07:16:00'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-16 07:30:15',
    wargaSekolah: 'Hj. Siti Rohmah, S.Pd.SD',
    peran: 'Guru Kelas',
    lingkup: 'Kelas 1A',
    jenisAksi: 'Ubah',
    judul: 'Input Presensi Harian & Rekap Umur Siswa',
    rincianPerubahan: 'Presensi harian Kelas 1A dicatat: Hadir 38 siswa (L: 20, P: 18), Sakit 0, Izin 0, Alpa 0. Rekap umur bulan Oktober 2026 diperbarui.',
    statusSinkron: 'Tersinkron ke Server',
    diverifikasiKepsek: true,
    catatanKepsek: 'Disetujui. Kehadiran 100% dipertahankan.',
    waktuVerifikasi: '2026-10-16 08:00:00'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-16 07:45:00',
    wargaSekolah: 'Dewi Lestari, S.Pd.',
    peran: 'Guru Kelas',
    lingkup: 'Kelas 1B',
    jenisAksi: 'Ubah',
    judul: 'Pembaruan Data Biodata Siswa Kelas 1B',
    rincianPerubahan: 'Memperbarui NISN dan alamat tempat tinggal siswa atas nama Bagas Aditya Pratama',
    statusSinkron: 'Tersinkron ke Server',
    diverifikasiKepsek: true,
    catatanKepsek: 'Sudah sesuai Kartu Keluarga orang tua siswa.',
    waktuVerifikasi: '2026-10-16 08:05:00'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-16 08:15:30',
    wargaSekolah: 'Nurul Hidayah, S.Pd.',
    peran: 'Guru Kelas',
    lingkup: 'Kelas 2A',
    jenisAksi: 'Ubah',
    judul: 'Pengisian Catatan Kinerja Guru (Perencanaan & Target Perilaku)',
    rincianPerubahan: 'Menambahkan target perilaku observasi: Keteraturan Suasana Kelas dan Eksplorasi Konsep',
    statusSinkron: 'Tersinkron ke Server',
    diverifikasiKepsek: true,
    catatanKepsek: 'Jadwal observasi disetujui pada tanggal 20 Oktober 2026.',
    waktuVerifikasi: '2026-10-16 08:30:00'
  },
  {
    id: 'log-5',
    timestamp: '2026-10-16 08:45:10',
    wargaSekolah: 'Asep Saepudin, S.Pd.',
    peran: 'Guru Kelas',
    lingkup: 'Kelas 4A',
    jenisAksi: 'Ubah',
    judul: 'Catatan Presensi Bulanan & Pelaksanaan Observasi Kelas',
    rincianPerubahan: 'Pelaksanaan observasi pembelajaran IPAS berjalan efektif dengan skor 94.',
    statusSinkron: 'Tersinkron ke Server',
    diverifikasiKepsek: true,
    catatanKepsek: 'Observasi telah selesai dan umpan balik telah diunggah.',
    waktuVerifikasi: '2026-10-16 09:00:00'
  },
  {
    id: 'log-6',
    timestamp: '2026-10-16 09:10:45',
    wargaSekolah: 'Rizky Ramadhan',
    peran: 'Operator Dapodik',
    lingkup: 'Buku Induk Siswa',
    jenisAksi: 'Import Excel',
    judul: 'Sinkronisasi Data NISN & Dapodik Kemendikbud',
    rincianPerubahan: 'Pengecekan konsistensi 395 data peserta didik aktif SDN Nambo 03 tanpa data ganda.',
    statusSinkron: 'Tersinkron ke Server',
    diverifikasiKepsek: true,
    catatanKepsek: 'Data Dapodik terpadu, tidak ada duplikasi.',
    waktuVerifikasi: '2026-10-16 09:15:00'
  },
  {
    id: 'log-7',
    timestamp: '2026-10-16 09:30:00',
    wargaSekolah: 'Drs. H. Mulyadi, M.M.Pd.',
    peran: 'Guru Kelas',
    lingkup: 'Kelas 6A',
    jenisAksi: 'Ubah',
    judul: 'Input Hasil Asesmen Formatif & Kehadiran Kelas 6A',
    rincianPerubahan: 'Mencatat kehadiran 31 siswa Kelas 6A lengkap dan pemantauan persiapan ujian kelulusan.',
    statusSinkron: 'Tersinkron ke Server',
    diverifikasiKepsek: false
  }
];

