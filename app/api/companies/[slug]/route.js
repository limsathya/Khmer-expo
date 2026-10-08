import { NextResponse } from 'next/server';
import { getCompanyBySlugFromDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const company = await getCompanyBySlugFromDB(slug);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json(company);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
