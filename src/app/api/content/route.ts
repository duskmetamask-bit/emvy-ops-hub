import { NextRequest, NextResponse } from 'next/server';
import contentData from '@/lib/content-data.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');
  const date = searchParams.get('date');
  const week = searchParams.get('week');

  let items = contentData as any[];

  if (platform && platform !== 'all') {
    items = items.filter(i => i.platform === platform);
  }
  if (date) {
    items = items.filter(i => i.scheduled_date === date);
  }
  if (week) {
    items = items.filter(i => i.week_slug === week);
  }

  // Sort by scheduled_date desc
  items = items.sort((a, b) =>
    new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
  );

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  // For now, new posts are added via the JSON file — not through the API
  return NextResponse.json(
    { error: 'Adding content via API not yet supported. Update the content-data.json file.' },
    { status: 501 }
  );
}
