'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default function DetailTopBar() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between">
      <Link
        href="/#listings"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1e1e1e] px-4 py-2 text-[13px] text-[#cfcfcf] transition-colors hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <button
        type="button"
        onClick={() => setIsSaved(!isSaved)}
        aria-pressed={isSaved}
        aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#1e1e1e] transition-colors hover:bg-white/10"
      >
        <Heart className={`h-4 w-4 ${isSaved ? 'fill-[#ee4b5f] text-[#ee4b5f]' : 'text-white'}`} />
      </button>
    </div>
  );
}