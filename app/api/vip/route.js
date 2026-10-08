import { NextResponse } from 'next/server';
import { getVipGuestsFromDB, createVipGuestInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      protocolLevel: searchParams.get('protocolLevel') || 'all',
      status: searchParams.get('status') || 'all'
    };
    const vips = await getVipGuestsFromDB(filters);
    return NextResponse.json(vips);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.organization) {
      return NextResponse.json({ error: 'Name and organization are required' }, { status: 400 });
    }
    const vip = await createVipGuestInDB(body);
    return NextResponse.json(vip, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
