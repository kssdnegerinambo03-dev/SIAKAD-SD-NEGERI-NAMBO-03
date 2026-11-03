import React from 'react';
import { SchoolProfile } from '../types';

interface OfficialKopSuratProps {
  className?: string;
  schoolProfile?: Partial<SchoolProfile>;
  compact?: boolean;
}

/**
 * Official Kop Surat SD Negeri Nambo 03
 * Exactly matches the official letterhead of Pemerintah Kabupaten Bogor - Dinas Pendidikan:
 * - Left Logo: Lambang Pemerintah Kabupaten Bogor (Tegar Beriman)
 * - Right Logo: Lambang Resmi SD Negeri Nambo 03
 * - Header Center:
 *     PEMERINTAH KABUPATEN BOGOR
 *     DINAS PENDIDIKAN
 *     SD NEGERI NAMBO 03
 *     KECAMATAN KLAPANUNGGAL
 *     Jln. Raya Nambo Bantarkopo RT 01 RW 04 Desa Bantarjati
 *     Kecamatan Klapanunggal Kabupaten Bogor 16871
 *     Email.sdnnambo03bantarjati@gmail.com
 *     NPSN : 20200352                     NSS : 101020232021
 * - Double underline: Thick line + thin line
 */
export const OfficialKopSurat: React.FC<OfficialKopSuratProps> = ({
  className = '',
  schoolProfile,
  compact = false
}) => {
  const npsn = schoolProfile?.npsn || '20200352';
  const nss = (schoolProfile as any)?.nss || '101020232021';
  const email = schoolProfile?.email || 'sdnnambo03bantarjati@gmail.com';

  return (
    <div className={`w-full bg-white text-slate-900 ${className}`}>
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Logo Kiri: Pemkab Bogor */}
        <div className="shrink-0 flex items-center justify-center" style={{ width: compact ? 65 : 85 }}>
          <img
            src="/logo_kab_bogor.png"
            alt="Lambang Pemerintah Kabupaten Bogor"
            className="w-full object-contain max-h-24 select-none drop-shadow-xs"
            onError={(e) => {
              // fallback if cropped logo image is loading
              (e.currentTarget as HTMLImageElement).src = '/kop_surat_resmi_nambo_03.png';
              (e.currentTarget as HTMLImageElement).style.objectFit = 'none';
              (e.currentTarget as HTMLImageElement).style.objectPosition = 'left top';
            }}
          />
        </div>

        {/* Teks Kop Tengah */}
        <div className="flex-1 text-center font-serif leading-tight px-1">
          <div className="text-sm sm:text-base font-bold tracking-wider text-slate-900 uppercase">
            PEMERINTAH KABUPATEN BOGOR
          </div>
          <div className="text-sm sm:text-base font-bold tracking-wider text-slate-900 uppercase">
            DINAS PENDIDIKAN
          </div>
          <div className="text-lg sm:text-2xl font-black tracking-tight text-slate-950 uppercase mt-0.5">
            SD NEGERI NAMBO 03
          </div>
          <div className="text-sm sm:text-lg font-black tracking-wide text-slate-950 uppercase">
            KECAMATAN KLAPANUNGGAL
          </div>
          <div className="text-[11px] sm:text-xs font-normal text-slate-800 mt-1">
            Jln. Raya Nambo Bantarkopo RT 01 RW 04 Desa Bantarjati
          </div>
          <div className="text-[11px] sm:text-xs font-normal text-slate-800">
            Kecamatan Klapanunggal Kabupaten Bogor 16871
          </div>
          <div className="text-[11px] sm:text-xs font-normal text-slate-800">
            Email: <span className="text-blue-900 underline font-mono">{email}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 pt-1 px-4 sm:px-8 border-t border-slate-200/60 mt-1">
            <div>
              <span className="font-mono">NPSN : {npsn}</span>
            </div>
            <div>
              <span className="font-mono">NSS : {nss}</span>
            </div>
          </div>
        </div>

        {/* Logo Kanan: SD Negeri Nambo 03 */}
        <div className="shrink-0 flex items-center justify-center" style={{ width: compact ? 65 : 85 }}>
          <img
            src="/logo_nambo_03.jpg"
            alt="Lambang Resmi SD Negeri Nambo 03"
            className="w-full object-contain max-h-24 select-none drop-shadow-xs"
          />
        </div>
      </div>

      {/* Garis Ganda Resmi Kop Surat (Garis Tebal + Garis Tipis) */}
      <div className="w-full mt-1">
        <div className="w-full border-t-3 border-black"></div>
        <div className="w-full border-t border-black mt-0.5"></div>
      </div>
    </div>
  );
};
