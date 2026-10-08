import { NextResponse } from 'next/server';
import { getSubcommitteesListFromDB } from '@/lib/db';

export async function GET() {
  try {
    const list = await getSubcommitteesListFromDB();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
