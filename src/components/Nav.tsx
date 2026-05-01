'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PROCESS_FLOW = [
  { href: '/business', label: 'Business' },
  { href: '/operating', label: 'Operating' },
  { href: '/discovery', label: 'Discovery' },
  { href: '/leads', label: 'Leads' },
  { href: '/audit', label: 'Audit' },
  { href: '/build', label: 'Build' },
  { href: '/maintain', label: 'Maintain' },
];

const TOOLS = [
  { href: '/content', label: 'Content' },
  { href: '/apis', label: 'APIs' },
  { href: '/seo', label: 'SEO' },
  { href: '/infrastructure', label: 'Infra' },
  { href: '/actions', label: 'Actions' },
];

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PROCESS_FLOW.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-sm transition-colors ${
                isActive(href)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TOOLS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-sm transition-colors ${
                isActive(href)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
