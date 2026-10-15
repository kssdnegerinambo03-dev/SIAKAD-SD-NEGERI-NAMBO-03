import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DuplicateAlertModal } from './components/DuplicateAlertModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { DatabaseSyncModal } from './components/DatabaseSyncModal';
import { DashboardView } from './components/DashboardView';
import { DataInputView } from './components/DataInputView';
import { ClassManagementView } from './components/ClassManagementView';
import { StaffManagementView } from './components/StaffManagementView';
import { AttendanceView } from './components/AttendanceView';
import { OfficialLogo } from './components/OfficialLogo';
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  ShieldCheck,
  Building2,
  Heart
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatabaseSyncOpen, setIsDatabaseSyncOpen] = useState(false);
  const { schoolProfile } = useSchool();

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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Navbar */}
        <Navbar
          onToggleMobileMenu={() => setIsOpenMobile(prev => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDatabaseSync={() => setIsDatabaseSyncOpen(true)}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'input-data' && <DataInputView />}
          {activeTab === 'manajemen-kelas' && <ClassManagementView />}
          {activeTab === 'kepegawaian' && <StaffManagementView />}
          {activeTab === 'absensi-umur' && <AttendanceView />}
        </main>

        {/* Official Footer with School Identity */}
        <footer className="mt-auto bg-white border-t border-slate-200/80 px-4 sm:px-8 py-5 text-xs text-slate-500">
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

        {/* Mobile Bottom Quick Navigation Bar (Sticky for Mobile-First experience) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'dashboard' ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('input-data')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'input-data' ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            <UserPlus className="w-5 h-5 mb-0.5" />
            <span>Input Data</span>
          </button>

          <button
            onClick={() => setActiveTab('manajemen-kelas')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'manajemen-kelas' ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            <GraduationCap className="w-5 h-5 mb-0.5" />
            <span>Kelas & Siswa</span>
          </button>

          <button
            onClick={() => setActiveTab('kepegawaian')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'kepegawaian' ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span>Kepegawaian</span>
          </button>

          <button
            onClick={() => setActiveTab('absensi-umur')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'absensi-umur' ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            <CalendarCheck className="w-5 h-5 mb-0.5" />
            <span>Absensi</span>
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
