'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  Calendar, 
  MapPin, 
  Share2, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  UserCheck,
  QrCode
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const regParam = searchParams.get('reg');
  const { language } = useLanguage();

  const [registration, setRegistration] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegDetails() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/registrations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRegistration(data);

          // Generate QR code dynamically in memory from token (NO binary in DB!)
          const token = data.qr_token || `EXPO-PASS-${data.reg_number || data.id}`;
          const qr = await QRCode.toDataURL(token, {
            width: 280,
            margin: 2,
            color: { dark: '#060911', light: '#ffffff' },
          });
          setQrDataUrl(qr);
        }
      } catch (err) {
        console.error('Failed to load pass details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRegDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060911] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold">Generating Your Official Pass...</p>
        </div>
      </div>
    );
  }

  const regNum = registration?.reg_number || regParam || 'EXP-2026-CONFIRMED';
  const attendeeName = registration?.full_name || 'Official Expo Delegate';
  const orgName = registration?.organization || 'Registered Delegation';
  const regType = registration?.reg_type || 'Visitor';

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white print:text-black">
      <div className="max-w-2xl mx-auto">
        {/* Screen Controls Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Expo Homepage</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Badge</span>
            </button>
          </div>
        </div>

        {/* Confirmation Success Alert */}
        <div className="text-center mb-8 print:hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-900/30">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1">
            Registration Confirmed
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Your bilateral accreditation credential has been registered into the central event directory.
          </p>
        </div>

        {/* PRINTABLE OFFICIAL ACCREDITATION BADGE CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative print:border-2 print:border-black print:shadow-none print:bg-white print:text-black">
          {/* Badge Top Header */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-red-900 p-6 text-center border-b border-slate-800 print:bg-gray-100 print:border-b-2 print:border-black">
            <div className="text-xl mb-1">🇰🇭 🇨🇳</div>
            <div className="text-xs font-black tracking-widest text-amber-400 uppercase">
              Official Bilateral Accreditation Pass
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-1 print:text-black">
              Cambodia–China Expo Week 2026
            </h2>
            <div className="text-[11px] text-slate-300 print:text-gray-700 mt-1">
              7–11 November 2026 • Tongde Kunming Plaza, Yunnan, China
            </div>
          </div>

          {/* Badge Center Body */}
          <div className="p-8 text-center space-y-6">
            {/* Dynamic QR Code */}
            <div className="inline-block p-4 rounded-2xl bg-white shadow-xl mx-auto border border-slate-200">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Official QR Pass" className="w-48 h-48 mx-auto" />
              ) : (
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                  <QrCode size={64} />
                </div>
              )}
              <div className="font-mono text-xs font-bold text-slate-900 tracking-wider mt-2">
                {regNum}
              </div>
            </div>

            {/* Attendee Name & Org */}
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2 print:border-black print:text-black">
                {regType} Pass
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight print:text-black">
                {attendeeName}
              </h3>
              <div className="text-sm font-semibold text-amber-400 mt-1 print:text-gray-800">
                {orgName}
              </div>
              {registration?.position && (
                <div className="text-xs text-slate-400 mt-0.5 print:text-gray-600">
                  {registration.position}
                </div>
              )}
            </div>

            {/* Protocol Meta Grid */}
            <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto pt-4 border-t border-slate-800 print:border-black text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 print:bg-gray-50 print:border-gray-300">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Nationality</div>
                <div className="font-bold text-white print:text-black">{registration?.nationality || 'Delegation'}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 print:bg-gray-50 print:border-gray-300">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Pass Status</div>
                <div className="font-bold text-emerald-400 print:text-black uppercase">Official & Verified</div>
              </div>
            </div>
          </div>

          {/* Badge Bottom Verification Footer */}
          <div className="bg-slate-950/90 py-4 px-6 border-t border-slate-800 text-center text-[11px] text-slate-500 print:bg-gray-100 print:text-gray-700 print:border-t-2 print:border-black">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-400 print:text-black">
              <ShieldCheck size={14} className="text-blue-400" />
              <span>Verifiable Turnstile Barcode • Present at Hall Entrance</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Token: {registration?.qr_token || 'EXP-TOKEN-CONFIRMED'} • Secretariat Hotline: +86 (871) 6888-2026
            </div>
          </div>
        </div>

        {/* Post-Registration Instructions */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2 print:hidden">
          <div className="font-bold text-white text-sm mb-1">Attendee Entry Instructions:</div>
          <p>• Save or print this digital pass. You may also capture a screenshot on your mobile smartphone.</p>
          <p>• Upon arrival at Tongde Kunming Plaza, scan this QR code directly at the express turnstiles for badge lanyard collection.</p>
          <p>• Exhibitors and VIP delegations may present this pass at the Protocol Registration Desk (Hall A, Level 1).</p>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060911] text-white flex items-center justify-center">Loading pass...</div>}>
      <RegistrationSuccessContent />
    </Suspense>
  );
}
