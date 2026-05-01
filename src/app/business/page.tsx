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
  notes?: string;
}

const DOMAINS = [
  { name: 'emvy.ai', registrar: 'Porkbun', status: 'pending', note: 'Purchased — DNS setup pending' },
  { name: 'emvyops.com', registrar: 'Unknown', status: 'pending', note: 'Transfer in progress' },
];

const GRANTS = [
  { name: 'Frontier Tech Grant (AWS/Google)', status: 'not_applied', amount: '$5k–$50k' },
  { name: 'Export Market Development Grant', status: 'not_applied', amount: 'Up to 50% of costs' },
  { name: 'R&D Tax Incentive', status: 'not_applied', amount: '18.5–38.5%' },
];

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
    <div className="space-y-6 fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Business</h1>
        <p className="page-subtitle">Entities · Domains · Grants</p>
      </div>

      {/* Business Entities */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title" style={{ marginBottom: 0 }}>Business Entities</div>
          <span className="badge" style={{ background: '#6366f120', color: '#6366f1', border: '1px solid #6366f130' }}>
            {entities.length} entities
          </span>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}
          </div>
        ) : entities.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-sm">
            No entities yet — add to business_entities table in Supabase
          </div>
        ) : (
          <div className="space-y-2">
            {entities.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{e.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {e.type} · {e.status}
                    {e.abn && ` · ABN ${e.abn}`}
                    {e.incorporated && ` · Inc. ${e.incorporated}`}
                  </p>
                  {e.notes && <p className="text-xs text-[var(--text-muted)] mt-0.5">{e.notes}</p>}
                </div>
                <span className="badge" style={{ background: '#6366f120', color: '#6366f1', border: '1px solid #6366f130' }}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Domains */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title" style={{ marginBottom: 0 }}>Owned Domains</div>
          <span className="badge" style={{ background: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b30' }}>
            1 pending
          </span>
        </div>
        <div className="space-y-2">
          {DOMAINS.map(d => (
            <div key={d.name} className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{d.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{d.registrar} · {d.note}</p>
              </div>
              <span className="badge" style={{
                background: d.status === 'live' ? '#10b98120' : '#f59e0b20',
                color: d.status === 'live' ? '#10b981' : '#f59e0b',
                border: d.status === 'live' ? '#10b98130' : '#f59e0b30',
              }}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grants */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title" style={{ marginBottom: 0 }}>Grant Opportunities</div>
        </div>
        <div className="space-y-2">
          {GRANTS.map(g => (
            <div key={g.name} className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{g.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{g.amount}</p>
              </div>
              <span className="badge" style={{ background: '#52525b20', color: '#52525b', border: '1px solid #27272a' }}>
                Not applied
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
