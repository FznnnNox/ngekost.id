'use client';

import { usePathname } from 'next/navigation';

/** Sembunyikan Navbar/Footer situs di halaman /dashboard (dashboard punya navbar sendiri). */
export default function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard')) return null;
  return <>{children}</>;
}