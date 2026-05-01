import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const week = searchParams.get('week');
  const platform = searchParams.get('platform');

  let query = supabaseAdmin.from('content_items').select('*').order('created_at', { ascending: false });

  if (date) query = query.eq('scheduled_date', date);
  if (week) query = query.eq('week_slug', week);
  if (platform) query = query.eq('platform', platform);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { platform, content_type, content_text, scheduled_date, week_slug } = body;

  if (!platform || !content_type || !content_text || !scheduled_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from('content_items').insert({
    platform,
    content_type,
    content_text,
    scheduled_date,
    week_slug: week_slug || null,
    status: 'draft',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
