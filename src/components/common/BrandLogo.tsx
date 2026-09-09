import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'white';
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  showWordmark = true,
  showTagline = false,
  size = 'md'
}) => {
  const isLight = variant === 'light' || variant === 'white';
  const primaryColor = isLight ? '#ffffff' : '#0f2f45';
  const accentColor = isLight ? '#4ade80' : '#2f6b3a';
  const textColor = isLight ? 'text-white' : 'text-[#0f2f45]';
  const tagColor = isLight ? 'text-white/70' : 'text-[#5b6672]';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Flat icon combining House roof outline, Hindu Kush mountain range, and pine tree */}
      <svg
        className={`${iconSizes[size]} shrink-0 transition-transform duration-200 hover:scale-105`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Rafeeq Homes and Properties Logo"
      >
        {/* Soft subtle circular base or shield outline */}
        <rect width="64" height="64" rx="14" fill={isLight ? 'rgba(255,255,255,0.08)' : '#f4f1ea'} />
        
        {/* Mountain Range in the background (Tirich Mir / Hindu Kush) */}
        <path
          d="M10 44L24 24L34 37L44 20L56 44H10Z"
          fill={primaryColor}
          fillOpacity={isLight ? 0.35 : 0.18}
        />
        <path
          d="M23 25.5L28 32L33.5 25L43.8 20.2L50 32"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Traditional Gable / House Roof Outline in Dark Navy */}
        <path
          d="M14 36L32 18L50 36"
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Chimney / Peak detail */}
        <path
          d="M40 24V18H45V29"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Forest Green Pine Tree in the foreground */}
        {/* Tree trunk */}
        <rect x="29.7" y="44" width="4.6" height="6" rx="1" fill={primaryColor} />
        {/* Tier 3 bottom pine foliage */}
        <path d="M22 44L32 34L42 44H22Z" fill={accentColor} />
        {/* Tier 2 middle pine foliage */}
        <path d="M24.5 38L32 30L39.5 38H24.5Z" fill={accentColor} />
        {/* Tier 1 top pine foliage */}
        <path d="M27 32L32 26L37 32H27Z" fill={accentColor} />

        {/* Clean grounding baseline */}
        <line x1="12" y1="50" x2="52" y2="50" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-serif-brand font-bold uppercase tracking-wider leading-tight ${textColor} ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
            }`}
          >
            Rafeeq Homes
          </span>
          <span
            className={`text-[10px] tracking-[0.2em] uppercase font-medium ${
              isLight ? 'text-emerald-400' : 'text-[#2f6b3a]'
            }`}
          >
            & Properties (PVT LTD)
          </span>
          {showTagline && (
            <span className={`text-[11px] font-normal italic mt-0.5 ${tagColor}`}>
              Your Dream Property, Our Priority
            </span>
          )}
        </div>
      )}
    </div>
  );
};
