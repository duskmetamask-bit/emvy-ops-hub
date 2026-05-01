'use client';

import { useEffect, useState } from 'react';

const PLATFORM_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: 'in' },
  x:        { label: 'X / Twitter', color: '#e7e7e7', icon: 'x' },
  youtube:  { label: 'YouTube', color: '#ef4444', icon: 'yt' },
  substack: { label: 'Substack', color: '#ff671d', icon: 'sub' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  draft:             { label: 'Draft',             color: '#6366f1', bg: 'bg-indigo-500/20', dot: '#6366f1' },
  approved:          { label: 'Approved',           color: '#10b981', bg: 'bg-emerald-500/20', dot: '#10b981' },
  posted:            { label: 'Posted',              color: '#22c55e', bg: 'bg-green-500/20', dot: '#22c55e' },
  feedback_received: { label: 'Needs Work',         color: '#f59e0b', bg: 'bg-amber-500/20', dot: '#f59e0b' },
};

const FEEDBACK_TYPES = [
  { value: 'general',  label: 'General feedback' },
  { value: 'tone',     label: 'Tone — too formal / casual' },
  { value: 'angle',    label: 'Angle — wrong hook' },
  { value: 'length',   label: 'Length — too long / short' },
  { value: 'approve',  label: 'Approved — looks good' },
];

interface ContentItem {
  id: string;
  platform: string;
  content_type: string;
  content_text: string;
  scheduled_date: string;
  status: string;
  week_slug: string;
  created_at: string;
  feedback?: Array<{ id: string; feedback_text: string; feedback_type: string; created_at: string }>;
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [feedbackType, setFeedbackType] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [dateFilter, setDateFilter] = useState(() => new Date().toISOString().split('T')[0]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('platform', activeTab);
      const { data } = await (await fetch(`/api/content?${params}`)).json();
      setItems(data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { loadItems(); }, [activeTab]);

  const saveFeedback = async (item: ContentItem) => {
    const text = feedbackText[item.id]?.trim();
    if (!text) return;
    setSaving(prev => ({ ...prev, [item.id]: true }));
    try {
      await fetch(`/api/content/${item.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback_text: text, feedback_type: feedbackType[item.id] || 'general' }),
      });
      setSaved(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [item.id]: false })), 2000);
      setFeedbackText(prev => ({ ...prev, [item.id]: '' }));
      loadItems();
    } catch { /* silent */ }
    setSaving(prev => ({ ...prev, [item.id]: false }));
  };

  const approveItem = async (item: ContentItem) => {
    await fetch(`/api/content/${item.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback_text: 'Approved', feedback_type: 'approve' }),
    });
    await fetch(`/api/content/${item.id}/feedback`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    loadItems();
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'x', label: 'X' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'substack', label: 'Substack' },
  ];

  const filteredItems = items.filter(i => activeTab === 'all' || i.platform === activeTab);

  const byPlatform = Object.keys(PLATFORM_CONFIG).reduce((acc, p) => {
    acc[p] = filteredItems.filter(i => i.platform === p);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'Australia/Perth',
  });

  const activePlatforms = Object.entries(byPlatform).filter(([, v]) => v.length > 0);

  return (
    <div className="flex flex-col h-full -m-6">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] shrink-0"
        style={{ background: 'linear-gradient(90deg, rgba(236,72,153,0.03) 0%, transparent 50%)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)]">Content Board</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`tab-pill ${activeTab === tab.id ? 'active' : 'tab-pill-subtle'}`}>
                {tab.label}
                {tab.id !== 'all' && filteredItems.filter(i => i.platform === tab.id).length > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    ({filteredItems.filter(i => i.platform === tab.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          Crons fire at 8 AM daily — drafts appear here first
        </div>
      </div>

      {/* Content grid */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-48 rounded-xl" />
            ))}
          </div>
        ) : activePlatforms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
            <div className="text-5xl mb-4 opacity-20">▥</div>
            <p className="text-base font-semibold">No content yet</p>
            <p className="text-sm mt-1 opacity-60">Crons fire tomorrow at 8 AM</p>
            <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-xs text-center text-[var(--text-muted)]">
                Content crons: LinkedIn + X daily (8 AM),<br />
                YouTube scripts Mon + Thu, Substack Fri
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {activePlatforms.map(([platform, platformItems]) => {
              const cfg = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
              return (
                <div key={platform} className="platform-card">

                  {/* Platform header */}
                  <div className="platform-header">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}40`, color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{cfg.label}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{platformItems.length} item{platformItems.length !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="flex gap-1.5">
                      {(['draft','approved','posted'] as const).map(s => {
                        const sc = STATUS_CONFIG[s];
                        const count = platformItems.filter(i => i.status === s).length;
                        if (count === 0) return null;
                        return (
                          <div key={s} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold"
                            style={{ background: sc.bg, color: sc.color }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                            {count}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[var(--border)]">
                    {platformItems.map(item => {
                      const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;
                      const isExpanded = expanded[item.id];
                      const text = item.content_text;
                      const truncated = text.length > 280;
                      const displayText = isExpanded || !truncated ? text : text.slice(0, 280) + '...';

                      return (
                        <div key={item.id} className="p-4">
                          {/* Item header */}
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                style={{ background: statusCfg.bg, color: statusCfg.color }}>
                                {statusCfg.label}
                              </span>
                              <span className="text-[11px] text-[var(--text-muted)] capitalize">{item.content_type}</span>
                              <span className="text-[11px] text-[var(--text-muted)] font-mono">{item.scheduled_date}</span>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              {item.status !== 'approved' && item.status !== 'posted' && (
                                <button
                                  onClick={() => approveItem(item)}
                                  className="text-[10px] px-3 py-1 rounded-lg font-semibold transition-all"
                                  style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                                  Approve
                                </button>
                              )}
                              {truncated && (
                                <button
                                  onClick={() => setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                  className="text-[10px] px-3 py-1 rounded-lg font-medium text-[var(--text-muted)]"
                                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                  {isExpanded ? 'Show less' : 'Read more'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Content text */}
                          <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap"
                            style={{ fontFamily: 'inherit' }}>
                            {displayText}
                          </div>

                          {/* Existing feedback */}
                          {item.feedback && item.feedback.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {item.feedback.map(fb => (
                                <div key={fb.id} className="text-xs p-3 rounded-lg"
                                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                                    <span className="font-semibold text-[#f59e0b] capitalize">{fb.feedback_type}</span>
                                    <span className="text-[var(--text-muted)]">·</span>
                                    <span className="text-[var(--text-muted)]">
                                      {new Date(fb.created_at).toLocaleString('en-AU', {
                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                        timeZone: 'Australia/Perth',
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-[var(--text-secondary)]">{fb.feedback_text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Feedback form */}
                          {item.status !== 'posted' && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                              <textarea
                                value={feedbackText[item.id] || ''}
                                onChange={e => setFeedbackText(prev => ({ ...prev, [item.id]: e.target.value }))}
                                placeholder="Leave feedback... tone, angle, what's good, what to change"
                                rows={2}
                                className="w-full text-xs px-3 py-2 rounded-lg border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
                              />
                              <div className="flex items-center justify-between gap-2 mt-2">
                                <select
                                  value={feedbackType[item.id] || 'general'}
                                  onChange={e => setFeedbackType(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="text-xs px-2 py-1.5 rounded-lg border text-[var(--text-secondary)]"
                                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                                  {FEEDBACK_TYPES.map(ft => (
                                    <option key={ft.value} value={ft.value}>{ft.label}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => saveFeedback(item)}
                                  disabled={saving[item.id] || !feedbackText[item.id]?.trim()}
                                  className="text-xs px-4 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-40"
                                  style={{ background: saved[item.id] ? '#10b981' : 'var(--accent-blue)', color: '#fff' }}>
                                  {saving[item.id] ? 'Saving...' : saved[item.id] ? 'Saved!' : 'Save Feedback'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
