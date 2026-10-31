import { AlertStatus, DemoAlert, ReliefCategory } from '../types/alerts';

export const INITIAL_DEMO_ALERTS: DemoAlert[] = [
  {
    id: 'DEMO-ORV-1048',
    timestamp: '14:42',
    relativeTime: '4m ago',
    category: ReliefCategory.MEDICAL,
    requirement: 'Emergency first-aid kit & insulin supply (Sample Demo)',
    areaLabel: 'Sector 4 · Riverfront Civic Block (Sample)',
    latitude: 17.385044,
    longitude: 78.486671,
    accuracyMeters: 11,
    status: AlertStatus.NEW,
  },
  {
    id: 'DEMO-ORV-1047',
    timestamp: '14:31',
    relativeTime: '15m ago',
    category: ReliefCategory.EVACUATION,
    requirement: 'Floodwater boat evacuation for 4 residents (Sample Demo)',
    areaLabel: 'Lowland East Crossing · Ward 12 (Sample)',
    latitude: 13.08268,
    longitude: 80.270718,
    accuracyMeters: 16,
    status: AlertStatus.NEW,
  },
  {
    id: 'DEMO-ORV-1046',
    timestamp: '14:14',
    relativeTime: '32m ago',
    category: ReliefCategory.SUPPLIES,
    requirement: 'Potable drinking water & infant nutrition packs (Sample Demo)',
    areaLabel: 'North Transit Relief Point (Sample)',
    latitude: 12.971599,
    longitude: 77.594566,
    accuracyMeters: 9,
    status: AlertStatus.NEW,
  },
  {
    id: 'DEMO-ORV-1045',
    timestamp: '13:52',
    relativeTime: '54m ago',
    category: ReliefCategory.SHELTER,
    requirement: 'Temporary dry shelter & thermal blankets (Sample Demo)',
    areaLabel: 'High-Ground School Assembly Hall (Sample)',
    latitude: 19.075984,
    longitude: 72.877656,
    accuracyMeters: 18,
    status: AlertStatus.NEW,
  },
  {
    id: 'DEMO-ORV-1044',
    timestamp: '13:18',
    relativeTime: '1h 28m ago',
    category: ReliefCategory.MEDICAL,
    requirement: 'Mobility assistance for elderly household (Sample Demo)',
    areaLabel: 'West Canal Residential Lane (Sample)',
    latitude: 22.572646,
    longitude: 88.363895,
    accuracyMeters: 14,
    status: AlertStatus.RESOLVED,
  },
  {
    id: 'DEMO-ORV-1043',
    timestamp: '12:40',
    relativeTime: '2h 06m ago',
    category: ReliefCategory.SUPPLIES,
    requirement: 'Drinking water & emergency dry rations (Sample Demo)',
    areaLabel: 'Community Health Center Junction (Sample)',
    latitude: 28.613939,
    longitude: 77.209021,
    accuracyMeters: 12,
    status: AlertStatus.RESOLVED,
  },
  {
    id: 'DEMO-ORV-1042',
    timestamp: '11:55',
    relativeTime: '2h 51m ago',
    category: ReliefCategory.EVACUATION,
    requirement: 'Blocked access road clearance & family transit (Sample Demo)',
    areaLabel: 'South Bridge Approach Road (Sample)',
    latitude: 9.931233,
    longitude: 76.267304,
    accuracyMeters: 21,
    status: AlertStatus.RESOLVED,
  },
];

export function generateDemoTrackingId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `DEMO-SOS-${randomDigits}`;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`;
}

export function formatRawCoordinatePair(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function buildGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}
