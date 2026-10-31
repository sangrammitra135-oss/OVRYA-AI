import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  GeoErrorKind,
  GeoRequestStage,
  PreparedSosPayload,
  ReliefCategory,
} from '../types/alerts';
import {
  buildGoogleMapsUrl,
  formatCoordinates,
  formatRawCoordinatePair,
  generateDemoTrackingId,
} from '../data/demoAlerts';
import { copyTextToClipboard } from '../utils/clipboard';

interface SosHomePageProps {
  onRecordDemoAlert: (payload: PreparedSosPayload) => void;
}

const RELIEF_OPTIONS: ReliefCategory[] = [
  ReliefCategory.GENERAL,
  ReliefCategory.MEDICAL,
  ReliefCategory.EVACUATION,
  ReliefCategory.SUPPLIES,
  ReliefCategory.SHELTER,
];

export function SosHomePage({ onRecordDemoAlert }: SosHomePageProps) {
  const [stage, setStage] = useState<GeoRequestStage>(GeoRequestStage.IDLE);
  const [selectedCategory, setSelectedCategory] = useState<ReliefCategory>(
    ReliefCategory.GENERAL
  );
  const [preparedPayload, setPreparedPayload] = useState<PreparedSosPayload | null>(null);
  const [errorKind, setErrorKind] = useState<GeoErrorKind | null>(null);
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleRequestSos = useCallback(() => {
    setCopiedLocation(false);
    setCopiedId(false);
    setErrorKind(null);
    setErrorDetail('');

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setErrorKind(GeoErrorKind.UNSUPPORTED);
      setErrorDetail(
        'Your current browser or device does not support the HTML5 Geolocation API.'
      );
      setStage(GeoRequestStage.ERROR);
      return;
    }

    setStage(GeoRequestStage.REQUESTING);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        const payload: PreparedSosPayload = {
          trackingId: generateDemoTrackingId(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: Math.max(1, Math.round(position.coords.accuracy)),
          capturedAt: formattedTime,
          category: selectedCategory,
          isSampleFallback: false,
        };

        setPreparedPayload(payload);
        onRecordDemoAlert(payload);
        setStage(GeoRequestStage.PREPARED);
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setErrorKind(GeoErrorKind.PERMISSION_DENIED);
          setErrorDetail(
            'Location permission was denied. Allow location access in your browser address bar settings and press Retry.'
          );
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setErrorKind(GeoErrorKind.POSITION_UNAVAILABLE);
          setErrorDetail(
            'Your device could not determine its current GPS or network location. Move to an area with clearer sky or Wi-Fi reception and try again.'
          );
        } else if (geoError.code === geoError.TIMEOUT) {
          setErrorKind(GeoErrorKind.TIMEOUT);
          setErrorDetail(
            'Acquiring browser location timed out before a coordinate fix was returned. Please press Retry to request location again.'
          );
        } else {
          setErrorKind(GeoErrorKind.POSITION_UNAVAILABLE);
          setErrorDetail(
            geoError.message || 'Location coordinates are currently unavailable on this device.'
          );
        }
        setStage(GeoRequestStage.ERROR);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }, [onRecordDemoAlert, selectedCategory]);

  const handleUseSampleCoordinates = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const samplePayload: PreparedSosPayload = {
      trackingId: generateDemoTrackingId(),
      latitude: 17.385044,
      longitude: 78.486671,
      accuracyMeters: 12,
      capturedAt: formattedTime,
      category: selectedCategory,
      isSampleFallback: true,
    };

    setPreparedPayload(samplePayload);
    onRecordDemoAlert(samplePayload);
    setStage(GeoRequestStage.PREPARED);
  };

  const handleCopyLocation = async () => {
    if (!preparedPayload) return;
    const mapsUrl = buildGoogleMapsUrl(preparedPayload.latitude, preparedPayload.longitude);
    const shareText = [
      `ORVYA AI — SOS Request Prepared (DEMO ONLY — NOT SENT)`,
      `Demo Tracking ID: ${preparedPayload.trackingId}`,
      `Requirement: ${preparedPayload.category}`,
      `Latitude: ${preparedPayload.latitude.toFixed(6)}`,
      `Longitude: ${preparedPayload.longitude.toFixed(6)}`,
      `Accuracy: ±${preparedPayload.accuracyMeters} meters`,
      `Google Maps: ${mapsUrl}`,
    ].join('\n');

    const ok = await copyTextToClipboard(shareText);
    if (ok) {
      setCopiedLocation(true);
      window.setTimeout(() => setCopiedLocation(false), 2600);
    }
  };

  const handleCopyTrackingId = async () => {
    if (!preparedPayload) return;
    const ok = await copyTextToClipboard(preparedPayload.trackingId);
    if (ok) {
      setCopiedId(true);
      window.setTimeout(() => setCopiedId(false), 2200);
    }
  };

  const handleReset = () => {
    setStage(GeoRequestStage.IDLE);
    setErrorKind(null);
    setErrorDetail('');
    setCopiedLocation(false);
    setCopiedId(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#10213B]">
      <Navbar variant="light" />

      <main className="flex-1">
        {/* Primary Emergency SOS Stage */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-medium text-[#087F8C] tracking-normal mb-2">
              Disaster Relief Assistance Interface · Frontend Demo
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#10213B] leading-tight">
              Need Emergency Help?
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Press SOS to request disaster relief assistance.
            </p>
          </div>

          {/* Interactive SOS Action States */}
          {stage === GeoRequestStage.IDLE && (
            <div className="mt-8 sm:mt-10 flex flex-col items-center">
              {/* Optional 1-tap Relief Type Selector */}
              <div className="w-full max-w-xl mb-9">
                <p className="text-xs font-medium text-slate-500 text-center mb-2.5">
                  Optional: Select assistance type before pressing SOS
                </p>
                <div
                  role="group"
                  aria-label="Select emergency assistance category"
                  className="flex flex-wrap items-center justify-center gap-1.5"
                >
                  {RELIEF_OPTIONS.map((option) => {
                    const isSelected = selectedCategory === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedCategory(option)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F8C] ${
                          isSelected
                            ? 'bg-[#10213B] text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-[#10213B]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Central Large Circular RED SOS Button with Subtle Pulsing Rings */}
              <div className="relative flex items-center justify-center py-6 my-2">
                <span
                  aria-hidden="true"
                  className="sos-pulse-ring absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-[#E51D35]"
                />
                <span
                  aria-hidden="true"
                  className="sos-pulse-ring-delayed absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 border-[#E51D35]"
                />

                <button
                  type="button"
                  onClick={handleRequestSos}
                  aria-label="SOS — Request Emergency Disaster Relief Location Capture"
                  className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-[#E51D35] hover:bg-[#C8162B] active:scale-[0.97] text-white shadow-[0_20px_50px_rgba(229,29,53,0.34)] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#10213B]"
                >
                  <ShieldAlert className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.2]" aria-hidden="true" />
                  <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                    SOS
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white/90 px-4">
                    Tap for Location Capture
                  </span>
                </button>
              </div>

              <p className="mt-5 text-xs sm:text-sm text-slate-600 text-center max-w-md">
                Clicking SOS prompts your browser for GPS location permission so coordinates can be
                prepared on your screen.
              </p>
            </div>
          )}

          {/* Requesting Browser Location State */}
          {stage === GeoRequestStage.REQUESTING && (
            <div className="mt-10 max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#E51D35]/10 text-[#E51D35] flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-7 h-7 animate-spin" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-[#10213B]">
                Requesting Browser Location...
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Please select <strong className="font-semibold text-[#10213B]">Allow</strong> in your
                browser&apos;s location permission prompt so ORVYA AI can read your latitude,
                longitude, and accuracy radius.
              </p>
              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Cancel Request
                </button>
              </div>
            </div>
          )}

          {/* Confirmation State: SOS REQUEST PREPARED */}
          {stage === GeoRequestStage.PREPARED && preparedPayload && (
            <div
              role="status"
              aria-live="polite"
              className="mt-8 sm:mt-10 max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#087F8C]/12 text-[#087F8C] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#10213B]">
                      SOS REQUEST PREPARED
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Captured at{' '}
                      <span className="font-mono tabular-nums font-medium text-[#10213B]">
                        {preparedPayload.capturedAt}
                      </span>{' '}
                      · {preparedPayload.category}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRequestSos}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-[#10213B] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  Retry GPS Fix
                </button>
              </div>

              {/* Honest Frontend-Only Demo Notice */}
              <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200/90 px-4 py-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="font-semibold text-[#10213B]">
                  Frontend Demo Notice — Alert Not Transmitted:
                </strong>{' '}
                This confirmation was prepared locally inside your browser. No alert has been sent to
                a host, server, or emergency rescue team.
                {preparedPayload.isSampleFallback && (
                  <span className="block mt-1 text-[#E51D35] font-medium">
                    Note: Displaying sample demonstration coordinates because live browser geolocation
                    was unavailable.
                  </span>
                )}
              </div>

              {/* Clearly Labelled DEMO Tracking ID */}
              <div className="mt-5 py-4 border-y border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Demo Tracking ID (Frontend Simulation — Not Live)
                  </p>
                  <p className="mt-1 font-mono text-xl sm:text-2xl font-semibold text-[#10213B] tabular-nums tracking-tight">
                    {preparedPayload.trackingId}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyTrackingId}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#10213B] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#087F8C]" aria-hidden="true" />
                      Copied Demo ID
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      Copy Demo ID
                    </>
                  )}
                </button>
              </div>

              {/* Coordinates & Accuracy Readout */}
              <dl className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <dt className="text-xs font-medium text-slate-500">Latitude</dt>
                  <dd className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#10213B] tabular-nums">
                    {preparedPayload.latitude.toFixed(6)}°
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Longitude</dt>
                  <dd className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#10213B] tabular-nums">
                    {preparedPayload.longitude.toFixed(6)}°
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Location Accuracy</dt>
                  <dd className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#087F8C] tabular-nums">
                    ± {preparedPayload.accuracyMeters} m
                  </dd>
                </div>
              </dl>

              <p className="mt-3 text-xs text-slate-500 font-mono tabular-nums">
                Formatted: {formatCoordinates(preparedPayload.latitude, preparedPayload.longitude)} (
                {formatRawCoordinatePair(preparedPayload.latitude, preparedPayload.longitude)})
              </p>

              {/* Primary & Secondary Actions */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyLocation}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#087F8C] hover:bg-[#066974] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F8C]"
                >
                  {copiedLocation ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Location Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      Copy Location
                    </>
                  )}
                </button>

                <a
                  href={buildGoogleMapsUrl(preparedPayload.latitude, preparedPayload.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#10213B] hover:bg-[#1A3256] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10213B]"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:text-[#10213B] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Back to SOS Button
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Preview how hosts inspect alerts in the demo console:</span>
                <Link
                  to="/host"
                  className="inline-flex items-center gap-1 font-semibold text-[#087F8C] hover:underline whitespace-nowrap shrink-0"
                >
                  View Host Dashboard
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {/* Location Permission Denied or Unavailable State */}
          {stage === GeoRequestStage.ERROR && (
            <div
              role="alert"
              className="mt-8 sm:mt-10 max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#E51D35]/10 text-[#E51D35] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#10213B]">
                    {errorKind === GeoErrorKind.PERMISSION_DENIED
                      ? 'Location Permission Denied'
                      : errorKind === GeoErrorKind.UNSUPPORTED
                        ? 'Geolocation Not Supported'
                        : errorKind === GeoErrorKind.TIMEOUT
                          ? 'Location Request Timed Out'
                          : 'Location Currently Unavailable'}
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{errorDetail}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-[#10213B]">How to resolve:</p>
                <p>
                  1. Check the lock or location icon in your browser&apos;s address bar and allow
                  location access for this page.
                </p>
                <p>
                  2. Ensure device Location Services / GPS are enabled, then press Retry below.
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleRequestSos}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#E51D35] hover:bg-[#C8162B] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Retry Location Request
                </button>

                <button
                  type="button"
                  onClick={handleUseSampleCoordinates}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#10213B] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#087F8C]" aria-hidden="true" />
                  Preview with Sample Demo Coordinates
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center min-h-[46px] px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-[#10213B] transition-colors whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Small Emergency Safety Disclaimer directly visible on SOS Homepage */}
          <div className="mt-8 max-w-xl mx-auto text-center px-2">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="font-semibold text-[#10213B]">Safety Disclaimer:</strong> This
              interface is a frontend-only Hackverse prototype and does not dispatch live emergency
              responders. If you are in immediate danger, call your local emergency services (112 /
              911) right away.
            </p>
          </div>
        </section>

        {/* Secondary Overview Strip for Desktop Presence & Clear Disaster Workflow Context */}
        <section className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-base font-bold text-[#10213B]">
                  01. Browser Location Capture
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Uses your device&apos;s standard{' '}
                  <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-[#10213B]">
                    navigator.geolocation
                  </code>{' '}
                  API to read latitude, longitude, and GPS accuracy in meters only after you grant
                  permission.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#10213B]">
                  02. Portable Coordinate Copy
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Generates a structured coordinate summary and direct Google Maps link that you can
                  copy in one tap to paste into SMS or local relief channels.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#10213B]">
                  03. Host Triage Demonstration
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Explore the companion{' '}
                  <Link
                    to="/host"
                    className="font-semibold text-[#087F8C] hover:underline"
                  >
                    Host Dashboard Preview
                  </Link>{' '}
                  to see how relief coordinators filter, locate, and manage sample emergency
                  requests.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
