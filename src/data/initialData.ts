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
  AttendanceRecord
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
  provinsi: 'Jawa Barat'
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

export const initialStudents: Student[] = [
  {
    nisn: '0192837401',
    nis: '4011',
    nama: 'Ahmad Faiz Ramadhan',
    tempatLahir: 'Bogor',
    tanggalLahir: '2019-04-12',
    agama: 'Islam',
    jenisKelamin: 'L',
    nik: '3201241204190001',
    alamat: 'Kp. Bantarkopo RT 02/04 Desa Bantarjati',
    tinggiBadan: 118,
    beratBadan: 21,
    kelasId: 'c-1a',
    status: 'Aktif',
    isPIP: true,
    ekskulIds: ['e-pramuka', 'e-futsal'],
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z'
  },
  {
    nisn: '0192837402',
    nis: '4012',
    nama: 'Anindya Putri Kirana',
    tempatLahir: 'Bogor',
    tanggalLahir: '2019-06-25',
    agama: 'Islam',
    jenisKelamin: 'P',
    nik: '3201246506190002',
    alamat: 'Jl. Raya Nambo RT 01/04',
    tinggiBadan: 116,
    beratBadan: 19,
    kelasId: 'c-1a',
    status: 'Aktif',
    isPIP: false,
    ekskulIds: ['e-pramuka', 'e-tari'],
    createdAt: '2026-07-10T08:05:00Z',
    updatedAt: '2026-07-10T08:05:00Z'
  },
  {
    nisn: '0192837403',
    nis: '4013',
    nama: 'Bagas Aditya Pratama',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2019-02-18',
    agama: 'Islam',
    jenisKelamin: 'L',
    nik: '3201241802190003',
    alamat: 'Perum Nambo Asri Blok C No. 5',
    tinggiBadan: 120,
    beratBadan: 23,
    kelasId: 'c-1b',
    status: 'Aktif',
    isPIP: false,
    ekskulIds: ['e-pramuka'],
    createdAt: '2026-07-10T08:10:00Z',
    updatedAt: '2026-07-10T08:10:00Z'
  },
  {
    nisn: '0183746501',
    nis: '3921',
    nama: 'Christian Jonathan Siregar',
    tempatLahir: 'Bogor',
    tanggalLahir: '2018-05-14',
    agama: 'Kristen',
    jenisKelamin: 'L',
    nik: '3201241405180004',
    alamat: 'Ds. Klapanunggal RT 03/01',
    tinggiBadan: 124,
    beratBadan: 24,
    kelasId: 'c-2a',
    status: 'Aktif',
    isPIP: true,
    ekskulIds: ['e-pramuka', 'e-futsal'],
    createdAt: '2025-07-12T08:00:00Z',
    updatedAt: '2026-07-15T08:00:00Z'
  },
  {
    nisn: '0183746502',
    nis: '3922',
    nama: 'Dina Maulida',
    tempatLahir: 'Bogor',
    tanggalLahir: '2018-09-08',
    agama: 'Islam',
    jenisKelamin: 'P',
    nik: '3201244809180005',
    alamat: 'Kp. Nambo Ilir RT 04/02',
    tinggiBadan: 122,
    beratBadan: 22,
    kelasId: 'c-2a',
    status: 'Aktif',
    isPIP: false,
    ekskulIds: ['e-pramuka', 'e-dokter'],
    createdAt: '2025-07-12T08:00:00Z',
    updatedAt: '2026-07-15T08:00:00Z'
  },
  {
    nisn: '0174859601',
    nis: '3831',
    nama: 'Fajar Nugraha',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2017-03-30',
    agama: 'Islam',
    jenisKelamin: 'L',
    nik: '3201243003170006',
    alamat: 'Jl. Bantarkopo RT 01/04',
    tinggiBadan: 130,
    beratBadan: 27,
    kelasId: 'c-3a',
    status: 'Pindahan Masuk',
    isPIP: true,
    ekskulIds: ['e-pramuka', 'e-silat'],
    transferInfo: {
      asalSekolah: 'SDN Cibadak 01 Sukabumi',
      tanggalPindah: '2026-08-01',
      nomorSurat: '421.2/108/DISDIK/2026',
      alasan: 'Ikut Orang Tua Pindah Tugas Kerja di Pabrik Semen Nambo',
      kelasTujuanId: 'c-3a'
    },
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-01T09:00:00Z'
  },
  {
    nisn: '0165968701',
    nis: '3741',
    nama: 'Gita Saraswati',
    tempatLahir: 'Bogor',
    tanggalLahir: '2016-08-19',
    agama: 'Hindu',
    jenisKelamin: 'P',
    nik: '3201245908160007',
    alamat: 'Kec. Klapanunggal RT 05/02',
    tinggiBadan: 135,
    beratBadan: 31,
    kelasId: 'c-4a',
    status: 'Aktif',
    isPIP: false,
    ekskulIds: ['e-pramuka', 'e-tari', 'e-sains'],
    createdAt: '2024-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z'
  },
  {
    nisn: '0165968702',
    nis: '3742',
    nama: 'Hafiz Al-Baqir',
    tempatLahir: 'Bogor',
    tanggalLahir: '2016-11-04',
    agama: 'Islam',
    jenisKelamin: 'L',
    nik: '3201240411160008',
    alamat: 'Kp. Bantarjati RT 02/04',
    tinggiBadan: 138,
    beratBadan: 32,
    kelasId: 'c-4a',
    status: 'Aktif',
    isPIP: true,
    ekskulIds: ['e-pramuka', 'e-marawis'],
    createdAt: '2024-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z'
  },
  {
    nisn: '0156079801',
    nis: '3651',
    nama: 'Indra Gunawan',
    tempatLahir: 'Bogor',
    tanggalLahir: '2015-01-22',
    agama: 'Islam',
    jenisKelamin: 'L',
    nik: '3201242201150009',
    alamat: 'Jl. Raya Nambo KM 3',
    tinggiBadan: 142,
    beratBadan: 36,
    kelasId: 'c-5a',
    status: 'Aktif',
    isPIP: true,
    ekskulIds: ['e-pramuka', 'e-futsal', 'e-silat'],
    createdAt: '2023-07-15T08:00:00Z',
    updatedAt: '2026-07-15T08:00:00Z'
  },
  {
    nisn: '0156079802',
    nis: '3652',
    nama: 'Maria Fransiska',
    tempatLahir: 'Bogor',
    tanggalLahir: '2015-07-14',
    agama: 'Katolik',
    jenisKelamin: 'P',
    nik: '3201245407150010',
    alamat: 'Perum Griya Bantarjati Blok B1',
    tinggiBadan: 140,
    beratBadan: 34,
    kelasId: 'c-5b',
    status: 'Aktif',
    isPIP: false,
    ekskulIds: ['e-pramuka', 'e-sains'],
    createdAt: '2023-07-15T08:00:00Z',
    updatedAt: '2026-07-15T08:00:00Z'
  },
  {
    nisn: '0147180901',
    nis: '3561',
    nama: 'Muhammad Rizki Pratama',
    tempatLahir: 'Bogor',
    tanggalLahir: '2014-06-10',
    agama: 'Islam',
    jenisKelamin: 'L',
    nik: '3201241006140011',
    alamat: 'Kp. Bantarkopo RT 03/04',
    tinggiBadan: 148,
    beratBadan: 40,
    kelasId: 'c-6a',
    status: 'Aktif',
    isPIP: true,
    ekskulIds: ['e-pramuka', 'e-futsal'],
    createdAt: '2022-07-18T08:00:00Z',
    updatedAt: '2026-07-18T08:00:00Z'
  },
  {
    nisn: '0147180902',
    nis: '3562',
    nama: 'Nadira Aulia Zahra',
    tempatLahir: 'Bogor',
    tanggalLahir: '2014-10-03',
    agama: 'Islam',
    jenisKelamin: 'P',
    nik: '3201244310140012',
    alamat: 'Desa Bantarjati RT 01/03',
    tinggiBadan: 146,
    beratBadan: 38,
    kelasId: 'c-6a',
    status: 'Aktif',
    isPIP: false,
    ekskulIds: ['e-pramuka', 'e-tari', 'e-dokter'],
    createdAt: '2022-07-18T08:00:00Z',
    updatedAt: '2026-07-18T08:00:00Z'
  },
  {
    nisn: '0147180903',
    nis: '3563',
    nama: 'Kevin Sanjaya',
    tempatLahir: 'Cirebon',
    tanggalLahir: '2014-04-15',
    agama: 'Buddha',
    jenisKelamin: 'L',
    nik: '3201241504140013',
    alamat: 'Jl. Industri Nambo No. 12',
    tinggiBadan: 147,
    beratBadan: 41,
    kelasId: 'c-6b',
    status: 'Mutasi Keluar',
    isPIP: false,
    ekskulIds: ['e-pramuka'],
    exitInfo: {
      sekolahTujuan: 'SDN 1 Kesambi Cirebon',
      tanggalKeluar: '2026-09-05',
      alasan: 'Kepindahan domisili keluarga ke Cirebon',
      nomorSurat: '421.2/089/SDN-N03/IX/2026'
    },
    createdAt: '2022-07-18T08:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z'
  },
  {
    nisn: '0147180904',
    nis: '3564',
    nama: 'Rian Firmansyah',
    tempatLahir: 'Bogor',
    tanggalLahir: '2014-01-29',
    agama: 'Islam',
    jenisKelamin: 'L',
    nik: '3201242901140014',
    alamat: 'Kp. Nambo Hilir RT 02/01',
    tinggiBadan: 145,
    beratBadan: 39,
    kelasId: 'c-6b',
    status: 'Berhenti DO',
    isPIP: true,
    ekskulIds: ['e-pramuka'],
    exitInfo: {
      tanggalKeluar: '2026-08-20',
      alasan: 'Faktor ekonomi keluarga & menolak bersekolah setelah konseling 3 kali',
      nomorSurat: '421.2/074/SDN-N03/VIII/2026'
    },
    createdAt: '2022-07-18T08:00:00Z',
    updatedAt: '2026-08-20T11:00:00Z'
  }
];

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
    periode: 'Semester Ganjil 2026/2027'
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
    periode: 'Semester Ganjil 2026/2027'
  },
  {
    id: 'pp-3',
    guruId: 't-13',
    indikator: 'Aktivitas Interaktif',
    catatanGuru: 'Melibatkan seluruh siswa dalam permainan pemanasan PJOK berpasangan yang inklusif tanpa membedakan gender.',
    statusObservasi: 'Belum',
    skor: 0,
    periode: 'Semester Ganjil 2026/2027'
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

