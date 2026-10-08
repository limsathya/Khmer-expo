import { NextResponse } from 'next/server';
import { 
  getRegistrationsFromDB, 
  getExhibitorsFromDB, 
  getCheckinsListFromDB, 
  getBoothsFromDB, 
  getTasksFromDB,
  getVipGuestsFromDB
} from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const format = searchParams.get('format') || 'json';

    if (type === 'registrations') {
      const data = await getRegistrationsFromDB();
      if (format === 'csv') {
        const header = 'Registration Number,Full Name,Gender,Nationality,Organization,Position,Email,Phone,Country,City,Registration Type,Status,Checked In,Checked In At,Created At\n';
        const rows = data.map(r => 
          `"${r.reg_number}","${r.full_name}","${r.gender || ''}","${r.nationality || ''}","${r.organization}","${r.position || ''}","${r.email}","${r.phone || ''}","${r.country}","${r.city || ''}","${r.reg_type}","${r.status}","${r.checked_in ? 'Yes' : 'No'}","${r.checked_in_at || ''}","${r.created_at}"`
        ).join('\n');
        return new NextResponse(header + rows, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="expo_registrations_report.csv"'
          }
        });
      }
      return NextResponse.json(data);
    }

    if (type === 'exhibitors') {
      const data = await getExhibitorsFromDB();
      if (format === 'csv') {
        const header = 'Company Name,Booth Number,Industry,Country,Contact Name,Contact Email,Contact Phone,Status\n';
        const rows = data.map(r => 
          `"${r.company_name}","${r.booth_number || ''}","${r.industry || ''}","${r.country || ''}","${r.contact_name || ''}","${r.contact_email || ''}","${r.contact_phone || ''}","${r.status}"`
        ).join('\n');
        return new NextResponse(header + rows, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="expo_exhibitors_report.csv"'
          }
        });
      }
      return NextResponse.json(data);
    }

    if (type === 'checkins') {
      const data = await getCheckinsListFromDB();
      if (format === 'csv') {
        const header = 'Registration Number,Attendee Name,Organization,Registration Type,Checked In At,Staff Username\n';
        const rows = data.map(r => 
          `"${r.reg_number}","${r.attendee_name}","${r.organization}","${r.reg_type}","${r.checked_in_at}","${r.staff_username}"`
        ).join('\n');
        return new NextResponse(header + rows, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="expo_checkins_report.csv"'
          }
        });
      }
      return NextResponse.json(data);
    }

    if (type === 'booths') {
      const data = await getBoothsFromDB();
      return NextResponse.json(data);
    }

    if (type === 'tasks') {
      const data = await getTasksFromDB();
      return NextResponse.json(data);
    }

    if (type === 'vip') {
      const data = await getVipGuestsFromDB();
      return NextResponse.json(data);
    }

    return NextResponse.json({
      availableReports: ['registrations', 'exhibitors', 'checkins', 'booths', 'tasks', 'vip'],
      formatSupported: ['json', 'csv']
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
