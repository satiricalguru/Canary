import {
  AlertDetail,
  AuditEvent,
  District,
  FeedHealthItem,
  MonitoringUnit,
  RiskTier,
  SignalStreamData
} from './domain';

export interface UnitsApiResponse {
  districts: District[];
  units: MonitoringUnit[];
  overallCompleteness: number;
  totalSites: number;
  sitesAtAlertOrAbove: number;
  openActionAlerts: number;
  deltas: {
    completenessDelta: number;
    sitesAtAlertDelta: number;
    openActionsDelta: number;
    comparisonPeriod: string;
  };
}

export interface AlertsListResponse {
  alerts: AlertDetail[];
  total: number;
  unacknowledgedActionCount: number;
}

export interface ReplayDayState {
  dayNumber: number;
  calendarDate: string;
  scenarioId: string;
  scenarioTitle: string;
  currentTier: RiskTier | null;
  observedHazardValue: number;
  observedClinicCount: number | null;
  observedAbsenceCount: number | null;
  canaryMarker?: {
    tier: RiskTier;
    label: string;
    details: string;
  };
  comparatorMarkers: {
    methodName: string;
    alertRaised: boolean;
    tierLabel?: string;
  }[];
  groundTruthActive: boolean;
  groundTruthEventName?: string;
  evidenceSnapshot: {
    title: string;
    summary: string;
    contributingFeeds: string[];
  };
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  subtitle: string;
  hazardType: string;
  siteName: string;
  startDate: string;
  totalDays: number;
  groundTruthWindow: {
    startDay: number;
    endDay: number;
  };
  description: string;
}

export interface SuppressionDemoRow {
  id: string;
  siteName: string;
  category: string;
  rawCount: number;
  maskedValue: string | number;
  isSuppressed: boolean;
  isSecondarySuppressed: boolean;
  suppressionReason?: string;
}

export interface IngestValidationTestResult {
  testId: string;
  name: string;
  payload: Record<string, unknown>;
  expectedStatus: 'accepted' | 'rejected';
  actualStatus: 'accepted' | 'rejected';
  rejectionReason?: string;
}

