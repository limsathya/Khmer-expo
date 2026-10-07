import { NextResponse } from 'next/server';
import { updateCategoryInDB, deleteCategoryInDB } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCategoryInDB(id, body);
    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    console.error('Failed to update category:', err);
    return NextResponse.json({ error: err.message || 'Failed to update category' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const fallbackCategory = searchParams.get('fallbackCategory') || null;

    const result = await deleteCategoryInDB(id, fallbackCategory);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('Failed to delete category:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 400 });
  }
}
