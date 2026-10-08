import AdminDashboardPage from '../page';

export function generateStaticParams() {
  return [
    { section: 'events' },
    { section: 'registrations' },
    { section: 'exhibitors' },
    { section: 'companies' },
    { section: 'booths' },
    { section: 'program' },
    { section: 'speakers' },
    { section: 'vip' },
    { section: 'committees' },
    { section: 'subcommittees' },
    { section: 'tasks' },
    { section: 'members' },
    { section: 'invites' },
    { section: 'checkin' },
    { section: 'sponsors' },
    { section: 'news' },
    { section: 'gallery' },
    { section: 'categories' },
    { section: 'zones' },
    { section: 'reports' },
    { section: 'users' },
    { section: 'identity' },
    { section: 'database' },
  ];
}

export default async function AdminSectionPage({ params }) {
  const resolvedParams = await params;
  const section = resolvedParams?.section || 'events';

  return <AdminDashboardPage initialSection={section} />;
}
