import { NextResponse } from 'next/server';
import { getAllSafeUsers, registerUser } from '@/lib/auth';

export async function GET() {
  try {
    const users = await getAllSafeUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, name, role, committee, avatar } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const newUser = await registerUser({ username, password, name });
    
    // If role, committee, or avatar were specified, update them
    if (role || committee || avatar) {
      const { updateUserInDB } = await import('@/lib/auth');
      const updated = await updateUserInDB(newUser.id, { role, committee, avatar });
      return NextResponse.json(updated || newUser, { status: 201 });
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
