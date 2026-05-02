import { execSync } from 'child_process';

const API_SECRET = process.env.EMAIL_API_SECRET || 'emvy-ops-hub-secret';

export function verifySecret(headers: Headers): boolean {
  const sent = headers.get('x-email-secret');
  return sent === API_SECRET;
}

export interface EmailEnvelope {
  id: string;
  from: string;
  to: string[];
  subject: string;
  date: string;
  flags: string[];
  preview: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  date: string;
  body: string;
  html?: string;
  flags: string[];
}

function parseEnvelopes(raw: string): EmailEnvelope[] {
  const lines = raw.trim().split('\n');
  const emails: EmailEnvelope[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    // Format: id|from|to|subject|date|flags|preview
    const parts = line.split('|');
    if (parts.length < 7) continue;
    emails.push({
      id: parts[0],
      from: parts[1],
      to: parts[2].split(';').filter(Boolean),
      subject: parts[3],
      date: parts[4],
      flags: parts[5] ? parts[5].split(';') : [],
      preview: parts[6] || '',
    });
  }
  return emails;
}

function transformEnvelope(raw: Record<string, unknown>): EmailEnvelope {
  const from = raw.from as { name?: string; addr: string } | null;
  const to = raw.to as { name?: string; addr: string } | null;
  return {
    id: String(raw.id || ''),
    from: from?.addr || '',
    to: to ? [to.addr] : [],
    subject: String(raw.subject || ''),
    date: String(raw.date || ''),
    flags: Array.isArray(raw.flags) ? raw.flags.map(String) : [],
    preview: '',
  };
}

export function listInbox(page = 1, pageSize = 20): EmailEnvelope[] {
  const output = execSync(
    `himalaya envelope list --account dawnlabsai --folder "INBOX" --page ${page} --page-size ${pageSize} --output json 2>/dev/null`,
    { encoding: 'utf-8', maxBuffer: 1024 * 1024 }
  );
  const arr = JSON.parse(output || '[]');
  return arr.map(transformEnvelope);
}

export function listSent(page = 1, pageSize = 20): EmailEnvelope[] {
  const output = execSync(
    `himalaya envelope list --account dawnlabsai --folder "[Gmail]/Sent Mail" --page ${page} --page-size ${pageSize} --output json 2>/dev/null`,
    { encoding: 'utf-8', maxBuffer: 1024 * 1024 }
  );
  const arr = JSON.parse(output || '[]');
  return arr.map(transformEnvelope);
}

export function readMessage(id: string, folder = 'INBOX'): EmailMessage {
  const output = execSync(
    `himalaya message export --account dawnlabsai --folder "${folder}" ${id} --full 2>/dev/null`,
    { encoding: 'utf-8', maxBuffer: 512 * 1024 }
  );
  return parseMessage(output, id);
}

function parseMessage(raw: string, id: string): EmailMessage {
  const headers: Record<string, string> = {};
  let bodyStart = 0;

  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') { bodyStart = i + 1; break; }
    const colon = line.indexOf(': ');
    if (colon === -1) continue;
    headers[line.slice(0, colon).toLowerCase()] = line.slice(colon + 2).trim();
  }

  const from = headers['from'] || '';
  const to = (headers['to'] || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const cc = headers['cc'] ? headers['cc'].split(',').map((s: string) => s.trim()).filter(Boolean) : undefined;
  const subject = headers['subject'] || '';
  const date = headers['date'] || '';
  const flags: string[] = [];

  const body = lines.slice(bodyStart).join('\n').replace(/^\s+./, '').trim();

  return { id, from, to, cc, subject, date, body, flags };
}

export function searchEmails(query: string, folder?: string): EmailEnvelope[] {
  const folderArg = folder ? `--folder "${folder}"` : '';
  const output = execSync(
    `himalaya envelope list --account dawnlabsai ${folderArg} --output json 2>/dev/null`,
    { encoding: 'utf-8', maxBuffer: 1024 * 1024 }
  );
  const all = JSON.parse(output || '[]');
  const q = query.toLowerCase();
  return all
    .map(transformEnvelope)
    .filter((e: EmailEnvelope) =>
      e.subject.toLowerCase().includes(q) ||
      e.from.toLowerCase().includes(q) ||
      e.to.some((t: string) => t.toLowerCase().includes(q))
    );
}
