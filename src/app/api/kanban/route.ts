import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    const out = execSync(`hermes kanban list --board emvy --format json`, { timeout: 10000 });
    const tasks = JSON.parse(out.toString());
    return NextResponse.json({ tasks });
  } catch (err) {
    console.error('GET /api/kanban error:', err);
    return NextResponse.json({ error: 'Failed to list tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, body = '', assignee = '' } = await req.json();
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

    const args = [
      'hermes', 'kanban', 'create',
      '--board', 'emvy',
      '--title', title,
    ];
    if (body)  args.push('--body', body);
    if (assignee) args.push('--assignee', assignee);

    const out = execSync(args.join(' '), { timeout: 10000 });
    const task = JSON.parse(out.toString());
    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    console.error('POST /api/kanban error:', err);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}