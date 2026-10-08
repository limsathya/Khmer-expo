import { NextResponse } from 'next/server';
import { getCompanyBySlugFromDB, updateCompanyInDB, deleteCompanyInDB } from '@/lib/db';

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

export async function PATCH(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const updated = await updateCompanyInDB(slug, body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    await deleteCompanyInDB(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
