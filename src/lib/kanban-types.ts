export type KanbanStatus = 'todo' | 'ready' | 'running' | 'review' | 'blocked' | 'done';

export interface KanbanTask {
  id: string;
  title: string;
  body: string;
  status: KanbanStatus;
  assignee: string;
  created_at: string;
  updated_at: string;
}

export interface LaneDef {
  id: KanbanStatus;
  label: string;
  color: string;
}

export const LANES: LaneDef[] = [
  { id: 'todo',    label: 'To Do',    color: '#52525b' },
  { id: 'ready',   label: 'Ready',    color: '#3b82f6' },
  { id: 'running', label: 'Running',  color: '#f59e0b' },
  { id: 'review',  label: 'Review',   color: '#a855f7' },
  { id: 'blocked', label: 'Blocked',  color: '#ef4444' },
  { id: 'done',    label: 'Done',     color: '#22c55e' },
];