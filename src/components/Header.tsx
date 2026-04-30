'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Overview of EMVY operations' },
  '/leads': { title: 'Leads', description: 'Pipeline — discover to close' },
  '/discovery': { title: 'Discovery', description: 'Warm leads & outreach planning' },
  '/audit': { title: 'Audit', description: '$1,500 AI audit process' },
  '/build': { title: 'Build', description: '$3k–$5k implementation' },
  '/maintain': { title: 'Maintain', description: '$1,500/month retainer' },
  '/business': { title: 'Business', description: 'Entities, domains, grants' },
  '/operating': { title: 'Operating', description: 'Processes, systems, APIs' },
  '/apis': { title: 'APIs', description: 'Key integrations & credentials' },
  '/infrastructure': { title: 'Infrastructure', description: 'Deployed apps & infra' },
  '/actions': { title: 'Actions', description: 'Automation & cron jobs' },
  '/seo': { title: 'SEO', description: 'Rankings & content' },
};

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Australia/Perth',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const meta = PAGE_META[pathname] || { title: pathname.replace('/', '') || 'Dashboard', description: '' };

  return (
    <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950 shrink-0">
      <div>
        <h2 className="text-base font-semibold text-white">{meta.title}</h2>
        {meta.description && <p className="text-xs text-gray-500">{meta.description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500">AWST</span>
        <span className="font-mono text-sm text-gray-300 tabular-nums">{time}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
    </header>
  );
}
