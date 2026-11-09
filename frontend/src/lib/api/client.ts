import {
  AlertsListResponse,
  ReplayDayState,
  ScenarioDefinition,
  UnitsApiResponse
} from '../types/api';
import { AlertDetail, AuditEvent, DemoRole } from '../types/domain';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export async function fetchUnits(role?: DemoRole): Promise<UnitsApiResponse> {
  const url = role ? `${BASE_URL}/units?role=${role}` : `${BASE_URL}/units`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch monitoring units');
  return res.json();
}

export async function fetchAlerts(params?: {
  role?: DemoRole;
  tier?: string;
  hazard?: string;
  status?: string;
  signal?: AbortSignal;
}): Promise<AlertsListResponse> {
  const query = new URLSearchParams();
  if (params?.role) query.set('role', params.role);
  if (params?.tier) query.set('tier', params.tier);
  if (params?.hazard) query.set('hazard', params.hazard);
  if (params?.status) query.set('status', params.status);

  const res = await fetch(`${BASE_URL}/alerts?${query.toString()}`, { cache: 'no-store', signal: params?.signal });
  if (!res.ok) throw new Error('Failed to fetch alerts list');
  return res.json();
}

export async function fetchAlertById(alertId: string, role?: DemoRole, signal?: AbortSignal): Promise<AlertDetail> {
  const query = role ? `?role=${role}` : '';
  const res = await fetch(`${BASE_URL}/alerts/${alertId}${query}`, { cache: 'no-store', signal });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch alert details');
  }
  return res.json();
}

export async function fetchReplayDays(
  scenarioId: string,
  signal?: AbortSignal
): Promise<{ scenario: ScenarioDefinition; days: ReplayDayState[]; totalDays: number }> {
  const res = await fetch(`${BASE_URL}/replay/${scenarioId}?all=true`, { cache: 'no-store', signal });
  if (!res.ok) throw new Error('Failed to fetch scenario replay');
  return res.json();
}

export async function fetchSuppressionData(k: number = 5, signal?: AbortSignal) {
  const res = await fetch(`${BASE_URL}/privacy/example?k=${k}`, { cache: 'no-store', signal });
  if (!res.ok) throw new Error('Failed to fetch privacy suppression data');
  return res.json();
}

export async function fetchAuditLogs(): Promise<{ events: AuditEvent[]; total: number }> {
  const res = await fetch(`${BASE_URL}/audit`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch audit events');
  return res.json();
}

export async function recordAuditEvent(event: {
  actorRole: DemoRole;
  eventType: 'VIEW_ALERT' | 'ROLE_SWITCH' | 'SIGN_OFF_ATTEMPT';
  resourceId: string;
}) {
  try {
    const response = await fetch(`${BASE_URL}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return response.ok;
  } catch (e) {
    console.error('Audit event logging failed:', e);
    return false;
  }
}

export async function testIngestPayload(payload: unknown) {
  const res = await fetch(`${BASE_URL}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

