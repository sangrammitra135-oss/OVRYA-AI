export enum AlertStatus {
  NEW = 'New',
  RESOLVED = 'Resolved',
}

export enum ReliefCategory {
  MEDICAL = 'Medical Assistance',
  EVACUATION = 'Flood / Rescue Evacuation',
  SUPPLIES = 'Food & Clean Water',
  SHELTER = 'Emergency Shelter',
  GENERAL = 'General Disaster Relief',
}

export interface DemoAlert {
  id: string;
  timestamp: string;
  relativeTime: string;
  category: ReliefCategory;
  requirement: string;
  areaLabel: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  status: AlertStatus;
  isSessionCreated?: boolean;
}

export enum GeoRequestStage {
  IDLE = 'IDLE',
  REQUESTING = 'REQUESTING',
  PREPARED = 'PREPARED',
  ERROR = 'ERROR',
}

export enum GeoErrorKind {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  UNSUPPORTED = 'UNSUPPORTED',
}

export interface PreparedSosPayload {
  trackingId: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  capturedAt: string;
  category: ReliefCategory;
  isSampleFallback: boolean;
}
