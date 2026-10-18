import React from 'react';
import { ArrowRight, ArrowUp, Building2, Mail, MapPin, Phone } from 'lucide-react';

type FooterLink = { label: string; href: string };

const exploreLinks: FooterLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Listings', href: '#listings' },
  { label: 'Map', href: '#map' },
  { label: 'How It Works', href: '#how-it-works' },
];

const companyLinks: FooterLink[] = [
  { label: 'About Us', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

const socials: FooterLink[] = [
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'WhatsApp', href: '#' },
];

const contact = {
  address: 'Serang, Banten, Indonesia',
  email: 'ngekost.id@gmail.com',
  phone: '+62 812 0000 0000',
};

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="text-[13px] uppercase tracking-[0.12em] text-[#9c9c9c]">{title}</h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-[15px] text-[#ededed] transition-colors hover:text-white/60">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="overflow-hidden bg-[#121212] px-4 pt-16 text-[#ededed] sm:px-8">
        <div className="mx-auto max-w-[1050px] min-[1400px]:max-w-[1200px]">
          {/* CTA */}
          <div className="flex flex-col gap-8 border-b border-white/10 pb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[clamp(24px,4vw,34px)] font-light leading-none">Ready to find your</p>
              <p className="mt-2 text-[clamp(44px,10vw,84px)] font-normal uppercase leading-none tracking-[-0.01em]">
                Kosan?
              </p>
            </div>
            <a
              href="#listings"
              className="group inline-flex h-12 w-fit items-center gap-3 rounded-full bg-[#ededed] pl-6 pr-2 text-[14px] font-medium text-[#111] transition-colors hover:bg-white"
            >
              Browse listings
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#161616] text-white">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>

          {/* Kolom */}
          <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#home" className="inline-flex items-center gap-3">
                <Building2 className="h-7 w-7 fill-white text-white" strokeWidth={1.5} />
                <span className="text-[18px] tracking-wide">Ngekost.id</span>
              </a>
              <p className="mt-5 max-w-[300px] text-[14px] font-light leading-relaxed text-[#9c9c9c]">
                Verified kosan, honest prices, and a real map, so finding a home in Serang is simple.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="inline-flex rounded-full border border-white/15 px-4 py-2 text-[12px] text-[#cfcfcf] transition-colors hover:bg-white hover:text-[#111]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <LinkColumn title="Explore" links={exploreLinks} />
            <LinkColumn title="Company" links={companyLinks} />

            {/* Kontak */}
            <div>
              <h4 className="text-[13px] uppercase tracking-[0.12em] text-[#9c9c9c]">Contact</h4>
              <ul className="mt-5 space-y-4 text-[15px]">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9c9c9c]" />
                  {contact.address}
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-start gap-3 transition-colors hover:text-white/60">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#9c9c9c]" />
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-start gap-3 transition-colors hover:text-white/60">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#9c9c9c]" />
                    {contact.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bar bawah */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-[13px] text-[#9c9c9c] sm:flex-row">
            <p>© {new Date().getFullYear()} Ngekost.id All rights reserved.</p>
            <a
              href="#home"
              aria-label="Back to top"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-[#111]"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div
          aria-hidden
          className="mt-2 pb-20 select-none text-center text-[clamp(72px,19vw,260px)] font-semibold leading-[0.78] tracking-tight text-white/[0.05]"
        >
          Ngekost.id
        </div>
      </div>
    </footer>
  );
}