import { NextResponse } from 'next/server';
import { getCompaniesFromDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      industry: searchParams.get('industry') || 'all',
      country: searchParams.get('country') || 'all',
      search: searchParams.get('search') || ''
    };
    const companies = await getCompaniesFromDB(filters);
    return NextResponse.json(companies);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
