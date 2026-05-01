'use client';

import type { PriorityAction, Blocker } from '@/lib/types';

const ACTIONS: PriorityAction[] = [
  // URGENT
  {
    id: 'a1',
    action: 'Review Dicandilo Thomson (HOT lead) — search for pain evidence, draft outreach email',
    reason: 'Top HOT lead — Matt Dicandilo, Chartered Accountant, Burswood. Score 7/10. Awaiting reply.',
    priority: 'urgent',
    source: 'vault/daily/2026-04-29.md',
    due_date: '2026-04-30',
  },
  {
    id: 'a2',
    action: 'Review Aircon Express Perth + Alpha Co Plumbing (DISCOVERED 10/10)',
    reason: 'Both 10/10 prospects — 38 years and est. 1999. Need review before staging.',
    priority: 'urgent',
    source: 'vault/daily/2026-04-29.md',
    due_date: '2026-04-30',
  },
  // HIGH
  {
    id: 'a3',
    action: 'Fix Lead Finder cron → write to Supabase instead of pipeline.json',
    reason: 'Cron is disconnected from live Supabase dashboard. 24 leads are in leads table, cron writes elsewhere.',
    priority: 'high',
    source: 'vault/daily/2026-04-29.md',
  },
  {
    id: 'a4',
    action: 'Buy emvy.ai from Porkbun',
    reason: 'Domain purchase is blocking: Search Console verification, site ownership proof, email setup, Carrd',
    priority: 'high',
    source: 'vault/emvy-content-seo-playbook.md',
  },
  {
    id: 'a5',
    action: 'Set up GA4 on emvyai.vercel.app',
    reason: 'Need G-XXXXXXXXXX measurement ID. Required for SEO measurement.',
    priority: 'high',
    source: 'vault/emvy-content-seo-playbook.md',
  },
  // MEDIUM
  {
    id: 'a6',
    action: 'Wait for replies from 11 SENT leads',
    reason: '12 HOT/WARM leads emailed Apr 24. Reply Detector cron running 9/11/1/3/5PM Mon-Fri.',
    priority: 'medium',
    source: 'vault/daily/2026-04-29.md',
  },
  {
    id: 'a7',
    action: 'Get Supabase anon JWT key — dashboard write access needed',
    reason: 'Dashboard can read but not write. Need eyJ... anon key from Vercel env vars.',
    priority: 'medium',
    source: 'This session',
  },
  {
    id: 'a8',
    action: 'Build out Ops Hub /leads page with live Supabase data',
    reason: '24 leads are in Supabase. Dashboard should query leads table directly.',
    priority: 'medium',
    source: 'This session',
  },
];

const BLOCKERS: Blocker[] = [
  { id: 'b1', item: 'emvy.ai domain', type: 'domain', status: 'waiting_on_dusk', notes: 'Buy from Porkbun tonight' },
  { id: 'b2', item: 'Exa API key (fallback search)', type: 'api', status: 'waiting_on_external', notes: 'Optional — manual enrich works for now' },
  { id: 'b3', item: 'Hunter API key', type: 'api', status: 'waiting_on_external', notes: '$49/mo — optional' },
  { id: 'b4', item: 'Lead Finder → Supabase sync', type: 'integration', status: 'in_progress', notes: 'Cron writes to pipeline.json, disconnected from Supabase' },
  { id: 'b5', item: 'GA4 on site', type: 'analytics', status: 'waiting_on_dusk', notes: 'Need G-XXXXXXXXXX measurement ID' },
  { id: 'b6', item: 'Supabase anon JWT key', type: 'integration', status: 'waiting_on_dusk', notes: 'Dashboard write access. Stored in Vercel env vars.' },
];

const OFFER = [
  { tier: 'Lead', desc: 'Free 15-min discovery call' },
  { tier: 'Audit', desc: '$1,500 AI audit' },
  { tier: 'Build', desc: '$3,000–$5,000' },
  { tier: 'Retainer', desc: '$1,500/month' },
];

export default function ActionsPage() {
  const urgent = ACTIONS.filter(a => a.priority === 'urgent');
  const high = ACTIONS.filter(a => a.priority === 'high');
  const medium = ACTIONS.filter(a => a.priority === 'medium');
  const blockersWaitingDusk = BLOCKERS.filter(b => b.status === 'waiting_on_dusk').length;
  const blockersWaitingExt = BLOCKERS.filter(b => b.status === 'waiting_on_external').length;

  return (
    <div className="space-y-6">
      {/* Business Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{urgent.length}</div>
          <div className="text-xs text-gray-400">Urgent</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">{high.length}</div>
          <div className="text-xs text-gray-400">High</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{blockersWaitingDusk}</div>
          <div className="text-xs text-gray-400">Waiting You</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-500">{blockersWaitingExt}</div>
          <div className="text-xs text-gray-400">Waiting Ext.</div>
        </div>
      </div>

      {/* Offer Stack */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-3">EMVY Offer Stack</h3>
        <div className="grid grid-cols-4 gap-3">
          {OFFER.map(o => (
            <div key={o.tier} className="text-center">
              <div className="font-bold text-sm">{o.tier}</div>
              <div className="text-xs text-gray-400">{o.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700 text-center">
          <a href="https://cal.com/jake-emvy/15-min-ai-chat" target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            ↗ Book discovery call → cal.com/jake-emvy/15-min-ai-chat
          </a>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Pipeline Snapshot</h3>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div><div className="text-lg font-bold text-red-400">1</div><div className="text-gray-500">HOT</div></div>
          <div><div className="text-lg font-bold text-orange-400">4</div><div className="text-gray-500">WARM</div></div>
          <div><div className="text-lg font-bold text-indigo-400">9</div><div className="text-gray-500">DISCOVERED</div></div>
          <div><div className="text-lg font-bold text-blue-400">11</div><div className="text-gray-500">SENT</div></div>
          <div><div className="text-lg font-bold text-gray-400">9</div><div className="text-gray-500">SKIP</div></div>
        </div>
      </div>

      {/* Urgent Actions */}
      {urgent.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            URGENT — Do Today
          </h2>
          <div className="space-y-2">
            {urgent.map(action => (
              <div key={action.id} className="bg-red-950 border border-red-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-red-200">{action.action}</h3>
                    <p className="text-xs text-red-300 mt-1">{action.reason}</p>
                    <p className="text-xs text-red-400 mt-1 opacity-70">Source: {action.source}</p>
                  </div>
                  {action.due_date && (
                    <span className="text-xs text-red-400 bg-red-900 px-2 py-0.5 rounded whitespace-nowrap">
                      {action.due_date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High Priority */}
      {high.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-orange-400 mb-3">High Priority</h2>
          <div className="space-y-2">
            {high.map(action => (
              <div key={action.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-sm text-gray-200">{action.action}</h3>
                <p className="text-xs text-gray-400 mt-1">{action.reason}</p>
                <p className="text-xs text-gray-600 mt-1">Source: {action.source}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority */}
      {medium.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">Medium Priority</h2>
          <div className="space-y-2">
            {medium.map(action => (
              <div key={action.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                <h3 className="font-medium text-sm text-gray-300">{action.action}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockers from Dusk */}
      {BLOCKERS.filter(b => b.status === 'waiting_on_dusk').length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">Waiting on You</h2>
          <div className="space-y-2">
            {BLOCKERS.filter(b => b.status === 'waiting_on_dusk').map(blocker => (
              <div key={blocker.id} className="bg-red-950 border border-red-800 rounded-lg p-3">
                <h3 className="font-medium text-sm text-red-200">{blocker.item}</h3>
                <p className="text-xs text-red-300 mt-0.5">{blocker.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ICP Reminder */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-xs text-gray-500">
        <strong className="text-gray-400">ICP:</strong> 5+ years, multiple staff, actual pain evidence. 
        National scope — any SMB Australia. No email = archived. Enrichment = gate before staging.
        Hot leads: Dicandilo Thomson (7/10), Aircon Express Perth (10/10), Alpha Co Plumbing (10/10).
      </div>
    </div>
  );
}
