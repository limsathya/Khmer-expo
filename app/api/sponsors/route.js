import { NextResponse } from 'next/server';
import { getSponsorsFromDB, createSponsorInDB } from '@/lib/db';

export async function GET() {
  try {
    const sponsors = await getSponsorsFromDB();
    return NextResponse.json(sponsors);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Sponsor name is required' }, { status: 400 });
    }
    const sponsor = await createSponsorInDB(body);
    return NextResponse.json(sponsor, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
