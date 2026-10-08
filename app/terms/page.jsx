'use client';

import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Homepage</span>
        </Link>

        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-3">
              Official Regulations
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Terms & Participation Guidelines</h1>
            <p className="text-xs text-slate-400 mt-2">Expo Week 2026 • Tongde Kunming Plaza, Yunnan, China</p>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-6">
            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">1. Accreditation & Admission Badges</h3>
              <p>
                All attendees, exhibitors, VIP dignitaries, and press representatives must wear their official event badge 
                with verifiable QR barcode at all times within the exposition halls (Hall A, Hall B, Plaza Pavilion). Badges 
                are strictly non-transferable without prior Secretariat authorization.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">2. Exhibition Booth Regulations</h3>
              <p>
                Exhibitors allocated space on the official 75-booth floor map agree to adhere to the standard booth construction, 
                fire safety, electrical load, and noise level thresholds established by the Exhibition & Booth Subcommittee. 
                Subletting or unauthorized booth transfers are strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">3. Commercial Trade & Product Compliance</h3>
              <p>
                All agricultural produce, packaged food products, botanical goods, and industrial equipment exhibited or sampled 
                must comply with quarantine, customs, and health certification standards established by the customs authorities 
                of Cambodia and China.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">4. Intellectual Property & Brand Rights</h3>
              <p>
                Exhibitors warrant that all demonstrated goods, trademarks, designs, and patents are either owned or legitimately 
                licensed. Infringing merchandise will be subject to immediate removal by the Security & Protocol Authority.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">5. Force Majeure & Schedule Modifications</h3>
              <p>
                The Joint Organizing Committee reserves the prerogative to modify seminar timetables or reassign hall spaces 
                in response to state protocol adjustments or force majeure circumstances with formal communiqué notice.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
