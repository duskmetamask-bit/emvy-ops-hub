'use client';

import { useState } from 'react';

const CHECKLIST_ITEMS = [
  { id: 'd1', task: 'Buy emvy.ai from Porkbun', category: 'domain', status: 'todo' },
  { id: 'd2', task: 'Point emvy.ai to Vercel (A record + CNAME)', category: 'domain', status: 'todo' },
  { id: 'd3', task: 'Add emvy.ai to Google Search Console (DNS TXT verification)', category: 'domain', status: 'todo' },
  { id: 'd4', task: 'Add emvyai.vercel.app to Google Search Console (HTML tag)', category: 'domain', status: 'todo' },
  { id: 'd5', task: 'Set up www.emvy.ai redirect to emvy.ai', category: 'domain', status: 'todo' },
  { id: 'a1', task: 'GA4 on emvyai.vercel.app', category: 'analytics', status: 'todo' },
  { id: 'a2', task: 'Vercel Analytics enabled', category: 'analytics', status: 'todo' },
  { id: 'a3', task: 'Microsoft Clarity on emvyai.vercel.app', category: 'analytics', status: 'todo' },
  { id: 't1', task: 'Run PageSpeed Insights on emvyai.vercel.app', category: 'technical', status: 'todo' },
  { id: 't2', task: 'Fix any Core Web Vitals failures (LCP, FID, CLS)', category: 'technical', status: 'todo' },
  { id: 't3', task: 'Submit sitemap to Google Search Console (/sitemap.xml)', category: 'technical', status: 'todo' },
  { id: 'c1', task: 'Set up Carrd ($19/yr) — lead magnet landing page', category: 'content', status: 'todo' },
  { id: 'c2', task: 'Create PDF lead magnet: "The AI Audit Checklist for Perth SMBs"', category: 'content', status: 'todo' },
  { id: 'c3', task: 'Set up email capture on Carrd (Tally or ConvertKit)', category: 'content', status: 'todo' },
  { id: 'c4', task: 'Create Carrd page: emvy.ai/audit-checklist', category: 'content', status: 'todo' },
  { id: 'c5', task: 'Build emvy-content-pipeline skill v2 (SEO research + Tavily + meta)', category: 'content', status: 'todo' },
];

const CONTENT_PILLARS = [
  {
    id: 'p1',
    name: 'AI Tools Not Working',
    topics: [
      'Why your AI tools don\'t talk to each other',
      'The hidden cost of disconnected AI tools',
      'How to audit your AI stack in 30 minutes',
    ],
    priority: 'high',
    status: 'planned',
  },
  {
    id: 'p2',
    name: 'AI Phone Answering',
    topics: [
      'Why your AI phone agent is missing calls',
      'Why Botpress/VAPI isn\'t enough on its own',
      'The AI receptionist audit checklist',
    ],
    priority: 'high',
    status: 'planned',
  },
  {
    id: 'p3',
    name: 'AI for Small Business',
    topics: [
      'AI automation for Perth small business — what actually works',
      'The $500/mo vs $5,000/mo AI agency: what\'s the difference',
      'How much does an AI audit cost in Australia',
    ],
    priority: 'high',
    status: 'planned',
  },
  {
    id: 'p4',
    name: 'Case Studies + Results',
    topics: [
      'How [Industry] in Perth automated [problem]',
      'From [pain] to [result] — real EMVY client story',
    ],
    priority: 'medium',
    status: 'planned',
  },
];

const KEYWORD_OPPORTUNITIES = [
  { keyword: 'AI audit Perth', intent: 'Commercial', difficulty: 'Low', priority: 'high' },
  { keyword: 'AI automation agency Perth', intent: 'Commercial', difficulty: 'Low', priority: 'high' },
  { keyword: 'AI phone answering Perth', intent: 'Commercial', difficulty: 'Low', priority: 'high' },
  { keyword: 'small business AI tools not working', intent: 'Informational', difficulty: 'Low', priority: 'medium' },
  { keyword: 'automation audit small business', intent: 'Commercial', difficulty: 'Medium', priority: 'medium' },
  { keyword: 'AI consultant Perth', intent: 'Commercial', difficulty: 'Medium', priority: 'medium' },
  { keyword: 'how to automate my Perth business', intent: 'Informational', difficulty: 'Low', priority: 'medium' },
  { keyword: 'AI chatbot for small business Perth', intent: 'Commercial', difficulty: 'Low', priority: 'medium' },
];

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  high:   { bg: '#ef444420', color: '#ef4444' },
  medium: { bg: '#f59e0b20', color: '#f59e0b' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  published:   { bg: '#10b98120', color: '#10b981' },
  in_progress: { bg: '#3b82f620', color: '#3b82f6' },
  planned:     { bg: '#52525b20', color: '#52525b' },
};

export default function SeoPage() {
  const [items, setItems] = useState(CHECKLIST_ITEMS);
  const [activeTab, setActiveTab] = useState<'checklist' | 'pillars' | 'keywords'>('checklist');

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'done' ? 'todo' : 'done' }
        : item
    ));
  };

  const categories = ['domain', 'analytics', 'technical', 'content'] as const;
  const categoryLabels = { domain: 'Domain', analytics: 'Analytics', technical: 'Technical', content: 'Content' };
  const categoryAccents = { domain: '#6366f1', analytics: '#06b6d4', technical: '#a855f7', content: '#f59e0b' };

  const doneCount = items.filter(i => i.status === 'done').length;
  const totalCount = items.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">SEO</h1>
        <p className="page-subtitle">Phase 1 Infrastructure · Content Strategy</p>
      </div>

      {/* Progress banner */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Phase 1 Progress</p>
            <p className="text-xs text-[var(--text-muted)]">{doneCount}/{totalCount} tasks complete</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{progressPct}%</div>
          </div>
        </div>
        <div className="pipeline-bar">
          <div className="pipeline-bar-fill" style={{ width: `${progressPct}%`, background: '#3b82f6' }} />
        </div>
      </div>

      {/* Activation trigger */}
      <div className="card p-4" style={{ borderColor: '#f59e0b30', background: '#f59e0b10' }}>
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Activation Trigger</div>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Activate SEO when: 3+ consistent clients + outbound running without daily management + calendar full
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          ['checklist', 'Phase 1 Checklist'],
          ['pillars', 'Content Pillars'],
          ['keywords', 'Keywords'],
        ] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: activeTab === tab ? '#3b82f6' : 'var(--bg-secondary)',
              color: activeTab === tab ? '#fff' : 'var(--text-muted)',
              border: activeTab === tab ? 'none' : '1px solid var(--border)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-5">
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            const catDone = catItems.filter(i => i.status === 'done').length;
            const accent = categoryAccents[cat];
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{categoryLabels[cat]}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{catDone}/{catItems.length}</span>
                </div>
                <div className="space-y-1">
                  {catItems.map(item => (
                    <button key={item.id} onClick={() => toggleItem(item.id)}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        opacity: item.status === 'done' ? 0.5 : 1,
                      }}>
                      <span className="w-4 h-4 rounded border shrink-0 flex items-center justify-center"
                        style={{
                          background: item.status === 'done' ? '#10b981' : 'transparent',
                          borderColor: item.status === 'done' ? '#10b981' : 'var(--border-glow)',
                        }}>
                        {item.status === 'done' && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span className="text-sm" style={{
                        color: item.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: item.status === 'done' ? 'line-through' : 'none',
                      }}>
                        {item.task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content Pillars */}
      {activeTab === 'pillars' && (
        <div className="space-y-4">
          {CONTENT_PILLARS.map(pillar => {
            const pStyle = PRIORITY_STYLES[pillar.priority] || PRIORITY_STYLES.medium;
            const sStyle = STATUS_STYLES[pillar.status] || STATUS_STYLES.planned;
            return (
              <div key={pillar.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{pillar.name}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="badge" style={{ background: pStyle.bg, color: pStyle.color }}>
                        {pillar.priority.toUpperCase()}
                      </span>
                      <span className="badge" style={{ background: sStyle.bg, color: sStyle.color }}>
                        {pillar.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {pillar.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span style={{ color: '#3b82f6' }} className="mt-0.5">→</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Keywords */}
      {activeTab === 'keywords' && (
        <div className="card overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[var(--text-muted)]" style={{ background: 'var(--bg-secondary)' }}>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Keyword</th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Intent</th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody>
              {KEYWORD_OPPORTUNITIES.map((kw, i) => {
                const dStyle = kw.difficulty === 'Low' ? { bg: '#10b98120', color: '#10b981' } : { bg: '#f59e0b20', color: '#f59e0b' };
                const pStyle = PRIORITY_STYLES[kw.priority] || PRIORITY_STYLES.medium;
                return (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-2.5 font-mono text-[var(--text-primary)]">{kw.keyword}</td>
                    <td className="px-4 py-2.5 text-[var(--text-muted)]">{kw.intent}</td>
                    <td className="px-4 py-2.5">
                      <span className="badge" style={{ background: dStyle.bg, color: dStyle.color }}>{kw.difficulty}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="badge" style={{ background: pStyle.bg, color: pStyle.color }}>{kw.priority}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Distribution */}
      <div className="card p-5">
        <div className="section-title">Distribution (when active)</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Free</p>
            <div className="space-y-1.5">
              {['LinkedIn (Dusk\'s personal profile)', 'Reddit (r/smallbusiness, r/entrepreneur)', 'Email warm pipeline leads', 'Google Business Profile'].map(item => (
                <p key={item} className="text-xs text-[var(--text-secondary)]">— {item}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Paid (when budget)</p>
            <div className="space-y-1.5">
              {['LinkedIn Sponsored $10–50/day', 'Google Ads $10–30/day', 'Perth business newsletters'].map(item => (
                <p key={item} className="text-xs text-[var(--text-secondary)]">— {item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
