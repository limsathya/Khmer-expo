import { NextResponse } from 'next/server';
import { deleteProgramInDB } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = await deleteProgramInDB(id);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
