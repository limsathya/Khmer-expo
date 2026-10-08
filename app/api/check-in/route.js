import { NextResponse } from 'next/server';
import { checkInRegistrationInDB, getCheckinsListFromDB } from '@/lib/db';

export async function GET() {
  try {
    const list = await getCheckinsListFromDB();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const tokenOrId = body.token || body.regNumber || body.id;
    const staffUsername = body.staffUsername || 'admin';

    if (!tokenOrId) {
      return NextResponse.json({ error: 'QR Token or Registration Number is required' }, { status: 400 });
    }

    const result = await checkInRegistrationInDB(tokenOrId.trim(), staffUsername);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
