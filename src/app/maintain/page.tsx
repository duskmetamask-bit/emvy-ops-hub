'use client';

export default function MaintainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Maintain</h1>
        <p className="text-gray-400 text-sm">Retainer · Ongoing · Support</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Retainer Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Monthly Retainer</span>
              <span className="text-white font-semibold">$1,500/month</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Included Hours</span>
              <span className="text-white">10–15 hrs/month</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Billing</span>
              <span className="text-white">Monthly advance</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Covers</span>
              <span className="text-white">Agent monitoring, tweaks, new automations</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Active Retainers</h2>
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No active retainers yet</p>
            <p className="text-xs text-gray-600 mt-1">Track retainer clients here once signed</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Process</h2>
          <div className="space-y-3">
            {[
              { step: '1', name: 'Handover', desc: 'Build complete → move client to retainer' },
              { step: '2', name: 'Monthly Check-in', desc: 'Review agent performance, log issues, plan additions' },
              { step: '3', name: 'Invoice', desc: 'Send invoice start of month, track in Supabase' },
              { step: '4', name: 'Renew / Exit', desc: 'Review quarterly — renew or transition off' },
            ].map(s => (
              <div key={s.step} className="flex gap-4 p-3 bg-gray-800 rounded-lg">
                <span className="w-7 h-7 bg-green-600 text-white text-sm rounded-full flex items-center justify-center shrink-0">{s.step}</span>
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
