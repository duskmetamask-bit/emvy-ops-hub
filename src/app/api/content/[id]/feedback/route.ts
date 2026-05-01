import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { feedback_text, feedback_type = 'general' } = await req.json();

  if (!feedback_text) {
    return NextResponse.json({ error: 'feedback_text is required' }, { status: 400 });
  }

  const { data: feedback, error: fbError } = await supabaseAdmin
    .from('content_feedback')
    .insert({ content_item_id: id, feedback_text, feedback_type })
    .select()
    .single();

  if (fbError) return NextResponse.json({ error: fbError.message }, { status: 500 });

  await supabaseAdmin
    .from('content_items')
    .update({ status: 'feedback_received', updated_at: new Date().toISOString() })
    .eq('id', id);

  return NextResponse.json(feedback, { status: 201 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();

  if (!['draft', 'approved', 'posted', 'feedback_received'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('content_items')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
