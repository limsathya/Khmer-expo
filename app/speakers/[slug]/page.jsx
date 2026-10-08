'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Award, 
  MapPin, 
  Globe, 
  Building2, 
  Calendar, 
  ArrowLeft, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function SpeakerDetailPage({ params }) {
  const unwrappedParams = typeof params?.then === 'function' ? use(params) : params;
  const slug = unwrappedParams?.slug;
  const { language } = useLanguage();

  const [speaker, setSpeaker] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const [speakRes, progRes] = await Promise.all([
          fetch('/api/speakers'),
          fetch('/api/programs')
        ]);

        if (speakRes.ok) {
          const list = await speakRes.json();
          const found = list.find((s) => s.id === slug || s.name?.toLowerCase().replace(/\s+/g, '-') === slug);
          setSpeaker(found || (list.length > 0 ? list[0] : null));
        }

        if (progRes.ok) {
          const progs = await progRes.json();
          setSessions(progs);
        }
      } catch (err) {
        console.error('Failed to load speaker detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading keynote profile...</p>
        </div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <Award size={48} className="mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold mb-2">Speaker Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The requested speaker biography could not be retrieved.</p>
          <Link href="/speakers" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase">
            Back to Speakers
          </Link>
        </div>
      </div>
    );
  }

  // Find sessions linked to this speaker
  const speakerSessions = sessions.filter((s) => 
    s.speaker?.toLowerCase().includes(speaker.name?.toLowerCase()) || 
    speaker.name?.toLowerCase().includes(s.speaker?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/speakers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Speakers</span>
        </Link>

        {/* Profile Card */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-800 text-center sm:text-left">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-800 border-2 border-slate-700 flex items-center justify-center text-4xl font-black text-white shadow-2xl shrink-0">
              {speaker.name?.charAt(0) || 'S'}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
                <Award size={12} />
                <span>Distinguished Keynote Dignitary</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{speaker.name}</h1>
              <div className="text-sm font-bold text-blue-400 mt-1">{speaker.position}</div>
              <div className="text-xs text-slate-400 mt-0.5">{speaker.organization} • {speaker.country}</div>
            </div>
          </div>

          {/* Biography Content */}
          <div className="py-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Biography</h3>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
              <p>{speaker.biography}</p>
            </div>
          </div>

          {/* Sessions Speaking At */}
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Featured Program Sessions
            </h3>
            {speakerSessions.length > 0 ? (
              <div className="space-y-3">
                {speakerSessions.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{s.title}</div>
                      <div className="text-slate-400 mt-0.5">{s.date} • {s.start_time} - {s.end_time} • {s.venue || 'Tongde Hall A'}</div>
                    </div>
                    <Link
                      href="/program"
                      className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 self-start sm:self-auto"
                    >
                      <span>Session Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400">
                Opening Plenary & Bilateral Trade Roundtable (Tongde Grand Ballroom).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
