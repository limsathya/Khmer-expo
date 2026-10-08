'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function NewsDetailPage({ params }) {
  const unwrappedParams = typeof params?.then === 'function' ? use(params) : params;
  const slug = unwrappedParams?.slug;
  const { language } = useLanguage();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const list = await res.json();
          const found = list.find((n) => n.slug === slug || n.id === slug);
          setArticle(found || (list.length > 0 ? list[0] : null));
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading announcement...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <FileText size={48} className="mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold mb-2">Release Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The requested communiqué is no longer available or has been modified.</p>
          <Link href="/news" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase">
            Return to News Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Announcements</span>
        </Link>

        {/* Article Container */}
        <article className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-8">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Calendar size={13} />
                <span>{new Date(article.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <User size={13} className="text-blue-400" />
                <span>By {article.author || 'Joint Secretariat'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {article.title}
            </h1>
          </div>

          <div className="border-t border-slate-800 pt-8 text-sm sm:text-base text-slate-300 leading-relaxed space-y-6">
            <p className="whitespace-pre-line">{article.content}</p>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Official Release Verified by Joint Bilateral Secretariat</span>
            </div>
            <Link
              href="/registration"
              className="text-blue-400 font-bold hover:underline"
            >
              Register for Expo 2026 →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
