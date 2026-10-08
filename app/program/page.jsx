'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Search, 
  Tag, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

const PROGRAM_DAYS = [
  { id: 'all', label: 'All Days', date: null },
  { id: '2026-11-07', label: 'Day 1 (Nov 7)', desc: 'Opening Ceremony & Plenary' },
  { id: '2026-11-08', label: 'Day 2 (Nov 8)', desc: 'B2B Trade & Investment' },
  { id: '2026-11-09', label: 'Day 3 (Nov 9)', desc: 'Higher Education Forum' },
  { id: '2026-11-10', label: 'Day 4 (Nov 10)', desc: 'Culture & Gastronomy' },
  { id: '2026-11-11', label: 'Day 5 (Nov 11)', desc: 'Signing & Closing Gala' },
];

const CATEGORIES = [
  'All',
  'Opening Ceremony',
  'Business',
  'Education',
  'B2B',
  'Culture',
  'Food',
  'Tourism',
  'Networking',
  'Closing Ceremony'
];

export default function ProgramPage() {
  const { language } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'grid'

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch('/api/programs');
        if (res.ok) {
          const data = await res.json();
          setPrograms(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((p) => {
    if (selectedDay !== 'all' && p.date !== selectedDay) return false;
    if (selectedCategory !== 'All' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchSpeaker = p.speaker?.toLowerCase().includes(q);
      const matchVenue = p.venue?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchSpeaker && !matchVenue && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Official 5-Day Event Timetable
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Program & Schedule
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover opening addresses, high-level business matchings, university exchange panels, 
            and cultural showcases at Tongde Kunming Plaza.
          </p>
        </div>

        {/* Day Filtering Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {PROGRAM_DAYS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDay === d.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Category Filter Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search session title, speaker, or hall..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border border-slate-800 rounded-lg p-1 bg-slate-950">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Content Render */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading program schedule...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            <Calendar size={36} className="mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No scheduled sessions match the selected filters.</p>
          </div>
        ) : viewMode === 'timeline' ? (
          /* TIMELINE VIEW */
          <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
            {filteredPrograms.map((p) => (
              <div key={p.id} className="relative group">
                {/* Timeline Pip */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-[#060911] group-hover:scale-125 transition-transform" />

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                        <Clock size={13} />
                        <span>{p.start_time} - {p.end_time}</span>
                      </span>
                      <span className="text-slate-400 font-medium">({p.date})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {p.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-red-400 font-medium">
                      <MapPin size={13} />
                      <span>{p.venue || 'Tongde Main Plenary'}</span>
                    </span>
                    {p.speaker && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <User size={13} className="text-blue-400" />
                        <span>Speaker: <strong>{p.speaker}</strong></span>
                      </span>
                    )}
                    {p.organizer && (
                      <span className="text-[11px] text-slate-500">
                        Host: {p.organizer}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((p) => (
              <div key={p.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono text-amber-400 font-semibold">{p.start_time} - {p.end_time}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">{p.category}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4">{p.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-red-400">
                    <MapPin size={12} />
                    <span>{p.venue || 'Main Hall A'}</span>
                  </div>
                  {p.speaker && (
                    <div className="text-[11px] text-slate-300">
                      Keynote: {p.speaker}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
