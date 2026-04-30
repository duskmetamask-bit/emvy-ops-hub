'use client';

import { useEffect, useState } from 'react';

interface Process {
  id: string;
  name: string;
  description: string;
  status: string;
  owner: string;
}

interface System {
  id: string;
  name: string;
  type: string;
  status: string;
  purpose: string;
}

interface ApiIntegration {
  id: string;
  name: string;
  status: string;
  purpose: string;
}

export default function OperatingPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [apis, setApis] = useState<ApiIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) { setLoading(false); return; }

    Promise.all([
      fetch(`${url}/rest/v1/processes?select=*&order=name.asc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } }).then(r => r.json()),
      fetch(`${url}/rest/v1/systems?select=*&order=name.asc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } }).then(r => r.json()),
      fetch(`${url}/rest/v1/api_integrations?select=*&order=name.asc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } }).then(r => r.json()),
    ])
      .then(([p, s, a]) => {
        setProcesses(p || []);
        setSystems(s || []);
        setApis(a || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Operating Structure</h1>
        <p className="text-gray-400 text-sm">Processes · Systems · APIs</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Processes</h2>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{processes.length} tracked</span>
          </div>
          {loading ? <p className="text-gray-500">Loading...</p> : processes.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No processes yet — add to processes table in Supabase</p>
          ) : (
            <div className="space-y-2">
              {processes.map(p => (
                <div key={p.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div><p className="text-white font-medium">{p.name}</p><p className="text-gray-400 text-xs">{p.description}</p></div>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded shrink-0 ml-2">{p.status}</span>
                  </div>
                  {p.owner && <p className="text-gray-500 text-xs mt-1">Owner: {p.owner}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Systems</h2>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{systems.length} active</span>
          </div>
          {loading ? <p className="text-gray-500">Loading...</p> : systems.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No systems yet — add to systems table in Supabase</p>
          ) : (
            <div className="space-y-2">
              {systems.map(s => (
                <div key={s.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div><p className="text-white font-medium">{s.name}</p><p className="text-gray-400 text-xs">{s.type} · {s.purpose}</p></div>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded shrink-0 ml-2">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">API Integrations</h2>
            <a href="/apis" className="text-xs text-blue-400 hover:text-blue-300">View all APIs →</a>
          </div>
          {loading ? <p className="text-gray-500">Loading...</p> : apis.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No API integrations tracked — see /apis for full list</p>
          ) : (
            <div className="space-y-2">
              {apis.map(a => (
                <div key={a.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div><p className="text-white font-medium">{a.name}</p><p className="text-gray-400 text-xs">{a.purpose}</p></div>
                    <span className={`text-xs px-2 py-0.5 rounded shrink-0 ml-2 ${a.status === 'live' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
