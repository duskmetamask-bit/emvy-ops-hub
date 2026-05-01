'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const STAGE_META: Record<string, { color: string; bg: string; label: string }> = {
  DISCOVERED: { color: '#6366f1', bg: 'bg-indigo-500/20', label: 'Discovered' },
  ENRICHED:   { color: '#a855f7', bg: 'bg-purple-500/20', label: 'Enriched' },
  SENT:       { color: '#3b82f6', bg: 'bg-blue-500/20', label: 'Email Sent' },
  REPLY:      { color: '#06b6d4', bg: 'bg-cyan-500/20', label: 'Reply' },
  CALL:       { color: '#ec4899', bg: 'bg-pink-500/20', label: 'Call' },
  AUDIT:      { color: '#f59e0b', bg: 'bg-amber-500/20', label: 'Audit' },
  BUILD:      { color: '#10b981', bg: 'bg-emerald-500/20', label: 'Build' },
  DONE:       { color: '#22c55e', bg: 'bg-green-500/20', label: 'Client' },
  SKIP:       { color: '#52525b', bg: 'bg-gray-500/20', label: 'Skipped' },
};

const OFFER = [
  { tier: 'Lead',   desc: 'Free discovery call',  color: '#6366f1' },
  { tier: 'Audit',  desc: '$1,500 — 2 to 3 days', color: '#f59e0b' },
  { tier: 'Build',  desc: '$3k – $5k',            color: '#10b981' },
  { tier: 'Retain',desc: '$1,500 / month',        color: '#06b6d4' },
];

export default function HomePage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const fmt = new Date().toLocaleDateString('en-AU', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      timeZone: 'Australia/Perth',
    });
    setDateStr(fmt);

    const load = async () => {
      try {
        const { data } = await supabase.from('leads').select('*');
        const leads = data || [];
        const counts: Record<string, number> = {};
        let hot = 0, warm = 0, sent = 0, discovered = 0, total = leads.length;

        leads.forEach((l: any) => {
          counts[l.stage] = (counts[l.stage] || 0) + 1;
          if (l.temp === 'HOT') hot++;
          if (l.temp === 'WARM') warm++;
          if (l.stage === 'SENT') sent++;
          if (l.stage === 'DISCOVERED') discovered++;
        });

        setStageCounts(counts);
        setStats({ total, hot, warm, sent, discovered });

        const sorted = [...leads]
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6);
        setRecent(sorted);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Leads',   value: stats.total || 0,        color: '#6366f1' },
    { label: 'HOT',           value: stats.hot || 0,           color: '#ef4444' },
    { label: 'WARM',         value: stats.warm || 0,          color: '#f97316' },
    { label: 'Email Sent',   value: stats.sent || 0,          color: '#3b82f6' },
    { label: 'Discovered',   value: stats.discovered || 0,    color: '#06b6d4' },
  ];

  const pipelineStages = ['DISCOVERED','ENRICHED','SENT','REPLY','CALL','AUDIT','BUILD','DONE'];
  const maxCount = Math.max(...pipelineStages.map(s => stageCounts[s] || 0), 1);

  return (
    <div className="space-y-7">

      {/* Page header */}
      <div className="fade-in">
        <h1 className="page-title">Operations Dashboard</h1>
        <p className="page-subtitle">EMVY AI Audit Consultancy · {dateStr}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 fade-in">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-10 w-14 mb-3" />
              <div className="skeleton h-3 w-20" />
            </div>
          ))
        ) : (
          statCards.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label mt-2">{s.label}</div>
            </div>
          ))
        )}
      </div>

      {/* Offer stack */}
      <div className="card p-5 fade-in">
        <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
          {OFFER.map(o => (
            <div key={o.tier} className="px-6 first:pl-0 text-center">
              <div className="text-sm font-bold" style={{ color: o.color }}>{o.tier}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{o.desc}</div>
            </div>
          ))}
        </div>
        <div className="divider my-4" />
        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--text-muted)]">Ready to scale with AI?</div>
          <a href="https://cal.com/jake-emvy/15-min-ai-chat" target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold text-[var(--accent-blue)] hover:text-blue-400 transition-colors">
            Book a call ↗
          </a>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-5 fade-in">

        {/* Pipeline funnel */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="section-title mb-0">Pipeline</div>
            <a href="/leads" className="text-xs text-[var(--accent-blue)] hover:text-blue-400 transition-colors">View all →</a>
          </div>
          <div className="space-y-3">
            {pipelineStages.map(stage => {
              const meta = STAGE_META[stage];
              const count = stageCounts[stage] || 0;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
                  <div className="text-xs text-[var(--text-secondary)] w-20 shrink-0">{meta.label}</div>
                  <div className="flex-1 pipeline-bar">
                    <div className="pipeline-bar-fill" style={{ width: `${pct}%`, background: meta.color }} />
                  </div>
                  <div className="text-xs font-mono text-[var(--text-muted)] w-4 text-right shrink-0">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent leads */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="section-title mb-0">Recent Leads</div>
            <a href="/leads" className="text-xs text-[var(--accent-blue)] hover:text-blue-400 transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3 flex gap-3">
                  <div className="skeleton h-4 flex-1" />
                  <div className="skeleton h-4 w-16" />
                </div>
              ))
            ) : recent.length === 0 ? (
              <div className="py-8 text-center text-[var(--text-muted)] text-sm">No leads yet</div>
            ) : (
              recent.map((lead: any) => {
                const meta = STAGE_META[lead.stage] || STAGE_META.DISCOVERED;
                const tempColor = lead.temp === 'HOT' ? '#ef4444' : lead.temp === 'WARM' ? '#f97316' : null;
                return (
                  <div key={lead.id} className="py-3 flex items-center gap-3 hover:bg-white/5 transition-colors rounded">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {tempColor && <div className="temp-dot" style={{ background: tempColor }} />}
                        <span className="text-sm font-medium text-[var(--text-primary)] truncate">{lead.name}</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] truncate mt-0.5">{lead.company} · {lead.industry}</div>
                    </div>
                    <span className={`stage-pill shrink-0 ${meta.bg}`} style={{ color: meta.color, border: `1px solid ${meta.color}30` }}>
                      {meta.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 fade-in">
        {[
          { href: '/leads',     label: 'Leads',     desc: 'Pipeline management',  color: '#6366f1', icon: '→' },
          { href: '/discovery', label: 'Discovery',  desc: 'Warm leads & outreach', color: '#f97316', icon: '→' },
          { href: '/audit',     label: 'Audit',      desc: 'Process & deliverables', color: '#f59e0b', icon: '→' },
          { href: '/actions',   label: 'Actions',    desc: 'Priority task list',    color: '#10b981', icon: '→' },
        ].map(item => (
          <a key={item.href} href={item.href} className="quick-link">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: item.color }}>{item.label}</span>
              <span className="text-xs" style={{ color: item.color }}>{item.icon}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)]">{item.desc}</div>
          </a>
        ))}
      </div>

    </div>
  );
}
