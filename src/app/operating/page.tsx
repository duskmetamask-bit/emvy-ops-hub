'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

export default function OperatingPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [apis, setApis] = useState<ApiIntegration[]>([]);
  const [loading, setLoading] = useState(true);

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
