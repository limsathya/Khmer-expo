import { NextResponse } from 'next/server';
import { getSubcommitteeByIdFromDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const sub = await getSubcommitteeByIdFromDB(id);
    if (!sub) {
      return NextResponse.json({ error: 'Subcommittee not found' }, { status: 404 });
    }
    return NextResponse.json(sub);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
