import { NextResponse } from 'next/server';
import { getProgramsFromDB, createProgramInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      date: searchParams.get('date') || 'all',
      category: searchParams.get('category') || 'all',
      featured: searchParams.get('featured') === 'true' ? true : undefined
    };
    const programs = await getProgramsFromDB(filters);
    return NextResponse.json(programs);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.date || !body.start_time) {
      return NextResponse.json({ error: 'Title, date, and start time are required' }, { status: 400 });
    }
    const program = await createProgramInDB(body);
    return NextResponse.json(program, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
