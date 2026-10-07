import { NextResponse } from 'next/server';
import { getCategoriesFromDB, addCategoryInDB } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getCategoriesFromDB();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('Failed to get categories:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || (!body.name && !body.key)) {
      return NextResponse.json({ error: 'Category name or key is required' }, { status: 400 });
    }

    const created = await addCategoryInDB(body);
    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (err) {
    console.error('Failed to add category:', err);
    return NextResponse.json({ error: err.message || 'Failed to create category' }, { status: 500 });
  }
}
