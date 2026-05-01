'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const STEPS = [
  {
    n: '1', title: 'Discovery Call',
    desc: 'Callie (VAPI AI voice) books and runs a 15-minute discovery call. She qualifies the lead and books directly into your Cal.com.',
    color: '#f59e0b', bg: 'bg-amber-500/10',
    detail: 'VAPI voice ID: 20b39d8e-8494-49de-aa19-2dff5ec9b205',
  },
  {
    n: '2', title: 'Transcript Captured',
    desc: 'Call notes and transcript stored in Supabase (call_notes table). MEWY reviews and extracts pain points.',
    color: '#3b82f6', bg: 'bg-blue-500/10',
    detail: 'Table: call_notes · Linked to leads table by lead_id',
  },
  {
    n: '3', title: 'Audit Report Generated',
    desc: 'MEWY generates a structured PDF audit report covering opportunities, pain points, quick wins, tools, ROI and roadmap.',
    color: '#a855f7', bg: 'bg-purple-500/10',
    detail: 'Stored in audit_reports table · Draft delivered to Dusk for review',
  },
  {
    n: '4', title: 'Report Delivered',
    desc: 'MEWY drafts the delivery email. Dusk reviews, attaches the PDF, and sends from dawnlabsai@gmail.com.',
    color: '#10b981', bg: 'bg-emerald-500/10',
    detail: 'Email from dawnlabsai@gmail.com · Book link included: cal.com/jake-emvy/15-min-ai-chat',
  },
];

const DELIVERABLES = [
  { label: 'AI Opportunity Map',     icon: '◆', color: '#a855f7' },
  { label: 'Process Pain Points',     icon: '◆', color: '#ec4899' },
  { label: 'Quick Wins',             icon: '◆', color: '#f59e0b' },
  { label: 'Tool Recommendations',   icon: '◆', color: '#3b82f6' },
  { label: 'ROI Estimate',           icon: '◆', color: '#10b981' },
  { label: 'Implementation Roadmap',icon: '◆', color: '#06b6d4' },
];

export default function AuditPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('audit_reports').select('*').order('created_at', { ascending: false }).limit(5);
        setReports(data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Audit</h1>
        <p className="page-subtitle">$1,500 AI Audit · Discovery to delivery in 2–3 days</p>
      </div>

      {/* Pricing */}
      <div className="card p-5">
        <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
          {[
            { label: 'Price',         value: '$1,500',   color: '#f59e0b' },
            { label: 'Duration',      value: '2–3 days', color: '#3b82f6' },
            { label: 'Deliverable',  value: 'PDF Report', color: '#a855f7' },
            { label: 'Intake',       value: 'VAPI Call', color: '#10b981' },
          ].map(item => (
            <div key={item.label} className="px-6 first:pl-0 text-center">
              <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="card p-5">
        <div className="section-title">Process</div>
        <div className="mt-4 space-y-3">
          {STEPS.map(s => (
            <div key={s.n} className="process-step" style={{ borderColor: `${s.color}20` }}>
              <div className="step-num shrink-0" style={{ background: s.bg, color: s.color }}>
                {s.n}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{s.desc}</p>
                <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      <div className="card p-5">
        <div className="section-title">Deliverables</div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {DELIVERABLES.map(d => (
            <div key={d.label} className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-sm text-[var(--text-secondary)]">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reports */}
      <div className="card p-5">
        <div className="section-title">Recent Reports</div>
        {loading ? (
          <div className="space-y-2 mt-4">
            {[1,2].map(i => <div key={i} className="skeleton h-10 w-full rounded-lg" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-sm">No audit reports yet</div>
        ) : (
          <div className="space-y-2 mt-4">
            {reports.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{r.title || 'Audit Report'}</p>
                  <p className="text-xs text-[var(--text-muted)]">{new Date(r.created_at).toLocaleDateString('en-AU', { timeZone: 'Australia/Perth' })}</p>
                </div>
                <span className={`badge bg-purple-500/20 text-purple-400 border border-purple-500/30`}>Report</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
