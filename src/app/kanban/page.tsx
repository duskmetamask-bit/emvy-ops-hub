'use client';

import { useEffect, useState, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanTask, KanbanStatus, LANES } from '@/lib/kanban-types';

// ─── Card Detail Drawer ───────────────────────────────────────────────────────

function CardDrawer({
  task,
  onClose,
  onUpdate,
  onArchive,
}: {
  task: KanbanTask;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<KanbanTask>) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(task.title);
  const [body, setBody] = useState(task.body);
  const [assignee, setAssignee] = useState(task.assignee);
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  const lane = LANES.find(l => l.id === task.status)!;

  const save = async () => {
    setSaving(true);
    await onUpdate(task.id, { title, body, assignee, status });
    setSaving(false);
    onClose();
  };

  const archive = async () => {
    if (!confirm('Archive this task?')) return;
    await onArchive(task.id);
    onClose();
  };

  return (
    <div className="kanban-drawer-overlay" onClick={onClose}>
      <div className="kanban-drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="kanban-drawer-header">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: lane.color }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: lane.color }}>{lane.label}</span>
          </div>
          <button onClick={onClose} className="kanban-drawer-close">×</button>
        </div>

        {/* Title */}
        <div className="px-6 pt-5 pb-4">
          <input
            className="kanban-drawer-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-4">
          <label className="kanban-field-label">Description</label>
          <textarea
            className="kanban-textarea"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Add description..."
            rows={4}
          />
        </div>

        {/* Fields row */}
        <div className="px-6 pb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="kanban-field-label">Assignee</label>
            <input
              className="kanban-input"
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              placeholder="name"
            />
          </div>
          <div>
            <label className="kanban-field-label">Status</label>
            <select
              className="kanban-input"
              value={status}
              onChange={e => setStatus(e.target.value as KanbanStatus)}
            >
              {LANES.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button onClick={archive} className="kanban-archive-btn">Archive</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="kanban-cancel-btn">Cancel</button>
            <button onClick={save} disabled={saving} className="kanban-save-btn">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Card Form ────────────────────────────────────────────────────────────

function AddCardForm({
  laneId,
  onSubmit,
  onCancel,
}: {
  laneId: KanbanStatus;
  onSubmit: (title: string, body: string, assignee: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [assignee, setAssignee] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    await onSubmit(title.trim(), body.trim(), assignee.trim());
    setSubmitting(false);
  };

  return (
    <div className="kanban-add-form">
      <input
        ref={inputRef}
        className="kanban-input"
        placeholder="Task title…"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onCancel(); }}
      />
      <textarea
        className="kanban-textarea mt-2"
        placeholder="Description (optional)"
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={2}
      />
      <input
        className="kanban-input mt-2"
        placeholder="Assignee (optional)"
        value={assignee}
        onChange={e => setAssignee(e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <button onClick={submit} disabled={submitting} className="kanban-save-btn flex-1">
          {submitting ? 'Adding…' : 'Add'}
        </button>
        <button onClick={onCancel} className="kanban-cancel-btn">Cancel</button>
      </div>
    </div>
  );
}

// ─── Task Card (Sortable) ─────────────────────────────────────────────────────

function TaskCard({
  task,
  onClick,
}: {
  task: KanbanTask;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const age = Math.floor((Date.now() - new Date(task.created_at).getTime()) / 86400000);
  const lane = LANES.find(l => l.id === task.status)!;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="kanban-card" onClick={onClick}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{task.title}</p>
          {age > 0 && (
            <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded shrink-0 mt-0.5"
              style={{
                background: age > 7 ? '#ef444420' : age > 3 ? '#f59e0b20' : '#22c55e20',
                color: age > 7 ? '#ef4444' : age > 3 ? '#f59e0b' : '#22c55e',
                border: `1px solid ${age > 7 ? '#ef444440' : age > 3 ? '#f59e0b40' : '#22c55e40'}`,
              }}>
              {age}d
            </span>
          )}
        </div>

        {task.body && (
          <p className="text-xs text-[var(--text-muted)] leading-snug line-clamp-2 mb-2">{task.body}</p>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: `${lane.color}20`, color: lane.color, border: `1px solid ${lane.color}40` }}>
            {lane.label}
          </span>
          {task.assignee && (
            <span className="text-[10px] text-[var(--text-muted)] font-medium truncate max-w-[80px]">
              {task.assignee}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Lane Column ──────────────────────────────────────────────────────────────

function LaneColumn({
  lane,
  tasks,
  onCardClick,
  onAddCard,
  isAdding,
  onStartAdd,
  onCancelAdd,
}: {
  lane: typeof LANES[number];
  tasks: KanbanTask[];
  onCardClick: (task: KanbanTask) => void;
  onAddCard: (title: string, body: string, assignee: string) => Promise<void>;
  isAdding: boolean;
  onStartAdd: () => void;
  onCancelAdd: () => void;
}) {
  return (
    <div className="kanban-lane">
      {/* Lane header */}
      <div className="kanban-lane-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: lane.color }} />
          <span className="text-sm font-semibold text-[var(--text-primary)]">{lane.label}</span>
        </div>
        <span className="kanban-count-badge">{tasks.length}</span>
      </div>

      {/* Cards */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onCardClick(task)} />
          ))}
          {tasks.length === 0 && !isAdding && (
            <div className="text-center py-6 text-[var(--text-muted)] text-xs">—</div>
          )}
        </div>
      </SortableContext>

      {/* Add card */}
      {isAdding ? (
        <div className="mt-2">
          <AddCardForm
            laneId={lane.id}
            onSubmit={onAddCard}
            onCancel={onCancelAdd}
          />
        </div>
      ) : (
        <button className="kanban-add-btn mt-2 w-full" onClick={onStartAdd}>
          + Add card
        </button>
      )}
    </div>
  );
}

// ─── Main Board ───────────────────────────────────────────────────────────────

export default function KanbanPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [addingIn, setAddingIn] = useState<KanbanStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/kanban');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Determine target lane — over could be a task id or a lane id
    let targetLane: KanbanStatus | null = null;

    const overTask = tasks.find(t => t.id === over.id);
    if (overTask) {
      targetLane = overTask.status;
    } else {
      // dropped on an empty lane area
      targetLane = over.id as KanbanStatus;
    }

    if (!targetLane || targetLane === activeTask.status) return;

    // Optimistic update
    setTasks(prev =>
      prev.map(t => t.id === activeTask.id ? { ...t, status: targetLane! } : t)
    );

    // Persist
    try {
      await fetch(`/api/kanban/${activeTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetLane }),
      });
    } catch {
      // revert on failure
      setTasks(prev =>
        prev.map(t => t.id === activeTask.id ? { ...t, status: activeTask.status } : t)
      );
    }
  };

  const addCard = async (laneId: KanbanStatus, title: string, body: string, assignee: string) => {
    try {
      const res = await fetch('/api/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, assignee }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks(prev => [...prev, { ...data.task, status: laneId }]);
      }
    } catch { /* silent */ }
    setAddingIn(null);
  };

  const updateTask = async (id: string, patch: Partial<KanbanTask>) => {
    try {
      const res = await fetch(`/api/kanban/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (data.task) {
        setTasks(prev => prev.map(t => t.id === id ? data.task : t));
      }
    } catch { /* silent */ }
  };

  const archiveTask = async (id: string) => {
    try {
      await fetch(`/api/kanban/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch { /* silent */ }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Page header */}
      <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold text-[var(--text-primary)]">Kanban</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{tasks.length} tasks</p>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm">
            Loading…
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 p-4 h-full" style={{ minWidth: 'max-content' }}>
              {LANES.map(lane => {
                const laneTasks = tasks.filter(t => t.status === lane.id);
                return (
                  <LaneColumn
                    key={lane.id}
                    lane={lane}
                    tasks={laneTasks}
                    onCardClick={setSelectedTask}
                    onAddCard={(title, body, assignee) => addCard(lane.id, title, body, assignee)}
                    isAdding={addingIn === lane.id}
                    onStartAdd={() => setAddingIn(lane.id)}
                    onCancelAdd={() => setAddingIn(null)}
                  />
                );
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="kanban-card kanban-card-overlay">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{activeTask.title}</p>
                  {activeTask.assignee && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">{activeTask.assignee}</p>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Drawer */}
      {selectedTask && (
        <CardDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onArchive={archiveTask}
        />
      )}
    </div>
  );
}