import React, { useState } from 'react';
import {
  X,
  Database,
  CloudCheck,
  RefreshCw,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Server,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    syncStatus,
    lastSyncTime,
    forceSyncNow,
    downloadFullDatabaseJSON,
    downloadMasterExcelArchive,
    restoreDatabaseFromJSON,
    schoolProfile,
    students,
    teachers,
    classes,
    attendanceRecords
  } = useSchool();

  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Apakah Anda yakin ingin memulihkan database dari file cadangan ini? Data saat ini akan diperbarui sesuai isi file cadangan.')) {
      e.target.value = '';
      return;
    }

    setIsRestoring(true);
    setRestoreMessage(null);
    try {
      const res = await restoreDatabaseFromJSON(file);
      if (res.success) {
        setRestoreMessage('Database berhasil dipulihkan dan disinkronkan ke server pusat!');
      } else {
        setRestoreMessage(`Gagal memulihkan database: ${res.error || 'Format file tidak sesuai'}`);
      }
    } catch (err: any) {
      setRestoreMessage(`Error: ${err.message}`);
    } finally {
      setIsRestoring(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Database className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Pusat Sinkronisasi & Arsip Database 1 Tahun Ajaran</h3>
              <p className="text-[11px] text-blue-200">
                SD Negeri Nambo 03 (NPSN: {schoolProfile.npsn}) &bull; TA {schoolProfile.tahunAjaran}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Real-time Status Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl mt-0.5 ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-100 text-emerald-700'
                    : syncStatus === 'syncing'
                    ? 'bg-blue-100 text-blue-700 animate-spin'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {syncStatus === 'synced'
                      ? 'Tersinkronisasi Online (Satu Kesatuan Data)'
                      : syncStatus === 'syncing'
                      ? 'Sedang Menyinkronkan...'
                      : 'Database Tersimpan Lokal (Offline)'}
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      syncStatus === 'synced'
                        ? 'bg-emerald-500 animate-pulse'
                        : syncStatus === 'syncing'
                        ? 'bg-blue-500 animate-ping'
                        : 'bg-amber-500'
                    }`}
                  ></span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sinkronisasi terakhir: {lastSyncTime ? `${lastSyncTime} WIB` : 'Baru saja'} &bull; Database Server Terpusat
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Semua data yang diinput tetap utuh dan sama saat dibagikan ke siapapun (Kepala Sekolah, Guru, Staf TU).
                </p>
              </div>
            </div>

            <button
              onClick={() => forceSyncNow()}
              disabled={syncStatus === 'syncing'}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Sinkron Sekarang</span>
            </button>
          </div>

          {/* Quick Data Summary Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="block text-[10px] text-blue-600 font-bold uppercase">Siswa Terdaftar</span>
              <span className="text-base font-extrabold text-blue-900">{students.length} Siswa</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="block text-[10px] text-emerald-600 font-bold uppercase">Rombel & Ekskul</span>
              <span className="text-base font-extrabold text-emerald-900">{classes.length} Rombel</span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="block text-[10px] text-purple-600 font-bold uppercase">Guru & GTK</span>
              <span className="text-base font-extrabold text-purple-900">{teachers.length} PTK</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="block text-[10px] text-amber-600 font-bold uppercase">Presensi Harian</span>
              <span className="text-base font-extrabold text-amber-900">{attendanceRecords.length} Catatan</span>
            </div>
          </div>

          {/* Download 1 Tahun Ajaran Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download & Ekspor Master Arsip Satu Tahun Ajaran (2026-2027)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Excel Master */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Master Buku Induk & Arsip Excel (.xlsx)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                    Berisi 8 lembar kerja terpadu: Profil Sekolah, Rombel, Buku Induk Siswa Lengkap, GTK, Jam Mengajar, Presensi Harian, Rekap Umur, dan Rapot Kinerja Guru.
                  </p>
                </div>
                <button
                  onClick={downloadMasterExcelArchive}
                  className="w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master Excel (.xlsx)</span>
                </button>
              </div>

              {/* JSON Backup */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-1">
                    <HardDrive className="w-4 h-4" />
                    <span>Cadangan Penuh Database (.json)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                    File cadangan snapshot seluruh database sistem. Dapat disimpan di flashdisk/Google Drive dan dipulihkan kapan saja ke aplikasi.
                  </p>
                </div>
                <button
                  onClick={downloadFullDatabaseJSON}
                  className="w-full px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON (.json)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Restore Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Pulihkan / Restore Database Dari Cadangan (.json)</span>
            </h4>
            <p className="text-[11px] text-slate-600">
              Pilih file cadangan JSON yang sebelumnya diunduh untuk mengembalikan seluruh isi aplikasi ke kondisi cadangan tersebut.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Pilih File Backup JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  disabled={isRestoring}
                  className="hidden"
                />
              </label>

              {isRestoring && (
                <span className="text-[11px] text-blue-700 font-semibold animate-pulse">
                  Sedang memproses pemulihan data...
                </span>
              )}
            </div>

            {restoreMessage && (
              <div className="p-3 bg-blue-100 text-blue-900 rounded-xl text-[11px] font-semibold flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{restoreMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Sistem SIAKAD SD Negeri Nambo 03 &bull; Klapanunggal, Kab. Bogor
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
