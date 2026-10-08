import { NextResponse } from 'next/server';
import { getCompaniesFromDB, createCompanyInDB } from '@/lib/db';

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

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    const comp = await createCompanyInDB(body);
    return NextResponse.json(comp, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
