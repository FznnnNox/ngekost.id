'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function PosterModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah menutup poster pada sesi ini
    const hasSeenPoster = sessionStorage.getItem('hasSeenPoster');
    if (!hasSeenPoster) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Simpan ke sessionStorage agar poster tidak muncul terus-menerus setiap pindah halaman
    sessionStorage.setItem('hasSeenPoster', 'true');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="relative max-w-[500px] w-full overflow-hidden rounded-[24px] bg-[#1c1c1c] p-2 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup poster"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-105"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Gambar Poster */}
        <div className="overflow-hidden rounded-[20px]">
          <img
            src="/assets/poster-kosan.jpeg"
            alt="Poster Promosi Kosan"
            className="w-full h-auto object-cover max-h-[80vh]"
          />
        </div>

        {/* Tombol Aksi Opsional di Bawah Poster */}
        <div className="p-4 text-center">
          <p className="text-[13px] text-[#9c9c9c] mb-3">
            Dapatkan penawaran menarik khusus bulan ini!
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-full bg-[#ededed] py-3 text-[14px] font-medium text-[#111] transition-colors hover:bg-white"
          >
            Lihat Kosan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}