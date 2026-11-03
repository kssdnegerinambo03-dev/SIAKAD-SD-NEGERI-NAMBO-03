import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DuplicateAlertModal } from './components/DuplicateAlertModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { DatabaseSyncModal } from './components/DatabaseSyncModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { DashboardView } from './components/DashboardView';
import { DataInputView } from './components/DataInputView';
import { ClassManagementView } from './components/ClassManagementView';
import { StaffManagementView } from './components/StaffManagementView';
import { AttendanceView } from './components/AttendanceView';
import { SyncMonitoringView } from './components/SyncMonitoringView';
import { PerangkatAjarView } from './components/PerangkatAjarView';
import { OfficialLogo } from './components/OfficialLogo';
import { LoginScreen, AuthSession, AUTH_STORAGE_KEY } from './components/LoginScreen';
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  ShieldCheck,
  Building2,
  Heart,
  Server,
  BookOpenCheck
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const local = localStorage.getItem(AUTH_STORAGE_KEY);
      if (local) return JSON.parse(local);
      const sess = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (sess) return JSON.parse(sess);
    } catch {
      // fallback
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatabaseSyncOpen, setIsDatabaseSyncOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { schoolProfile } = useSchool();

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setSession(null);
  };

  // If user is not authenticated, show Lock/Login Screen and lock the dashboard
  if (!session || !session.isAuthenticated) {
    return <LoginScreen onLoginSuccess={newSession => setSession(newSession)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDatabaseSync={() => setIsDatabaseSyncOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        currentSession={session}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Navbar */}
        <Navbar
          onToggleMobileMenu={() => setIsOpenMobile(prev => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDatabaseSync={() => setIsDatabaseSyncOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          currentSession={session}
          onLogout={handleLogout}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-12">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'input-data' && <DataInputView />}
          {activeTab === 'manajemen-kelas' && <ClassManagementView />}
          {activeTab === 'kepegawaian' && <StaffManagementView />}
          {activeTab === 'perangkat-ajar' && <PerangkatAjarView />}
          {activeTab === 'absensi-umur' && <AttendanceView />}
          {activeTab === 'sinkronisasi' && <SyncMonitoringView />}
        </main>

        {/* Official Footer with School Identity */}
        <footer className="mt-auto bg-white border-t border-slate-200/80 px-4 sm:px-8 py-5 text-xs text-slate-500 mb-16 lg:mb-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <OfficialLogo size={32} customLogoUrl={schoolProfile.logoUrl} />
              <div>
                <p className="font-extrabold text-slate-800 text-xs sm:text-sm">
                  {schoolProfile.namaSekolah} • NPSN {schoolProfile.npsn}
                </p>
                <p className="text-[11px] text-slate-500">
                  {schoolProfile.alamat}
                </p>
              </div>
            </div>

            <div className="space-y-0.5 text-[11px]">
              <p>
                Kepala Sekolah: <strong className="text-slate-800">{schoolProfile.kepalaSekolah}</strong> (NIP. {schoolProfile.nipKepalaSekolah})
              </p>
              <p className="text-slate-400">
                SIAKAD Terintegrasi TA {schoolProfile.tahunAjaran} Semester {schoolProfile.semester} • Kemendikbudristek RI
              </p>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Quick Navigation Bar (Unobstructed & Cleanly Scrollable) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shadow-2xl scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
              activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('perangkat-ajar')}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
              activeTab === 'perangkat-ajar' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpenCheck className="w-4 h-4 mb-0.5" />
            <span>Perangkat Ajar</span>
          </button>

          <button
            onClick={() => setActiveTab('input-data')}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
              activeTab === 'input-data' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4 mb-0.5" />
            <span>Input Data</span>
          </button>

          <button
            onClick={() => setActiveTab('manajemen-kelas')}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
              activeTab === 'manajemen-kelas' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            <span>Kelas & Siswa</span>
          </button>

          <button
            onClick={() => setActiveTab('kepegawaian')}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
              activeTab === 'kepegawaian' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4 mb-0.5" />
            <span>Kinerja Guru</span>
          </button>

          <button
            onClick={() => setActiveTab('absensi-umur')}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
              activeTab === 'absensi-umur' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck className="w-4 h-4 mb-0.5" />
            <span>Presensi & Usia</span>
          </button>

          <button
            onClick={() => setActiveTab('sinkronisasi')}
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
              activeTab === 'sinkronisasi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4 mb-0.5" />
            <span>Sinkronisasi</span>
          </button>
        </nav>
      </div>

      {/* Global Modals */}
      <DuplicateAlertModal />
      <SchoolSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <DatabaseSyncModal
        isOpen={isDatabaseSyncOpen}
        onClose={() => setIsDatabaseSyncOpen(false)}
      />
      <ShareLinkModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainAppContent />
    </SchoolProvider>
  );
}
