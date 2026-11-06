import React, { useState } from 'react';
import { OfficialLogo } from './OfficialLogo';
import { useSchool } from '../context/SchoolContext';
import { SchoolRole } from '../types';
import {
  ShieldCheck,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  School,
  Lock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award,
  ChevronDown,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

export interface AuthSession {
  isAuthenticated: boolean;
  npsn: string;
  user: {
    id: string;
    name: string;
    role: SchoolRole;
    jabatan: string;
    nip: string;
    nuptk?: string;
    statusKepegawaian: string;
  };
  loginTime: string;
}

export const AUTH_STORAGE_KEY = 'sdn_nambo03_auth_session';

interface LoginScreenProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { schoolProfile, teachers, staff, setCurrentActiveUser, verifyUserPassword } = useSchool();

  const [npsnInput, setNpsnInput] = useState('20200352');
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string>('');
  const [customNameInput, setCustomNameInput] = useState<string>('');
  const [useManualInput, setUseManualInput] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('20200352');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Build the complete list of authorized school personnel (Principal + 11 Teachers + 3 Staff)
  const registeredPersonnel = [
    {
      id: 'kepsek',
      name: schoolProfile.kepalaSekolah,
      role: 'Kepala Sekolah' as SchoolRole,
      jabatan: 'Kepala Sekolah SD Negeri Nambo 03',
      nip: schoolProfile.nipKepalaSekolah,
      nuptk: '4949764665210083',
      statusKepegawaian: 'PNS',
      tag: 'Pimpinan'
    },
    ...teachers.map(t => {
      let role: SchoolRole = 'Guru Kelas';
      if (t.jabatan.toLowerCase().includes('pai')) role = 'Guru Mapel';
      if (t.jabatan.toLowerCase().includes('pjok')) role = 'Guru Mapel';
      return {
        id: t.id,
        name: t.gelar ? `${t.nama}, ${t.gelar}` : t.nama,
        rawName: t.nama,
        role,
        jabatan: t.jabatan,
        nip: t.nip,
        nuptk: t.nuptk,
        statusKepegawaian: t.statusKepegawaian,
        tag: t.statusKepegawaian
      };
    }),
    ...staff.map(s => ({
      id: s.id,
      name: s.nama,
      rawName: s.nama,
      role: (s.tugas.toLowerCase().includes('operator') || s.tugas.toLowerCase().includes('administrasi')
        ? 'Operator Dapodik'
        : 'Staf Tata Usaha') as SchoolRole,
      jabatan: s.tugas,
      nip: s.nip || '-',
      nuptk: '-',
      statusKepegawaian: s.statusKepegawaian,
      tag: 'Tendik'
    }))
  ];

  const handleSelectQuickAccount = (personnelId: string) => {
    setSelectedPersonnelId(personnelId);
    setUseManualInput(false);
    setNpsnInput(schoolProfile.npsn);
    setErrorMessage(null);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const cleanInputNPSN = npsnInput.trim();
    const targetNPSN = schoolProfile.npsn.trim();

    // 1. Validate NPSN
    if (cleanInputNPSN !== targetNPSN) {
      setErrorMessage(`NPSN "${cleanInputNPSN}" tidak cocok! Masukkan NPSN resmi SD Negeri Nambo 03: ${targetNPSN}`);
      setIsSubmitting(false);
      return;
    }

    // 2. Validate Teacher / Staff Name
    let matchedPersonnel: (typeof registeredPersonnel)[0] | undefined;

    if (!useManualInput && selectedPersonnelId) {
      matchedPersonnel = registeredPersonnel.find(p => p.id === selectedPersonnelId);
    } else if (customNameInput.trim()) {
      const search = customNameInput.trim().toLowerCase();
      matchedPersonnel = registeredPersonnel.find(
        p =>
          p.name.toLowerCase().includes(search) ||
          ('rawName' in p && p.rawName.toLowerCase().includes(search)) ||
          p.nip.includes(search)
      );
    } else if (selectedPersonnelId) {
      matchedPersonnel = registeredPersonnel.find(p => p.id === selectedPersonnelId);
    }

    if (!matchedPersonnel) {
      setErrorMessage(
        useManualInput
          ? `Nama atau NIP "${customNameInput}" tidak terdaftar di database resmi SDN Nambo 03. Silakan pilih dari daftar atau gunakan nama yang sesuai SK.`
          : 'Silakan pilih Nama Guru / Tenaga Pendidik yang terdaftar untuk melanjutkan.'
      );
      setIsSubmitting(false);
      return;
    }

    // 3. Validate Password (default is school NPSN 20200352)
    const isPasswordValid = verifyUserPassword(matchedPersonnel.id, passwordInput);
    if (!isPasswordValid) {
      setErrorMessage(
        'Password salah! Password sementara pertama kali membuka aplikasi adalah NPSN sekolah (20200352). Jika Anda sudah pernah mengganti password, silakan gunakan password baru Anda.'
      );
      setIsSubmitting(false);
      return;
    }

    // Validation successful!
    setSuccessAnimation(true);

    const authSession: AuthSession = {
      isAuthenticated: true,
      npsn: cleanInputNPSN,
      user: {
        id: matchedPersonnel.id,
        name: matchedPersonnel.name,
        role: matchedPersonnel.role,
        jabatan: matchedPersonnel.jabatan,
        nip: matchedPersonnel.nip,
        nuptk: matchedPersonnel.nuptk,
        statusKepegawaian: matchedPersonnel.statusKepegawaian
      },
      loginTime: new Date().toISOString()
    };

    setTimeout(() => {
      // Save session
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
      }

      // Sync active user to SchoolContext
      setCurrentActiveUser({
        name: matchedPersonnel!.name,
        role: matchedPersonnel!.role,
        label: `${matchedPersonnel!.role} (${matchedPersonnel!.name})`
      });

      onLoginSuccess(authSession);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden select-none">
      {/* Background Decorative Rings & Ambient Glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Top Decorative Border Highlight */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-400 to-amber-400" />

          {/* School Emblem & Header */}
          <div className="text-center space-y-3 pt-2">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-linear-to-r from-emerald-500 to-amber-400 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition duration-300" />
                <div className="relative p-1 bg-slate-950 rounded-full ring-2 ring-emerald-400/60 shadow-lg">
                  <OfficialLogo size={80} customLogoUrl={schoolProfile.logoUrl} className="rounded-full" />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold tracking-wide uppercase">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Akses Terpadu SIAKAD</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
                SD NEGERI NAMBO 03
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                Kecamatan Klapanunggal, Kabupaten Bogor • Jawa Barat
              </p>
            </div>
          </div>

          {/* Lock Screen Notice */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Silakan masukkan <strong className="text-white">NPSN Sekolah (20200352)</strong> dan pilih/masukkan identitas <strong className="text-emerald-300">Nama Guru / Kepala Sekolah</strong> yang terdaftar untuk membuka dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Field 1: NPSN Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  NPSN Sekolah
                </span>
                <button
                  type="button"
                  onClick={() => setNpsnInput(schoolProfile.npsn)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
                >
                  NPSN Resmi: {schoolProfile.npsn}
                </button>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={npsnInput}
                  onChange={e => {
                    setNpsnInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Masukkan 8 digit NPSN (20200352)"
                  maxLength={12}
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  required
                />
                {npsnInput === schoolProfile.npsn && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Valid</span>
                  </div>
                )}
              </div>
            </div>

            {/* Field 2: Nama Guru / Identitas GTK */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  Nama Guru / PTK Terdaftar
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseManualInput(!useManualInput);
                    setErrorMessage(null);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white underline underline-offset-2"
                >
                  {useManualInput ? 'Pilih dari Dropdown' : 'Ketik Manual / Cari'}
                </button>
              </div>

              {!useManualInput ? (
                <div className="relative">
                  <select
                    value={selectedPersonnelId}
                    onChange={e => {
                      setSelectedPersonnelId(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full appearance-none bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 transition-all pr-10 cursor-pointer"
                  >
                    <option value="" className="text-slate-500">-- Pilih Nama Guru / Kepala Sekolah --</option>
                    {registeredPersonnel.map(p => (
                      <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                        {p.name} — {p.jabatan} ({p.tag})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customNameInput}
                    onChange={e => {
                      setCustomNameInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Ketik nama atau NIP guru (contoh: Dian Purnamasari)"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  />
                  <p className="text-[10px] text-slate-400">
                    Sistem akan mencocokkan nama dengan 14 GTK resmi dan Kepala Sekolah.
                  </p>
                </div>
              )}
            </div>

            {/* Field 3: Password Akun */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  Password Akun
                </label>
                <span className="text-[10px] text-amber-300 font-medium">
                  Awal: NPSN ({schoolProfile.npsn})
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => {
                    setPasswordInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Masukkan password akun (awal: 20200352)"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 transition-all pr-12 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Password sementara pertama kali membuka aplikasi adalah <strong className="text-amber-300 font-mono">20200352</strong>. Anda dapat mengubahnya setelah masuk.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Success Animation Banner */}
            {successAnimation && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-400 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <p className="font-bold text-white">Verifikasi Identitas Berhasil!</p>
                  <p className="text-[11px] text-emerald-300">Membuka Dashboard SD Negeri Nambo 03...</p>
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-sm bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Simpan sesi login di perangkat ini</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">TA 2026/2027</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || successAnimation}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-slate-900 bg-linear-to-r from-emerald-400 via-teal-300 to-amber-300 hover:from-emerald-300 hover:to-amber-200 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Verifikasi & Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Select Quick-Login Badges */}
          <div className="border-t border-slate-800 pt-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Akses Cepat Warga Sekolah (Pilih Langsung):
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {/* Kepala Sekolah */}
              <button
                type="button"
                onClick={() => handleSelectQuickAccount('kepsek')}
                className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-0.5 ${
                  selectedPersonnelId === 'kepsek'
                    ? 'bg-amber-950/60 border-amber-500/80 ring-1 ring-amber-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                  <Award className="w-3 h-3" />
                  <span>Kepala Sekolah</span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  AM. Mega Purnamatati
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  NIP: 198607172014062001
                </div>
              </button>

              {/* Guru Kelas 1A */}
              <button
                type="button"
                onClick={() => handleSelectQuickAccount('t-1')}
                className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-0.5 ${
                  selectedPersonnelId === 't-1'
                    ? 'bg-emerald-950/60 border-emerald-500/80 ring-1 ring-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <GraduationCap className="w-3 h-3" />
                  <span>Guru Kelas 1A (PPPK)</span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  Dian Purnamasari, S.Pd.
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  NIP: 199106242022212000
                </div>
              </button>

              {/* Guru Kelas 2A */}
              <button
                type="button"
                onClick={() => handleSelectQuickAccount('t-3')}
                className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-0.5 ${
                  selectedPersonnelId === 't-3'
                    ? 'bg-emerald-950/60 border-emerald-500/80 ring-1 ring-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <GraduationCap className="w-3 h-3" />
                  <span>Guru Kelas 2A (PPPK)</span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  Asim, S.Pd.
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  NIP: 197605052023211000
                </div>
              </button>

              {/* Operator Dapodik & TU */}
              <button
                type="button"
                onClick={() => handleSelectQuickAccount('s-1')}
                className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-0.5 ${
                  selectedPersonnelId === 's-1'
                    ? 'bg-blue-950/60 border-blue-500/80 ring-1 ring-blue-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400">
                  <School className="w-3 h-3" />
                  <span>Operator Dapodik & TU</span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  Nurvi Latifah
                </div>
                <div className="text-[9px] text-slate-400">
                  Tenaga Administrasi Sekolah
                </div>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
            Sistem Informasi Akademik Terpadu • Kemendikbudristek RI
          </div>
        </div>
      </div>
    </div>
  );
};
