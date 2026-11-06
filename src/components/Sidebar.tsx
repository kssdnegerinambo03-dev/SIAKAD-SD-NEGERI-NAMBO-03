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
  UserCheck,
  BookOpenCheck,
  KeyRound
} from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';
import { useSchool } from '../context/SchoolContext';
import { AuthSession } from './LoginScreen';

export type ActiveTab = 'dashboard' | 'input-data' | 'manajemen-kelas' | 'kepegawaian' | 'absensi-umur' | 'sinkronisasi' | 'perangkat-ajar';

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
  onOpenChangePassword?: () => void;
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
  onLogout,
  onOpenChangePassword
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
      id: 'perangkat-ajar' as ActiveTab,
      label: 'Perangkat Ajar Mendalam',
      sublabel: 'Prota, Promes, Koding & Modul',
      icon: BookOpenCheck,
      badge: 'Deep Learning'
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

        {/* School Info Pill & Prominent Share Button */}
        <div className="p-3 bg-slate-800/40 border-b border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">TA {schoolProfile.tahunAjaran}</span>
            </div>
            <span className="text-[11px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/40 font-mono">
              Sem. {schoolProfile.semester}
            </span>
          </div>

          {/* Prominent Bagikan Aplikasi Button (Accessible to all users) */}
          <button
            onClick={onOpenShare}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-md shadow-emerald-900/30 cursor-pointer group active:scale-98"
          >
            <Share2 className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
            <span>Bagikan Aplikasi & Data</span>
          </button>
        </div>

        {/* Navigation Links - Unobstructed and Full Height */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Utama ({menuItems.length} Modul)
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate leading-tight flex items-center justify-between">
                    <span>{item.label}</span>
                  </div>
                  <div
                    className={`text-[10px] truncate mt-0.5 ${
                      isActive ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
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

        {/* Compact, Non-Obstructing User Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
          {/* Quick Tools Row */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onOpenDatabaseSync}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-bold text-blue-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/70 rounded-lg transition-colors border border-blue-800/40 cursor-pointer"
              title="Database & Sinkronisasi 1 TA"
            >
              <Database className="w-3 h-3 text-blue-400" />
              <span className="truncate">Database & Arsip</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50 cursor-pointer"
              title="Profil Sekolah & Logo"
            >
              <Settings className="w-3 h-3 text-slate-400" />
              <span className="truncate">Profil Sekolah</span>
            </button>
          </div>

          {/* Compact User Identity Pill */}
          <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                {(currentSession?.user.name || schoolProfile.kepalaSekolah).charAt(0)}
              </div>
              <div className="min-w-0">
                <div
                  className="text-xs font-bold text-white truncate"
                  title={currentSession?.user.name || schoolProfile.kepalaSekolah}
                >
                  {currentSession?.user.name || schoolProfile.kepalaSekolah}
                </div>
                <div className="text-[10px] text-emerald-400 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">{currentSession?.user.jabatan || 'Guru SDN Nambo 03'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onOpenChangePassword && (
                <button
                  onClick={onOpenChangePassword}
                  className="p-1.5 text-amber-400 hover:text-white hover:bg-amber-900/60 rounded-lg transition-colors border border-amber-900/40 cursor-pointer"
                  title="Ganti Password Akun"
                  aria-label="Ganti Password Akun"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-900/60 rounded-lg transition-colors border border-rose-900/40 cursor-pointer"
                  title="Keluar / Ganti Akun"
                  aria-label="Keluar / Ganti Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
