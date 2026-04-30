'use client';

import { useEffect, useState } from 'react';

export default function AuditPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Audit</h1>
        <p className="text-gray-400 text-sm">Discovery · AI Audit · Deliverables</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Price</span>
              <span className="text-white font-semibold">$1,500</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Deliverable</span>
              <span className="text-white">PDF AI Audit Report</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Duration</span>
              <span className="text-white">2–3 days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Intake</span>
              <span className="text-white">Discovery call via Callie (VAPI)</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Deliverables</h2>
          <div className="space-y-2">
            {['AI Opportunity Map', 'Process Pain Points', 'Quick Wins', 'Tool Recommendations', 'ROI Estimate', 'Implementation Roadmap'].map(d => (
              <div key={d} className="p-3 bg-gray-800 rounded-lg text-gray-300 text-sm">{d}</div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Process</h2>
          <div className="space-y-3">
            {[
              { step: '1', name: 'Discovery Call', desc: 'Callie (VAPI) books and runs 15-min discovery call' },
              { step: '2', name: 'Transcript → Notes', desc: 'Call notes + transcript snippet stored in Supabase (call_notes table)' },
              { step: '3', name: 'Audit Report Generated', desc: 'Report generated from call data, stored in audit_reports table' },
              { step: '4', name: 'Send to Client', desc: 'MEWY drafts email, Dusk reviews and sends PDF report' },
            ].map(s => (
              <div key={s.step} className="flex gap-4 p-3 bg-gray-800 rounded-lg">
                <span className="w-7 h-7 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center shrink-0">{s.step}</span>
                <div>
                  <p className="text-white font-medium">{s.name}</p>
                  <p className="text-gray-400 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
