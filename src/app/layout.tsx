import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import StatusBar from '@/components/StatusBar';

export const metadata: Metadata = {
  title: 'EMVY — Ops Dashboard',
  description: 'EMVY AI Audit Consultancy — Operations Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h1 className="text-2xl font-bold">EMVY</h1>
                <p className="text-xs text-gray-500">AI Audit Consultancy</p>
              </div>
            </div>
            <StatusBar />
          </header>
          <Nav />
          <main className="mt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
