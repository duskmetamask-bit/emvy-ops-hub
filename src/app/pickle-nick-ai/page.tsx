'use client';

import { useState } from 'react';

const SUBJECTS = [
  { id: 'spelling', label: 'Spelling/Phonics', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'grammar', label: 'Grammar/Punctuation', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'reading', label: 'Reading Comprehension', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'narrative', label: 'Narrative Writing', years: ['Y1', 'Y2', 'Y4-5', 'Y5', 'Y6'], files: 5, status: 'done' },
  { id: 'persuasive', label: 'Persuasive Writing', years: ['Y1', 'Y2', 'Y5', 'Y6'], files: 4, status: 'done' },
  { id: 'informative', label: 'Informative Writing', years: ['Y1', 'Y2', 'Y5', 'Y6'], files: 4, status: 'done' },
  { id: 'maths-add', label: 'Maths — Addition/Subtraction', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'maths-mult', label: 'Maths — Multiplication/Division', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'maths-geom', label: 'Maths — Geometry', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4'], files: 5, status: 'done' },
  { id: 'maths-meas', label: 'Maths — Measurement', years: ['F', 'Y1', 'Y2'], files: 3, status: 'done' },
  { id: 'science-bio', label: 'Science — Biological', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'science-earth', label: 'Science — Earth', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'science-phys', label: 'Science — Physical', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6'], files: 7, status: 'done' },
  { id: 'hass-geo', label: 'HASS — Geography', years: ['F', 'Y1', 'Y2', 'Y3', 'Y4'], files: 4, status: 'done' },
  { id: 'hass-civics', label: 'HASS — Civics', years: ['Y3', 'Y4', 'Y5'], files: 3, status: 'done' },
];

const PHASES = [
  { phase: '1', name: 'Build Web Chat Interface', status: 'done', icon: '✓' },
  { phase: '2', name: 'Wire to OpenClaw Agent', status: 'in_progress', icon: '○' },
  { phase: '3', name: 'Auth + Teacher Profile', status: 'todo', icon: '○' },
  { phase: '4', name: 'Output Formats + Export (PDF/PPTX)', status: 'todo', icon: '○' },
  { phase: '5', name: 'Writing Assessment Tool', status: 'todo', icon: '○' },
  { phase: '6', name: 'Billing — Stripe', status: 'todo', icon: '○' },
  { phase: '7', name: 'Launch — 20 Teachers', status: 'todo', icon: '○' },
];

const LINKS = [
  { label: 'Live App', value: 'pickle-nick-ai.vercel.app', href: 'https://pickle-nick-ai.vercel.app' },
  { label: 'GitHub Repo', value: 'github.com/duskmetamask-bit/teacher-marker', href: 'https://github.com/duskmetamask-bit/teacher-marker' },
  { label: 'Local', value: '~/pickle-nick-ai/', href: null },
  { label: 'Gateway', value: '194.163.136.244:18789', href: null },
  { label: 'Gateway Token', value: '5427075325e3b1f79b8d98df5641fe7e1268e1766c707ae8', href: null },
];

export default function PickleNickAIPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'lesson-plans' | 'skills' | 'build'>('overview');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🥒</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>PickleNickAI</h1>
          <span style={{ background: '#6366f1', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Phase 2</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          AI Teaching Agent for Australian F–6 Teachers · $19/mo · AC9 aligned
        </p>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0' }}>
        {(['overview', 'lesson-plans', 'skills', 'build'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: activeTab === tab ? '#6366f1' : '#64748b',
              borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab === 'overview' ? 'Overview' : tab === 'lesson-plans' ? 'Lesson Plans' : tab === 'skills' ? 'Skills' : 'Build Status'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Links */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {LINKS.map(l => (
                <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748b' }}>{l.label}</span>
                  {l.href ? (
                    <a href={l.href} target="_blank" style={{ color: '#6366f1', textDecoration: 'none', fontFamily: 'monospace', fontSize: '0.75rem' }}>{l.value}</a>
                  ) : (
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#1e293b' }}>{l.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Tagline</span><span>"Teacher's Assistant for Everything"</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>URL</span><span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>pickle-nick-ai.vercel.app</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Primary</span><span style={{ color: '#6366f1' }}>#6366f1</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Accent</span><span style={{ color: '#22d3ee' }}>#22d3ee</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Font</span><span>Inter</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Voice</span><span>Professional, warm, teacher-first</span></div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { tier: 'Free', price: '$0', desc: '5 units/month, no export' },
                { tier: 'Pro', price: '$19/mo', desc: 'Unlimited, PDF/DOCX export' },
                { tier: 'School', price: '$149/mo', desc: '30 seats, admin panel' },
              ].map(t => (
                <div key={t.tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600 }}>{t.tier}</span>
                  <span style={{ fontFamily: 'monospace' }}>{t.price}</span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Summary */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</h3>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
              PickleNickAI is a <strong>vertical AI agent</strong> — not SaaS, not a worksheet generator. The intelligence IS the product. Teachers chat with their personal AI teaching assistant, get AC9-aligned lesson plans, rubrics, behaviour support, and more.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6, marginTop: '0.75rem' }}>
              <strong>Competitive moat:</strong> AC9 accuracy, WA context, AITSL standards, per-teacher privacy, teaching-specific guardrails.
            </p>
          </div>
        </div>
      )}

      {/* LESSON PLANS TAB */}
      {activeTab === 'lesson-plans' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Lesson Plans</h2>
              <p style={{ color: '#64748b', fontSize: '0.8rem' }}>81 lesson plans · Vault source: <code>~/.openclaw/vault/dawn-vault/shared/PROJECTS/pickle-nick-ai/units/</code></p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Vault: <strong>81</strong></span>
              <span>App data: <strong>101</strong></span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {SUBJECTS.map(s => (
              <div key={s.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{s.label}</h4>
                  <span style={{ background: '#22c55e/20', color: '#22c55e', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>DONE</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  {s.years.join(' · ')}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {s.years.map(y => (
                    <span key={y} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>{y}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
            <strong>Gap:</strong> Maths — Fractions (none yet), Maths — Decimals (none yet), Maths — Time (none yet), Maths — Money (none yet), HASS — History (none yet), Health & PE (none yet), The Arts (none yet)
          </div>
        </div>
      )}

      {/* SKILLS TAB */}
      {activeTab === 'skills' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Skills (19 + 1)</h2>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            Skills vault: <code>~/.openclaw/vault/dawn-vault/shared/skills/pickle-*/</code>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {[
              'pickle-teaching', 'pickle-education', 'pickle-product', 'pickle-maths',
              'pickle-science', 'pickle-hass', 'pickle-technologies', 'pickle-arts',
              'pickle-wellbeing', 'pickle-writing', 'pickle-assessment', 'pickle-marking',
              'pickle-differentiation', 'pickle-parent', 'pickle-behaviour', 'pickle-resources',
              'pickle-legal', 'pickle-standards', 'pickle-reporting', 'yuki-operating',
            ].map(skill => (
              <div key={skill} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BUILD STATUS TAB */}
      {activeTab === 'build' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>Build Phases</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {PHASES.map(p => (
              <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
                <span style={{ fontSize: '1.25rem', color: p.status === 'done' ? '#22c55e' : p.status === 'in_progress' ? '#f59e0b' : '#cbd5e1' }}>{p.icon}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b', width: '60px' }}>Phase {p.phase}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b', flex: 1 }}>{p.name}</span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '9999px',
                  background: p.status === 'done' ? '#22c55e/20' : p.status === 'in_progress' ? '#f59e0b/20' : '#f1f5f9',
                  color: p.status === 'done' ? '#22c55e' : p.status === 'in_progress' ? '#f59e0b' : '#94a3b8',
                  textTransform: 'uppercase',
                }}>{p.status === 'done' ? 'Done' : p.status === 'in_progress' ? 'In Progress' : 'To Do'}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', margin: '2rem 0 1rem' }}>Tech Spec Reference</h3>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', fontSize: '0.8rem', fontFamily: 'monospace', lineHeight: 1.8 }}>
            <p><strong>Full spec:</strong> ~/.openclaw/vault/dawn-vault/shared/PROJECTS/pickle-nick-ai/TECHNICAL-SPEC.md</p>
            <p><strong>Project plan:</strong> ~/.openclaw/vault/dawn-vault/shared/PROJECTS/pickle-nick-ai/PROJECT-PLAN.md</p>
            <p><strong>Design brief:</strong> ~/.openclaw/vault/dawn-vault/shared/PROJECTS/pickle-nick-ai/DESIGN-ARCHITECTURE-BRIEF.md</p>
            <p><strong>Agent brief:</strong> ~/.openclaw/vault/dawn-vault/shared/PROJECTS/pickle-nick-ai/AGENT-BRIEF.md</p>
            <p><strong>Brand guidelines:</strong> ~/.openclaw/vault/dawn-vault/YUKI/docs/brand/BRAND-GUIDELINES.md</p>
          </div>
        </div>
      )}
    </div>
  );
}
