'use client';

import type { InfrastructureItem, Blocker } from '@/lib/types';

const INFRA: InfrastructureItem[] = [
  // Domain
  { id: 'i1', name: 'emvy.ai', category: 'domain', status: 'needed', cost: '~$50/yr', notes: 'Buy from Porkbun tonight' },
  // Website
  { id: 'i2', name: 'emvyai.vercel.app', category: 'website', status: 'live', url: 'https://emvyai.vercel.app' },
  { id: 'i3', name: 'emvy.ai → Vercel redirect', category: 'website', status: 'blocked', notes: 'Waiting on emvy.ai domain' },
  // Analytics
  { id: 'i4', name: 'GA4', category: 'analytics', status: 'needed' },
  { id: 'i5', name: 'Vercel Analytics', category: 'analytics', status: 'needed', notes: 'Free in Vercel dashboard' },
  { id: 'i6', name: 'Microsoft Clarity', category: 'analytics', status: 'needed' },
  // CRM / Outreach
  { id: 'i7', name: 'Supabase (leads + data)', category: 'crm', status: 'live', url: 'https://supabase.com/dashboard' },
  { id: 'i8', name: 'Gmail SMTP (outreach)', category: 'outreach', status: 'live', notes: 'dawnlabsai@gmail.com' },
  { id: 'i9', name: 'CAL.com (booking)', category: 'outreach', status: 'live', url: 'https://cal.com/jake-emvy/15-min-ai-chat' },
  { id: 'i10', name: 'VAPI (Callie voice)', category: 'outreach', status: 'live' },
  { id: 'i11', name: 'X API', category: 'outreach', status: 'live' },
];

const BLOCKERS: Blocker[] = [
  { id: 'b1', item: 'emvy.ai domain', type: 'domain', status: 'waiting_on_dusk', notes: 'Buy from Porkbun tonight' },
  { id: 'b2', item: 'Exa API key', type: 'api', status: 'waiting_on_external', notes: 'Fallback search — optional' },
  { id: 'b3', item: 'Hunter API key', type: 'api', status: 'waiting_on_external', notes: '$49/mo — optional, manual enrich works for now' },
  { id: 'b4', item: 'Lead Finder → Supabase sync', type: 'integration', status: 'in_progress', notes: 'Cron writes to pipeline.json, not Supabase. Needs fixing.' },
  { id: 'b5', item: 'GA4 on site', type: 'analytics', status: 'waiting_on_dusk', notes: 'Need G-XXXXXXXXXX measurement ID' },
  { id: 'b6', item: 'Ops Hub → Supabase write', type: 'integration', status: 'in_progress', notes: 'Dashboard read-only. Need anon JWT key.' },
];

const STATUS_COLORS: Record<string, string> = {
  live: 'text-green-400 bg-green-500 bg-opacity-20',
  in_progress: 'text-blue-400 bg-blue-500 bg-opacity-20',
  needed: 'text-yellow-400 bg-yellow-500 bg-opacity-20',
  blocked: 'text-red-400 bg-red-500 bg-opacity-20',
};

const STATUS_LABELS: Record<string, string> = {
  live: '✅ Live',
  in_progress: '🔄 In Progress',
  needed: '⏳ Needed',
  blocked: '🚫 Blocked',
};

export default function InfrastructurePage() {
  const liveCount = INFRA.filter(i => i.status === 'live').length;
  const blockerCount = BLOCKERS.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{liveCount}</div>
          <div className="text-xs text-gray-400">Live</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{INFRA.filter(i => i.status === 'needed').length}</div>
          <div className="text-xs text-gray-400">Needed</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{blockerCount}</div>
          <div className="text-xs text-gray-400">Blockers</div>
        </div>
      </div>

      {/* Live Infrastructure */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">🖥️ Infrastructure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INFRA.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="capitalize">{item.category}</span>
                {item.cost && <span>· {item.cost}</span>}
              </div>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block">
                  ↗ {item.url.replace('https://','')}
                </a>
              )}
              {item.notes && <p className="text-xs text-gray-500 mt-1">{item.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Blockers */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">🚧 Blockers</h2>
        <div className="space-y-2">
          {BLOCKERS.map(blocker => (
            <div key={blocker.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-sm">{blocker.item}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      blocker.status === 'waiting_on_dusk' ? 'bg-red-900 text-red-300' :
                      blocker.status === 'waiting_on_external' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {blocker.status.replace(/_/g, ' ')}
                    </span>
                    <span className="ml-2 capitalize">{blocker.type}</span>
                  </p>
                  {blocker.notes && <p className="text-xs text-gray-400 mt-1">{blocker.notes}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cron Jobs */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">⏰ Active Crons (7)</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="px-3 py-2 font-medium">Job</th>
                <th className="px-3 py-2 font-medium">Schedule</th>
                <th className="px-3 py-2 font-medium">Last Run</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="px-3 py-2">AI Opportunities Research</td>
                <td className="px-3 py-2 text-gray-500">Midnight daily</td>
                <td className="px-3 py-2 text-gray-500">—</td>
                <td className="px-3 py-2"><span className="text-green-400">Active</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-3 py-2">Lead Finder</td>
                <td className="px-3 py-2 text-gray-500">9AM Mon-Thu</td>
                <td className="px-3 py-2 text-gray-500">2026-04-29 09:19</td>
                <td className="px-3 py-2"><span className="text-green-400">OK</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-3 py-2">Content Pipeline</td>
                <td className="px-3 py-2 text-gray-500">8AM Mon-Fri</td>
                <td className="px-3 py-2 text-gray-500">—</td>
                <td className="px-3 py-2"><span className="text-green-400">Active</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-3 py-2">Competitor Intelligence</td>
                <td className="px-3 py-2 text-gray-500">9AM daily</td>
                <td className="px-3 py-2 text-gray-500">2026-04-29 11:43</td>
                <td className="px-3 py-2"><span className="text-green-400">OK</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-3 py-2">Reply Detector</td>
                <td className="px-3 py-2 text-gray-500">9/11/1/3/5PM M-F</td>
                <td className="px-3 py-2 text-gray-500">2026-04-29 17:02</td>
                <td className="px-3 py-2"><span className="text-green-400">OK</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-3 py-2">Pipeline Health</td>
                <td className="px-3 py-2 text-gray-500">8AM Mondays</td>
                <td className="px-3 py-2 text-gray-500">—</td>
                <td className="px-3 py-2"><span className="text-green-400">Active</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-3 py-2">Session Snapshot</td>
                <td className="px-3 py-2 text-gray-500">Every 30 min</td>
                <td className="px-3 py-2 text-gray-500">2026-04-29 21:00</td>
                <td className="px-3 py-2"><span className="text-green-400">OK</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* API Keys / Credentials */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">🔐 Credentials Status</h2>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Gmail SMTP</span>
            <span className="text-green-400">✅ Live (dawnlabsai@gmail.com)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">CAL API</span>
            <span className="text-green-400">✅ Live</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">VAPI (Callie)</span>
            <span className="text-green-400">✅ Live</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">X API</span>
            <span className="text-green-400">✅ Live</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">NVIDIA API</span>
            <span className="text-green-400">✅ Live</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Supabase</span>
            <span className="text-yellow-400">⚠️ Read-only (anon key missing)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
