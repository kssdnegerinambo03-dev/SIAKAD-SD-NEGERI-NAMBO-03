import React, { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  PieChart as PieIcon,
  BarChart3,
  HeartHandshake,
  Server
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { students, teachers, staff, classes, attendanceRecords, practices, schoolProfile, syncLogs } = useSchool();
  const [selectedChartClass, setSelectedChartClass] = useState<string>('all');

  // Calculations
  const activeStudents = useMemo(
    () => students.filter(s => s.status === 'Aktif' || s.status === 'Pindahan Masuk'),
    [students]
  );

  const pipStudents = useMemo(
    () => students.filter(s => s.isPIP && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')),
    [students]
  );

  const maleCount = useMemo(
    () => activeStudents.filter(s => s.jenisKelamin === 'L').length,
    [activeStudents]
  );

  const femaleCount = useMemo(
    () => activeStudents.filter(s => s.jenisKelamin === 'P').length,
    [activeStudents]
  );

  const doCount = useMemo(() => students.filter(s => s.status === 'Berhenti DO').length, [students]);
  const mutasiCount = useMemo(() => students.filter(s => s.status === 'Mutasi Keluar').length, [students]);
  const transferInCount = useMemo(() => students.filter(s => s.status === 'Pindahan Masuk').length, [students]);

  // Religion Distribution
  const religionStats = useMemo(() => {
    const counts: Record<string, number> = {
      Islam: 0,
      Kristen: 0,
      Katolik: 0,
      Hindu: 0,
      Buddha: 0,
      Konghucu: 0
    };
    activeStudents.forEach(s => {
      if (counts[s.agama] !== undefined) counts[s.agama]++;
      else counts['Islam']++;
    });
    return counts;
  }, [activeStudents]);

  // Class Distribution
  const classStats = useMemo(() => {
    const mainClasses = classes.filter(c => c.jenis === 'Utama');
    return mainClasses.map(c => {
      const classStudents = activeStudents.filter(s => s.kelasId === c.id);
      const L = classStudents.filter(s => s.jenisKelamin === 'L').length;
      const P = classStudents.filter(s => s.jenisKelamin === 'P').length;
      const pip = classStudents.filter(s => s.isPIP).length;
      return {
        id: c.id,
        nama: c.nama,
        total: classStudents.length,
        L,
        P,
        pip
      };
    });
  }, [classes, activeStudents]);

  // Teacher Performance Stats
  const observedCount = practices.filter(p => p.statusObservasi === 'Sudah').length;
  const practicePercentage = teachers.length > 0 ? Math.round((observedCount / teachers.length) * 100) : 0;

  // Attendance Stats for 2026-2027
  const attendanceRate = useMemo(() => {
    if (attendanceRecords.length === 0) return 98;
    const totalHadir = attendanceRecords.reduce((acc, r) => acc + r.hadir, 0);
    const totalSiswaRecorded = attendanceRecords.reduce((acc, r) => acc + r.totalSiswa, 0);
    return totalSiswaRecorded > 0 ? Math.round((totalHadir / totalSiswaRecorded) * 100) : 100;
  }, [attendanceRecords]);

  // Monthly Attendance breakdown TA 2026-2027
  const months = [
    { key: '2026-07', label: 'Jul 26' },
    { key: '2026-08', label: 'Agu 26' },
    { key: '2026-09', label: 'Sep 26' },
    { key: '2026-10', label: 'Okt 26' },
    { key: '2026-11', label: 'Nov 26' },
    { key: '2026-12', label: 'Des 26' },
    { key: '2027-01', label: 'Jan 27' },
    { key: '2027-02', label: 'Feb 27' },
    { key: '2027-03', label: 'Mar 27' },
    { key: '2027-04', label: 'Apr 27' },
    { key: '2027-05', label: 'Mei 27' },
    { key: '2027-06', label: 'Jun 27' }
  ];

  const monthlyAttendanceData = useMemo(() => {
    return months.map(m => {
      const records = attendanceRecords.filter(r => r.bulan === m.key);
      const hadir = records.reduce((sum, r) => sum + r.hadir, 0);
      const sakit = records.reduce((sum, r) => sum + r.sakit, 0);
      const izin = records.reduce((sum, r) => sum + r.izin, 0);
      const alpa = records.reduce((sum, r) => sum + r.alpa, 0);
      const total = hadir + sakit + izin + alpa;
      const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;
      return {
        ...m,
        hadir,
        sakit,
        izin,
        alpa,
        rate: records.length > 0 ? rate : null
      };
    });
  }, [attendanceRecords]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Informasi Administrasi Sekolah Terpadu
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang di SIAKAD {schoolProfile.namaSekolah}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              NPSN <strong className="text-white">{schoolProfile.npsn}</strong> • Klapanunggal, Kab. Bogor. Kepala Sekolah: <strong className="text-amber-300">{schoolProfile.kepalaSekolah}</strong> (NIP: {schoolProfile.nipKepalaSekolah}). Tahun Ajaran {schoolProfile.tahunAjaran} Semester {schoolProfile.semester}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('input-data')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Input Data Baru</span>
            </button>
            <button
              onClick={() => onNavigate('manajemen-kelas')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Manajemen Kelas</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-60 -top-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Siswa Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Siswa Aktif</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeStudents.length}</span>
            <span className="text-xs text-slate-500 font-medium">siswa</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span className="text-blue-600 font-semibold">L: {maleCount}</span>
            <span>•</span>
            <span className="text-pink-600 font-semibold">P: {femaleCount}</span>
          </div>
        </div>

        {/* PIP Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Penerima PIP</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{pipStudents.length}</span>
            <span className="text-xs text-slate-500 font-medium">penerima bantuan</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            {activeStudents.length > 0
              ? `${Math.round((pipStudents.length / activeStudents.length) * 100)}% dari total siswa aktif`
              : '0%'}
          </div>
        </div>

        {/* GTK & Tendik Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Guru & Tenaga TU</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {teachers.filter(t => t.statusAktif).length + staff.filter(s => s.statusAktif).length}
            </span>
            <span className="text-xs text-slate-500 font-medium">GTK & Tendik</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-emerald-700">{teachers.filter(t => t.statusAktif).length} Guru</span>
            <span>•</span>
            <span className="font-semibold text-slate-700">{staff.filter(s => s.statusAktif).length} Staf TU</span>
          </div>
        </div>

        {/* Kehadiran Rata-rata Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Presensi Kehadiran</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-700">{attendanceRate}%</span>
            <span className="text-xs text-slate-500 font-medium">TA 2026-2027</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Kondisi Sangat Disiplin</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Chart 1: Rombel / Kelas Bar Chart (2 columns wide) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Grafik Distribusi Siswa Per Rombongan Belajar</h3>
                <p className="text-xs text-slate-500">Perbandingan jumlah peserta didik laki-laki & perempuan per kelas</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-blue-500"></span> Laki-laki
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-pink-400"></span> Perempuan
              </span>
            </div>
          </div>

          {/* Interactive Bars */}
          <div className="space-y-3 pt-2">
            {classStats.length > 0 ? (
              classStats.map(item => {
                const maxCap = 35;
                const totalPct = Math.min(Math.round((item.total / maxCap) * 100), 100);
                const malePct = item.total > 0 ? (item.L / item.total) * 100 : 50;
                const femalePct = item.total > 0 ? (item.P / item.total) * 100 : 50;

                return (
                  <div key={item.id} className="group p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.nama}</span>
                        {item.pip > 0 && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-sm font-medium">
                            {item.pip} PIP
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono">
                          L: <strong className="text-blue-600">{item.L}</strong> | P: <strong className="text-pink-600">{item.P}</strong>
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-800 font-mono">
                          {item.total} Siswa
                        </span>
                      </div>
                    </div>

                    {/* Stacked bar */}
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      {item.total > 0 ? (
                        <>
                          <div
                            style={{ width: `${(item.L / maxCap) * 100}%` }}
                            className="bg-blue-500 hover:bg-blue-600 transition-all"
                            title={`${item.nama}: ${item.L} Laki-laki`}
                          />
                          <div
                            style={{ width: `${(item.P / maxCap) * 100}%` }}
                            className="bg-pink-400 hover:bg-pink-500 transition-all"
                            title={`${item.nama}: ${item.P} Perempuan`}
                          />
                        </>
                      ) : (
                        <div className="w-full text-[10px] text-slate-400 text-center leading-4 font-italic">
                          Kelas belum ada siswa
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-sm text-slate-400">
                Belum ada data kelas yang terdaftar.
              </div>
            )}
          </div>
        </div>

        {/* Interactive Chart 2: Status & Agama Siswa */}
        <div className="space-y-6">
          {/* Status Siswa Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <PieIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Status Kesiswaan</h3>
                  <p className="text-[11px] text-slate-500">Mutasi, DO & Pindahan</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-bold block text-lg">{activeStudents.length}</span>
                <span className="text-slate-600 font-medium">Siswa Aktif</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-blue-700 font-bold block text-lg">{transferInCount}</span>
                <span className="text-slate-600 font-medium">Pindahan Masuk</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-amber-700 font-bold block text-lg">{mutasiCount}</span>
                <span className="text-slate-600 font-medium">Mutasi Keluar</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-rose-700 font-bold block text-lg">{doCount}</span>
                <span className="text-slate-600 font-medium">Berhenti DO</span>
              </div>
            </div>
          </div>

          {/* Agama Siswa Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Distribusi Agama Siswa</h3>
              <span className="text-xs text-slate-400 font-mono">{activeStudents.length} total</span>
            </div>

            <div className="space-y-2 text-xs">
              {Object.entries(religionStats).map(([agama, count]) => {
                const pct = activeStudents.length > 0 ? Math.round((count / activeStudents.length) * 100) : 0;
                return (
                  <div key={agama} className="space-y-1">
                    <div className="flex justify-between font-medium text-slate-700">
                      <span>{agama}</span>
                      <span className="font-mono text-slate-500 font-semibold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all ${
                          agama === 'Islam' ? 'bg-emerald-500' :
                          agama === 'Kristen' ? 'bg-blue-500' :
                          agama === 'Katolik' ? 'bg-purple-500' :
                          agama === 'Hindu' ? 'bg-amber-500' :
                          agama === 'Buddha' ? 'bg-red-500' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Chart 3: Tren Kehadiran Bulanan TA 2026-2027 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Tren Kehadiran Siswa Per Bulan - Tahun Ajaran 2026-2027
              </h3>
              <p className="text-xs text-slate-500">
                Rekapitulasi kehadiran harian global (Juli 2026 s/d Juni 2027) di seluruh kelas
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('absensi-umur')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>Buka Modul Absensi Harian</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 12-Month Bars Chart */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2">
          {monthlyAttendanceData.map((m, idx) => {
            const hasData = m.rate !== null;
            const rateVal = m.rate ?? 0;
            const barHeight = hasData ? Math.max(rateVal, 15) : 8;

            return (
              <div key={m.key} className="flex flex-col items-center gap-2 text-center group">
                <div className="text-[10px] font-mono font-semibold text-slate-600">
                  {hasData ? `${rateVal}%` : '-'}
                </div>
                <div className="w-full bg-slate-100 h-28 rounded-xl flex items-end p-1 relative overflow-hidden group-hover:bg-slate-200/60 transition-colors">
                  <div
                    style={{ height: `${barHeight}%` }}
                    className={`w-full rounded-lg transition-all ${
                      hasData
                        ? rateVal >= 95
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          : rateVal >= 85
                          ? 'bg-gradient-to-t from-blue-600 to-cyan-400'
                          : 'bg-gradient-to-t from-amber-500 to-orange-400'
                        : 'bg-slate-300/40'
                    }`}
                  />
                  {hasData && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[9px] p-1 rounded-xl">
                      <div>
                        <div>H: {m.hadir}</div>
                        <div>S: {m.sakit}</div>
                        <div>I: {m.izin}</div>
                        <div>A: {m.alpa}</div>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher Performance Summary & Quick Navigation Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kinerja Guru Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Observasi Kinerja Guru</h3>
              <p className="text-xs text-slate-500">Nilai 100 jika sudah observasi</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Capaian Observasi Kepala Sekolah</span>
              <span className="text-emerald-700 font-bold">{observedCount} dari {teachers.length} Guru</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${practicePercentage}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Observasi dipimpin langsung oleh Kepala Sekolah <strong>{schoolProfile.kepalaSekolah}</strong> sesuai indikator Kurikulum Merdeka & PMM.
            </p>
          </div>

          <button
            onClick={() => onNavigate('kepegawaian')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Buka Evaluasi Kinerja & BerAKHLAK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ekstrakurikuler Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Ekstrakurikuler Aktif</h3>
              <p className="text-xs text-slate-500">Bakat & Minat Peserta Didik</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {classes.filter(c => c.jenis === 'Ekskul').slice(0, 4).map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-800 truncate">{e.nama}</span>
                <span className="text-[11px] text-slate-500">{e.hariLatihan || 'Mingguan'}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('manajemen-kelas')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Kelola Ekstrakurikuler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Monitoring & Sinkronisasi Card */}
        <div className="bg-white p-6 rounded-2xl border border-blue-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Monitoring Kepala Sekolah</h3>
                <p className="text-xs text-slate-500">Tabel Sinkronisasi Data Real-Time</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              Tersinkron
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {syncLogs.slice(0, 3).map(log => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 text-[11px]">{log.wargaSekolah}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{log.judul}</p>
                </div>
                <span className="text-[9px] text-slate-400 shrink-0">{log.timestamp.slice(11, 16)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('sinkronisasi')}
            className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Buka Tabel Sinkronisasi Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Akses Cepat / Shortcut */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
              <Layers className="w-3 h-3" />
              SOP Administrasi
            </div>
            <h3 className="text-lg font-bold leading-tight">Pusat Laporan & Ekspor Resmi</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Cetak Dokumen resmi bertanda tangan Kepala Sekolah lengkap dengan Kop Surat SD Negeri Nambo 03 atau unduh berkas spreadsheet Excel (.xlsx).
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('manajemen-kelas')}
              className="w-full py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Cetak Laporan Kesiswaan & PIP</span>
            </button>
            <button
              onClick={() => onNavigate('absensi-umur')}
              className="w-full py-2 bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Ekspor Rekap Absensi 2026/2027</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
