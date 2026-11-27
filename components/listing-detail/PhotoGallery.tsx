'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import PhotoLightbox from '@/components/listing-detail/PhotoLightbox';

type Props = {
  photos: string[];
  title: string;
};

/** Grid foto: 1 besar di kiri + thumbnail di kanan. Klik foto membuka lightbox. */
export default function PhotoGallery({ photos, title }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const shown = photos.slice(0, 5);
  const extra = photos.length - shown.length;
  const count = shown.length;

  const getTileClass = (i: number) => {
    if (count === 1) {
      return 'col-span-2 h-[280px] sm:h-[360px] md:col-span-3 md:row-span-2 md:h-[420px]';
    }

    if (i === 0) {
      return 'col-span-2 h-[260px] sm:h-[320px] md:col-span-1 md:row-span-2 md:h-[420px]';
    }

    // Jika hanya ada 2 foto, foto ke-2 mengisi penuh sisi kanan (2 kolom x 2 baris)
    if (count === 2) {
      return 'col-span-2 h-[220px] sm:h-[260px] md:col-span-2 md:row-span-2 md:h-full';
    }

    // Jika ada 3 foto, foto ke-2 di atas (2 kolom) dan foto ke-3 di bawah (2 kolom)
    if (count === 3) {
      return 'col-span-2 h-[180px] sm:h-[200px] md:col-span-2 md:row-span-1 md:h-full';
    }

    // Jika ada 4 foto: foto ke-2 & ke-3 di baris atas, foto ke-4 memanjang di baris bawah kanan
    if (count === 4 && i === 3) {
      return 'col-span-2 h-[180px] sm:h-[200px] md:col-span-2 md:row-span-1 md:h-full';
    }

    // Default (5 foto): 2x2 di sisi kanan mengikuti tinggi baris grid
    return 'aspect-square sm:aspect-auto sm:h-[200px] md:aspect-auto md:h-full';
  };

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
              className={`group relative overflow-hidden rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${getTileClass(i)}`}
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