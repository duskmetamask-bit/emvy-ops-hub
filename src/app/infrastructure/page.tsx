'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface InfrastructureItem {
  id: string;
  name: string;
  category: string;
  status: string;
  url?: string;
  cost?: string;
  notes?: string;
}

const INFRA: InfrastructureItem[] = [
  { id: 'i1', name: 'emvy.ai', category: 'domain', status: 'needed', cost: '~$50/yr', notes: 'Buy from Porkbun — DNS setup pending' },
  { id: 'i2', name: 'emvyai.vercel.app', category: 'website', status: 'live', url: 'https://emvyai.vercel.app' },
  { id: 'i3', name: 'emvy.ai → Vercel redirect', category: 'website', status: 'blocked', notes: 'Waiting on emvy.ai domain' },
  { id: 'i4', name: 'GA4', category: 'analytics', status: 'needed', notes: 'Need G-XXXXXXXXXX measurement ID' },
  { id: 'i5', name: 'Vercel Analytics', category: 'analytics', status: 'needed', notes: 'Free in Vercel dashboard' },
  { id: 'i6', name: 'Microsoft Clarity', category: 'analytics', status: 'needed' },
  { id: 'i7', name: 'Supabase (leads + data)', category: 'crm', status: 'live', url: 'https://supabase.com/dashboard' },
  { id: 'i8', name: 'Gmail SMTP', category: 'outreach', status: 'live', notes: 'dawnlabsai@gmail.com' },
  { id: 'i9', name: 'CAL.com', category: 'outreach', status: 'live', url: 'https://cal.com/jake-emvy/15-min-ai-chat' },
  { id: 'i10', name: 'VAPI (Callie voice)', category: 'outreach', status: 'live' },
  { id: 'i11', name: 'X API', category: 'outreach', status: 'live' },
];

const BLOCKERS = [
  { id: 'b1', item: 'emvy.ai domain purchase', type: 'domain', status: 'waiting_on_dusk', notes: 'Buy from Porkbun tonight' },
  { id: 'b2', item: 'Exa API key', type: 'api', status: 'waiting_on_external', notes: 'Fallback search — optional' },
  { id: 'b3', item: 'Hunter API key', type: 'api', status: 'waiting_on_external', notes: '$49/mo — optional' },
  { id: 'b4', item: 'Lead Finder → Supabase sync', type: 'integration', status: 'in_progress', notes: 'Cron writes to pipeline.json, not Supabase' },
  { id: 'b5', item: 'GA4 on site', type: 'analytics', status: 'waiting_on_dusk', notes: 'Need G-XXXXXXXXXX measurement ID' },
  { id: 'b6', item: 'Ops Hub → Supabase write', type: 'integration', status: 'in_progress', notes: 'Dashboard read-only. Need anon JWT key.' },
];

const CRONS = [
  { job: 'AI Opportunities Research', schedule: 'Midnight daily', last_run: '—', status: 'Active' },
  { job: 'Lead Finder', schedule: '9AM Mon–Thu', last_run: '2026-04-29 09:19', status: 'OK' },
  { job: 'Content Pipeline', schedule: '8AM Mon–Fri', last_run: '—', status: 'Active' },
  { job: 'Competitor Intelligence', schedule: '9AM daily', last_run: '2026-04-29 11:43', status: 'OK' },
  { job: 'Reply Detector', schedule: '9/11/1/3/5PM M–F', last_run: '2026-04-29 17:02', status: 'OK' },
  { job: 'Pipeline Health', schedule: '8AM Mondays', last_run: '—', status: 'Active' },
  { job: 'Session Snapshot', schedule: 'Every 30 min', last_run: '2026-04-29 21:00', status: 'OK' },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  live:     { color: '#10b981', bg: '#10b98120' },
  needed:   { color: '#f59e0b', bg: '#f59e0b20' },
  blocked:  { color: '#ef4444', bg: '#ef444420' },
  in_progress: { color: '#3b82f6', bg: '#3b82f620' },
};

const BLOCKER_STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  waiting_on_dusk:      { color: '#ef4444', bg: '#ef444420' },
  waiting_on_external:  { color: '#f59e0b', bg: '#f59e0b20' },
  in_progress:         { color: '#3b82f6', bg: '#3b82f620' },
};

export default function InfrastructurePage() {
  const [items, setItems] = useState(INFRA);
  const [blockers, setBlockers] = useState(BLOCKERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('infrastructure_items').select('*').order('name', { ascending: true });
        if (data && data.length > 0) setItems(data as InfrastructureItem[]);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const liveCount = items.filter(i => i.status === 'live').length;
  const neededCount = items.filter(i => i.status === 'needed').length;
  const blockerCount = blockers.length;

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Infrastructure</h1>
        <p className="page-subtitle">Deployed apps · Servers · Integrations</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#10b981' }}>{liveCount}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Live</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{neededCount}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Needed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{blockerCount}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Blockers</div>
        </div>
      </div>

      {/* Infrastructure */}
      <div className="card p-5">
        <div className="section-title">Infrastructure</div>
        {loading ? (
          <div className="space-y-2 mt-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {items.map(item => {
              const style = STATUS_STYLES[item.status] || STATUS_STYLES.needed;
              return (
                <div key={item.id} className="flex items-start justify-between p-3 rounded-lg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{item.name}</p>
                      <span className="badge shrink-0" style={{ background: style.bg, color: style.color }}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] capitalize">{item.category}</p>
                    {item.cost && <p className="text-[10px] text-[var(--text-muted)]">{item.cost}</p>}
                    {item.notes && <p className="text-xs text-[var(--text-muted)] mt-1">{item.notes}</p>}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs mt-1 inline-block" style={{ color: '#3b82f6' }}>
                        ↗ {item.url.replace('https://', '')}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Blockers */}
      <div className="card p-5">
        <div className="section-title">Blockers</div>
        <div className="space-y-2 mt-4">
          {blockers.map(b => {
            const style = BLOCKER_STATUS_STYLES[b.status] || BLOCKER_STATUS_STYLES.in_progress;
            return (
              <div key={b.id} className="flex items-start justify-between p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{b.item}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    <span className="badge mr-2" style={{ background: style.bg, color: style.color }}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <span className="capitalize">{b.type}</span>
                  </p>
                  {b.notes && <p className="text-xs text-[var(--text-muted)] mt-1">{b.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cron Jobs */}
      <div className="card p-5">
        <div className="section-title">Active Crons ({CRONS.length})</div>
        <div className="mt-4 overflow-hidden rounded-lg" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[var(--text-muted)]" style={{ background: 'var(--bg-secondary)' }}>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Job</th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Schedule</th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Last Run</th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {CRONS.map((cron, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5 text-[var(--text-primary)]">{cron.job}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{cron.schedule}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)] font-mono">{cron.last_run}</td>
                  <td className="px-4 py-2.5">
                    <span style={{ color: '#10b981' }}>{cron.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
