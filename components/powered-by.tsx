'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { BOLT_URL } from '@/lib/constants';
import { useEffect, useState } from 'react';

export function PoweredBy() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (theme !== 'dark') return null;

  return (
    <Link
      href={BOLT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-opacity hover:opacity-80"
    >
      <Image
        src="/logotext_poweredby_360w.png"
        alt="Powered by Bolt"
        width={120}
        height={40}
        className="h-auto w-auto"
      />
    </Link>
  );
}