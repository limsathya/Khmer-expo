import { NextResponse } from 'next/server';
import { getRegistrationByIdOrTokenFromDB, updateRegistrationStatusInDB, deleteRegistrationInDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const reg = await getRegistrationByIdOrTokenFromDB(id);
    if (!reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    return NextResponse.json(reg);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateRegistrationStatusInDB(id, body.status, body.notes);
    if (!updated) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = await deleteRegistrationInDB(id);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
