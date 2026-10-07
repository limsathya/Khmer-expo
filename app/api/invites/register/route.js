import { NextResponse } from 'next/server';
import { submitRegistrationWithCodeInDB } from '@/lib/db';

export async function POST(request) {
  try {
    const { code, username, name, password } = await request.json();

    if (!code || !username || !name || !password) {
      return NextResponse.json({ 
        error: 'All fields (Verification Code, Username, Full Name, and Password) are required.' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long.' 
      }, { status: 400 });
    }

    const result = await submitRegistrationWithCodeInDB({
      code,
      username,
      name,
      password
    });

    return NextResponse.json({
      success: true,
      message: `Registration submitted with code ${result.code}! Your membership is pending approval by the President of ${result.targetCommittee}.`,
      registration: result
    }, { status: 201 });
  } catch (err) {
    console.error('Registration with verification code failed:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 400 });
  }
}
