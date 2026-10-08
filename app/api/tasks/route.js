import { NextResponse } from 'next/server';
import { getTasksFromDB, createTaskInDB } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      subcommitteeId: searchParams.get('subcommitteeId') || 'all',
      status: searchParams.get('status') || 'all',
      priority: searchParams.get('priority') || 'all'
    };
    const tasks = await getTasksFromDB(filters);
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }
    const task = await createTaskInDB(body);
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
