'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Users, 
  Building2, 
  CheckCircle2, 
  Award, 
  CheckSquare, 
  Calendar,
  RefreshCw
} from 'lucide-react';

export default function ReportsManager({ showToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load report stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const reportsList = [
    {
      id: 'registrations',
      title: 'Registration & Accreditation Report',
      desc: 'Full directory of all international visitors, VIPs, exhibitors, education delegates, and credentials.',
      icon: Users,
      color: '#6366f1',
      metric: `${stats?.totalRegistrations || 0} Registered`,
      csvEndpoint: '/api/reports?type=registrations&format=csv'
    },
    {
      id: 'exhibitors',
      title: 'Exhibitors & Booth Directory Report',
      desc: 'Participating enterprises, assigned booth numbers, country of origin, and primary trade contact points.',
      icon: Building2,
      color: '#3b82f6',
      metric: `${stats?.totalExhibitors || 0} Exhibitors`,
      csvEndpoint: '/api/reports?type=exhibitors&format=csv'
    },
    {
      id: 'checkins',
      title: 'Real-Time QR Attendance & Check-in Report',
      desc: 'Timestamped log of accredited attendees verified and admitted across venue turnstiles and security gates.',
      icon: CheckCircle2,
      color: '#10b981',
      metric: `${stats?.totalCheckins || 0} Check-ins`,
      csvEndpoint: '/api/reports?type=checkins&format=csv'
    },
    {
      id: 'booths',
      title: 'Exhibition Hall Booth Utilization Report',
      desc: 'Occupancy statistics, rental rate yields, and remaining availability across 75 standardized exhibition spaces.',
      icon: FileSpreadsheet,
      color: '#f59e0b',
      metric: `${stats?.occupiedBooths || 0} / ${stats?.totalBooths || 75} Occupied`,
      csvEndpoint: '/api/reports?type=booths&format=csv'
    },
    {
      id: 'tasks',
      title: 'Committee Task Execution & Deliverables Report',
      desc: 'Operational task completion status, overdue deadlines, and workload distribution across 13 subcommittees.',
      icon: CheckSquare,
      color: '#8b5cf6',
      metric: `${stats?.completedTasks || 0} / ${stats?.totalTasks || 0} Done`,
      csvEndpoint: '/api/reports?type=tasks&format=csv'
    },
    {
      id: 'vip',
      title: 'Diplomatic Protocol & VIP Seating Report',
      desc: 'Delegation rank, attendance confirmations, official escort coordination, and plenary stage seating charts.',
      icon: Award,
      color: '#ec4899',
      metric: `${stats?.totalVipGuests || 0} Dignitaries`,
      csvEndpoint: '/api/reports?type=vip&format=csv'
    }
  ];

  const handleDownload = (endpoint, title) => {
    window.open(endpoint, '_blank');
    if (showToast) showToast(`Downloading ${title} CSV...`);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Operational Reports & Analytical Exports
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              Dynamic Live Generation
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Generate real-time reports directly from Supabase PostgreSQL without duplicate database overhead.
          </p>
        </div>

        <button onClick={loadStats} className="btn btn-secondary btn-sm" title="Refresh">
          <RefreshCw size={14} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
        {reportsList.map(rep => {
          const Icon = rep.icon;

          return (
            <div key={rep.id} className="glass-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${rep.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rep.color }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: rep.color, background: `${rep.color}15`, padding: '3px 10px', borderRadius: '6px' }}>
                    {rep.metric}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                  {rep.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  {rep.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button
                  onClick={() => handleDownload(rep.csvEndpoint, rep.title)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: '700' }}
                >
                  <Download size={14} />
                  <span>Download Full CSV Export</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
