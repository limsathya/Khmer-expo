import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const tokenFromCookie = request.cookies.get('expo_auth_token')?.value;
    const authHeader = request.headers.get('Authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = await verifyAuthToken(token);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ user: null });
  }
}
