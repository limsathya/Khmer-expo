'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Search, 
  Filter, 
  ArrowRight, 
  Mail, 
  Phone,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function ExhibitorsPage() {
  const { language } = useLanguage();
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  useEffect(() => {
    async function loadExhibitors() {
      try {
        const res = await fetch('/api/exhibitors');
        if (res.ok) {
          const data = await res.json();
          setExhibitors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load exhibitors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExhibitors();
  }, []);

  const industries = ['all', ...new Set(exhibitors.map((e) => e.industry).filter(Boolean))];
  const countries = ['all', ...new Set(exhibitors.map((e) => e.country).filter(Boolean))];

  const filtered = exhibitors.filter((e) => {
    if (industryFilter !== 'all' && e.industry !== industryFilter) return false;
    if (countryFilter !== 'all' && e.country !== countryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.company_name?.toLowerCase().includes(q);
      const matchDesc = e.description?.toLowerCase().includes(q);
      const matchBooth = e.booth_number?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBooth) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Bilateral Enterprise Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Exhibitors Directory
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Browse verified commercial enterprises, government pavilions, educational institutions, 
            and trade exporters showcasing at Expo Week 2026.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by company or booth..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="all">All Industries</option>
              {industries.filter((i) => i !== 'all').map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="all">All Countries</option>
              {countries.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exhibitors Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading exhibitors directory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            <Building2 size={36} className="mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No exhibitors found matching the search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ex) => (
              <div 
                key={ex.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-white text-lg">
                      {ex.company_name?.charAt(0) || 'E'}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Booth {ex.booth_number || 'TBD'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {ex.company_name}
                  </h3>
                  <div className="text-xs text-amber-400 font-medium mb-3">
                    {ex.country} • {ex.industry}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6">
                    {ex.description || 'Verified international trade exhibitor.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[150px]">
                    {ex.contact_person || ex.email || 'Contact Available'}
                  </span>
                  <Link
                    href={`/exhibitors/${ex.id}`}
                    className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>View Profile</span>
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
