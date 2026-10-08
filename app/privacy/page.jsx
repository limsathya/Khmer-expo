'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-3">
              Official Bilateral Protocol
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy & Data Governance Policy</h1>
            <p className="text-xs text-slate-400 mt-2">Effective Date: October 2026 • Version 1.0 (Official)</p>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-6">
            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
              <p>
                The Organizing Committee of Cambodia–China Expo Week collects information necessary to issue official event 
                accreditations, process venue security vetting, allocate exhibition booths, and facilitate bilateral commercial matchings.
                Data includes official names, passport/national ID references, institutional affiliations, telephone numbers, and email coordinates.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">2. Purpose of Processing</h3>
              <p>
                All participant data is processed exclusively for:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Issuance and digital verification of turnstile QR entry credentials.</li>
                <li>VIP protocol reception, security clearance, and bilateral seating allocations.</li>
                <li>Facilitating scheduled B2B procurement meetings between verified buyers and exhibitors.</li>
                <li>Communication of official event schedule changes and safety advisories.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">3. Data Security & Storage Architecture</h3>
              <p>
                In compliance with strict technical and governmental standards, our database systems enforce TLS 1.3 encryption, 
                Supabase Row Level Security (RLS), and parameterized queries. No binary media (photos, PDFs, QR barcodes) are permanently 
                stored in relational database tables. QR codes are generated dynamically in-memory from cryptographically verified tokens.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">4. Data Sharing & Third Parties</h3>
              <p>
                We do not sell, lease, or monetize personal information. Data is shared strictly between the designated governmental 
                co-organizers: the Ministry of Commerce of Cambodia and the People's Government of Yunnan Province.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">5. Inquiries & Corrections</h3>
              <p>
                Participants may request credential updates or data rectifications by emailing the Secretariat at 
                <span className="text-blue-400 font-mono ml-1">privacy@cambodia-china-expo.org</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
