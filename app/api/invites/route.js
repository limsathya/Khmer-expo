import { NextResponse } from 'next/server';
import { getCommitteeInvitesFromDB, createCommitteeInviteInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const committee = searchParams.get('committee');
    const invites = await getCommitteeInvitesFromDB(committee);
    return NextResponse.json(invites);
  } catch (err) {
    console.error('Error fetching committee invites:', err);
    return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, targetCommittee, targetRole, generatedBy, note } = body;

    if (!targetCommittee) {
      return NextResponse.json({ error: 'Target committee is required' }, { status: 400 });
    }

    const invite = await createCommitteeInviteInDB({
      code,
      targetCommittee,
      targetRole: targetRole || 'Committee Member',
      generatedBy: generatedBy || 'admin',
      note: note || ''
    });

    return NextResponse.json({ success: true, invite }, { status: 201 });
  } catch (err) {
    console.error('Error creating committee invite:', err);
    return NextResponse.json({ error: err.message || 'Failed to create invite' }, { status: 500 });
  }
}
