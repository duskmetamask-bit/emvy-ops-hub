// EMVY Business Types

export type LeadStage = 
  | 'DISCOVERED' 
  | 'ENRICHED' 
  | 'SENT' 
  | 'REPLY' 
  | 'CALL' 
  | 'AUDIT' 
  | 'BUILD' 
  | 'DONE';

export type LeadTemp = 'HOT' | 'WARM' | 'DISCOVERED';

export interface Lead {
  id: string;
  name: string;
  company: string;
  industry: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
  stage: LeadStage;
  score: number;
  temp?: LeadTemp;
  pain_evidence?: string;
  notes?: string;
  discovery_date: string;
  last_contact?: string;
  last_updated: string;
}

export interface SeoChecklistItem {
  id: string;
  task: string;
  category: 'domain' | 'analytics' | 'content' | 'technical';
  status: 'done' | 'todo' | 'blocked';
  blocked_by?: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  topics: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in_progress' | 'published';
}

export interface InfrastructureItem {
  id: string;
  name: string;
  category: 'domain' | 'website' | 'analytics' | 'crm' | 'outreach';
  status: 'live' | 'in_progress' | 'needed' | 'blocked';
  url?: string;
  cost?: string;
  notes?: string;
}

export interface Blocker {
  id: string;
  item: string;
  type: 'domain' | 'api' | 'integration' | 'decision' | 'outreach';
  status: 'waiting_on_dusk' | 'waiting_on_external' | 'in_progress';
  notes?: string;
}

export interface PriorityAction {
  id: string;
  action: string;
  reason: string;
  priority: 'urgent' | 'high' | 'medium';
  source: string;
  due_date?: string;
}
