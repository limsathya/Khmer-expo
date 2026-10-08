import { NextResponse } from 'next/server';
import { getSpeakerBySlugFromDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const speaker = await getSpeakerBySlugFromDB(slug);
    if (!speaker) {
      return NextResponse.json({ error: 'Speaker not found' }, { status: 404 });
    }
    return NextResponse.json(speaker);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
