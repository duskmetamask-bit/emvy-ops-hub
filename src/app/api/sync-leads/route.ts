import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

const STAGE_MAP: Record<string, string> = {
  DISCOVERED: 'discovered',
  ENRICHED:   'enriched',
  SENT:       'sent',
  REPLY:      'reply',
  CALL:       'call',
  AUDIT:      'audit',
  BUILD:      'build',
  DONE:       'done',
  SKIP:       'skip',
  ARCHIVED:   'archived',
};

export async function POST() {
  try {
    // Load pipeline.json
    const fs = await import('fs');
    const path = await import('path');
    const pipelinePath = path.join(process.env.HOME || '/home/dusk', '.hermes/profiles/leads/pipeline.json');
    const pipelineData = JSON.parse(fs.readFileSync(pipelinePath, 'utf-8'));

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const lead of pipelineData) {
      const stage = lead.get?.('stage') || lead.stage || 'DISCOVERED';
      if (stage === 'SKIP' || stage === 'ARCHIVED') {
        skipped++;
        continue;
      }

      const record = {
        name:        lead.name        || lead.company_name || '',
        company:     lead.company     || lead.name        || '',
        industry:    lead.industry    || '',
        location:    lead.location    || lead.suburb      || '',
        email:       lead.email       || '',
        phone:       lead.phone       || '',
        website:     lead.website     || '',
        stage:       STAGE_MAP[stage] || 'discovered',
        temp:        lead.temp        || lead.score       || '',
        score:       lead.score       || 0,
        pain_evidence: lead.pain_evidence || lead.signal    || '',
        notes:       lead.notes       || '',
        discovery_date: lead.discovery_date || lead.addedAt  || '',
        created_at:  lead.created_at  || new Date().toISOString(),
      };

      // Upsert: check if company_name + email already exists
      const { data: existing } = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('company', record.company)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabaseAdmin
          .from('leads')
          .update(record)
          .eq('id', existing.id);
        if (error) errors.push(`Update error for ${record.company}: ${error.message}`);
      } else {
        // Insert new
        const { error } = await supabaseAdmin
          .from('leads')
          .insert(record);
        if (error) errors.push(`Insert error for ${record.company}: ${error.message}`);
      }

      if (errors.length === 0 || !errors[errors.length - 1]?.includes(record.company)) synced++;
    }

    return NextResponse.json({
      success: true,
      synced,
      skipped,
      errors: errors.slice(0, 10),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    usage: 'POST /api/sync-leads — sync pipeline.json to Supabase leads table',
    method: 'POST',
  });
}
