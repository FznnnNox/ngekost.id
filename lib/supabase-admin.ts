import { createClient } from '@supabase/supabase-js';

/**
 * Supabase dengan SERVICE ROLE / SECRET key: melewati RLS dan boleh memakai Auth Admin API.
 * Hanya dipakai di server (Server Action / Route Handler). Jangan pernah diimpor dari komponen 'use client'
 * dan jangan diberi awalan NEXT_PUBLIC_.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local');
  }

  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}