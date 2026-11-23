'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { rejectUnregisteredGoogleUser } from '@/lib/auth/actions';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const intent = sessionStorage.getItem('oauth_intent');
      sessionStorage.removeItem('oauth_intent');

      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace('/login');
        return;
      }

      // HANYA jalankan pengecekan penolakan jika user benar-benar memilih jalur 'login'
      // dan pastikan akunnya memang terbukti belum terdaftar sebelumnya.
      if (intent === 'login') {
        try {
          const { removed } = await rejectUnregisteredGoogleUser(session.access_token);
          if (removed) {
            await supabase.auth.signOut({ scope: 'local' });
            router.replace('/login?error=not_registered');
            return;
          }
        } catch (err) {
          console.error("Auth check error:", err);
          // Jika terjadi error koneksi/server action, jangan langsung tendang user jika mereka sah punya sesi
          // Cukup biarkan lanjut atau handle dengan aman tanpa hapus sesi secara ekstrem
        }
      }

      // Berhasil masuk, arahkan ke beranda
      router.replace('/');
      router.refresh();
    })();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-[13px] text-[#8a8a86]">
      Signing you in…
    </main>
  );
}