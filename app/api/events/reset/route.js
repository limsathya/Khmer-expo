import { NextResponse } from 'next/server';
import { resetToSeedData } from '@/lib/data';

export async function POST() {
  try {
    const data = await resetToSeedData();
    return NextResponse.json({ success: true, count: 0, message: 'All events cleared from database' });
  } catch (error) {
    console.error('Error resetting data:', error);
    return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
  }
}
