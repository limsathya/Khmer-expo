import { NextResponse } from 'next/server';
import { 
  getMembersFromDB, 
  addMemberToCommitteeInDB, 
  updateMemberInCommitteeInDB, 
  deleteMemberFromCommitteeInDB 
} from '@/lib/db';

export async function GET() {
  try {
    const members = await getMembersFromDB();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching committee members:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { committeeId, name, role, avatar, alsoInCentralCommittee, centralCommittee, subCommittee } = body;

    if (!committeeId || !name) {
      return NextResponse.json({ error: 'committeeId and member name are required' }, { status: 400 });
    }

    const created = await addMemberToCommitteeInDB(committeeId, {
      name,
      role: role || 'Committee Member',
      avatar: avatar || '👤',
      alsoInCentralCommittee,
      centralCommittee,
      subCommittee
    });

    if (!created) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: created }, { status: 201 });
  } catch (error) {
    console.error('Error adding committee member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { committeeId, memberId, memberIndex, updates } = body;

    if (!committeeId || (memberId === undefined && memberIndex === undefined)) {
      return NextResponse.json({ error: 'committeeId and memberId/memberIndex are required' }, { status: 400 });
    }

    const updated = await updateMemberInCommitteeInDB(committeeId, memberId ?? memberIndex, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Member or committee not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error('Error updating committee member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const committeeId = searchParams.get('committeeId');
    const memberId = searchParams.get('memberId');
    const memberIndexParam = searchParams.get('memberIndex');
    const memberIndex = memberIndexParam !== null ? Number(memberIndexParam) : null;

    if (!committeeId || (memberId === null && memberIndex === null)) {
      return NextResponse.json({ error: 'committeeId and memberId or memberIndex required' }, { status: 400 });
    }

    const success = await deleteMemberFromCommitteeInDB(committeeId, memberId ?? memberIndex);
    if (!success) {
      return NextResponse.json({ error: 'Member not found or deletion failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting committee member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
