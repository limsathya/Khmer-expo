import { NextResponse } from 'next/server';
import { getAllEvents, createEvent } from '@/lib/data';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const date = searchParams.get('date');

    let events = await getAllEvents();

    if (status && status !== 'all') {
      events = events.filter(e => e.status === status);
    }
    if (category && category !== 'all') {
      events = events.filter(e => e.category === category);
    }
    if (date && date !== 'all') {
      events = events.filter(e => e.date === date);
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const tokenFromCookie = request.cookies.get('expo_auth_token')?.value;
    const authHeader = request.headers.get('Authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Only administrators can submit events' }, { status: 401 });
    }

    const user = await verifyAuthToken(token);
    if (!user || (user.role !== 'admin' && user.role !== 'sub_committee')) {
      return NextResponse.json({ error: 'Forbidden: Only administrators can submit events' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.title || !body.organizer) {
      return NextResponse.json({ error: 'Title and Organizer are required' }, { status: 400 });
    }

    const newEvent = await createEvent({
      ...body,
      submittedBy: user.name || body.organizer || 'Admin'
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
