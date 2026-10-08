'use client';

import Link from 'next/link';
import { 
  Building2, 
  Globe2, 
  ShieldCheck, 
  Award, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Bilateral Exposition Overview
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mb-6">
            About Expo Week 2026
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            The Cambodia–China Expo Week 2026 is the official high-level bilateral trade, cultural, 
            educational, and investment platform co-organized by the Kingdom of Cambodia and the People's Republic of China.
          </p>
        </div>

        {/* Strategic Significance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-6">
              <Globe2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Diplomatic Friendship</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deepening the comprehensive strategic partnership between Cambodia and China, 
              building upon decades of bilateral trust and the "Diamond Hexagon" cooperation framework.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Economic Corridors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Linking Cambodian agricultural export goods, rubber, milled rice, and handcrafted products with 
              Southwest China's vast logistics networks and investment hubs in Yunnan Province.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-6">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Education & People</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fostering academic student exchanges, joint university research initiatives, cultural performances, 
              and people-to-people tourism connectivity.
            </p>
          </div>
        </div>

        {/* Official Organizers & Co-Hosts */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Institutional Leadership</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Official Organizers & Governing Bodies</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[#060911] border border-slate-800">
              <div className="text-3xl mb-3">🇰🇭</div>
              <div className="font-bold text-white text-sm mb-1">Ministry of Commerce</div>
              <div className="text-xs text-slate-400">Kingdom of Cambodia</div>
              <div className="text-[11px] text-blue-400 mt-2 font-medium">Co-Host & Trade Secretariat</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#060911] border border-slate-800">
              <div className="text-3xl mb-3">🇨🇳</div>
              <div className="font-bold text-white text-sm mb-1">People's Government of Yunnan</div>
              <div className="text-xs text-slate-400">Yunnan Province, China</div>
              <div className="text-[11px] text-blue-400 mt-2 font-medium">Host City & Protocol Host</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#060911] border border-slate-800">
              <div className="text-3xl mb-3">🏛️</div>
              <div className="font-bold text-white text-sm mb-1">Royal Embassy of Cambodia</div>
              <div className="text-xs text-slate-400">Beijing, China</div>
              <div className="text-[11px] text-blue-400 mt-2 font-medium">Diplomatic & Protocol Support</div>
            </div>
          </div>
        </div>

        {/* Event Key Facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-3xl font-black text-amber-400 font-mono">5 Days</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">November 7–11, 2026</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-3xl font-black text-blue-400 font-mono">75 Booths</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Exhibition Floor</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-3xl font-black text-emerald-400 font-mono">13 Groups</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Sub-Committees</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-3xl font-black text-purple-400 font-mono">15,000+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Expected Visitors</div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center pt-8">
          <Link
            href="/registration"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-blue-700 hover:from-red-500 hover:to-blue-600 shadow-xl shadow-red-900/30 transition-all hover:scale-105"
          >
            <span>Register to Attend Expo Week</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
