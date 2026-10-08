import { NextResponse } from 'next/server';
import { getSpeakersFromDB, createSpeakerInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      featured: searchParams.get('featured') === 'true' ? true : undefined
    };
    const speakers = await getSpeakersFromDB(filters);
    return NextResponse.json(speakers);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.position) {
      return NextResponse.json({ error: 'Name and position are required' }, { status: 400 });
    }
    const speaker = await createSpeakerInDB(body);
    return NextResponse.json(speaker, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
