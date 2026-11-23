'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Building2, ChevronDown, LogOut, Menu, Search, Settings, X } from 'lucide-react';
import { dashboardNav, isActivePath, isItemActive } from '@/components/admin/nav';
import { supabase } from '@/lib/supabase';

const muted = 'text-[#8a8a86]';
const iconBtn = 'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1c] transition-colors hover:bg-[#262626]';
const activeLink = "relative text-white after:absolute after:-bottom-[7px] after:left-0 after:h-px after:w-[22px] after:bg-white after:content-['']";

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [profileDropdown, setProfileDropdown] = useState(false); // State untuk menu profil
  const navRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // State untuk menyimpan data user aktif
  const [userName, setUserName] = useState<string>('Admin');
  const [userEmail, setUserEmail] = useState<string>('Ngekost.id');

  useEffect(() => {
    const fetchActiveUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email || '';
        setUserEmail(email);

        const { data: profile } = await supabase
          .from('users')
          .select('name')
          .eq('email', email)
          .single();

        if (profile?.name) {
          setUserName(profile.name);
        } else {
          setUserName(email.split('@')[0]);
        }
      }
    };

    fetchActiveUser();
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
    setProfileDropdown(false);
  }, [pathname]);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdown(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdown(null);
        setProfileDropdown(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const initial = userName ? userName.charAt(0).toUpperCase() : 'A';

  return (
    <header className="relative z-40 flex items-center justify-between gap-4 px-2 pb-4 pt-1">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-[18px] font-semibold tracking-tight">
          <Building2 className="h-6 w-6 fill-white" strokeWidth={1.5} />
          Ngekost.
        </Link>

        {/* Menu desktop */}
        <nav ref={navRef} className="hidden items-center gap-7 text-[12px] lg:flex" aria-label="Dashboard">
          {dashboardNav.map((item) => {
            const active = isItemActive(pathname, item);

            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={active ? activeLink : `${muted} transition-colors hover:text-white`}
                >
                  {item.label}
                </Link>
              );
            }

            const open = dropdown === item.label;
            return (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  onClick={() => setDropdown(open ? null : item.label)}
                  className={`flex items-center gap-1 ${active ? activeLink : `${muted} transition-colors hover:text-white`}`}
                >
                  {item.label}
                  <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <ul role="menu" className="absolute left-0 top-full mt-4 w-44 rounded-2xl border border-white/10 bg-[#1c1c1c] p-1.5 shadow-xl">
                    {item.children.map((c) => (
                      <li key={c.href} role="none">
                        <Link
                          role="menuitem"
                          href={c.href}
                          className={`block rounded-xl px-3 py-2 transition-colors ${isActivePath(pathname, c.href) ? 'bg-white/10 text-white' : `${muted} hover:bg-white/5 hover:text-white`}`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" aria-label="Search" className={iconBtn}>
          <Search className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Notifications" className={iconBtn}>
          <Bell className="h-4 w-4" />
        </button>
        
        {/* Dropdown Profil Pengguna */}
        <div ref={profileRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setProfileDropdown((v) => !v)}
            aria-expanded={profileDropdown}
            aria-haspopup="menu"
            className="flex h-10 items-center gap-2.5 rounded-full border border-white/10 bg-[#1c1c1c] py-1 pl-1 pr-3 transition-colors hover:bg-[#262626]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e2b8] text-[12px] font-semibold text-[#111]">
              {initial}
            </span>
            <span className="text-left leading-tight max-w-[120px] truncate">
              <span className="block text-[12px] truncate font-medium">{userName}</span>
              <span className={`block text-[10px] truncate ${muted}`}>{userEmail}</span>
            </span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${profileDropdown ? 'rotate-180' : ''}`} />
          </button>

          {profileDropdown && (
            <div role="menu" className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 bg-[#1c1c1c] p-1.5 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-[12px] font-medium text-white truncate">{userName}</p>
                <p className="text-[10px] text-[#8a8a86] truncate">{userEmail}</p>
              </div>
              
              <Link
                role="menuitem"
                href="/admin/settings"
                onClick={() => setProfileDropdown(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] text-[#cfcfcf] transition-colors hover:bg-white/5 hover:text-white"
              >
                <Settings className="h-4 w-4 text-[#8a8a86]" />
                Settings
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] text-[#ff9a90] transition-colors hover:bg-[#4a1f1c]/50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Tombol menu mobile */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className={`${iconBtn} lg:hidden`}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <nav aria-label="Dashboard" className="absolute inset-x-0 top-[60px] rounded-3xl border border-white/10 bg-[#1c1c1c] p-2 shadow-2xl lg:hidden">
          {dashboardNav.map((item) =>
            item.children ? (
              <div key={item.label} className="mt-1 border-t border-white/10 pt-2">
                <p className={`px-4 pb-1 pt-1 text-[10px] uppercase tracking-wider ${muted}`}>{item.label}</p>
                {item.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className={`block rounded-2xl px-4 py-2.5 text-[14px] ${isActivePath(pathname, c.href) ? 'bg-white/10 text-white' : 'text-[#cfcfcf] hover:bg-white/5'}`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isItemActive(pathname, item) ? 'page' : undefined}
                className={`block rounded-2xl px-4 py-2.5 text-[14px] ${isItemActive(pathname, item) ? 'bg-white/10 text-white' : 'text-[#cfcfcf] hover:bg-white/5'}`}
              >
                {item.label}
              </Link>
            ),
          )}

          {/* Menu Tambahan Akun di Mobile */}
          <div className="mt-2 border-t border-white/10 pt-2">
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[14px] text-[#cfcfcf] hover:bg-white/5"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-[14px] text-[#ff9a90] hover:bg-[#4a1f1c]/50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}