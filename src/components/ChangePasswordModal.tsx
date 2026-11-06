import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { AuthSession } from './LoginScreen';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: AuthSession | null;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentSession
}) => {
  const { schoolProfile, changeUserPassword } = useSchool();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentUserId = currentSession?.user.id || 'kepsek';
  const currentUserName = currentSession?.user.name || schoolProfile.kepalaSekolah;
  const currentUserRole = currentSession?.user.role || 'Kepala Sekolah';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!oldPassword) {
      setErrorMessage('Harap masukkan password saat ini / password lama.');
      return;
    }

    if (!newPassword) {
      setErrorMessage('Harap masukkan password baru.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('Password baru minimal harus 4 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi password baru tidak cocok. Harap periksa kembali.');
      return;
    }

    setIsSubmitting(true);

    const res = changeUserPassword(currentUserId, oldPassword, newPassword);

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    setSuccessMessage(res.message);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      onClose();
      setSuccessMessage(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Ganti Password Akun</h3>
              <p className="text-[11px] text-emerald-200 font-medium">
                SD Negeri Nambo 03 • NPSN {schoolProfile.npsn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Chip */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
            {currentUserName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{currentUserName}</div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{currentUserRole}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-mono">ID: {currentUserId}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Note Info */}
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              Password awal akun sebelum diubah adalah NPSN sekolah (<strong className="font-mono">20200352</strong>).
              Setelah diubah, gunakan password baru Anda untuk masuk selanjutnya.
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 animate-in zoom-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-950">Berhasil!</strong>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Field 1: Old Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password Saat Ini / Password Lama
            </label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                value={oldPassword}
                onChange={e => {
                  setOldPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Masukkan password saat ini (awal: 20200352)"
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 pr-10 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 2: New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password Baru (Minimal 4 Karakter)
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Ketik password baru Anda"
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 pr-10 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 3: Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Ketik ulang password baru Anda"
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 pr-10 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Password Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
