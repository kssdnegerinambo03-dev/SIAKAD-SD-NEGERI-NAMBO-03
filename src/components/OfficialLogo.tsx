import React from 'react';

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
  const numericSize = typeof size === 'number' ? size : 48;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {customLogoUrl ? (
        <img
          src={customLogoUrl}
          alt="Logo SD Negeri Nambo 03"
          className="object-contain rounded-full shadow-sm bg-white p-0.5 border border-emerald-100"
          style={{ width: numericSize, height: numericSize }}
        />
      ) : (
        <div
          className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105"
          style={{ width: numericSize, height: numericSize }}
          title="Logo Resmi SD Negeri Nambo 03 - NPSN 20200352"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Decorative Circle with Gold Rim */}
            <circle cx="100" cy="100" r="96" fill="#0B2F64" stroke="#EAB308" strokeWidth="6" />
            <circle cx="100" cy="100" r="88" fill="#0E3D7D" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />

            {/* Circular Text SD NEGERI NAMBO 03 - KABUPATEN BOGOR */}
            <path
              id="textPathTop"
              d="M 28 100 A 72 72 0 1 1 172 100"
              fill="none"
            />
            <text fill="#FEF08A" fontSize="13.5" fontWeight="800" letterSpacing="2.5" textAnchor="middle">
              <textPath href="#textPathTop" startOffset="50%">
                SD NEGERI NAMBO 03
              </textPath>
            </text>

            <path
              id="textPathBottom"
              d="M 172 100 A 72 72 0 1 1 28 100"
              fill="none"
            />
            <text fill="#FFFFFF" fontSize="10.5" fontWeight="700" letterSpacing="1.8" textAnchor="middle">
              <textPath href="#textPathBottom" startOffset="50%">
                NPSN 20200352 • BOGOR
              </textPath>
            </text>

            {/* Center Golden Pentagon Shield */}
            <path
              d="M 100 40 L 148 68 L 132 136 L 100 156 L 68 136 L 52 68 Z"
              fill="url(#shieldGrad)"
              stroke="#FACC15"
              strokeWidth="4"
              filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
            />

            {/* Inner Shield Background */}
            <path
              d="M 100 46 L 142 71 L 128 131 L 100 149 L 72 131 L 58 71 Z"
              fill="#0284C7"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />

            {/* Golden Rice & Cotton Wreath */}
            {/* Rice Stalk Left (Golden) */}
            <path
              d="M 64 126 C 60 106 63 80 82 66"
              stroke="#FACC15"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="66" cy="116" r="3.5" fill="#FACC15" />
            <circle cx="63" cy="104" r="3.5" fill="#FACC15" />
            <circle cx="65" cy="92" r="3.5" fill="#FACC15" />
            <circle cx="71" cy="80" r="3.5" fill="#FACC15" />
            <circle cx="79" cy="71" r="3.5" fill="#FACC15" />

            {/* Cotton Stalk Right (White-Green) */}
            <path
              d="M 136 126 C 140 106 137 80 118 66"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="134" cy="116" r="3.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="137" cy="104" r="3.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="135" cy="92" r="3.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="129" cy="80" r="3.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="121" cy="71" r="3.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />

            {/* Open Book of Knowledge */}
            <path
              d="M 78 116 C 88 112 96 112 100 118 C 104 112 112 112 122 116 L 122 130 C 112 126 104 126 100 131 C 96 126 88 126 78 130 Z"
              fill="#FFFFFF"
              stroke="#1E293B"
              strokeWidth="2"
            />
            <path d="M 100 118 L 100 131" stroke="#1E293B" strokeWidth="1.5" />

            {/* Central Flame / Torch of Education (Suluh Tut Wuri Handayani) */}
            <path
              d="M 100 68 C 94 77 91 85 95 94 C 97 99 100 101 100 101 C 100 101 103 99 105 94 C 109 85 106 77 100 68 Z"
              fill="url(#flameGrad)"
            />
            <path
              d="M 100 78 C 97 84 96 88 98 94 C 99 97 100 98 100 98 C 100 98 101 97 102 94 C 104 88 103 84 100 78 Z"
              fill="#FEF08A"
            />
            <rect x="97" y="101" width="6" height="12" rx="1.5" fill="#EAB308" stroke="#78350F" strokeWidth="1" />

            {/* Golden Star at the Apex */}
            <polygon
              points="100,48 102.5,54 108,54.5 104,58 105.2,63.5 100,60.5 94.8,63.5 96,58 92,54.5 97.5,54"
              fill="#FEF08A"
              stroke="#B45309"
              strokeWidth="0.8"
            />

            {/* Lower Banner Ribbon */}
            <path
              d="M 72 138 L 100 144 L 128 138 L 132 148 L 100 155 L 68 148 Z"
              fill="#E11D48"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />
            <text x="100" y="149" fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle" letterSpacing="0.8">
              BERAKHLAK
            </text>

            {/* Gradients */}
            <defs>
              <linearGradient id="shieldGrad" x1="52" y1="40" x2="148" y2="156" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.5" stopColor="#D97706" />
                <stop offset="1" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="flameGrad" x1="100" y1="68" x2="100" y2="101" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EF4444" />
                <stop offset="0.6" stopColor="#F97316" />
                <stop offset="1" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

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
