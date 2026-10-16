import React, { useState, useMemo } from 'react';
import {
  Server,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Users,
  Download,
  Database,
  Eye,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle,
  History,
  Building,
  ArrowUpDown,
  FileCheck,
  CheckCheck
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SchoolRole, SyncAuditLog } from '../types';
import { downloadWorkbook } from '../utils/excelUtils';

export const SyncMonitoringView: React.FC = () => {
  const {
    syncLogs,
    currentActiveUser,
    setCurrentActiveUser,
    addSyncLog,
    verifySyncLogByKepsek,
    verifyAllSyncLogsByKepsek,
    syncStatus,
    lastSyncTime,
    forceSyncNow,
    downloadFullDatabaseJSON,
    downloadMasterExcelArchive,
    schoolProfile,
    students,
    teachers,
    classes
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLingkup, setSelectedLingkup] = useState<string>('all');
  const [selectedAksi, setSelectedAksi] = useState<string>('all');
  const [selectedVerifikasi, setSelectedVerifikasi] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal note for Headmaster verification
  const [activeVerifyLog, setActiveVerifyLog] = useState<SyncAuditLog | null>(null);
  const [kepsekNoteInput, setKepsekNoteInput] = useState('');

  // Modal for manual simulation of school member edit
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [manualLingkup, setManualLingkup] = useState('Kelas 1A');
  const [manualAksi, setManualAksi] = useState<'Tambah' | 'Ubah' | 'Hapus' | 'Import Excel'>('Ubah');
  const [manualJudul, setManualJudul] = useState('');
  const [manualRincian, setManualRincian] = useState('');

  // Pre-configured school roles for switcher
  const availableUsers: { name: string; role: SchoolRole; label: string }[] = [
    {
      name: schoolProfile.kepalaSekolah || 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.',
      role: 'Kepala Sekolah',
      label: `Kepala Sekolah (${schoolProfile.kepalaSekolah || 'AM. MEGA PURNAMATATI'})`
    },
    { name: 'Hj. Siti Rohmah, S.Pd.SD', role: 'Guru Kelas', label: 'Guru Kelas 1A (Hj. Siti Rohmah, S.Pd.SD)' },
    { name: 'Dewi Lestari, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 1B (Dewi Lestari, S.Pd.)' },
    { name: 'Nurul Hidayah, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 2A (Nurul Hidayah, S.Pd.)' },
    { name: 'Rina Marlina, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 2B (Rina Marlina, S.Pd.)' },
    { name: 'Eni Maryani, S.Pd.SD', role: 'Guru Kelas', label: 'Guru Kelas 3A (Eni Maryani, S.Pd.SD)' },
    { name: 'Fitri Handayani, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 3B (Fitri Handayani, S.Pd.)' },
    { name: 'Asep Saepudin, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 4A (Asep Saepudin, S.Pd.)' },
    { name: 'Dini Anggraeni, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 4B (Dini Anggraeni, S.Pd.)' },
    { name: 'Bambang Supriyanto, S.Pd.SD, M.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 5A (Bambang Supriyanto, S.Pd.SD, M.Pd.)' },
    { name: 'Ika Pratiwi, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 5B (Ika Pratiwi, S.Pd.)' },
    { name: 'Drs. H. Mulyadi, M.M.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 6A (Drs. H. Mulyadi, M.M.Pd.)' },
    { name: 'Sri Wahyuni, S.Pd.', role: 'Guru Kelas', label: 'Guru Kelas 6B (Sri Wahyuni, S.Pd.)' },
    { name: 'Rian Permana, S.Pd.Jas.', role: 'Guru Mapel', label: 'Guru PJOK & Pramuka (Rian Permana, S.Pd.Jas.)' },
    { name: 'Ustadz Ahmad Fauzi, S.Pd.I.', role: 'Guru Mapel', label: 'Guru PAI & Budi Pekerti (Ahmad Fauzi, S.Pd.I.)' },
    { name: 'Rizky Ramadhan', role: 'Operator Dapodik', label: 'Operator Dapodik (Rizky Ramadhan)' },
    { name: 'Dedi Kurniawan', role: 'Staf Tata Usaha', label: 'Kepala TU (Dedi Kurniawan)' }
  ];

  const handleForceSync = async () => {
    setIsSyncing(true);
    await forceSyncNow();
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  const handleExportLogsExcel = () => {
    const exportRows = filteredLogs.map((log, index) => ({
      No: index + 1,
      'Waktu & Tanggal': log.timestamp,
      'Warga Sekolah': log.wargaSekolah,
      Peran: log.peran,
      Lingkup: log.lingkup,
      'Jenis Aksi': log.jenisAksi,
      'Judul Aktivitas': log.judul,
      'Rincian Perubahan': log.rincianPerubahan,
      'Status Sinkronisasi': log.statusSinkron,
      'Status Pemantauan Kepsek': log.diverifikasiKepsek ? 'Sudah Dipantau' : 'Belum Dipantau',
      'Catatan Kepala Sekolah': log.catatanKepsek || '-',
      'Waktu Pemantauan': log.waktuVerifikasi || '-'
    }));

    downloadWorkbook(
      exportRows,
      `Tabel_Sinkronisasi_Data_SDN_Nambo_03_${new Date().toISOString().slice(0, 10)}`,
      'Log Sinkronisasi'
    );
  };

  const handleOpenVerifyModal = (log: SyncAuditLog) => {
    setActiveVerifyLog(log);
    setKepsekNoteInput(log.catatanKepsek || 'Telah diperiksa, divalidasi, dan disetujui Kepala Sekolah.');
  };

  const handleConfirmVerify = () => {
    if (activeVerifyLog) {
      verifySyncLogByKepsek(activeVerifyLog.id, kepsekNoteInput);
      setActiveVerifyLog(null);
    }
  };

  const handleCreateManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualJudul.trim()) return;

    addSyncLog({
      wargaSekolah: currentActiveUser.name,
      peran: currentActiveUser.role,
      lingkup: manualLingkup,
      jenisAksi: manualAksi,
      judul: manualJudul.trim(),
      rincianPerubahan: manualRincian.trim() || 'Perubahan data tersimpan dan disinkronkan ke server.',
      diverifikasiKepsek: currentActiveUser.role === 'Kepala Sekolah'
    });

    setManualJudul('');
    setManualRincian('');
    setIsManualInputOpen(false);
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return syncLogs.filter(log => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        log.wargaSekolah.toLowerCase().includes(search) ||
        log.judul.toLowerCase().includes(search) ||
        log.rincianPerubahan.toLowerCase().includes(search) ||
        log.lingkup.toLowerCase().includes(search);

      // Role
      const matchRole = selectedRole === 'all' || log.peran === selectedRole;

      // Lingkup
      const matchLingkup = selectedLingkup === 'all' || log.lingkup === selectedLingkup;

      // Aksi
      const matchAksi = selectedAksi === 'all' || log.jenisAksi === selectedAksi;

      // Verifikasi
      const matchVerif =
        selectedVerifikasi === 'all' ||
        (selectedVerifikasi === 'verified' && log.diverifikasiKepsek) ||
        (selectedVerifikasi === 'pending' && !log.diverifikasiKepsek);

      return matchSearch && matchRole && matchLingkup && matchAksi && matchVerif;
    });
  }, [syncLogs, searchTerm, selectedRole, selectedLingkup, selectedAksi, selectedVerifikasi]);

  // Metrics
  const totalLogs = syncLogs.length;
  const verifiedCount = syncLogs.filter(l => l.diverifikasiKepsek).length;
  const pendingCount = totalLogs - verifiedCount;

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 border border-white/10">
              <Server className="w-3.5 h-3.5 text-teal-300" />
              <span>Sistem Sinkronisasi Multi-Pengguna Terpadu</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Tabel Sinkronisasi Data & Monitoring Kepala Sekolah
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Memantau dan menyimpan seluruh hasil pengeditan dari seluruh warga sekolah (Guru Kelas 1A–6B, Guru Mapel, Staf TU, dan Operator). Kepala Sekolah dapat memverifikasi setiap perubahan data dari waktu ke waktu secara real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleForceSync}
              disabled={isSyncing || syncStatus === 'syncing'}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing || syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Sekarang</span>
            </button>

            <button
              onClick={handleExportLogsExcel}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Log Excel (.xlsx)</span>
            </button>

            <button
              onClick={downloadFullDatabaseJSON}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Real-time Server Sync Status Indicator */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                syncStatus === 'synced' ? 'bg-emerald-400' : 'bg-blue-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                syncStatus === 'synced' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}></span>
            </span>

            <span className="font-semibold text-slate-200">
              Status Server: <span className="text-emerald-300 font-bold">Tersinkronisasi Online (Pusat Data SDN Nambo 03)</span>
            </span>

            <span className="text-slate-400 hidden sm:inline">&bull;</span>

            <span className="text-slate-300">
              Sinkron terakhir: <strong className="text-white">{lastSyncTime ? `${lastSyncTime} WIB` : 'Baru saja'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span>Polling Otomatis Sinkronisasi: <strong>Tiap 10 Detik</strong></span>
          </div>
        </div>
      </div>

      {/* Role / School Member Simulator Switcher */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 mt-0.5">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Identitas Pengguna yang Menginput Saat Ini:</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-md">
                {currentActiveUser.role}
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {currentActiveUser.name}
            </p>
            <p className="text-[11px] text-slate-500">
              Setiap kali Anda menginput, mengedit nilai, presensi, atau biodata, sistem akan mencatat aktivitas atas nama akun ini pada Tabel Sinkronisasi.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Ganti Pengguna:
            </label>
            <select
              value={currentActiveUser.name}
              onChange={(e) => {
                const target = availableUsers.find(u => u.name === e.target.value);
                if (target) {
                  setCurrentActiveUser(target);
                }
              }}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableUsers.map((u) => (
                <option key={u.name} value={u.name}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsManualInputOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulasi Catatan Pengeditan</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Aktivitas Edit</span>
            <span className="text-xl font-black text-slate-900">{totalLogs} Log</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sudah Dipantau Kepsek</span>
            <span className="text-xl font-black text-emerald-700">{verifiedCount} Log</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Menunggu Pemantauan</span>
            <span className="text-xl font-black text-amber-600">{pendingCount} Log</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Data Siswa & Guru Valid</span>
            <span className="text-xl font-black text-purple-900">{students.length} Siswa • {teachers.length} PTK</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/60 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari guru, aktivitas, atau rincian perubahan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quick Actions for Headmaster */}
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Verifikasi dan tandai semua aktivitas pengeditan sebagai telah dipantau Kepala Sekolah?')) {
                      verifyAllSyncLogsByKepsek();
                    }
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Pantau & Verifikasi Semua ({pendingCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Peran</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
              <option value="Guru Kelas">Guru Kelas</option>
              <option value="Guru Mapel">Guru Mapel</option>
              <option value="Operator Dapodik">Operator Dapodik</option>
              <option value="Staf Tata Usaha">Staf Tata Usaha</option>
            </select>

            {/* Lingkup Filter */}
            <select
              value={selectedLingkup}
              onChange={(e) => setSelectedLingkup(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Lingkup / Kelas</option>
              <option value="Kelas 1A">Kelas 1A</option>
              <option value="Kelas 1B">Kelas 1B</option>
              <option value="Kelas 2A">Kelas 2A</option>
              <option value="Kelas 2B">Kelas 2B</option>
              <option value="Kelas 3A">Kelas 3A</option>
              <option value="Kelas 3B">Kelas 3B</option>
              <option value="Kelas 4A">Kelas 4A</option>
              <option value="Kelas 4B">Kelas 4B</option>
              <option value="Kelas 5A">Kelas 5A</option>
              <option value="Kelas 5B">Kelas 5B</option>
              <option value="Kelas 6A">Kelas 6A</option>
              <option value="Kelas 6B">Kelas 6B</option>
              <option value="Praktik Kinerja">Praktik Kinerja</option>
              <option value="Presensi">Presensi</option>
              <option value="Buku Induk Siswa">Buku Induk Siswa</option>
              <option value="Database Pusat">Database Pusat</option>
            </select>

            {/* Aksi Filter */}
            <select
              value={selectedAksi}
              onChange={(e) => setSelectedAksi(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Jenis Aksi</option>
              <option value="Tambah">Tambah</option>
              <option value="Ubah">Ubah</option>
              <option value="Hapus">Hapus</option>
              <option value="Import Excel">Import Excel</option>
              <option value="Sinkronisasi">Sinkronisasi</option>
            </select>

            {/* Verifikasi Kepsek Filter */}
            <select
              value={selectedVerifikasi}
              onChange={(e) => setSelectedVerifikasi(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Status Pemantauan</option>
              <option value="verified">Sudah Dipantau Kepsek</option>
              <option value="pending">Belum Dipantau Kepsek</option>
            </select>

            {(searchTerm || selectedRole !== 'all' || selectedLingkup !== 'all' || selectedAksi !== 'all' || selectedVerifikasi !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  setSelectedLingkup('all');
                  setSelectedAksi('all');
                  setSelectedVerifikasi('all');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold ml-auto cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* The Core Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-36">Waktu & Tanggal</th>
                <th className="py-3 px-4 w-48">Warga Sekolah / Penginput</th>
                <th className="py-3 px-4 w-36">Peran & Lingkup</th>
                <th className="py-3 px-4 w-28 text-center">Jenis Aksi</th>
                <th className="py-3 px-4">Judul & Rincian Perubahan Data</th>
                <th className="py-3 px-4 w-32 text-center">Status Server</th>
                <th className="py-3 px-4 w-44 text-center">Pemantauan Kepala Sekolah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <History className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data riwayat pengeditan yang cocok.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const getAksiBadge = (aksi: string) => {
                    switch (aksi) {
                      case 'Tambah':
                        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                      case 'Ubah':
                        return 'bg-blue-100 text-blue-800 border-blue-200';
                      case 'Hapus':
                        return 'bg-rose-100 text-rose-800 border-rose-200';
                      case 'Import Excel':
                        return 'bg-purple-100 text-purple-800 border-purple-200';
                      case 'Sinkronisasi':
                        return 'bg-teal-100 text-teal-800 border-teal-200';
                      default:
                        return 'bg-slate-100 text-slate-800 border-slate-200';
                    }
                  };

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        !log.diverifikasiKepsek ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold text-[11px] shrink-0">
                            {log.wargaSekolah.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {log.wargaSekolah}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="block font-bold text-slate-700 text-xs">
                          {log.lingkup}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {log.peran}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getAksiBadge(log.jenisAksi)}`}>
                          {log.jenisAksi}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-slate-900 text-xs mb-0.5">
                          {log.judul}
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {log.rincianPerubahan}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Tersinkron</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {log.diverifikasiKepsek ? (
                          <div className="flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Dipantau Kepsek</span>
                            </span>
                            {log.catatanKepsek && (
                              <span className="text-[10px] text-slate-500 mt-0.5 italic max-w-[180px] truncate" title={log.catatanKepsek}>
                                "{log.catatanKepsek}"
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenVerifyModal(log)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Pantau & Validasi</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Menampilkan <strong className="text-slate-800">{filteredLogs.length}</strong> dari <strong className="text-slate-800">{syncLogs.length}</strong> total riwayat pengeditan warga sekolah SDN Nambo 03.
          </p>
          <p className="text-[11px] text-slate-400">
            Terpusat di database JSON server &bull; Aman & Tidak berubah saat link dibagikan
          </p>
        </div>
      </div>

      {/* Headmaster Verification Modal */}
      {activeVerifyLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-300" />
                <h3 className="font-bold text-sm">Verifikasi & Pemantauan Kepala Sekolah</h3>
              </div>
              <button
                onClick={() => setActiveVerifyLog(null)}
                className="text-white/80 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p>
                  <strong>Penginput:</strong> {activeVerifyLog.wargaSekolah} ({activeVerifyLog.peran})
                </p>
                <p>
                  <strong>Lingkup:</strong> {activeVerifyLog.lingkup} &bull; <strong>Waktu:</strong> {activeVerifyLog.timestamp}
                </p>
                <p>
                  <strong>Aktivitas:</strong> {activeVerifyLog.judul}
                </p>
                <p className="text-slate-600">
                  {activeVerifyLog.rincianPerubahan}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Catatan Pemantauan Kepala Sekolah:
                </label>
                <textarea
                  rows={3}
                  value={kepsekNoteInput}
                  onChange={(e) => setKepsekNoteInput(e.target.value)}
                  placeholder="Tuliskan catatan tindak lanjut atau persetujuan hasil pengeditan..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveVerifyLog(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerify}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Telah Dipantau</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Simulation Log Modal */}
      {isManualInputOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Simulasi Catatan Pengeditan Data Sekolah</h3>
              </div>
              <button
                onClick={() => setIsManualInputOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateManualLog} className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-slate-500 text-[11px]">
                Aktivitas ini akan dicatat atas nama: <strong>{currentActiveUser.name}</strong> ({currentActiveUser.role}).
              </p>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Lingkup / Kelas:</label>
                <select
                  value={manualLingkup}
                  onChange={(e) => setManualLingkup(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Kelas 1A">Kelas 1A</option>
                  <option value="Kelas 1B">Kelas 1B</option>
                  <option value="Kelas 2A">Kelas 2A</option>
                  <option value="Kelas 2B">Kelas 2B</option>
                  <option value="Kelas 3A">Kelas 3A</option>
                  <option value="Kelas 3B">Kelas 3B</option>
                  <option value="Kelas 4A">Kelas 4A</option>
                  <option value="Kelas 4B">Kelas 4B</option>
                  <option value="Kelas 5A">Kelas 5A</option>
                  <option value="Kelas 5B">Kelas 5B</option>
                  <option value="Kelas 6A">Kelas 6A</option>
                  <option value="Kelas 6B">Kelas 6B</option>
                  <option value="Praktik Kinerja">Praktik Kinerja Guru</option>
                  <option value="Presensi">Presensi Harian</option>
                  <option value="Rekapitulasi Umur">Rekapitulasi Umur Siswa</option>
                  <option value="Buku Induk Siswa">Buku Induk Siswa</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Jenis Aksi:</label>
                <select
                  value={manualAksi}
                  onChange={(e) => setManualAksi(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Tambah">Tambah Data Baru</option>
                  <option value="Ubah">Ubah / Pembaruan Data</option>
                  <option value="Hapus">Hapus Data</option>
                  <option value="Import Excel">Import Excel</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Judul Pengeditan:</label>
                <input
                  type="text"
                  required
                  value={manualJudul}
                  onChange={(e) => setManualJudul(e.target.value)}
                  placeholder="Contoh: Pembaruan Nilai Formatif atau Presensi Harian..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Rincian Perubahan:</label>
                <textarea
                  rows={3}
                  value={manualRincian}
                  onChange={(e) => setManualRincian(e.target.value)}
                  placeholder="Contoh: Mengubah kehadiran siswa sakit menjadi hadir, atau memperbarui catatan observasi kelas..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualInputOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Simpan Catatan Pengeditan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
