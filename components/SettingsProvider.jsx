'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_EXPO_CONFIG, DEFAULT_CATEGORIES } from '@/lib/expo-config';

const SettingsContext = createContext({
  expoConfig: DEFAULT_EXPO_CONFIG,
  categories: DEFAULT_CATEGORIES,
  loading: true,
  getExpoName: (lang = 'en') => 'EXPO Week 2026',
  getExpoShortName: (lang = 'en') => 'EXPO Week',
  getExpoTagline: (lang = 'en') => 'Tech & Innovation Fair',
  getExpoDatesBadge: (lang = 'en') => 'October 12–14, 2026 • Phnom Penh Convention Center',
  getExpoDatesRange: (lang = 'en') => 'October 12–14, 2026',
  getExpoVenue: (lang = 'en') => 'Phnom Penh Convention Center',
  getTimelineDays: () => [],
  getZones: () => [],
  getZone: (key) => null,
  getZoneName: (key, lang = 'en') => key,
  getZoneMeta: (key, lang = 'en') => ({}),
  getCategory: (key) => null,
  getCategoryName: (key, lang = 'en') => key,
  getCategoryMeta: (key, lang = 'en') => ({}),
  updateSettings: async () => {},
  refreshSettings: async () => {},
  addCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  refreshCategories: async () => {},
});

export function SettingsProvider({ children }) {
  const [expoConfig, setExpoConfig] = useState(DEFAULT_EXPO_CONFIG);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSettings(), fetchCategories()]).finally(() => {
      setLoading(false);
    });
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setExpoConfig(prev => ({
          ...prev,
          ...data,
          name: { ...prev.name, ...(data.name || {}) },
          shortName: { ...prev.shortName, ...(data.shortName || {}) },
          tagline: { ...prev.tagline, ...(data.tagline || {}) },
          datesBadge: { ...prev.datesBadge, ...(data.datesBadge || {}) },
          heroTitle1: { ...prev.heroTitle1, ...(data.heroTitle1 || {}) },
          heroTitle2: { ...prev.heroTitle2, ...(data.heroTitle2 || {}) },
          heroSubtitle: { ...prev.heroSubtitle, ...(data.heroSubtitle || {}) },
          venue: { ...prev.venue, ...(data.venue || {}) },
          datesRange: { ...prev.datesRange, ...(data.datesRange || {}) },
          timelineDays: data.timelineDays || prev.timelineDays,
          zones: data.zones || prev.zones || DEFAULT_EXPO_CONFIG.zones
        }));
      }
    } catch (err) {
      console.warn('Failed to load settings from DB:', err);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.warn('Failed to load categories from DB:', err);
    }
  }

  const getExpoName = (lang = 'en') => {
    return expoConfig.name?.[lang] || expoConfig.name?.en || 'EXPO Week 2026';
  };

  const getExpoShortName = (lang = 'en') => {
    return expoConfig.shortName?.[lang] || expoConfig.shortName?.en || 'EXPO Week';
  };

  const getExpoTagline = (lang = 'en') => {
    return expoConfig.tagline?.[lang] || expoConfig.tagline?.en || 'Tech & Innovation Fair';
  };

  const getExpoDatesBadge = (lang = 'en') => {
    return expoConfig.datesBadge?.[lang] || expoConfig.datesBadge?.en || 'October 12–14, 2026 • Phnom Penh Convention Center';
  };

  const getExpoDatesRange = (lang = 'en') => {
    return expoConfig.datesRange?.[lang] || expoConfig.datesRange?.en || 'October 12–14, 2026';
  };

  const getExpoVenue = (lang = 'en') => {
    return expoConfig.venue?.[lang] || expoConfig.venue?.en || 'Phnom Penh Convention Center';
  };

  const getTimelineDays = () => {
    return Array.isArray(expoConfig.timelineDays) ? expoConfig.timelineDays : DEFAULT_EXPO_CONFIG.timelineDays;
  };

  const getZones = () => {
    return Array.isArray(expoConfig.zones) && expoConfig.zones.length > 0
      ? expoConfig.zones
      : (DEFAULT_EXPO_CONFIG.zones || []);
  };

  const getZone = (idOrCodeOrName) => {
    if (!idOrCodeOrName) return null;
    const list = getZones();
    const q = String(idOrCodeOrName).trim().toLowerCase();
    return list.find(z => 
      z.id?.toLowerCase() === q || 
      z.code?.toLowerCase() === q || 
      z.name?.en?.toLowerCase() === q ||
      z.name?.km?.toLowerCase() === q ||
      z.name?.zh?.toLowerCase() === q
    ) || null;
  };

  const getZoneName = (idOrCodeOrName, lang = 'en') => {
    if (!idOrCodeOrName) return '';
    const z = getZone(idOrCodeOrName);
    if (z) return z.name?.[lang] || z.name?.en || z.code || idOrCodeOrName;
    return idOrCodeOrName;
  };

  const getZoneMeta = (idOrCodeOrName, lang = 'en') => {
    const z = getZone(idOrCodeOrName);
    if (z) {
      return {
        id: z.id,
        code: z.code,
        name: z.name?.[lang] || z.name?.en || z.code,
        description: z.description?.[lang] || z.description?.en || '',
        capacity: z.capacity || '',
        color: z.color || '#6366f1',
        icon: z.icon || '🏛️'
      };
    }
    return {
      id: idOrCodeOrName,
      code: '',
      name: idOrCodeOrName,
      description: '',
      capacity: '',
      color: '#6366f1',
      icon: '📍'
    };
  };

  const getCategory = (key) => {
    if (!key) return null;
    return categories.find(c => c.key === key || c.id === key) || null;
  };

  const getCategoryName = (key, lang = 'en') => {
    if (!key) return '';
    const cat = getCategory(key);
    if (!cat) return key;
    return cat.name?.[lang] || cat.name?.en || cat.key;
  };

  const getCategoryMeta = (key, lang = 'en') => {
    const cat = getCategory(key);
    if (cat) {
      const color = cat.color || '#6366f1';
      return {
        key: cat.key,
        id: cat.id,
        label: cat.name?.[lang] || cat.name?.en || cat.key,
        name: cat.name,
        description: cat.description,
        emoji: cat.emoji || '📌',
        color: color,
        bg: `${color}1f`,
        border: `${color}4d`,
        icon: cat.icon || 'Layers',
        defaultSubCommittee: cat.defaultSubCommittee,
        eventCount: cat.eventCount || 0
      };
    }
    return {
      key: key,
      id: key,
      label: key,
      emoji: '📌',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.3)',
      icon: 'Layers',
      defaultSubCommittee: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
      eventCount: 0
    };
  };

  const updateSettings = async (updates) => {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.settings) {
        setExpoConfig(data.settings);
      } else {
        await fetchSettings();
      }
      return true;
    }
    return false;
  };

  const addCategory = async (catData) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    if (res.ok) {
      await fetchCategories();
      return true;
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create category');
  };

  const updateCategory = async (id, updates) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      await fetchCategories();
      return true;
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update category');
  };

  const deleteCategory = async (id, fallbackKey) => {
    const url = fallbackKey ? `/api/categories/${id}?fallbackCategory=${encodeURIComponent(fallbackKey)}` : `/api/categories/${id}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (res.ok) {
      await fetchCategories();
      return true;
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete category');
  };

  return (
    <SettingsContext.Provider value={{
      expoConfig,
      categories,
      loading,
      getExpoName,
      getExpoShortName,
      getExpoTagline,
      getExpoDatesBadge,
      getExpoDatesRange,
      getExpoVenue,
      getTimelineDays,
      getZones,
      getZone,
      getZoneName,
      getZoneMeta,
      getCategory,
      getCategoryName,
      getCategoryMeta,
      updateSettings,
      refreshSettings: fetchSettings,
      addCategory,
      updateCategory,
      deleteCategory,
      refreshCategories: fetchCategories
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
