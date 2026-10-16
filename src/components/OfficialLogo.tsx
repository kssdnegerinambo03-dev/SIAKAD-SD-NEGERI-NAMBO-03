import React, { useState } from 'react';
import officialLogoImg from '../assets/images/sdn_nambo_03_logo_1792141390269.jpg';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  customLogoUrl?: string;
}

export const OfficialLogo: React.FC<LogoProps> = ({
  className = '',
  size = 48,
  showText = false,
  textColor = 'text-slate-800',
  customLogoUrl
}) => {
  const [imageError, setImageError] = useState(false);
  const numericSize = typeof size === 'number' ? size : 48;
  const logoSrc = customLogoUrl || officialLogoImg || '/logo_nambo_03.jpg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105"
        style={{ width: numericSize, height: numericSize }}
        title="Logo Resmi SD Negeri Nambo 03 Kec. Klapanunggal - NPSN 20200352"
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="Logo Resmi SD Negeri Nambo 03"
            className="w-full h-full object-contain drop-shadow-md rounded-xl select-none"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-md select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 8-pointed scalloped lotus crest shield (Deep Royal Blue) */}
            <path
              d="M 100 8 C 114 20 126 18 140 18 C 146 32 158 40 172 48 C 166 64 174 76 182 90 C 182 108 174 120 172 136 C 158 144 146 154 140 168 C 126 168 114 176 100 192 C 86 176 74 168 60 168 C 54 154 42 144 28 136 C 26 120 18 108 18 90 C 26 76 34 64 28 48 C 42 40 54 32 60 18 C 74 18 86 20 100 8 Z"
              fill="#1A2D82"
              stroke="#E68A00"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Inner Golden Line */}
            <path
              d="M 100 16 C 112 26 122 24 135 24 C 140 36 150 43 162 50 C 157 63 164 74 171 86 C 171 102 164 112 162 126 C 150 133 140 141 135 154 C 122 154 112 161 100 176 C 88 161 78 154 65 154 C 60 141 50 133 38 126 C 36 112 29 102 29 86 C 36 74 43 63 38 50 C 50 43 60 36 65 24 C 78 24 88 26 100 16 Z"
              fill="none"
              stroke="#FACC15"
              strokeWidth="2"
            />

            {/* Inner Vibrant Green Circle */}
            <circle cx="100" cy="100" r="70" fill="#00A651" stroke="#FFFFFF" strokeWidth="2" />

            {/* Top Text Arc: SD NEGERI NAMBO 03 */}
            <path id="namboTextTop" d="M 38 100 A 62 62 0 1 1 162 100" fill="none" />
            <text fill="#FFFFFF" fontSize="13.5" fontWeight="900" letterSpacing="1.8" textAnchor="middle">
              <textPath href="#namboTextTop" startOffset="50%">
                SD NEGERI NAMBO 03
              </textPath>
            </text>

            {/* Left and Right Stars */}
            <polygon points="35,100 37,95 42,95 38,92 40,87 35,90 30,87 32,92 28,95 33,95" fill="#FFFFFF" />
            <polygon points="165,100 167,95 172,95 168,92 170,87 165,90 160,87 162,92 158,95 163,95" fill="#FFFFFF" />

            {/* Bottom Text Arc: KEC. KLAPANUNGGAL */}
            <path id="namboTextBottom" d="M 162 100 A 62 62 0 1 1 38 100" fill="none" />
            <text fill="#FFFFFF" fontSize="11" fontWeight="800" letterSpacing="1.5" textAnchor="middle">
              <textPath href="#namboTextBottom" startOffset="50%">
                KEC. KLAPANUNGGAL
              </textPath>
            </text>

            {/* Golden Rice Stalk (Padi) Left */}
            <path d="M 72 136 C 58 116 58 84 76 68" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="68" cy="126" rx="4" ry="2.5" transform="rotate(-30 68 126)" fill="#FACC15" />
            <ellipse cx="64" cy="114" rx="4" ry="2.5" transform="rotate(-40 64 114)" fill="#FACC15" />
            <ellipse cx="62" cy="102" rx="4" ry="2.5" transform="rotate(-45 62 102)" fill="#FACC15" />
            <ellipse cx="64" cy="90" rx="4" ry="2.5" transform="rotate(-55 64 90)" fill="#FACC15" />
            <ellipse cx="69" cy="78" rx="4" ry="2.5" transform="rotate(-65 69 78)" fill="#FACC15" />
            <ellipse cx="76" cy="68" rx="4" ry="2.5" transform="rotate(-75 76 68)" fill="#FACC15" />

            {/* White Cotton Stalk (Kapas) Right */}
            <path d="M 128 136 C 142 116 142 84 124 68" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="132" cy="126" r="3.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1" />
            <circle cx="136" cy="114" r="3.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1" />
            <circle cx="138" cy="102" r="3.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1" />
            <circle cx="136" cy="90" r="3.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1" />
            <circle cx="131" cy="78" r="3.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1" />
            <circle cx="124" cy="68" r="3.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1" />

            {/* Open Book: Orange Left Page, Blue Right Page */}
            {/* Left Page (Orange) */}
            <path
              d="M 100 86 L 76 80 L 74 112 L 100 118 Z"
              fill="#FF7A00"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Right Page (Blue) */}
            <path
              d="M 100 86 L 124 80 L 126 112 L 100 118 Z"
              fill="#0077C8"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Center Book Spine */}
            <line x1="100" y1="86" x2="100" y2="118" stroke="#FFFFFF" strokeWidth="2" />

            {/* Stylized Wing Ribbons below the book */}
            {/* Blue wings */}
            <path d="M 72 116 C 82 126 94 128 100 126 C 106 128 118 126 128 116 C 118 134 106 136 100 134 C 94 136 82 134 72 116 Z" fill="#0077C8" />
            {/* Orange lower wings */}
            <path d="M 78 128 C 88 136 96 138 100 137 C 104 138 112 136 122 128 C 114 142 104 144 100 143 C 96 144 86 142 78 128 Z" fill="#FF7A00" />

            {/* Tied bottom stalk knot */}
            <rect x="94" y="140" width="12" height="6" rx="2" fill="#EAB308" stroke="#78350F" strokeWidth="1" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`text-base font-extrabold tracking-tight ${textColor}`}>
            SD NEGERI NAMBO 03
          </span>
          <span className="text-xs font-semibold text-emerald-600 tracking-wide">
            NPSN: 20200352 • KEC. KLAPANUNGGAL
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            KABUPATEN BOGOR
          </span>
        </div>
      )}
    </div>
  );
};
