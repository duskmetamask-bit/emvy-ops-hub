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

    return NextResponse.json({
      stats: {
        total: typedLeads.length,
        hot: hot.length,
        warm: warm.length,
        actionable: actionable.length,
        byIndustry,
      },
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
      hot,
      warm,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
