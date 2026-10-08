import { NextResponse } from 'next/server';
import { updateTaskStatusInDB, deleteTaskInDB } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateTaskStatusInDB(id, body.status);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = await deleteTaskInDB(id);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
