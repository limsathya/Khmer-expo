import { NextResponse } from 'next/server';
import { getMeetingsFromDB, createMeetingInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const committeeId = searchParams.get('committeeId') || null;
    const meetings = await getMeetingsFromDB(committeeId);
    return NextResponse.json(meetings);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.date || !body.time) {
      return NextResponse.json({ error: 'Title, date, and time are required' }, { status: 400 });
    }
    const meeting = await createMeetingInDB(body);
    return NextResponse.json(meeting, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
