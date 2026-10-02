import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  User, Building2, Package, Phone, Mail,
  CheckCircle2, AlertCircle, Upload, X, Loader2,
  ArrowRight, Clock, MapPin, Users, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENTS, typeVariant, type ExpoEvent } from "@/data/events";

type Gender = "male" | "female" | "other" | "na";
type ProductType = "electronics" | "apparel" | "food" | "service" | "craft" | "other";
type RegMode = "individual" | "company";

const PRODUCT_OPTIONS: { value: ProductType; emoji: string }[] = [
  { value: "electronics", emoji: "💻" },
  { value: "apparel",     emoji: "👕" },
  { value: "food",        emoji: "🍜" },
  { value: "service",     emoji: "🛎️" },
  { value: "craft",       emoji: "🎨" },
  { value: "other",       emoji: "📦" },
];

const GENDERS: { value: Gender; emoji: string }[] = [
  { value: "male",   emoji: "♂️" },
  { value: "female", emoji: "♀️" },
  { value: "other",  emoji: "🧑" },
  { value: "na",     emoji: "—"  },
];

const POSITIONS = [
  "CEO / Founder",
  "Director",
  "Manager",
  "Sales / Business Dev",
  "Marketing",
  "Operations",
  "Other",
];

interface FormData {
  mode:       RegMode;
  firstName:  string;
  lastName:   string;
  logo:       string | null;
  company:    string;
  gender:     Gender | "";
  position:   string;
  product:    ProductType | "";
  quantity:   string;
  contact:    string;
  email:      string;
}

const EMPTY_FORM: FormData = {
  mode: "individual", firstName: "", lastName: "", logo: null, company: "",
  gender: "", position: "", product: "", quantity: "",
  contact: "", email: "",
};

const STORAGE_KEY = "expo.eventRegistrations";

type FieldKey = keyof FormData;

function validate(t: (k: string) => string, form: FormData): Partial<Record<FieldKey, string>> {
  const errs: Partial<Record<FieldKey, string>> = {};
  if (!form.firstName.trim()) errs.firstName = t("register.err.firstName");
  if (!form.lastName.trim())  errs.lastName  = t("register.err.lastName");
  if (form.mode === "company") {
    if (!form.company.trim()) errs.company = t("register.err.company");
    if (!form.position)       errs.position = t("register.err.position");
    if (!form.product)        errs.product  = t("register.err.product");
  }
  if (!form.gender) errs.gender = t("register.err.gender");
  const q = Number(form.quantity);
  if (!form.quantity || !Number.isInteger(q) || q < 1) {
    errs.quantity = t("register.err.quantity");
  }
  if (!/^[+\d][\d\s\-()]{6,}$/.test(form.contact.trim())) {
    errs.contact = t("register.err.contact");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errs.email = t("register.err.email");
  }
  return errs;
}

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialEventId = params.get("event");
  const [openEvent, setOpenEvent] = useState<ExpoEvent | null>(() => {
    return EVENTS.find((e) => e.id === initialEventId) ?? null;
  });
  const [submitted, setSubmitted] = useState<{ id: string; eventId: string; eventName: string } | null>(null);

  useEffect(() => {
    document.title = `${t("register.title")} — Expo`;
  }, [t]);

  const stats = useMemo(() => {
    const total = EVENTS.reduce((s, e) => s + e.capacity, 0);
    const remaining = EVENTS.reduce((s, e) => s + e.remaining, 0);
    return { total, remaining, sold: total - remaining };
  }, []);

  return (
    <div className="space-y-6">
      <div style={{ animation: "regIn 0.5s ease-out both" }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 text-xs font-medium">
          <Calendar className="h-3 w-3" />
          {t("register.badge")}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 text-slate-900 dark:text-slate-100">
          {t("register.title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t("register.subtitle")}</p>

        <div className="flex flex-wrap gap-3 mt-4">
          <Stat label={t("register.statEvents")}    value={EVENTS.length}   accent="from-blue-500 to-indigo-600" />
          <Stat label={t("register.statSeats")}     value={stats.remaining}  accent="from-emerald-500 to-teal-600" />
          <Stat label={t("register.statCapacity")}  value={stats.total}      accent="from-slate-700 to-slate-900" />
        </div>
      </div>

      {submitted ? (
        <SuccessCard
          id={submitted.id}
          eventName={submitted.eventName}
          onAnother={() => { setSubmitted(null); setOpenEvent(null); navigate("/register"); }}
        />
      ) : (
        <div className="space-y-3">
          {EVENTS.map((ev, i) => (
            <EventCard
              key={ev.id}
              event={ev}
              index={i}
              onRegister={() => setOpenEvent(ev)}
            />
          ))}
        </div>
      )}

      <RegisterDialog
        event={openEvent}
        onClose={() => setOpenEvent(null)}
        onSubmitted={(id) => {
          const ev = openEvent!;
          setSubmitted({ id, eventId: ev.id, eventName: ev.name });
          setOpenEvent(null);
        }}
      />

      <style>{`
        @keyframes regIn {
          0%   { opacity: 0; transform: translateY(12px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={cn("rounded-xl px-4 py-2.5 text-white text-xs shadow-sm", "bg-gradient-to-r", accent)}>
      <p className="opacity-80">{label}</p>
      <p className="text-lg font-bold tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function EventCard({ event, index, onRegister }: {
  event: ExpoEvent; index: number; onRegister: () => void;
}) {
  const { t } = useTranslation();
  const full = event.remaining === 0;
  const low  = event.remaining < 20 && !full;
  const pctFull = Math.round(((event.capacity - event.remaining) / event.capacity) * 100);

  return (
    <Card
      style={{
        animation: "regIn 0.45s ease-out both",
        animationDelay: `${0.1 + index * 0.06}s`,
      }}
      className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex sm:w-44 items-center gap-3 p-5 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{event.time}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {event.room}
              </p>
            </div>
          </div>

          <div className="flex-1 p-5">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{event.name}</h3>
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                typeVariantBadge(event.type).cls,
              )}>{event.type}</div>
              {low  && (
                <div className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                  {t("register.seatsLeft", { count: event.remaining })}
                </div>
              )}
              {full && (
                <div className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                  {t("register.soldOut")}
                </div>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{event.description}</p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", pctFull > 80 ? "bg-red-500" : "bg-blue-500")}
                  style={{ width: `${pctFull}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                <Users className="h-3 w-3" />
                {t("register.seatsAvailable", { remaining: event.remaining, capacity: event.capacity })}
              </p>
            </div>
          </div>

          <div className="flex sm:w-44 items-center justify-center p-5 sm:border-l border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <Button
              onClick={onRegister}
              disabled={full}
              className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm disabled:opacity-50"
            >
              {full ? t("register.soldOut") : t("register.registerBtn")}
              {!full && <ArrowRight className="h-3.5 w-3.5 ml-1" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function typeVariantBadge(type: string): { cls: string } {
  const v = typeVariant[type as keyof typeof typeVariant];
  if (v === "default")   return { cls: "bg-blue-100 text-blue-700" };
  if (v === "secondary") return { cls: "bg-indigo-100 text-indigo-700" };
  return                   { cls: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" };
}

function SuccessCard({ id, eventName, onAnother }: {
  id: string; eventName: string; onAnother: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Card
      className="border-emerald-200/80 shadow-xl shadow-emerald-200/30 overflow-hidden"
      style={{ animation: "regIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}
    >
      <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
      <CardContent className="pt-10 pb-10 px-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200 mb-5">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("register.successTitle")}</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          {t("register.successSub", { eventName })}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm">
          <span className="text-slate-500 dark:text-slate-400">{t("register.referenceId")}</span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{id}</span>
        </div>
        <div className="flex gap-3 mt-8 justify-center flex-wrap">
          <Button variant="outline" onClick={onAnother} className="rounded-full">
            {t("register.another")}
          </Button>
          <Button asChild className="rounded-full">
            <a href="/program">{t("register.viewProgram")}</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RegisterDialog({
  event, onClose, onSubmitted,
}: {
  event: ExpoEvent | null;
  onClose: () => void;
  onSubmitted: (id: string) => void;
}) {
  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {event && (
          <RegistrationForm
            key={event.id}
            event={event}
            onCancel={onClose}
            onSubmitted={onSubmitted}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RegistrationForm({
  event, onCancel, onSubmitted,
}: {
  event: ExpoEvent;
  onCancel: () => void;
  onSubmitted: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [touched, setTouched] = useState<Set<FieldKey>>(new Set());
  const [loading, setLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function set<K extends FieldKey>(key: K, value: FormData[K]) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched.has(key)) setErrors(validate(t, updated));
  }

  function blur(key: FieldKey) {
    const next = new Set(touched);
    next.add(key);
    setTouched(next);
    setErrors(validate(t, form));
  }

  function handleLogoFile(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.type)) {
      setErrors((e) => ({ ...e, logo: t("register.err.logoType") }));
      setTouched((s) => new Set(s).add("logo"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, logo: t("register.err.logoSize") }));
      setTouched((s) => new Set(s).add("logo"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("logo", reader.result as string);
      setErrors((e) => {
        const { logo: _drop, ...rest } = e;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const all = new Set<FieldKey>(Object.keys(form) as FieldKey[]);
    setTouched(all);
    const errs = validate(t, form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstBad = Object.keys(errs)[0];
      document.getElementById(`reg-${event.id}-field-${firstBad}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const id = `EVT-${Date.now().toString(36).toUpperCase()}`;
      list.unshift({
        id,
        eventId: event.id,
        eventName: event.name,
        ...form,
        logo: form.mode === "company" ? form.logo : null,
        company: form.mode === "company" ? form.company : "",
        position: form.mode === "company" ? form.position : "",
        product: form.mode === "company" ? form.product : "",
        submittedAt: new Date().toISOString(),
        status: "Pending",
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setLoading(false);
      onSubmitted(id);
    }, 800);
  }

  function genderLabel(g: Gender): string {
    if (g === "male")   return t("register.gender_male");
    if (g === "female") return t("register.gender_female");
    if (g === "other")  return t("register.gender_other");
    return t("register.gender_na");
  }

  function productLabel(p: ProductType): string {
    return t(`register.product_${p}`);
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="h-3 w-3" /> {event.time}
          <span>·</span>
          <MapPin className="h-3 w-3" /> {event.room}
        </div>
        <DialogTitle className="text-xl">{t("register.dialogTitle", { eventName: event.name })}</DialogTitle>
        <DialogDescription>
          {t("register.dialogSeats", { remaining: event.remaining, capacity: event.capacity })}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-3 p-1 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 gap-1">
        {(["individual", "company"] as RegMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => set("mode", m)}
            className={cn(
              "h-8 px-4 rounded-full text-xs font-semibold transition-all",
              form.mode === m
                ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300"
            )}
          >
            {m === "individual" ? t("register.modeIndividual") : t("register.modeCompany")}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-2">
        <Section icon={User} title={t("register.sectionPersonal")}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id={`reg-${event.id}-field-firstName`} label={t("register.firstName")} required error={errors.firstName} touched={touched.has("firstName")}>
              <Input
                placeholder={t("register.firstNamePh")}
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                onBlur={() => blur("firstName")}
                className={inputCls(!!errors.firstName && touched.has("firstName"))}
              />
            </Field>
            <Field id={`reg-${event.id}-field-lastName`} label={t("register.lastName")} required error={errors.lastName} touched={touched.has("lastName")}>
              <Input
                placeholder={t("register.lastNamePh")}
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                onBlur={() => blur("lastName")}
                className={inputCls(!!errors.lastName && touched.has("lastName"))}
              />
            </Field>
          </div>
          <Field id={`reg-${event.id}-field-gender`} label={t("register.gender")} required error={errors.gender} touched={touched.has("gender")}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => { set("gender", g.value); setTouched((s) => new Set(s).add("gender")); }}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 px-3 rounded-lg border text-sm font-medium transition-all",
                    form.gender === g.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span>{g.emoji}</span>
                  <span>{genderLabel(g.value)}</span>
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {form.mode === "company" && (
        <Section icon={Building2} title={t("register.sectionCompany")}>
          <Field id={`reg-${event.id}-field-company`} label={t("register.company")} required error={errors.company} touched={touched.has("company")}>
            <Input
              placeholder={t("register.companyPh")}
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              onBlur={() => blur("company")}
              className={inputCls(!!errors.company && touched.has("company"))}
            />
          </Field>

          <Field id={`reg-${event.id}-field-logo`} label={t("register.logo")} error={errors.logo} touched={touched.has("logo")} hint={t("register.logoHint")}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleLogoFile(e.dataTransfer.files?.[0]); }}
              onClick={() => logoInputRef.current?.click()}
              className={cn(
                "relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-4 flex items-center justify-center",
                dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50",
                errors.logo && touched.has("logo") && "border-red-400 bg-red-50 dark:bg-red-950/40/50"
              )}
            >
              {form.logo ? (
                <div className="flex items-center gap-4 w-full">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
                    <img src={form.logo} alt="logo" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t("register.logoAttached")}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t("register.logoReplace")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); set("logo", null); }}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Upload className="h-4 w-4" />
                  <span>{t("register.logoDrop")}</span>
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => handleLogoFile(e.target.files?.[0] ?? undefined)}
              />
            </div>
          </Field>

          <Field id={`reg-${event.id}-field-position`} label={t("register.position")} required error={errors.position} touched={touched.has("position")}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { set("position", p); setTouched((s) => new Set(s).add("position")); }}
                  className={cn(
                    "h-9 px-3 rounded-lg border text-sm font-medium transition-all",
                    form.position === p
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
        </Section>
        )}

        {form.mode === "company" && (
        <Section icon={Package} title={t("register.sectionProduct")}>
          <Field id={`reg-${event.id}-field-product`} label={t("register.productType")} required error={errors.product} touched={touched.has("product")}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRODUCT_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => { set("product", p.value); setTouched((s) => new Set(s).add("product")); }}
                  className={cn(
                    "flex items-center gap-2 h-10 px-3 rounded-lg border text-sm font-medium transition-all",
                    form.product === p.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <span>{productLabel(p.value)}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field id={`reg-${event.id}-field-quantity`} label={t("register.quantity")} required error={errors.quantity} touched={touched.has("quantity")} hint={t("register.quantityHint")}>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => set("quantity", String(Math.max(0, (Number(form.quantity) || 0) - 1)))}
              >−</Button>
              <Input
                type="number"
                min={1}
                step={1}
                placeholder={t("register.quantityPh")}
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                onBlur={() => blur("quantity")}
                className={cn("text-center", inputCls(!!errors.quantity && touched.has("quantity")))}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => set("quantity", String((Number(form.quantity) || 0) + 1))}
              >+</Button>
            </div>
          </Field>
        </Section>
        )}

        <Section icon={Phone} title={t("register.sectionContact")}>
          <Field id={`reg-${event.id}-field-email`} label={t("register.email")} required error={errors.email} touched={touched.has("email")}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                type="email"
                placeholder={t("register.emailPh")}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={() => blur("email")}
                className={cn("pl-9", inputCls(!!errors.email && touched.has("email")))}
                autoComplete="email"
              />
            </div>
          </Field>

          <Field id={`reg-${event.id}-field-contact`} label={t("register.contact")} required error={errors.contact} touched={touched.has("contact")} hint={t("register.contactHint")}>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                type="tel"
                placeholder={t("register.contactPh")}
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                onBlur={() => blur("contact")}
                className={cn("pl-9", inputCls(!!errors.contact && touched.has("contact")))}
                autoComplete="tel"
              />
            </div>
          </Field>
        </Section>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("register.terms")}</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="rounded-full">
              {t("register.cancel")}
            </Button>
            <Button type="submit" disabled={loading} className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("register.submitting")}
                </>
              ) : (
                <>
                  {t("register.submit")}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

function inputCls(invalid: boolean) {
  return invalid ? "border-red-400 focus-visible:ring-red-400" : "";
}

function Section({
  icon: Icon, title, children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-blue-600" />
        </div>
        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  id, label, required, error, touched, hint, children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && touched && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
