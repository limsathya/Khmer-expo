import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Search, Eye, CheckCircle2, XCircle, Trash2, Send,
  Mail, ChevronDown, ChevronRight, Building2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "Pending" | "Approved" | "Rejected";
type Mode = "individual" | "company";
type EmailType = "approved" | "rejected";

interface Registration {
  id: string;
  eventId: string;
  eventName: string;
  mode: Mode;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  contact: string;
  company: string;
  position: string;
  product: string;
  quantity: number;
  submittedAt: string;
  status: Status;
}

interface SentEmail {
  id: string;
  registrationId: string;
  to: string;
  recipientName: string;
  subject: string;
  body: string;
  type: EmailType;
  sentAt: string;
}

const STORAGE_REG = "expo.admin.registrations";
const STORAGE_MAIL = "expo.sentEmails";

const INITIAL: Registration[] = [
  {
    id: "EVT-A1", eventId: "keynote-innovation", eventName: "Keynote: Innovation",
    mode: "company", firstName: "Sokha", lastName: "Ly", gender: "female",
    email: "sokha@acme-co.com", contact: "+855 12 111 111",
    company: "Acme Co., Ltd.", position: "CEO / Founder", product: "electronics", quantity: 2,
    submittedAt: "2026-10-01T09:14:00Z", status: "Approved",
  },
  {
    id: "EVT-B2", eventId: "workshop-tech-expo", eventName: "Workshop: Tech Expo",
    mode: "individual", firstName: "Wei", lastName: "Zhang", gender: "male",
    email: "wei@example.com", contact: "+86 138 0000 0001",
    company: "", position: "", product: "", quantity: 1,
    submittedAt: "2026-10-01T11:32:00Z", status: "Pending",
  },
  {
    id: "EVT-C3", eventId: "panel-future-ai", eventName: "Panel: Future of AI",
    mode: "company", firstName: "Maria", lastName: "Santos", gender: "female",
    email: "maria@studiowave.io", contact: "+63 917 000 0001",
    company: "Studio Wave", position: "Marketing", product: "service", quantity: 1,
    submittedAt: "2026-09-30T16:48:00Z", status: "Approved",
  },
  {
    id: "EVT-D4", eventId: "networking-session", eventName: "Networking Session",
    mode: "individual", firstName: "Ali", lastName: "Hassan", gender: "male",
    email: "ali@example.com", contact: "+20 100 000 0001",
    company: "", position: "", product: "", quantity: 1,
    submittedAt: "2026-09-30T20:01:00Z", status: "Rejected",
  },
  {
    id: "EVT-E5", eventId: "opening-ceremony", eventName: "Opening Ceremony",
    mode: "company", firstName: "Chantha", lastName: "Keo", gender: "female",
    email: "chantha@kpcorp.kh", contact: "+855 12 222 222",
    company: "KP Corp", position: "Director", product: "food", quantity: 3,
    submittedAt: "2026-09-29T08:22:00Z", status: "Pending",
  },
  {
    id: "EVT-F6", eventId: "keynote-innovation", eventName: "Keynote: Innovation",
    mode: "company", firstName: "Lena", lastName: "Müller", gender: "female",
    email: "lena@brightlabs.de", contact: "+49 170 000 0001",
    company: "Bright Labs", position: "Manager", product: "craft", quantity: 1,
    submittedAt: "2026-09-28T10:05:00Z", status: "Approved",
  },
  {
    id: "EVT-G7", eventId: "workshop-tech-expo", eventName: "Workshop: Tech Expo",
    mode: "individual", firstName: "Priya", lastName: "Sharma", gender: "female",
    email: "priya@example.com", contact: "+91 98000 00001",
    company: "", position: "", product: "", quantity: 1,
    submittedAt: "2026-09-28T14:39:00Z", status: "Pending",
  },
];

function statusVariant(s: Status): "success" | "warning" | "destructive" {
  if (s === "Approved") return "success";
  if (s === "Pending")  return "warning";
  return "destructive";
}

function statusBadgeClass(s: Status): string {
  if (s === "Approved") return "bg-emerald-100 text-emerald-700";
  if (s === "Pending")  return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function buildApprovalEmail(reg: Registration): SentEmail {
  const greeting = reg.mode === "company" ? `${reg.firstName} from ${reg.company}` : reg.firstName;
  return {
    id: `MAIL-${Date.now().toString(36).toUpperCase()}`,
    registrationId: reg.id,
    to: reg.email,
    recipientName: `${reg.firstName} ${reg.lastName}`,
    type: "approved",
    subject: `✓ Registration approved — ${reg.eventName}`,
    body:
      `Hi ${greeting},\n\n` +
      `Great news — your registration for "${reg.eventName}" has been approved.\n\n` +
      `Reference: ${reg.id}\n` +
      `Quantity: ${reg.quantity} seat${reg.quantity > 1 ? "s" : ""}\n\n` +
      `Please arrive 15 minutes before the session starts. A confirmation email with the venue map is on its way.\n\n` +
      `— Expo 2026 Team`,
    sentAt: new Date().toISOString(),
  };
}

function buildRejectionEmail(reg: Registration): SentEmail {
  const greeting = reg.mode === "company" ? `${reg.firstName} from ${reg.company}` : reg.firstName;
  return {
    id: `MAIL-${Date.now().toString(36).toUpperCase()}`,
    registrationId: reg.id,
    to: reg.email,
    recipientName: `${reg.firstName} ${reg.lastName}`,
    type: "rejected",
    subject: `Registration update — ${reg.eventName}`,
    body:
      `Hi ${greeting},\n\n` +
      `Thank you for your interest in "${reg.eventName}". Unfortunately, we were unable to confirm your seat at this time.\n\n` +
      `Reference: ${reg.id}\n\n` +
      `This may be due to limited capacity or an incomplete application. Please reply to this email if you'd like to be added to the waitlist.\n\n` +
      `— Expo 2026 Team`,
    sentAt: new Date().toISOString(),
  };
}

export default function Registrations() {
  const [data, setData] = useState<Registration[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_REG);
      if (raw) return JSON.parse(raw) as Registration[];
    } catch { /* ignore */ }
    return INITIAL;
  });
  const [emails, setEmails] = useState<SentEmail[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_MAIL);
      if (raw) return JSON.parse(raw) as SentEmail[];
    } catch { /* ignore */ }
    return [];
  });
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [emailsOpen, setEmailsOpen] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => { localStorage.setItem(STORAGE_REG, JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem(STORAGE_MAIL, JSON.stringify(emails)); }, [emails]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  function updateStatus(id: string, newStatus: Status) {
    const target = data.find((r) => r.id === id);
    if (!target || target.status === newStatus) return;
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
    if (newStatus === "Approved") {
      const mail = buildApprovalEmail(target);
      setEmails((prev) => [mail, ...prev]);
      showToast(`Approved — email sent to ${target.email}`);
    } else if (newStatus === "Rejected") {
      const mail = buildRejectionEmail(target);
      setEmails((prev) => [mail, ...prev]);
      showToast(`Rejected — email sent to ${target.email}`);
    }
  }

  function deleteEntry(id: string) {
    setData((prev) => prev.filter((r) => r.id !== id));
    setSelected(null);
    showToast("Entry deleted.", "error");
  }

  function resendEmail(mail: SentEmail) {
    setEmails((prev) => [
      {
        ...mail,
        id: `MAIL-${Date.now().toString(36).toUpperCase()}`,
        sentAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    showToast(`Re-sent to ${mail.to}`);
  }

  const visible = data.filter((r) => {
    const matchStatus = filter === "All" || r.status === filter;
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.eventName.toLowerCase().includes(search.toLowerCase()) ||
      (r.company || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const FILTERS: ("All" | Status)[] = ["All", "Approved", "Pending", "Rejected"];

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium",
          toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
        )}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
        <p className="text-muted-foreground mt-1">
          Review submissions, approve or reject, and auto-send confirmation emails.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <CardTitle>All Registrations ({visible.length})</CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, event…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <div className="flex gap-1">
                {FILTERS.map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f)}
                    className="rounded-full"
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {["Type", "Attendee", "Email", "Event", "Status", "Submitted", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No results found.</td></tr>
                ) : visible.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelected(row)}
                  >
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        row.mode === "company"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-sky-100 text-sky-700"
                      )}>
                        {row.mode === "company"
                          ? <Building2 className="h-3 w-3" />
                          : <User className="h-3 w-3" />}
                        {row.mode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.firstName} {row.lastName}</p>
                      {row.mode === "company" && row.company && (
                        <p className="text-xs text-muted-foreground">{row.company}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.eventName}</p>
                      <p className="text-xs text-muted-foreground">×{row.quantity}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", statusBadgeClass(row.status))}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(row.submittedAt)}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" title="View" onClick={() => setSelected(row)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {row.status !== "Approved" && (
                          <Button
                            size="icon" variant="ghost"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/40"
                            title="Approve"
                            onClick={() => updateStatus(row.id, "Approved")}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        {row.status !== "Rejected" && (
                          <Button
                            size="icon" variant="ghost"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:bg-rose-950/40"
                            title="Reject"
                            onClick={() => updateStatus(row.id, "Rejected")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <button
            onClick={() => setEmailsOpen((v) => !v)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Sent Emails ({emails.length})</CardTitle>
            </div>
            {emailsOpen
              ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
              : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </button>
        </CardHeader>
        {emailsOpen && (
          <CardContent>
            {emails.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No emails sent yet. Approve or reject a registration to auto-send one.
              </p>
            ) : (
              <div className="space-y-2">
                {emails.map((m) => {
                  const expanded = expandedEmail === m.id;
                  return (
                    <div
                      key={m.id}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:border-slate-300 dark:border-slate-700"
                    >
                      <button
                        onClick={() => setExpandedEmail(expanded ? null : m.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 transition-colors"
                      >
                        {expanded
                          ? <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                          : <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />}
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0",
                          m.type === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        )}>
                          {m.type === "approved" ? "Approved" : "Rejected"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{m.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            To {m.recipientName} · {m.to}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDate(m.sentAt)}
                        </span>
                      </button>
                      {expanded && (
                        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-4">
                          <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
{m.body}
                          </pre>
                          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resendEmail(m)}
                              className="rounded-full"
                            >
                              <Send className="h-3.5 w-3.5 mr-1" /> Re-send
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.firstName} {selected.lastName}</DialogTitle>
                <DialogDescription>{selected.email}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <Detail label="Mode" value={
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                    selected.mode === "company"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-sky-100 text-sky-700"
                  )}>
                    {selected.mode === "company"
                      ? <Building2 className="h-3 w-3" />
                      : <User className="h-3 w-3" />}
                    {selected.mode}
                  </span>
                } />
                <Detail label="Event" value={selected.eventName} />
                <Detail label="Contact" value={selected.contact} />
                <Detail label="Gender" value={selected.gender} />
                {selected.mode === "company" && (
                  <>
                    <Detail label="Company" value={selected.company || "—"} />
                    <Detail label="Position" value={selected.position || "—"} />
                    <Detail label="Product" value={selected.product || "—"} />
                  </>
                )}
                <Detail label="Quantity" value={`${selected.quantity} seat${selected.quantity > 1 ? "s" : ""}`} />
                <Detail label="Submitted" value={formatDate(selected.submittedAt)} />
                <Detail label="Reference" value={<span className="font-mono text-xs">{selected.id}</span>} />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", statusBadgeClass(selected.status))}>
                    {selected.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2 flex-wrap">
                {selected.status !== "Approved" && (
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-full"
                    onClick={() => updateStatus(selected.id, "Approved")}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                  </Button>
                )}
                {selected.status !== "Rejected" && (
                  <Button
                    className="flex-1 rounded-full"
                    variant="destructive"
                    onClick={() => updateStatus(selected.id, "Rejected")}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-rose-600 hover:bg-rose-50 dark:bg-rose-950/40 rounded-full"
                  onClick={() => deleteEntry(selected.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
