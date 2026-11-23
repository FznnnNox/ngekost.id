'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Heart, MapPin, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDistance, formatPrice, type Kos } from '@/components/find-kos/data';

const WISHLIST_KEY = 'ngekost:wishlist';

const readWishlist = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]');
  } catch {
    return [];
  }
};

type Props = {
  kos: Kos;
  selected: boolean;
  onSelect: (id: number) => void;
  onHover: (id: number | null) => void;
};

export default function KosCard({ kos: k, selected, onSelect, onHover }: Props) {
  const [wished, setWished] = useState(false);

  useEffect(() => {
    let active = true;
    const localHas = readWishlist().includes(k.id);
    setWished(localHas);

    const syncWishlist = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active || !session?.user) return;

      const { data, error } = await supabase
        .from('wishlists')
        .select('boarding_house_id')
        .eq('user_id', session.user.id)
        .eq('boarding_house_id', k.id)
        .maybeSingle();

      if (!active || error) return;
      setWished(Boolean(data));
    };

    syncWishlist();
    return () => {
      active = false;
    };
  }, [k.id]);

  const toggleWish = async () => {
    const nextWished = !wished;
    setWished(nextWished);

    const list = readWishlist();
    const nextLocal = nextWished
      ? Array.from(new Set([...list, k.id]))
      : list.filter((id) => id !== k.id);

    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(nextLocal));
    } catch {
      /* penyimpanan browser tidak tersedia */
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    if (nextWished) {
      await supabase
        .from('wishlists')
        .insert({ user_id: session.user.id, boarding_house_id: k.id });
    } else {
      await supabase
        .from('wishlists')
        .delete()
        .match({ user_id: session.user.id, boarding_house_id: k.id });
    }
  };

  const detailHref = `/listings/${encodeURIComponent(k.slug || String(k.id))}`;

  return (
    <article
      onMouseEnter={() => onHover(k.id)}
      onMouseLeave={() => onHover(null)}
      className="group"
    >
      {/* Foto: klik untuk menyorot pin di peta */}
      <div
        className={`relative overflow-hidden rounded-[24px] bg-[#e9e9e6] transition-shadow ${
          selected ? 'ring-2 ring-[#0f7b62] ring-offset-2 ring-offset-white' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect(k.id)}
          aria-label={`Show ${k.name} on the map`}
          aria-pressed={selected}
          className="block aspect-[4/5] w-full overflow-hidden"
        >
          <img
            src={k.img}
            alt={`${k.name} kosan`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>

        {/* CTA ke halaman detail */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <Link
            href={detailHref}
            aria-label={`View details of ${k.name}`}
            className="pointer-events-none flex items-center gap-2.5 rounded-[8px] bg-[#fff] px-5 py-2 text-[12px] font-medium text-black shadow-xl transition-transform duration-300 hover:scale-105 group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
          >
            <ExternalLink className="h-4 w-4" />
            View details
          </Link>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={toggleWish}
          aria-pressed={wished}
          aria-label={
            wished ? `Remove ${k.name} from wishlist` : `Add ${k.name} to wishlist`
          }
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wished ? 'fill-[#e5484d] text-[#e5484d]' : ''
            }`}
          />
        </button>
      </div>

      {/* Keterangan di bawah foto */}
      <div className="px-1 pt-3">
        <p className="flex items-center gap-1 text-[12px] text-[#555]">
          <Star className="h-3 w-3 fill-[#f5b301] text-[#f5b301]" />
          <span className="font-medium text-[#111]">{k.rating}</span>
          <span className="text-[#999]">({k.reviews})</span>
        </p>

        <h3 className="mt-1.5 truncate text-[15px] font-semibold tracking-tight text-[#111]">
          <Link
            href={detailHref}
            className="hover:underline underline-offset-4"
          >
            {k.name}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1 truncate text-[12px] text-[#777]">
          <MapPin className="h-3 w-3 shrink-0" />
          {k.area}
        </p>

        <p className="mt-1 truncate text-[12px] text-[#999]">
          {k.size} ·{' '}
          <span className="text-[#0f7b62]">
            {formatDistance(k.distance)} from campus
          </span>{' '}
          · {k.left} left
        </p>

        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-[20px] font-semibold tracking-tight text-[#111]">
            {formatPrice(k.price)}
          </span>
          <span className="text-[11px] text-[#999]">/month</span>
        </p>
      </div>
    </article>
  );
}