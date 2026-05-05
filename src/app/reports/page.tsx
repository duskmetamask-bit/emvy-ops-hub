'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const CRON_CONFIG: Record<string, { label: string; color: string; icon: string; section: string }> = {
  lead_finder:       { label: 'Lead Finder',            color: '#3b82f6', icon: '◈', section: 'Lead Finder' },
  linkedin:          { label: 'LinkedIn Content',       color: '#0A66C2', icon: 'in', section: 'LinkedIn' },
  x:                 { label: 'X Content',             color: '#e7e7e7', icon: 'x', section: 'X' },
  youtube:           { label: 'YouTube Content',       color: '#ef4444', icon: 'yt', section: 'YouTube' },
  substack:          { label: 'Substack Content',      color: '#ff671d', icon: 'sub', section: 'Substack' },
  happy_harold:      { label: 'Happy Harold Research', color: '#10b981', icon: '◆', section: 'Happy Harold' },
  daily_audit:       { label: 'Daily Audit',           color: '#f59e0b', icon: '◎', section: 'Daily Audit' },
  competitor_intel:  { label: 'Deep State Competitor Intel', color: '#a855f7', icon: '▣', section: 'Deep State' },
  pipeline_health:   { label: 'Pipeline Health',      color: '#06b6d4', icon: '◇', section: 'Pipeline Health' },
  email_learning:    { label: 'Email Learning Loop',   color: '#6366f1', icon: '▥', section: 'Email Learning Loop' },
};

const SECTION_ORDER = [
  'Lead Finder', 'LinkedIn', 'X', 'YouTube', 'Substack',
  'Happy Harold', 'Daily Audit', 'Deep State', 'Pipeline Health', 'Email Learning Loop',
];

interface CronReport {
  id: string;
  cron_name: string;
  cron_type: string;
  title: string | null;
  content: string | null;
  summary: string | null;
  run_date: string;
  created_at: string;
}

const ALL_TYPES = Object.keys(CRON_CONFIG);

export default function ReportsPage() {
  const [reports, setReports] = useState<CronReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const loadReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cron_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setReports([]);
      } else {
        setReports(data || []);
      }
    } catch (e) {
      console.error('Failed to load reports:', e);
      setReports([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadReports(); }, []);

  const filteredReports = reports.filter(r => {
    if (activeFilter !== 'all' && r.cron_type !== activeFilter) return false;
    if (dateFilter && !r.run_date?.startsWith(dateFilter)) return false;
    return true;
  });

  // Group by cron_type section
  const grouped: Record<string, CronReport[]> = {};
  for (const type of ALL_TYPES) {
    const section = CRON_CONFIG[type]?.section || type;
    const items = filteredReports.filter(r => r.cron_type === type);
    if (items.length > 0) grouped[section] = items;
  }

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'Australia/Perth',
  });

  const filterTabs = [
    { id: 'all', label: 'All Reports' },
    ...ALL_TYPES.map(t => ({
      id: t,
      label: CRON_CONFIG[t]?.label || t,
    })),
  ];

  return (
    <div className="flex flex-col h-full -m-6">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] shrink-0"
        style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.04) 0%, transparent 50%)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)]">Cron Reports</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border text-[var(--text-secondary)]"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', colorScheme: 'dark' }}
            />
            <button
              onClick={() => { setActiveFilter('all'); setDateFilter(''); }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`tab-pill ${activeFilter === tab.id ? 'active' : 'tab-pill-subtle'}`}
              style={activeFilter === tab.id && tab.id !== 'all' ?
                { background: `${CRON_CONFIG[tab.id]?.color}22`, color: CRON_CONFIG[tab.id]?.color, borderColor: `${CRON_CONFIG[tab.id]?.color}44` }
                : {}}>
              {tab.label}
              {tab.id !== 'all' && (
                <span className="ml-1 text-[10px] opacity-60">
                  ({reports.filter(r => r.cron_type === tab.id).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reports content */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
            <div className="text-5xl mb-4 opacity-20">◫</div>
            <p className="text-base font-semibold">No reports yet</p>
            <p className="text-sm mt-1 opacity-60">Cron reports will appear here after execution</p>
            <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-xs text-center text-[var(--text-muted)]">
                Reports are written to Supabase after each cron run.<br />
                Use the date filter or type filter above.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {SECTION_ORDER.filter(section => grouped[section]).map(section => {
              const sectionReports = grouped[section];
              const typeKey = ALL_TYPES.find(t => CRON_CONFIG[t]?.section === section) || section.toLowerCase().replace(/\s+/g, '_');
              const cfg = Object.values(CRON_CONFIG).find(c => c.section === section) ||
                { label: section, color: '#8b5cf6', icon: '◈' };

              return (
                <div key={section} className="space-y-3">
                  {/* Section header */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}40`, color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <h2 className="text-sm font-bold text-[var(--text-primary)]">{section}</h2>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${cfg.color}22, transparent)` }} />
                    <span className="text-[11px] text-[var(--text-muted)]">{sectionReports.length} report{sectionReports.length !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Report cards */}
                  <div className="space-y-2">
                    {sectionReports.map(report => {
                      const isExpanded = expanded[report.id];
                      const content = report.content || report.summary || '';
                      const previewLength = 200;
                      const truncated = content.length > previewLength;
                      const displayContent = isExpanded || !truncated ? content : content.slice(0, previewLength) + '...';

                      const runDate = report.run_date ? new Date(report.run_date).toLocaleString('en-AU', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                        timeZone: 'Australia/Perth',
                      }) : 'Unknown date';

                      return (
                        <div key={report.id} className="rounded-xl border transition-all hover:border-opacity-60"
                          style={{ background: 'var(--bg-secondary)', borderColor: `${cfg.color}30` }}>
                          {/* Card header */}
                          <button
                            onClick={() => setExpanded(prev => ({ ...prev, [report.id]: !prev[report.id] }))}
                            className="w-full text-left p-4 flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: `${cfg.color}22`, color: cfg.color }}>
                                  {cfg.label}
                                </span>
                                {report.title && (
                                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                                    {report.title}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                                <span className="font-mono">{runDate}</span>
                                <span>·</span>
                                <span className="truncate">{report.cron_name}</span>
                              </div>
                              {report.summary && !isExpanded && (
                                <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">
                                  {report.summary}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0 text-[var(--text-muted)] text-sm mt-0.5">
                              {truncated ? (isExpanded ? '▲' : '▼') : ''}
                            </div>
                          </button>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="px-4 pb-4">
                              <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, ${cfg.color}22, transparent)` }} />
                              <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap font-mono text-xs p-3 rounded-lg"
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)' }}>
                                {content || <span className="text-[var(--text-muted)] italic">No content</span>}
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
