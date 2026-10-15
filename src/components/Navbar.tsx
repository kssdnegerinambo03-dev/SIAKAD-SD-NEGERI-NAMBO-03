import React, { useState } from 'react';
import {
  Menu,
  RotateCcw,
  Building2,
  Calendar,
  ShieldCheck,
  Settings,
  Database,
  Save,
  Check,
  Share2,
  RefreshCw,
  CloudCheck
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { OfficialLogo } from './OfficialLogo';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenSettings: () => void;
  onOpenDatabaseSync: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenSettings,
  onOpenDatabaseSync,
  onOpenShare
}) => {
  const { schoolProfile, resetAllToDefaults, forceSyncNow, syncStatus, lastSyncTime } = useSchool();
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveData = async () => {
    setIsSaving(true);
    await forceSyncNow();
    setIsSaving(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <OfficialLogo size={36} customLogoUrl={schoolProfile.logoUrl} className="lg:hidden" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight leading-none">
                    SD NEGERI NAMBO 03
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    NPSN {schoolProfile.npsn}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate hidden md:block">
                  Kecamatan Klapanunggal, Kabupaten Bogor • Jawa Barat
                </p>
              </div>
            </div>
          </div>

          {/* Right: Year badge, Save button, Share button, Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-700">TA 2026-2027</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-700 font-bold">Sem. {schoolProfile.semester}</span>
            </div>

            {/* Prominent SAVE DATA button */}
            <button
              onClick={handleSaveData}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all active:scale-95 disabled:bg-emerald-400"
              title="Simpan seluruh perubahan data saat ini ke server pusat secara permanen"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Data'}</span>
            </button>

            {/* SHARE button */}
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-all active:scale-95"
              title="Bagikan tautan aplikasi dengan kondisi data terakhir"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>

            {/* Database & Archive button */}
            <button
              onClick={onOpenDatabaseSync}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
              title="Pusat Sinkronisasi & Arsip Satu Tahun Ajaran (Download Master Excel & JSON)"
            >
              <Database className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Database & Arsip</span>
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Pengaturan Identitas & Logo Sekolah"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">Pengaturan</span>
            </button>

            <button
              onClick={resetAllToDefaults}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              title="Reset ke Data Awal Demo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden xl:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Save Toast Notification */}
      {saveToast && (
        <div className="fixed top-18 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-1.5 bg-emerald-500 text-slate-900 rounded-xl">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Perubahan Berhasil Disimpan!</p>
            <p className="text-[11px] text-slate-300">
              Data tersimpan di server terpadu SD Negeri Nambo 03 ({lastSyncTime || 'WIB'}).
            </p>
          </div>
        </div>
      )}
    </>
  );
};
