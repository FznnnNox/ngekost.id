'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Menjaga halaman admin:
 * - belum login            -> diarahkan ke /login
 * - login tapi bukan admin -> diarahkan ke beranda
 * Isi halaman baru ditampilkan setelah pengecekan selesai.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    const check = (session: Session | null) => {
      if (!active) return;
      if (!session) {
        setAllowed(false);
        router.replace('/login');
      } else if (session.user.app_metadata?.role !== 'admin') {
        setAllowed(false);
        router.replace('/');
      } else {
        setAllowed(true);
      }
    };

    supabase.auth.getSession().then(({ data }) => check(data.session));

    // Callback harus sinkron: jangan memanggil supabase lain di dalamnya
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') check(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (!allowed) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center text-[13px] text-[#8a8a86]">
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}