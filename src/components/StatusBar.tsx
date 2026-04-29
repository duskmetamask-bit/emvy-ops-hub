'use client';

import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-AW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Australia/Perth',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-500">AWST</span>
      <span className="font-mono text-gray-300">{time}</span>
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className="text-gray-500">{isSupabaseConfigured ? 'Supabase' : 'Demo'}</span>
      </div>
    </div>
  );
}
