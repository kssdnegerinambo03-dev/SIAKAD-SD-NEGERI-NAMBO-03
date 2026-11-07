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
    { No: 1, NIP: '197405102008012007', NUPTK: '1234567890123451', 'Nama Lengkap': 'Nurhaeni, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 1A', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'IV/a', 'Nomor HP': '081289001101', Email: 'nurhaeni@sdnnambo03.sch.id' },
    { No: 2, NIP: '198506122010012015', NUPTK: '2345678901234562', 'Nama Lengkap': 'Pertiwi, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 1B', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'III/c', 'Nomor HP': '081289001102', Email: 'pertiwi@sdnnambo03.sch.id' },
    { No: 3, NIP: '198903152014022003', NUPTK: '3456789012345673', 'Nama Lengkap': 'Fadillah, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 2A & 2B', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'III/b', 'Nomor HP': '081289001103', Email: 'fadillah@sdnnambo03.sch.id' },
    { No: 4, NIP: '199208242020122011', NUPTK: '4567890123456784', 'Nama Lengkap': 'Resta Putriandari, S.M.', Gelar: 'S.M.', Jabatan: 'Guru Kelas 3A & 3B', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PPPK', Golongan: 'IX', 'Nomor HP': '085789001104', Email: 'resta.putriandari@sdnnambo03.sch.id' },
    { No: 5, NIP: '198004182006041009', NUPTK: '5678901234567895', 'Nama Lengkap': 'Asim, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 4A', 'Jenis Kelamin (L/P)': 'L', 'Status Kepegawaian': 'PNS', Golongan: 'IV/a', 'Nomor HP': '081389001105', Email: 'asim@sdnnambo03.sch.id' },
    { No: 6, NIP: '199510102022212005', NUPTK: '6789012345678906', 'Nama Lengkap': 'Amelia Agustina, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 4B / Kelas 4A', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PPPK', Golongan: 'IX', 'Nomor HP': '081989001106', Email: 'amelia.agustina@sdnnambo03.sch.id' },
    { No: 7, NIP: '198711032015032004', NUPTK: '7890123456789017', 'Nama Lengkap': 'Dian Purnamasari, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 5A', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'III/c', 'Nomor HP': '087889001107', Email: 'dian.purnamasari@sdnnambo03.sch.id' },
    { No: 8, NIP: '199009142019032014', NUPTK: '8901234567890128', 'Nama Lengkap': 'Siti Rohimah, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 5B', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'III/b', 'Nomor HP': '081189001108', Email: 'siti.rohimah@sdnnambo03.sch.id' },
    { No: 9, NIP: '197607212005012008', NUPTK: '9012345678901239', 'Nama Lengkap': 'Nining Sariningsih, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 6A', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'IV/a', 'Nomor HP': '085689001109', Email: 'nining.sariningsih@sdnnambo03.sch.id' },
    { No: 10, NIP: '198812052011012019', NUPTK: '0123456789012340', 'Nama Lengkap': 'Anggun Nastiti, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Kelas 6B', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PNS', Golongan: 'III/c', 'Nomor HP': '081289001110', Email: 'anggun.nastiti@sdnnambo03.sch.id' },
    { No: 11, NIP: '199101152020122018', NUPTK: '1122334455667781', 'Nama Lengkap': 'Siti Mu\'arifah, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru PAI & BP (Semua Kelas)', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PPPK', Golongan: 'IX', 'Nomor HP': '081389001111', Email: 'siti.muarifah@sdnnambo03.sch.id' },
    { No: 12, NIP: '199304122022211006', NUPTK: '2233445566778892', 'Nama Lengkap': 'Age Prasetia, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru PJOK (Semua Kelas)', 'Jenis Kelamin (L/P)': 'L', 'Status Kepegawaian': 'PPPK', Golongan: 'IX', 'Nomor HP': '081989001112', Email: 'age.prasetia@sdnnambo03.sch.id' },
    { No: 13, NIP: '-', NUPTK: '3344556677889903', 'Nama Lengkap': 'Putri, S.Pd.', Gelar: 'S.Pd.', Jabatan: 'Guru Bahasa Inggris (Semua Kelas)', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'Honorer / GTT', Golongan: '-', 'Nomor HP': '085789001113', Email: 'putri@sdnnambo03.sch.id' },
    { No: 14, NIP: '199203102022212017', NUPTK: '4455667788990014', 'Nama Lengkap': 'Nurvi Latifah', Gelar: '-', Jabatan: 'Tendik / Pengadministrasi TU & Dapodik', 'Jenis Kelamin (L/P)': 'P', 'Status Kepegawaian': 'PPPK', Golongan: 'VII', 'Nomor HP': '081289001114', Email: 'nurvi.latifah@sdnnambo03.sch.id' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Guru_SDN_Nambo_03', 'Data Guru');
}

export function downloadTemplateKepegawaian() {
  const dummyData = [
    { No: 1, NIK: '3201245503920005', NIP: '199203102022212017', 'Nama Lengkap': 'Nurvi Latifah', Tugas: 'Tenaga Administrasi Sekolah / Operator Dapodik & TU', 'Status Kepegawaian': 'PPPK', Pendidikan: 'D3 Administrasi', 'Nomor HP': '081289001114' },
    { No: 2, NIK: '3201244408850007', NIP: '-', 'Nama Lengkap': 'Agustini Yusnalillah', Tugas: 'Petugas Kebersihan', 'Status Kepegawaian': 'PTT / Tenaga Kontrak', Pendidikan: 'SMA', 'Nomor HP': '085712000606' },
    { No: 3, NIK: '3201241005780009', NIP: '-', 'Nama Lengkap': 'Minan', Tugas: 'Penjaga Sekolah & Petugas Keamanan', 'Status Kepegawaian': 'PTT / Tenaga Kontrak', Pendidikan: 'SMP', 'Nomor HP': '087812000404' }
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
    {
      No: 1,
      'Nama Guru': 'Nurhaeni, S.Pd.',
      Indikator: 'Penerapan Disiplin Positif',
      'Target Perilaku (Perencanaan)': 'Guru mengajak peserta didik menyepakati aturan dan konsekuensi positif secara partisipatif di awal tema.',
      'Upaya Mempelajari': 'Mempelajari modul Pelatihan Mandiri PMM Topik Disiplin Positif dan panduan restitusi fase A.',
      'Jadwal Rencana Observasi': '2026-09-15',
      'Waktu Rencana': '08.00 - 09.30 WIB',
      'Status Observasi (Sudah/Belum)': 'Sudah',
      'Tanggal Observasi (YYYY-MM-DD)': '2026-09-15',
      'Rating Observasi (Pelaksanaan)': 'Dilakukan dan Efektif',
      'Fokus Pengamatan': 'Mendengarkan pandangan setiap siswa, tidak menggunakan hukuman fisik/verbal, nada suara tenang.',
      'Catatan Observasi Kepala Sekolah': 'Sangat baik, guru menerapkan kesepakatan kelas dengan bahasa afirmatif dan ramah anak.',
      'Refleksi Guru (Umpan Balik)': 'Sebagian siswa pemalu mulai berani bersuara dan antusias.',
      'Umpan Balik Kepala Sekolah': 'Pertahankan pendekatan humanis ini dan bagikan praktik baik pada rapat KKG mini sekolah.',
      'Rencana Tindak Lanjut': 'Mengikuti Webinar PMM Komunitas Belajar tentang Pendekatan Restitusi pada Fase A.',
      'Skor Akhir': 100
    },
    {
      No: 2,
      'Nama Guru': 'Asim, S.Pd.',
      Indikator: 'Keteraturan Suasana Kelas',
      'Target Perilaku (Perencanaan)': 'Guru memberikan instruksi yang terstruktur dan menggunakan sinyal transisi yang jelas.',
      'Upaya Mempelajari': 'Mengunduh panduan manajemen kelas interaktif dan berdiskusi dengan rekan sejawat.',
      'Jadwal Rencana Observasi': '2026-09-22',
      'Waktu Rencana': '09.30 - 11.00 WIB',
      'Status Observasi (Sudah/Belum)': 'Sudah',
      'Tanggal Observasi (YYYY-MM-DD)': '2026-09-22',
      'Rating Observasi (Pelaksanaan)': 'Dilakukan dan Efektif',
      'Fokus Pengamatan': 'Alur percobaan sains terkoordinasi dengan baik. LKPD dimengerti seluruh kelompok.',
      'Catatan Observasi Kepala Sekolah': 'Suasana kelas kondusif, siswa antusias berkolaborasi dalam kelompok IPAS.',
      'Refleksi Guru (Umpan Balik)': 'Eksperimen berjalan lancar, presentasi hasil kelompok berjalan optimal.',
      'Umpan Balik Kepala Sekolah': 'Metode eksperimen tepat sasaran. Pertimbangkan pemanfaatan Chromebook untuk merekam data.',
      'Rencana Tindak Lanjut': 'Menyusun rubrik presentasi kelompok interaktif berbasis rubrik analitik.',
      'Skor Akhir': 100
    },
    {
      No: 3,
      'Nama Guru': 'Age Prasetia, S.Pd.',
      Indikator: 'Aktivitas Interaktif',
      'Target Perilaku (Perencanaan)': 'Guru memfasilitasi kegiatan belajar yang memberi peran setara pada semua peserta didik.',
      'Upaya Mempelajari': 'Mempelajari asesmen gerak adaptif dan modifikasi permainan tradisional.',
      'Jadwal Rencana Observasi': '2026-10-20',
      'Waktu Rencana': '07.00 - 08.30 WIB',
      'Status Observasi (Sudah/Belum)': 'Belum',
      'Tanggal Observasi (YYYY-MM-DD)': '',
      'Rating Observasi (Pelaksanaan)': 'Belum Dilakukan',
      'Fokus Pengamatan': 'Observasi lapangan terjadwal di pekan ke-3 Oktober 2026.',
      'Catatan Observasi Kepala Sekolah': 'Jadwal observasi tanggal 20 Oktober 2026.',
      'Refleksi Guru (Umpan Balik)': 'Modul ajar dan perlengkapan sarana sudah disiapkan lengkap.',
      'Umpan Balik Kepala Sekolah': 'Siapkan instrumen asesmen unjuk kerja siswa sebelum observasi.',
      'Rencana Tindak Lanjut': 'Pelaksanaan observasi sesuai kalender pembelajaran PJOK.',
      'Skor Akhir': 0
    }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Praktik_Kinerja_Lengkap_SDN_Nambo_03', 'Praktik Kinerja');
}

export function downloadTemplateBerAKHLAK() {
  const dummyData = [
    { No: 1, 'Nama Guru': 'Nurhaeni, S.Pd.', 'Berorientasi Pelayanan': 'Menyapa siswa ramah dan memberikan informasi perkembangan anak ke orang tua secara berkala.', Akuntabel: 'Menggunakan sarana sekolah secara bertanggung jawab dan hadir tepat waktu.', Kompeten: 'Terus meningkatkan kompetensi pedagogik melalui webinar Kemendikbud.', Harmonis: 'Membangun suasana kekeluargaan di ruang guru dan kelas.', Loyal: 'Menjaga rahasia jabatan dan nama baik instansi SDN Nambo 03.', Adaptif: 'Cepat menyesuaikan dengan aplikasi asesmen digital terkini.', Kolaboratif: 'Bekerja sama dengan paguyuban kelas untuk kemajuan kelas 1A.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 2, 'Nama Guru': 'Pertiwi, S.Pd.', 'Berorientasi Pelayanan': 'Selalu menyambut kedatangan siswa di pintu kelas dengan senyum.', Akuntabel: 'Mengisi jurnal kelas dan absensi harian secara teliti.', Kompeten: 'Aktif dalam kegiatan KKG gugus kecamatan Klapanunggal.', Harmonis: 'Membantu rekan guru yang sedang mengalami kendala.', Loyal: 'Mendukung penuh visi misi Kepala Sekolah.', Adaptif: 'Menerapkan media lagu edukasi untuk materi tematik.', Kolaboratif: 'Aktif dalam kepanitiaan pentas seni sekolah.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 3, 'Nama Guru': 'Fadillah, S.Pd.', 'Berorientasi Pelayanan': 'Tanggap menangani kebutuhan belajar peserta didik di kelas 2A dan 2B.', Akuntabel: 'Disiplin mengelola perangkat ajar dan penilaian.', Kompeten: 'Mengikuti pelatihan kurikulum paradigma baru.', Harmonis: 'Menjaga tutur kata santun kepada sesama guru dan warga sekolah.', Loyal: 'Menjaga integritas guru.', Adaptif: 'Membuat pojok baca kreatif di kelas.', Kolaboratif: 'Berkoordinasi dengan tenaga kebersihan untuk kerapian kelas.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 4, 'Nama Guru': 'Resta Putriandari, S.M.', 'Berorientasi Pelayanan': 'Memberikan layanan konsultasi belajar ramah bagi wali murid kelas 3A dan 3B.', Akuntabel: 'Mengelola buku administrasi kelas secara tertib.', Kompeten: 'Berbagi praktik baik metode interaktif di KKG.', Harmonis: 'Menghormati perbedaan karakter siswa.', Loyal: 'Mengutamakan kepentingan peserta didik.', Adaptif: 'Mengadaptasi modul ajar dari PMM.', Kolaboratif: 'Bekerja sama dalam kegiatan pembiasaan positif sekolah.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 5, 'Nama Guru': 'Asim, S.Pd.', 'Berorientasi Pelayanan': 'Melayani kebutuhan belajar siswa dengan sabar dan responsif.', Akuntabel: 'Menyusun perangkat ajar tepat waktu dan transparan.', Kompeten: 'Menguasai materi IPAS dan kurikulum merdeka.', Harmonis: 'Menghargai perbedaan pendapat dalam rapat dewan guru.', Loyal: 'Siap menjalankan tugas kedinasan di luar jam sekolah jika diperlukan.', Adaptif: 'Memanfaatkan proyektor interaktif dan modul ajar digital.', Kolaboratif: 'Bermitra dengan tim Adiwiyata dalam penghijauan sekolah.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 6, 'Nama Guru': 'Amelia Agustina, S.Pd.', 'Berorientasi Pelayanan': 'Mendengarkan kesulitan belajar anak dengan penuh empati.', Akuntabel: 'Menyelesaikan laporan hasil belajar tepat jadwal.', Kompeten: 'Kreatif membuat lembar kerja peserta didik berbasis pemecahan masalah.', Harmonis: 'Menciptakan iklim kelas yang inklusif dan menyenangkan.', Loyal: 'Disiplin mentaati tata tertib dinas pendidikan.', Adaptif: 'Memanfaatkan media video animasi pembelajaran.', Kolaboratif: 'Aktif berdiskusi kurikulum dengan sesama rekan guru.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 7, 'Nama Guru': 'Dian Purnamasari, S.Pd.', 'Berorientasi Pelayanan': 'Memberikan bimbingan kepemimpinan dan karakter bagi siswa kelas 5A.', Akuntabel: 'Mengelola administrasi absensi dan nilai siswa dengan transparan.', Kompeten: 'Menguasai kurikulum dan aktif mengembangkan inovasi belajar.', Harmonis: 'Memupuk kerukunan warga sekolah.', Loyal: 'Berkomitmen tinggi terhadap kemajuan mutu pendidikan SDN Nambo 03.', Adaptif: 'Mendorong pemanfaatan media digital di kelas.', Kolaboratif: 'Mengkoordinir pembinaan Dokter Kecil & UKS.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 8, 'Nama Guru': 'Siti Rohimah, S.Pd.', 'Berorientasi Pelayanan': 'Memberikan bimbingan belajar remedial ramah bagi murid kelas 5B.', Akuntabel: 'Tepat waktu hadir dan akuntabel dalam evaluasi hasil belajar.', Kompeten: 'Mampu menyusun modul dan rubrik asesmen berkualitas.', Harmonis: 'Mendukung suasana belajar yang hangat dan ramah anak.', Loyal: 'Mengabdi dengan penuh dedikasi.', Adaptif: 'Menggunakan game edukatif interaktif.', Kolaboratif: 'Berkoordinasi dengan orang tua murid secara intensif.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 9, 'Nama Guru': 'Nining Sariningsih, S.Pd.', 'Berorientasi Pelayanan': 'Memberikan pendampingan intensif persiapan kelulusan siswa kelas 6A.', Akuntabel: 'Melakukan penilaian secara objektif dan akuntabel.', Kompeten: 'Mampu menyusun soal Asesmen Standar Pendidikan dengan baik.', Harmonis: 'Mendukung suasana belajar yang tenang dan fokus.', Loyal: 'Mengabdi dengan penuh dedikasi tinggi.', Adaptif: 'Menggunakan bank soal daring dan media kuis digital.', Kolaboratif: 'Membina Klub Sains & Olimpiade Matematika.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 10, 'Nama Guru': 'Anggun Nastiti, S.Pd.', 'Berorientasi Pelayanan': 'Membimbing siswa kelas 6B dengan teliti dan penuh kehangatan.', Akuntabel: 'Disiplin mengelola jurnal dan asesmen akhir.', Kompeten: 'Terampil mengintegrasikan literasi numerasi dalam pembelajaran.', Harmonis: 'Menjalin keakraban dengan seluruh rekan guru dan murid.', Loyal: 'Berintegritas tinggi menjaga marwah sekolah.', Adaptif: 'Cepat menyesuaikan media pembelajaran terbaru.', Kolaboratif: 'Bersinergi dengan seluruh guru kelas paralel.', Evaluasi: 'Memenuhi Ekspektasi' },
    { No: 11, 'Nama Guru': 'Siti Mu’arifah, S.Pd.', 'Berorientasi Pelayanan': 'Membimbing rohani dan akhlak mulia seluruh peserta didik SDN Nambo 03.', Akuntabel: 'Menyelenggarakan kegiatan keagamaan secara amanah.', Kompeten: 'Mumpuni dalam ilmu fiqih anak dan tahsin Al-Quran.', Harmonis: 'Mengajarkan moderasi beragama dan toleransi sejak dini.', Loyal: 'Setia membela Pancasila dan NKRI.', Adaptif: 'Menggunakan media audio tilawah interaktif di kelas.', Kolaboratif: 'Membina ekstrakurikuler Marawis & Qasidah.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 12, 'Nama Guru': 'Age Prasetia, S.Pd.', 'Berorientasi Pelayanan': 'Melatih kebugaran fisik dan sportivitas peserta didik dengan sabar.', Akuntabel: 'Merawat sarana dan prasarana olahraga sekolah dengan tertib.', Kompeten: 'Memiliki kompetensi kepelatihan olahraga dan kepanduan Pramuka.', Harmonis: 'Menjalin keakraban dengan seluruh murid dan guru.', Loyal: 'Siap mendampingi siswa dalam kejuaraan O2SN.', Adaptif: 'Memodifikasi alat olahraga dari bahan ramah lingkungan.', Kolaboratif: 'Memimpin Gugus Depan Pramuka dan Futsal.', Evaluasi: 'Di Atas Ekspektasi' },
    { No: 13, 'Nama Guru': 'Putri, S.Pd.', 'Berorientasi Pelayanan': 'Mengajarkan Bahasa Inggris komunikatif dengan gembira dan ramah anak.', Akuntabel: 'Menyiapkan materi dan lembar aktivitas siswa secara teratur.', Kompeten: 'Fasih dan terampil metode pengajaran bahasa asing anak.', Harmonis: 'Menciptakan suasana kelas yang menyenangkan tanpa rasa takut.', Loyal: 'Mendukung program internasionalisasi dasar sekolah.', Adaptif: 'Menggunakan lagu dan flashcard interaktif.', Kolaboratif: 'Berkolaborasi dengan guru kelas untuk pengayaan kosakata.', Evaluasi: 'Memenuhi Ekspektasi' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Perilaku_BerAKHLAK_Guru_SDN_Nambo_03', 'Perilaku BerAKHLAK');
}

export function downloadTemplateTugasTambahan() {
  const dummyData = [
    { No: 1, 'Nama Guru': 'Nurhaeni, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 1A', 'Refleksi Pelaksanaan': 'Melaksanakan pendampingan adaptasi siswa baru, mengatur ruang kelas yang nyaman, serta memfasilitasi komunikasi mingguan paguyuban orang tua.', 'Bukti Dukung': 'SK Pembagian Tugas No. 421.2/015/SDN-N03/VII/2026', Status: 'Selesai' },
    { No: 2, 'Nama Guru': 'Pertiwi, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 1B', 'Refleksi Pelaksanaan': 'Melakukan pemetaan awal literasi dan numerasi siswa kelas 1B.', 'Bukti Dukung': 'Buku Administrasi Wali Kelas 1B', Status: 'Selesai' },
    { No: 3, 'Nama Guru': 'Fadillah, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 2A & 2B', 'Refleksi Pelaksanaan': 'Membina kedisiplinan dan menjaga ketertiban siswa fase A.', 'Bukti Dukung': 'Buku Jurnal Guru Kelas 2', Status: 'Selesai' },
    { No: 4, 'Nama Guru': 'Resta Putriandari, S.M.', 'Nama Tugas Tambahan': 'Wali Kelas 3A & 3B, Pembina Tari', 'Refleksi Pelaksanaan': 'Melatih tari Jaipong Sunda dan mengelola kelas 3.', 'Bukti Dukung': 'Jadwal Ekstrakurikuler Seni Tari & SK', Status: 'Selesai' },
    { No: 5, 'Nama Guru': 'Asim, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 4A & Koordinator Adiwiyata', 'Refleksi Pelaksanaan': 'Membina kelas 4A dan menggerakkan program pemilahan sampah sekolah.', 'Bukti Dukung': 'SK Tim Adiwiyata No. 421.2/020/SDN-N03/2026', Status: 'Selesai' },
    { No: 6, 'Nama Guru': 'Amelia Agustina, S.Pd.', 'Nama Tugas Tambahan': 'Guru Kelas 4B', 'Refleksi Pelaksanaan': 'Menyelenggarakan pembelajaran IPAS berbasis inkuiri di kelas 4B.', 'Bukti Dukung': 'Buku Agenda Pembelajaran Kelas 4B', Status: 'Selesai' },
    { No: 7, 'Nama Guru': 'Dian Purnamasari, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 5A & Pembina UKS', 'Refleksi Pelaksanaan': 'Membina UKS, pemeriksaan berkala siswa, dan pengelolaan kelas 5A.', 'Bukti Dukung': 'Buku Catatan Kesehatan UKS & SK Tugas', Status: 'Selesai' },
    { No: 8, 'Nama Guru': 'Siti Rohimah, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 5B', 'Refleksi Pelaksanaan': 'Mengelola pembelajaran diferensiasi dan pembiasaan literasi kelas 5B.', 'Bukti Dukung': 'Buku Administrasi Wali Kelas 5B', Status: 'Selesai' },
    { No: 9, 'Nama Guru': 'Nining Sariningsih, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 6A & Pembina OSN Sains', 'Refleksi Pelaksanaan': 'Mendampingi persiapan kelulusan siswa kelas 6 serta pembinaan olimpiade sains.', 'Bukti Dukung': 'Buku Rekap Perkembangan Siswa Kelas 6A', Status: 'Selesai' },
    { No: 10, 'Nama Guru': 'Anggun Nastiti, S.Pd.', 'Nama Tugas Tambahan': 'Wali Kelas 6B', 'Refleksi Pelaksanaan': 'Mengkoordinasikan persiapan asesmen kelulusan kelas 6B.', 'Bukti Dukung': 'Buku Administrasi Wali Kelas 6B', Status: 'Selesai' },
    { No: 11, 'Nama Guru': 'Siti Mu’arifah, S.Pd.', 'Nama Tugas Tambahan': 'Pembina Rohani Islam & Marawis', 'Refleksi Pelaksanaan': 'Membimbing ekstrakurikuler marawis dan memimpin sholat dhuha serta kegiatan keagamaan.', 'Bukti Dukung': 'Jadwal Pembiasaan Rohis & Foto Kegiatan', Status: 'Selesai' },
    { No: 12, 'Nama Guru': 'Age Prasetia, S.Pd.', 'Nama Tugas Tambahan': 'Pembina Pramuka Gugus Depan & Futsal', 'Refleksi Pelaksanaan': 'Melaksanakan latihan rutin kepramukaan setiap Jumat dan pembinaan atletik futsal.', 'Bukti Dukung': 'Program Kerja Gudep & Absensi Latihan', Status: 'Dalam Proses' },
    { No: 13, 'Nama Guru': 'Putri, S.Pd.', 'Nama Tugas Tambahan': 'Koordinator English Club', 'Refleksi Pelaksanaan': 'Mengadakan pembiasaan sapaan Bahasa Inggris sederhana bagi siswa sekolah.', 'Bukti Dukung': 'Jadwal English Corner SDN Nambo 03', Status: 'Selesai' }
  ];
  downloadWorkbook(dummyData, 'Template_Import_Tugas_Tambahan_Guru_SDN_Nambo_03', 'Tugas Tambahan');
}

export function downloadTemplateRapotKinerja() {
  const dummyData = [
    { No: 1, 'Nama Guru': 'Nurhaeni, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 96, 'Catatan Kepala Sekolah': 'Kepemimpinan pembelajaran sangat baik, adaptasi siswa kelas 1 berhasil optimal.', 'Rekomendasi Kepala Sekolah': 'Dipertahankan dan dibagikan sebagai praktik baik KKG.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 2, 'Nama Guru': 'Pertiwi, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 90, 'Catatan Kepala Sekolah': 'Pelaksanaan pembelajaran kelas 1B berjalan aktif dan tertib.', 'Rekomendasi Kepala Sekolah': 'Tingkatkan keterlibatan aktif seluruh siswa.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 3, 'Nama Guru': 'Fadillah, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 89, 'Catatan Kepala Sekolah': 'Disiplin dan bertanggung jawab terhadap tugas mengajar kelas 2A dan 2B.', 'Rekomendasi Kepala Sekolah': 'Lengkapi modul ajar berbasis pemecahan masalah.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 4, 'Nama Guru': 'Resta Putriandari, S.M.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 91, 'Catatan Kepala Sekolah': 'Pengelolaan kelas 3 dan pembinaan seni tari Sunda berjalan sangat harmonis.', 'Rekomendasi Kepala Sekolah': 'Pertahankan semangat pelestarian budaya.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 5, 'Nama Guru': 'Asim, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 95, 'Catatan Kepala Sekolah': 'Pengelolaan kelas 4A dan koordinasi Adiwiyata sangat berdedikasi tinggi.', 'Rekomendasi Kepala Sekolah': 'Lanjutkan keteladanan kepemimpinan lingkungan.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 6, 'Nama Guru': 'Amelia Agustina, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 90, 'Catatan Kepala Sekolah': 'Pembelajaran kelas 4B terlaksana dengan tertib dan interaktif.', 'Rekomendasi Kepala Sekolah': 'Perbanyak asesmen formatif unjuk kerja.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 7, 'Nama Guru': 'Dian Purnamasari, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 95, 'Catatan Kepala Sekolah': 'Inovatif dalam pembelajaran kelas 5A dan pelayanan kesehatan UKS.', 'Rekomendasi Kepala Sekolah': 'Pertahankan prestasi dan keteladanan.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 8, 'Nama Guru': 'Siti Rohimah, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 91, 'Catatan Kepala Sekolah': 'Pembelajaran kelas 5B terlaksana secara tertata dan komunikatif.', 'Rekomendasi Kepala Sekolah': 'Kembangkan ragam media ajar digital.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 9, 'Nama Guru': 'Nining Sariningsih, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 96, 'Catatan Kepala Sekolah': 'Pendampingan kelas 6A dan pembinaan olimpiade sains sangat optimal.', 'Rekomendasi Kepala Sekolah': 'Pertahankan dedikasi pembinaan prestasi siswa.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 10, 'Nama Guru': 'Anggun Nastiti, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 92, 'Catatan Kepala Sekolah': 'Pembelajaran kelas 6B kondusif dan persiapan ujian terkelola rapi.', 'Rekomendasi Kepala Sekolah': 'Lanjutkan penguatan literasi numerasi.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 11, 'Nama Guru': 'Siti Mu’arifah, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 95, 'Catatan Kepala Sekolah': 'Pembiasaan ibadah, sholat dhuha, dan budi pekerti sangat berkesan positif.', 'Rekomendasi Kepala Sekolah': 'Pertahankan keteladanan rohani di sekolah.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 12, 'Nama Guru': 'Age Prasetia, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Sangat Baik (Di Atas Ekspektasi)', 'Nilai Skor Akhir': 94, 'Catatan Kepala Sekolah': 'Pembinaan fisik olahraga PJOK dan Pramuka sangat antusias dan bersemangat.', 'Rekomendasi Kepala Sekolah': 'Lengkapi administrasi jurnal mingguan tepat waktu.', 'Tanggal Penetapan': '2026-12-15' },
    { No: 13, 'Nama Guru': 'Putri, S.Pd.', 'Tahun Ajaran': '2026-2027', 'Semester': 'Ganjil', 'Predikat Kinerja': 'Baik (Memenuhi Ekspektasi)', 'Nilai Skor Akhir': 90, 'Catatan Kepala Sekolah': 'Pengajaran Bahasa Inggris ramah anak dan membangkitkan rasa percaya diri.', 'Rekomendasi Kepala Sekolah': 'Kembangkan aktivitas percakapan interaktif.', 'Tanggal Penetapan': '2026-12-15' }
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

