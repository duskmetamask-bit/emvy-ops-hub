'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PROCESS_FLOW = [
  { href: '/leads',     label: 'Leads',     accent: '#3b82f6' },
  { href: '/discovery', label: 'Discovery', accent: '#f97316' },
  { href: '/audit',     label: 'Audit',     accent: '#f59e0b' },
  { href: '/build',     label: 'Build',     accent: '#10b981' },
  { href: '/maintain',  label: 'Maintain',  accent: '#06b6d4' },
];

const BUSINESS = [
  { href: '/business',    label: 'Business',    accent: '#6366f1' },
  { href: '/operating',  label: 'Operating',   accent: '#a855f7' },
];

const TOOLS = [
  { href: '/actions',       label: 'Actions',   accent: '#22c55e' },
  { href: '/apis',          label: 'APIs',     accent: '#52525b' },
  { href: '/infrastructure',label: 'Infra',     accent: '#52525b' },
  { href: '/seo',           label: 'SEO',      accent: '#52525b' },
];

function NavGroup({ title, items }: { title: string; items: typeof PROCESS_FLOW }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="px-3">
      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1.5">{title}</p>
      <nav className="space-y-0.5">
        {items.map(({ href, label, accent }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background:  active ? `${accent}18` : 'transparent',
                color:      active ? accent : 'var(--text-muted)',
                borderLeft: active ? `2px solid ${accent}` : '2px solid transparent',
              }}>
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside style={{ width: '220px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
      className="flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 8 }}
               className="flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">E</span>
          </div>
          <div>
            <h1 className="text-base font-black text-[var(--text-primary)] leading-none tracking-tight">EMVY</h1>
            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Ops Hub</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 space-y-5 overflow-y-auto">
        <NavGroup title="Process" items={PROCESS_FLOW} />
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 12px' }} />
        <NavGroup title="Business" items={BUSINESS} />
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 12px' }} />
        <NavGroup title="Tools" items={TOOLS} />
      </div>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Supabase connected
        </a>
        <p className="text-[9px] text-[var(--text-muted)] mt-1.5 opacity-60">callieai project</p>
      </div>
    </aside>
  );
}
