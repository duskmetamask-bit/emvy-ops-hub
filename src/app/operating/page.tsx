'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ─── WEEKLY SCHEDULE DATA ─────────────────────────────────────────────────

const WEEKLY_SCHEDULE: Record<string, {
  label: string;
  emoji: string;
  color: string;
  rows: { time: string; agent: 'DUSK' | 'MEWY' | 'CRON'; task: string; note?: string }[];
}> = {
  monday: {
    label: 'Monday',
    emoji: 'Mon',
    color: '#6366f1',
    rows: [
      { time: '8:00 AM', agent: 'CRON', task: 'Pipeline Health report drops', note: 'MON ONLY' },
      { time: '8:00 AM', agent: 'CRON', task: 'Build Recommender fires', note: 'DAILY' },
      { time: '8:00 AM', agent: 'CRON', task: 'LinkedIn + X content drafts land in dashboard', note: 'DAILY' },
      { time: '8:00 AM', agent: 'MEWY', task: 'YouTube script delivered → Dusk reviews', note: 'MON + THU' },
      { time: '9:00 AM', agent: 'CRON', task: 'Lead Finder fires', note: 'MON–THU' },
      { time: '9:00 AM', agent: 'CRON', task: 'Competitor Intel fires', note: 'DAILY' },
      { time: '9 AM–5 PM', agent: 'DUSK', task: 'Check dashboard, review content drafts, reply to replies', note: 'AS NEEDED' },
    ],
  },
  tuesday: {
    label: 'Tuesday',
    emoji: 'Tue',
    color: '#3b82f6',
    rows: [
      { time: '8:00 AM', agent: 'CRON', task: 'LinkedIn + X content drafts land in dashboard', note: 'DAILY' },
      { time: '8:00 AM', agent: 'CRON', task: 'Build Recommender fires', note: 'DAILY' },
      { time: '9 AM–5 PM', agent: 'DUSK', task: 'Review content, approve or give feedback', note: 'AS NEEDED' },
      { time: '9/11/1/3/5 PM', agent: 'CRON', task: 'Reply Detector checks Gmail', note: 'M–F' },
    ],
  },
  wednesday: {
    label: 'Wednesday',
    emoji: 'Wed',
    color: '#a855f7',
    rows: [
      { time: '8:00 AM', agent: 'CRON', task: 'LinkedIn + X content drafts land in dashboard', note: 'DAILY' },
      { time: '8:00 AM', agent: 'CRON', task: 'Build Recommender fires', note: 'DAILY' },
      { time: '9 AM–5 PM', agent: 'DUSK', task: 'Check for new leads, warm leads, any replies', note: 'AS NEEDED' },
      { time: '9/11/1/3/5 PM', agent: 'CRON', task: 'Reply Detector checks Gmail', note: 'M–F' },
    ],
  },
  thursday: {
    label: 'Thursday',
    emoji: 'Thu',
    color: '#f59e0b',
    rows: [
      { time: '8:00 AM', agent: 'CRON', task: 'LinkedIn + X content drafts land in dashboard', note: 'DAILY' },
      { time: '8:00 AM', agent: 'CRON', task: 'Build Recommender fires', note: 'DAILY' },
      { time: '8:00 AM', agent: 'MEWY', task: 'YouTube script delivered → Dusk reviews', note: 'MON + THU' },
      { time: '9 AM–5 PM', agent: 'DUSK', task: 'Review content, approve or give feedback', note: 'AS NEEDED' },
      { time: '9/11/1/3/5 PM', agent: 'CRON', task: 'Reply Detector checks Gmail', note: 'M–F' },
    ],
  },
  friday: {
    label: 'Friday',
    emoji: 'Fri',
    color: '#10b981',
    rows: [
      { time: '8:00 AM', agent: 'CRON', task: 'LinkedIn + X content drafts land in dashboard', note: 'DAILY' },
      { time: '8:00 AM', agent: 'CRON', task: 'Build Recommender fires', note: 'DAILY' },
      { time: '8:00 AM', agent: 'CRON', task: 'Substack article draft lands in dashboard', note: 'WEEKLY' },
      { time: '9 AM–5 PM', agent: 'DUSK', task: 'End-of-week review: leads, replies, content', note: 'AS NEEDED' },
      { time: '9/11/1/3/5 PM', agent: 'CRON', task: 'Reply Detector checks Gmail', note: 'M–F' },
      { time: '6:00 PM', agent: 'CRON', task: 'Content Review fires — weekly performance digest', note: 'FRI ONLY' },
    ],
  },
  weekend: {
    label: 'Saturday–Sunday',
    emoji: 'Wkd',
    color: '#52525b',
    rows: [
      { time: 'No crons', agent: 'CRON', task: 'All crons pause Sat/Sun', note: '' },
      { time: 'Anytime', agent: 'DUSK', task: 'Review anything pending, plan ahead', note: 'OPTIONAL' },
    ],
  },
};

const AGENT_META = {
  DUSK: { label: 'Dusk', bg: 'rgba(236,72,153,0.12)', color: '#ec4899', border: 'rgba(236,72,153,0.25)', dot: '#ec4899' },
  MEWY: { label: 'MEWY', bg: 'rgba(168,85,247,0.12)', color: '#a855f7', border: 'rgba(168,85,247,0.25)', dot: '#a855f7' },
  CRON: { label: 'Cron', bg: 'rgba(99,102,241,0.10)', color: '#6366f1', border: 'rgba(99,102,241,0.20)', dot: '#6366f1' },
};

// ─── INTERFACES ───────────────────────────────────────────────────────────

interface Process {
  id: string;
  name: string;
  description: string;
  status: string;
  owner: string;
}

interface System {
  id: string;
  name: string;
  type: string;
  status: string;
  purpose: string;
}

interface ApiIntegration {
  id: string;
  name: string;
  status: string;
  purpose: string;
}

const CORE_SYSTEMS = [
  { name: 'Supabase', type: 'Database', status: 'Live', purpose: 'CRM, leads, audit reports, business data' },
  { name: 'Vercel', type: 'Hosting', status: 'Live', purpose: 'emvyai.vercel.app deployment' },
  { name: 'Gmail SMTP', type: 'Email', status: 'Live', purpose: 'dawnlabsai@gmail.com outreach' },
  { name: 'CAL.com', type: 'Scheduling', status: 'Live', purpose: 'jake-emvy/15-min-ai-chat booking' },
  { name: 'VAPI', type: 'Voice AI', status: 'Live', purpose: 'AI phone agent (Callie)' },
  { name: 'NVIDIA API', type: 'AI/ML', status: 'Live', purpose: 'LLM inference, AI processing' },
  { name: 'X API', type: 'Social', status: 'Live', purpose: 'Social monitoring and posting' },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function OperatingPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [apis, setApis] = useState<ApiIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>('monday');

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s, a] = await Promise.all([
          supabase.from('processes').select('*').order('name', { ascending: true }),
          supabase.from('systems').select('*').order('name', { ascending: true }),
          supabase.from('api_integrations').select('*').order('name', { ascending: true }),
        ]);
        setProcesses(p.data || []);
        setSystems(s.data || []);
        setApis(a.data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const activeDayData = WEEKLY_SCHEDULE[activeDay];

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Operating</h1>
        <p className="page-subtitle">Processes · Systems · API Integrations</p>
      </div>

      {/* Core Systems */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title" style={{ marginBottom: 0 }}>Core Systems</div>
          <span className="badge" style={{ background: '#a855f720', color: '#a855f7', border: '1px solid #a855f730' }}>
            {CORE_SYSTEMS.filter(s => s.status === 'Live').length} live
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CORE_SYSTEMS.map(sys => (
            <div key={sys.name} className="flex items-start justify-between p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{sys.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{sys.type} · {sys.purpose}</p>
              </div>
              <span className="badge shrink-0" style={{
                background: sys.status === 'Live' ? '#10b98120' : '#52525b20',
                color: sys.status === 'Live' ? '#10b981' : '#52525b',
                border: sys.status === 'Live' ? '#10b98130' : '#27272a',
              }}>
                {sys.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="section-title" style={{ marginBottom: 0 }}>Weekly Schedule</div>
          <div className="flex items-center gap-3 text-[10px]">
            {Object.entries(AGENT_META).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
                <span style={{ color: meta.color }}>{meta.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.entries(WEEKLY_SCHEDULE).map(([key, day]) => {
            const isActive = key === activeDay;
            return (
              <button
                key={key}
                onClick={() => setActiveDay(key)}
                className="flex-1 min-w-[100px] py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer"
                style={{
                  background: isActive ? `${day.color}18` : 'var(--bg-secondary)',
                  color: isActive ? day.color : 'var(--text-muted)',
                  border: `1px solid ${isActive ? day.color + '40' : 'var(--border)'}`,
                }}>
                {day.label}
              </button>
            );
          })}
        </div>

        {/* Schedule rows */}
        <div className="space-y-1.5">
          {activeDayData.rows.map((row, i) => {
            const meta = AGENT_META[row.agent];
            const isDusk = row.agent === 'DUSK';
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg transition-all"
                style={{
                  background: isDusk ? meta.bg : 'var(--bg-secondary)',
                  border: `1px solid ${isDusk ? meta.border : 'var(--border)'}`,
                }}>
                <div className="w-24 shrink-0 pt-0.5">
                  <div className="text-[11px] font-medium text-[var(--text-muted)] whitespace-nowrap">{row.time}</div>
                </div>
                <div className="w-16 shrink-0 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.dot }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>{row.agent}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${isDusk ? 'font-semibold' : 'font-normal'} text-[var(--text-primary)]`}>{row.task}</div>
                </div>
                {row.note && (
                  <div className="shrink-0 pt-0.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${activeDayData.color}18`,
                        color: activeDayData.color,
                        border: `1px solid ${activeDayData.color}30`,
                      }}>
                      {row.note}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dusk time summary */}
        <div className="mt-4 p-4 rounded-xl flex items-center justify-between"
          style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.15)' }}>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#ec4899' }}>Dusk's time commitment</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">~1.5 hrs/week — filming, approvals, X engagement</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: '#ec4899' }}>1.5h</div>
            <div className="text-[10px] text-[var(--text-muted)]">/ week</div>
          </div>
        </div>
      </div>

      {/* Processes */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title" style={{ marginBottom: 0 }}>Processes</div>
          <span className="badge" style={{ background: '#a855f720', color: '#a855f7', border: '1px solid #a855f730' }}>
            {processes.length} tracked
          </span>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
          </div>
        ) : processes.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-sm">
            No processes yet — add to processes table in Supabase
          </div>
        ) : (
          <div className="space-y-2">
            {processes.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{p.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{p.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {p.owner && <span className="text-xs text-[var(--text-muted)]">{p.owner}</span>}
                  <span className="badge" style={{ background: '#a855f720', color: '#a855f7', border: '1px solid #a855f730' }}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Integrations */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title" style={{ marginBottom: 0 }}>API Integrations</div>
          <a href="/apis" className="text-xs text-[var(--accent-blue)] hover:underline">View all APIs →</a>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
          </div>
        ) : apis.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-sm">
            No API integrations tracked — see /apis for full list
          </div>
        ) : (
          <div className="space-y-2">
            {apis.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{a.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{a.purpose}</p>
                </div>
                <span className="badge" style={{
                  background: a.status === 'live' ? '#10b98120' : '#52525b20',
                  color: a.status === 'live' ? '#10b981' : '#52525b',
                  border: a.status === 'live' ? '#10b98130' : '#27272a',
                }}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
