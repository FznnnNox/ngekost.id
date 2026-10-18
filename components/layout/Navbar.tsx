"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/#about" },
  { label: "Listings", href: "/#listings" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Search", href: "/find-kos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

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
          ? "fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300"
          : "px-4 sm:px-8 lg:px-0 transition-all duration-300"
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
        {/* Logo redirect ke beranda */}
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
        <div className="absolute left-[215px] top-1/2 hidden -translate-y-1/2 items-center gap-[40px] text-[14px] font-light text-[#d8d8d8] md:flex">
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

        {/* Login CTA Desktop */}
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center md:flex">
          <Link
            href="/login"
            className="px-6 py-2 text-[14px] font-light text-white bg-white/10 rounded-full border border-white/20 transition-all hover:bg-white/20 hover:border-white/30"
          >
            Login
          </Link>
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
          <div className="absolute inset-x-0 top-[78px] z-30 rounded-3xl bg-[#1f1f1f] p-2 shadow-xl md:hidden">
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
            <div className="border-t border-white/10 mt-2 pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-center text-[14px] font-light text-white bg-white/10 rounded-2xl border border-white/20 transition-all hover:bg-white/20"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}