'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function ExhibitorDetailPage({ params }) {
  const unwrappedParams = typeof params?.then === 'function' ? use(params) : params;
  const slug = unwrappedParams?.slug;
  const { language } = useLanguage();

  const [exhibitor, setExhibitor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/exhibitors`);
        if (res.ok) {
          const all = await res.json();
          // Find by id or company slug
          const found = all.find((e) => e.id === slug || e.company_id === slug || e.company_name?.toLowerCase().replace(/\s+/g, '-') === slug);
          setExhibitor(found || (all.length > 0 ? all[0] : null));
        }
      } catch (err) {
        console.error('Failed to load exhibitor:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading exhibitor profile...</p>
        </div>
      </div>
    );
  }

  if (!exhibitor) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <Building2 size={48} className="mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold mb-2">Exhibitor Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The requested exhibitor profile is not available or has been updated.</p>
          <Link href="/exhibitors" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/exhibitors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Exhibitors</span>
        </Link>

        {/* Profile Header Card */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 border border-slate-700 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                {exhibitor.company_name?.charAt(0) || 'E'}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{exhibitor.company_name}</h1>
                <div className="text-xs font-bold text-amber-400 mt-1">
                  {exhibitor.country} • {exhibitor.industry}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Assigned Booth</div>
              <div className="text-xl font-mono font-black text-blue-400">{exhibitor.booth_number || 'Hall A'}</div>
              <div className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1 justify-start sm:justify-end mt-1">
                <CheckCircle2 size={12} />
                <span>Verified Exhibitor</span>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div className="py-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Overview</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {exhibitor.description || 'Prominent bilateral enterprise presenting cutting-edge trade goods, innovation, and partnership opportunities during Expo Week 2026.'}
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
            {exhibitor.contact_person && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-slate-500 uppercase font-semibold text-[10px] mb-1">Primary Representative</div>
                <div className="font-bold text-white">{exhibitor.contact_person}</div>
              </div>
            )}
            {exhibitor.email && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-slate-500 uppercase font-semibold text-[10px] mb-1">Trade Inquiries</div>
                <div className="font-bold text-blue-400 truncate">{exhibitor.email}</div>
              </div>
            )}
            {exhibitor.phone && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-slate-500 uppercase font-semibold text-[10px] mb-1">Direct Hotline</div>
                <div className="font-bold text-emerald-400">{exhibitor.phone}</div>
              </div>
            )}
          </div>
        </div>

        {/* Booth Floor Plan Link Callout */}
        <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-white text-sm mb-1">Visit Booth {exhibitor.booth_number || 'at Exhibition Hall'}</div>
            <p className="text-xs text-slate-400">View this company's physical location on the official 75-booth interactive map.</p>
          </div>
          <Link
            href="/venue"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors"
          >
            Locate on Floor Map →
          </Link>
        </div>
      </div>
    </div>
  );
}
