import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'navy';
}

export function BrandLogo({ variant = 'light' }: BrandLogoProps) {
  const isNavy = variant === 'navy';

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 text-lg font-bold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-md transition-opacity duration-150 hover:opacity-90 ${
        isNavy
          ? 'text-white focus-visible:outline-white'
          : 'text-[#10213B] focus-visible:outline-[#087F8C]'
      }`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="32"
          height="32"
          rx="8"
          fill={isNavy ? '#E51D35' : '#10213B'}
        />
        <circle
          cx="16"
          cy="16"
          r="9"
          stroke={isNavy ? '#FFFFFF' : '#087F8C'}
          strokeWidth="2"
          strokeOpacity={isNavy ? '0.45' : '0.85'}
        />
        <path
          d="M16 9V23M9 16H23"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="16"
          cy="16"
          r="3"
          fill={isNavy ? '#FFFFFF' : '#E51D35'}
        />
      </svg>
      <span className="font-display">ORVYA AI</span>
    </Link>
  );
}
