'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Navigation, 
  Train, 
  Plane, 
  Building2, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function VenuePage() {
  const { language } = useLanguage();
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedBooth, setSelectedBooth] = useState(null);

  useEffect(() => {
    async function loadBooths() {
      try {
        const res = await fetch('/api/booths');
        if (res.ok) {
          const data = await res.json();
          setBooths(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load booths:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBooths();
  }, []);

  const zones = ['All', 'Hall A', 'Hall B', 'Plaza Pavilion'];

  const filteredBooths = booths.filter((b) => {
    if (selectedZone !== 'All' && b.zone !== selectedZone) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'occupied':
        return 'bg-blue-600/30 border-blue-500 text-blue-300';
      case 'assigned':
        return 'bg-purple-600/30 border-purple-500 text-purple-300';
      case 'reserved':
        return 'bg-amber-600/30 border-amber-500 text-amber-300';
      case 'available':
      default:
        return 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 hover:border-emerald-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Official Exhibition Complex
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Venue & Exhibition Map
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Tongde Kunming Plaza (TKP), Yunnan, China. Interactive 75-booth exhibition layout, 
            hall allocations, and international transit access.
          </p>
        </div>

        {/* Venue Information Card */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Kunming Landmark</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Tongde Kunming Plaza (TKP)</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Tongde Kunming Plaza is the preeminent urban commercial and conference complex located on Beijing Road in Kunming. 
                Spanning over 35,000 square meters of exhibition areas, it serves as the official host venue for 
                Cambodia–China Expo Week 2026.
              </p>

              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-red-400 shrink-0" />
                  <span>No. 928 Beijing Road, Panlong District, Kunming, Yunnan Province, China</span>
                </div>
                <div className="flex items-center gap-2">
                  <Train size={15} className="text-blue-400 shrink-0" />
                  <span>Kunming Metro Line 2: Baiyun Road Station (Direct Exit B Underpass)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane size={15} className="text-emerald-400 shrink-0" />
                  <span>35 Minutes by Express Shuttle from Kunming Changshui International Airport (KMG)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xl font-black text-blue-400 mb-1">Hall A</div>
                <div className="text-xs font-bold text-white mb-2">Trade & Education</div>
                <div className="text-[11px] text-slate-400">30 Premium Booths</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xl font-black text-emerald-400 mb-1">Hall B</div>
                <div className="text-xs font-bold text-white mb-2">Culture & Tourism</div>
                <div className="text-[11px] text-slate-400">25 Thematic Booths</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xl font-black text-amber-400 mb-1">Plaza</div>
                <div className="text-xs font-bold text-white mb-2">Food & Agri</div>
                <div className="text-[11px] text-slate-400">20 Outdoor Booths</div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE 75-BOOTH FLOOR MAP */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 size={20} className="text-blue-400" />
                <span>Interactive Exhibition Floor Map (75 Booths)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Click any booth to view current allocation status, assigned enterprise, and industry category.
              </p>
            </div>

            {/* Zone Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {zones.map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedZone === z ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-500" />
              <span>Assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500" />
              <span>Occupied</span>
            </div>
          </div>

          {/* Booths Grid */}
          {loading ? (
            <div className="text-center py-20 text-slate-500">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading exhibition floor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
              {filteredBooths.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBooth(b)}
                  className={`p-2.5 rounded-xl border transition-all text-center flex flex-col items-center justify-between cursor-pointer ${getStatusColor(
                    b.status
                  )} ${selectedBooth?.id === b.id ? 'ring-2 ring-white scale-105' : ''}`}
                >
                  <div className="font-mono font-black text-xs">{b.booth_number}</div>
                  <div className="text-[9px] uppercase font-bold tracking-wider mt-1 truncate max-w-full">
                    {b.status || 'Available'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Booth Inspector Modal / Drawer */}
        {selectedBooth && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedBooth(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-black text-lg">
                  {selectedBooth.booth_number}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Booth {selectedBooth.booth_number}</h4>
                  <div className="text-xs text-amber-400 font-medium">{selectedBooth.zone} • {selectedBooth.size || '3m x 3m (9m²)'}</div>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="font-bold uppercase text-blue-400">{selectedBooth.status || 'Available'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Enterprise:</span>
                  <span className="font-bold text-white">{selectedBooth.company_name || 'Unassigned / Available for Booking'}</span>
                </div>
                {selectedBooth.industry && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Industry:</span>
                    <span className="font-medium text-slate-300">{selectedBooth.industry}</span>
                  </div>
                )}
                {selectedBooth.country && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Origin / Country:</span>
                    <span className="font-medium text-slate-300">{selectedBooth.country}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link
                  href="/registration"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase"
                >
                  Apply for this Booth
                </Link>
                <button
                  onClick={() => setSelectedBooth(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
