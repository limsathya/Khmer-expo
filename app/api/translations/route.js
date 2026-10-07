import { NextResponse } from 'next/server';
import { getCustomTranslationsFromDB, updateCustomTranslationsInDB } from '@/lib/db';
import { TRANSLATIONS } from '@/lib/translations';

export async function GET() {
  try {
    const custom = await getCustomTranslationsFromDB() || { en: {}, km: {}, zh: {} };
    return NextResponse.json({
      custom,
      base: TRANSLATIONS
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { lang, key, value, updates } = body;

    if (!lang) {
      return NextResponse.json({ error: 'Language (lang) is required' }, { status: 400 });
    }

    let payload = {};
    if (updates && typeof updates === 'object') {
      payload = updates;
    } else if (key && value !== undefined) {
      payload[key] = value;
    } else {
      return NextResponse.json({ error: 'Key and value or updates object required' }, { status: 400 });
    }

    const saved = await updateCustomTranslationsInDB(lang, payload);
    return NextResponse.json({ success: true, custom: saved });
  } catch (error) {
    console.error('Error updating translations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
