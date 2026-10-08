'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Users, 
  Building2, 
  Award, 
  Globe2, 
  TrendingUp, 
  ChevronRight,
  ExternalLink,
  FileText,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Palmtree,
  UtensilsCrossed,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { expoConfig, getExpoName } = useSettings();

  const [stats, setStats] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target Expo Date: November 7, 2026 (or Oct 12, 2026)
    const targetDate = new Date('2026-11-07T09:00:00+08:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadAllHomeData() {
      try {
        const [statsRes, progRes, exhibRes, speakRes, sponsorsRes, newsRes] = await Promise.all([
          fetch('/api/stats').catch(() => null),
          fetch('/api/programs').catch(() => null),
          fetch('/api/exhibitors').catch(() => null),
          fetch('/api/speakers').catch(() => null),
          fetch('/api/sponsors').catch(() => null),
          fetch('/api/news').catch(() => null),
        ]);

        if (statsRes?.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
        if (progRes?.ok) {
          const data = await progRes.json();
          setPrograms(Array.isArray(data) ? data.slice(0, 4) : []);
        }
        if (exhibRes?.ok) {
          const data = await exhibRes.json();
          setExhibitors(Array.isArray(data) ? data.slice(0, 4) : []);
        }
        if (speakRes?.ok) {
          const data = await speakRes.json();
          setSpeakers(Array.isArray(data) ? data.slice(0, 4) : []);
        }
        if (sponsorsRes?.ok) {
          const data = await sponsorsRes.json();
          setSponsors(Array.isArray(data) ? data : []);
        }
        if (newsRes?.ok) {
          const data = await newsRes.json();
          setNews(Array.isArray(data) ? data.slice(0, 3) : []);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllHomeData();
  }, []);

  const categories = [
    { 
      id: 'business', 
      name: 'Business & Trade', 
      nameKm: 'ពាណិជ្ជកម្ម & សេដ្ឋកិច្ច', 
      nameZh: '经贸与投资', 
      icon: Briefcase, 
      color: 'from-blue-600 to-indigo-600',
      desc: 'Connect with certified import-export suppliers, negotiate direct procurement contracts, and unlock tariff-advantaged trade channels across the RCEP corridor.'
    },
    { 
      id: 'education', 
      name: 'Higher Education', 
      nameKm: 'ឧត្តមសិក្សា & បណ្តុះបណ្តាល', 
      nameZh: '高等教育与学术', 
      icon: GraduationCap, 
      color: 'from-emerald-600 to-teal-600',
      desc: 'Foster bilateral academic alliances, joint degree programs, and collaborative research initiatives between premier Cambodian institutions and Yunnan universities.'
    },
    { 
      id: 'culture', 
      name: 'Culture & Heritage', 
      nameKm: 'វប្បធម៌ & សិល្បៈ', 
      nameZh: '文化与非遗艺术', 
      icon: Sparkles, 
      color: 'from-amber-600 to-orange-600',
      desc: 'Experience living artisanal traditions, cultural IP exchanges, and museum partnerships that drive commercial creative industries and bilateral soft-power diplomacy.'
    },
    { 
      id: 'tourism', 
      name: 'Tourism & Travel', 
      nameKm: 'ទេសចរណ៍ & បដិសណ្ឋារកិច្ច', 
      nameZh: '文旅与生态游', 
      icon: Palmtree, 
      color: 'from-cyan-600 to-blue-600',
      desc: 'Engage top tour operators and hospitality investors to structure cross-border itineraries, chartered transit routes, and eco-tourism development packages.'
    },
    { 
      id: 'food', 
      name: 'Gastronomy & Agribusiness', 
      nameKm: 'ម្ហូបអាហារ & កសិ-ពាណិជ្ជកម្ម', 
      nameZh: '美食与绿色农业', 
      icon: UtensilsCrossed, 
      color: 'from-rose-600 to-red-600',
      desc: 'Source premium GI-certified agricultural exports, explore cold-chain logistics networks, and partner with sustainable agro-processing innovators.'
    },
    { 
      id: 'investment', 
      name: 'Cross-Border Investment', 
      nameKm: 'ការវិនិយោគឆ្លងដែន', 
      nameZh: '跨境合作与科创', 
      icon: DollarSign, 
      color: 'from-purple-600 to-indigo-700',
      desc: 'Access vetted infrastructure, green energy, and digital economy ventures with direct advisory from government trade ministries and sovereign funds.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Ambient Bilateral Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-[#060911] to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Official Bilateral Header Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-semibold tracking-wide text-slate-300 mb-6 backdrop-blur-md shadow-lg shadow-black/40">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span>🇰🇭 CAMBODIA</span>
              <span className="text-red-500">•</span>
              <span>CHINA 🇨🇳</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span className="text-amber-400 font-bold">7–11 NOVEMBER 2026</span>
          </div>

          {/* Grand Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-none mb-6">
            CAMBODIA–CHINA <br />
            <span className="bg-gradient-to-r from-blue-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
              EXPO WEEK 2026
            </span>
          </h1>

          {/* Location & Sector Tagline */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base text-slate-300 font-medium mb-6">
            <span className="flex items-center gap-1.5 text-red-400">
              <MapPin size={16} />
              <span>Tongde Kunming Plaza, Yunnan, China</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-amber-400 tracking-wider uppercase text-xs sm:text-sm font-semibold">
              Business • Education • Culture • Tourism • Investment
            </span>
          </div>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-400 mb-10 leading-relaxed">
            The flagship bilateral exposition connecting international enterprise leaders, premier universities, 
            cultural delegations, and trade buyers across Cambodia and the Greater Yunnan economic corridor.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/registration"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-blue-700 to-blue-800 hover:from-red-500 hover:to-blue-700 shadow-xl shadow-red-900/30 transition-all hover:-translate-y-0.5"
            >
              [ REGISTER NOW ]
            </Link>
            <Link
              href="/program"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all hover:-translate-y-0.5"
            >
              [ EXPLORE EXPO ]
            </Link>
          </div>

          {/* Countdown Clock Display */}
          <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              {language === 'km' ? 'រាប់ថយក្រោយដល់ពិធីបើកសម្ពោធ' : language === 'zh' ? '距博览会盛大开幕倒计时' : 'Official Countdown to Opening Ceremony'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              {[
                { label: 'DAYS', val: timeLeft.days },
                { label: 'HOURS', val: timeLeft.hours },
                { label: 'MINUTES', val: timeLeft.minutes },
                { label: 'SECONDS', val: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#060911]/90 rounded-xl p-3 border border-slate-800">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 font-mono">
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SUPABASE STATISTICS */}
      <section className="py-12 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { label: 'Registered Visitors', val: stats?.totalRegistrations || 1280, icon: Users, color: 'text-blue-400' },
              { label: 'Verified Exhibitors', val: stats?.totalExhibitors || 75, icon: Building2, color: 'text-amber-400' },
              { label: 'Participating Companies', val: stats?.totalCompanies || 48, icon: Globe2, color: 'text-emerald-400' },
              { label: 'Keynote Speakers', val: stats?.totalSpeakers || 24, icon: Award, color: 'text-purple-400' },
              { label: 'Official Subcommittees', val: 13, icon: ShieldCheck, color: 'text-red-400' },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <Icon size={22} className={`${st.color} mx-auto mb-2`} />
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {st.val}+
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EXPO CATEGORIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Exhibition Sectors</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Six Strategic Pillars</h3>
            <p className="text-slate-400 text-sm mt-3">
              Comprehensive industry showcases promoting multifaceted bilateral exchange.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[280px]"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h4>
                    <div className="text-xs text-amber-400 font-medium mb-3">
                      {cat.nameKm} • {cat.nameZh}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                  </div>
                  <Link 
                    href={`/program?category=${cat.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 pt-2 border-t border-slate-800/80 mt-auto transition-colors"
                  >
                    <span>View Sessions</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROGRAM HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Schedule & Agenda</h2>
              <h3 className="text-3xl font-extrabold text-white">Plenary Program Highlights</h3>
            </div>
            <Link 
              href="/program"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
            >
              <span>Full 5-Day Timetable</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.length > 0 ? (
              programs.map((p) => (
                <div key={p.id} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-amber-400" />
                        <span>{p.date}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-blue-400">
                        <Clock size={13} />
                        <span>{p.start_time} - {p.end_time}</span>
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base mb-2 line-clamp-2">{p.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-4">{p.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-red-400" />
                      <span>{p.venue || 'Main Hall A'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 uppercase font-semibold">
                      {p.category}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-slate-500 text-sm">
                Loading official program sessions...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. FEATURED EXHIBITORS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Exhibition Floor</h2>
              <h3 className="text-3xl font-extrabold text-white">Featured International Exhibitors</h3>
            </div>
            <Link 
              href="/exhibitors"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
            >
              <span>Explore All Exhibitors</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {exhibitors.length > 0 ? (
              exhibitors.map((ex) => (
                <div key={ex.id} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-lg mb-4">
                      {ex.company_name?.charAt(0) || 'E'}
                    </div>
                    <h4 className="font-bold text-white text-base mb-1">{ex.company_name}</h4>
                    <div className="text-xs text-amber-400 font-medium mb-3">
                      {ex.country} • {ex.industry}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-4">
                      {ex.description || 'Pioneering bilateral trade enterprise.'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-400 font-semibold">Booth: {ex.booth_number || 'A-01'}</span>
                    <Link href={`/exhibitors/${ex.id}`} className="text-slate-400 hover:text-white">Profile →</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-slate-500 text-sm">
                Loading exhibitors...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. SPEAKERS & GUESTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Leadership & Dignitaries</h2>
              <h3 className="text-3xl font-extrabold text-white">Distinguished Keynote Speakers</h3>
            </div>
            <Link 
              href="/speakers"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
            >
              <span>All Speakers & Guests</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {speakers.length > 0 ? (
              speakers.map((sp) => (
                <div key={sp.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg border-2 border-slate-700">
                    {sp.name?.charAt(0) || 'S'}
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">{sp.name}</h4>
                  <div className="text-xs text-blue-400 font-medium mb-1">{sp.position}</div>
                  <div className="text-[11px] text-slate-400 mb-3">{sp.organization} ({sp.country})</div>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 text-left">
                    {sp.biography}
                  </p>
                  <Link 
                    href={`/speakers/${sp.id}`}
                    className="text-xs font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1"
                  >
                    <span>Read Bio</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-slate-500 text-sm">
                Loading speakers...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. ORGANIZING COMMITTEE & SUBCOMMITTEES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Institutional Architecture</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Organizing Committee Leadership</h3>
            <p className="text-slate-400 text-sm mt-3">
              Supervised under the joint bilateral protocol with 13 specialized operational subcommittees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { role: 'Executive Co-Chairperson (Cambodia)', name: 'H.E. Senior Minister', org: 'Ministry of Commerce of Cambodia', flag: '🇰🇭' },
              { role: 'Executive Co-Chairperson (China)', name: 'Hon. Vice Governor', org: 'Yunnan Provincial People\'s Government', flag: '🇨🇳' },
              { role: 'Secretary General', name: 'Director General of Trade Promotion', org: 'Joint Organizing Secretariat', flag: '🏛️' },
            ].map((lead, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-3xl mb-3">{lead.flag}</div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">{lead.role}</div>
                <div className="text-lg font-extrabold text-white mb-1">{lead.name}</div>
                <div className="text-xs text-slate-400">{lead.org}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/committees"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Explore All 13 Sub-Committees & Structure</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SPONSORS / PARTNERS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Strategic Alliances</h2>
          <h3 className="text-3xl font-extrabold text-white mb-12">Official Sponsors & Partners</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {sponsors.length > 0 ? (
              sponsors.map((sp) => (
                <div key={sp.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center min-h-[110px]">
                  <div className="font-extrabold text-sm text-slate-200 text-center">{sp.name}</div>
                  <div className="text-[10px] text-amber-400 uppercase font-semibold mt-1">{sp.tier}</div>
                </div>
              ))
            ) : (
              <div className="col-span-6 text-center py-8 text-slate-500 text-xs">
                Official sponsors list is being updated.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. VENUE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Exhibition Complex</div>
              <h3 className="text-3xl font-extrabold text-white mb-4">Tongde Kunming Plaza (TKP)</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Situated in Panlong District, Kunming, Tongde Kunming Plaza is Yunnan's premier landmark business 
                and exhibition venue. The campus offers over 35,000 m² of multipurpose exhibition space spanning 
                Hall A (International Business & Education), Hall B (Culture, Gastronomy & Tourism), and the Outdoor Plaza Pavilion.
              </p>
              <div className="space-y-3 text-xs text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-red-400 shrink-0" />
                  <span>No. 928 Beijing Road, Panlong District, Kunming, Yunnan Province, China</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-blue-400 shrink-0" />
                  <span>Metro Line 2: Baiyun Road Station (Direct Underground Concourse Access)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                  <span>Direct Airport Shuttle connection from Kunming Changshui International Airport (KMG)</span>
                </div>
              </div>
              <Link
                href="/venue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>View Interactive Floor Plan & Guide</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-8 text-center relative">
              <div className="text-5xl mb-4">🏛️</div>
              <h4 className="text-xl font-bold text-white mb-2">75 Exhibition Booths Across 3 Zones</h4>
              <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
                Explore real-time allocation status for Hall A, Hall B, and Plaza Pavilion on our dedicated interactive floor map.
              </p>
              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-bold text-blue-400">Hall A</div>
                  <div className="text-[11px] text-slate-400">30 Booths (Trade)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-bold text-emerald-400">Hall B</div>
                  <div className="text-[11px] text-slate-400">25 Booths (Culture)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-bold text-amber-400">Plaza</div>
                  <div className="text-[11px] text-slate-400">20 Booths (Food)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. LATEST NEWS & ANNOUNCEMENTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Press & Communiqués</h2>
              <h3 className="text-3xl font-extrabold text-white">Official News Releases</h3>
            </div>
            <Link 
              href="/news"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
            >
              <span>All Announcements</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.length > 0 ? (
              news.map((item) => (
                <div key={item.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-2">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h4 className="font-bold text-white text-base mb-2">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-4">{item.content}</p>
                  </div>
                  <Link 
                    href={`/news/${item.slug || item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <span>Read Full Release</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-500 text-sm">
                Loading official bulletins...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 11. REGISTRATION CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950/60 via-[#060911] to-red-950/40">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-6">
            Registration Open Now
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-6">
            Secure Your Official Expo Week Pass
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Register as an Attendee, Exhibitor, B2B Buyer, Academic Delegation, VIP, or Media Representative. 
            Receive your verifiable digital QR code badge instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/registration"
              className="w-full sm:w-auto px-10 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-blue-700 to-blue-800 hover:scale-105 shadow-2xl shadow-red-900/40 transition-all"
            >
              [ REGISTER FOR EXPO 2026 ]
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              Learn More About Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
