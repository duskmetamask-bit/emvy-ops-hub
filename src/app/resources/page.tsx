'use client';

import { useState } from 'react';

const SECTIONS = [
  {
    id: 'running-your-own',
    label: 'Running Your Own',
    color: '#10b981',
    icon: '●',
    items: [
      {
        title: 'llama.cpp',
        url: 'https://github.com/ggerganov/llama.cpp',
        desc: 'Run LLMs on CPU/MPS/Metal. Quantisation, GGUF formats, fast inference without GPU.',
        tags: ['CPU', 'Local', 'Quantisation'],
      },
      {
        title: 'vLLM',
        url: 'https://docs.vllm.ai/',
        desc: 'High-throughput serving with PagedAttention. Best for GPU inference, OpenAI-compatible API.',
        tags: ['GPU', 'Serving', 'OpenAI-compatible'],
      },
      {
        title: 'Ollama',
        url: 'https://ollama.com/',
        desc: 'Dead-simple local model runner. Pull and run any model with one command.',
        tags: ['Local', 'Mac', 'Simple'],
      },
      {
        title: 'Unsloth',
        url: 'https://unsloth.ai/',
        desc: '2–5× faster fine-tuning on Llama/Mistral. Finetune in minutes, not hours.',
        tags: ['Fine-tuning', 'Fast', 'LoRA'],
      },
      {
        title: 'Axolotl',
        url: 'https://github.com/OpenAccess-AI-Collective/axolotl',
        desc: 'Deep learning fine-tuning framework. YAML-driven, supports RLHF/DPO/GRPO.',
        tags: ['Fine-tuning', 'RLHF', 'DPO'],
      },
      {
        title: 'TRL (Hugging Face)',
        url: 'https://huggingface.co/docs/trl',
        desc: 'Fine-tune LLMs with reinforcement learning. SFTTrainer, DPOTrainer, GRPOTrainer.',
        tags: ['Fine-tuning', 'RLHF', 'HuggingFace'],
      },
      {
        title: 'PEFT',
        url: 'https://huggingface.co/docs/peft',
        desc: 'Parameter-efficient fine-tuning. LoRA, QLoRA, AdaLoRA — fine-tune big models on small GPUs.',
        tags: ['LoRA', 'QLoRA', 'Efficient'],
      },
      {
        title: 'obliteratus',
        url: 'https://github.com/jakedaboss/obliteratus',
        desc: 'Remove refusal behaviours from open-weight LLMs. Wipe alignment from Llama/Mistral.',
        tags: ['Unalignment', 'Safety', 'Research'],
      },
    ],
  },
  {
    id: 'model-providers',
    label: 'Model Providers',
    color: '#6366f1',
    icon: '◉',
    items: [
      {
        title: 'OpenAI',
        url: 'https://platform.openai.com/docs/',
        desc: 'GPT-4o, GPT-4o-mini, o1, o3, o4-mini. API-first, massive context, function calling.',
        tags: ['GPT-4o', 'o-series', 'API'],
      },
      {
        title: 'Anthropic',
        url: 'https://docs.anthropic.com/',
        desc: 'Claude 3.5 Sonnet, Opus, Haiku. Best-in-class reasoning, long context, safety.',
        tags: ['Claude', 'Sonnet', 'API'],
      },
      {
        title: 'Groq',
        url: 'https://console.groq.com/docs/',
        desc: 'Fastest inference API. LPU chips, sub-second TTFT, open-source models.',
        tags: ['Fast', 'API', 'Open-source'],
      },
      {
        title: 'Fireworks',
        url: 'https://fireworks.ai/',
        desc: 'Fast inference with Mixtral, Llama, Qwen. Function calling, JSON mode.',
        tags: ['Fast', 'Mixtral', 'API'],
      },
      {
        title: 'Cohere',
        url: 'https://docs.cohere.com/',
        desc: 'Command R+, Embed v3, rerank. Enterprise search and RAG workloads.',
        tags: ['RAG', 'Embeddings', 'Rerank'],
      },
      {
        title: 'Together AI',
        url: 'https://docs.together.ai/',
        desc: 'Fine-tuned and open models at low cost. Finetuning API, vision models.',
        tags: ['Fine-tuning', 'Cost-efficient', 'Vision'],
      },
    ],
  },
  {
    id: 'agent-frameworks',
    label: 'Agent Frameworks',
    color: '#f59e0b',
    icon: '▲',
    items: [
      {
        title: 'LangChain',
        url: 'https://python.langchain.com/',
        desc: 'Chains, agents, RAG, memory. The dominant framework for LLM app development.',
        tags: ['Chains', 'RAG', 'Memory'],
      },
      {
        title: 'DSPy',
        url: 'https://dspy.ai/',
        desc: 'Declarative programming for AI pipelines. Replace prompting with optimisation.',
        tags: ['Declarative', 'Optimisation', 'DSP'],
      },
      {
        title: 'AutoGen',
        url: 'https://microsoft.github.io/autogen/',
        desc: 'Multi-agent conversations from Microsoft. Code execution, tool use.',
        tags: ['Multi-agent', 'Code-exec', 'Microsoft'],
      },
      {
        title: 'CrewAI',
        url: 'https://docs.crewai.com/',
        desc: 'Multi-agent orchestration. Roles, goals, tasks — clean abstractions.',
        tags: ['Multi-agent', 'Orchestration', 'Simple'],
      },
      {
        title: 'Flowise',
        url: 'https://flowiseai.com/',
        desc: 'Drag-and-drop LangChain UI. Build chains visually, no code needed.',
        tags: ['No-code', 'LangChain', 'Visual'],
      },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    color: '#06b6d4',
    icon: '◆',
    items: [
      {
        title: 'Modal',
        url: 'https://modal.com/docs',
        desc: 'Serverless GPU compute. Run inference and training jobs in seconds.',
        tags: ['Serverless', 'GPU', 'Fast'],
      },
      {
        title: 'Modal — GPU Cloud',
        url: 'https://modal.com/l/gpu',
        desc: 'A100/H100 instances on demand. Scale to 100s of GPUs with zero infra overhead.',
        tags: ['GPU', 'Scale', 'Serverless'],
      },
      {
        title: 'Tailscale',
        url: 'https://tailscale.com/',
        desc: 'Zero-config VPN. Connect your VPS to your Mac for secure file delivery.',
        tags: ['VPN', 'Network', 'SSH'],
      },
      {
        title: 'Vercel',
        url: 'https://vercel.com/docs',
        desc: 'Deploy Next.js and frontend apps. Serverless functions, edge, global CDN.',
        tags: ['Deploy', 'Next.js', 'Edge'],
      },
      {
        title: 'Fly.io',
        url: 'https://fly.io/docs/',
        desc: 'Run containers close to users. Cheap, fast, any region.',
        tags: ['Containers', 'Deploy', 'Global'],
      },
    ],
  },
  {
    id: 'emvy-internal',
    label: 'EMVY Internal',
    color: '#a855f7',
    icon: '★',
    items: [
      {
        title: 'Hermes Agent',
        url: 'https://hermes-agent.nousresearch.com/docs/',
        desc: 'Our agent orchestration platform. Profiles, skills, cron, memory.',
        tags: ['EMVY', 'Agents', 'Orchestration'],
      },
      {
        title: 'EMVY Ops Hub',
        url: 'https://emvy-ops-hub.vercel.app',
        desc: 'This dashboard. Leads, pipeline, actions, infrastructure.',
        tags: ['Dashboard', 'Ops', 'EMVY'],
      },
      {
        title: 'EMVY GitHub',
        url: 'https://github.com/duskmetamask-bit/emvy-ops-hub',
        desc: 'Ops Hub source code. Next.js + Supabase.',
        tags: ['GitHub', 'Code', 'EMVY'],
      },
      {
        title: 'PickleNickAI',
        url: 'https://pickle-nick-ai.vercel.app',
        desc: 'Teacher-facing AI lesson planning tool. Built on EMVY stack.',
        tags: ['Product', 'Education', 'EMVY'],
      },
      {
        title: 'EMVY Content Flywheel',
        url: 'https://emvy-ops-hub.vercel.app/content',
        desc: 'LinkedIn, YouTube, X, Substack — all content scheduled here.',
        tags: ['Content', 'Social', 'EMVY'],
      },
    ],
  },
];

export default function ResourcesPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map(s => [s.id, true]))
  );
  const [search, setSearch] = useState('');

  const toggle = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(
      item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter(section => section.items.length > 0);

  return (
    <div className="space-y-6 fade-in">
      <div className="page-header">
        <h1 className="page-title">Resources</h1>
        <p className="page-subtitle">AI documentation, tools, and learning — internal reference</p>
      </div>

      {/* Search */}
      <div className="card p-4">
        <input
          type="text"
          placeholder="Search tools, tags, descriptions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
        />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {filtered.map(section => (
          <div key={section.id} className="card overflow-hidden">
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span style={{ color: section.color }} className="text-sm">{section.icon}</span>
                <span className="font-semibold text-sm" style={{ color: section.color }}>
                  {section.label}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {section.items.length} {section.items.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                {openSections[section.id] ? '▲' : '▼'}
              </span>
            </button>

            {openSections[section.id] && (
              <div className="border-t border-[var(--border)]">
                <div className="grid grid-cols-1 gap-3 p-4">
                  {section.items.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 border border-[var(--border)] hover:border-[var(--border)]/80 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">↗</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {item.desc}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  background: `${section.color}15`,
                                  color: section.color,
                                  border: `1px solid ${section.color}30`,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No resources match &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
