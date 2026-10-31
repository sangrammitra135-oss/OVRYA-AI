import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AlertStatus, DemoAlert, ReliefCategory } from '../types/alerts';
import { buildGoogleMapsUrl, formatCoordinates } from '../data/demoAlerts';
import { copyTextToClipboard } from '../utils/clipboard';

interface HostDashboardPageProps {
  alerts: DemoAlert[];
  onToggleStatus: (id: string) => void;
  onResetDemoAlerts: () => void;
  hasCustomChanges: boolean;
}

type StatusFilter = 'ALL' | AlertStatus;

export function HostDashboardPage({
  alerts,
  onToggleStatus,
  onResetDemoAlerts,
  hasCustomChanges,
}: HostDashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [copiedRowId, setCopiedRowId] = useState<string | null>(null);

  const summaryCounts = useMemo(() => {
    const total = alerts.length;
    const newCount = alerts.filter((a) => a.status === AlertStatus.NEW).length;
    const resolvedCount = alerts.filter((a) => a.status === AlertStatus.RESOLVED).length;
    return { total, newCount, resolvedCount };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return alerts.filter((alert) => {
      if (statusFilter !== 'ALL' && alert.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== 'ALL' && alert.category !== categoryFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const coordinateText = `${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}`;
      return (
        alert.id.toLowerCase().includes(normalizedQuery) ||
        alert.requirement.toLowerCase().includes(normalizedQuery) ||
        alert.areaLabel.toLowerCase().includes(normalizedQuery) ||
        alert.category.toLowerCase().includes(normalizedQuery) ||
        coordinateText.includes(normalizedQuery)
      );
    });
  }, [alerts, statusFilter, categoryFilter, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setLastRefreshed(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setIsRefreshing(false);
    }, 240);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
  };

  const handleCopyCoordinates = async (alert: DemoAlert) => {
    const text = `${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}`;
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedRowId(alert.id);
      window.setTimeout(() => {
        setCopiedRowId((prev) => (prev === alert.id ? null : prev));
      }, 2000);
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 || statusFilter !== 'ALL' || categoryFilter !== 'ALL';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#10213B]">
      {/* Professional Deep Navy Header */}
      <Navbar variant="navy" />

      {/* Navy Dashboard Sub-Banner */}
      <div className="bg-[#10213B] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-300 tracking-wide">
              Host Coordination Console · Frontend Interface Preview
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Disaster Relief Alert Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-300 font-mono tabular-nums">
              Preview synced: {lastRefreshed}
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-[#087F8C] hover:bg-[#066974] disabled:opacity-70 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh Preview
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Visible DEMO DATA — NOT LIVE Notice */}
        <div
          role="region"
          aria-label="Demo Data Notice"
          className="bg-amber-50/90 border border-amber-300/80 rounded-xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-[#10213B] tracking-tight">
              DEMO DATA — NOT LIVE
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              All tracking IDs, coordinates, and relief requirements shown below are static sample
              records running entirely in your browser. No backend, database, or live rescue feed is
              connected.
            </p>
          </div>

          {hasCustomChanges && (
            <button
              type="button"
              onClick={onResetDemoAlerts}
              className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-[#10213B] hover:bg-amber-100/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset Sample Data
            </button>
          )}
        </div>

        {/* Summary Cards: Total Alerts, New Alerts, Resolved Alerts */}
        <section aria-label="Alert Summary Metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            <p className="text-xs font-medium text-slate-500">Total Alerts (Demo)</p>
            <p className="mt-2 font-mono text-3xl sm:text-4xl font-bold text-[#10213B] tabular-nums">
              {summaryCounts.total}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Sample requests loaded in browser state
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">New Alerts (Demo)</p>
              <AlertCircle className="w-4 h-4 text-[#E51D35] shrink-0" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-3xl sm:text-4xl font-bold text-[#E51D35] tabular-nums">
              {summaryCounts.newCount}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Awaiting simulated coordinator review
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">Resolved Alerts (Demo)</p>
              <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-3xl sm:text-4xl font-bold text-[#087F8C] tabular-nums">
              {summaryCounts.resolvedCount}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Marked complete in local preview
            </p>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section
          aria-label="Filter and Search Demo Alerts"
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
        >
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, requirement, or coordinates..."
                aria-label="Search demo alerts"
                className="w-full min-h-[42px] pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm text-[#10213B] placeholder:text-slate-400 focus:bg-white focus:border-[#087F8C] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#10213B] rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status & Category Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Interactive Segmented Status Filter */}
              <div
                role="group"
                aria-label="Filter alerts by status"
                className="inline-flex items-center p-1 rounded-xl bg-slate-100"
              >
                {(
                  [
                    { value: 'ALL', label: `All (${summaryCounts.total})` },
                    { value: AlertStatus.NEW, label: `New (${summaryCounts.newCount})` },
                    {
                      value: AlertStatus.RESOLVED,
                      label: `Resolved (${summaryCounts.resolvedCount})`,
                    },
                  ] as const
                ).map((tab) => {
                  const active = statusFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setStatusFilter(tab.value)}
                      className={`min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        active
                          ? 'bg-white text-[#10213B] shadow-xs'
                          : 'text-slate-600 hover:text-[#10213B]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Category Select */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter alerts by relief category"
                className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#10213B] focus:border-[#087F8C] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Relief Categories</option>
                {Object.values(ReliefCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="min-h-[40px] px-3 py-2 text-xs font-semibold text-[#087F8C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading Skeleton on Refresh */}
          {isRefreshing ? (
            <div className="p-6 space-y-3" aria-live="polite" aria-busy="true">
              {[1, 2, 3, 4].map((row) => (
                <div
                  key={row}
                  className="h-12 rounded-lg bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredAlerts.length === 0 ? (
            /* Empty Filter State */
            <div className="px-6 py-14 text-center">
              <p className="text-base font-semibold text-[#10213B]">
                No sample alerts match your current filters
              </p>
              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Try clearing your search term or switching the status filter back to All to inspect
                the full demonstration dataset.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 inline-flex items-center justify-center min-h-[42px] px-4 py-2 rounded-xl bg-[#10213B] hover:bg-[#1A3256] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Data Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                      <th scope="col" className="py-3.5 pl-5 pr-4 whitespace-nowrap">
                        Tracking ID
                      </th>
                      <th scope="col" className="py-3.5 px-4 whitespace-nowrap">
                        Time
                      </th>
                      <th scope="col" className="py-3.5 px-4">
                        Requirement
                      </th>
                      <th scope="col" className="py-3.5 px-4 whitespace-nowrap">
                        Coordinates
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-5 text-right whitespace-nowrap">
                        Status & Demo Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredAlerts.map((alert) => {
                      const isNew = alert.status === AlertStatus.NEW;
                      const isCopied = copiedRowId === alert.id;
                      return (
                        <tr
                          key={alert.id}
                          className="hover:bg-slate-50/80 transition-colors align-top"
                        >
                          {/* Tracking ID */}
                          <td className="py-4 pl-5 pr-4 whitespace-nowrap">
                            <span className="font-mono text-xs font-semibold text-[#10213B] tabular-nums">
                              {alert.id}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {alert.isSessionCreated ? 'Session Demo Entry' : 'Sample Demo'}
                            </div>
                          </td>

                          {/* Time */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-mono text-xs font-medium text-[#10213B] tabular-nums">
                              {alert.timestamp}
                            </span>
                            <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                              {alert.relativeTime}
                            </div>
                          </td>

                          {/* Requirement */}
                          <td className="py-4 px-4 max-w-xs">
                            <p className="font-medium text-[#10213B] leading-snug">
                              {alert.requirement}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {alert.category} · {alert.areaLabel}
                            </p>
                          </td>

                          {/* Coordinates + Open in Google Maps */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-mono text-xs text-[#10213B] tabular-nums">
                              {formatCoordinates(alert.latitude, alert.longitude)}
                            </div>
                            <div className="mt-1.5 flex items-center gap-3 text-xs">
                              <a
                                href={buildGoogleMapsUrl(alert.latitude, alert.longitude)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-[#087F8C] hover:underline whitespace-nowrap"
                              >
                                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                                Open in Google Maps
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                              </a>
                              <span aria-hidden="true" className="text-slate-300">
                                ·
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCoordinates(alert)}
                                className="inline-flex items-center gap-1 text-slate-600 hover:text-[#10213B] font-medium cursor-pointer whitespace-nowrap"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#087F8C]" aria-hidden="true" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" aria-hidden="true" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Status & Toggle */}
                          <td className="py-4 pl-4 pr-5 text-right whitespace-nowrap">
                            <div className="inline-flex flex-col items-end gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                  isNew ? 'text-[#E51D35]' : 'text-[#087F8C]'
                                }`}
                              >
                                {isNew ? (
                                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                )}
                                {alert.status}
                              </span>

                              <button
                                type="button"
                                onClick={() => onToggleStatus(alert.id)}
                                className="min-h-[30px] px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:text-[#10213B] hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                {isNew ? 'Mark Resolved' : 'Reopen Demo'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile & Small Tablet Responsive List */}
              <div className="lg:hidden divide-y divide-slate-200">
                {filteredAlerts.map((alert) => {
                  const isNew = alert.status === AlertStatus.NEW;
                  const isCopied = copiedRowId === alert.id;
                  return (
                    <article key={alert.id} className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs font-semibold text-[#10213B] tabular-nums">
                            {alert.id}
                          </p>
                          <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                            {alert.timestamp} · {alert.relativeTime} ·{' '}
                            {alert.isSessionCreated ? 'Session Demo' : 'Sample Demo'}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
                            isNew ? 'text-[#E51D35]' : 'text-[#087F8C]'
                          }`}
                        >
                          {isNew ? (
                            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                          {alert.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#10213B]">
                          {alert.requirement}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {alert.category} · {alert.areaLabel}
                        </p>
                      </div>

                      <div className="font-mono text-xs text-[#10213B] tabular-nums">
                        {formatCoordinates(alert.latitude, alert.longitude)} (±
                        {alert.accuracyMeters}m)
                      </div>

                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={buildGoogleMapsUrl(alert.latitude, alert.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg bg-[#087F8C]/10 text-[#087F8C] text-xs font-semibold whitespace-nowrap"
                          >
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            Open in Google Maps
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyCoordinates(alert)}
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 whitespace-nowrap"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#087F8C]" aria-hidden="true" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                Copy Coords
                              </>
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(alert.id)}
                          className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#10213B] hover:bg-slate-50 whitespace-nowrap"
                        >
                          {isNew ? 'Mark Resolved' : 'Reopen Demo'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Table Footer Metadata */}
              <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
                <span className="tabular-nums">
                  Showing {filteredAlerts.length} of {alerts.length} demonstration alerts
                </span>
                <Link
                  to="/"
                  className="font-semibold text-[#087F8C] hover:underline whitespace-nowrap"
                >
                  Return to User SOS Homepage
                </Link>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
