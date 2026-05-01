'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ActionItem {
  id: string;
  action: string;
  reason: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  source: string;
  due_date?: string;
  status: string;
}

interface Blocker {
  id: string;
  item: string;
  type: string;
  status: 'waiting_on_dusk' | 'waiting_on_external' | 'in_progress' | 'resolved';
  notes: string;
}

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Load live pipeline stats from leads table
        const { data: leads } = await supabase.from('leads').select('stage, temp');
        const all = leads || [];
        const stageCount: Record<string, number> = {};
        let hot = 0, warm = 0;
        all.forEach((l: any) => {
          stageCount[l.stage] = (stageCount[l.stage] || 0) + 1;
          if (l.temp === 'HOT') hot++;
          if (l.temp === 'WARM') warm++;
        });
        setStats({ total: all.length, hot, warm, stages: stageCount });

        // Hardcoded actions list (these are strategic, not data-driven)
        setActions([
          {
            id: 'a1', priority: 'urgent',
            action: 'Buy emvy.ai domain from Porkbun',
            reason: 'Blocking: email deliverability, Search Console, Carrd landing page, brand coherence',
            source: 'SOUL.md', status: 'waiting_on_dusk',
          },
          {
            id: 'a2', priority: 'urgent',
            action: 'Set up GA4 on emvyai.vercel.app',
            reason: 'Need G-XXXXXXXXXX measurement ID from Google Analytics',
            source: 'SEO playbook', status: 'waiting_on_dusk',
          },
          {
            id: 'a3', priority: 'high',
            action: 'Send outreach to 5 warm leads from discovery register',
            reason: 'Personalised cold email — highest-leverage client acquisition step right now',
            source: 'This session', status: 'pending',
          },
          {
            id: 'a4', priority: 'high',
            action: 'Draft cold email sequence (3 emails)',
            reason: 'Need a repeatable, tuneable outreach template before scaling outbound',
            source: 'This session', status: 'pending',
          },
          {
            id: 'a5', priority: 'high',
            action: 'Film first YouTube video (Week 1: 3 AI agents in 30 days)',
            reason: 'YouTube is the authority seed for the LinkedIn flywheel — without it, the flywheel has no engine',
            source: 'Social strategy', status: 'pending',
          },
          {
            id: 'a6', priority: 'medium',
            action: 'Update LinkedIn profile (@duskwun) for AI consultancy positioning',
            reason: 'Current profile is generic — needs clear ICP-facing bio before content starts',
            source: 'Social strategy', status: 'pending',
          },
          {
            id: 'a7', priority: 'medium',
            action: 'Update X profile (@duskwun) — bio, pinned post, banner',
            reason: 'X is the peer network — needs clean professional setup before first post',
            source: 'Social strategy', status: 'pending',
          },
          {
            id: 'a8', priority: 'low',
            action: 'Practice running an end-to-end mock audit',
            reason: 'Understand exactly what the audit deliverable looks like before doing it for a real client',
            source: 'This session', status: 'pending',
          },
          {
            id: 'a9', priority: 'low',
            action: 'Build one real AI workflow automation',
            reason: 'Understand the build deliverable first-hand — required to sell it confidently',
            source: 'This session', status: 'pending',
          },
        ]);

        setBlockers([
          { id: 'b1', item: 'emvy.ai domain', type: 'domain', status: 'waiting_on_dusk', notes: 'Buy from Porkbun tonight' },
          { id: 'b2', item: 'GA4 measurement ID', type: 'analytics', status: 'waiting_on_dusk', notes: 'Create GA4 property, get G-XXXXXXXXXX ID' },
          { id: 'b3', item: 'Supabase anon key (dashboard writes)', type: 'api', status: 'waiting_on_dusk', notes: 'Dashboard needs write access for lead updates' },
          { id: 'b4', item: 'Casino lead ($75M project)', type: 'lead', status: 'in_progress', notes: '3 AI agents in 30 days — highest-value warm lead in pipeline' },
        ]);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const PRIORITY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
    urgent: { label: 'Urgent', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    high:   { label: 'High',   color: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    medium: { label: 'Medium', color: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    low:    { label: 'Low',    color: '#52525b', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
  };

  const blockerMeta: Record<string, { color: string; label: string }> = {
    waiting_on_dusk:   { color: '#ef4444', label: 'Waiting You' },
    waiting_on_external: { color: '#52525b', label: 'External' },
    in_progress:       { color: '#3b82f6', label: 'In Progress' },
    resolved:          { color: '#22c55e', label: 'Resolved' },
  };

  const urgent = actions.filter(a => a.priority === 'urgent');
  const high   = actions.filter(a => a.priority === 'high');
  const medium = actions.filter(a => a.priority === 'medium');
  const low    = actions.filter(a => a.priority === 'low');

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Actions</h1>
        <p className="page-subtitle">Priority tasks and blockers</p>
      </div>

      {/* Pipeline stats bar */}
      <div className="card p-4">
        <div className="section-title mb-3">Pipeline Snapshot</div>
        <div className="grid grid-cols-6 gap-2 text-center">
          {[
            { label: 'HOT',         value: stats.hot,      color: '#ef4444' },
            { label: 'WARM',       value: stats.warm,     color: '#f97316' },
            { label: 'DISCOVERED', value: stats.stages?.DISCOVERED, color: '#6366f1' },
            { label: 'SENT',       value: stats.stages?.SENT,       color: '#3b82f6' },
            { label: 'REPLY',      value: stats.stages?.REPLY,      color: '#06b6d4' },
            { label: 'TOTAL',      value: stats.total,     color: '#a1a1aa' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <div className="text-xl font-bold" style={{ color: s.color }}>
                {loading ? '—' : (s.value || 0)}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer + CTA bar */}
      <div className="card p-4">
        <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
          {[
            { tier: 'Lead',   desc: 'Free discovery call',  color: '#6366f1' },
            { tier: 'Audit',  desc: '$1,500 — 2 to 3 days', color: '#f59e0b' },
            { tier: 'Build',  desc: '$3k – $5k',            color: '#10b981' },
            { tier: 'Retain', desc: '$1,500 / month',        color: '#06b6d4' },
          ].map(o => (
            <div key={o.tier} className="px-5 first:pl-0 text-center">
              <div className="text-sm font-bold" style={{ color: o.color }}>{o.tier}</div>
              <div className="text-xs text-[var(--text-muted)]">{o.desc}</div>
            </div>
          ))}
        </div>
        <div className="divider my-4" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Start the flywheel</span>
          <a href="https://cal.com/jake-emvy/15-min-ai-chat" target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold text-[var(--accent-blue)] hover:text-blue-400 transition-colors">
            Book discovery call ↗
          </a>
        </div>
      </div>

      {/* Blockers */}
      {blockers.filter(b => b.status !== 'resolved').length > 0 && (
        <div className="card p-5">
          <div className="section-title">Blockers</div>
          <div className="space-y-2 mt-3">
            {blockers.filter(b => b.status !== 'resolved').map(b => {
              const meta = blockerMeta[b.status] || blockerMeta.waiting_on_dusk;
              return (
                <div key={b.id} className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: meta.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{b.item}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{b.notes}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0"
                    style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action sections */}
      {[
        { label: 'Urgent', items: urgent, meta: PRIORITY_META.urgent },
        { label: 'High',   items: high,   meta: PRIORITY_META.high },
        { label: 'Medium', items: medium, meta: PRIORITY_META.medium },
        { label: 'Low',    items: low,    meta: PRIORITY_META.low },
      ].map(({ label, items, meta }) => items.length > 0 && (
        <div key={label}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: meta.color }}>
              {label}
            </span>
            <span className="text-xs text-[var(--text-muted)]">— {items.length} items</span>
          </div>
          <div className="space-y-2">
            {items.map(a => (
              <div key={a.id} className="p-4 rounded-xl"
                style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{a.action}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{a.reason}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-[var(--text-muted)]">Source: {a.source}</span>
                      {a.status === 'waiting_on_dusk' && (
                        <span className="text-[10px] font-semibold text-red-400">Needs you</span>
                      )}
                      {a.status === 'pending' && (
                        <span className="text-[10px] font-semibold text-yellow-400">To do</span>
                      )}
                      {a.due_date && (
                        <span className="text-[10px] text-[var(--text-muted)]">{a.due_date}</span>
                      )}
                    </div>
                  </div>
                  <span className="badge shrink-0"
                    style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                    {a.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}
