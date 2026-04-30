'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BusinessEntity {
  id: string;
  name: string;
  type: string;
  abn?: string;
  incorporated?: string;
  status: string;
}

export default function BusinessPage() {
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('business_entities').select('*').order('name', { ascending: true });
        setEntities(data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Business Structure</h1>
        <p className="text-gray-400 text-sm">Entities · Domains · Grants</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Entities</h2>
            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">{entities.length} active</span>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : entities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">No entities yet</p>
              <p className="text-gray-600 text-sm">Add via Supabase — business_entities table</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entities.map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{e.name}</p>
                    <p className="text-gray-400 text-sm">{e.type} · {e.status}</p>
                  </div>
                  {e.abn && <span className="text-gray-500 text-sm">ABN {e.abn}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Domains</h2>
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">emvy.ai — purchased tonight</p>
            <p className="text-xs text-gray-600 mt-1">Add domains to domains table via Supabase</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Grants</h2>
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">Grant applications tracked here</p>
            <p className="text-xs text-gray-600 mt-1">Add to grant_applications table via Supabase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
