'use client';

import { useState } from 'react';
import type { Lead, LeadStage } from '@/lib/types';

// Live EMVY pipeline — 24 active leads (locked 2026-04-29)
const LEADS: Lead[] = [
  // HOT
  { id: '1', name: 'Dicandilo Thomson', company: 'Dicandilo Thomson', industry: 'Chartered Accountant', location: 'Burswood, Perth', email: 'office@dicandilothomson.com.au', phone: '(08) 9355 1400', stage: 'SENT', score: 7, temp: 'HOT', pain_evidence: 'Chartered accounting — tax planning, compliance, SMB clients', discovery_date: '2026-04-17', last_contact: '2026-04-17', last_updated: '2026-04-29' },
  { id: '2', name: 'Ryan & Partners', company: 'Ryan & Partners', industry: 'Accountant', location: 'Joondalup, Perth', email: 'admin@ryanandpartners.com.au', phone: '1800 577 411', stage: 'SENT', score: 7, temp: 'HOT', pain_evidence: 'Admin burden, compliance, cash flow management', discovery_date: '2026-04-17', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '3', name: 'Delta Roofing', company: 'Delta Roofing', industry: 'Roofer', location: 'Perth', email: 'tim@deltaroofing.com.au', stage: 'SENT', score: 7, temp: 'HOT', discovery_date: '2026-04-20', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '4', name: 'DPS Accounting', company: 'DPS Accounting', industry: 'Accounting', location: 'Perth', email: 'pannkaj@dpsaccounting.com.au', stage: 'SENT', score: 7, temp: 'HOT', discovery_date: '2026-04-18', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '5', name: 'Accountant In Perth', company: 'Accountant In Perth', industry: 'Accountant', location: 'Perth', email: 'contact@accountantinperth.com.au', stage: 'SENT', score: 7, temp: 'HOT', discovery_date: '2026-04-20', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '6', name: 'Elevate Accounting', company: 'Elevate Accounting', industry: 'Accounting', location: 'Perth', email: 'shane@elevategroup.com.au', stage: 'SENT', score: 7, temp: 'HOT', discovery_date: '2026-04-20', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '7', name: 'Perth Central Dental Centre', company: 'Perth Central Dental Centre', industry: 'Dental', location: 'Perth', email: 'richard@perthdentalcentre.com.au', stage: 'SENT', score: 7, temp: 'HOT', discovery_date: '2026-04-20', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  // WARM
  { id: '8', name: 'Beyond Accountancy', company: 'Beyond Accountancy', industry: 'Accountant', location: 'Perth/Melbourne', email: 'info@beyondaccountancy.com.au', stage: 'SENT', score: 5, temp: 'WARM', pain_evidence: 'Admin burden, staying ahead of compliance (enriched 2026-04-29)', discovery_date: '2026-04-17', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '9', name: 'Professional Electricians Perth', company: 'Westline Electrical', industry: 'Electrician', location: 'Perth', email: 'info@westlineelectrical.com.au', phone: '(08) 9516 0001', stage: 'SENT', score: 5, temp: 'WARM', pain_evidence: '500+ 5-star Google reviews, family-owned 20+ years', discovery_date: '2026-04-16', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '10', name: 'Realestate 88', company: 'Realestate 88', industry: 'Real Estate', location: 'Perth', email: 'jwright@re88.com.au', stage: 'SENT', score: 5, temp: 'WARM', discovery_date: '2026-04-19', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  { id: '11', name: 'McKinley Plowman', company: 'McKinley Plowman', industry: 'Accountant', location: 'Perth', email: 'clientcare@mckinleyplowman.com.au', stage: 'SENT', score: 5, temp: 'WARM', discovery_date: '2026-04-20', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  // DISCOVERED (top prospects — 10/10)
  { id: '12', name: 'Aircon Express Perth', company: 'Aircon Express Perth', industry: 'Air Conditioning', location: 'East Victoria Park, Perth', email: 'sales@airconexpress.com.au', phone: '0400 123 456', stage: 'DISCOVERED', score: 10, temp: 'DISCOVERED', pain_evidence: '38 years local, East Vic Park, strong family-owned signals', discovery_date: '2026-04-20', last_updated: '2026-04-29' },
  { id: '13', name: 'Alpha Co Plumbing', company: 'Alpha Co Plumbing And Gas', industry: 'Plumbing', location: 'Perth CBD', email: 'info@alphacoplumbing.com.au', stage: 'DISCOVERED', score: 10, temp: 'DISCOVERED', pain_evidence: 'Est. 1999, Perth CBD, strong local signals', discovery_date: '2026-04-21', last_updated: '2026-04-29' },
  { id: '14', name: '3G Electrical', company: '3G Electrical', industry: 'Electrical', location: 'Ballajura, Perth', email: 'markgoldberg54@yahoo.com.au', phone: '0418 942 337', stage: 'SENT', score: 6, temp: 'DISCOVERED', pain_evidence: 'Family owned, 30+ years, 24/7 emergency', discovery_date: '2026-04-16', last_contact: '2026-04-16', last_updated: '2026-04-29' },
  { id: '15', name: 'BMD Plumbing and Gas', company: 'BMD Plumbing and Gas', industry: 'Plumbing', location: 'Belmont/Cloverdale', email: 'service@bmdplumbing.com.au', phone: '0415 422 005', stage: 'SENT', score: 6, temp: 'DISCOVERED', pain_evidence: 'Best New Business Award 2023, no call out fee, family owned', discovery_date: '2026-04-16', last_contact: '2026-04-16', last_updated: '2026-04-29' },
  { id: '16', name: 'Gilmour & Jooste Electrical', company: 'Gilmour & Jooste Electrical', industry: 'Electrical', location: 'Perth', email: 'info@gilmourandjoosteelectrical.com.au', stage: 'DISCOVERED', score: 6, temp: 'DISCOVERED', discovery_date: '2026-04-21', last_updated: '2026-04-29' },
  { id: '17', name: 'Ace Plumbing & Gas', company: 'Ace Plumbing & Gas Pty Ltd', industry: 'Plumbing', location: 'Perth', email: 'info@aceplumbing.com.au', stage: 'DISCOVERED', score: 6, temp: 'DISCOVERED', discovery_date: '2026-04-21', last_updated: '2026-04-29' },
  { id: '18', name: 'Irwin Electrical', company: 'Irwin Electrical Pty Ltd', industry: 'Electrical', location: 'Perth', email: 'info@wiseelectrical.com.au', stage: 'DISCOVERED', score: 6, temp: 'DISCOVERED', discovery_date: '2026-04-21', last_updated: '2026-04-29' },
  // RESEARCH
  { id: '19', name: 'West Coast Air', company: 'West Coast Air', industry: 'HVAC/Air Conditioning', location: 'Byford, Perth', email: 'admin@westcoastair.com.au', phone: '0488 998 215', stage: 'RESEARCH', score: 5, temp: 'DISCOVERED', pain_evidence: 'Local family owned, 20 years, south of river', discovery_date: '2026-04-16', last_updated: '2026-04-29' },
  // More SENT
  { id: '20', name: 'Air Conditioning Perth (DACS)', company: 'DACS Air Conditioning', industry: 'Air Conditioning', location: 'Como, Perth', email: 'info@dacsair.com.au', phone: '(08) 9313 4645', stage: 'SENT', score: 5, temp: 'WARM', pain_evidence: '28+ years Perth specialists, Daikin/Mitsubishi specialists', discovery_date: '2026-04-16', last_contact: '2026-04-24', last_updated: '2026-04-29' },
  // SKIP (bad fit)
  { id: '21', name: 'Edental Perth', company: 'Edental Perth', industry: 'Dental', location: 'Perth', email: 'info@edentalperth.net.au', stage: 'SKIP', score: 5, temp: 'DISCOVERED', notes: 'Multi-dentist practice — not owner-run. 5/10. Demoted 2026-04-29.', discovery_date: '2026-04-20', last_updated: '2026-04-29' },
  // Prospectors (no email yet — need outreach)
  { id: '22', name: 'The WA Carpentry Company', company: 'WA Carpentry Company', industry: 'Carpentry', location: 'Perth', stage: 'DISCOVERED', score: 5, temp: 'WARM', notes: 'Greg England, family-owned, 7 vans. No email — contact form only. Try phone/LinkedIn.', discovery_date: '2026-04-16', last_updated: '2026-04-29' },
  { id: '23', name: 'Air Con Repair Perth', company: 'Air Con Repair Perth', industry: 'Air Conditioning', location: 'Perth', email: 'info@acrepairperth.com.au', stage: 'DISCOVERED', score: 5, temp: 'DISCOVERED', discovery_date: '2026-04-21', last_updated: '2026-04-29' },
  { id: '24', name: 'Prosper Business & Property Broker', company: 'Prosper B&P', industry: 'Business Broker', location: 'Perth', email: 'prosper888@bigpond.com', stage: 'SENT', score: 4, temp: 'WARM', notes: 'Business broker — adjacent to SMB space. Might refer clients.', discovery_date: '2026-04-20', last_contact: '2026-04-24', last_updated: '2026-04-29' },
];

const STAGES: LeadStage[] = ['DISCOVERED', 'ENRICHED', 'SENT', 'REPLY', 'CALL', 'AUDIT', 'BUILD', 'DONE'];

const STAGE_COLORS: Record<string, string> = {
  DISCOVERED: 'bg-indigo-500',
  ENRICHED: 'bg-purple-500',
  SENT: 'bg-blue-500',
  REPLY: 'bg-cyan-500',
  CALL: 'bg-pink-500',
  AUDIT: 'bg-amber-500',
  BUILD: 'bg-emerald-500',
  DONE: 'bg-green-600',
  RESEARCH: 'bg-gray-600',
  SKIP: 'bg-gray-700',
};

const TEMP_COLORS: Record<string, string> = {
  HOT: 'bg-red-500',
  WARM: 'bg-orange-500',
  DISCOVERED: 'bg-blue-500',
};

function LeadCard({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-sm">{lead.company}</h3>
        {lead.temp && (
          <span className={`${TEMP_COLORS[lead.temp]} text-white text-xs px-1.5 py-0.5 rounded font-bold`}>
            {lead.temp}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs mb-2">{lead.industry} · {lead.location}</p>
      <div className="flex items-center justify-between">
        <span className={`${STAGE_COLORS[lead.stage] || 'bg-gray-600'} text-white text-xs px-2 py-0.5 rounded`}>
          {lead.stage}
        </span>
        {lead.score && (
          <span className="text-xs text-gray-500">Score: {lead.score}/10</span>
        )}
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 space-y-1.5 text-xs">
          {lead.email && <p className="text-gray-300">📧 {lead.email}</p>}
          {lead.phone && <p className="text-gray-300">📱 {lead.phone}</p>}
          {lead.pain_evidence && <p className="text-gray-400">💡 {lead.pain_evidence}</p>}
          {lead.notes && <p className="text-yellow-400">⚠️ {lead.notes}</p>}
          <p className="text-gray-600">Updated: {lead.last_updated}</p>
        </div>
      )}
    </div>
  );
}

function StageColumn({ stage, leads }: { stage: string; leads: Lead[] }) {
  return (
    <div className="flex-1 min-w-[200px]">
      <div className={`${STAGE_COLORS[stage] || 'bg-gray-600'} text-white text-center py-2 rounded-t-lg font-medium text-xs`}>
        {stage}
        <span className="ml-2 opacity-75">({leads.length})</span>
      </div>
      <div className="bg-gray-900 rounded-b-lg p-2 space-y-2 min-h-[120px]">
        {leads.length === 0 ? (
          <p className="text-gray-600 text-xs text-center py-6">—</p>
        ) : (
          leads.map(lead => <LeadCard key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [filter, setFilter] = useState<'all' | 'HOT' | 'WARM' | 'DISCOVERED' | 'SENT' | 'DISCOVERED_SENT'>('all');

  const filteredLeads = LEADS.filter(l => {
    if (filter === 'all') return l.stage !== 'SKIP';
    if (filter === 'HOT') return l.temp === 'HOT';
    if (filter === 'WARM') return l.temp === 'WARM';
    if (filter === 'DISCOVERED') return l.temp === 'DISCOVERED' || l.stage === 'DISCOVERED';
    if (filter === 'SENT') return l.stage === 'SENT';
    if (filter === 'DISCOVERED_SENT') return l.stage === 'DISCOVERED' || l.stage === 'SENT';
    return true;
  });

  const hotCount = LEADS.filter(l => l.temp === 'HOT').length;
  const warmCount = LEADS.filter(l => l.temp === 'WARM').length;
  const discoveredCount = LEADS.filter(l => l.temp === 'DISCOVERED' || l.stage === 'DISCOVERED').length;
  const sentCount = LEADS.filter(l => l.stage === 'SENT').length;
  const awaitingReplyCount = LEADS.filter(l => l.stage === 'SENT').length;

  const activeLeads = filteredLeads.filter(l => l.stage !== 'SKIP' && l.stage !== 'DONE');

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{hotCount}</div>
          <div className="text-xs text-gray-400">HOT</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">{warmCount}</div>
          <div className="text-xs text-gray-400">WARM</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{discoveredCount}</div>
          <div className="text-xs text-gray-400">DISCOVERED</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{sentCount}</div>
          <div className="text-xs text-gray-400">SENT</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all','HOT','WARM','DISCOVERED','SENT','DISCOVERED_SENT'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}>
            {f === 'all' ? 'All Active' : f === 'DISCOVERED_SENT' ? 'Top Prospects' : f}
          </button>
        ))}
      </div>

      {/* Pipeline — Top Prospects (DISCOVERED 10/10 + DISCOVERED + SENT HOT) */}
      {filter === 'all' && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <span className="text-red-400">🔴</span> Top Prospects (HOT + 10/10 DISCOVERED)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {LEADS.filter(l => l.score >= 7 || l.temp === 'HOT').map(l => (
              <LeadCard key={l.id} lead={l} />
            ))}
          </div>
        </div>
      )}

      {/* Kanban — All Active */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-2">Full Pipeline</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STAGES.map(stage => (
              <StageColumn 
                key={stage} 
                stage={stage} 
                leads={activeLeads.filter(l => l.stage === stage)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* ICP Note */}
      <div className="bg-gray-900 rounded-lg p-4 text-xs text-gray-500">
        <strong className="text-gray-400">ICP:</strong> 5+ years, multiple staff, actual pain evidence. 
        National scope — any SMB Australia. No email = ARCHIVED (not in active pipeline).
        Source of truth: Supabase <code className="bg-gray-800 px-1 rounded">leads</code> table.
      </div>
    </div>
  );
}
