'use client';

import { useEffect, useState } from 'react';

const PLATFORM_CONFIG = {
  linkedin: { label: 'LinkedIn', color: '#0A66C2', bg: 'bg-[#0A66C2]/10', emoji: 'in' },
  x: { label: 'X / Twitter', color: '#e7e7e7', bg: 'bg-white/10', emoji: 'x' },
  youtube: { label: 'YouTube', color: '#ef4444', bg: 'bg-red-500/10', emoji: 'yt' },
  substack: { label: 'Substack', color: '#ff671d', bg: 'bg-orange-500/10', emoji: 'sub' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft:              { label: 'Draft',              color: '#6366f1', bg: 'bg-indigo-500/20 text-indigo-400' },
  approved:           { label: 'Approved',           color: '#10b981', bg: 'bg-emerald-500/20 text-emerald-400' },
  posted:             { label: 'Posted',             color: '#22c55e', bg: 'bg-green-500/20 text-green-400' },
  feedback_received:  { label: 'Feedback Received',  color: '#f59e0b', bg: 'bg-amber-500/20 text-amber-400' },
};

const FEEDBACK_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'tone', label: 'Tone — too formal / too casual' },
  { value: 'angle', label: 'Angle — wrong hook or direction' },
  { value: 'approve', label: 'Approved — looks good' },
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

interface NewContentItem {
  id: string;
  platform: string;
  content_type: string;
  content_text: string;
  scheduled_date: string;
  status: string;
  week_slug: string;
  created_at: string;
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [feedbackType, setFeedbackType] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean> >({});
  const [dateFilter, setDateFilter] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('platform', activeTab);
      if (dateFilter) params.set('date', dateFilter);
      const { data } = await (await fetch(`/api/content?${params}`)).json();
      setItems(data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { loadItems(); }, [activeTab, dateFilter]);

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

  const filteredItems = items.filter(i => {
    if (activeTab !== 'all' && i.platform !== activeTab) return false;
    if (dateFilter && i.scheduled_date !== dateFilter) return false;
    return true;
  });

  const byPlatform = Object.keys(PLATFORM_CONFIG).reduce((acc, p) => {
    acc[p] = filteredItems.filter(i => i.platform === p);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'x', label: 'X' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'substack', label: 'Substack' },
  ];

  return (
    <div className="flex flex-col h-full -m-6">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)]">Content</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} · {dateFilter === new Date().toISOString().split('T')[0] ? 'Today' : dateFilter}
            </p>
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
        </div>
        {/* Tabs */}
        <div className="flex gap-1.5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                borderColor: activeTab === tab.id ? 'var(--border)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 w-full rounded-xl" />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[var(--text-muted)]">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm font-medium">No content yet</p>
            <p className="text-xs mt-1">Content crons run daily — drafts appear here after they fire</p>
          </div>
        ) : (
          Object.entries(byPlatform).filter(([, v]) => v.length > 0).map(([platform, platformItems]) => {
            const cfg = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
            return (
              <div key={platform}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">{cfg.label}</h2>
                  <span className="text-xs text-[var(--text-muted)]">{platformItems.length} item{platformItems.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-3">
                  {platformItems.map(item => {
                    const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;
                    return (
                      <div key={item.id} className="card p-4 space-y-3">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`badge text-xs ${statusCfg.bg}`}>{statusCfg.label}</span>
                            <span className="text-xs text-[var(--text-muted)] capitalize">{item.content_type}</span>
                            <span className="text-xs text-[var(--text-muted)]">{item.scheduled_date}</span>
                            {item.week_slug && <span className="text-xs text-[var(--text-muted)] font-mono">{item.week_slug}</span>}
                          </div>
                          {item.status !== 'approved' && item.status !== 'posted' && (
                            <button onClick={() => approveItem(item)}
                              className="text-xs px-3 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0">
                              Approve
                            </button>
                          )}
                        </div>

                        {/* Content text */}
                        <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap"
                          style={{ fontFamily: 'inherit' }}>
                          {item.content_text.length > 400
                            ? item.content_text.slice(0, 400) + '...'
                            : item.content_text}
                        </div>

                        {/* Existing feedback */}
                        {item.feedback && item.feedback.length > 0 && (
                          <div className="space-y-2">
                            {item.feedback.map(fb => (
                              <div key={fb.id} className="text-xs p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[var(--text-muted)] font-medium">{fb.feedback_type}</span>
                                  <span className="text-[var(--text-muted)]">·</span>
                                  <span className="text-[var(--text-muted)]">{new Date(fb.created_at).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[var(--text-secondary)]">{fb.feedback_text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Feedback form */}
                        {item.status !== 'posted' && (
                          <div className="space-y-2 pt-1 border-t border-[var(--border)]">
                            <textarea
                              value={feedbackText[item.id] || ''}
                              onChange={e => setFeedbackText(prev => ({ ...prev, [item.id]: e.target.value }))}
                              placeholder="Leave feedback... (tone, angle, what to change, what's good)"
                              rows={2}
                              className="w-full text-xs px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent-blue)]"
                            />
                            <div className="flex items-center justify-between gap-2">
                              <select
                                value={feedbackType[item.id] || 'general'}
                                onChange={e => setFeedbackType(prev => ({ ...prev, [item.id]: e.target.value }))}
                                className="text-xs px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                {FEEDBACK_TYPES.map(ft => (
                                  <option key={ft.value} value={ft.value}>{ft.label}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => saveFeedback(item)}
                                disabled={saving[item.id] || !feedbackText[item.id]?.trim()}
                                className="text-xs px-4 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40"
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
          })
        )}
      </div>
    </div>
  );
}
