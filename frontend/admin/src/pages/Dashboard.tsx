import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

const ALL = [
  { id: 1,  name: "Sokha Ly",      email: "sokha@example.com",   status: "Approved", date: "2026-10-01" },
  { id: 2,  name: "Wei Zhang",     email: "wei@example.com",     status: "Pending",  date: "2026-10-01" },
  { id: 3,  name: "Maria Santos",  email: "maria@example.com",   status: "Approved", date: "2026-09-30" },
  { id: 4,  name: "Ali Hassan",    email: "ali@example.com",     status: "Rejected", date: "2026-09-30" },
  { id: 5,  name: "Chantha Keo",   email: "chantha@example.com", status: "Pending",  date: "2026-09-29" },
  { id: 6,  name: "Lena Müller",   email: "lena@example.com",    status: "Approved", date: "2026-09-28" },
  { id: 7,  name: "Priya Sharma",  email: "priya@example.com",   status: "Pending",  date: "2026-09-28" },
  { id: 8,  name: "James Okafor",  email: "james@example.com",   status: "Approved", date: "2026-09-27" },
  { id: 9,  name: "Srey Mom",      email: "sreymom@example.com", status: "Rejected", date: "2026-09-27" },
  { id: 10, name: "Liu Yang",      email: "liu@example.com",     status: "Approved", date: "2026-09-26" },
];

function statusVariant(s: string): "success" | "warning" | "destructive" {
  if (s === "Approved") return "success";
  if (s === "Pending")  return "warning";
  return "destructive";
}

// Animated counter hook
function useCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function StatCard({ label, target, icon: Icon, color, bg, suffix = "" }: {
  label: string; target: number; icon: React.ElementType;
  color: string; bg: string; suffix?: string;
}) {
  const value = useCounter(target);
  return (
    <Card className="hover:shadow-md transition-shadow cursor-default">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className={`p-2 rounded-full ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tabular-nums">{value}{suffix}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const total    = ALL.length;
  const approved = ALL.filter(r => r.status === "Approved").length;
  const pending  = ALL.filter(r => r.status === "Pending").length;
  const rejected = ALL.filter(r => r.status === "Rejected").length;

  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? ALL : ALL.filter(r => r.status.toLowerCase() === tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Live overview of registration activity</p>
      </div>

      {/* Animated stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total"    target={total}    icon={Users}        color="text-blue-600"   bg="bg-blue-50 dark:bg-blue-950/40" />
        <StatCard label="Approved" target={approved} icon={CheckCircle}  color="text-green-600"  bg="bg-green-50" />
        <StatCard label="Pending"  target={pending}  icon={Clock}        color="text-yellow-600" bg="bg-yellow-50 dark:bg-yellow-950/40" />
        <StatCard label="Rejected" target={rejected} icon={XCircle}      color="text-red-600"    bg="bg-red-50 dark:bg-red-950/40" />
      </div>

      {/* Approval progress bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Approval Rate
            </CardTitle>
            <span className="text-sm font-semibold text-green-600">
              {Math.round((approved / total) * 100)}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={Math.round((approved / total) * 100)} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{approved} approved</span>
            <span>{pending} pending</span>
            <span>{rejected} rejected</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed recent registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pb-4 pt-2">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All ({total})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approved})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pending})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejected})</TabsTrigger>
              </TabsList>
              <TabsContent value={tab}>
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        {["#", "Name", "Email", "Status", "Date"].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(({ id, name, email, status, date }) => (
                        <tr key={id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground">{id}</td>
                          <td className="px-4 py-3 font-medium">{name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{email}</td>
                          <td className="px-4 py-3">
                            <Badge variant={statusVariant(status)}>{status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{date}</td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No entries.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
