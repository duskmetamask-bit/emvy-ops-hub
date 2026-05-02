import { NextRequest, NextResponse } from 'next/server';
import { verifySecret, listInbox } from '@/lib/email';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-email-secret');
  if (!verifySecret(req.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const emails = listInbox(page, pageSize);
    return NextResponse.json({ success: true, emails, page, pageSize });
  } catch (error) {
    console.error('Inbox error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch inbox' }, { status: 500 });
  }
}
