'use client';

import Link from 'next/link';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';

export default function Footer() {
  const { t, language } = useLanguage();
  const { expoConfig, getExpoName } = useSettings();

  return (
    <footer className="border-t border-slate-800 bg-[#060911] text-slate-300 relative z-10">
      {/* Top Bilateral Institutional Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-800 to-red-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/30">
              🇰🇭 🇨🇳
            </div>
            <div>
              <div className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                <span>{getExpoName(language)}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">Official 2026</span>
              </div>
              <div className="text-xs text-slate-400">
                {language === 'km' 
                  ? 'វេទិកាពិព័រណ៍ផ្លូវការ កម្ពុជា–ចិន ២០២៦ • ទីក្រុងគុនមីង ខេត្តយូណាន' 
                  : language === 'zh'
                  ? '2026年柬埔寨–中国博览会官方平台 • 中国云南昆明'
                  : 'Official Cambodia–China Expo Week 2026 • Kunming, Yunnan, China'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{language === 'km' ? 'ប្រព័ន្ធដំណើរការធម្មតា' : language === 'zh' ? '系统正常运行' : 'System Operational'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={14} className="text-blue-400" />
              <span>{language === 'km' ? 'សុវត្ថិភាពខ្ពស់ TLS 1.3' : language === 'zh' ? 'TLS 1.3 企业级加密' : 'TLS 1.3 Secured'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: About & Organizers */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-blue-400" />
              {language === 'km' ? 'ស្ថាប័នរៀបចំផ្លូវការ' : language === 'zh' ? '官方主办与指导机构' : 'Official Organizers & Hosts'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'km'
                ? 'ពិព័រណ៍ពាណិជ្ជកម្ម អប់រំ វប្បធម៌ និងទេសចរណ៍ទ្វេភាគី រៀបចំឡើងដោយកិច្ចសហការរវាងក្រសួងពាណិជ្ជកម្មកម្ពុជា រដ្ឋបាលប្រជាជនខេត្តយូណាន និងស្ថានទូតកម្ពុជាប្រចាំប្រទេសចិន។'
                : language === 'zh'
                ? '由柬埔寨王国商务部、中国云南省人民政府及柬埔寨驻华大使馆联合指导与统筹主办的综合性国家级多边经贸人文博览会。'
                : 'Jointly co-organized by the Ministry of Commerce of Cambodia, the People\'s Government of Yunnan Province, and the Royal Embassy of Cambodia in Beijing, promoting bilateral trade, higher education, culture, and high-level investments.'}
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-red-400 shrink-0" />
                <span>Tongde Kunming Plaza (TKP), Panlong District, Kunming, Yunnan, China</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-blue-400 shrink-0" />
                <span>secretariat@cambodia-china-expo.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-emerald-400 shrink-0" />
                <span>+86 (871) 6888-2026 / +855 (23) 888-2026</span>
              </div>
            </div>
          </div>

          {/* Col 2: Event Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              {language === 'km' ? 'កម្មវិធី & តាំងពិព័រណ៍' : language === 'zh' ? '博览会核心' : 'Expo Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/program" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'កម្មវិធី & កាលវិភាគ' : language === 'zh' ? '活动日程安排' : 'Program & Schedule'}</Link></li>
              <li><Link href="/exhibitors" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'បញ្ជីអ្នកតាំងពិព័រណ៍' : language === 'zh' ? '参展企业名录' : 'Exhibitors Directory'}</Link></li>
              <li><Link href="/speakers" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'វាគ្មិនកិត្តិយស' : language === 'zh' ? '主讲政要与嘉宾' : 'Keynote Speakers'}</Link></li>
              <li><Link href="/venue" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'ទីតាំង & សាលស្តង់' : language === 'zh' ? '展馆与展位指引' : 'Venue & Floor Map'}</Link></li>
              <li><Link href="/gallery" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'វិចិត្រសាលរូបភាព' : language === 'zh' ? '官方图库与媒体' : 'Media & Gallery'}</Link></li>
            </ul>
          </div>

          {/* Col 3: Registration & Committee */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              {language === 'km' ? 'ការចុះឈ្មោះ & ស្ថាប័ន' : language === 'zh' ? '参与及组织' : 'Participation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/registration" className="text-blue-400 font-semibold hover:underline">{language === 'km' ? 'ចុះឈ្មោះចូលរួម (Visitor & Exhibitor)' : language === 'zh' ? '在线报名注册' : 'Online Registration'}</Link></li>
              <li><Link href="/committees" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'គណៈកម្មការរៀបចំ' : language === 'zh' ? '组委会与工作组' : 'Organizing Committees'}</Link></li>
              <li><Link href="/news" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'សេចក្តីប្រកាសព័ត៌មាន' : language === 'zh' ? '新闻与官方公报' : 'News & Announcements'}</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'អំពីពិព័រណ៍' : language === 'zh' ? '展会背景介绍' : 'About Expo Week'}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'ទំនាក់ទំនងលេខាធិការដ្ឋាន' : language === 'zh' ? '联系秘书处' : 'Contact Secretariat'}</Link></li>
            </ul>
          </div>

          {/* Col 4: Institutional Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              {language === 'km' ? 'ច្រកចូលប្រព័ន្ធ' : language === 'zh' ? '内部与管理系统' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1">
                  <span>{language === 'km' ? 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល (Admin)' : language === 'zh' ? '博览会管理后台' : 'Admin Operations Hub'}</span>
                  <ExternalLink size={11} />
                </Link>
              </li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'ចូលគណនីមន្ត្រី (Sign In)' : language === 'zh' ? '工作人员登录' : 'Committee Sign In'}</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'គោលការណ៍ឯកជនភាព' : language === 'zh' ? '隐私政策' : 'Privacy Policy'}</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">{language === 'km' ? 'លក្ខខណ្ឌនៃការប្រើប្រាស់' : language === 'zh' ? '参展及服务条款' : 'Terms & Conditions'}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Strip */}
      <div className="border-t border-slate-800/80 bg-[#04060b] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Cambodia–China Expo Week Organizing Committee. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Secretariat Inquiries</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
