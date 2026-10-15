import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Award,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  ArrowRightLeft,
  UserX,
  LogOut,
  CheckCircle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  BookOpen,
  CheckSquare,
  Square,
  AlertCircle,
  X,
  HeartHandshake
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Student, ClassGroup, Religion, StudentStatus } from '../types';
import { downloadWorkbook } from '../utils/excelUtils';
import { printOfficialDocument } from '../utils/pdfExport';

type ClassSubTab = 'aktif' | 'non-aktif' | 'pip' | 'agama' | 'ekskul' | 'laporan' | 'wali-kelas';

export const ClassManagementView: React.FC = () => {
  const {
    students,
    classes,
    teachers,
    staff,
    updateStudent,
    deleteStudent,
    deleteStudentsBulk,
    moveStudentClass,
    moveStudentsClassBulk,
    setStudentPIP,
    setStudentsPIPBulk,
    setStudentDO,
    setStudentMutasiKeluar,
    reactivateStudent,
    updateClass,
    schoolProfile
  } = useSchool();

  const [activeTab, setActiveTab] = useState<ClassSubTab>('aktif');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedReligionFilter, setSelectedReligionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mass selection
  const [selectedNisns, setSelectedNisns] = useState<string[]>([]);

  // Modals state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [moveModalData, setMoveModalData] = useState<{ isOpen: boolean; nisns: string[]; targetClass: string }>({
    isOpen: false,
    nisns: [],
    targetClass: classes.filter(c => c.jenis === 'Utama')[0]?.id || ''
  });
  const [doModalData, setDoModalData] = useState<{ isOpen: boolean; student: Student | null; reason: string; date: string }>({
    isOpen: false,
    student: null,
    reason: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [mutasiModalData, setMutasiModalData] = useState<{
    isOpen: boolean;
    student: Student | null;
    sekolahTujuan: string;
    reason: string;
    date: string;
    noSurat: string;
  }>({
    isOpen: false,
    student: null,
    sekolahTujuan: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    noSurat: ''
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; student: Student | null; isBulk: boolean }>({
    isOpen: false,
    student: null,
    isBulk: false
  });

  // Flexible Report Filters
  const [reportFilters, setReportFilters] = useState<{
    classes: string[];
    statuses: StudentStatus[];
    isPipOnly: boolean;
    religions: Religion[];
    monthFilter: string;
  }>({
    classes: [],
    statuses: ['Aktif', 'Pindahan Masuk'],
    isPipOnly: false,
    religions: [],
    monthFilter: 'all'
  });

  const mainClasses = useMemo(() => classes.filter(c => c.jenis === 'Utama'), [classes]);
  const ekskulList = useMemo(() => classes.filter(c => c.jenis === 'Ekskul'), [classes]);

  // Tab Filtering
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search query
      const matchSearch =
        searchQuery === '' ||
        student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nisn.includes(searchQuery) ||
        student.nis.includes(searchQuery);

      if (!matchSearch) return false;

      // Class Filter
      if (selectedClassFilter !== 'all' && student.kelasId !== selectedClassFilter) {
        return false;
      }

      // Religion Filter
      if (selectedReligionFilter !== 'all' && student.agama !== selectedReligionFilter) {
        return false;
      }

      // Sub-tab logic
      if (activeTab === 'aktif') {
        return student.status === 'Aktif' || student.status === 'Pindahan Masuk';
      }
      if (activeTab === 'non-aktif') {
        return student.status === 'Mutasi Keluar' || student.status === 'Berhenti DO' || student.status === 'Lulus';
      }
      if (activeTab === 'pip') {
        return student.isPIP && (student.status === 'Aktif' || student.status === 'Pindahan Masuk');
      }
      if (activeTab === 'agama') {
        return student.status === 'Aktif' || student.status === 'Pindahan Masuk';
      }

      return true;
    });
  }, [students, activeTab, searchQuery, selectedClassFilter, selectedReligionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // Selection Checkbox Logic
  const isAllPageSelected = paginatedStudents.length > 0 && paginatedStudents.every(s => selectedNisns.includes(s.nisn));
  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      const pageNisns = new Set(paginatedStudents.map(s => s.nisn));
      setSelectedNisns(prev => prev.filter(n => !pageNisns.has(n)));
    } else {
      const newSelections = new Set([...selectedNisns, ...paginatedStudents.map(s => s.nisn)]);
      setSelectedNisns(Array.from(newSelections));
    }
  };

  const toggleSelectOne = (nisn: string) => {
    setSelectedNisns(prev =>
      prev.includes(nisn) ? prev.filter(n => n !== nisn) : [...prev, nisn]
    );
  };

  // Bulk Actions
  const handleBulkMove = () => {
    if (selectedNisns.length === 0) return;
    setMoveModalData({
      isOpen: true,
      nisns: selectedNisns,
      targetClass: mainClasses[0]?.id || ''
    });
  };

  const handleBulkSetPIP = (pipStatus: boolean) => {
    if (selectedNisns.length === 0) return;
    setStudentsPIPBulk(selectedNisns, pipStatus);
    setSelectedNisns([]);
    alert(`Berhasil memperbarui status PIP untuk ${selectedNisns.length} siswa terpilih.`);
  };

  const handleBulkDelete = () => {
    if (selectedNisns.length === 0) return;
    setDeleteConfirmModal({
      isOpen: true,
      student: null,
      isBulk: true
    });
  };

  // Execute Move Modal
  const confirmMove = () => {
    if (moveModalData.nisns.length === 1) {
      moveStudentClass(moveModalData.nisns[0], moveModalData.targetClass);
    } else {
      moveStudentsClassBulk(moveModalData.nisns, moveModalData.targetClass);
    }
    setMoveModalData({ isOpen: false, nisns: [], targetClass: '' });
    setSelectedNisns([]);
  };

  // Execute DO Modal
  const confirmDO = () => {
    if (!doModalData.student) return;
    setStudentDO(doModalData.student.nisn, doModalData.reason || 'Berhenti atas permintaan sendiri', doModalData.date);
    setDoModalData({ isOpen: false, student: null, reason: '', date: '' });
  };

  // Execute Mutasi Modal
  const confirmMutasi = () => {
    if (!mutasiModalData.student) return;
    setStudentMutasiKeluar(
      mutasiModalData.student.nisn,
      mutasiModalData.sekolahTujuan || 'Sekolah Baru',
      mutasiModalData.reason || 'Pindah domisili orang tua',
      mutasiModalData.date,
      mutasiModalData.noSurat
    );
    setMutasiModalData({ isOpen: false, student: null, sekolahTujuan: '', reason: '', date: '', noSurat: '' });
  };

  // Execute Delete
  const confirmDelete = () => {
    if (deleteConfirmModal.isBulk) {
      deleteStudentsBulk(selectedNisns);
      setSelectedNisns([]);
    } else if (deleteConfirmModal.student) {
      deleteStudent(deleteConfirmModal.student.nisn);
    }
    setDeleteConfirmModal({ isOpen: false, student: null, isBulk: false });
  };

  // Edit Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.nisn, editingStudent);
    setEditingStudent(null);
  };

  // Flexible Report Generation (Excel & PDF)
  const reportStudents = useMemo(() => {
    return students.filter(s => {
      // Class filter
      if (reportFilters.classes.length > 0 && !reportFilters.classes.includes(s.kelasId)) {
        return false;
      }
      // Status filter
      if (reportFilters.statuses.length > 0 && !reportFilters.statuses.includes(s.status)) {
        return false;
      }
      // PIP filter
      if (reportFilters.isPipOnly && !s.isPIP) {
        return false;
      }
      // Religion filter
      if (reportFilters.religions.length > 0 && !reportFilters.religions.includes(s.agama)) {
        return false;
      }
      return true;
    });
  }, [students, reportFilters]);

  const handleExportReportExcel = () => {
    const rows = reportStudents.map((s, idx) => ({
      No: idx + 1,
      NISN: s.nisn,
      NIS: s.nis,
      'Nama Lengkap': s.nama,
      'Jenis Kelamin': s.jenisKelamin,
      Kelas: classes.find(c => c.id === s.kelasId)?.nama || '-',
      Agama: s.agama,
      Status: s.status,
      'Penerima PIP': s.isPIP ? 'YA' : 'TIDAK',
      Alamat: s.alamat,
      'Tempat Lahir': s.tempatLahir,
      'Tanggal Lahir': s.tanggalLahir,
      'Catatan Khusus': s.transferInfo
        ? `Pindahan dari ${s.transferInfo.asalSekolah}`
        : s.exitInfo
        ? `Keluar: ${s.exitInfo.alasan}`
        : '-'
    }));

    downloadWorkbook(rows, `Laporan_Kesiswaan_SDN_Nambo_03_TA_2026_2027`, 'Laporan Kesiswaan');
  };

  const handlePrintOfficialReport = () => {
    const headers = ['No', 'NISN', 'NIS', 'Nama Siswa', 'L/P', 'Kelas', 'Agama', 'Status', 'PIP'];
    const rows = reportStudents.map((s, idx) => [
      idx + 1,
      s.nisn,
      s.nis,
      s.nama,
      s.jenisKelamin,
      classes.find(c => c.id === s.kelasId)?.nama || '-',
      s.agama,
      s.status,
      s.isPIP ? 'YA (PIP)' : '-'
    ]);

    const summaryNotes = [
      `Total Peserta Didik dalam Laporan: ${reportStudents.length} siswa`,
      `Laki-laki: ${reportStudents.filter(s => s.jenisKelamin === 'L').length} siswa | Perempuan: ${reportStudents.filter(s => s.jenisKelamin === 'P').length} siswa`,
      `Penerima Program Indonesia Pintar (PIP): ${reportStudents.filter(s => s.isPIP).length} siswa`,
      `Dicetak berdasarkan kriteria filter kesiswaan SDN Nambo 03 Tahun Ajaran ${schoolProfile.tahunAjaran}`
    ];

    printOfficialDocument({
      title: 'LAPORAN REKAPITULASI DATA KESISWAAN DAN ROMBEL',
      subtitle: `SD NEGERI NAMBO 03 KECAMATAN KLAPANUNGGAL`,
      documentNumber: `421.2/091/SDN-N03/TA-2026-2027`,
      tableHeaders: headers,
      tableRows: rows,
      summaryNotes,
      schoolProfile
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Menu Manajemen Kelas & Kesiswaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pengelolaan rombel, aksi siswa, penerima PIP, ekstrakurikuler, wali kelas, dan pusat laporan resmi
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => { setActiveTab('aktif'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'aktif'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Siswa Aktif</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {students.filter(s => s.status === 'Aktif' || s.status === 'Pindahan Masuk').length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('non-aktif'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'non-aktif'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Siswa Non-Aktif</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {students.filter(s => s.status === 'Mutasi Keluar' || s.status === 'Berhenti DO' || s.status === 'Lulus').length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('pip'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'pip'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Siswa PIP</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {students.filter(s => s.isPIP && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')).length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('agama'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'agama'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tab Agama</span>
        </button>

        <button
          onClick={() => setActiveTab('ekskul')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'ekskul'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Ekstrakurikuler</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {ekskulList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('wali-kelas')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'wali-kelas'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Penugasan Wali Kelas</span>
        </button>

        <button
          onClick={() => setActiveTab('laporan')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'laporan'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Tab Laporan Fleksibel</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. STUDENT TABLES (AKTIF / NON-AKTIF / PIP / AGAMA) */}
      {/* ========================================================= */}
      {(activeTab === 'aktif' || activeTab === 'non-aktif' || activeTab === 'pip' || activeTab === 'agama') && (
        <div className="space-y-4">
          {/* Search, Filters & Bulk Action Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama siswa, NISN, atau NIS..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              {/* Class Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedClassFilter}
                  onChange={e => { setSelectedClassFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 text-slate-700"
                >
                  <option value="all">Semua Rombel Kelas</option>
                  {mainClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>

                {/* Religion Filter (on agama tab or always) */}
                <select
                  value={selectedReligionFilter}
                  onChange={e => { setSelectedReligionFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 text-slate-700"
                >
                  <option value="all">Semua Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
            </div>

            {/* Bulk Action Strip */}
            {selectedNisns.length > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>{selectedNisns.length} siswa terpilih dari daftar</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleBulkMove}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Pindahkan Kelas Masal</span>
                  </button>

                  <button
                    onClick={() => handleBulkSetPIP(true)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Aktifkan PIP Masal</span>
                  </button>

                  <button
                    onClick={() => handleBulkSetPIP(false)}
                    className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <span>Nonaktifkan PIP</span>
                  </button>

                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Terpilih</span>
                  </button>

                  <button
                    onClick={() => setSelectedNisns([])}
                    className="px-2 py-1.5 text-slate-500 hover:text-slate-800"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-10 text-center">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="text-slate-500 hover:text-emerald-600"
                        title="Pilih Semua di Halaman Ini"
                      >
                        {isAllPageSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5">Identitas Siswa (NISN & Nama)</th>
                    <th className="p-3.5">NIS</th>
                    <th className="p-3.5">Kelas</th>
                    <th className="p-3.5">L/P</th>
                    <th className="p-3.5">Agama</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Status PIP</th>
                    <th className="p-3.5 text-center w-40">Tindakan / Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map(student => {
                      const isSelected = selectedNisns.includes(student.nisn);
                      const className = classes.find(c => c.id === student.kelasId)?.nama || '-';

                      return (
                        <tr
                          key={student.nisn}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => toggleSelectOne(student.nisn)}
                              className="text-slate-400 hover:text-emerald-600"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* Nama & NISN */}
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 text-sm">{student.nama}</div>
                            <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-slate-500">
                              <span>NISN: <strong className="text-emerald-700">{student.nisn}</strong></span>
                              <span>•</span>
                              <span>NIK: {student.nik}</span>
                            </div>
                            {student.transferInfo && (
                              <div className="mt-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block font-medium border border-blue-200">
                                Pindahan dari: {student.transferInfo.asalSekolah} ({student.transferInfo.tanggalPindah})
                              </div>
                            )}
                            {student.exitInfo && (
                              <div className="mt-1 text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block font-medium border border-rose-200">
                                {student.status}: {student.exitInfo.alasan} ({student.exitInfo.tanggalKeluar})
                              </div>
                            )}
                          </td>

                          {/* NIS */}
                          <td className="p-3.5 font-mono font-medium">{student.nis}</td>

                          {/* Kelas */}
                          <td className="p-3.5">
                            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {className}
                            </span>
                          </td>

                          {/* L/P */}
                          <td className="p-3.5">
                            <span
                              className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                                student.jenisKelamin === 'L'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-pink-100 text-pink-700'
                              }`}
                            >
                              {student.jenisKelamin}
                            </span>
                          </td>

                          {/* Agama */}
                          <td className="p-3.5 font-medium">{student.agama}</td>

                          {/* Status */}
                          <td className="p-3.5">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                student.status === 'Aktif'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : student.status === 'Pindahan Masuk'
                                  ? 'bg-blue-100 text-blue-800'
                                  : student.status === 'Berhenti DO'
                                  ? 'bg-red-100 text-red-800'
                                  : student.status === 'Mutasi Keluar'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>

                          {/* PIP Toggle */}
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => setStudentPIP(student.nisn, !student.isPIP)}
                              className={`px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1.5 transition-all ${
                                student.isPIP
                                  ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                              title="Klik untuk mengubah status penerima PIP"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>{student.isPIP ? 'Penerima PIP' : 'Bukan PIP'}</span>
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {/* Edit */}
                              <button
                                onClick={() => setEditingStudent(student)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Edit Data Siswa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Pindah Kelas */}
                              <button
                                onClick={() => setMoveModalData({ isOpen: true, nisns: [student.nisn], targetClass: student.kelasId })}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                title="Pindahkan Kelas"
                              >
                                <ArrowRightLeft className="w-4 h-4" />
                              </button>

                              {/* Mutasi Keluar */}
                              {student.status === 'Aktif' || student.status === 'Pindahan Masuk' ? (
                                <>
                                  <button
                                    onClick={() => setMutasiModalData({
                                      isOpen: true,
                                      student,
                                      sekolahTujuan: '',
                                      reason: '',
                                      date: new Date().toISOString().split('T')[0],
                                      noSurat: `421.2/MUT-${Date.now().toString().slice(-4)}/SDN-N03`
                                    })}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                    title="Mutasi Keluar"
                                  >
                                    <LogOut className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => setDoModalData({
                                      isOpen: true,
                                      student,
                                      reason: '',
                                      date: new Date().toISOString().split('T')[0]
                                    })}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                    title="Berhenti / DO"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => reactivateStudent(student.nisn, mainClasses[0]?.id || '')}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-[10px] font-bold"
                                  title="Aktifkan Kembali Siswa"
                                >
                                  Reaktivasi
                                </button>
                              )}

                              {/* Hapus Siswa */}
                              <button
                                onClick={() => setDeleteConfirmModal({ isOpen: true, student, isBulk: false })}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                title="Hapus Data Siswa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        Tidak ada siswa yang sesuai dengan filter atau kata kunci pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Menampilkan <strong>{paginatedStudents.length}</strong> dari <strong>{filteredStudents.length}</strong> total siswa
              </div>

              <div className="flex items-center gap-2 self-center sm:self-auto">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold px-2">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TAB EKSTRAKURIKULER & PEMBINA */}
      {/* ========================================================= */}
      {activeTab === 'ekskul' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 p-5 rounded-2xl border border-blue-200 space-y-2">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-600" />
              <span>Manajemen Ekstrakurikuler & Pembina Kegiatan</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daftar ekstrakurikuler bersumber dari master data di Menu Input Data. Di sini Anda dapat mengatur penugasan Pembina Ekstrakurikuler yang diambil langsung dari daftar Guru atau Staf sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ekskulList.map(ekskul => {
              const enrolledStudents = students.filter(
                s => s.ekskulIds && s.ekskulIds.includes(ekskul.id) && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')
              );
              const currentPembina = teachers.find(t => t.id === ekskul.pembinaId) || staff.find(s => s.id === ekskul.pembinaId);

              return (
                <div key={ekskul.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">{ekskul.nama}</h4>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {enrolledStudents.length} Siswa Terdaftar
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <span className="text-slate-400">Jadwal Latihan:</span>{' '}
                      <strong className="text-slate-700">{ekskul.hariLatihan || 'Belum diatur'} ({ekskul.waktuLatihan || '-'})</strong>
                    </div>
                    {ekskul.deskripsi && (
                      <div className="text-[11px] text-slate-500 italic">{ekskul.deskripsi}</div>
                    )}
                  </div>

                  {/* Assign Pembina */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Pembina Ekstrakurikuler:
                    </label>
                    <select
                      value={ekskul.pembinaId || ''}
                      onChange={e => updateClass(ekskul.id, { pembinaId: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                    >
                      <option value="">-- Pilih Guru / Pembina --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.nama}, {t.gelar}</option>
                      ))}
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>{s.nama} ({s.tugas})</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TAB PENUGASAN WALI KELAS */}
      {/* ========================================================= */}
      {activeTab === 'wali-kelas' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              <span>Penugasan Wali Kelas Utama SD Negeri Nambo 03</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Data guru yang bertugas sebagai wali kelas diambil langsung dari data yang diinput pada Tab Input Data Guru. Perubahan penugasan wali kelas akan langsung tersinkronisasi ke seluruh sistem administrasi dan jam mengajar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainClasses.map(cls => {
              const studentCount = students.filter(
                s => s.kelasId === cls.id && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')
              ).length;
              const currentWali = teachers.find(t => t.id === cls.waliKelasId);

              return (
                <div key={cls.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-base">{cls.nama}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {studentCount} Siswa
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilih Wali Kelas:
                    </label>
                    <select
                      value={cls.waliKelasId || ''}
                      onChange={e => updateClass(cls.id, { waliKelasId: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold bg-white text-slate-800"
                    >
                      <option value="">-- Belum Ditentukan --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.nama}, {t.gelar} ({t.statusKepegawaian})
                        </option>
                      ))}
                    </select>

                    {currentWali && (
                      <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-900 space-y-0.5">
                        <div className="font-bold">{currentWali.nama}, {currentWali.gelar}</div>
                        <div className="text-emerald-700 font-mono">NIP: {currentWali.nip}</div>
                        <div className="text-slate-500">No HP: {currentWali.noHp}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TAB LAPORAN FLEKSIBEL (EXCEL & PDF RESMI) */}
      {/* ========================================================= */}
      {activeTab === 'laporan' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Pusat Laporan Kesiswaan Fleksibel</h3>
              <p className="text-xs text-slate-500">
                Pilih kombinasi filter lebih dari 1 pilihan (kelas, status, PIP, agama) dan ekspor ke Excel atau PDF Resmi
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportReportExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Spreadsheet Excel (.xlsx)</span>
              </button>

              <button
                onClick={handlePrintOfficialReport}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak PDF Resmi (Kop Sekolah)</span>
              </button>
            </div>
          </div>

          {/* Flexible Multi-Select Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Status Kesiswaan:
              </label>
              {(['Aktif', 'Pindahan Masuk', 'Mutasi Keluar', 'Berhenti DO'] as StudentStatus[]).map(st => (
                <label key={st} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportFilters.statuses.includes(st)}
                    onChange={e => {
                      if (e.target.checked) {
                        setReportFilters(prev => ({ ...prev, statuses: [...prev.statuses, st] }));
                      } else {
                        setReportFilters(prev => ({ ...prev, statuses: prev.statuses.filter(s => s !== st) }));
                      }
                    }}
                    className="rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>

            {/* PIP Checkbox */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Bantuan Program PIP:
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportFilters.isPipOnly}
                  onChange={e => setReportFilters(prev => ({ ...prev, isPipOnly: e.target.checked }))}
                  className="rounded-sm text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-amber-800">Hanya Penerima PIP</span>
              </label>
            </div>

            {/* Filter Rombel Kelas */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pilih Rombongan Belajar (Bisa Multi-Select):
                </label>
                <button
                  type="button"
                  onClick={() => setReportFilters(prev => ({
                    ...prev,
                    classes: prev.classes.length === mainClasses.length ? [] : mainClasses.map(c => c.id)
                  }))}
                  className="text-[11px] text-emerald-600 font-bold hover:underline"
                >
                  {reportFilters.classes.length === mainClasses.length ? 'Batal Pilih Semua' : 'Pilih Semua Kelas'}
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto">
                {mainClasses.map(c => (
                  <label key={c.id} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportFilters.classes.includes(c.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setReportFilters(prev => ({ ...prev, classes: [...prev.classes, c.id] }));
                        } else {
                          setReportFilters(prev => ({ ...prev, classes: prev.classes.filter(cid => cid !== c.id) }));
                        }
                      }}
                      className="rounded-sm text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{c.nama}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Preview Counter */}
          <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-medium flex items-center justify-between">
            <span>Ditemukan <strong>{reportStudents.length} siswa</strong> yang cocok dengan kriteria laporan Anda.</span>
            <span className="font-mono text-[11px] text-emerald-700">TA 2026-2027 SD Negeri Nambo 03</span>
          </div>

          {/* Quick Table Preview */}
          <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-600 sticky top-0">
                <tr>
                  <th className="p-2.5">No</th>
                  <th className="p-2.5">NISN</th>
                  <th className="p-2.5">Nama Siswa</th>
                  <th className="p-2.5">L/P</th>
                  <th className="p-2.5">Kelas</th>
                  <th className="p-2.5">Agama</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">PIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportStudents.slice(0, 15).map((s, idx) => (
                  <tr key={s.nisn} className="hover:bg-slate-50">
                    <td className="p-2.5">{idx + 1}</td>
                    <td className="p-2.5 font-mono">{s.nisn}</td>
                    <td className="p-2.5 font-bold text-slate-900">{s.nama}</td>
                    <td className="p-2.5">{s.jenisKelamin}</td>
                    <td className="p-2.5 font-semibold">{classes.find(c => c.id === s.kelasId)?.nama || '-'}</td>
                    <td className="p-2.5">{s.agama}</td>
                    <td className="p-2.5">{s.status}</td>
                    <td className="p-2.5">{s.isPIP ? 'YA' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT STUDENT */}
      {/* ========================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Edit Data Siswa - {editingStudent.nama}</h3>
              <button onClick={() => setEditingStudent(null)} className="p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NISN (Tetap)</label>
                  <input
                    type="text"
                    value={editingStudent.nisn}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-100 font-mono text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIS</label>
                  <input
                    type="text"
                    value={editingStudent.nis}
                    onChange={e => setEditingStudent({ ...editingStudent, nis: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    value={editingStudent.nama}
                    onChange={e => setEditingStudent({ ...editingStudent, nama: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={editingStudent.tempatLahir}
                    onChange={e => setEditingStudent({ ...editingStudent, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={editingStudent.tanggalLahir}
                    onChange={e => setEditingStudent({ ...editingStudent, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agama</label>
                  <select
                    value={editingStudent.agama}
                    onChange={e => setEditingStudent({ ...editingStudent, agama: e.target.value as Religion })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rombel Kelas</label>
                  <select
                    value={editingStudent.kelasId}
                    onChange={e => setEditingStudent({ ...editingStudent, kelasId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    {mainClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tinggi (cm)</label>
                  <input
                    type="number"
                    value={editingStudent.tinggiBadan || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, tinggiBadan: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Berat (kg)</label>
                  <input
                    type="number"
                    value={editingStudent.beratBadan || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, beratBadan: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat</label>
                  <input
                    type="text"
                    value={editingStudent.alamat}
                    onChange={e => setEditingStudent({ ...editingStudent, alamat: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MOVE CLASS */}
      {/* ========================================================= */}
      {moveModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Pindahkan Siswa ke Kelas Baru</h3>
            <p className="text-xs text-slate-600">
              Pindahkan sebanyak <strong>{moveModalData.nisns.length} siswa</strong> ke rombongan belajar tujuan:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kelas Tujuan:</label>
              <select
                value={moveModalData.targetClass}
                onChange={e => setMoveModalData(prev => ({ ...prev, targetClass: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
              >
                {mainClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.nama}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMoveModalData({ isOpen: false, nisns: [], targetClass: '' })}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmMove}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs"
              >
                Pindahkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: BERHENTI / DO */}
      {/* ========================================================= */}
      {doModalData.isOpen && doModalData.student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-rose-800 text-base">Konfirmasi Berhenti Sekolah (Drop Out)</h3>
            <p className="text-xs text-slate-600">
              Siswa: <strong>{doModalData.student.nama}</strong> ({doModalData.student.nisn})
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Berhenti</label>
              <input
                type="date"
                value={doModalData.date}
                onChange={e => setDoModalData({ ...doModalData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Berhenti DO *</label>
              <textarea
                rows={2}
                placeholder="Faktor ekonomi / menolak bersekolah setelah konseling"
                value={doModalData.reason}
                onChange={e => setDoModalData({ ...doModalData, reason: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDoModalData({ isOpen: false, student: null, reason: '', date: '' })}
                className="px-4 py-2 text-sm text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDO}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl"
              >
                Simpan Status DO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MUTASI KELUAR */}
      {/* ========================================================= */}
      {mutasiModalData.isOpen && mutasiModalData.student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-amber-800 text-base">Mutasi Keluar Siswa</h3>
            <p className="text-xs text-slate-600">
              Siswa: <strong>{mutasiModalData.student.nama}</strong> ({mutasiModalData.student.nisn})
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sekolah Tujuan *</label>
              <input
                type="text"
                placeholder="Contoh: SDN 1 Kesambi Cirebon"
                value={mutasiModalData.sekolahTujuan}
                onChange={e => setMutasiModalData({ ...mutasiModalData, sekolahTujuan: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Keluar *</label>
              <input
                type="date"
                value={mutasiModalData.date}
                onChange={e => setMutasiModalData({ ...mutasiModalData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat Keterangan Pindah</label>
              <input
                type="text"
                value={mutasiModalData.noSurat}
                onChange={e => setMutasiModalData({ ...mutasiModalData, noSurat: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Mutasi Keluar</label>
              <input
                type="text"
                placeholder="Pindah domisili orang tua"
                value={mutasiModalData.reason}
                onChange={e => setMutasiModalData({ ...mutasiModalData, reason: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMutasiModalData({ isOpen: false, student: null, sekolahTujuan: '', reason: '', date: '', noSurat: '' })}
                className="px-4 py-2 text-sm text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmMutasi}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl"
              >
                Simpan Mutasi Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-rose-800 text-base">Konfirmasi Hapus Data Siswa</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {deleteConfirmModal.isBulk
                ? `Apakah Anda yakin ingin menghapus ${selectedNisns.length} data siswa terpilih? Tindakan ini tidak dapat dibatalkan.`
                : `Apakah Anda yakin ingin menghapus siswa "${deleteConfirmModal.student?.nama}" (${deleteConfirmModal.student?.nisn})?`}
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal({ isOpen: false, student: null, isBulk: false })}
                className="px-4 py-2 text-sm text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-xs"
              >
                Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
