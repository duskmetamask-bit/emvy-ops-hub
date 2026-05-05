import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const jobName = formData.get('job_name') as string;
    const platform = formData.get('platform') as string;
    const scheduledDate = formData.get('scheduled_date') as string;
    const contentType = formData.get('content_type') as string;
    const pillar = formData.get('pillar') as string;
    const researchSummary = formData.get('research_summary') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Upload PDF to storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = jobName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'report';
    const dateStr = new Date().toISOString().split('T')[0];
    const storagePath = `${dateStr}/${ext}-${Date.now()}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('reports').getPublicUrl(storagePath);
    const pdfUrl = urlData.publicUrl;

    // Write to content_items if platform provided
    if (platform && contentType) {
      const { error: insertError } = await supabase
        .from('content_items')
        .insert({
          platform,
          content_type: contentType,
          content_text: `PDF Report: ${jobName}`,
          scheduled_date: scheduledDate || dateStr,
          status: 'draft',
          pdf_url: pdfUrl,
          pillar: pillar || null,
          research_summary: researchSummary || null,
        });

      if (insertError) {
        console.error('Content insert error:', insertError);
      }
    }

    return NextResponse.json({ success: true, pdf_url: pdfUrl, path: storagePath });
  } catch (error: any) {
    console.error('Upload report error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
