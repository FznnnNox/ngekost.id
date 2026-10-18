'use client';

import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type Props = {
  photos: string[];
  title: string;
  index: number | null; // null = tertutup
  onChange: (index: number | null) => void;
};

export default function PhotoLightbox({ photos, title, index, onChange }: Props) {
  const open = index !== null;
  const close = useCallback(() => onChange(null), [onChange]);
  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      onChange((index + d + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  // Kunci scroll halaman + tombol keyboard
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, go]);

  // Gulirkan thumbnail aktif ke area terlihat
  useEffect(() => {
    if (!open) return;
    document
      .querySelector<HTMLElement>('[data-thumb-active="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [open, index]);

  if (!open || index === null) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      data-lenis-prevent
      onClick={close}
      className="fixed inset-0 z-[100] bg-[#0b0b0b]/95 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close photos"
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 sm:right-6 sm:top-6"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="flex h-full flex-col gap-4 p-4 pt-20 sm:p-8 sm:pt-20 lg:flex-row lg:items-center lg:gap-8 lg:px-16 lg:pt-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Foto besar */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <img
            src={photos[index]}
            alt={`${title} photo ${index + 1}`}
            className="max-h-[56vh] w-full rounded-[24px] object-contain lg:max-h-[82vh]"
          />

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#161616]/85 text-white ring-1 ring-white/15 transition-colors hover:bg-black"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#161616]/85 text-white ring-1 ring-white/15 transition-colors hover:bg-black"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <span className="absolute bottom-3 rounded-full bg-black/60 px-3 py-1 text-[12px] text-white backdrop-blur">
            {index + 1} / {photos.length}
          </span>
        </div>

        {/* Thumbnail: strip vertikal di desktop, horizontal di HP */}
        <ul
          data-lenis-prevent
          className="flex shrink-0 gap-3 overflow-x-auto pb-1 lg:h-[82vh] lg:w-[190px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1"
        >
          {photos.map((src, i) => {
            const active = i === index;
            return (
              <li key={`${src}-${i}`} className="shrink-0">
                <button
                  type="button"
                  data-thumb-active={active}
                  onClick={() => onChange(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={active}
                  className={`block overflow-hidden rounded-2xl ring-2 transition-all ${
                    active ? 'ring-white' : 'opacity-60 ring-transparent hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="h-[72px] w-[104px] object-cover lg:h-[118px] lg:w-full" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}