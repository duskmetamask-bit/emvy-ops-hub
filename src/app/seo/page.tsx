'use client';

import { useState } from 'react';
import type { SeoChecklistItem, ContentPillar } from '@/lib/types';

const CHECKLIST_ITEMS: SeoChecklistItem[] = [
  // Domain
  { id: 'd1', task: 'Buy emvy.ai from Porkbun', category: 'domain', status: 'todo' },
  { id: 'd2', task: 'Point emvy.ai to Vercel (A record + CNAME)', category: 'domain', status: 'todo' },
  { id: 'd3', task: 'Add emvy.ai to Google Search Console (DNS TXT verification)', category: 'domain', status: 'todo' },
  { id: 'd4', task: 'Add emvyai.vercel.app to Google Search Console (HTML tag)', category: 'domain', status: 'todo' },
  { id: 'd5', task: 'Set up www.emvy.ai redirect to emvy.ai', category: 'domain', status: 'todo' },
  // Analytics
  { id: 'a1', task: 'GA4 on emvyai.vercel.app', category: 'analytics', status: 'todo' },
  { id: 'a2', task: 'Vercel Analytics enabled', category: 'analytics', status: 'todo' },
  { id: 'a3', task: 'Microsoft Clarity on emvyai.vercel.app', category: 'analytics', status: 'todo' },
  // Technical
  { id: 't1', task: 'Run PageSpeed Insights on emvyai.vercel.app', category: 'technical', status: 'todo' },
  { id: 't2', task: 'Fix any Core Web Vitals failures (LCP, FID, CLS)', category: 'technical', status: 'todo' },
  { id: 't3', task: 'Submit sitemap to Google Search Console (/sitemap.xml)', category: 'technical', status: 'todo' },
  // Content
  { id: 'c1', task: 'Set up Carrd ($19/yr) — lead magnet landing page', category: 'content', status: 'todo' },
  { id: 'c2', task: 'Create PDF lead magnet: "The AI Audit Checklist for Perth SMBs"', category: 'content', status: 'todo' },
  { id: 'c3', task: 'Set up email capture on Carrd (Tally or ConvertKit)', category: 'content', status: 'todo' },
  { id: 'c4', task: 'Create Carrd page: emvy.ai/audit-checklist', category: 'content', status: 'todo' },
  { id: 'c5', task: 'Build emvy-content-pipeline skill v2 (SEO research + Tavily + meta)', category: 'content', status: 'todo' },
];

const CONTENT_PILLARS: ContentPillar[] = [
  {
    id: 'p1',
    name: 'AI Tools Not Working',
    topics: [
      'Why your AI tools don\'t talk to each other',
      'The hidden cost of disconnected AI tools',
      'How to audit your AI stack in 30 minutes',
    ],
    priority: 'high',
    status: 'planned',
  },
  {
    id: 'p2',
    name: 'AI Phone Answering',
    topics: [
      'Why your AI phone agent is missing calls',
      'Why Botpress/VAPI isn\'t enough on its own',
      'The AI receptionist audit checklist',
    ],
    priority: 'high',
    status: 'planned',
  },
  {
    id: 'p3',
    name: 'AI for Small Business',
    topics: [
      'AI automation for Perth small business — what actually works',
      'The $500/mo vs $5,000/mo AI agency: what\'s the difference',
      'How much does an AI audit cost in Australia',
    ],
    priority: 'high',
    status: 'planned',
  },
  {
    id: 'p4',
    name: 'Case Studies + Results',
    topics: [
      'How [Industry] in Perth automated [problem]',
      'From [pain] to [result] — real EMVY client story',
    ],
    priority: 'medium',
    status: 'planned',
  },
];

const KEYWORD_OPPORTUNITIES = [
  { keyword: 'AI audit Perth', intent: 'Commercial', difficulty: 'Low', priority: 'high' },
  { keyword: 'AI automation agency Perth', intent: 'Commercial', difficulty: 'Low', priority: 'high' },
  { keyword: 'AI phone answering Perth', intent: 'Commercial', difficulty: 'Low', priority: 'high' },
  { keyword: 'small business AI tools not working', intent: 'Informational', difficulty: 'Low', priority: 'medium' },
  { keyword: 'automation audit small business', intent: 'Commercial', difficulty: 'Medium', priority: 'medium' },
  { keyword: 'AI consultant Perth', intent: 'Commercial', difficulty: 'Medium', priority: 'medium' },
  { keyword: 'how to automate my Perth business', intent: 'Informational', difficulty: 'Low', priority: 'medium' },
  { keyword: 'AI chatbot for small business Perth', intent: 'Commercial', difficulty: 'Low', priority: 'medium' },
];

const PHASE1_DONE = CHECKLIST_ITEMS.filter(i => i.status === 'done').length;
const PHASE1_TOTAL = CHECKLIST_ITEMS.length;

export default function SeoPage() {
  const [items, setItems] = useState(CHECKLIST_ITEMS);
  const [activeTab, setActiveTab] = useState<'checklist' | 'pillars' | 'keywords'>('checklist');

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'done' ? 'todo' : 'done' }
        : item
    ));
  };

  const categories = ['domain', 'analytics', 'technical', 'content'] as const;
  const categoryLabels = { domain: 'Domain', analytics: 'Analytics', technical: 'Technical', content: 'Content' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">SEO / Content</h2>
          <p className="text-sm text-gray-400 mt-1">
            Phase 1 Infrastructure — <span className="text-blue-400">{PHASE1_DONE}/{PHASE1_TOTAL} complete</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{Math.round((PHASE1_DONE/PHASE1_TOTAL)*100)}%</div>
          <div className="text-xs text-gray-500">Phase 1 Done</div>
        </div>
      </div>

      {/* Trigger Banner */}
      <div className="bg-amber-900 border border-amber-700 rounded-lg p-4 text-sm">
        <p className="text-amber-200 font-medium">Activation Trigger</p>
        <p className="text-amber-300 mt-1">Activate SEO when: 3+ consistent clients + outbound running without daily mgmt + calendar full</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['checklist','pillars','keywords'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}>
            {tab === 'pillars' ? 'Content Pillars' : tab === 'keywords' ? 'Keywords' : 'Phase 1 Checklist'}
          </button>
        ))}
      </div>

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            const catDone = catItems.filter(i => i.status === 'done').length;
            return (
              <div key={cat}>
                <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                  <span>{categoryLabels[cat]}</span>
                  <span className="text-gray-500 text-xs">{catDone}/{catItems.length}</span>
                </h3>
                <div className="space-y-1">
                  {catItems.map(item => (
                    <button key={item.id} onClick={() => toggleItem(item.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all flex items-center gap-3 ${
                        item.status === 'done' 
                          ? 'bg-gray-800 border-gray-700 opacity-60' 
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}>
                      <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                        item.status === 'done' ? 'bg-green-500 border-green-500' : 'border-gray-600'
                      }`}>
                        {item.status === 'done' && <span className="text-white text-xs">✓</span>}
                      </span>
                      <span className={`text-sm ${item.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                        {item.task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content Pillars Tab */}
      {activeTab === 'pillars' && (
        <div className="space-y-4">
          {CONTENT_PILLARS.map(pillar => (
            <div key={pillar.id} className="bg-gray-900 rounded-lg p-5 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{pillar.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      pillar.priority === 'high' ? 'bg-red-900 text-red-300' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {pillar.priority.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      pillar.status === 'published' ? 'bg-green-900 text-green-300' :
                      pillar.status === 'in_progress' ? 'bg-blue-900 text-blue-300' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {pillar.status}
                    </span>
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5">
                {pillar.topics.map((topic, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">→</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="px-4 py-3 font-medium">Keyword</th>
                <th className="px-4 py-3 font-medium">Intent</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="px-4 py-3 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {KEYWORD_OPPORTUNITIES.map((kw, i) => (
                <tr key={i} className="border-b border-gray-800 last:border-0">
                  <td className="px-4 py-3 text-gray-200 font-mono text-xs">{kw.keyword}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{kw.intent}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      kw.difficulty === 'Low' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>{kw.difficulty}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      kw.priority === 'high' ? 'bg-red-900 text-red-300' : 'bg-gray-700 text-gray-300'
                    }`}>{kw.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Distribution */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h3 className="font-medium text-gray-300 mb-3">Distribution (when active)</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <p className="text-gray-500">Free</p>
            <p className="text-gray-300">• LinkedIn (Dusk's personal profile)</p>
            <p className="text-gray-300">• Reddit (r/smallbusiness, r/entrepreneur)</p>
            <p className="text-gray-300">• Email warm pipeline leads</p>
            <p className="text-gray-300">• Google Business Profile</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Paid (when budget)</p>
            <p className="text-gray-300">• LinkedIn Sponsored $10-50/day</p>
            <p className="text-gray-300">• Google Ads $10-30/day</p>
            <p className="text-gray-300">• Perth business newsletters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
