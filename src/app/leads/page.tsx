'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  company: string;
  industry: string;
  location: string;
  email: string;
  phone: string;
  stage: string;
  score: number;
  temp: string;
  pain_evidence: string;
  discovery_date: string;
  last_contact: string;
  notes: string;
}

const STAGES = ['DISCOVERED', 'ENRICHED', 'SENT', 'REPLY', 'CALL', 'AUDIT', 'BUILD', 'DONE'];
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setLeads(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? leads : leads.filter(l => l.stage === filter || l.temp === filter);
  const counts = STAGES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.stage === s).length }), {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads Pipeline</h1>
          <p className="text-gray-400 text-sm">{leads.length} total · Supabase</p>
        </div>
        <a href="https://rrjktvvnzjzlfquaghut.supabase.co" target="_blank" className="text-xs bg-gray-800 text-gray-400 px-3 py-1.5 rounded border border-gray-700 hover:border-gray-600">
          Open Supabase →
        </a>
      </div>

      {/* Stage filters */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', ...STAGES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
            {s} {s !== 'ALL' && counts[s] ? `(${counts[s]})` : ''}
          </button>
        ))}
      </div>

      {/* Pipeline board */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading from Supabase...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-2">No leads in Supabase yet</p>
          <p className="text-gray-600 text-sm">Seed the leads table directly in Supabase</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(lead => (
            <div key={lead.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold">{lead.name}</p>
                    <span className={`w-2 h-2 rounded-full ${TEMP_COLORS[lead.temp] || 'bg-gray-500'}`} />
                    <span className="text-xs text-gray-500">{lead.temp}</span>
                    {lead.score && <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">score {lead.score}</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{lead.company} · {lead.industry} · {lead.location}</p>
                  {lead.pain_evidence && <p className="text-orange-400 text-xs mt-1 truncate">{lead.pain_evidence}</p>}
                  {lead.notes && <p className="text-gray-500 text-xs mt-1 truncate">{lead.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded ${STAGE_COLORS[lead.stage] || 'bg-gray-700'} text-white`}>{lead.stage}</span>
                  {lead.email && <span className="text-gray-500 text-xs">{lead.email}</span>}
                  {lead.phone && <span className="text-gray-500 text-xs">{lead.phone}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
