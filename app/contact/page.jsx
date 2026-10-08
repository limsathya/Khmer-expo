'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function ContactPage() {
  const { language } = useLanguage();
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'General Expo Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Joint Organizing Secretariat
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Contact & Inquiries
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Reach out to our bilateral executive organizing secretariat for protocol arrangements, 
            exhibition booth allocations, media credentials, or general inquiries.
          </p>
        </div>

        {/* Contact Coordinates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kunming Host Secretariat */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Kunming Host Secretariat (China)</h3>
            <p className="text-xs text-slate-400">
              Department of Commerce of Yunnan Province & Kunming Municipal Bureau of Commerce.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-red-400 shrink-0 mt-0.5" />
                <span>Tongde Kunming Plaza (TKP), Tower A, Panlong District, Kunming, Yunnan, China</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-blue-400 shrink-0" />
                <span>kunming@cambodia-china-expo.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <span>+86 (871) 6888-2026 / 6888-2027</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-amber-400 shrink-0" />
                <span>Mon – Fri: 09:00 – 17:30 (CST, UTC+8)</span>
              </div>
            </div>
          </div>

          {/* Phnom Penh Liaison Secretariat */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Globe2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Phnom Penh Trade Liaison (Cambodia)</h3>
            <p className="text-xs text-slate-400">
              General Directorate of Trade Promotion, Ministry of Commerce of Cambodia.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-red-400 shrink-0 mt-0.5" />
                <span>Lot 19-61, Russian Federation Blvd, Sangkat Toek Thla, Khan Sen Sok, Phnom Penh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-blue-400 shrink-0" />
                <span>phnompenh@cambodia-china-expo.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <span>+855 (23) 888-2026 / 888-2028</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-amber-400 shrink-0" />
                <span>Mon – Fri: 08:00 – 17:00 (ICT, UTC+7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Submission Form */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-white text-center mb-2">Send an Official Inquiry</h3>
            <p className="text-xs text-slate-400 text-center mb-8">
              Messages will be routed to the appropriate subcommittee secretariat within 24 working hours.
            </p>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Inquiry Dispatched Successfully</h4>
                <p className="text-xs text-emerald-200">
                  Thank you for contacting the Joint Organizing Committee. Our protocol secretariat will respond via your official email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Delegate Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="delegate@organization.org"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Enterprise</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Enterprise or Institution"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Department</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="General Expo Inquiry">General Expo Inquiry</option>
                      <option value="Exhibition Booth Booking">Exhibition Booth & Floor Booking</option>
                      <option value="Protocol & VIP Delegations">Protocol & VIP Delegations</option>
                      <option value="B2B Procurement Matchmaking">B2B Procurement & Matchmaking</option>
                      <option value="Media & Press Accreditation">Media & Press Accreditation</option>
                      <option value="Sponsorship & Partnership">Sponsorship & Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding your delegation, schedule, or booth requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send Message to Secretariat</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
