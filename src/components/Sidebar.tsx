'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PROCESS_FLOW = [
  { href: '/leads',     label: 'Leads',     accent: '#3b82f6', icon: '◈' },
  { href: '/discovery', label: 'Discovery',  accent: '#f97316', icon: '◉' },
  { href: '/audit',     label: 'Audit',      accent: '#f59e0b', icon: '◎' },
  { href: '/build',     label: 'Build',      accent: '#10b981', icon: '◆' },
  { href: '/maintain',  label: 'Maintain',   accent: '#06b6d4', icon: '◇' },
];

const BUSINESS = [
  { href: '/business',       label: 'Business',       accent: '#8b5cf6', icon: '▣' },
  { href: '/operating',     label: 'Operating',      accent: '#a855f7', icon: '▤' },
];

const TOOLS: Array<{ href: string; label: string; accent: string; icon: string; highlight?: boolean }> = [
  { href: '/content',        label: 'Content',        accent: '#ec4899', icon: '▥', highlight: true },
  { href: '/actions',       label: 'Actions',        accent: '#22c55e', icon: '▦' },
  { href: '/apis',          label: 'APIs',           accent: '#71717a', icon: '▧' },
  { href: '/infrastructure',label: 'Infra',          accent: '#71717a', icon: '▨' },
  { href: '/seo',           label: 'SEO',            accent: '#71717a', icon: '▩' },
];

function getActiveClass(href: string, accent: string, pathname: string) {
  const isActive = pathname === href || pathname.startsWith(href + '/');
  if (!isActive) return 'nav-item';
  if (accent === '#3b82f6') return 'nav-item active';
  if (accent === '#f97316') return 'nav-item active-orange';
  if (accent === '#f59e0b') return 'nav-item active-amber';
  if (accent === '#10b981') return 'nav-item active-emerald';
  if (accent === '#06b6d4') return 'nav-item active-cyan';
  if (accent === '#8b5cf6') return 'nav-item active-purple';
  if (accent === '#ec4899') return 'nav-item active-purple';
  return 'nav-item active-gray';
}

function NavGroup({ title, items }: { title: string; items: Array<{ href: string; label: string; accent: string; icon: string; highlight?: boolean }> }) {
  const pathname = usePathname();
  return (
    <div>
      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-3 mb-1.5">{title}</p>
      <nav className="space-y-0.5 px-2">
        {items.map(({ href, label, accent, icon, highlight }) => (
          <Link key={href} href={href} className={getActiveClass(href, accent, pathname)}>
            <span className="text-base leading-none opacity-70" style={{ color: accent }}>{icon}</span>
            <span className="flex-1">{label}</span>
            {highlight && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ec4899', boxShadow: '0 0 6px #ec4899' }} />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside style={{
      width: 224,
      background: 'linear-gradient(180deg, #0f0f13 0%, var(--bg-secondary) 100%)',
      borderRight: '1px solid var(--border)',
    }} className="flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 34,
            height: 34,
            background: 'linear-gradient(135deg, #1d4ed8 0%, #6366f1 50%, #8b5cf6 100%)',
            borderRadius: 10,
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
          }} className="flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <div>
            <h1 className="text-base font-black text-[var(--text-primary)] leading-none tracking-tight">EMVY</h1>
            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Ops Hub</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 space-y-5 overflow-y-auto">
        <NavGroup title="Pipeline" items={PROCESS_FLOW} />
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 12px' }} />
        <NavGroup title="Business" items={BUSINESS} />
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 12px' }} />
        <NavGroup title="Tools" items={TOOLS} />
      </div>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
          Supabase live
        </a>
        <p className="text-[9px] text-[var(--text-muted)] mt-1 opacity-60">callieai · rrjktvvnzjzlfquaghut</p>
      </div>
    </aside>
  );
}
