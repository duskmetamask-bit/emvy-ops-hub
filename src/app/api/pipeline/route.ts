import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const typedLeads = leads || [];

    const hot = typedLeads.filter(l => l.temp === 'HOT');
    const warm = typedLeads.filter(l => l.temp === 'WARM');
    const byIndustry: Record<string, number> = {};
    typedLeads.forEach(l => {
      const ind = l.industry || 'Unknown';
      byIndustry[ind] = (byIndustry[ind] || 0) + 1;
    });

    const actionable = typedLeads.filter(l => {
      const hasEmail = Boolean(l.email && l.email.includes('@'));
      return hasEmail && (l.temp === 'HOT' || l.temp === 'WARM');
    });

    const stageOrder = ['DISCOVERED', 'ENRICHED', 'SENT', 'REPLY', 'CALL', 'AUDIT', 'BUILD', 'DONE'];
    const byStage: Record<string, any[]> = {};
    for (const s of stageOrder) byStage[s] = [];
    for (const lead of typedLeads) {
      const s = lead.stage || 'DISCOVERED';
      if (!byStage[s]) byStage[s] = [];
      byStage[s].push({
        id: lead.id,
        name: lead.name || lead.company || '?',
        company: lead.company || lead.name || '?',
        industry: lead.industry || '?',
        location: lead.location || lead.suburb || '?',
        email: lead.email || '',
        phone: lead.phone || '',
        website: lead.website || '',
        score: lead.score || 0,
        classification: lead.temp || '?',
        stage: s,
        pain_evidence: lead.pain_evidence || lead.notes || '',
      });
    }

    return NextResponse.json({
      stats: {
        total: typedLeads.length,
        hot: hot.length,
        warm: warm.length,
        actionable: actionable.length,
        byIndustry,
      },
      leads: byStage,
      topLeads: actionable
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10)
        .map(l => ({
          name: l.name || l.company || '?',
          company: l.company || l.name || '?',
          industry: l.industry || '?',
          location: l.location || l.suburb || '?',
          email: l.email || '',
          phone: l.phone || '',
          website: l.website || '',
          score: l.score || 0,
          classification: l.temp || '?',
          stage: l.stage || 'DISCOVERED',
          pain_evidence: l.pain_evidence || l.notes || '',
        })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
