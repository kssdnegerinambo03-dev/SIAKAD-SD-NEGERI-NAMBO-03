import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Server,
  CloudCheck,
  Download,
  FileSpreadsheet,
  HardDrive,
  Users,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose }) => {
  const {
    schoolProfile,
    lastSyncTime,
    syncStatus,
    forceSyncNow,
    downloadFullDatabaseJSON,
    downloadMasterExcelArchive,
    students,
    classes,
    teachers
  } = useSchool();

  const [copied, setCopied] = useState(false);
  const [isSyncingBeforeShare, setIsSyncingBeforeShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Determine the best share URL (prefer current location, or shared URL)
      const currentUrl = window.location.href.split('#')[0];
      setShareUrl(currentUrl);

      // Trigger automatic save to server so the shared data is 100% up-to-date
      setIsSyncingBeforeShare(true);
      forceSyncNow().finally(() => {
        setIsSyncingBeforeShare(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Share2 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Bagikan Aplikasi & Data Terpadu</h3>
              <p className="text-[11px] text-emerald-100">
                SD Negeri Nambo 03 &bull; TA {schoolProfile.tahunAjaran}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Status Badge */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                {isSyncingBeforeShare ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <CloudCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="font-bold text-emerald-950 text-sm block">
                  {isSyncingBeforeShare ? 'Memastikan Data Tersimpan...' : 'Data Terkini Siap Dibagikan'}
                </span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  Tersimpan di server: {lastSyncTime ? `${lastSyncTime} WIB` : 'Baru saja'}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[10px] uppercase">
              Konsisten & Terpadu
            </span>
          </div>

          {/* Share Link Input Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Tautan Aplikasi (Salin & Kirim ke Guru / Kepala Sekolah):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>
            </div>
            {copied && (
              <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Tautan berhasil disalin ke clipboard! Siap dibagikan melalui WhatsApp atau email.</span>
              </p>
            )}
          </div>

          {/* Explanation of how data persistence works */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-[11px] text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cara Kerja Konsistensi Data:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                <strong>Data Tetap Ada:</strong> Setiap perubahan (input siswa, presensi, kelas, kinerja) disimpan langsung ke database server terpadu.
              </li>
              <li>
                <strong>Terkoneksi Antar Pengguna:</strong> Saat tautan ini dibuka oleh orang lain, aplikasi langsung memuat kondisi data terakhir yang telah Anda simpan.
              </li>
              <li>
                <strong>Orang Lain Bisa Mengedit & Menyimpan:</strong> Guru atau staf lain yang membuka tautan dapat menambah atau mengubah data, lalu menekan tombol <em>"Simpan Data"</em>, dan data terbaru tersebut akan menjadi acuan bersama bagi semua orang.
              </li>
            </ul>
          </div>

          {/* Current Database Summary */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              <span>
                Data Saat Ini: <strong>{students.length} Siswa</strong> &bull; <strong>{classes.length} Rombel</strong> &bull; <strong>{teachers.length} PTK</strong>
              </span>
            </div>
            <span className="text-[11px] font-bold text-blue-700">TA 2026-2027</span>
          </div>

          {/* Master Backup Options */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <span className="block text-[11px] font-bold text-slate-600 uppercase">
              Ingin menyimpan cadangan dokumen fisik?
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadMasterExcelArchive}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Master Excel (.xlsx)</span>
              </button>
              <button
                onClick={downloadFullDatabaseJSON}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-300 transition-colors flex items-center gap-1.5"
              >
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                <span>Download Backup JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            SIAKAD SD Negeri Nambo 03 &bull; NPSN 20200352
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
