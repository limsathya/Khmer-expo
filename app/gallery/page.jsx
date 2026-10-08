'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Image as ImageIcon, 
  Calendar, 
  MapPin, 
  Filter, 
  Sparkles, 
  ArrowRight,
  Eye,
  X
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

const GALLERY_ALBUMS = [
  {
    id: 'plenary',
    category: 'Ceremony',
    title: 'Opening Ceremony & High-Level Bilateral Forum',
    date: 'November 7, 2026',
    coverIcon: '🏛️',
    description: 'Dignitaries, senior ministers, and diplomatic delegations convening at Tongde Grand Ballroom.',
    count: 24
  },
  {
    id: 'trade',
    category: 'Business',
    title: 'International Business & Trade Pavilions (Hall A)',
    date: 'November 8, 2026',
    coverIcon: '💼',
    description: 'Enterprise exhibitions showcasing advanced technologies, industrial goods, and agro-processing products.',
    count: 36
  },
  {
    id: 'culture',
    category: 'Culture',
    title: 'Cultural Performances & Khmer Silk Heritage (Hall B)',
    date: 'November 9, 2026',
    coverIcon: '🎭',
    description: 'Traditional Apsara dance, Yunnan ethnic musical showcases, and handicraft master demonstrations.',
    count: 18
  },
  {
    id: 'education',
    category: 'Education',
    title: 'Higher Education & Joint University Fair',
    date: 'November 10, 2026',
    coverIcon: '🎓',
    description: 'Presidents of Royal University of Phnom Penh, Yunnan University, and scholarship delegations.',
    count: 22
  },
  {
    id: 'food',
    category: 'Gastronomy',
    title: 'Bilateral Food & Agribusiness Pavilion',
    date: 'November 10, 2026',
    coverIcon: '🍜',
    description: 'Cambodian fragrant rice tasting, specialty coffee, and Yunnan agricultural produce.',
    count: 30
  },
  {
    id: 'signing',
    category: 'B2B',
    title: 'Strategic MoUs & Bilateral Procurement Signings',
    date: 'November 11, 2026',
    coverIcon: '🤝',
    description: 'Signing ceremonies of commercial trade contracts and academic cooperation treaties.',
    count: 15
  },
];

export default function GalleryPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const categories = ['All', 'Ceremony', 'Business', 'Culture', 'Education', 'Gastronomy', 'B2B'];

  const filtered = GALLERY_ALBUMS.filter((alb) => {
    if (selectedCategory !== 'All' && alb.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Official Multimedia Documentation
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Official Gallery & Media
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            High-resolution photographic documentation and commemorative archives of 
            Cambodia–China Expo Week 2026 plenary sessions, cultural pavilions, and trade fairs.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Gallery Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="w-full h-44 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/80 flex flex-col items-center justify-center mb-4 relative overflow-hidden group-hover:border-blue-500/50 transition-colors">
                  <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{item.coverIcon}</div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.count} Photos in Archive
                  </span>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-[10px] text-amber-400 uppercase font-bold border border-white/10">
                    {item.category}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                  <Calendar size={12} className="text-amber-400" />
                  <span>{item.date}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 font-bold">
                <span>Inspect Album</span>
                <Eye size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Album Preview Modal */}
        {activeModalItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 p-8 shadow-2xl relative">
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="text-4xl mb-3">{activeModalItem.coverIcon}</div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                {activeModalItem.category} • {activeModalItem.date}
              </div>
              <h3 className="text-2xl font-black text-white mb-3">{activeModalItem.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {activeModalItem.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                Official press photographs are archived in Supabase Storage with high-resolution 300 DPI metadata. 
                Accredited media outlets may request full RAW media packs from the Media & Communications Subcommittee.
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
