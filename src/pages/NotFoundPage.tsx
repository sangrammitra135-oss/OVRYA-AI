import { Link, useLocation } from 'react-router-dom';
import { Compass, Home, LayoutDashboard } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#10213B]">
      <Navbar variant="light" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#10213B]/8 text-[#10213B] flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6" aria-hidden="true" />
          </div>

          <p className="font-mono text-xs font-semibold text-[#E51D35] tabular-nums">
            404 · Route Not Found
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#10213B]">
            Page Not Available
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            The path{' '}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-[#10213B]">
              {location.pathname}
            </code>{' '}
            does not exist in this ORVYA AI prototype. Choose one of the primary emergency
            views below.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#E51D35] hover:bg-[#C8162B] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              User SOS Homepage
            </Link>

            <Link
              to="/host"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#10213B] hover:bg-[#1A3256] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
              Host Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
