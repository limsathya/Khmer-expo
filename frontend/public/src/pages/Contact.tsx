import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormField = "name" | "email" | "message";
type Errors = Partial<Record<FormField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_EMAIL   = import.meta.env.VITE_CONTACT_EMAIL   ?? "info@expo.com";
const CONTACT_PHONE   = import.meta.env.VITE_CONTACT_PHONE   ?? "+855 23 000 000";
const CONTACT_ADDRESS = import.meta.env.VITE_CONTACT_ADDRESS ?? "Phnom Penh, Cambodia";

function validate(form: Record<FormField, string>): Errors {
  const errors: Errors = {};
  if (!form.name.trim())                              errors.name    = "Name is required.";
  if (!EMAIL_RE.test(form.email.trim()))              errors.email   = "Enter a valid email.";
  if (form.message.trim().length < 10)                errors.message = "Message must be at least 10 characters.";
  return errors;
}

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<FormField>>(new Set());
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: FormField, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched.has(field)) {
      setErrors(validate(updated));
    }
  };

  const blur = (field: FormField) => {
    setTouched(prev => new Set(prev).add(field));
    setErrors(validate(form));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const all = new Set<FormField>(["name", "email", "message"]);
    setTouched(all);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  function FieldError({ field }: { field: FormField }) {
    return errors[field] && touched.has(field) ? (
      <p className="flex items-center gap-1 text-xs text-destructive mt-1">
        <AlertCircle className="h-3 w-3" /> {errors[field]}
      </p>
    ) : null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("contact.title")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info */}
        <Card>
          <CardContent className="pt-6 space-y-5">
            {[
              { icon: MapPin, text: CONTACT_ADDRESS },
              { icon: Mail,   text: CONTACT_EMAIL    },
              { icon: Phone,  text: CONTACT_PHONE    },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0">
                  <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Form */}
        <div className="md:col-span-2">
          {sent ? (
            <Card>
              <CardContent className="pt-12 pb-12 flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Message sent!</p>
                  <p className="text-muted-foreground text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>
                <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); setTouched(new Set()); }}>
                  Send another message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader><CardTitle>Send us a message</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{t("contact.name")}</label>
                    <Input
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      onBlur={() => blur("name")}
                      className={cn(errors.name && touched.has("name") && "border-destructive focus-visible:ring-destructive")}
                    />
                    <FieldError field="name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{t("contact.email")}</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      onBlur={() => blur("email")}
                      className={cn(errors.email && touched.has("email") && "border-destructive focus-visible:ring-destructive")}
                    />
                    <FieldError field="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{t("contact.message")}</label>
                    <Textarea
                      rows={5}
                      placeholder="How can we help you? (min 10 characters)"
                      value={form.message}
                      onChange={e => set("message", e.target.value)}
                      onBlur={() => blur("message")}
                      className={cn(errors.message && touched.has("message") && "border-destructive focus-visible:ring-destructive")}
                    />
                    <div className="flex justify-between items-center">
                      <FieldError field="message" />
                      <span className={cn("text-xs ml-auto", form.message.length < 10 ? "text-muted-foreground" : "text-green-600")}>
                        {form.message.length} chars
                      </span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending…" : t("contact.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
