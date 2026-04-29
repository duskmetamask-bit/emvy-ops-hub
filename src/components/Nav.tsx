'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/leads', label: 'Leads', emoji: '🎯' },
  { href: '/seo', label: 'SEO', emoji: '📈' },
  { href: '/infrastructure', label: 'Infra', emoji: '🖥️' },
  { href: '/actions', label: 'Actions', emoji: '⚡' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2">
      {navItems.map(({ href, label, emoji }) => (
        <Link
          key={href}
          href={href}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            pathname === href
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="mr-2">{emoji}</span>
          {label}
        </Link>
      ))}
    </nav>
  );
}
