'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PROCESS_FLOW = [
  { href: '/leads', label: 'Leads', icon: '🎯' },
  { href: '/discovery', label: 'Discovery', icon: '🔍' },
  { href: '/audit', label: 'Audit', icon: '📋' },
  { href: '/build', label: 'Build', icon: '🔨' },
  { href: '/maintain', label: 'Maintain', icon: '🛠️' },
];

const BUSINESS = [
  { href: '/business', label: 'Business', icon: '🏢' },
  { href: '/operating', label: 'Operating', icon: '⚙️' },
];

const TOOLS = [
  { href: '/apis', label: 'APIs', icon: '🔑' },
  { href: '/infrastructure', label: 'Infra', icon: '🖥️' },
  { href: '/actions', label: 'Actions', icon: '⚡' },
  { href: '/seo', label: 'SEO', icon: '📈' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🎯</span>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">EMVY</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Ops Dashboard</p>
          </div>
        </div>
      </div>

      {/* Process flow */}
      <div className="px-3 pt-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest px-2 mb-2">Process</p>
        <nav className="space-y-0.5">
          {PROCESS_FLOW.map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Business */}
      <div className="px-3 pt-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest px-2 mb-2">Business</p>
        <nav className="space-y-0.5">
          {BUSINESS.map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tools */}
      <div className="px-3 pt-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest px-2 mb-2">Tools</p>
        <nav className="space-y-0.5">
          {TOOLS.map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-5 py-4 border-t border-gray-800">
        <a href="https://rrjktvvnzjzlfquaghut.supabase.co" target="_blank"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          <span>🔗</span>
          Supabase
        </a>
      </div>
    </aside>
  );
}
