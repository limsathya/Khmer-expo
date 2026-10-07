import { NextResponse } from 'next/server';
import { getCommitteesFromDB, updateCommitteeInDB } from '@/lib/db';

export async function GET() {
  try {
    const data = await getCommitteesFromDB();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Committee ID or key required' }, { status: 400 });
    }
    const updated = await updateCommitteeInDB(id, updates);
    return NextResponse.json({ success: true, committee: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
