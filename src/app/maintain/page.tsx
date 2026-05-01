'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const COVERED = [
  'Agent monitoring and health checks',
  'Prompt tweaks and refinement',
  'New minor automations (within scope)',
  'Bug fixes and error resolution',
  'Uptime monitoring and alerting',
  'Monthly performance review',
];

const NOT_COVERED = [
  'New feature development',
  'Infrastructure hosting costs',
  'Third-party API costs',
  'Out-of-scope integrations',
  'Data migration projects',
  'Mobile app development',
];

const RESPONSE_TIMES = [
  { level: 'Critical', time: '< 2 hours', color: '#ef4444' },
  { level: 'High', time: '< 4 hours', color: '#f59e0b' },
  { level: 'Normal', time: '< 1 business day', color: '#10b981' },
  { level: 'Low', time: '< 3 business days', color: '#6366f1' },
];

interface RetainerClient {
  id: string;
  client: string;
  status: string;
  monthly_retainer: number;
  started_at: string;
}

export default function MaintainPage() {
  const [clients, setClients] = useState<RetainerClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('leads').select('*').eq('stage', 'DONE').order('created_at', { ascending: false });
        setClients(data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Maintain</h1>
        <p className="page-subtitle">$1,500/month · Retainer · Ongoing AI support</p>
      </div>

      {/* Pricing */}
      <div className="card p-5">
        <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
          {[
            { label: 'Monthly Retainer', value: '$1,500', accent: '#06b6d4' },
            { label: 'Included Hours', value: '10–15 hrs', accent: '#06b6d4' },
            { label: 'Billing', value: 'Monthly advance', accent: '#6366f1' },
            { label: 'Contract', value: 'Monthly rolling', accent: '#a855f7' },
          ].map(item => (
            <div key={item.label} className="px-6 first:pl-0 text-center">
              <div className="text-sm font-bold" style={{ color: item.accent }}>{item.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Times */}
      <div className="card p-5">
        <div className="section-title">Response Times</div>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {RESPONSE_TIMES.map(r => (
            <div key={r.level} className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">{r.level}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{r.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's Covered */}
      <div className="card p-5">
        <div className="section-title">What is Covered</div>
        <div className="mt-4 space-y-2">
          {COVERED.map(item => (
            <div key={item} className="flex items-center gap-3 p-2.5 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#10b981' }} />
              <span className="text-sm text-[var(--text-secondary)]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What's Not Covered */}
      <div className="card p-5">
        <div className="section-title">Not Covered</div>
        <div className="mt-4 space-y-2">
          {NOT_COVERED.map(item => (
            <div key={item} className="flex items-center gap-3 p-2.5 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#ef4444' }} />
              <span className="text-sm text-[var(--text-muted)]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Retainers */}
      <div className="card p-5">
        <div className="section-title">Active Retainers</div>
        {loading ? (
          <div className="space-y-2 mt-4">
            {[1, 2].map(i => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
          </div>
        ) : clients.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-sm">
            No active retainers yet — build clients transition here after go-live
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {clients.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{c.client}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    ${c.monthly_retainer || 1500}/month · Since {new Date(c.started_at).toLocaleDateString('en-AU')}
                  </p>
                </div>
                <span className="badge" style={{ background: '#06b6d420', color: '#06b6d4', border: '1px solid #06b6d430' }}>
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
