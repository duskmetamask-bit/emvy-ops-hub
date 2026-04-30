'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Stat {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface RecentLead {
  id: string;
  name: string;
  company: string;
  stage: string;
  temp: string;
  created_at: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recent, setRecent] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('leads').select('*');
        const leads = data || [];
        const hot = leads.filter((l: any) => l.temp === 'HOT').length;
        const sent = leads.filter((l: any) => l.stage === 'SENT').length;
        const discovered = leads.filter((l: any) => l.stage === 'DISCOVERED').length;
        const warm = leads.filter((l: any) => l.temp === 'WARM').length;

        setStats([
          { label: 'Total Leads', value: leads.length, icon: '🎯', color: 'text-blue-400' },
          { label: 'Hot Leads', value: hot, icon: '🔥', color: 'text-red-400' },
          { label: 'Emails Sent', value: sent, icon: '📧', color: 'text-purple-400' },
          { label: 'Warm', value: warm, icon: '☀️', color: 'text-orange-400' },
          { label: 'Discovered', value: discovered, icon: '🔍', color: 'text-indigo-400' },
        ]);

        const sorted = [...leads].sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);
        setRecent(sorted);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const STAGE_COLORS: Record<string, string> = {
    DISCOVERED: 'bg-indigo-500',
    ENRICHED: 'bg-purple-500',
    SENT: 'bg-blue-500',
    REPLY: 'bg-cyan-500',
    CALL: 'bg-pink-500',
    AUDIT: 'bg-amber-500',
    BUILD: 'bg-emerald-500',
    DONE: 'bg-green-600',
    SKIP: 'bg-gray-700',
  };

  const TEMP_COLORS: Record<string, string> = {
    HOT: 'bg-red-500',
    WARM: 'bg-orange-500',
    DISCOVERED: 'bg-blue-500',
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">EMVY AI Audit Consultancy — {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Perth' })}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-800 animate-pulse">
              <div className="h-8 w-8 bg-gray-700 rounded-lg mb-3" />
              <div className="h-8 w-12 bg-gray-700 rounded mb-1" />
              <div className="h-3 w-20 bg-gray-700 rounded" />
            </div>
          ))
        ) : (
          stats.map((s) => (
            <div key={s.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className={`text-sm ${s.color}`}>{s.label}</div>
            </div>
          ))
        )}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent Leads</h3>
            <a href="/leads" className="text-xs text-blue-400 hover:text-blue-300">View all →</a>
          </div>
          <div className="divide-y divide-gray-800">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse">
                  <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-48 bg-gray-800 rounded" />
                </div>
              ))
            ) : recent.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500 text-sm">No leads yet</div>
            ) : (
              recent.map((lead: any) => (
                <div key={lead.id} className="px-5 py-3 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{lead.name}</p>
                      <p className="text-gray-500 text-xs truncate">{lead.company} · {lead.industry}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`w-2 h-2 rounded-full ${TEMP_COLORS[lead.temp] || 'bg-gray-500'}`} />
                      <span className={`text-xs px-2 py-0.5 rounded ${STAGE_COLORS[lead.stage] || 'bg-gray-700'} text-white`}>{lead.stage}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pipeline overview */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-white">Pipeline</h3>
            <a href="/leads" className="text-xs text-blue-400 hover:text-blue-300">Manage →</a>
          </div>
          <div className="p-5 space-y-3">
            {[
              { stage: 'DISCOVERED', color: 'bg-indigo-500', label: 'Discovered' },
              { stage: 'SENT', color: 'bg-blue-500', label: 'Email Sent' },
              { stage: 'REPLY', color: 'bg-cyan-500', label: 'Reply Received' },
              { stage: 'CALL', color: 'bg-pink-500', label: 'Call Booked' },
              { stage: 'AUDIT', color: 'bg-amber-500', label: 'Audit Started' },
              { stage: 'BUILD', color: 'bg-emerald-500', label: 'Build Started' },
              { stage: 'DONE', color: 'bg-green-600', label: 'Client Won' },
            ].map(({ stage, color, label }) => {
              const count = loading ? 0 : (stats.find(s => s.label === 'Total Leads') ? [0] : [0]).length; // simplified
              const stageCount = loading ? 0 : (recent.length > 0 ? '—' : 0);
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-sm text-gray-400 flex-1">{label}</span>
                  <span className="text-sm text-gray-600 tabular-nums">—</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/leads', icon: '🎯', label: 'Leads Pipeline', desc: 'Manage prospects' },
          { href: '/discovery', icon: '🔍', label: 'Discovery', desc: 'Warm leads & outreach' },
          { href: '/audit', icon: '📋', label: 'Audit', desc: 'Process & deliverables' },
          { href: '/apis', icon: '🔑', label: 'API Keys', desc: 'All integrations' },
        ].map(({ href, icon, label, desc }) => (
          <a key={href} href={href}
            className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 transition-all group">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">{label}</div>
            <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
