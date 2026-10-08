import { NextResponse } from 'next/server';
import { getSiteSettingsFromDB, updateSiteSettingsInDB, DEFAULT_EXPO_CONFIG } from '@/lib/db';

export async function GET() {
  try {
    const config = await getSiteSettingsFromDB('expo_config');
    const merged = {
      ...DEFAULT_EXPO_CONFIG,
      ...(config || {}),
      zones: (Array.isArray(config?.zones) && config.zones.length > 0) ? config.zones : DEFAULT_EXPO_CONFIG.zones,
      timelineDays: (Array.isArray(config?.timelineDays) && config.timelineDays.length > 0) ? config.timelineDays : DEFAULT_EXPO_CONFIG.timelineDays
    };
    return NextResponse.json(merged);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const current = await getSiteSettingsFromDB('expo_config') || DEFAULT_EXPO_CONFIG;
    
    // Deep merge configuration
    const updated = {
      ...current,
      ...body,
      name: { ...(current.name || {}), ...(body.name || {}) },
      shortName: { ...(current.shortName || {}), ...(body.shortName || {}) },
      tagline: { ...(current.tagline || {}), ...(body.tagline || {}) },
      datesBadge: { ...(current.datesBadge || {}), ...(body.datesBadge || {}) },
      heroTitle1: { ...(current.heroTitle1 || {}), ...(body.heroTitle1 || {}) },
      heroTitle2: { ...(current.heroTitle2 || {}), ...(body.heroTitle2 || {}) },
      heroSubtitle: { ...(current.heroSubtitle || {}), ...(body.heroSubtitle || {}) },
      venue: { ...(current.venue || {}), ...(body.venue || {}) },
      datesRange: { ...(current.datesRange || {}), ...(body.datesRange || {}) },
      timelineDays: body.timelineDays || current.timelineDays || DEFAULT_EXPO_CONFIG.timelineDays,
      zones: body.zones || current.zones || DEFAULT_EXPO_CONFIG.zones
    };

    const saved = await updateSiteSettingsInDB('expo_config', updated);
    return NextResponse.json({ success: true, settings: saved });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
