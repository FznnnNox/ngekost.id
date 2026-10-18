'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with your admin auth (NextAuth / Supabase / custom API)
      await new Promise((r) => setTimeout(r, 800));
    } catch {
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const input =
    'w-full rounded-2xl border border-[#e4e4e0] bg-white px-4 py-3 text-[14px] text-[#111] placeholder:text-[#9c9c9c] outline-none transition focus:border-[#121212] focus-visible:ring-2 focus-visible:ring-[#121212]/20';

  return (
    <div className="mx-auto grid max-w-[1280px] gap-4 lg:grid-cols-[1fr_420px]">
      {/* Dark card: what admins can do */}
      <aside className="hidden flex-col justify-between rounded-[32px] bg-[#121212] p-8 text-[#f4f4f2] lg:flex">
        <div>
          <p className="text-[14px] font-light text-[#9c9c9c]">Admin dashboard</p>
          <h2 className="mt-3 max-w-[420px] text-4xl font-light leading-tight">
            Keep kos listings near UNPAM Serang accurate and up to date.
          </h2>
        </div>
        <ul className="mt-10 grid gap-3">
          {[
            ['Manage listings', 'Add, edit, or remove kos from the directory.'],
            ['Update prices and availability', 'Keep rooms and rates current for visitors.'],
            ['Maintain owner contacts', "Make sure each listing's WhatsApp number is correct."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-[#1f1f1f] px-5 py-4">
              <p className="text-[15px]">{t}</p>
              <p className="text-[13px] font-light text-[#9c9c9c]">{d}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-[32px] bg-white p-6 sm:p-8"
      >
        <h2 className="text-2xl font-light">Admin sign in</h2>
        <p className="mt-1 text-[14px] font-light text-[#9c9c9c]">
          Not an admin?{' '}
          <Link href="/find-kos" className="text-[#111] underline underline-offset-4">
            Browse kos
          </Link>
        </p>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2 text-[14px]">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ngekost.id"
              className={input}
            />
          </label>

          <label className="grid gap-2 text-[14px]">
            Password
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${input} pr-20`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#9c9c9c] hover:text-[#111]"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="rounded-2xl bg-[#fdecea] px-4 py-3 text-[13px] text-[#a12a1f]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#121212] px-6 py-3.5 text-[15px] text-[#f4f4f2] transition hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}