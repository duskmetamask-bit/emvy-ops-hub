import { NextRequest, NextResponse } from 'next/server';
import { verifySecret, readMessage } from '@/lib/email';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifySecret(req.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = req.nextUrl;
    const folder = searchParams.get('folder') || 'INBOX';

    const message = readMessage(id, folder);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Message read error:', error);
    return NextResponse.json({ success: false, error: 'Failed to read message' }, { status: 500 });
  }
}
