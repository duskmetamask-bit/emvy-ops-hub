'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── DUSK'S WEEKLY SCHEDULE ───────────────────────────────────────────────
// Based on: MEWY Sparring / Content Review / Cron Review / Filming / X+Replies / Posting times

const DAY_SCHEDULES: Record<string, {
  label: string;
  color: string;
  blocks: {
    time: string;
    block: string;
    type: 'DUSK' | 'MEWY' | 'CRON' | 'SOCIAL';
    note?: string;
    highlight?: boolean;
  }[];
}> = {
  monday: {
    label: 'Monday',
    color: '#6366f1',
    blocks: [
      { time: '8:00 AM', block: 'Review Crons', type: 'CRON', note: 'Pipeline Health + Build Recommender + Content drops', highlight: false },
      { time: '8:30 AM', block: 'MEWY Sparring Session', type: 'MEWY', note: 'Review cron outputs, decide what to act on', highlight: true },
      { time: '9:00 AM', block: 'Lead Finder fires', type: 'CRON', note: 'Mon–Thu' },
      { time: '9:00 AM', block: 'Check email — any replies?', type: 'DUSK', note: 'Reply Detector results' },
      { time: '10:00 AM', block: 'Outreach block', type: 'DUSK', note: 'Draft or send emails to warm leads' },
      { time: 'Flexible', block: 'MEWY Building', type: 'MEWY', note: 'Builds, automations, fixes' },
    ],
  },
  tuesday: {
    label: 'Tuesday',
    color: '#3b82f6',
    blocks: [
      { time: '8:00 AM', block: 'Review Crons', type: 'CRON', note: 'Content Pipeline drops' },
      { time: '8:30 AM', block: 'Content Review — Improvement Loop', type: 'DUSK', note: 'Approve/edit X posts, LinkedIn drafts', highlight: true },
      { time: '9:00 AM', block: 'Reply Detector', type: 'CRON', note: '9AM check' },
      { time: '11:00 AM', block: 'X — Post + Engage', type: 'SOCIAL', note: 'Post content, reply to replies', highlight: true },
      { time: '1:00 PM', block: 'Reply Detector', type: 'CRON', note: '11AM + 1PM checks' },
      { time: 'Flexible', block: 'MEWY Building', type: 'MEWY', note: 'Any active builds' },
    ],
  },
  wednesday: {
    label: 'Wednesday',
    color: '#a855f7',
    blocks: [
      { time: '8:00 AM', block: 'Review Crons', type: 'CRON', note: 'Midnight research drops' },
      { time: '8:30 AM', block: 'MEWY Sparring Session', type: 'MEWY', note: 'Weekly deep-dive on research, leads, strategy', highlight: true },
      { time: '9:00 AM', block: 'Reply Detector', type: 'CRON', note: '9AM check' },
      { time: '11:00 AM', block: 'X — Post + Engage', type: 'SOCIAL', note: 'Mid-week thought leadership post', highlight: true },
      { time: '1:00 PM', block: 'Reply Detector', type: 'CRON', note: '1PM check' },
      { time: 'Flexible', block: 'Lead Gen Review', type: 'DUSK', note: 'Review new leads from Lead Finder' },
    ],
  },
  thursday: {
    label: 'Thursday',
    color: '#f59e0b',
    blocks: [
      { time: '8:00 AM', block: 'Review Crons', type: 'CRON', note: 'YouTube Script drops' },
      { time: '8:30 AM', block: 'Film YouTube Video', type: 'DUSK', note: '45–60 min filming block — THIS IS THE BIG ONE', highlight: true },
      { time: '9:00 AM', block: 'Reply Detector', type: 'CRON', note: '9AM check' },
      { time: '1:00 PM', block: 'Reply Detector', type: 'CRON', note: '1PM check' },
      { time: '3:00 PM', block: 'Reply Detector', type: 'CRON', note: '3PM check' },
      { time: 'Flexible', block: 'MEWY Building', type: 'MEWY', note: 'Post-film follow-up, content repurposing' },
    ],
  },
  friday: {
    label: 'Friday',
    color: '#10b981',
    blocks: [
      { time: '8:00 AM', block: 'Review Crons', type: 'CRON', note: 'Content + Substack drops' },
      { time: '8:30 AM', block: 'Content Review — Weekly Loop', type: 'DUSK', note: 'Review Substack draft, wrap up week\'s content', highlight: true },
      { time: '9:00 AM', block: 'Reply Detector', type: 'CRON', note: '9AM check' },
      { time: '11:00 AM', block: 'X — Post + Engage', type: 'SOCIAL', note: 'End of week post, engage with replies', highlight: true },
      { time: '1:00 PM', block: 'Reply Detector', type: 'CRON', note: '1PM + 3PM checks' },
      { time: '5:00 PM', block: 'Weekly Review', type: 'DUSK', note: 'What worked, what didn\'t, plan next week', highlight: true },
    ],
  },
};

const AGENT_META = {
  DUSK:   { label: 'Dusk',   bg: 'rgba(236,72,153,0.10)', color: '#ec4899', border: 'rgba(236,72,153,0.20)', dot: '#ec4899' },
  MEWY:   { label: 'MEWY',   bg: 'rgba(168,85,247,0.10)', color: '#a855f7', border: 'rgba(168,85,247,0.20)', dot: '#a855f7' },
  CRON:   { label: 'Cron',   bg: 'rgba(99,102,241,0.08)', color: '#6366f1', border: 'rgba(99,102,241,0.15)', dot: '#6366f1' },
  SOCIAL: { label: 'X/Social', bg: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: 'rgba(59,130,246,0.15)', dot: '#3b82f6' },
};

// ─── PRACTICE DOCS ─────────────────────────────────────────────────────────

const PRACTICE_DOCS = [
  {
    title: 'Audit Questions & Areas to Cover',
    file: 'emvy-audit-questions.md',
    desc: 'Discovery questions, pain point areas, evaluation criteria, ICP check — everything to cover in a Callie discovery call or intake form.',
    status: 'draft',
    accent: '#f59e0b',
  },
  {
    title: 'AI Capabilities & Tool Directory',
    file: 'emvy-ai-capabilities.md',
    desc: 'High-level directory of AI capabilities and providers: agent building (n8n, MAKE, Claude CoWork), voice AI (VAPI), workflows, and use-case mapping for SMB clients.',
    status: 'draft',
    accent: '#6366f1',
  },
  {
    title: 'Audit Report Template',
    file: 'emvy-audit-report-template.md',
    desc: 'PDF-ready structure: AI Opportunity Map, Process Pain Points, Quick Wins, Tool Recommendations, ROI Estimate, Implementation Roadmap.',
    status: 'todo',
    accent: '#10b981',
  },
  {
    title: 'Cold Email Sequence (3 Emails)',
    file: 'emvy-email-sequence.md',
    desc: 'Sequence 1: Intro / Sequence 2: Follow-up / Sequence 3: Breakup. Hooks, angles, and templates for HOT/WARM outreach.',
    status: 'todo',
    accent: '#ec4899',
  },
];

// ─── LEAD MAGNET ───────────────────────────────────────────────────────────

const LEAD_MAGNET = {
  title: '"AI for Your Business" — Free Discovery Guide',
  stages: [
    { label: 'Lead Magnet Offer', desc: 'Free PDF or mini-course: "5 Ways AI Can Cut Your Admin in Half"', status: 'idea', color: '#6366f1' },
    { label: 'Landing Page', desc: 'Carrd or Notion page — collect email in exchange for guide', status: 'idea', color: '#a855f7' },
    { label: 'Email Sequence', desc: '3-email nurture sequence from lead magnet delivery', status: 'todo', color: '#3b82f6' },
    { label: 'Social Proof', desc: 'Add case studies and audit examples as social proof', status: 'todo', color: '#f59e0b' },
  ],
  current: 'idea',
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function OperatingPage() {
  const [activeDay, setActiveDay] = useState<string>(new Date().getDay() === 0 || new Date().getDay() === 6 ? 'monday' : ['monday','tuesday','wednesday','thursday','friday'][new Date().getDay() - 1]);
  const active = DAY_SCHEDULES[activeDay];

  const weekDays = ['monday','tuesday','wednesday','thursday','friday'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Operating</h1>
        <p className="page-subtitle">Schedule · Practice · Lead Magnet · Systems</p>
      </div>

      {/* ── WEEKLY SCHEDULE ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="section-title">Dusk's Weekly Schedule</div>
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
          {weekDays.map(key => {
            const day = DAY_SCHEDULES[key];
            const isActive = key === activeDay;
            return (
              <button key={key} onClick={() => setActiveDay(key)}
                className="flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer"
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

        {/* Schedule blocks */}
        <div className="space-y-1.5">
          {active.blocks.map((block, i) => {
            const meta = AGENT_META[block.type];
            const isDuskOrSocial = block.type === 'DUSK' || block.type === 'SOCIAL';
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${block.highlight ? 'ring-1 ring-offset-1 ring-offset-[var(--bg-primary)]' : ''}`}
                style={{
                  background: block.highlight ? `${meta.color}12` : isDuskOrSocial ? meta.bg : 'var(--bg-secondary)',
                  border: `1px solid ${block.highlight ? meta.color + '35' : isDuskOrSocial ? meta.border : 'var(--border)'}`,
                  ...(block.highlight ? { '--tw-ring-color': meta.color } : {}),
                }}>
                <div className="w-24 shrink-0 pt-0.5">
                  <div className="text-[11px] font-medium text-[var(--text-muted)]">{block.time}</div>
                </div>
                <div className="w-20 shrink-0 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.dot }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>{block.type === 'SOCIAL' ? 'X' : block.type}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${isDuskOrSocial || block.highlight ? 'font-semibold' : 'font-normal'} text-[var(--text-primary)]`}>
                    {block.block}
                    {block.highlight && <span className="ml-2 text-[9px] font-black uppercase tracking-widest" style={{ color: meta.color }}>★ PRIORITY</span>}
                  </div>
                  {block.note && <div className="text-xs text-[var(--text-muted)] mt-0.5">{block.note}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dusk time commitment */}
        <div className="mt-4 p-4 rounded-xl flex items-center justify-between"
          style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.15)' }}>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#ec4899' }}>Dusk's time commitment</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">~1.5 hrs/week — filming (Thu), content review (Tue/Fri), X (daily)</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: '#ec4899' }}>1.5h</div>
            <div className="text-[10px] text-[var(--text-muted)]">/ week</div>
          </div>
        </div>
      </div>

      {/* ── PRACTICE DOCS + LEAD MAGNET ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Practice docs */}
        <div className="card p-5">
          <div className="section-title mb-4">Practice Docs</div>
          <div className="space-y-3">
            {PRACTICE_DOCS.map(doc => (
              <div key={doc.file} className="p-4 rounded-xl"
                style={{ background: 'var(--bg-secondary)', border: `1px solid ${doc.status === 'draft' ? doc.accent + '30' : 'var(--border)'}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{doc.title}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{doc.desc}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1">{doc.file}</div>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: doc.status === 'done' ? 'rgba(16,185,129,0.12)' : doc.status === 'draft' ? `${doc.accent}15` : 'rgba(99,102,241,0.10)',
                      color: doc.status === 'done' ? '#10b981' : doc.status === 'draft' ? doc.accent : '#6366f1',
                    }}>
                    {doc.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs text-[var(--text-muted)]">These docs get us ready to service clients the moment we land one</span>
          </div>
        </div>

        {/* Lead Magnet */}
        <div className="card p-5">
          <div className="section-title mb-4">Lead Magnet</div>
          <div className="p-4 rounded-xl mb-4"
            style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#f97316' }}>{LEAD_MAGNET.title}</div>
            <div className="text-xs text-[var(--text-muted)]">The asset we give away free to cold traffic in exchange for their email</div>
          </div>
          <div className="space-y-2">
            {LEAD_MAGNET.stages.map((stage, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5"
                  style={{ background: `${stage.color}20`, color: stage.color }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{stage.label}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{stage.desc}</div>
                </div>
                <span className="shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: stage.status === 'done' ? 'rgba(16,185,129,0.12)' : stage.status === 'idea' ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.08)',
                    color: stage.status === 'done' ? '#10b981' : '#6366f1',
                  }}>
                  {stage.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f97316' }} />
            <span className="text-xs text-[var(--text-muted)]">Priority: build the guide content first, then set up Carrd landing page</span>
          </div>
        </div>
      </div>

      {/* ── FLOWCHART ── */}
      <div className="card p-5">
        <div className="section-title mb-1">EMVY Business Flow</div>
        <p className="text-xs text-[var(--text-muted)] mb-5">Where we are right now — next big action highlighted</p>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {[
            { label: 'Find Leads', sub: 'Lead Finder cron', color: '#3b82f6', done: true, next: false },
            { label: 'Warm Up', sub: 'Dusk sends emails', color: '#f97316', done: false, next: true },
            { label: 'Get Reply', sub: 'Reply Detector', color: '#06b6d4', done: false, next: false },
            { label: 'Discovery Call', sub: 'VAPI — Callie', color: '#a855f7', done: false, next: false },
            { label: 'Deliver Audit', sub: '$1,500', color: '#f59e0b', done: false, next: false },
            { label: 'Build', sub: '$3k–$5k', color: '#10b981', done: false, next: false },
            { label: 'Retainer', sub: '$1,500/mo', color: '#22c55e', done: false, next: false },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center gap-3 shrink-0">
              <div className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border ${node.next ? 'ring-2 ring-offset-2 ring-[#f97316]' : ''}`}
                style={{
                  background: node.done ? 'rgba(34,197,94,0.08)' : node.next ? 'rgba(249,115,22,0.10)' : 'var(--bg-secondary)',
                  borderColor: node.done ? 'rgba(34,197,94,0.3)' : node.next ? 'rgba(249,115,22,0.5)' : 'var(--border)',
                  minWidth: 110,
                }}>
                <div className="w-2.5 h-2.5 rounded-full"
                  style={{ background: node.done ? '#22c55e' : node.next ? '#f97316' : node.color, boxShadow: node.next ? '0 0 10px rgba(249,115,22,0.9)' : 'none' }} />
                <div className="text-xs font-bold text-center" style={{ color: node.done ? '#22c55e' : node.next ? '#f97316' : 'var(--text-primary)' }}>
                  {node.label}
                </div>
                <div className="text-[9px] text-center text-[var(--text-muted)]">{node.sub}</div>
                {node.next && <div className="text-[8px] font-black uppercase tracking-widest mt-0.5" style={{ color: '#f97316' }}>▶ NEXT</div>}
              </div>
              {i < arr.length - 1 && <div className="text-[var(--text-muted)] shrink-0 text-lg">→</div>}
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-lg text-xs"
          style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', color: 'var(--text-muted)' }}>
          <span style={{ color: '#f97316' }}>Bottleneck:</span> WARM UP — outreach is paused. Fix: review 5 HOT leads in dashboard and send first email. Lead magnet then kicks traffic into the top of this funnel.
        </div>
      </div>

      {/* ── CORE SYSTEMS ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title">Core Systems</div>
          <Link href="/infrastructure" className="text-xs text-[var(--accent-blue)] hover:underline">Manage infra →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: 'Supabase', type: 'Database', status: 'Live', purpose: 'CRM + leads' },
            { name: 'Vercel', type: 'Hosting', status: 'Live', purpose: 'Ops Hub' },
            { name: 'Gmail SMTP', type: 'Email', status: 'Live', purpose: 'dawnlabsai@gmail.com' },
            { name: 'CAL.com', type: 'Scheduling', status: 'Live', purpose: 'jake-emvy/15-min-ai-chat' },
            { name: 'VAPI', type: 'Voice AI', status: 'Live', purpose: 'Callie AI agent' },
            { name: 'NVIDIA API', type: 'AI/ML', status: 'Live', purpose: 'LLM inference' },
            { name: 'X API', type: 'Social', status: 'Live', purpose: 'Posting + monitoring' },
            { name: 'Tailscale', type: 'VPN', status: 'Live', purpose: 'VPS ↔ Mac file delivery' },
          ].map(sys => (
            <div key={sys.name} className="flex items-start justify-between p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{sys.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{sys.type}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{sys.purpose}</p>
              </div>
              <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.10)', color: '#10b981' }}>
                {sys.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
