import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  School,
  Settings,
  ChevronRight,
  Sparkles,
  Award,
  Database,
  Share2,
  Server,
  LogOut,
  UserCheck
} from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';
import { useSchool } from '../context/SchoolContext';
import { AuthSession } from './LoginScreen';

export type ActiveTab = 'dashboard' | 'input-data' | 'manajemen-kelas' | 'kepegawaian' | 'absensi-umur' | 'sinkronisasi';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenSettings: () => void;
  onOpenDatabaseSync: () => void;
  onOpenShare: () => void;
  currentSession?: AuthSession | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  onOpenSettings,
  onOpenDatabaseSync,
  onOpenShare,
  currentSession,
  onLogout
}) => {
  const { schoolProfile, students, teachers, classes, syncLogs } = useSchool();

  const totalSiswa = students.filter(s => s.status === 'Aktif' || s.status === 'Pindahan Masuk').length;
  const totalGuru = teachers.filter(t => t.statusAktif).length;
  const totalKelas = classes.filter(c => c.jenis === 'Utama').length;
  const pendingLogs = syncLogs.filter(l => !l.diverifikasiKepsek).length;

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard Utama',
      sublabel: 'Grafik & Statistik Terpadu',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'input-data' as ActiveTab,
      label: 'Input Data Master',
      sublabel: 'Kelas, Siswa, Guru & TU',
      icon: UserPlus,
      badge: 'Import'
    },
    {
      id: 'manajemen-kelas' as ActiveTab,
      label: 'Manajemen Kelas & Siswa',
      sublabel: 'Rombel, PIP, Ekskul & Laporan',
      icon: GraduationCap,
      badge: `${totalSiswa} Siswa`
    },
    {
      id: 'kepegawaian' as ActiveTab,
      label: 'Kepegawaian & Kinerja',
      sublabel: 'Jam Mengajar & BerAKHLAK',
      icon: Briefcase,
      badge: `${totalGuru} GTK`
    },
    {
      id: 'absensi-umur' as ActiveTab,
      label: 'Absensi & Rekap Umur',
      sublabel: 'Harian TA 2026-2027 & Usia',
      icon: CalendarCheck,
      badge: '2026/2027'
    },
    {
      id: 'sinkronisasi' as ActiveTab,
      label: 'Tabel Sinkronisasi Data',
      sublabel: 'Monitoring Kepala Sekolah',
      icon: Server,
      badge: pendingLogs > 0 ? `${pendingLogs} Baru` : 'Sinkron'
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out shrink-0 border-r border-slate-800/80 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* School Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <OfficialLogo size={46} customLogoUrl={schoolProfile.logoUrl} />
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-sm sm:text-base leading-snug tracking-tight text-white flex items-center gap-1.5">
                SDN NAMBO 03
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-1.5 py-0.5 rounded-sm">
                  RESMI
                </span>
              </h1>
              <p className="text-xs text-amber-400 font-semibold truncate">
                NPSN: {schoolProfile.npsn}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                Klapanunggal - Kab. Bogor
              </p>
            </div>
          </div>
        </div>

        {/* School Info Pill */}
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">TA {schoolProfile.tahunAjaran}</span>
          </div>
          <span className="text-[11px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/40 font-mono">
            Sem. {schoolProfile.semester}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Utama
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate leading-tight flex items-center justify-between">
                    <span>{item.label}</span>
                  </div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Identity & Institutional Section */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 space-y-3">
          {/* Dynamic Active Logged-in Teacher / User Profile */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-3 border border-emerald-500/40 shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pengguna Aktif</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Terverifikasi</span>
              </span>
            </div>

            <div className="space-y-0.5">
              <div
                className="text-xs font-extrabold text-white truncate"
                title={currentSession?.user.name || schoolProfile.kepalaSekolah}
              >
                {currentSession?.user.name || schoolProfile.kepalaSekolah}
              </div>
              <div className="text-[11px] font-semibold text-emerald-200 truncate">
                {currentSession?.user.jabatan || 'Pendidik & Tenaga Kependidikan'}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate flex items-center justify-between pt-0.5">
                <span>NIP: {currentSession?.user.nip && currentSession?.user.nip !== '-' ? currentSession.user.nip : 'Honorer/PTK'}</span>
                {currentSession?.user.statusKepegawaian && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {currentSession.user.statusKepegawaian}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Institutional Headmaster Info (if not already logged in as Headmaster) */}
          {currentSession?.user.role !== 'Kepala Sekolah' && (
            <div className="bg-slate-950/40 rounded-xl px-2.5 py-1.5 border border-slate-800/70 text-[10px] flex items-center justify-between text-slate-400">
              <span className="truncate">Kepsek: <strong className="text-slate-200">{schoolProfile.kepalaSekolah}</strong></span>
              <span className="text-amber-400 font-bold shrink-0 ml-1">PNS</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onOpenShare}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 rounded-xl transition-colors border border-emerald-600/50 shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bagikan Aplikasi & Data</span>
            </button>

            <button
              onClick={onOpenDatabaseSync}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-blue-300 hover:text-white bg-blue-900/40 hover:bg-blue-900/60 rounded-xl transition-colors border border-blue-700/50 shadow-xs cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Database & Arsip 1 TA</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/50 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Profil Sekolah & Logo</span>
            </button>

            {/* Logout / Switch Account Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/80 rounded-xl transition-all border border-rose-800/60 shadow-xs cursor-pointer active:scale-98"
                title="Hapus sesi login dan kembali ke Halaman Akses/Login awal"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Keluar / Ganti Akun</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
