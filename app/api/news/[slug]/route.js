import { NextResponse } from 'next/server';
import { getNewsBySlugFromDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const article = await getNewsBySlugFromDB(slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
