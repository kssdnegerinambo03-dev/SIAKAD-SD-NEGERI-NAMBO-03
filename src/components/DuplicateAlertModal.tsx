import React from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const DuplicateAlertModal: React.FC = () => {
  const { duplicateAlert, closeDuplicateAlert } = useSchool();

  if (!duplicateAlert.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-lg w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{duplicateAlert.title}</h3>
              <p className="text-xs text-rose-100 font-medium">Validasi Identitas Tunggal Siswa Kemendikbudristek</p>
            </div>
          </div>
          <button
            onClick={closeDuplicateAlert}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">
              {duplicateAlert.message}
            </div>
          </div>

          {duplicateAlert.duplicateNisns && duplicateAlert.duplicateNisns.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Rincian NISN yang Terdeteksi Duplikat:
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {duplicateAlert.duplicateNisns.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs gap-1"
                  >
                    <div className="font-mono font-bold text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-md w-fit">
                      NISN: {item.nisn}
                    </div>
                    <div className="text-slate-700">
                      {item.nama && <span className="font-semibold">{item.nama}</span>}
                      {item.context && <span className="text-slate-500 ml-1.5 italic">({item.context})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 border border-amber-200">
            <strong>Petunjuk:</strong> NISN (Nomor Induk Siswa Nasional) bersifat unik dan tidak boleh ganda di seluruh sistem administrasi sekolah SD Negeri Nambo 03. Pastikan memasukkan nomor NISN resmi yang benar dari kartu NISN atau data Dapodik siswa.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={closeDuplicateAlert}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-200 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
