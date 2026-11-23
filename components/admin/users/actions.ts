'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type UserRole = 'Admin' | 'Owner' | 'Customer';
export type UserStatus = 'Active' | 'Inactive';

export async function createUserAccount(payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}) {
  try {
    const cleanName = payload.name.trim();
    const cleanEmail = payload.email.trim().toLowerCase();
    const appRole = payload.role.toLowerCase(); // 'admin' | 'owner' | 'customer'

    // 1. Buat user di Supabase Auth + isi app_metadata.role (dibaca navbar & login)
    const { data: authCreated, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: payload.password,
        email_confirm: true,
        app_metadata: {
          role: appRole,
        },
        user_metadata: {
          name: cleanName,
          full_name: cleanName,
          role: payload.role,
        },
      });

    if (authError) {
      return { success: false, error: authError.message };
    }

    // 2. Simpan ke tabel publik 'users'
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name: cleanName,
          email: cleanEmail,
          role: payload.role,
          status: payload.status,
        },
      ])
      .select()
      .single();

    if (dbError) {
      if (authCreated.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(authCreated.user.id);
      }
      return { success: false, error: dbError.message };
    }

    return { success: true, user: dbUser };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal membuat user.' };
  }
}

export async function updateUserAccount(payload: {
  id: number;
  oldEmail: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
}) {
  try {
    const cleanName = payload.name.trim();
    const cleanEmail = payload.email.trim().toLowerCase();
    const appRole = payload.role.toLowerCase();

    // 1. Update tabel publik 'users'
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        name: cleanName,
        email: cleanEmail,
        role: payload.role,
        status: payload.status,
      })
      .eq('id', payload.id)
      .select()
      .single();

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 2. Sinkronkan app_metadata.role, user_metadata, email, dan password di Supabase Auth
    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (!listError && listData?.users) {
      const targetAuthUser = listData.users.find(
        (u) => u.email?.toLowerCase() === payload.oldEmail.toLowerCase()
      );

      if (targetAuthUser) {
        const authUpdatePayload: {
          email?: string;
          password?: string;
          app_metadata: Record<string, unknown>;
          user_metadata: Record<string, unknown>;
        } = {
          email: cleanEmail,
          app_metadata: {
            ...targetAuthUser.app_metadata,
            role: appRole,
          },
          user_metadata: {
            ...targetAuthUser.user_metadata,
            name: cleanName,
            full_name: cleanName,
            role: payload.role,
          },
        };

        if (payload.password && payload.password.trim().length >= 6) {
          authUpdatePayload.password = payload.password.trim();
        }

        const { error: authUpdateErr } =
          await supabaseAdmin.auth.admin.updateUserById(
            targetAuthUser.id,
            authUpdatePayload
          );

        if (authUpdateErr) {
          return { success: false, error: authUpdateErr.message };
        }
      }
    }

    return { success: true, user: dbUser };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal memperbarui user.' };
  }
}

export async function deleteUserCompletely(
  userIdInPublic: number,
  userEmail: string
) {
  try {
    const { error: publicError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userIdInPublic);

    if (publicError) throw publicError;

    const { data: authUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const targetAuthUser = authUsers.users.find(
      (u) => u.email?.toLowerCase() === userEmail.toLowerCase()
    );

    if (targetAuthUser) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
        targetAuthUser.id
      );
      if (authError) throw authError;
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}