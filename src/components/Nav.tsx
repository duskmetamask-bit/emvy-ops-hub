'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PROCESS_FLOW = [
  { href: '/business', label: 'Business', emoji: '🏢' },
  { href: '/operating', label: 'Operating', emoji: '⚙️' },
  { href: '/discovery', label: 'Discovery', emoji: '🔍' },
  { href: '/leads', label: 'Leads', emoji: '🎯' },
  { href: '/audit', label: 'Audit', emoji: '📋' },
  { href: '/build', label: 'Build', emoji: '🔨' },
  { href: '/maintain', label: 'Maintain', emoji: '🛠️' },
];

const TOOLS = [
  { href: '/apis', label: 'APIs', emoji: '🔑' },
  { href: '/seo', label: 'SEO', emoji: '📈' },
  { href: '/infrastructure', label: 'Infra', emoji: '🖥️' },
  { href: '/actions', label: 'Actions', emoji: '⚡' },
];

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PROCESS_FLOW.map(({ href, label, emoji }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-sm transition-colors ${
              isActive(href)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </Link>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TOOLS.map(({ href, label, emoji }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-sm transition-colors ${
              isActive(href)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
