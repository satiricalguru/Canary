import { NextRequest, NextResponse } from 'next/server';
import { AUDIT_LOG_SAMPLE, DEMO_ROLES, SEEDED_ALERTS } from '@/lib/data/seededData';
import type { AuditEvent } from '@/lib/types/domain';

const dynamicAuditLogs: AuditEvent[] = [...AUDIT_LOG_SAMPLE];

export function GET() {
  return NextResponse.json({ events: dynamicAuditLogs, total: dynamicAuditLogs.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const role = DEMO_ROLES.find(({ id }) => id === body?.actorRole);
  if (!role) return NextResponse.json({ error: 'Unknown demo role' }, { status: 400 });

  const { eventType, resourceId } = body;
  let resourceType: string;
  let details: string;
  if (eventType === 'ROLE_SWITCH' && resourceId === `session_${role.id}`) {
    resourceType = 'system_auth';
    details = `Switched to the ${role.title} demo view.`;
  } else {
    const alert = SEEDED_ALERTS.find(({ id }) => id === resourceId);
    const canView = alert && (role.permittedUnitIds === 'all' || role.permittedUnitIds.includes(alert.unit.id));
    if (!alert || !canView || (eventType !== 'VIEW_ALERT' && eventType !== 'SIGN_OFF_ATTEMPT')) {
      return NextResponse.json({ error: 'Unknown or unavailable demo event' }, { status: 400 });
    }
    if (eventType === 'SIGN_OFF_ATTEMPT' && !role.hasHealthDetail) {
      return NextResponse.json({ error: 'This demo role cannot review playbooks' }, { status: 403 });
    }
    resourceType = eventType === 'VIEW_ALERT' ? 'alert_detail' : 'alert_action';
    details = eventType === 'VIEW_ALERT' ? `Opened demo alert ${alert.id}.` : `Recorded a demo review for ${alert.id}.`;
  }

  const event: AuditEvent = {
    id: crypto.randomUUID(),
    actorRole: role.id,
    actorLabel: role.title,
    eventType,
    resourceType,
    resourceId,
    timestamp: new Date().toISOString(),
    details,
    ipMasked: '—',
  };
  dynamicAuditLogs.unshift(event);
  if (dynamicAuditLogs.length > 100) dynamicAuditLogs.length = 100;

  return NextResponse.json({ success: true, event });
}
