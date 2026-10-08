import { NextResponse } from 'next/server';
import { getRegistrationsFromDB, createRegistrationInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get('status') || 'all',
      type: searchParams.get('type') || 'all',
      country: searchParams.get('country') || 'all',
      search: searchParams.get('search') || '',
      limit: searchParams.get('limit') || null
    };

    const list = await getRegistrationsFromDB(filters);
    return NextResponse.json(list);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.fullName && !body.full_name) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    if (!body.email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }
    if (!body.organization) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const registration = await createRegistrationInDB(body);
    return NextResponse.json(registration, { status: 201 });
  } catch (err) {
    console.error('Error creating registration:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
