import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      id="safety-guidelines"
      className="border-t border-slate-200 bg-white text-slate-600 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-sm font-semibold text-[#10213B]">
              Emergency Safety Disclaimer · Frontend Prototype Only
            </p>
            <p className="text-xs leading-relaxed text-slate-600">
              ORVYA AI is a client-side Hackverse interface demonstration. Clicking SOS or
              interacting with the dashboard operates solely inside your browser and does not contact
              emergency responders, dispatch teams, or external servers. In an actual life-threatening
              emergency, dial your national emergency number (such as 112 or 911) immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium shrink-0">
            <Link
              to="/"
              className="text-[#10213B] hover:text-[#087F8C] transition-colors whitespace-nowrap"
            >
              User SOS
            </Link>
            <Link
              to="/host"
              className="text-[#10213B] hover:text-[#087F8C] transition-colors whitespace-nowrap"
            >
              Host Dashboard
            </Link>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
          <p>ORVYA AI · Hackverse Disaster Relief Concept</p>
          <p>Client-Side Demo · No Live Dispatch or Database Connection</p>
        </div>
      </div>
    </footer>
  );
}
