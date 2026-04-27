'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const hydrateFromSession = useStore((s) => s.hydrateFromSession);

  useEffect(() => {
    hydrateFromSession();
  }, [hydrateFromSession]);

  return <>{children}</>;
}
