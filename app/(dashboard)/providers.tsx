'use client';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  console.log('this is provider');

  return <TooltipProvider>{children}</TooltipProvider>;
}
