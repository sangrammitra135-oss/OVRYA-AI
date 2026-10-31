import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  variant?: 'light' | 'navy';
}

export function Navbar({ variant = 'light' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isNavy = variant === 'navy';

  const isSosActive = location.pathname === '/';
  const isHostActive = location.pathname === '/host';

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors duration-150 ${
        isNavy
          ? 'bg-[#10213B] border-white/10 text-white'
          : 'bg-white/95 backdrop-blur-md border-slate-200/90 text-[#10213B]'
      }`}
    >
      <div className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <BrandLogo variant={variant} />

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          <Link
            to="/"
            className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 ${
              isSosActive
                ? isNavy
                  ? 'border-[#E51D35] text-white'
                  : 'border-[#E51D35] text-[#10213B] font-semibold'
                : isNavy
                  ? 'border-transparent text-slate-300 hover:text-white hover:border-white/40'
                  : 'border-transparent text-slate-600 hover:text-[#10213B] hover:border-slate-300'
            }`}
          >
            User SOS
          </Link>
          <Link
            to="/host"
            className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 ${
              isHostActive
                ? isNavy
                  ? 'border-[#087F8C] text-white font-semibold'
                  : 'border-[#087F8C] text-[#10213B] font-semibold'
                : isNavy
                  ? 'border-transparent text-slate-300 hover:text-white hover:border-white/40'
                  : 'border-transparent text-slate-600 hover:text-[#10213B] hover:border-slate-300'
            }`}
          >
            Host Dashboard
          </Link>
          <a
            href="#safety-guidelines"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-1 whitespace-nowrap shrink-0 border-b-2 border-transparent transition-colors duration-150 ${
              isNavy
                ? 'text-slate-300 hover:text-white hover:border-white/40'
                : 'text-slate-600 hover:text-[#10213B] hover:border-slate-300'
            }`}
          >
            Safety Notice
          </a>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {isHostActive ? (
            <Link
              to="/"
              className="hidden sm:inline-flex items-center justify-center min-h-[38px] px-4 py-2 rounded-lg bg-[#E51D35] hover:bg-[#C8162B] text-white text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Open SOS View
            </Link>
          ) : (
            <Link
              to="/host"
              className={`hidden sm:inline-flex items-center justify-center min-h-[38px] px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isNavy
                  ? 'bg-[#087F8C] hover:bg-[#066974] text-white focus-visible:outline-white'
                  : 'bg-[#10213B] hover:bg-[#1A3256] text-white focus-visible:outline-[#10213B]'
              }`}
            >
              Host Preview
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-colors duration-150 ${
              isNavy
                ? 'text-white hover:bg-white/10'
                : 'text-[#10213B] hover:bg-slate-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className={`md:hidden border-t px-4 py-3 space-y-1 ${
            isNavy
              ? 'bg-[#10213B] border-white/10 text-white'
              : 'bg-white border-slate-200 text-[#10213B]'
          }`}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium transition-colors ${
              isSosActive
                ? isNavy
                  ? 'bg-white/10 text-white font-semibold'
                  : 'bg-slate-100 text-[#10213B] font-semibold'
                : isNavy
                  ? 'text-slate-200 hover:bg-white/5'
                  : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            User SOS Homepage
          </Link>
          <Link
            to="/host"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium transition-colors ${
              isHostActive
                ? isNavy
                  ? 'bg-white/10 text-white font-semibold'
                  : 'bg-slate-100 text-[#10213B] font-semibold'
                : isNavy
                  ? 'text-slate-200 hover:bg-white/5'
                  : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Host Dashboard Preview
          </Link>
          <a
            href="#safety-guidelines"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium transition-colors ${
              isNavy
                ? 'text-slate-200 hover:bg-white/5'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Emergency Safety Disclaimer
          </a>
        </nav>
      )}
    </header>
  );
}
