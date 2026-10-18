'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import PhotoLightbox from '@/components/listing-detail/PhotoLightbox';

type Props = {
  photos: string[];
  title: string;
};

/** Grid foto: 1 besar di kiri + 4 kecil (2×2) di kanan. Klik foto membuka lightbox. */
export default function PhotoGallery({ photos, title }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const shown = photos.slice(0, 5);
  const extra = photos.length - shown.length;

  return (
    <>
      <section
        aria-label={`${title} photos`}
        className="grid grid-cols-2 gap-2 md:grid-cols-[3.26fr_1fr_1fr] md:grid-rows-2 md:gap-3"
      >
        {shown.map((src, i) => {
          const isLast = i === shown.length - 1;
          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className={`group relative overflow-hidden rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                i === 0 ? 'col-span-2 h-[260px] md:col-span-1 md:row-span-2 md:h-auto' : 'aspect-square'
              }`}
            >
              <img
                src={src}
                alt={`${title} photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {isLast && extra > 0 && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white">
                  <Camera className="h-7 w-7" strokeWidth={1.5} />
                  <span className="text-[16px] font-medium">+{extra} photos</span>
                </span>
              )}
            </button>
          );
        })}
      </section>

      <PhotoLightbox photos={photos} title={title} index={index} onChange={setIndex} />
    </>
  );
}