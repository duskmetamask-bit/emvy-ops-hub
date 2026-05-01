'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface WarmLead {
  id: string;
  name: string;
  business_name: string;
  contact_email: string;
  contact_phone: string;
  source: string;
  status: string;
  industry: string;
  notes: string;
  potential_revenue?: string;
  created_at: string;
}

const STATUS_META: Record<string, { color: string; bg: string }> = {
  'Not Contacted': { color: '#52525b', bg: 'bg-gray-500/20' },
  'Contacted':     { color: '#3b82f6', bg: 'bg-blue-500/20' },
  'Responded':     { color: '#22c55e', bg: 'bg-green-500/20' },
  'Callback':      { color: '#f59e0b', bg: 'bg-amber-500/20' },
  'Qualified':     { color: '#a855f7', bg: 'bg-purple-500/20' },
  'Unqualified':   { color: '#ef4444', bg: 'bg-red-500/20' },
};

export default function DiscoveryPage() {
  const [leads, setLeads] = useState<WarmLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('warm_leads').select('*').order('created_at', { ascending: false });
        setLeads(data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const byStatus = (status: string) => leads.filter(l => l.status === status).length;

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Discovery</h1>
        <p className="page-subtitle">Warm Leads Register · Outreach Tracking</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {Object.entries(STATUS_META).map(([status, meta]) => {
          const count = byStatus(status);
          if (count === 0 && status !== 'Not Contacted') return null;
          return (
            <div key={status} className="card p-3 text-center">
              <div className="text-xl font-bold" style={{ color: meta.color }}>{count}</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 uppercase tracking-wider">{status}</div>
            </div>
          );
        })}
      </div>

      {/* Warm leads register */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-title mb-0">Warm Leads Register</div>
          </div>
          <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="skeleton h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3 opacity-20">—</div>
            <p className="text-[var(--text-muted)] text-sm">No warm leads yet</p>
            <p className="text-[var(--text-muted)] text-xs mt-1">Add warm leads via the warm_leads table in Supabase</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map(l => {
              const meta = STATUS_META[l.status] || STATUS_META['Not Contacted'];
              return (
                <div key={l.id} className="p-4 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{l.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">·</span>
                        <span className="text-xs text-[var(--text-secondary)]">{l.business_name}</span>
                        {l.industry && <span className="text-xs text-[var(--text-muted)]">· {l.industry}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {l.source && (
                          <span className="text-xs text-[var(--text-muted)]">
                            <span className="opacity-60">Source:</span> {l.source}
                          </span>
                        )}
                        {l.contact_email && (
                          <span className="text-xs font-mono text-[var(--text-muted)]">{l.contact_email}</span>
                        )}
                        {l.contact_phone && (
                          <span className="text-xs font-mono text-[var(--text-muted)]">{l.contact_phone}</span>
                        )}
                      </div>
                      {l.notes && (
                        <p className="text-xs text-orange-400 mt-2 leading-relaxed">{l.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`badge ${meta.bg}`} style={{ color: meta.color, border: `1px solid ${meta.color}30` }}>
                        {l.status}
                      </span>
                      {l.contact_email && (
                        <a href={`mailto:${l.contact_email}`}
                          className="text-xs font-medium text-[var(--accent-blue)] hover:text-blue-400 transition-colors">
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Outreach planning */}
      <div className="card p-5">
        <div className="section-title">Outreach Plan</div>
        <div className="mt-4 space-y-3">
          {[
            { n: '1', title: 'Identify top 5 warm leads', desc: 'Select from the register above — prioritise HOT signals and owner-managed businesses', color: '#f97316' },
            { n: '2', title: 'Personalise each outreach email', desc: 'Reference their pain signal, company, and any specific context from discovery', color: '#3b82f6' },
            { n: '3', title: 'Send sequence via Gmail (manual send)', desc: 'Dusk reviews and sends each email personally from dawnlabsai@gmail.com', color: '#10b981' },
            { n: '4', title: 'Track replies with Reply Detector cron', desc: 'Cron checks Gmail every 2 hours Mon–Fri for responses to outbound emails', color: '#a855f7' },
            { n: '5', title: 'Move to pipeline on reply', desc: 'Update lead stage to REPLY in Supabase — MEWY alerts Dusk immediately', color: '#06b6d4' },
          ].map(item => (
            <div key={item.n} className="process-step">
              <div className="step-num shrink-0" style={{ background: `${item.color}20`, color: item.color }}>
                {item.n}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
