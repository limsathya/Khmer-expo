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
    const committeeId = body.committeeId || body.committee;
    const memberData = body.member || body;
    const name = memberData.name?.trim();
    const role = memberData.role?.trim() || 'Committee Member';
    const avatar = memberData.avatar?.trim() || '👤';
    const alsoInCentralCommittee = Boolean(memberData.alsoInCentralCommittee || body.alsoInCentralCommittee);
    const centralCommittee = memberData.centralCommittee || body.centralCommittee;
    const subCommittee = memberData.subCommittee || body.subCommittee;

    if (!committeeId || !name) {
      return NextResponse.json({ error: 'Committee and member name are required' }, { status: 400 });
    }

    const created = await addMemberToCommitteeInDB(committeeId, {
      name,
      role,
      avatar,
      alsoInCentralCommittee,
      centralCommittee,
      subCommittee
    });

    if (!created) {
      return NextResponse.json({ error: `Committee "${committeeId}" not found in database` }, { status: 404 });
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
    const committeeId = body.committeeId || body.committee;
    const memberId = body.memberId ?? body.id;
    const memberIndex = body.memberIndex;
    const updates = body.updates || body.member || body;

    if (!committeeId || (memberId === undefined && memberIndex === undefined)) {
      return NextResponse.json({ error: 'committeeId and member identifier are required' }, { status: 400 });
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
    let committeeId = null;
    let memberId = null;
    let memberIndex = null;

    const { searchParams } = new URL(request.url);
    if (searchParams.get('committeeId')) {
      committeeId = searchParams.get('committeeId');
      memberId = searchParams.get('memberId');
      const idx = searchParams.get('memberIndex');
      if (idx !== null) memberIndex = Number(idx);
    } else {
      try {
        const body = await request.json();
        committeeId = body.committeeId || body.committee;
        memberId = body.memberId ?? body.id ?? body.name;
        if (body.memberIndex !== undefined) memberIndex = Number(body.memberIndex);
      } catch (_) {}
    }

    if (!committeeId || (memberId === null && memberIndex === null)) {
      return NextResponse.json({ error: 'committeeId and member identifier required' }, { status: 400 });
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
