import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SosHomePage } from './pages/SosHomePage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { INITIAL_DEMO_ALERTS } from './data/demoAlerts';
import { AlertStatus, DemoAlert, PreparedSosPayload } from './types/alerts';

export default function App() {
  const [alerts, setAlerts] = useState<DemoAlert[]>(INITIAL_DEMO_ALERTS);
  const [hasCustomChanges, setHasCustomChanges] = useState(false);

  const handleRecordDemoAlert = useCallback((payload: PreparedSosPayload) => {
    const sessionDemoEntry: DemoAlert = {
      id: payload.trackingId,
      timestamp: payload.capturedAt,
      relativeTime: 'Just now (Local Demo)',
      category: payload.category,
      requirement: `${payload.category} request prepared in browser (Demo — Not Sent)`,
      areaLabel: payload.isSampleFallback
        ? 'Sample Fallback Coordinates (Demo)'
        : 'Current Browser Geolocation (Local Demo)',
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracyMeters: payload.accuracyMeters,
      status: AlertStatus.NEW,
      isSessionCreated: true,
    };

    setAlerts((prev) => [sessionDemoEntry, ...prev]);
    setHasCustomChanges(true);
  }, []);

  const handleToggleStatus = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status:
                alert.status === AlertStatus.NEW ? AlertStatus.RESOLVED : AlertStatus.NEW,
            }
          : alert
      )
    );
    setHasCustomChanges(true);
  }, []);

  const handleResetDemoAlerts = useCallback(() => {
    setAlerts(INITIAL_DEMO_ALERTS);
    setHasCustomChanges(false);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<SosHomePage onRecordDemoAlert={handleRecordDemoAlert} />}
        />
        <Route
          path="/host"
          element={
            <HostDashboardPage
              alerts={alerts}
              onToggleStatus={handleToggleStatus}
              onResetDemoAlerts={handleResetDemoAlerts}
              hasCustomChanges={hasCustomChanges}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
