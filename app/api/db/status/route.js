import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  try {
    const status = await testConnection();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({
      connected: false,
      mode: 'error',
      message: error.message
    }, { status: 500 });
  }
}
