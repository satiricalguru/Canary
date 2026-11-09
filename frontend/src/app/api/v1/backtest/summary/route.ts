import { NextResponse } from 'next/server';
import report from '@/lib/data/validation-report.json';

export function GET() {
  return NextResponse.json(report);
}
