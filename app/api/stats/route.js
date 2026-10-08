import { NextResponse } from 'next/server';
import { getPlatformOverviewStatsFromDB } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getPlatformOverviewStatsFromDB();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return NextResponse.json({ error: 'Failed to fetch platform stats' }, { status: 500 });
  }
}
