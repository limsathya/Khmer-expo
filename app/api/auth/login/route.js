import { NextResponse } from 'next/server';
import { authenticateUser, createAuthToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, identifier, password } = await request.json();
    const loginUser = username || identifier;

    if (!loginUser || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const user = await authenticateUser(loginUser, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = createAuthToken(user);
    const response = NextResponse.json({ success: true, user });

    response.cookies.set('expo_auth_token', token, {
      httpOnly: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
