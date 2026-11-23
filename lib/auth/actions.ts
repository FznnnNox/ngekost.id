'use server';

import { createAdminClient } from '@/lib/supabase-admin';

const NEW_ACCOUNT_WINDOW_MS = 2 * 60 * 1000; // akun dianggap "baru dibuat" jika umurnya < 2 menit
const SAME_MOMENT_MS = 15 * 1000; // dan login pertamanya hampir bersamaan dengan pembuatannya

/**
 * Supabase otomatis membuat akun baru saat seseorang login dengan Google untuk pertama kali.
 * Fungsi ini dipanggil saat pengguna menekan "login" (bukan "daftar") dengan Google:
 * jika akun itu ternyata baru saja dibuat otomatis, akunnya dihapus lagi supaya pengguna harus mendaftar dulu.
 *
 * Identitas pengguna dibuktikan lewat access token, jadi hanya bisa menghapus akun miliknya sendiri
 * dan hanya jika akun itu baru dibuat lewat Google.
 */
export async function rejectUnregisteredGoogleUser(accessToken: string): Promise<{ removed: boolean }> {
  const admin = createAdminClient();

  const { data, error } = await admin.auth.getUser(accessToken);
  const user = data?.user;
  if (error || !user) return { removed: false };

  const created = new Date(user.created_at).getTime();
  const lastSignIn = new Date(user.last_sign_in_at ?? user.created_at).getTime();
  const isBrandNew = Date.now() - created < NEW_ACCOUNT_WINDOW_MS && Math.abs(lastSignIn - created) < SAME_MOMENT_MS;
  const viaGoogle = user.app_metadata?.provider === 'google';
  if (!isBrandNew || !viaGoogle) return { removed: false }; // akun lama: boleh login

  // Hapus profil di public.users (dibuat oleh trigger) lalu akun loginnya
  await admin.from('users').delete().eq('auth_id', user.id);
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  return { removed: !deleteError };
}