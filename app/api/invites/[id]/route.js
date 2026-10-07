import { NextResponse } from 'next/server';
import { approveCommitteeInviteInDB, rejectCommitteeInviteInDB, deleteCommitteeInviteInDB } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, approvedBy, reason } = body;

    if (action === 'approve') {
      const invite = await approveCommitteeInviteInDB(id, approvedBy || 'President');
      return NextResponse.json({ success: true, message: 'Member approved and added to committee roster!', invite });
    } else if (action === 'reject') {
      const invite = await rejectCommitteeInviteInDB(id, approvedBy || 'President', reason);
      return NextResponse.json({ success: true, message: 'Registration rejected.', invite });
    }

    return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject".' }, { status: 400 });
  } catch (err) {
    console.error('Error handling invite patch:', err);
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const ok = await deleteCommitteeInviteInDB(id);
    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error('Error deleting invite:', err);
    return NextResponse.json({ error: 'Failed to delete invite' }, { status: 500 });
  }
}
