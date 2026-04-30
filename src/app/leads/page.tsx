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
  notes: string;
  created_at: string;
}

const COLUMNS = [
  { id: 'DISCOVERED', label: 'Discovered', color: 'border-indigo-500', dot: 'bg-indigo-500', text: 'text-indigo-400' },
  { id: 'ENRICHED', label: 'Enriched', color: 'border-purple-500', dot: 'bg-purple-500', text: 'text-purple-400' },
  { id: 'SENT', label: 'Sent', color: 'border-blue-500', dot: 'bg-blue-500', text: 'text-blue-400' },
  { id: 'REPLY', label: 'Reply', color: 'border-cyan-500', dot: 'bg-cyan-500', text: 'text-cyan-400' },
  { id: 'CALL', label: 'Call', color: 'border-pink-500', dot: 'bg-pink-500', text: 'text-pink-400' },
  { id: 'AUDIT', label: 'Audit', color: 'border-amber-500', dot: 'bg-amber-500', text: 'text-amber-400' },
  { id: 'BUILD', label: 'Build', color: 'border-emerald-500', dot: 'bg-emerald-500', text: 'text-emerald-400' },
  { id: 'DONE', label: 'Done', color: 'border-green-600', dot: 'bg-green-500', text: 'text-green-400' },
];

const TEMP_DOT: Record<string, string> = {
  HOT: 'bg-red-500 ring-1 ring-red-400',
  WARM: 'bg-orange-500',
  DISCOVERED: 'bg-blue-500',
};

const SKIP = { id: 'SKIP', label: 'Skipped', color: 'border-gray-600', dot: 'bg-gray-600', text: 'text-gray-500' };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HOT' | 'WARM'>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        setLeads(data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const getByStage = (stage: string) => {
    let filtered = leads.filter(l => l.stage === stage);
    if (activeFilter === 'HOT') filtered = filtered.filter(l => l.temp === 'HOT');
    if (activeFilter === 'WARM') filtered = filtered.filter(l => l.temp === 'WARM');
    return filtered;
  };

  const hotCount = leads.filter(l => l.temp === 'HOT').length;
  const warmCount = leads.filter(l => l.temp === 'WARM').length;
  const skipCount = leads.filter(l => l.stage === 'SKIP').length;

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Page header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">Leads Pipeline</h1>
          <p className="text-xs text-gray-500 mt-0.5">{leads.length} total · {hotCount} hot · {warmCount} warm</p>
        </div>
        <div className="flex items-center gap-2">
          {([['ALL', 'All'], ['HOT', `Hot ${hotCount}`], ['WARM', `Warm ${warmCount}`]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setActiveFilter(val)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                activeFilter === val
                  ? val === 'HOT' ? 'bg-red-900 border-red-700 text-red-300'
                  : val === 'WARM' ? 'bg-orange-900 border-orange-700 text-orange-300'
                  : 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 p-4 h-full" style={{ minWidth: 'max-content' }}>
          {COLUMNS.map(col => {
            const colLeads = getByStage(col.id);
            return (
              <div key={col.id} className="w-64 flex flex-col shrink-0">
                {/* Column header */}
                <div className={`border-t-2 ${col.color} bg-gray-900 rounded-t-xl px-3 py-2.5 mb-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span className="text-sm font-semibold text-white">{col.label}</span>
                    </div>
                    <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">{colLeads.length}</span>
                  </div>
                </div>
                {/* Cards */}
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-3 animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-800 rounded w-1/2" />
                      </div>
                    ))
                  ) : colLeads.length === 0 ? (
                    <div className="text-center py-6 text-gray-700 text-xs">—</div>
                  ) : (
                    colLeads.map(lead => (
                      <button key={lead.id} onClick={() => setSelectedLead(lead)}
                        className="w-full text-left bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 hover:bg-gray-850 transition-all p-3 group">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-white text-sm font-medium leading-tight">{lead.name}</p>
                          {lead.temp && <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${TEMP_DOT[lead.temp] || 'bg-gray-600'}`} />}
                        </div>
                        <p className="text-gray-500 text-xs leading-tight">{lead.company}</p>
                        {lead.industry && <p className="text-gray-600 text-xs mt-0.5">{lead.industry}</p>}
                        {lead.pain_evidence && (
                          <p className="text-orange-500/80 text-xs mt-1.5 leading-tight line-clamp-2">{lead.pain_evidence}</p>
                        )}
                        {lead.score > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-[10px] text-gray-600">score</span>
                            <span className="text-xs font-mono text-gray-500">{lead.score}</span>
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Skipped column */}
          {skipCount > 0 && (
            <div className="w-64 shrink-0">
              <div className={`border-t-2 ${SKIP.color} bg-gray-900 rounded-t-xl px-3 py-2.5 mb-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${SKIP.dot}`} />
                    <span className="text-sm font-semibold text-white">{SKIP.label}</span>
                  </div>
                  <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">{skipCount}</span>
                </div>
              </div>
              <div className="space-y-2">
                {leads.filter(l => l.stage === 'SKIP').map(lead => (
                  <div key={lead.id} className="bg-gray-900 rounded-xl border border-gray-800 p-3 opacity-60">
                    <p className="text-white text-sm font-medium">{lead.name}</p>
                    <p className="text-gray-500 text-xs">{lead.company}</p>
                    {lead.notes && <p className="text-gray-600 text-xs mt-1 line-clamp-2">{lead.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}>
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedLead.company} · {selectedLead.industry}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-white text-xl">×</button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs px-2 py-1 rounded ${selectedLead.temp === 'HOT' ? 'bg-red-900 text-red-300' : selectedLead.temp === 'WARM' ? 'bg-orange-900 text-orange-300' : 'bg-gray-800 text-gray-400'}`}>
                  {selectedLead.temp}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  COLUMNS.find(c => c.id === selectedLead.stage) ? `bg-gray-800 text-gray-300` : 'bg-gray-800 text-gray-600'
                }`}>
                  {selectedLead.stage}
                </span>
                {selectedLead.score > 0 && <span className="text-xs text-gray-600">score {selectedLead.score}</span>}
              </div>
            </div>
            <div className="p-5 space-y-3">
              {selectedLead.email && <div><p className="text-xs text-gray-500 mb-0.5">Email</p><p className="text-sm text-white">{selectedLead.email}</p></div>}
              {selectedLead.phone && <div><p className="text-xs text-gray-500 mb-0.5">Phone</p><p className="text-sm text-white">{selectedLead.phone}</p></div>}
              {selectedLead.location && <div><p className="text-xs text-gray-500 mb-0.5">Location</p><p className="text-sm text-white">{selectedLead.location}</p></div>}
              {selectedLead.pain_evidence && <div><p className="text-xs text-gray-500 mb-0.5">Pain Signal</p><p className="text-sm text-orange-400">{selectedLead.pain_evidence}</p></div>}
              {selectedLead.notes && <div><p className="text-xs text-gray-500 mb-0.5">Notes</p><p className="text-sm text-gray-400">{selectedLead.notes}</p></div>}
              {selectedLead.discovery_date && <div><p className="text-xs text-gray-500 mb-0.5">Discovered</p><p className="text-sm text-gray-400">{selectedLead.discovery_date}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
