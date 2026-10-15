import * as XLSX from 'xlsx';
import { Student, Teacher, Staff, ClassGroup, AttendanceRecord } from '../types';

/**
 * Downloads a worksheet as a real .xlsx file
 */
export function downloadWorkbook(data: any[], fileName: string, sheetName: string = 'Sheet1') {
  const ws = XLSX.utils.json_to_sheet(data);
  // Auto-width columns
  if (data.length > 0) {
    const colWidths = Object.keys(data[0]).map(key => {
      const maxLen = Math.max(
        key.length,
        ...data.map(row => (row[key] !== undefined && row[key] !== null ? String(row[key]).length : 0))
      );
      return { wch: Math.min(Math.max(maxLen + 3, 10), 45) };
    });
    ws['!cols'] = colWidths;
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

/**
 * Reads an uploaded Excel file (.xlsx or .xls) and returns parsed JSON array
 */
export async function readExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}

// ==========================================
// TEMPLATES WITH EXACTLY 10 DUMMY ROWS EACH
// ==========================================

export function downloadTemplateKelasEkskul() {
  const dummyData = [
    { No: 1, Nama: 'Kelas 1A', Jenis: 'Utama', Kapasitas: 32, Deskripsi: 'Kelas 1 Reguler A' },
    { No: 2, Nama: 'Kelas 1B', Jenis: 'Utama', Kapasitas: 32, Deskripsi: 'Kelas 1 Reguler B' },
    { No: 3, Nama: 'Kelas 2A', Jenis: 'Utama', Kapasitas: 32, Deskripsi: 'Kelas 2 Reguler A' },
    { No: 4, Nama: 'Kelas 3A', Jenis: 'Utama', Kapasitas: 32, Deskripsi: 'Kelas 3 Reguler A' },
    { No: 5, Nama: 'Kelas 4A', Jenis: 'Utama', Kapasitas: 32, Deskripsi: 'Kelas 4 Fase B Kurikulum Merdeka' },
    { No: 6, Nama: 'Pramuka Siaga & Penggalang', Jenis: 'Ekskul', Kapasitas: 60, Deskripsi: 'Kepanduan Wajib' },
    { No: 7, Nama: 'Futsal & Mini Soccer', Jenis: 'Ekskul', Kapasitas: 30, Deskripsi: 'Pembinaan Atlet Pelajar' },
    { No: 8, Nama: 'Seni Tari Sunda', Jenis: 'Ekskul', Kapasitas: 25, Deskripsi: 'Pelestarian Budaya Lokal' },
    { No: 9, Nama: 'Pencak Silat Tradisional', Jenis: 'Ekskul', Kapasitas: 30, Deskripsi: 'Bela Diri Prestasi' },
    { No: 10, Nama: 'Dokter Kecil & UKS', Jenis: 'Ekskul', Kapasitas: 20, Deskripsi: 'Pertolongan Pertama dan Sanitasi' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Kelas_dan_Ekskul_SDN_Nambo_03', 'Data Kelas & Ekskul');
}

export function downloadTemplateSiswaReguler() {
  const dummyData = [
    { No: 1, NISN: '0198765431', NIS: '4101', 'Nama Lengkap': 'Aditya Pratama Putra', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2019-03-15', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201241503190001', Alamat: 'Kp. Bantarkopo RT 01/04', 'Tinggi Badan (cm)': 118, 'Berat Badan (kg)': 20, 'Nama Kelas': 'Kelas 1A' },
    { No: 2, NISN: '0198765432', NIS: '4102', 'Nama Lengkap': 'Bilqis Humaira Azzahra', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2019-05-20', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'P', NIK: '3201246005190002', Alamat: 'Jl. Raya Nambo RT 02/04', 'Tinggi Badan (cm)': 115, 'Berat Badan (kg)': 19, 'Nama Kelas': 'Kelas 1A' },
    { No: 3, NISN: '0198765433', NIS: '4103', 'Nama Lengkap': 'Cahyo Dimas Saputra', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2019-01-11', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201241101190003', Alamat: 'Perum Nambo Asri Blok A2', 'Tinggi Badan (cm)': 121, 'Berat Badan (kg)': 22, 'Nama Kelas': 'Kelas 1B' },
    { No: 4, NISN: '0198765434', NIS: '4104', 'Nama Lengkap': 'Daniel Samuel Simanjuntak', 'Tempat Lahir': 'Medan', 'Tanggal Lahir (YYYY-MM-DD)': '2019-07-08', Agama: 'Kristen', 'Jenis Kelamin (L/P)': 'L', NIK: '3201240807190004', Alamat: 'Jl. Industri Nambo No. 8', 'Tinggi Badan (cm)': 119, 'Berat Badan (kg)': 21, 'Nama Kelas': 'Kelas 1B' },
    { No: 5, NISN: '0188765435', NIS: '4005', 'Nama Lengkap': 'Elvira Kirana Putri', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2018-04-18', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'P', NIK: '3201245804180005', Alamat: 'Desa Bantarjati RT 03/02', 'Tinggi Badan (cm)': 123, 'Berat Badan (kg)': 23, 'Nama Kelas': 'Kelas 2A' },
    { No: 6, NISN: '0188765436', NIS: '4006', 'Nama Lengkap': 'Farel Akbar Kurnia', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2018-11-25', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201242511180006', Alamat: 'Kp. Nambo Hilir RT 01/01', 'Tinggi Badan (cm)': 125, 'Berat Badan (kg)': 24, 'Nama Kelas': 'Kelas 2B' },
    { No: 7, NISN: '0178765437', NIS: '3907', 'Nama Lengkap': 'Grace Natalia Sitorus', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2017-09-12', Agama: 'Katolik', 'Jenis Kelamin (L/P)': 'P', NIK: '3201245209170007', Alamat: 'Bantarjati Indah No. 14', 'Tinggi Badan (cm)': 129, 'Berat Badan (kg)': 26, 'Nama Kelas': 'Kelas 3A' },
    { No: 8, NISN: '0178765438', NIS: '3908', 'Nama Lengkap': 'Hendra Setiawan', 'Tempat Lahir': 'Bandung', 'Tanggal Lahir (YYYY-MM-DD)': '2017-06-03', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201240306170008', Alamat: 'Jl. Raya Klapanunggal', 'Tinggi Badan (cm)': 131, 'Berat Badan (kg)': 28, 'Nama Kelas': 'Kelas 3B' },
    { No: 9, NISN: '0168765439', NIS: '3809', 'Nama Lengkap': 'I Made Arya Wiguna', 'Tempat Lahir': 'Denpasar', 'Tanggal Lahir (YYYY-MM-DD)': '2016-10-14', Agama: 'Hindu', 'Jenis Kelamin (L/P)': 'L', NIK: '3201241410160009', Alamat: 'Perumahan Bantarjati B4', 'Tinggi Badan (cm)': 136, 'Berat Badan (kg)': 32, 'Nama Kelas': 'Kelas 4A' },
    { No: 10, NISN: '0158765440', NIS: '3710', 'Nama Lengkap': 'Jovita Larasati', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2015-08-29', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'P', NIK: '3201246908150010', Alamat: 'Kp. Bantarkopo RT 04/04', 'Tinggi Badan (cm)': 141, 'Berat Badan (kg)': 35, 'Nama Kelas': 'Kelas 5A' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Siswa_Reguler_SDN_Nambo_03', 'Data Siswa');
}

export function downloadTemplateSiswaPindahan() {
  const dummyData = [
    { No: 1, NISN: '0178912341', NIS: '4201', 'Nama Lengkap': 'Aldi Rizqullah Pratama', 'Tempat Lahir': 'Bekasi', 'Tanggal Lahir (YYYY-MM-DD)': '2017-04-10', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201241004170021', Alamat: 'Kp. Bantarkopo RT 02/04', 'Tinggi Badan (cm)': 129, 'Berat Badan (kg)': 27, 'Kelas Tujuan': 'Kelas 3A', 'Asal Sekolah': 'SDN Kranji 02 Bekasi', 'Tanggal Pindah (YYYY-MM-DD)': '2026-08-05', 'Nomor Surat Pindah': '421.2/045/SDN-K02/VIII/2026', 'Alasan Pindah': 'Orang tua mutasi kerja ke pabrik sekitar Klapanunggal' },
    { No: 2, NISN: '0178912342', NIS: '4202', 'Nama Lengkap': 'Bella Clarissa Aurelia', 'Tempat Lahir': 'Depok', 'Tanggal Lahir (YYYY-MM-DD)': '2017-08-22', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'P', NIK: '3201246208170022', Alamat: 'Jl. Raya Nambo KM 2', 'Tinggi Badan (cm)': 127, 'Berat Badan (kg)': 25, 'Kelas Tujuan': 'Kelas 3B', 'Asal Sekolah': 'SDIT Nurul Fikri Depok', 'Tanggal Pindah (YYYY-MM-DD)': '2026-08-12', 'Nomor Surat Pindah': '421.2/112/NF-DPK/VIII/2026', 'Alasan Pindah': 'Pindah rumah domisili keluarga ke Klapanunggal' },
    { No: 3, NISN: '0168912343', NIS: '4203', 'Nama Lengkap': 'Christian Alexander Tan', 'Tempat Lahir': 'Jakarta', 'Tanggal Lahir (YYYY-MM-DD)': '2016-02-14', Agama: 'Buddha', 'Jenis Kelamin (L/P)': 'L', NIK: '3201241402160023', Alamat: 'Perum Bantarjati Asri C1', 'Tinggi Badan (cm)': 134, 'Berat Badan (kg)': 31, 'Kelas Tujuan': 'Kelas 4A', 'Asal Sekolah': 'SD Tarakanita Jakarta', 'Tanggal Pindah (YYYY-MM-DD)': '2026-08-18', 'Nomor Surat Pindah': '421.1/098/TAR-JKT/VIII/2026', 'Alasan Pindah': 'Mengikuti orang tua wirausaha di Nambo' },
    { No: 4, NISN: '0168912344', NIS: '4204', 'Nama Lengkap': 'Dewi Ayu Sekar Wangi', 'Tempat Lahir': 'Solo', 'Tanggal Lahir (YYYY-MM-DD)': '2016-07-09', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'P', NIK: '3201244907160024', Alamat: 'Kp. Nambo Hilir RT 03/02', 'Tinggi Badan (cm)': 133, 'Berat Badan (kg)': 29, 'Kelas Tujuan': 'Kelas 4B', 'Asal Sekolah': 'SDN Mangkubumen Solo', 'Tanggal Pindah (YYYY-MM-DD)': '2026-08-24', 'Nomor Surat Pindah': '421.2/067/SDN-MKB/VIII/2026', 'Alasan Pindah': 'Pindah domisili ikut kakek dan nenek' },
    { No: 5, NISN: '0158912345', NIS: '4205', 'Nama Lengkap': 'Erick Setiawan Wijaya', 'Tempat Lahir': 'Surabaya', 'Tanggal Lahir (YYYY-MM-DD)': '2015-05-19', Agama: 'Kristen', 'Jenis Kelamin (L/P)': 'L', NIK: '3201241905150025', Alamat: 'Desa Bantarjati RT 02/03', 'Tinggi Badan (cm)': 142, 'Berat Badan (kg)': 37, 'Kelas Tujuan': 'Kelas 5A', 'Asal Sekolah': 'SD Kristen Petra Surabaya', 'Tanggal Pindah (YYYY-MM-DD)': '2026-09-01', 'Nomor Surat Pindah': '421.3/201/PETRA-SBY/IX/2026', 'Alasan Pindah': 'Penugasan kerja ayah di BUMN Bogor' },
    { No: 6, NISN: '0158912346', NIS: '4206', 'Nama Lengkap': 'Fathir Maulana Yusuf', 'Tempat Lahir': 'Bogor', 'Tanggal Lahir (YYYY-MM-DD)': '2015-11-30', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201243011150026', Alamat: 'Kp. Bantarkopo RT 03/04', 'Tinggi Badan (cm)': 139, 'Berat Badan (kg)': 33, 'Kelas Tujuan': 'Kelas 5B', 'Asal Sekolah': 'SDN Cileungsi 04', 'Tanggal Pindah (YYYY-MM-DD)': '2026-09-04', 'Nomor Surat Pindah': '421.2/088/CLS-04/IX/2026', 'Alasan Pindah': 'Lebih dekat dengan tempat tinggal baru' },
    { No: 7, NISN: '0148912347', NIS: '4207', 'Nama Lengkap': 'Giselle Amanda Putri', 'Tempat Lahir': 'Tangerang', 'Tanggal Lahir (YYYY-MM-DD)': '2014-03-27', Agama: 'Katolik', 'Jenis Kelamin (L/P)': 'P', NIK: '3201246703140027', Alamat: 'Jl. Raya Klapanunggal No. 5', 'Tinggi Badan (cm)': 145, 'Berat Badan (kg)': 38, 'Kelas Tujuan': 'Kelas 6A', 'Asal Sekolah': 'SD Santa Ursula Tangerang', 'Tanggal Pindah (YYYY-MM-DD)': '2026-09-10', 'Nomor Surat Pindah': '421.1/043/URS-TNG/IX/2026', 'Alasan Pindah': 'Orang tua pindah kerja' },
    { No: 8, NISN: '0188912348', NIS: '4208', 'Nama Lengkap': 'Habibi Ilham Syahputra', 'Tempat Lahir': 'Padang', 'Tanggal Lahir (YYYY-MM-DD)': '2018-09-15', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201241509180028', Alamat: 'Bantarjati RT 01/01', 'Tinggi Badan (cm)': 122, 'Berat Badan (kg)': 22, 'Kelas Tujuan': 'Kelas 2A', 'Asal Sekolah': 'SDN 01 Sawahan Padang', 'Tanggal Pindah (YYYY-MM-DD)': '2026-09-15', 'Nomor Surat Pindah': '421.2/115/PDG/IX/2026', 'Alasan Pindah': 'Mengikuti ibu berdagang di Klapanunggal' },
    { No: 9, NISN: '0188912349', NIS: '4209', 'Nama Lengkap': 'Intan Permata Sari', 'Tempat Lahir': 'Cianjur', 'Tanggal Lahir (YYYY-MM-DD)': '2018-12-04', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'P', NIK: '3201244412180029', Alamat: 'Kp. Nambo Kulon RT 02/02', 'Tinggi Badan (cm)': 121, 'Berat Badan (kg)': 21, 'Kelas Tujuan': 'Kelas 2B', 'Asal Sekolah': 'SDN Ciranjang 01 Cianjur', 'Tanggal Pindah (YYYY-MM-DD)': '2026-09-20', 'Nomor Surat Pindah': '421.2/078/CJR/IX/2026', 'Alasan Pindah': 'Relokasi keluarga' },
    { No: 10, NISN: '0198912350', NIS: '4210', 'Nama Lengkap': 'Kenzie Rayhan Alvaro', 'Tempat Lahir': 'Sukabumi', 'Tanggal Lahir (YYYY-MM-DD)': '2019-02-09', Agama: 'Islam', 'Jenis Kelamin (L/P)': 'L', NIK: '3201240902190030', Alamat: 'Jl. Bantarkopo RT 04/04', 'Tinggi Badan (cm)': 117, 'Berat Badan (kg)': 20, 'Kelas Tujuan': 'Kelas 1A', 'Asal Sekolah': 'TK Pertiwi Cibadak', 'Tanggal Pindah (YYYY-MM-DD)': '2026-09-25', 'Nomor Surat Pindah': '421.1/012/TK-PTW/IX/2026', 'Alasan Pindah': 'Pindahan dari luar daerah ke kelas 1' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Siswa_Pindahan_SDN_Nambo_03', 'Siswa Pindahan');
}

export function downloadTemplateGuru() {
  const dummyData = [
    { No: 1, NIP: '198105152009031004', NUPTK: '1234567890123451', 'Nama Lengkap': 'Drs. Supriyadi', Gelar: 'M.Pd.', Jabatan: 'Guru Kelas 5', 'Jenis Kelamin (L/P)': 'L', 'Status Kepegawaian': 'PNS', Golongan: 'IV/a', 'Nomor HP': '081289001101', Email: 'supriyadi@sdnnambo03.sch.id' },
    { No: 2, NIP: '198604202011012012', NUPTK: '2345678901234562', 'Nama Lengkap': 'Nur Aini', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 2', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'III/c', 'Nomor HP': '081289001102', Email: 'nur.aini@sdnnambo03.sch.id' },
    { No: 3, NIP: '199011122020121008', NUPTK: '3456789012345673', 'Nama Lengkap': 'Wahyu Hidayat', Gelar: 'S.Pd.I.', Jabatan: 'Guru PAI & Budi Pekerti', 'Jenis Kelamin (L/P)': 'L', 'Status Kepegawaian': 'PPPK', Golongan: 'IX', 'Nomor HP': '081289001103', Email: 'wahyu.hidayat@sdnnambo03.sch.id' },
    { No: 4, NIP: '-', NUPTK: '4567890123456784', 'Nama Lengkap': 'Siti Maryam', Gelar: 'S.Pd.', Jabatan: 'Guru Bahasa Inggris', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'Honorer / GTT', Golongan: '-', 'Nomor HP': '085789001104', Email: 'siti.maryam@sdnnambo03.sch.id' },
    { No: 5, NIP: '198708142014062003', NUPTK: '5678901234567895', 'Nama Lengkap': 'Tri Wahyuni', Gelar: 'S.Pd.SD', Jabatan: 'Guru Kelas 3', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'III/b', 'Nomor HP': '081389001105', Email: 'tri.wahyuni@sdnnambo03.sch.id' },
    { No: 6, NIP: '199302182023211002', NUPTK: '6789012345678906', 'Nama Lengkap': 'Bagus Prasetyo', Gelar: 'S.Pd.Jas.', Jabatan: 'Guru PJOK', 'Jenis Kelamin (L/P)': 'L', 'Status Kepegawaian': 'PPPK', Golongan: 'IX', 'Nomor HP': '081989001106', Email: 'bagus.p@sdnnambo03.sch.id' },
    { No: 7, NIP: '-', NUPTK: '7890123456789017', 'Nama Lengkap': 'Ratna Sari Dewi', Gelar: 'S.Pd.', Jabatan: 'Guru SBdP & Seni', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'Honorer / GTT', Golongan: '-', 'Nomor HP': '087889001107', Email: 'ratna.sari@sdnnambo03.sch.id' },
    { No: 8, NIP: '197809102007011011', NUPTK: '8901234567890128', 'Nama Lengkap': 'H. Endang Suhendar', Gelar: 'S.Pd.SD', Jabatan: 'Guru Kelas 6', 'Jenis Kelamin (L/P)': 'L', 'Status Kepegawaian': 'PNS', Golongan: 'IV/a', 'Nomor HP': '081189001108', Email: 'endang.s@sdnnambo03.sch.id' },
    { No: 9, NIP: '199405052024212009', NUPTK: '9012345678901239', 'Nama Lengkap': 'Intan Permata', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 1', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PPPK', Golongan: 'IX', 'Nomor HP': '085689001109', Email: 'intan.p@sdnnambo03.sch.id' },
    { No: 10, NIP: '198312012010011015', NUPTK: '0123456789012340', 'Nama Lengkap': 'Agus Salim', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 4', 'Jenis Kelamin (L/P)': 'L', 'Status Kepegawaian': 'PNS', Golongan: 'III/c', 'Nomor HP': '081289001110', Email: 'agus.salim@sdnnambo03.sch.id' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Guru_SDN_Nambo_03', 'Data Guru');
}

export function downloadTemplateKepegawaian() {
  const dummyData = [
    { No: 1, NIK: '3201241508820001', NIP: '198208152012121003', 'Nama Lengkap': 'Dedi Kurniawan', Tugas: 'Kepala Urusan Tata Usaha', 'Status Kepegawaian': 'PNS', Pendidikan: 'S1 Administrasi Negara', 'Nomor HP': '081234000101' },
    { No: 2, NIK: '3201242005930004', NIP: '-', 'Nama Lengkap': 'Rizky Ramadhan', Tugas: 'Operator Dapodik & IT Sekolah', 'Status Kepegawaian': 'Honorer / PTT', Pendidikan: 'D3 Manajemen Informatika', 'Nomor HP': '085712000202' },
    { No: 3, NIK: '3201244809890002', NIP: '198909182023212006', 'Nama Lengkap': 'Siti Aminah', Tugas: 'Bendahara BOS & Pengelola Keuangan', 'Status Kepegawaian': 'PPPK', Pendidikan: 'S1 Akuntansi', 'Nomor HP': '081398000303' },
    { No: 4, NIK: '3201241004780005', NIP: '-', 'Nama Lengkap': 'Sukardi', Tugas: 'Penjaga Sekolah & Petugas Keamanan', 'Status Kepegawaian': 'Honorer / PTT', Pendidikan: 'SMA', 'Nomor HP': '087812000404' },
    { No: 5, NIK: '3201245506850003', NIP: '-', 'Nama Lengkap': 'Mulyanah', Tugas: 'Petugas Perpustakaan Sekolah', 'Status Kepegawaian': 'Honorer / PTT', Pendidikan: 'D3 Perpustakaan', 'Nomor HP': '081234000505' },
    { No: 6, NIK: '3201241908770006', NIP: '-', 'Nama Lengkap': 'Saepulloh', Tugas: 'Petugas Kebersihan & Pertamanan', 'Status Kepegawaian': 'Honorer / PTT', Pendidikan: 'SMP', 'Nomor HP': '085712000606' },
    { No: 7, NIK: '3201242502900007', NIP: '199002252022211004', 'Nama Lengkap': 'Fajar Siddiq', Tugas: 'Pengadministrasi Sarana dan Prasarana', 'Status Kepegawaian': 'PPPK', Pendidikan: 'S1 Teknik', 'Nomor HP': '081398000707' },
    { No: 8, NIK: '3201244711880008', NIP: '-', 'Nama Lengkap': 'Nurhasanah', Tugas: 'Staf Administrasi Kesiswaan & PIP', 'Status Kepegawaian': 'Honorer / PTT', Pendidikan: 'SMK Administrasi Perkantoran', 'Nomor HP': '087812000808' },
    { No: 9, NIK: '3201241203790009', NIP: '-', 'Nama Lengkap': 'Mamat Slamet', Tugas: 'Petugas Keamanan Malam', 'Status Kepegawaian': 'Honorer / PTT', Pendidikan: 'SMA', 'Nomor HP': '081234000909' },
    { No: 10, NIK: '3201245012950010', NIP: '-', 'Nama Lengkap': 'Lia Yulianingsih', Tugas: 'Petugas UKS & Pembantu Administrasi', 'Status Kepegawaian': 'Honorer / PTT', Pendidikan: 'D3 Keperawatan', 'Nomor HP': '085712001010' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Kepegawaian_TU_SDN_Nambo_03', 'Data Kepegawaian');
}

export function downloadTemplateAbsensiHarian() {
  const dummyData = [
    { No: 1, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 1A', Hadir: 31, Sakit: 1, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: '1 siswa flu' },
    { No: 2, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 1B', Hadir: 32, Sakit: 0, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: 'Lengkap hadir' },
    { No: 3, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 2A', Hadir: 31, Sakit: 0, Izin: 1, Alpa: 0, 'Total Siswa': 32, Catatan: '1 siswa izin keluarga' },
    { No: 4, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 2B', Hadir: 32, Sakit: 0, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: 'Lengkap' },
    { No: 5, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 3A', Hadir: 32, Sakit: 0, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: 'Tertib' },
    { No: 6, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 3B', Hadir: 30, Sakit: 2, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: '2 siswa sakit' },
    { No: 7, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 4A', Hadir: 31, Sakit: 1, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: 'Praktik IPAS' },
    { No: 8, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 4B', Hadir: 32, Sakit: 0, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: 'Lengkap' },
    { No: 9, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 5A', Hadir: 30, Sakit: 1, Izin: 1, Alpa: 0, 'Total Siswa': 32, Catatan: 'P5 Budidaya' },
    { No: 10, 'Tanggal (YYYY-MM-DD)': '2026-10-15', 'Nama Kelas': 'Kelas 6A', Hadir: 32, Sakit: 0, Izin: 0, Alpa: 0, 'Total Siswa': 32, Catatan: 'Persiapan Try Out' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Absensi_Harian_SDN_Nambo_03_TA_2026_2027', 'Absensi Harian');
}

export function downloadTemplatePraktikKinerja() {
  const dummyData = [
    { No: 1, 'Nama Guru': 'Hj. Siti Rohmah, S.Pd.SD', Indikator: 'Penerapan Disiplin Positif', 'Catatan Refleksi Guru': 'Membangun kesepakatan kelas bersama peserta didik dan menguatkan disiplin positif tanpa hukuman fisik.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-09-15', 'Catatan Kepala Sekolah': 'Sangat baik dan konsisten memfasilitasi restitusi peserta didik.' },
    { No: 2, 'Nama Guru': 'Asep Saepudin, S.Pd.', Indikator: 'Keteraturan Suasana Kelas', 'Catatan Refleksi Guru': 'Mengelola dinamika kelas melalui ice breaking terstruktur.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-09-22', 'Catatan Kepala Sekolah': 'Kelas sangat antusias dan tertib.' },
    { No: 3, 'Nama Guru': 'Rian Permana, S.Pd.Jas.', Indikator: 'Aktivitas Interaktif', 'Catatan Refleksi Guru': 'Mendorong seluruh siswa aktif terlibat dalam permainan tim bola kasti.', 'Status Observasi (Sudah/Belum)': 'Belum', 'Tanggal Observasi (YYYY-MM-DD)': '', 'Catatan Kepala Sekolah': 'Jadwal observasi tanggal 20 Oktober 2026' },
    { No: 4, 'Nama Guru': 'Dewi Lestari, S.Pd.', Indikator: 'Ekspektasi pada Peserta Didik', 'Catatan Refleksi Guru': 'Memberikan tantangan bertingkat sesuai kesiapan belajar murid.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-09-29', 'Catatan Kepala Sekolah': 'Diferensiasi proses terlaksana optimal.' },
    { No: 5, 'Nama Guru': 'Nurul Hidayah, S.Pd.', Indikator: 'Instruksi yang Adaptif', 'Catatan Refleksi Guru': 'Menyesuaikan penjelasan menggunakan benda konkrit saat siswa kesulitan berhitung.', 'Status Observasi (Sudah/Belum)': 'Belum', 'Tanggal Observasi (YYYY-MM-DD)': '', 'Catatan Kepala Sekolah': '' },
    { No: 6, 'Nama Guru': 'Eni Maryani, S.Pd.SD', Indikator: 'Umpan Balik Konstruktif', 'Catatan Refleksi Guru': 'Memberikan catatan apresiatif pada lembar asesmen formatif siswa.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-10-02', 'Catatan Kepala Sekolah': 'Umpan balik membangkitkan motivasi siswa.' },
    { No: 7, 'Nama Guru': 'Fitri Handayani, S.Pd.', Indikator: 'Perhatian dan Kepedulian', 'Catatan Refleksi Guru': 'Mendengarkan keluh kesah siswa dan merangkul siswa pemalu.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-10-05', 'Catatan Kepala Sekolah': 'Pendekatan humanis sangat terasa.' },
    { No: 8, 'Nama Guru': 'Bambang Supriyanto, S.Pd.SD, M.Pd.', Indikator: 'Keteraturan Suasana Kelas', 'Catatan Refleksi Guru': 'Membuat aturan kerja kelompok yang jelas dengan pembagian peran merata.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-10-08', 'Catatan Kepala Sekolah': 'Kepemimpinan pembelajaran sangat matang.' },
    { No: 9, 'Nama Guru': 'Sri Wahyuni, S.Pd.', Indikator: 'Instruksi yang Adaptif', 'Catatan Refleksi Guru': 'Menggunakan mind mapping digital pada materi Bahasa Indonesia.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-10-10', 'Catatan Kepala Sekolah': 'Inovatif dan menarik minat siswa.' },
    { No: 10, 'Nama Guru': 'Ustadz Ahmad Fauzi, S.Pd.I.', Indikator: 'Penerapan Disiplin Positif', 'Catatan Refleksi Guru': 'Membiasakan sholat dhuha berjamaah dan hafalan surat pendek dengan reward bintang kebaikan.', 'Status Observasi (Sudah/Belum)': 'Sudah', 'Tanggal Observasi (YYYY-MM-DD)': '2026-10-12', 'Catatan Kepala Sekolah': 'Karakter religius tertanam kuat.' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Praktik_Kinerja_Guru_SDN_Nambo_03', 'Praktik Kinerja');
}

export function downloadTemplateBerAKHLAK() {
  const dummyData = [
    { No: 1, 'Nama Guru': 'Hj. Siti Rohmah, S.Pd.SD', 'Berorientasi Pelayanan': 'Menyapa siswa ramah dan memberikan informasi perkembangan anak ke orang tua secara berkala.', Akuntabel: 'Menggunakan sarana sekolah secara bertanggung jawab dan hadir tepat waktu.', Kompeten: 'Terus meningkatkan kompetensi pedagogik melalui webinar Kemendikbud.', Harmonis: 'Membangun suasana kekeluargaan di ruang guru dan kelas.', Loyal: 'Menjaga rahasia jabatan dan nama baik instansi SDN Nambo 03.', Adaptif: 'Cepat menyesuaikan dengan aplikasi asesmen digital terkini.', Kolaboratif: 'Bekerja sama dengan paguyuban kelas untuk kemajuan kelas 1A.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 2, 'Nama Guru': 'Asep Saepudin, S.Pd.', 'Berorientasi Pelayanan': 'Melayani kebutuhan belajar siswa dengan sabar dan responsif.', Akuntabel: 'Menyusun perangkat ajar tepat waktu dan transparan.', Kompeten: 'Menguasai materi IPAS dan kurikulum merdeka.', Harmonis: 'Menghargai perbedaan pendapat dalam rapat dewan guru.', Loyal: 'Siap menjalankan tugas kedinasan di luar jam sekolah jika diperlukan.', Adaptif: 'Memanfaatkan proyektor interaktif dan modul ajar digital.', Kolaboratif: 'Bermitra dengan guru PJOK dalam pembelajaran luar kelas.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 3, 'Nama Guru': 'Dewi Lestari, S.Pd.', 'Berorientasi Pelayanan': 'Selalu menyambut kedatangan siswa di pintu kelas dengan senyum.', Akuntabel: 'Mengisi jurnal kelas dan absensi harian secara teliti.', Kompeten: 'Aktif dalam kegiatan KKG gugus kecamatan Klapanunggal.', Harmonis: 'Membantu rekan guru yang sedang mengalami kendala.', Loyal: 'Mendukung penuh visi misi Kepala Sekolah.', Adaptif: 'Menerapkan media lagu edukasi untuk materi tematik.', Kolaboratif: 'Aktif dalam kepanitiaan pentas seni sekolah.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 4, 'Nama Guru': 'Nurul Hidayah, S.Pd.', 'Berorientasi Pelayanan': 'Tanggap menangani siswa yang merasa sakit atau cemas.', Akuntabel: 'Disiplin mengembalikan barang inventaris sekolah.', Kompeten: 'Mengikuti pelatihan kurikulum paradigma baru.', Harmonis: 'Menjaga tutur kata santun kepada sesama guru dan warga sekolah.', Loyal: 'Menjaga integritas sebagai ASN PPPK.', Adaptif: 'Membuat pojok baca kreatif dengan bahan daur ulang.', Kolaboratif: 'Berkoordinasi dengan tenaga kebersihan untuk kerapian kelas.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 5, 'Nama Guru': 'Eni Maryani, S.Pd.SD', 'Berorientasi Pelayanan': 'Memberikan layanan konsultasi belajar ramah bagi wali murid.', Akuntabel: 'Mengelola buku induk nilai secara tertib.', Kompeten: 'Berbagi praktik baik metode membaca nyaring di KKG.', Harmonis: 'Menghormati perbedaan suku dan agama.', Loyal: 'Mengutamakan kepentingan peserta didik.', Adaptif: 'Mengadaptasi modul ajar dari PMM sesuai karakteristik murid Nambo.', Kolaboratif: 'Bekerja sama dengan guru agama dalam pembiasaan doa.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 6, 'Nama Guru': 'Fitri Handayani, S.Pd.', 'Berorientasi Pelayanan': 'Mendengarkan kesulitan belajar anak dengan penuh empati.', Akuntabel: 'Menyelesaikan laporan hasil belajar tepat jadwal.', Kompeten: 'Kreatif membuat lembar kerja peserta didik berbasis cerita anak.', Harmonis: 'Menciptakan iklim kelas yang inklusif dan menyenangkan.', Loyal: 'Disiplin mentaati tata tertib dinas pendidikan.', Adaptif: 'Memanfaatkan media video animasi pembelajaran.', Kolaboratif: 'Aktif berdiskusi kurikulum dengan sesama guru kelas paralel.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 7, 'Nama Guru': 'Bambang Supriyanto, S.Pd.SD, M.Pd.', 'Berorientasi Pelayanan': 'Memberikan bimbingan kepemimpinan dan karakter bagi siswa kelas 5.', Akuntabel: 'Menjadi teladan integritas bagi guru junior.', Kompeten: 'Telah menyelesaikan studi S2 Pendidikan Dasar dan aktif menulis karya ilmiah.', Harmonis: 'Memupuk kerukunan warga sekolah.', Loyal: 'Berkomitmen tinggi terhadap kemajuan mutu pendidikan SDN Nambo 03.', Adaptif: 'Mendorong pemanfaatan LMS digital sekolah.', Kolaboratif: 'Mengkoordinir pelaksanaan Gelar Karya P5 tingkat sekolah.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 8, 'Nama Guru': 'Sri Wahyuni, S.Pd.', 'Berorientasi Pelayanan': 'Memberikan pendampingan intensif persiapan ujian kelulusan kelas 6.', Akuntabel: 'Melakukan penilaian secara objektif dan akuntabel.', Kompeten: 'Mampu menyusun soal Asesmen Standar Pendidikan dengan baik.', Harmonis: 'Mendukung suasana belajar yang tenang dan fokus.', Loyal: 'Mengabdi dengan penuh dedikasi.', Adaptif: 'Menggunakan bank soal daring.', Kolaboratif: 'Berkoordinasi dengan komite sekolah dan orang tua murid kelas 6.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 9, 'Nama Guru': 'Rian Permana, S.Pd.Jas.', 'Berorientasi Pelayanan': 'Melatih fisik dan mental siswa dengan penuh kesabaran dan sportivitas.', Akuntabel: 'Merawat perlengkapan olahraga sekolah dengan tertib.', Kompeten: 'Memiliki lisensi kepelatihan futsal dan pembina pramuka KMD.', Harmonis: 'Menjalin keakraban dengan seluruh civitas sekolah.', Loyal: 'Siap mendampingi siswa dalam berbagai event kejuaraan luar sekolah.', Adaptif: 'Memodifikasi alat olahraga dari bahan sederhana.', Kolaboratif: 'Berkolaborasi dengan puskesmas untuk tes kebugaran siswa.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 10, 'Nama Guru': 'Ustadz Ahmad Fauzi, S.Pd.I.', 'Berorientasi Pelayanan': 'Membimbing rohani dan akhlak mulia seluruh peserta didik.', Akuntabel: 'Menyelenggarakan kegiatan keagamaan secara amanah.', Kompeten: 'Mumpuni dalam ilmu fiqih anak dan tahsin Al-Quran.', Harmonis: 'Mengajarkan moderasi beragama dan toleransi sejak dini.', Loyal: 'Setia membela Pancasila dan NKRI.', Adaptif: 'Menggunakan rekaman audio tilawah interaktif di kelas.', Kolaboratif: 'Bekerja sama dengan DKM masjid sekitar untuk sholat Jumat & Dhuha.', Evaluasi: 'Di Atas Ekspektasi' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Perilaku_BerAKHLAK_Guru_SDN_Nambo_03', 'Perilaku BerAKHLAK');
}

export function downloadTemplateTugasTambahan() {
  const dummyData = [
    { No: 1, 'Nama Guru': 'Hj. Siti Rohmah, S.Pd.SD', 'Nama Tugas Tambahan': 'Wali Kelas 1A', 'Refleksi Pelaksanaan': 'Melaksanakan pendampingan adaptasi siswa baru, mengatur ruang kelas yang nyaman, serta memfasilitasi komunikasi mingguan paguyuban orang tua.', 'Bukti Dukung': 'SK Pembagian Tugas No. 421.2/015/SDN-N03/VII/2026', Status: 'Selesai' },
    { No: 2, 'Nama Guru': 'Rian Permana, S.Pd.Jas.', 'Nama Tugas Tambahan': 'Pembina Pramuka Gugus Depan', 'Refleksi Pelaksanaan': 'Melaksanakan latihan rutin kepramukaan setiap Jumat sore, kegiatan uji SKU siaga dan penggalang, serta penanaman karakter disiplin.', 'Bukti Dukung': 'Program Kerja Gudep & Absensi Latihan', Status: 'Dalam Proses' },
    { No: 3, 'Nama Guru': 'Bambang Supriyanto, S.Pd.SD, M.Pd.', 'Nama Tugas Tambahan': 'Koordinator P5 Sekolah', 'Refleksi Pelaksanaan': 'Memfasilitasi tim fasilitator P5 menyusun 2 tema proyek: Kewirausahaan dan Kearifan Lokal Nambo.', 'Bukti Dukung': 'Modul P5 Semester Ganjil 2026/2027', Status: 'Selesai' },
    { No: 4, 'Nama Guru': 'Dewi Lestari, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 1B', 'Refleksi Pelaksanaan': 'Melakukan pemetaan awal literasi dan numerasi siswa kelas 1B.', 'Bukti Dukung': 'Buku Administrasi Wali Kelas 1B', Status: 'Selesai' },
    { No: 5, 'Nama Guru': 'Nurul Hidayah, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 2A', 'Refleksi Pelaksanaan': 'Membina kedisiplinan dan menjaga ketertiban 32 siswa kelas 2A.', 'Bukti Dukung': 'Buku Jurnal Wali Kelas 2A', Status: 'Selesai' },
    { No: 6, 'Nama Guru': 'Asep Saepudin, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 4A & Pembina Silat', 'Refleksi Pelaksanaan': 'Melakukan pembinaan karakter dan latihan mingguan pencak silat siswa berprestasi.', 'Bukti Dukung': 'Jadwal Latihan & SK Tugas Tambahan', Status: 'Selesai' },
    { No: 7, 'Nama Guru': 'Eni Maryani, S.Pd.SD', 'Nama Tugas Tambahan': 'Pembina Seni Tari Sunda', 'Refleksi Pelaksanaan': 'Melatih regu tari tradisional untuk pengisian acara hari besar nasional di sekolah.', 'Bukti Dukung': 'Dokumentasi Latihan & Video Gerak Tari', Status: 'Dalam Proses' },
    { No: 8, 'Nama Guru': 'Sri Wahyuni, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 6B & Tim Kurikulum', 'Refleksi Pelaksanaan': 'Mengkoordinasikan penyusunan KOSP Kurikulum Merdeka tingkat sekolah bersama pengawas.', 'Bukti Dukung': 'Dokumen KOSP SD Negeri Nambo 03 TA 2026-2027', Status: 'Selesai' },
    { No: 9, 'Nama Guru': 'Ustadz Ahmad Fauzi, S.Pd.I.', 'Nama Tugas Tambahan': 'Pembina Rohani Islam & Marawis', 'Refleksi Pelaksanaan': 'Membimbing ekstrakurikuler marawis dan memimpin sholat dhuha serta peringatan Maulid Nabi.', 'Bukti Dukung': 'Jadwal Pembiasaan Rohis & Foto Kegiatan', Status: 'Selesai' },
    { No: 10, 'Nama Guru': 'Drs. H. Mulyadi, M.M.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 6A & Pengelola Aset Guru', 'Refleksi Pelaksanaan': 'Mendampingi persiapan kelulusan siswa kelas 6 serta memonitor kelayakan sarana belajar kelas 6.', 'Bukti Dukung': 'Buku Rekap Perkembangan Siswa Kelas 6A', Status: 'Selesai' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Tugas_Tambahan_Guru_SDN_Nambo_03', 'Tugas Tambahan');
}

export function downloadTemplateRapotKinerja() {
  const dummyData = [
    { No: 1, 'Nama Guru': 'Hj. Siti Rohmah, S.Pd.SD', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 96, 'Catatan Kepala Sekolah': 'Kepemimpinan pembelajaran sangat baik, adaptasi siswa kelas 1 berhasil optimal.', 'Rekomendasi Kepala Sekolah': 'Dipertahankan dan dibagikan sebagai praktik baik KKG.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 2, 'Nama Guru': 'Dewi Lestari, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 90, 'Catatan Kepala Sekolah': 'Pelaksanaan diferensiasi belajar berjalan aktif.', 'Rekomendasi Kepala Sekolah': 'Tingkatkan keterlibatan siswa berkebutuhan khusus.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 3, 'Nama Guru': 'Nurul Hidayah, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 89, 'Catatan Kepala Sekolah': 'Disiplin dan bertanggung jawab terhadap tugas administrasi kelas 2A.', 'Rekomendasi Kepala Sekolah': 'Lengkapi modul ajar berbasis proyek.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 4, 'Nama Guru': 'Asep Saepudin, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 92, 'Catatan Kepala Sekolah': 'Pengelolaan kelas IPAS dan pembinaan pencak silat sangat berdedikasi.', 'Rekomendasi Kepala Sekolah': 'Pertahankan semangat bimbingan minat bakat.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 5, 'Nama Guru': 'Eni Maryani, S.Pd.SD', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 91, 'Catatan Kepala Sekolah': 'Seni tari dan pembiasaan budaya Sunda berjalan sangat harmonis.', 'Rekomendasi Kepala Sekolah': 'Kembangkan kolaborasi dengan paguyuban seni.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 6, 'Nama Guru': 'Bambang Supriyanto, S.Pd.SD, M.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 95, 'Catatan Kepala Sekolah': 'Inovatif dalam modul P5 dan kepemimpinan pembelajaran kelas 5.', 'Rekomendasi Kepala Sekolah': 'Lanjutkan penulisan artikel ilmiah sekolah.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 7, 'Nama Guru': 'Sri Wahyuni, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 94, 'Catatan Kepala Sekolah': 'Penyusunan KOSP dan persiapan asesmen kelulusan sangat terstruktur.', 'Rekomendasi Kepala Sekolah': 'Tingkatkan try out literasi numerasi.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 8, 'Nama Guru': 'Rian Permana, S.Pd.Jas.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 88, 'Catatan Kepala Sekolah': 'Pembinaan fisik olahraga dan gudep pramuka sangat aktif.', 'Rekomendasi Kepala Sekolah': 'Lengkapi administrasi jurnal mengajar mingguan.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 9, 'Nama Guru': 'Ustadz Ahmad Fauzi, S.Pd.I.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 95, 'Catatan Kepala Sekolah': 'Pembiasaan sholat dhuha berjamaah dan penanaman budi pekerti sangat berkesan.', 'Rekomendasi Kepala Sekolah': 'Pertahankan keteladanan rohani di sekolah.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 10, 'Nama Guru': 'Drs. H. Mulyadi, M.M.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 96, 'Catatan Kepala Sekolah': 'Senioritas yang membimbing dan menjadi tauladan dewan guru SDN Nambo 03.', 'Rekomendasi Kepala Sekolah': 'Terus membimbing guru-guru junior.', 'Tanggal Penetapan': '2026-12-15' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Rapot_Kinerja_Guru_SDN_Nambo_03', 'Rapot Kinerja Guru');
}

export function downloadTemplateRekapUmur() {
  const dummyData = [
    { No: 1, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 1A', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 2, '6 Th P': 3, '7 Th L': 14, '7 Th P': 13, '8 Th L': 0, '8 Th P': 0, '9 Th L': 0, '9 Th P': 0, '10 Th L': 0, '10 Th P': 0, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 2, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 1B', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 1, '6 Th P': 2, '7 Th L': 15, '7 Th P': 14, '8 Th L': 0, '8 Th P': 0, '9 Th L': 0, '9 Th P': 0, '10 Th L': 0, '10 Th P': 0, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 3, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 2A', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 1, '7 Th P': 1, '8 Th L': 16, '8 Th P': 14, '9 Th L': 0, '9 Th P': 0, '10 Th L': 0, '10 Th P': 0, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 4, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 2B', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 0, '7 Th P': 0, '8 Th L': 15, '8 Th P': 17, '9 Th L': 0, '9 Th P': 0, '10 Th L': 0, '10 Th P': 0, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 5, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 3A', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 0, '7 Th P': 0, '8 Th L': 1, '8 Th P': 1, '9 Th L': 15, '9 Th P': 15, '10 Th L': 0, '10 Th P': 0, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 6, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 3B', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 0, '7 Th P': 0, '8 Th L': 0, '8 Th P': 0, '9 Th L': 16, '9 Th P': 16, '10 Th L': 0, '10 Th P': 0, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 7, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 4A', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 0, '7 Th P': 0, '8 Th L': 0, '8 Th P': 0, '9 Th L': 1, '9 Th P': 1, '10 Th L': 15, '10 Th P': 15, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 8, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 4B', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 0, '7 Th P': 0, '8 Th L': 0, '8 Th P': 0, '9 Th L': 0, '9 Th P': 0, '10 Th L': 16, '10 Th P': 16, '11 Th L': 0, '11 Th P': 0, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 9, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 5A', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 0, '7 Th P': 0, '8 Th L': 0, '8 Th P': 0, '9 Th L': 0, '9 Th P': 0, '10 Th L': 0, '10 Th P': 0, '11 Th L': 16, '11 Th P': 16, '12 Th L': 0, '12 Th P': 0, '>12 Th L': 0, '>12 Th P': 0 },
    { No: 10, 'Bulan (YYYY-MM)': '2026-10', 'Nama Kelas': 'Kelas 6A', '<6 Th L': 0, '<6 Th P': 0, '6 Th L': 0, '6 Th P': 0, '7 Th L': 0, '7 Th P': 0, '8 Th L': 0, '8 Th P': 0, '9 Th L': 0, '9 Th P': 0, '10 Th L': 0, '10 Th P': 0, '11 Th L': 0, '11 Th P': 0, '12 Th L': 16, '12 Th P': 16, '>12 Th L': 0, '>12 Th P': 0 }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Rekapitulasi_Umur_Siswa_SDN_Nambo_03', 'Rekap Umur Siswa');
}

/**
 * Downloads a complete multi-sheet master Excel workbook containing the whole school year dataset
 */
export function downloadMasterExcelArchive(payload: {
  schoolProfile: any;
  classes: any[];
  students: any[];
  teachers: any[];
  staff: any[];
  teachingHours: any[];
  attendanceRecords: any[];
  teacherReportCards: any[];
  manualAgeRecaps: any[];
}) {
  const wb = XLSX.utils.book_new();

  // 1. Profil Sekolah
  const profileRows = [
    { Parameter: 'Nama Sekolah', Nilai: payload.schoolProfile.namaSekolah },
    { Parameter: 'NPSN', Nilai: payload.schoolProfile.npsn },
    { Parameter: 'Kepala Sekolah', Nilai: payload.schoolProfile.namaKepalaSekolah },
    { Parameter: 'NIP Kepala Sekolah', Nilai: payload.schoolProfile.nipKepalaSekolah },
    { Parameter: 'Alamat Sekolah', Nilai: payload.schoolProfile.alamat },
    { Parameter: 'Tahun Ajaran', Nilai: payload.schoolProfile.tahunAjaran },
    { Parameter: 'Semester Aktif', Nilai: payload.schoolProfile.semesterAktif },
    { Parameter: 'Desa / Kelurahan', Nilai: payload.schoolProfile.desaKelurahan },
    { Parameter: 'Kecamatan', Nilai: payload.schoolProfile.kecamatan },
    { Parameter: 'Kabupaten', Nilai: payload.schoolProfile.kabupaten },
    { Parameter: 'Provinsi', Nilai: payload.schoolProfile.provinsi },
    { Parameter: 'Tanggal Export Data', Nilai: new Date().toLocaleString('id-ID') }
  ];
  const wsProfile = XLSX.utils.json_to_sheet(profileRows);
  XLSX.utils.book_append_sheet(wb, wsProfile, 'Profil Sekolah');

  // 2. Daftar Rombel & Ekskul
  const classesRows = payload.classes.map((c, i) => ({
    No: i + 1,
    'Nama Rombel / Ekskul': c.nama,
    Jenis: c.jenis,
    Kapasitas: c.kapasitas,
    Deskripsi: c.deskripsi || '-',
    'ID Rombel': c.id
  }));
  const wsClasses = XLSX.utils.json_to_sheet(classesRows);
  XLSX.utils.book_append_sheet(wb, wsClasses, 'Rombel & Ekskul');

  // 3. Buku Induk Siswa Lengkap
  const studentRows = payload.students.map((s, i) => {
    const clsName = payload.classes.find(c => c.id === s.kelasId)?.nama || s.kelasId;
    return {
      No: i + 1,
      NISN: s.nisn,
      NIS: s.nis,
      'Nama Lengkap': s.namaLengkap,
      Kelas: clsName,
      'Jenis Kelamin': s.jenisKelamin,
      Agama: s.agama,
      'Tempat Lahir': s.tempatLahir,
      'Tanggal Lahir': s.tanggalLahir,
      NIK: s.nik,
      Alamat: s.alamat,
      'Status Siswa': s.status,
      'Penerima PIP': s.isPIP ? 'Ya (Penerima)' : 'Tidak',
      'Tinggi Badan (cm)': s.tinggiBadan || '-',
      'Berat Badan (kg)': s.beratBadan || '-',
      'Asal Sekolah Pindahan': s.asalSekolah || '-',
      'Tanggal Pindah': s.tanggalPindah || '-',
      'Alasan Mutasi/DO': s.alasanKeluar || '-'
    };
  });
  const wsStudents = XLSX.utils.json_to_sheet(studentRows);
  XLSX.utils.book_append_sheet(wb, wsStudents, 'Buku Induk Siswa');

  // 4. Data Guru & Tenaga Kependidikan
  const gtkRows = [
    ...payload.teachers.map((t, i) => ({
      No: i + 1,
      Peran: 'Guru',
      'Nama Lengkap': t.nama,
      Gelar: t.gelar,
      NIP: t.nip || '-',
      NUPTK: t.nuptk || '-',
      Jabatan: t.jabatan,
      'Status Kepegawaian': t.statusKepegawaian,
      Golongan: t.golongan || '-',
      'No HP': t.noHp || '-',
      Email: t.email || '-',
      'Status Aktif': t.statusAktif ? 'Aktif' : 'Non-Aktif'
    })),
    ...payload.staff.map((st, i) => ({
      No: payload.teachers.length + i + 1,
      Peran: 'Tenaga Kependidikan (TU)',
      'Nama Lengkap': st.nama,
      Gelar: '-',
      NIP: st.nip || '-',
      NUPTK: '-',
      Jabatan: st.tugas,
      'Status Kepegawaian': st.statusKepegawaian,
      Golongan: '-',
      'No HP': st.noHp || '-',
      Email: '-',
      'Status Aktif': st.statusAktif ? 'Aktif' : 'Non-Aktif'
    }))
  ];
  const wsGtk = XLSX.utils.json_to_sheet(gtkRows);
  XLSX.utils.book_append_sheet(wb, wsGtk, 'Guru & Kepegawaian');

  // 5. Pembagian Jam Mengajar
  const hoursRows = payload.teachingHours.map((h, i) => {
    const guru = payload.teachers.find(t => t.id === h.guruId)?.nama || h.guruId;
    const cls = payload.classes.find(c => c.id === h.kelasId)?.nama || h.kelasId;
    return {
      No: i + 1,
      'Nama Guru': guru,
      'Mata Pelajaran': h.mataPelajaran,
      Kelas: cls,
      'Jumlah Jam Pelajaran (JP)': h.jumlahJP,
      Hari: h.hari || '-',
      'Jam Mulai': h.jamMulai || '-',
      'Jam Selesai': h.jamSelesai || '-'
    };
  });
  const wsHours = XLSX.utils.json_to_sheet(hoursRows);
  XLSX.utils.book_append_sheet(wb, wsHours, 'Jam Mengajar');

  // 6. Presensi Harian Siswa
  const attRows = payload.attendanceRecords.map((a, i) => {
    const cls = payload.classes.find(c => c.id === a.kelasId)?.nama || a.kelasId;
    const pct = a.totalSiswa > 0 ? Math.round((a.hadir / a.totalSiswa) * 100) : 0;
    return {
      No: i + 1,
      Tanggal: a.tanggal,
      Bulan: a.bulan,
      Kelas: cls,
      'Total Siswa': a.totalSiswa,
      Hadir: a.hadir,
      Sakit: a.sakit,
      Izin: a.izin,
      Alpa: a.alpa,
      '% Kehadiran': `${pct}%`,
      Catatan: a.catatan || '-'
    };
  });
  const wsAtt = XLSX.utils.json_to_sheet(attRows);
  XLSX.utils.book_append_sheet(wb, wsAtt, 'Presensi Harian');

  // 7. Rapot Kinerja Guru
  const reportRows = payload.teacherReportCards.map((rc, i) => {
    const guru = payload.teachers.find(t => t.id === rc.guruId)?.nama || rc.guruId;
    return {
      No: i + 1,
      'Nama Guru': guru,
      'Tahun Ajaran': rc.tahunAjaran,
      Semester: rc.semester,
      'Predikat Kinerja': rc.predikatKinerja,
      'Skor Akhir': rc.nilaiSkorAkhir,
      'Catatan Kepala Sekolah': rc.catatanKepalaSekolah,
      'Rekomendasi Kepala Sekolah': rc.rekomendasiKepalaSekolah,
      'Tanggal Penetapan': rc.tanggalPenetapan
    };
  });
  const wsReports = XLSX.utils.json_to_sheet(reportRows);
  XLSX.utils.book_append_sheet(wb, wsReports, 'Rapot Kinerja Guru');

  XLSX.writeFile(wb, `Master_Arsip_SIAKAD_SDN_Nambo_03_TA_2026_2027.xlsx`);
}

