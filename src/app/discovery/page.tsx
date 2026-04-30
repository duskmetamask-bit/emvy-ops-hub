'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface WarmLead {
  id: string;
  name: string;
  company: string;
  source: string;
  pain_signal: string;
  status: string;
  contacted_at?: string;
  notes?: string;
}

export default function DiscoveryPage() {
  const [leads, setLeads] = useState<WarmLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('warm_leads').select('*').order('created_at', { ascending: false });
        setLeads(data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Discovery</h1>
        <p className="text-gray-400 text-sm">Warm Leads Register · Outreach Planning</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Warm Leads Register</h2>
          <span className="text-xs bg-orange-900 text-orange-300 px-2 py-1 rounded">{leads.length} leads</span>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : leads.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-2">No warm leads yet</p>
            <p className="text-gray-600 text-sm">Add leads to warm_leads table via Supabase</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map(l => (
              <div key={l.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{l.name}</p>
                    <p className="text-gray-400 text-sm">{l.company}</p>
                    <p className="text-orange-400 text-xs mt-1">Signal: {l.pain_signal}</p>
                  </div>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{l.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Outreach Planning</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Casino lead: $75M project, 3 AI agents in 30 days</p>
          <p className="text-xs text-gray-600 mt-2">Full outreach plan coming soon</p>
        </div>
      </div>
    </div>
  );
}
