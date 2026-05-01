'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/':            { title: 'Dashboard',   description: 'EMVY operations overview' },
  '/leads':      { title: 'Leads',      description: 'Pipeline — discover to close' },
  '/discovery':  { title: 'Discovery',   description: 'Warm leads and outreach' },
  '/audit':      { title: 'Audit',      description: '$1,500 AI audit process' },
  '/build':      { title: 'Build',      description: '$3k–$5k implementation' },
  '/maintain':   { title: 'Maintain',   description: '$1,500/month retainer' },
  '/business':   { title: 'Business',  description: 'Entities, domains, grants' },
  '/operating':  { title: 'Operating',  description: 'Processes, systems, APIs' },
  '/apis':       { title: 'APIs',      description: 'Key integrations and credentials' },
  '/infrastructure': { title: 'Infra',   description: 'Deployed apps and infra' },
  '/actions':    { title: 'Actions',   description: 'Priority task list' },
  '/seo':        { title: 'SEO',        description: 'Rankings and content' },
  '/content':    { title: 'Content',   description: 'Content calendar and feedback' },
};

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('en-AU', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: 'Australia/Perth',
    });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  const meta = PAGE_META[pathname] || { title: pathname.replace('/', '') || 'Dashboard', description: '' };

  return (
    <header style={{
      height: 58,
      borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(90deg, rgba(59,130,246,0.03) 0%, transparent 50%, rgba(139,92,246,0.03) 100%)',
    }} className="flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">{meta.title}</h2>
        {meta.description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{meta.description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Live</span>
        </div>
        <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
        <span className="font-mono text-xs font-medium text-[var(--text-secondary)] tabular-nums">{time}</span>
        <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">AWST</span>
        <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
        <a href="https://emvyai.vercel.app" target="_blank" rel="noopener noreferrer"
          className="text-[10px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors uppercase tracking-widest">
          emvy.ai ↗
        </a>
      </div>
    </header>
  );
}
