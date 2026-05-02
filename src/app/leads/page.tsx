'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  company: string;
  industry: string;
  location: string;
  email: string;
  phone: string;
  stage: string;
  score: number;
  temp: string;
  pain_evidence: string;
  discovery_date: string;
  notes: string;
  created_at: string;
}

const COLUMNS = [
  { id: 'DISCOVERED', label: 'Discovered', color: '#6366f1', bg: 'bg-indigo-500/10' },
  { id: 'ENRICHED',   label: 'Enriched',   color: '#a855f7', bg: 'bg-purple-500/10' },
  { id: 'SENT',       label: 'Sent',       color: '#3b82f6', bg: 'bg-blue-500/10' },
  { id: 'REPLY',      label: 'Reply',      color: '#06b6d4', bg: 'bg-cyan-500/10' },
  { id: 'CALL',       label: 'Call',       color: '#ec4899', bg: 'bg-pink-500/10' },
  { id: 'AUDIT',      label: 'Audit',      color: '#f59e0b', bg: 'bg-amber-500/10' },
  { id: 'BUILD',      label: 'Build',      color: '#10b981', bg: 'bg-emerald-500/10' },
  { id: 'DONE',       label: 'Done',       color: '#22c55e', bg: 'bg-green-500/10' },
];

const TEMP_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
  HOT:        { dot: '#ef4444', badge: 'bg-red-500/20 text-red-400 border border-red-500/30',   label: 'Hot' },
  WARM:       { dot: '#f97316', badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/30', label: 'Warm' },
  DISCOVERED: { dot: '#6366f1', badge: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30', label: 'New' },
};

function SkeletonCard() {
  return (
    <div className="card p-3.5 space-y-2">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-2/3 mt-2" />
    </div>
  );
}

function LeadModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const temp = TEMP_STYLE[lead.temp] || TEMP_STYLE.DISCOVERED;
  const stage = COLUMNS.find(c => c.id === lead.stage) || COLUMNS[0];

  const fields = [
    lead.email       && { label: 'Email',       value: lead.email,       mono: true },
    lead.phone       && { label: 'Phone',       value: lead.phone,       mono: true },
    lead.location    && { label: 'Location',    value: lead.location,   mono: false },
    lead.industry    && { label: 'Industry',    value: lead.industry,   mono: false },
    lead.score > 0  && { label: 'Score',       value: `${lead.score}/10`, mono: true },
    lead.discovery_date && { label: 'Discovered', value: lead.discovery_date, mono: false },
  ].filter(Boolean) as { label: string; value: string; mono: boolean }[];

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-[var(--border)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{lead.name}</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">{lead.company}</p>
            </div>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white text-2xl leading-none transition-colors shrink-0">×</button>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`badge ${temp.badge}`}>{temp.label}</span>
            <span className="badge bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
              style={{ borderColor: `${stage.color}30`, color: stage.color }}>
              {stage.label}
            </span>
          </div>
        </div>

        {/* Pain evidence */}
        {lead.pain_evidence && (
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Pain Signal</div>
            <p className="text-sm text-orange-400 leading-relaxed">{lead.pain_evidence}</p>
          </div>
        )}

        {/* Fields */}
        <div className="px-6 py-4 space-y-3">
          {fields.map(f => (
            <div key={f.label}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-0.5">{f.label}</div>
              <p className={`text-sm ${f.mono ? 'font-mono text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{f.value}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="px-6 pb-5">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Notes</div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{lead.notes}</p>
          </div>
        )}

        {/* Footer CTA */}
        {lead.email && (
          <div className="px-6 pb-6">
            <a href={`mailto:${lead.email}`}
              className="block w-full py-2.5 rounded-lg text-center text-sm font-semibold transition-colors"
              style={{ background: 'var(--accent-blue)', color: '#fff' }}>
              Send Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HOT' | 'WARM' | 'MISSING_EMAIL'>('ALL');
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        setLeads(data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const hotCount       = leads.filter(l => l.temp === 'HOT').length;
  const warmCount      = leads.filter(l => l.temp === 'WARM').length;
  const missingEmailCount = leads.filter(l => !l.email || l.email.trim() === '').length;

  const getColLeads = (stage: string) => {
    let list = leads.filter(l => l.stage === stage);
    if (activeFilter === 'HOT')           list = list.filter(l => l.temp === 'HOT');
    if (activeFilter === 'WARM')          list = list.filter(l => l.temp === 'WARM');
    if (activeFilter === 'MISSING_EMAIL') list = list.filter(l => !l.email || l.email.trim() === '');
    return list;
  };

  const skipLeads = leads.filter(l => l.stage === 'SKIP');

  return (
    <div className="flex flex-col h-full -m-6">

      {/* Page header */}
      <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold text-[var(--text-primary)]">Leads Pipeline</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {leads.length} total
            {hotCount > 0  && <span className="text-red-400">  ·  {hotCount} hot</span>}
            {warmCount > 0 && <span className="text-orange-400">  ·  {warmCount} warm</span>}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {([['ALL', 'All'], ['HOT', `Hot ${hotCount}`], ['WARM', `Warm ${warmCount}`], ['MISSING_EMAIL', `Missing Email ${missingEmailCount}`]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setActiveFilter(val)}
              className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
              style={{
                background:   activeFilter === val ? (val === 'HOT' ? '#7f1d1d' : val === 'WARM' ? '#7c2d12' : val === 'MISSING_EMAIL' ? '#78350f' : '#1e3a5f') : 'transparent',
                borderColor:  activeFilter === val ? (val === 'HOT' ? '#b91c1c' : val === 'WARM' ? '#c2410c' : val === 'MISSING_EMAIL' ? '#92400e' : '#1d4ed8') : 'var(--border)',
                color:        activeFilter === val ? (val === 'HOT' ? '#fca5a5' : val === 'WARM' ? '#fdba74' : val === 'MISSING_EMAIL' ? '#fde68a' : '#93c5fd') : 'var(--text-muted)',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 p-4 h-full" style={{ minWidth: 'max-content' }}>

          {COLUMNS.map(col => {
            const colLeads = getColLeads(col.id);
            return (
              <div key={col.id} className="kanban-col flex flex-col">
                <div className="kanban-col-header"
                  style={{ borderTopColor: col.color, background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</span>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)]"
                      style={{ background: 'var(--bg-primary)', padding: '1px 6px', borderRadius: '4px' }}>
                      {colLeads.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
                  ) : colLeads.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-muted)] text-xs">—</div>
                  ) : (
                    colLeads.map(lead => {
                      const temp = TEMP_STYLE[lead.temp] || TEMP_STYLE.DISCOVERED;
                      return (
                        <button key={lead.id} onClick={() => setSelected(lead)}
                          className="lead-card group text-left w-full">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{lead.name}</p>
                            {(() => {
                              const days = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / 86400000);
                              if (days <= 0) return null;
                              const badgeColor = days > 7 ? '#ef4444' : days > 3 ? '#f59e0b' : '#22c55e';
                              return (
                                <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded shrink-0 mt-0.5"
                                  style={{ background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                                  {days}d
                                </span>
                              );
                            })()}
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">{lead.company}</p>
                          {lead.industry && (
                            <p className="text-xs text-[var(--text-muted)] opacity-60">{lead.industry}</p>
                          )}
                          {lead.pain_evidence && (
                            <p className="text-xs text-orange-400/80 mt-2 leading-snug line-clamp-2">{lead.pain_evidence}</p>
                          )}
                          {lead.score > 0 && (
                            <div className="mt-2 flex items-center gap-1.5">
                              <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                                <div className="h-full rounded-full" style={{ width: `${lead.score * 10}%`, background: col.color }} />
                              </div>
                              <span className="text-[10px] font-mono text-[var(--text-muted)]">{lead.score}</span>
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}

          {/* Skipped column */}
          {skipLeads.length > 0 && (
            <div className="kanban-col flex flex-col">
              <div className="kanban-col-header" style={{ borderTopColor: '#52525b', background: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">Skipped</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]"
                    style={{ background: 'var(--bg-primary)', padding: '1px 6px', borderRadius: '4px' }}>
                    {skipLeads.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {skipLeads.map(lead => (
                  <div key={lead.id} className="card p-3.5 opacity-60">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{lead.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{lead.company}</p>
                    {lead.notes && <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{lead.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead modal */}
      {selected && <LeadModal lead={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
