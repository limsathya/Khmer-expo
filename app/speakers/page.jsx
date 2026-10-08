'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, 
  MapPin, 
  Globe, 
  Search, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function SpeakersPage() {
  const { language } = useLanguage();
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadSpeakers() {
      try {
        const res = await fetch('/api/speakers');
        if (res.ok) {
          const data = await res.json();
          setSpeakers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load speakers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSpeakers();
  }, []);

  const filtered = speakers.filter((sp) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sp.name?.toLowerCase().includes(q);
      const matchOrg = sp.organization?.toLowerCase().includes(q);
      const matchPos = sp.position?.toLowerCase().includes(q);
      if (!matchName && !matchOrg && !matchPos) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Distinguished Dignitaries & Experts
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Keynote Speakers & Guests
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Leading government ministers, university presidents, corporate leaders, 
            and international trade specialists addressing Cambodia–China Expo Week 2026.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search speaker name, organization, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Speakers Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading speakers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            <Award size={36} className="mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No keynote speakers found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((sp) => (
              <div 
                key={sp.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between text-center group"
              >
                <div>
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-black text-white shadow-xl mb-4 group-hover:scale-105 transition-transform">
                    {sp.name?.charAt(0) || 'S'}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {sp.name}
                  </h3>
                  <div className="text-xs font-semibold text-blue-400 mb-1">{sp.position}</div>
                  <div className="text-[11px] text-slate-400 mb-4">{sp.organization} ({sp.country})</div>

                  <p className="text-xs text-slate-400 line-clamp-3 text-left leading-relaxed mb-6">
                    {sp.biography || 'Distinguished keynote panelist contributing to bilateral exchange.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <Link
                    href={`/speakers/${sp.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <span>View Biography</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
