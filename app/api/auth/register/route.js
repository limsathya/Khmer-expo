import { NextResponse } from 'next/server';
import { registerUser, createAuthToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password, name } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await registerUser({ username, password, name });
    const token = createAuthToken(user);
    const response = NextResponse.json({ success: true, user }, { status: 201 });

    response.cookies.set('expo_auth_token', token, {
      httpOnly: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
