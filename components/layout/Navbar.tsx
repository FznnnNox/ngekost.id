"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import {
  Building2,
  Menu,
  X,
  LayoutDashboard,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const links = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/#about" },
  { label: "Listings", href: "/#listings" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Search", href: "/find-kos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil jumlah item wishlist langsung dari database Supabase secara real-time
  useEffect(() => {
    const updateWishlistCount = async () => {
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      if (!userId) {
        setWishlistCount(0);
        return;
      }

      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (!error && count !== null) {
        setWishlistCount(count);
      } else {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();

    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("storage", updateWishlistCount);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("storage", updateWishlistCount);
    };
  }, []);

  // Tutup dropdown jika klik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const applySession = (session: Session | null) => {
      if (session) {
        const meta = session.user.user_metadata;
        setIsLoggedIn(true);
        setUserName(
          meta?.full_name ||
            meta?.name ||
            session.user.email?.split("@")[0] ||
            "User",
        );
        setIsAdmin(session.user.app_metadata?.role === "admin");
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserName("");
      }
    };

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      applySession(session),
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName("");
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (isHome) {
      return href.startsWith("/#") && activeLink === href.replace("/#", "");
    }
    return !href.includes("#") && pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (!isHome) return;

      const sections = links.map((link) =>
        link.href.startsWith("/#")
          ? document.getElementById(link.href.replace("/#", ""))
          : null,
      );

      let active = "home";
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop - 100 <= window.scrollY) {
          active = links[i].href.replace("/#", "");
          break;
        }
      }
      setActiveLink(active);
    };

    const handleHashChange = () => {
      if (!isHome) return;
      setActiveLink(window.location.hash.slice(1) || "home");
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", handleHashChange);

    handleScroll();
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isHome]);

  return (
    <div
      className={`${
        scrolled
          ? "fixed top-0 left-0 right-0 z-50 bg-[#121212]/85 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300"
          : "relative z-50 px-4 sm:px-8 lg:px-0 transition-all duration-300"
      }`}
    >
      <nav
        className={`
          relative mx-auto h-[86px] w-full max-w-[720px]
          lg:w-[1050px] lg:max-w-none
          min-[1024px]:[zoom:0.88]
          min-[1130px]:[zoom:1]
          min-[1400px]:[zoom:1.15]
          min-[1700px]:[zoom:1.3]
          min-[2000px]:[zoom:1.5]
          ${scrolled ? "px-4 sm:px-8 lg:px-0" : ""}
        `}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/#home"
          className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-3"
        >
          <Building2
            className="h-7 w-7 fill-white text-white"
            strokeWidth={1.5}
          />
          <span className="text-[18px] tracking-wide text-[#f2f2f2]">
            Ngekost.id
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="absolute left-[215px] top-1/2 hidden -translate-y-1/2 items-center gap-[35px] text-[14px] font-light text-[#d8d8d8] md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={
                isActive(l.href)
                  ? "relative text-white after:absolute after:-bottom-[7px] after:left-0 after:h-px after:w-[27px] after:bg-white after:content-[''] transition-all"
                  : "transition-colors hover:text-white"
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Wishlist dengan Counter, Username Dropdown & Login Desktop */}
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 md:flex">
          <Link
            href="/wishlist"
            aria-label="Wishlist Kos"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white transition-all hover:bg-white/20 hover:scale-105"
          >
            <Heart className="h-4 w-4 text-red-400 fill-red-400/20" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white shadow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-2 px-3.5 py-2 text-[13px] font-light text-white bg-white/5 rounded-full border border-white/10 transition-all hover:bg-white/10 cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-[#e8e2b8]" />
                <span className="max-w-[120px] truncate">{userName}</span>
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-[100] w-52 pt-2"
                >
                  <div className="rounded-2xl bg-[#1f1f1f] border border-white/10 p-1.5 shadow-2xl animate-in fade-in duration-150 flex flex-col gap-0.5">
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex cursor-pointer items-center justify-start gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl hover:bg-white/10 transition-colors text-left"
                      >
                        <LayoutDashboard className="h-4 w-4 shrink-0 text-[#e8e2b8]" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      role="menuitem"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                      className="flex cursor-pointer items-center justify-start gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-red-400 rounded-xl hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 text-[14px] font-light text-white bg-white/10 rounded-full border border-white/20 transition-all hover:bg-white/20 hover:border-white/30"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute inset-x-0 top-[78px] z-40 rounded-3xl bg-[#1f1f1f] p-3 shadow-xl md:hidden border border-white/10">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-2xl px-4 py-3 text-[15px] transition-all ${
                  isActive(l.href)
                    ? "bg-white/10 text-white"
                    : "text-[#cfcfcf] hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-[14px] font-light text-white bg-white/5 rounded-2xl border border-white/10 transition-all hover:bg-white/10"
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-400 fill-red-400/20" /> Wishlist Kosan
                </span>
                {wishlistCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-medium text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-start gap-2.5 px-4 py-2 text-[13px] text-[#e8e2b8] bg-white/5 rounded-2xl border border-white/10">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{userName}</span>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-start gap-2.5 px-4 py-2.5 text-[14px] font-light text-white bg-[#e8e2b8]/20 rounded-2xl border border-[#e8e2b8]/40 transition-all text-left"
                    >
                      <LayoutDashboard className="h-4 w-4 shrink-0 text-[#e8e2b8]" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-start gap-2.5 px-4 py-2.5 text-[14px] font-light text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20 transition-all cursor-pointer text-left"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Keluar (Logout)</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-center text-[14px] font-light text-white bg-white/10 rounded-2xl border border-white/20 transition-all hover:bg-white/20"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}