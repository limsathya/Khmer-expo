'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserCheck, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Tv, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

const REG_TYPES = [
  { id: 'Visitor', label: 'General Visitor / Public Attendee', icon: UserCheck, desc: 'Public access to exhibition zones, cultural presentations, and open pavilions.' },
  { id: 'Exhibitor', label: 'Commercial Exhibitor / Booth Holder', icon: Building2, desc: 'Enterprise booth setup, trade showcasing, and exhibitor credentials.' },
  { id: 'Business Buyer', label: 'B2B Procurement Trade Buyer', icon: Briefcase, desc: 'Exclusive access to B2B matchmaking lounges and procurement sessions.' },
  { id: 'University / Education Institution', label: 'Academic & University Delegation', icon: GraduationCap, desc: 'Higher education forums, academic symposiums, and student exchange fairs.' },
  { id: 'Media', label: 'Press & Media Accreditation', icon: Tv, desc: 'Press conference access, media workroom credentials, and interview badges.' },
  { id: 'VIP', label: 'VIP Delegate / High Dignitary', icon: Award, desc: 'Diplomatic protocol reception, VIP lounge, and plenary keynote seating.' },
  { id: 'Official Guest', label: 'Government & Institutional Guest', icon: ShieldCheck, desc: 'Official bilateral delegations, ministerial staff, and diplomatic corps.' },
];

export default function RegistrationPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    nationality: 'Cambodian',
    organization: '',
    position: '',
    email: '',
    phone: '',
    country: 'Cambodia',
    city: 'Phnom Penh',
    regType: 'Visitor',
    notes: '',
    // Exhibitor additional fields
    companyName: '',
    industry: 'Technology & AI',
    businessDescription: '',
    website: '',
    productCategory: 'Electronics & Software',
    representativesCount: '2',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectType = (typeId) => {
    setFormData((prev) => ({ ...prev, regType: typeId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full official name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Please provide a valid official email address.');
      return;
    }
    if (!formData.organization.trim()) {
      setErrorMsg('Please specify your institution or enterprise organization.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        nationality: formData.nationality.trim(),
        organization: formData.organization.trim(),
        position: formData.position.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        regType: formData.regType,
        notes: formData.notes.trim(),
      };

      if (formData.regType === 'Exhibitor' || formData.regType === 'Business Buyer') {
        payload.exhibitorDetails = {
          companyName: formData.companyName.trim() || formData.organization.trim(),
          industry: formData.industry,
          businessDescription: formData.businessDescription.trim(),
          website: formData.website.trim(),
          productCategory: formData.productCategory.trim(),
          representativesCount: parseInt(formData.representativesCount, 10) || 1,
        };
      }

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration.');
      }

      // Successful registration, navigate to confirmation pass page
      router.push(`/registration/success?id=${data.id}&reg=${encodeURIComponent(data.reg_number || '')}`);
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Breadcrumb & Bilateral Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
            Official Accreditation & Passes 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Official Expo Registration
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Register your attendance for Cambodia–China Expo Week 2026. 
            Digital QR credentials will be generated immediately for turnstile entry and seminar accreditations.
          </p>
        </div>

        {errorMsg && (
          <div role="alert" aria-live="assertive" className="mb-8 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-bold">Registration Verification Error</div>
              <div>{errorMsg}</div>
            </div>
          </div>
        )}

        {/* Step 1: Registration Type Picker */}
        <div className="mb-10">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3" id="reg-type-label">
            1. Select Accreditation Classification
          </label>
          <div role="radiogroup" aria-labelledby="reg-type-label" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REG_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.regType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectType(type.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px] ${
                    isSelected 
                      ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-900/20 ring-1 ring-blue-500' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className={isSelected ? 'text-blue-400' : 'text-slate-400'} aria-hidden="true" />
                    <span className="font-bold text-xs text-white">{type.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{type.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Dynamic Registration Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck size={18} className="text-blue-400" />
              <span>Participant Information ({formData.regType})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Please enter official details matching your government passport or national identification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullName" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Official Name <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-fullName"
                type="text"
                name="fullName"
                required
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Dr. Sok Chenda / Zhang Wei"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="reg-gender" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gender <span className="text-red-400">*</span>
              </label>
              <select
                id="reg-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Prefer not to say</option>
              </select>
            </div>

            {/* Nationality */}
            <div>
              <label htmlFor="reg-nationality" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nationality <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-nationality"
                type="text"
                name="nationality"
                required
                value={formData.nationality}
                onChange={handleChange}
                placeholder="e.g. Cambodian / Chinese"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>

            {/* Organization / Company */}
            <div>
              <label htmlFor="reg-organization" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Organization / Institution / Enterprise <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-organization"
                type="text"
                name="organization"
                required
                autoComplete="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. Royal University of Phnom Penh / Yunnan Logistics Group"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>

            {/* Position / Title */}
            <div>
              <label htmlFor="reg-position" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Position / Professional Title
              </label>
              <input
                id="reg-position"
                type="text"
                name="position"
                autoComplete="organization-title"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Managing Director / Research Dean / Senior Buyer"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>

            {/* Official Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address (For Digital QR Pass Delivery) <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="delegate@organization.org"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>

            {/* Telephone / WhatsApp / WeChat */}
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number / Mobile
              </label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+855 12 345 678 / +86 138 0000 0000"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>

            {/* Country of Residence */}
            <div>
              <label htmlFor="reg-country" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Country
              </label>
              <input
                id="reg-country"
                type="text"
                name="country"
                autoComplete="country-name"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Cambodia / China"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="reg-city" className="block text-xs font-semibold text-slate-300 mb-1.5">
                City / Province
              </label>
              <input
                id="reg-city"
                type="text"
                name="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Phnom Penh / Kunming"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              />
            </div>
          </div>

          {/* ADDITIONAL FIELDS FOR EXHIBITORS & BUYERS */}
          {(formData.regType === 'Exhibitor' || formData.regType === 'Business Buyer') && (
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Building2 size={16} />
                <span>Exhibitor & Enterprise Commercial Data</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-companyName" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Company Name
                  </label>
                  <input
                    id="reg-companyName"
                    type="text"
                    name="companyName"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Official Trade Entity Name"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reg-industry" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Industry Sector
                  </label>
                  <select
                    id="reg-industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                  >
                    <option value="Technology & AI">Technology, AI & Robotics</option>
                    <option value="Agribusiness & Food">Agribusiness & Natural Rubber/Rice</option>
                    <option value="Higher Education & Research">Higher Education & Research</option>
                    <option value="Tourism & Hospitality">Tourism, Cultural Heritage & Travel</option>
                    <option value="Manufacturing & Logistics">Manufacturing, Green Logistics & Trade</option>
                    <option value="Cross-Border Finance">Finance, Fintech & Investment</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-website" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Website
                  </label>
                  <input
                    id="reg-website"
                    type="url"
                    name="website"
                    autoComplete="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reg-representativesCount" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Number of Delegated Representatives
                  </label>
                  <input
                    id="reg-representativesCount"
                    type="number"
                    min="1"
                    max="20"
                    name="representativesCount"
                    value={formData.representativesCount}
                    onChange={handleChange}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="reg-businessDescription" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Brief Business Description & Products Showcase
                  </label>
                  <textarea
                    id="reg-businessDescription"
                    rows={3}
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleChange}
                    placeholder="Describe main export goods, target buyers, or bilateral collaboration goals..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes or Special Requirements */}
          <div>
            <label htmlFor="reg-notes" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Special Requirements / Dietary / Translation Assistance
            </label>
            <textarea
              id="reg-notes"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any translation, wheelchair accessibility, or protocol requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
            />
          </div>

          {/* Privacy & Protocol Confirmation */}
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-start gap-2">
              <Lock size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                By submitting this form, you confirm that the information provided is accurate and consent to 
                official security vetting by the Expo Week Organizing Committee under bilateral protocol guidelines.
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 min-h-[48px] rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-blue-700 to-blue-800 hover:from-red-500 hover:to-blue-700 disabled:opacity-50 shadow-xl shadow-red-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Official Credentials...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Submit & Generate Digital Pass</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
