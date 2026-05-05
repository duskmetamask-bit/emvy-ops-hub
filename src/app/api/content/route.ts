import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrjktvvnzjzlfquaghut.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Content item shape expected by the content page
interface ContentItem {
  id: string;
  platform: string;
  content_type: string;
  content_text: string;
  scheduled_date: string;
  status: string;
  week_slug: string;
  created_at: string;
  updated_at?: string;
  feedback?: Array<{ id: string; feedback_text: string; feedback_type: string; created_at: string }>;
}

function getSupabase() {
  if (!supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');
  const date = searchParams.get('date');
  const week = searchParams.get('week');

  const supabase = getSupabase();

  // Fallback to JSON if Supabase not configured
  if (!supabase) {
    const contentData = await import('@/lib/content-data.json').then(m => m.default).catch(() => []);
    let items = contentData as ContentItem[];
    if (platform && platform !== 'all') items = items.filter(i => i.platform === platform);
    if (date) items = items.filter(i => i.scheduled_date === date);
    if (week) items = items.filter(i => i.week_slug === week);
    items = items.sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());
    return NextResponse.json({ items, source: 'json' });
  }

  try {
    let query = supabase
      .from('content_items')
      .select('*, feedback:content_feedback(id, feedback_text, feedback_type, created_at)')
      .order('scheduled_date', { ascending: false });

    if (platform && platform !== 'all') query = query.eq('platform', platform);
    if (date) query = query.eq('scheduled_date', date);
    if (week) query = query.eq('week_slug', week);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      items: (data || []).map(item => ({
        ...item,
        feedback: item.feedback || [],
      })),
      source: 'supabase'
    });
  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { id, status, feedback_text, feedback_type } = body;

    // Update status
    if (id && status) {
      const { error } = await supabase
        .from('content_items')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Add feedback
    if (feedback_text && feedback_type && id) {
      const { error } = await supabase
        .from('content_feedback')
        .insert({
          content_item_id: id,
          feedback_text,
          feedback_type
        });

      if (error) throw error;

      // Update item status to feedback_received
      await supabase
        .from('content_items')
        .update({ status: 'feedback_received', updated_at: new Date().toISOString() })
        .eq('id', id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Content POST error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
