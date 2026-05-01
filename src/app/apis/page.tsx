'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  status: 'live' | 'configured' | 'needed' | 'blocked';
  key_preview?: string;
  purpose: string;
  environment: string;
}

const KNOWN_APIS: ApiKey[] = [
  { id: 's1', name: 'Supabase', service: 'supabase', status: 'live', key_preview: 'rrjktvvnzjz...', purpose: 'Database, auth, realtime', environment: 'anon key (browser)' },
  { id: 'n1', name: 'NVIDIA', service: 'nvidia', status: 'live', key_preview: 'nv-...', purpose: 'LLM inference, AI processing', environment: 'server-side' },
  { id: 'v1', name: 'VAPI', service: 'vapi', status: 'live', key_preview: '20b39d8e-...', purpose: 'AI voice agent (Callie)', environment: 'server-side' },
  { id: 'x1', name: 'X API', service: 'x', status: 'live', key_preview: '...', purpose: 'Social monitoring and posting', environment: 'server-side' },
  { id: 'c1', name: 'CAL.com', service: 'cal', status: 'live', key_preview: '...', purpose: 'Scheduling, booking', environment: 'server-side' },
  { id: 'g1', name: 'Gmail SMTP', service: 'gmail', status: 'live', key_preview: 'dawnlabsai@...', purpose: 'Outreach email delivery', environment: 'server-side' },
  { id: 'v2', name: 'Vercel', service: 'vercel', status: 'live', key_preview: '...', purpose: 'Hosting and deployment', environment: 'CI/CD' },
  { id: 'e1', name: 'Exa API', service: 'exa', status: 'needed', purpose: 'Web search fallback', environment: 'server-side' },
  { id: 'h1', name: 'Hunter API', service: 'hunter', status: 'needed', purpose: 'Email enrichment (optional)', environment: 'server-side' },
  { id: 'g2', name: 'GA4', service: 'ga4', status: 'needed', purpose: 'Analytics on emvyai.vercel.app', environment: 'client-side' },
  { id: 'cl1', name: 'Microsoft Clarity', service: 'clarity', status: 'needed', purpose: 'Session recording and heatmaps', environment: 'client-side' },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string; label: string }> = {
  live: { bg: '#10b98120', color: '#10b981', border: '#10b98130', label: 'Live' },
  configured: { bg: '#06b6d420', color: '#06b6d4', border: '#06b6d430', label: 'Configured' },
  needed: { bg: '#f59e0b20', color: '#f59e0b', border: '#f59e0b30', label: 'Needed' },
  blocked: { bg: '#ef444420', color: '#ef4444', border: '#ef444430', label: 'Blocked' },
};

export default function ApisPage() {
  const [apis, setApis] = useState<ApiKey[]>(KNOWN_APIS);
  const [dbApis, setDbApis] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('api_integrations').select('*').order('name', { ascending: true });
        if (data && data.length > 0) {
          setDbApis(data as ApiKey[]);
        }
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const liveCount = apis.filter(a => a.status === 'live').length;
  const neededCount = apis.filter(a => a.status === 'needed').length;
  const dbLiveCount = dbApis.filter(a => a.status === 'live').length;

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">APIs</h1>
        <p className="page-subtitle">Credentials · Integrations · Service Status</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#10b981' }}>{liveCount}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">APIs Live</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{neededCount}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">APIs Needed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#6366f1' }}>{dbLiveCount}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">From Supabase</div>
        </div>
      </div>

      {/* Known APIs */}
      <div className="card p-5">
        <div className="section-title">Known Integrations</div>
        {loading ? (
          <div className="space-y-2 mt-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {apis.map(a => {
              const style = STATUS_STYLES[a.status] || STATUS_STYLES.needed;
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: style.color }} />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{a.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {a.purpose} · <span className="font-mono">{a.environment}</span>
                        {a.key_preview && ` · ${a.key_preview}`}
                      </p>
                    </div>
                  </div>
                  <span className="badge shrink-0" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Supabase-tracked APIs */}
      {dbApis.length > 0 && (
        <div className="card p-5">
          <div className="section-title">Supabase API Integrations</div>
          <div className="space-y-2 mt-4">
            {dbApis.map(a => {
              const style = STATUS_STYLES[a.status] || STATUS_STYLES.needed;
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: style.color }} />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{a.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{a.purpose}</p>
                    </div>
                  </div>
                  <span className="badge shrink-0" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NVIDIA note */}
      <div className="card p-5">
        <div className="section-title">Environment Notes</div>
        <div className="mt-4 space-y-2">
          {[
            { env: 'Browser (anon key)', apis: 'Supabase (read-only via RLS)', note: 'rrjktvvnzjzlfquaghut project' },
            { env: 'Server-side only', apis: 'NVIDIA, VAPI, X API, CAL.com, Hunter, Exa', note: 'Never expose to browser' },
            { env: 'Client-side', apis: 'GA4, Microsoft Clarity', note: 'Add G-XXXXXXXXXX / Clarity ID to Vercel env vars' },
          ].map(item => (
            <div key={item.env} className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#6366f1' }} />
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">{item.env}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.apis}</p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
