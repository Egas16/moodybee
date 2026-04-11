import React, { CSSProperties } from "react";
import * as LucideIcons from "lucide-react";

interface LucideIconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
}

type IconProps = {
  className?: string;
  style?: CSSProperties;
};

// Sangat gembira (D-smile menganga lebar, mata tersenyum)
export const IconHappy = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M7.5 9c.5-1 2-1 2.5 0" strokeWidth="2.5" />
    <path d="M14 9c.5-1 2-1 2.5 0" strokeWidth="2.5" />
    <path d="M7.5 12 h9 c0 3.5 -2 6 -4.5 6 S7.5 15.5 7.5 12 z" fill="currentColor" stroke="none" />
  </svg>
);

// Tersenyum manis
export const IconGood = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none" />
    <path d="M7 14c2 2 4.5 2 9 0" strokeWidth="2.5" />
  </svg>
);

// Datar / Netral
export const IconNeutral = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <line x1="8" y1="14" x2="16" y2="14" strokeWidth="2.5" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

// Sedih agak marah / cemberut
export const IconBad = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M6 9l2.5 1.5" strokeWidth="2" />
    <path d="M18 9l-2.5 1.5" strokeWidth="2" />
    <circle cx="8.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <path d="M8 16c2-1.5 5.5-1.5 8 0" strokeWidth="2.5" />
  </svg>
);

// Menangis sedih
export const IconSad = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    {/* Mata terpejam sedih */}
    <path d="M7 11.5c.5-.5 2-.5 2.5 0" strokeWidth="2" />
    <path d="M14.5 11.5c.5-.5 2-.5 2.5 0" strokeWidth="2" />
    {/* Mulut ternganga sedih */}
    <path d="M8 16 c1-2 4-2 8 0" strokeWidth="2" />
    {/* Tetesan air mata bulat */}
    <path d="M7.5 14 c0 1-.5 2-1.5 2 c-1 0-1.5-1-1.5-2 c0-1.5 1.5-3 1.5-3 s1.5 1.5 1.5 3 z" fill="currentColor" stroke="none" />
    <path d="M19.5 14 c0 1-.5 2-1.5 2 c-1 0-1.5-1-1.5-2 c0-1.5 1.5-3 1.5-3 s1.5 1.5 1.5 3 z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPencil = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export const IconBook = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <rect x="5" y="3" width="14" height="18" rx="2" ry="2" />
    <path d="M5 17h14" />
    <path d="M9 3v8l3-2 3 2V3" />
  </svg>
);

export const IconCirclePlus = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const IconDocument = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const IconArrowLeft = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export const IconDotsVertical = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

export const IconEdit = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

export const IconTrash = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const Icon: React.FC<LucideIconProps> = ({ name, size = 24, className }) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<{ size?: number; className?: string }>;

  if (!IconComponent) {
    return <div>Icon not found</div>;
  }

  return <IconComponent size={size} className={className} />;
};

export default Icon;
