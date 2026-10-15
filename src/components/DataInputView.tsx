import React, { useState } from 'react';
import {
  Layers,
  UserPlus,
  Briefcase,
  Users,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  School,
  FileSpreadsheet,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Religion, StudentStatus } from '../types';
import {
  downloadTemplateKelasEkskul,
  downloadTemplateSiswaReguler,
  downloadTemplateSiswaPindahan,
  downloadTemplateGuru,
  downloadTemplateKepegawaian,
  readExcelFile
} from '../utils/excelUtils';

type InputSubTab = 'kelas-ekskul' | 'siswa' | 'guru' | 'kepegawaian';

export const DataInputView: React.FC = () => {
  const {
    classes,
    addClass,
    importClasses,
    students,
    addStudent,
    importStudents,
    teachers,
    addTeacher,
    importTeachers,
    staff,
    addStaff,
    importStaff
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<InputSubTab>('siswa');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Class & Ekskul Form state
  const [classForm, setClassForm] = useState({
    nama: '',
    jenis: 'Utama' as 'Utama' | 'Ekskul',
    kapasitas: 32,
    deskripsi: '',
    hariLatihan: '',
    waktuLatihan: ''
  });

  // Student Form state
  const [isTransferStudent, setIsTransferStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({
    nisn: '',
    nis: '',
    nama: '',
    tempatLahir: 'Bogor',
    tanggalLahir: '2019-01-01',
    agama: 'Islam' as Religion,
    jenisKelamin: 'L' as 'L' | 'P',
    nik: '',
    alamat: '',
    tinggiBadan: '' as string | number,
    beratBadan: '' as string | number,
    kelasId: classes.filter(c => c.jenis === 'Utama')[0]?.id || '',
    // Transfer fields
    asalSekolah: '',
    tanggalPindah: new Date().toISOString().split('T')[0],
    nomorSurat: '',
    alasan: ''
  });

  // Teacher Form state
  const [teacherForm, setTeacherForm] = useState({
    nip: '',
    nuptk: '',
    nama: '',
    gelar: 'S.Pd.',
    jabatan: 'Guru Kelas',
    jenisKelamin: 'L' as 'L' | 'P',
    statusKepegawaian: 'PNS' as 'PNS' | 'PPPK' | 'Honorer / GTT',
    golongan: 'III/a',
    noHp: '',
    email: ''
  });

  // Staff Form state
  const [staffForm, setStaffForm] = useState({
    nik: '',
    nip: '',
    nama: '',
    tugas: 'Tenaga Administrasi Sekolah (TU)',
    statusKepegawaian: 'Honorer / PTT' as 'PNS' | 'PPPK' | 'Honorer / PTT',
    pendidikan: 'SMA/SMK',
    noHp: ''
  });

  const showFeedbackMsg = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 6000);
  };

  // Submit Class
  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.nama.trim()) {
      showFeedbackMsg('error', 'Nama kelas atau ekstrakurikuler wajib diisi.');
      return;
    }
    addClass({
      nama: classForm.nama.trim(),
      jenis: classForm.jenis,
      kapasitas: Number(classForm.kapasitas) || 32,
      deskripsi: classForm.deskripsi,
      hariLatihan: classForm.hariLatihan,
      waktuLatihan: classForm.waktuLatihan
    });
    setClassForm({
      nama: '',
      jenis: 'Utama',
      kapasitas: 32,
      deskripsi: '',
      hariLatihan: '',
      waktuLatihan: ''
    });
    showFeedbackMsg('success', 'Kelas / Ekstrakurikuler berhasil ditambahkan!');
  };

  // Submit Student (Strict NISN unique ID check)
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNisn = studentForm.nisn.trim();
    if (!cleanNisn) {
      showFeedbackMsg('error', 'NISN wajib diisi sebagai identitas tunggal siswa.');
      return;
    }
    if (!studentForm.nama.trim()) {
      showFeedbackMsg('error', 'Nama lengkap siswa wajib diisi.');
      return;
    }
    if (!studentForm.kelasId) {
      showFeedbackMsg('error', 'Silakan pilih kelas terlebih dahulu.');
      return;
    }

    const payload: any = {
      nisn: cleanNisn,
      nis: studentForm.nis.trim() || `${Math.floor(1000 + Math.random() * 9000)}`,
      nama: studentForm.nama.trim(),
      tempatLahir: studentForm.tempatLahir.trim(),
      tanggalLahir: studentForm.tanggalLahir,
      agama: studentForm.agama,
      jenisKelamin: studentForm.jenisKelamin,
      nik: studentForm.nik.trim() || `320124${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      alamat: studentForm.alamat.trim() || 'Desa Bantarjati RT 01/04 Klapanunggal',
      tinggiBadan: studentForm.tinggiBadan ? Number(studentForm.tinggiBadan) : undefined,
      beratBadan: studentForm.beratBadan ? Number(studentForm.beratBadan) : undefined,
      kelasId: studentForm.kelasId,
      status: (isTransferStudent ? 'Pindahan Masuk' : 'Aktif') as StudentStatus,
      isPIP: false,
      ekskulIds: ['e-pramuka'] // Ekskul diisi di Manajemen Kelas
    };

    if (isTransferStudent) {
      payload.transferInfo = {
        asalSekolah: studentForm.asalSekolah.trim() || 'Sekolah Asal',
        tanggalPindah: studentForm.tanggalPindah,
        nomorSurat: studentForm.nomorSurat.trim() || `421.2/PND-${Date.now().toString().slice(-4)}`,
        alasan: studentForm.alasan.trim() || 'Pindah domisili keluarga',
        kelasTujuanId: studentForm.kelasId
      };
    }

    const res = addStudent(payload);
    if (res.success) {
      showFeedbackMsg(
        'success',
        `Data siswa ${studentForm.nama} (${cleanNisn}) berhasil disimpan ke dalam sistem!`
      );
      // Reset form
      setStudentForm({
        nisn: '',
        nis: '',
        nama: '',
        tempatLahir: 'Bogor',
        tanggalLahir: '2019-01-01',
        agama: 'Islam',
        jenisKelamin: 'L',
        nik: '',
        alamat: '',
        tinggiBadan: '',
        beratBadan: '',
        kelasId: studentForm.kelasId,
        asalSekolah: '',
        tanggalPindah: new Date().toISOString().split('T')[0],
        nomorSurat: '',
        alasan: ''
      });
    }
  };

  // Submit Teacher
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.nama.trim()) {
      showFeedbackMsg('error', 'Nama guru wajib diisi.');
      return;
    }
    addTeacher({
      nip: teacherForm.nip.trim() || '-',
      nuptk: teacherForm.nuptk.trim(),
      nama: teacherForm.nama.trim(),
      gelar: teacherForm.gelar.trim(),
      jabatan: teacherForm.jabatan.trim(),
      jenisKelamin: teacherForm.jenisKelamin,
      statusKepegawaian: teacherForm.statusKepegawaian,
      golongan: teacherForm.golongan.trim() || '-',
      noHp: teacherForm.noHp.trim() || '081200000000',
      email: teacherForm.email.trim() || `${teacherForm.nama.toLowerCase().replace(/[^a-z]/g, '')}@sdnnambo03.sch.id`,
      statusAktif: true
    });
    setTeacherForm({
      nip: '',
      nuptk: '',
      nama: '',
      gelar: 'S.Pd.',
      jabatan: 'Guru Kelas',
      jenisKelamin: 'L',
      statusKepegawaian: 'PNS',
      golongan: 'III/a',
      noHp: '',
      email: ''
    });
    showFeedbackMsg('success', 'Data guru baru berhasil disimpan!');
  };

  // Submit Staff
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.nama.trim()) {
      showFeedbackMsg('error', 'Nama staf tata usaha wajib diisi.');
      return;
    }
    addStaff({
      nik: staffForm.nik.trim() || `320124${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      nip: staffForm.nip.trim() || '-',
      nama: staffForm.nama.trim(),
      tugas: staffForm.tugas.trim(),
      statusKepegawaian: staffForm.statusKepegawaian,
      pendidikan: staffForm.pendidikan.trim(),
      noHp: staffForm.noHp.trim() || '081200000000',
      statusAktif: true
    });
    setStaffForm({
      nik: '',
      nip: '',
      nama: '',
      tugas: 'Tenaga Administrasi Sekolah (TU)',
      statusKepegawaian: 'Honorer / PTT',
      pendidikan: 'SMA/SMK',
      noHp: ''
    });
    showFeedbackMsg('success', 'Data staf kepegawaian berhasil disimpan!');
  };

  // Generic Excel Import Handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'kelas' | 'siswa-reguler' | 'siswa-pindahan' | 'guru' | 'kepegawaian'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readExcelFile(file);
      if (!Array.isArray(data) || data.length === 0) {
        showFeedbackMsg('error', 'Berkas Excel kosong atau format tabel tidak terbaca.');
        return;
      }

      if (type === 'kelas') {
        const res = importClasses(data);
        showFeedbackMsg('success', `Berhasil mengimpor ${res.successCount} data kelas dan ekskul.`);
      } else if (type === 'siswa-reguler') {
        const res = importStudents(data, false);
        if (res.duplicateCount === 0) {
          showFeedbackMsg('success', `Berhasil mengimpor ${res.successCount} siswa reguler.`);
        }
      } else if (type === 'siswa-pindahan') {
        const res = importStudents(data, true);
        if (res.duplicateCount === 0) {
          showFeedbackMsg('success', `Berhasil mengimpor ${res.successCount} siswa baru pindahan.`);
        }
      } else if (type === 'guru') {
        const res = importTeachers(data);
        showFeedbackMsg('success', `Berhasil mengimpor ${res.successCount} data guru.`);
      } else if (type === 'kepegawaian') {
        const res = importStaff(data);
        showFeedbackMsg('success', `Berhasil mengimpor ${res.successCount} data staf kepegawaian.`);
      }
    } catch (err: any) {
      showFeedbackMsg('error', `Gagal membaca file Excel: ${err.message || 'Format tidak valid'}`);
    } finally {
      e.target.value = '';
    }
  };

  const mainClasses = classes.filter(c => c.jenis === 'Utama');

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Menu Input Data Master
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Formulir input manual & sistem import berkas Excel (.xlsx) dengan proteksi validasi NISN
          </p>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('siswa')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeSubTab === 'siswa'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Tab Input Siswa</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('kelas-ekskul')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeSubTab === 'kelas-ekskul'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tab Input Kelas & Ekskul</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {classes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('guru')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeSubTab === 'guru'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tab Input Guru</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {teachers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('kepegawaian')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeSubTab === 'kepegawaian'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Tab Input Kepegawaian (TU)</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {staff.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. TAB INPUT SISWA */}
      {/* ========================================================= */}
      {activeSubTab === 'siswa' && (
        <div className="space-y-6">
          {/* Action Header: Download Template & Import Excel */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Import Berkas Excel (.xlsx) Siswa
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Unduh template Excel berformat resmi dengan <strong>10 data contoh dummy</strong> untuk pengisian massal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={downloadTemplateSiswaReguler}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Template Siswa Reguler (10 Dummy)</span>
              </button>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Siswa Reguler</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handleFileUpload(e, 'siswa-reguler')}
                  className="hidden"
                />
              </label>

              <button
                onClick={downloadTemplateSiswaPindahan}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Download Template Pindahan (10 Dummy)</span>
              </button>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Pindahan</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handleFileUpload(e, 'siswa-pindahan')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Mode Selector: Siswa Baru Biasa vs Siswa Baru Pindahan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {isTransferStudent ? 'Formulir Input Siswa Baru Pindahan' : 'Formulir Input Siswa Baru Reguler'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isTransferStudent
                      ? 'Dilengkapi data asal sekolah, surat pindah, dan alasan mutasi masuk'
                      : 'Input identitas siswa reguler baru (NISN, NIS, NIK, dll)'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTransferStudent(false)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    !isTransferStudent
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Siswa Reguler
                </button>
                <button
                  type="button"
                  onClick={() => setIsTransferStudent(true)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isTransferStudent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Siswa Baru Pindahan
                </button>
              </div>
            </div>

            {/* NISN Unique Warning Notice */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Ketentuan NISN:</strong> NISN dijadikan sebagai ID unik utama. NISN tidak boleh ganda dalam sistem. Jika NISN yang diinput sudah terdaftar, sistem akan menolak dan menampilkan kotak dialog peringatan.
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* NISN (Strict Primary Key) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NISN (Nomor Induk Siswa Nasional) *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Contoh: 0192837401"
                    value={studentForm.nisn}
                    onChange={e => setStudentForm({ ...studentForm, nisn: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-slate-800"
                    required
                  />
                  <span className="text-[10px] text-slate-400">10 digit angka unik nasional</span>
                </div>

                {/* NIS */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIS (Nomor Induk Sekolah) *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 4015"
                    value={studentForm.nis}
                    onChange={e => setStudentForm({ ...studentForm, nis: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    placeholder="Nama sesuai akta kelahiran"
                    value={studentForm.nama}
                    onChange={e => setStudentForm({ ...studentForm, nama: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <select
                    value={studentForm.jenisKelamin}
                    onChange={e => setStudentForm({ ...studentForm, jenisKelamin: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                {/* Tempat Lahir */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir *</label>
                  <input
                    type="text"
                    value={studentForm.tempatLahir}
                    onChange={e => setStudentForm({ ...studentForm, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    value={studentForm.tanggalLahir}
                    onChange={e => setStudentForm({ ...studentForm, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Agama */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agama *</label>
                  <select
                    value={studentForm.agama}
                    onChange={e => setStudentForm({ ...studentForm, agama: e.target.value as Religion })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                {/* NIK */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK Siswa / KK</label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="320124xxxxxxxxxx"
                    value={studentForm.nik}
                    onChange={e => setStudentForm({ ...studentForm, nik: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                {/* Kelas Tujuan / Penempatan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTransferStudent ? 'Pilih Kelas Tujuan *' : 'Penempatan Rombel Kelas *'}
                  </label>
                  <select
                    value={studentForm.kelasId}
                    onChange={e => setStudentForm({ ...studentForm, kelasId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  >
                    {mainClasses.map(c => {
                      const countInClass = students.filter(
                        s => s.kelasId === c.id && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')
                      ).length;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.nama} {countInClass === 0 ? '(Status: Masih Kosong)' : `(${countInClass} siswa)`}
                        </option>
                      );
                    })}
                  </select>
                  <span className="text-[10px] text-slate-500">
                    Data kelas diambil otomatis dari Tab Input Kelas
                  </span>
                </div>

                {/* Tinggi Badan (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tinggi Badan (cm) <span className="font-normal text-slate-400">(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 120"
                    value={studentForm.tinggiBadan}
                    onChange={e => setStudentForm({ ...studentForm, tinggiBadan: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Berat Badan (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Berat Badan (kg) <span className="font-normal text-slate-400">(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 22"
                    value={studentForm.beratBadan}
                    onChange={e => setStudentForm({ ...studentForm, beratBadan: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Alamat */}
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Domisili Siswa</label>
                  <input
                    type="text"
                    placeholder="Kp. Bantarkopo RT 01/04"
                    value={studentForm.alamat}
                    onChange={e => setStudentForm({ ...studentForm, alamat: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Extra Transfer Fields */}
              {isTransferStudent && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Data Khusus Siswa Baru Pindahan</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Asal Sekolah *</label>
                      <input
                        type="text"
                        placeholder="Contoh: SDN Kranji 02 Bekasi"
                        value={studentForm.asalSekolah}
                        onChange={e => setStudentForm({ ...studentForm, asalSekolah: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-blue-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
                        required={isTransferStudent}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Pindah Masuk *</label>
                      <input
                        type="date"
                        value={studentForm.tanggalPindah}
                        onChange={e => setStudentForm({ ...studentForm, tanggalPindah: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-blue-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                        required={isTransferStudent}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat Pindah</label>
                      <input
                        type="text"
                        placeholder="421.2/045/SD-ASAL/2026"
                        value={studentForm.nomorSurat}
                        onChange={e => setStudentForm({ ...studentForm, nomorSurat: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-blue-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Kepindahan</label>
                      <input
                        type="text"
                        placeholder="Ikut kepindahan dinas orang tua"
                        value={studentForm.alasan}
                        onChange={e => setStudentForm({ ...studentForm, alasan: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-blue-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 italic">
                  * Catatan: Data ekstrakurikuler siswa tidak diisi di sini, melainkan diatur pada Menu Manajemen Kelas. Hapus siswa juga hanya dapat dilakukan pada Menu Manajemen Kelas.
                </span>

                <button
                  type="submit"
                  className={`px-6 py-2.5 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isTransferStudent
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{isTransferStudent ? 'Simpan Siswa Pindahan' : 'Simpan Data Siswa Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TAB INPUT KELAS DAN EKSKUL */}
      {/* ========================================================= */}
      {activeSubTab === 'kelas-ekskul' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Import Berkas Excel Kelas & Ekstrakurikuler
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Tersedia 2 jenis kelas: <strong>Kelas Utama</strong> dan <strong>Ekskul</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={downloadTemplateKelasEkskul}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Template Kelas & Ekskul (10 Dummy)</span>
              </button>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Kelas/Ekskul</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handleFileUpload(e, 'kelas')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Input */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Input Manual Rombel / Ekskul</h3>
              </div>

              <form onSubmit={handleClassSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenis Rombel / Kegiatan *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setClassForm({ ...classForm, jenis: 'Utama' })}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                        classForm.jenis === 'Utama'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Kelas Utama
                    </button>
                    <button
                      type="button"
                      onClick={() => setClassForm({ ...classForm, jenis: 'Ekskul' })}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                        classForm.jenis === 'Ekskul'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Ekstrakurikuler
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama {classForm.jenis === 'Utama' ? 'Kelas' : 'Ekstrakurikuler'} *
                  </label>
                  <input
                    type="text"
                    placeholder={classForm.jenis === 'Utama' ? 'Contoh: Kelas 1A' : 'Contoh: Tari Tradisional Sunda'}
                    value={classForm.nama}
                    onChange={e => setClassForm({ ...classForm, nama: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kapasitas Maksimal (Siswa)
                  </label>
                  <input
                    type="number"
                    value={classForm.kapasitas}
                    onChange={e => setClassForm({ ...classForm, kapasitas: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                {classForm.jenis === 'Ekskul' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hari Latihan</label>
                      <input
                        type="text"
                        placeholder="Contoh: Setiap Jumat"
                        value={classForm.hariLatihan}
                        onChange={e => setClassForm({ ...classForm, hariLatihan: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Latihan</label>
                      <input
                        type="text"
                        placeholder="Contoh: 14.00 - 16.00 WIB"
                        value={classForm.waktuLatihan}
                        onChange={e => setClassForm({ ...classForm, waktuLatihan: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Deskripsi</label>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi singkat kurikulum atau kegiatan"
                    value={classForm.deskripsi}
                    onChange={e => setClassForm({ ...classForm, deskripsi: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan {classForm.jenis}</span>
                </button>
              </form>
            </div>

            {/* List of Registered Classes & Ekskul */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">
                  Daftar Kelas & Ekstrakurikuler Terdaftar
                </h3>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {classes.length} Total
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {classes.map(c => {
                  const studentCount = students.filter(
                    s => s.kelasId === c.id && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')
                  ).length;
                  const isMain = c.jenis === 'Utama';

                  return (
                    <div
                      key={c.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isMain
                          ? 'bg-slate-50 border-slate-200/90 hover:border-emerald-300'
                          : 'bg-blue-50/50 border-blue-200/80 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 text-sm truncate">{c.nama}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isMain
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {c.jenis}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Status Siswa:</span>
                          {studentCount === 0 ? (
                            <span className="font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-sm border border-amber-200">
                              Masih Kosong
                            </span>
                          ) : (
                            <span className="font-bold text-slate-800 font-mono">
                              {studentCount} Siswa
                            </span>
                          )}
                        </div>
                        {c.deskripsi && (
                          <div className="text-[11px] text-slate-500 italic truncate">{c.deskripsi}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TAB INPUT GURU */}
      {/* ========================================================= */}
      {activeSubTab === 'guru' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Import Berkas Excel Data Guru
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Unduh template Excel berformat resmi dengan <strong>10 data contoh dummy</strong> untuk input guru.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={downloadTemplateGuru}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Template Guru (10 Dummy)</span>
              </button>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Guru</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handleFileUpload(e, 'guru')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Guru */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Input Manual Tenaga Pendidik (Guru)</h3>
                <p className="text-xs text-slate-500">
                  Data ini akan terhubung langsung ke penugasan Wali Kelas, Pembina Ekskul, dan Jam Mengajar
                </p>
              </div>
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Guru *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Hj. Siti Rohmah"
                    value={teacherForm.nama}
                    onChange={e => setTeacherForm({ ...teacherForm, nama: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gelar Akademik</label>
                  <input
                    type="text"
                    placeholder="Contoh: S.Pd.SD, M.Pd."
                    value={teacherForm.gelar}
                    onChange={e => setTeacherForm({ ...teacherForm, gelar: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    placeholder="1980xxxxxx (atau - jika non-NIP)"
                    value={teacherForm.nip}
                    onChange={e => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    placeholder="16 digit NUPTK Kemendikbud"
                    value={teacherForm.nuptk}
                    onChange={e => setTeacherForm({ ...teacherForm, nuptk: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={teacherForm.jenisKelamin}
                    onChange={e => setTeacherForm({ ...teacherForm, jenisKelamin: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kepegawaian *</label>
                  <select
                    value={teacherForm.statusKepegawaian}
                    onChange={e => setTeacherForm({ ...teacherForm, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (Pegawai Pemerintah dg Perjanjian Kerja)</option>
                    <option value="Honorer / GTT">Honorer / Guru Tidak Tetap (GTT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    placeholder="Contoh: IV/a, III/c, IX, atau -"
                    value={teacherForm.golongan}
                    onChange={e => setTeacherForm({ ...teacherForm, golongan: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Mapel Diampu</label>
                  <input
                    type="text"
                    placeholder="Contoh: Guru Kelas 1 / Guru PJOK"
                    value={teacherForm.jabatan}
                    onChange={e => setTeacherForm({ ...teacherForm, jabatan: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    value={teacherForm.noHp}
                    onChange={e => setTeacherForm({ ...teacherForm, noHp: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi / Akun Belajar.id</label>
                  <input
                    type="email"
                    placeholder="nama@guru.sd.belajar.id"
                    value={teacherForm.email}
                    onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Data Guru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TAB INPUT KEPEGAWAIAN (SELAIN GURU / TU) */}
      {/* ========================================================= */}
      {activeSubTab === 'kepegawaian' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Import Berkas Excel Tenaga Kependidikan (TU)
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Khusus staf selain guru: Kepala TU, Bendahara BOS, Operator Dapodik, Penjaga Sekolah, Petugas Kebersihan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={downloadTemplateKepegawaian}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Template TU (10 Dummy)</span>
              </button>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel TU</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handleFileUpload(e, 'kepegawaian')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form TU */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Input Manual Tenaga Administrasi (TU/Tendik)</h3>
                <p className="text-xs text-slate-500">Mencatat profil staf pendukung non-keguruan</p>
              </div>
            </div>

            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    placeholder="Nama staf lengkap"
                    value={staffForm.nama}
                    onChange={e => setStaffForm({ ...staffForm, nama: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tugas Pokok / Jabatan *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Operator Dapodik & Aset"
                    value={staffForm.tugas}
                    onChange={e => setStaffForm({ ...staffForm, tugas: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={staffForm.statusKepegawaian}
                    onChange={e => setStaffForm({ ...staffForm, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Honorer / PTT">Honorer / PTT (Pegawai Tidak Tetap)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="PNS">PNS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK (KTP)</label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="320124xxxxxxxxxx"
                    value={staffForm.nik}
                    onChange={e => setStaffForm({ ...staffForm, nik: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Jika Ada)</label>
                  <input
                    type="text"
                    placeholder="Atau tanda - jika tidak ada"
                    value={staffForm.nip}
                    onChange={e => setStaffForm({ ...staffForm, nip: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    placeholder="Contoh: S1 Administrasi, D3, SMA"
                    value={staffForm.pendidikan}
                    onChange={e => setStaffForm({ ...staffForm, pendidikan: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Kontak / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    value={staffForm.noHp}
                    onChange={e => setStaffForm({ ...staffForm, noHp: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Tenaga Kependidikan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
