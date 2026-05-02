import { NextRequest, NextResponse } from 'next/server';
import { verifySecret, listSent } from '@/lib/email';

export async function GET(req: NextRequest) {
  if (!verifySecret(req.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const emails = listSent(page, pageSize);
    return NextResponse.json({ success: true, emails, page, pageSize });
  } catch (error) {
    console.error('Sent error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sent' }, { status: 500 });
  }
}
