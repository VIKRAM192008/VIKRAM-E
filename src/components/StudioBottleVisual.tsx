import React, { useState } from 'react';

interface StudioBottleVisualProps {
  imageUrl?: string;
  code: string;
  name: string;
  categoryLabel: string;
  liquidHexPrimary: string;
  liquidHexSecondary: string;
  botanicalNote: string;
  volumeLabel?: string;
  customLabelText?: string;
  className?: string;
  forceBottleRender?: boolean;
}

export const StudioBottleVisual: React.FC<StudioBottleVisualProps> = ({
  imageUrl,
  code,
  name,
  categoryLabel,
  liquidHexPrimary,
  liquidHexSecondary,
  botanicalNote,
  volumeLabel = '16 FL OZ · 473 ML',
  customLabelText,
  className = '',
  forceBottleRender = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = Boolean(imageUrl && !imgFailed && !forceBottleRender);
  const safeId = `${code}-${name}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#F3F1EC] select-none flex items-center justify-center ${className}`}
    >
      {showPhoto ? (
        <img
          src={imageUrl}
          alt={`${name} — ${categoryLabel} cold-pressed organic juice in glass apothecary bottle`}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.03]"
        />
      ) : (
        /* Studio Travertine Plinth & Square Glass Apothecary Bottle Render */
        <div className="relative w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-[#F6F5F0] via-[#EFECE5] to-[#E5E0D5]">
          {/* Directional Morning Window Light Shadow Cast */}
          <div
            className="absolute inset-0 pointer-events-none opacity-45"
            style={{
              background:
                'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.9) 0%, rgba(243,241,236,0.2) 55%, rgba(214,208,196,0.6) 100%)',
            }}
          />

          <svg
            viewBox="0 0 360 280"
            className="w-full h-full max-h-[260px] transition-transform duration-200 group-hover:-translate-y-1"
            role="img"
            aria-label={`${name} cold-pressed glass bottle studio rendering`}
          >
            <defs>
              <linearGradient id={`liq-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={liquidHexSecondary} />
                <stop offset="55%" stopColor={liquidHexPrimary} />
                <stop offset="100%" stopColor={liquidHexPrimary} stopOpacity="0.96" />
              </linearGradient>

              <linearGradient id={`glass-sheen-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="18%" stopColor="#FFFFFF" stopOpacity="0.12" />
                <stop offset="82%" stopColor="#FFFFFF" stopOpacity="0.0" />
                <stop offset="94%" stopColor="#FFFFFF" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#181815" stopOpacity="0.14" />
              </linearGradient>

              <linearGradient id={`plinth-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EAE5DA" />
                <stop offset="65%" stopColor="#DFD9CC" />
                <stop offset="100%" stopColor="#CFC7B6" />
              </linearGradient>

              <filter id={`drop-shadow-${safeId}`} x="-20%" y="-10%" width="150%" height="140%">
                <feDropShadow dx="14" dy="10" stdDeviation="8" floodColor="#181815" floodOpacity="0.16" />
              </filter>
            </defs>

            {/* Travertine Stone Pedestal Slab */}
            <g transform="translate(0, 8)">
              <polygon
                points="56,228 304,228 326,248 34,248"
                fill={`url(#plinth-${safeId})`}
              />
              <rect x="34" y="248" width="292" height="14" fill="#C8BFAEE6" />
              {/* Subtle travertine pores */}
              <line x1="78" y1="254" x2="112" y2="254" stroke="#A89F8D" strokeWidth="1" strokeLinecap="round" />
              <line x1="210" y1="256" x2="255" y2="256" stroke="#A89F8D" strokeWidth="1" strokeLinecap="round" />
              <line x1="145" y1="252" x2="164" y2="252" stroke="#A89F8D" strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* Cast Shadow on Travertine */}
            <ellipse cx="196" cy="233" rx="58" ry="8" fill="#181815" opacity="0.18" />

            {/* Square French Apothecary Glass Bottle */}
            <g filter={`url(#drop-shadow-${safeId})`}>
              {/* Matte Black Tamper-Evident Ribbed Cap */}
              <rect x="160" y="18" width="40" height="20" rx="3" fill="#1F1F1C" />
              <line x1="160" y1="33" x2="200" y2="33" stroke="#52524B" strokeWidth="1" />
              {/* Cap vertical ribs */}
              {[165, 170, 175, 180, 185, 190, 195].map((xPos) => (
                <line key={xPos} x1={xPos} y1="20" x2={xPos} y2="31" stroke="#3A3A35" strokeWidth="1" />
              ))}

              {/* Glass Neck */}
              <path
                d="M163,38 L197,38 L201,58 L159,58 Z"
                fill="#FFFFFF"
                fillOpacity="0.65"
                stroke="#D4CFC4"
                strokeWidth="1.2"
              />

              {/* Outer Glass Bottle Body */}
              <path
                d="M159,58 C144,64 134,74 134,90 L134,222 C134,228 139,232 145,232 L215,232 C221,232 226,228 226,222 L226,90 C226,74 216,64 201,58 Z"
                fill="#FFFFFF"
                fillOpacity="0.78"
                stroke="#CBC5B9"
                strokeWidth="1.5"
              />

              {/* Cold-Pressed Liquid Fill */}
              <path
                d="M156,66 C145,71 138,79 138,91 L138,220 C138,224 141,227 146,227 L214,227 C219,227 222,224 222,220 L222,91 C222,79 215,71 204,66 Z"
                fill={`url(#liq-${safeId})`}
              />

              {/* Liquid Meniscus Highlight */}
              <ellipse
                cx="180"
                cy="66"
                rx="24"
                ry="3.5"
                fill={liquidHexSecondary}
                stroke="#FFFFFF"
                strokeOpacity="0.45"
                strokeWidth="0.8"
              />

              {/* Textured Cotton Paper Apothecary Front Label */}
              <rect
                x="143"
                y="102"
                width="74"
                height="96"
                rx="1.5"
                fill="#FBFBF9"
                stroke="#181815"
                strokeOpacity="0.12"
                strokeWidth="0.8"
              />

              {/* Label Inner Hairline Frame */}
              <rect
                x="146.5"
                y="105.5"
                width="67"
                height="89"
                fill="none"
                stroke="#181815"
                strokeOpacity="0.16"
                strokeWidth="0.5"
              />

              {/* Label Typography */}
              <text
                x="180"
                y="117"
                textAnchor="middle"
                fill="#5C5B54"
                fontSize="5.5"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.2"
              >
                SOLSTICE PRESS
              </text>

              <line x1="154" y1="122" x2="206" y2="122" stroke="#181815" strokeOpacity="0.15" strokeWidth="0.5" />

              <text
                x="180"
                y="133"
                textAnchor="middle"
                fill="#181815"
                fontSize="6.5"
                fontWeight="600"
                fontFamily="IBM Plex Mono, monospace"
              >
                {code}
              </text>

              <text
                x="180"
                y="147"
                textAnchor="middle"
                fill="#181815"
                fontSize="9.5"
                fontWeight="700"
                fontFamily="Cormorant Garamond, Georgia, serif"
              >
                {name.length > 16 ? `${name.slice(0, 15)}.` : name}
              </text>

              <text
                x="180"
                y="158"
                textAnchor="middle"
                fill="#5C5B54"
                fontSize="5.2"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {customLabelText
                  ? customLabelText.slice(0, 20).toUpperCase()
                  : categoryLabel.toUpperCase()}
              </text>

              {/* Color Accent Bar on Label */}
              <rect x="164" y="165" width="32" height="2.5" fill={liquidHexPrimary} opacity="0.85" />

              <text
                x="180"
                y="177"
                textAnchor="middle"
                fill="#5C5B54"
                fontSize="4.8"
                fontFamily="IBM Plex Mono, monospace"
              >
                RAW · UNPASTEURIZED
              </text>

              <text
                x="180"
                y="187"
                textAnchor="middle"
                fill="#181815"
                fontSize="5.2"
                fontWeight="500"
                fontFamily="IBM Plex Mono, monospace"
              >
                {volumeLabel}
              </text>

              {/* Specular Glass Highlight Overlay */}
              <path
                d="M159,58 C144,64 134,74 134,90 L134,222 C134,228 139,232 145,232 L215,232 C221,232 226,228 226,222 L226,90 C226,74 216,64 201,58 Z"
                fill={`url(#glass-sheen-${safeId})`}
                pointerEvents="none"
              />

              {/* Cold Condensation Droplets */}
              <circle cx="141" cy="88" r="1.4" fill="#FFFFFF" fillOpacity="0.7" />
              <circle cx="218" cy="114" r="1.6" fill="#FFFFFF" fillOpacity="0.65" />
              <circle cx="215" cy="152" r="1.1" fill="#FFFFFF" fillOpacity="0.7" />
              <circle cx="140" cy="198" r="1.5" fill="#FFFFFF" fillOpacity="0.65" />
              <circle cx="219" cy="206" r="1.3" fill="#FFFFFF" fillOpacity="0.6" />
            </g>
          </svg>

          {/* Subtle Corner Studio Batch Metadata (Unboxed text) */}
          <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-[#5C5B54] font-mono-tabular pointer-events-none">
            <span>{code}</span>
            <span>{botanicalNote}</span>
          </div>
        </div>
      )}
    </div>
  );
};
