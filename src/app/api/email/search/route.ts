import { NextRequest, NextResponse } from 'next/server';
import { verifySecret, searchEmails } from '@/lib/email';

export async function GET(req: NextRequest) {
  if (!verifySecret(req.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get('q') || '';
    const folder = searchParams.get('folder') || undefined;

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query required' }, { status: 400 });
    }

    const emails = searchEmails(query, folder);
    return NextResponse.json({ success: true, emails, count: emails.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
