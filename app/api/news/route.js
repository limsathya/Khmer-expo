import { NextResponse } from 'next/server';
import { getNewsFromDB, createNewsInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get('category') || 'all',
      status: searchParams.get('status') || 'published',
      featured: searchParams.get('featured') === 'true' ? true : undefined
    };
    const news = await getNewsFromDB(filters);
    return NextResponse.json(news);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    const article = await createNewsInDB(body);
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
