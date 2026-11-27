'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const field =
  'h-12 w-full rounded-xl border border-black/10 bg-[#f4f4f2] pl-11 pr-4 text-[14px] text-[#111] placeholder:text-[#9c9c9c] outline-none transition-colors focus:border-[#111] focus:bg-white focus-visible:ring-2 focus-visible:ring-[#111]/15';

export default function LoginForm() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dikembalikan dari /auth/callback karena akun Google belum terdaftar: arahkan ke mode daftar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err === 'not_registered') {
      setIsRegister(true);
      setError('Akun Google ini belum terdaftar. Silakan daftar terlebih dahulu.');
      window.history.replaceState(null, '', '/login');
    } else if (err === 'check_failed') {
      setError('Login dengan Google gagal diverifikasi. Silakan coba lagi.');
      window.history.replaceState(null, '', '/login');
    }
  }, []);

  // Google: mode "login" hanya untuk akun yang sudah terdaftar, mode "daftar" membuat akun baru
  async function handleGoogle() {
    setError('');
    setSuccessMsg('');
    setGoogleLoading(true);

    try {
      // Niat dibaca lagi di /auth/callback untuk memutuskan akun baru boleh dipakai atau tidak
      sessionStorage.setItem('oauth_intent', isRegister ? 'register' : 'login');

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      sessionStorage.removeItem('oauth_intent');
      setError(err.message || 'Gagal terhubung dengan Google.');
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password || (isRegister && !fullName)) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // --- PROSES REGISTER / SIGN UP ---
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

        if (signUpError) throw signUpError;

        setSuccessMsg('Registrasi berhasil! Silakan masuk menggunakan akun yang baru dibuat.');
        setIsRegister(false);
        setPassword('');
        setFullName('');
      } else {
        // --- PROSES LOGIN / SIGN IN ---
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('The account is not registered, or the email/password is incorrect. Please create an account first.');
          }
          throw new Error(signInError.message);
        }

        if (data.session) {
          // Hanya admin yang masuk ke dashboard; pengguna biasa ke beranda
          router.push(data.user?.app_metadata?.role === 'admin' ? '/admin/dashboard' : '/');
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center px-5 py-12 sm:px-10">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[400px]">
        <div className="mb-10 flex items-center gap-2.5 text-[18px] font-semibold tracking-tight lg:hidden">
          <Building2 className="h-7 w-7 fill-[#111]" strokeWidth={1.5} />
          Ngekost.id
        </div>

        <h1 className="text-[32px] font-medium tracking-tight">
          {isRegister ? 'Create an account' : 'Log in'}
        </h1>
        <p className="mt-1.5 text-[14px] font-light text-[#8a8a86]">
          {isRegister ? 'Daftar akun baru untuk mengakses sistem.' : 'Admin access only.'}
        </p>

        <div className="mt-8 grid gap-5">
          {isRegister && (
            <label className="grid gap-2 text-[13px]">
              Full Name
              <span className="relative block">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a86]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className={field}
                />
              </span>
            </label>
          )}

          <label className="grid gap-2 text-[13px]">
            Email address
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a86]" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ngekost.id"
                className={field}
              />
            </span>
          </label>

          <label className="grid gap-2 text-[13px]">
            Password
            <span className="relative block">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a86]" />
              <input
                type={show ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${field} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8a8a86] transition-colors hover:text-[#111]"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          {!isRegister && (
            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#8a8a86]">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="peer sr-only" />
              <span className="h-4 w-4 rounded-full border border-black/30 transition-colors peer-checked:border-[#111] peer-checked:bg-[#111] peer-focus-visible:ring-2 peer-focus-visible:ring-[#111]/30" />
              Remember me
            </label>
          )}

          {error && (
            <p role="alert" className="rounded-xl border border-[#f5c6c1] bg-[#fdecea] px-4 py-3 text-[13px] text-[#a12a1f]">
              {error}
            </p>
          )}

          {successMsg && (
            <p role="status" className="rounded-xl border border-[#b7eb8f] bg-[#f6ffed] px-4 py-3 text-[13px] text-[#389e0d]">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-xl bg-[#111] text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : isRegister ? 'Sign up' : 'Sign in'}
          </button>

          <div className="my-1 flex items-center">
            <div className="flex-grow border-t border-black/10"></div>
            <span className="px-3 text-[12px] text-[#8a8a86]">Or continue with</span>
            <div className="flex-grow border-t border-black/10"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex h-12 items-center justify-center gap-3 rounded-xl border border-black/10 bg-white text-[14px] font-medium text-[#111] shadow-sm transition-colors hover:bg-[#f4f4f2] disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.15v3.15C3.19 21.32 7.27 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.15C.42 8.1 0 9.79 0 12s.42 3.9 1.15 5.4l4.12-3.16z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.27 0 3.19 2.68 1.15 6.6l4.12 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            {googleLoading ? 'Connecting...' : isRegister ? 'Sign up with Google' : 'Sign in with Google'}
          </button>

          <div className="flex items-center justify-between pt-2 text-[13px] text-[#8a8a86]">
            <span>{isRegister ? 'Already have an account?' : 'Dont have an account yet?'}</span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccessMsg('');
              }}
              className="font-medium text-[#111] underline underline-offset-4 hover:opacity-70"
            >
              {isRegister ? 'Log in here' : 'Create an account'}
            </button>
          </div>

          <p className="border-t border-black/5 pt-2 text-[13px] text-[#8a8a86]">
            <Link href="/find-kos" className="font-medium text-[#111] underline underline-offset-4 hover:opacity-70">
              Browse kos
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}