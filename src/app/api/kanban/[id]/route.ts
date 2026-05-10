import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { title, body, status, assignee } = await req.json();
    const cmdArgs = (args: string[]) => execSync(args.join(' '), { timeout: 10000 });

    if (status === 'done')     cmdArgs(['hermes', 'kanban', 'complete', id]);
    else if (status === 'blocked') cmdArgs(['hermes', 'kanban', 'block', id]);
    else if (status === 'todo' || status === 'ready' || status === 'running' || status === 'review')
      cmdArgs(['hermes', 'kanban', 'unblock', id]);

    if (title)    cmdArgs(['hermes', 'kanban', 'edit', id, '--title', title]);
    if (body !== undefined) cmdArgs(['hermes', 'kanban', 'edit', id, '--body', body]);
    if (assignee) cmdArgs(['hermes', 'kanban', 'assign', id, assignee]);

    const out = execSync(`hermes kanban get ${id} --format json`, { timeout: 10000 });
    const task = JSON.parse(out.toString());
    return NextResponse.json({ task });
  } catch (err) {
    console.error(`PATCH /api/kanban/${id} error:`, err);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    execSync(`hermes kanban archive ${id}`, { timeout: 10000 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/kanban/${id} error:`, err);
    return NextResponse.json({ error: 'Failed to archive task' }, { status: 500 });
  }
}