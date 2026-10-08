import { NextResponse } from 'next/server';
import { getExhibitorsFromDB, createExhibitorInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get('status') || 'all',
      featured: searchParams.get('featured') === 'true' ? true : undefined
    };
    const exhibitors = await getExhibitorsFromDB(filters);
    return NextResponse.json(exhibitors);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.company_name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    const exh = await createExhibitorInDB(body);
    return NextResponse.json(exh, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
