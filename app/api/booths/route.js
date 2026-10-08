import { NextResponse } from 'next/server';
import { getBoothsFromDB, updateBoothInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      zone: searchParams.get('zone') || 'all',
      status: searchParams.get('status') || 'all',
      category: searchParams.get('category') || 'all'
    };
    const booths = await getBoothsFromDB(filters);
    return NextResponse.json(booths);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Booth ID is required' }, { status: 400 });
    }
    const updated = await updateBoothInDB(body.id, body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
