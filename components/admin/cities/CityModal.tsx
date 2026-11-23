'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';

interface CityModalProps {
  title: string;
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEdit: boolean;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const inputClass = 'h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]';
const btnPrimary = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-50';
const btnGhost = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] transition-colors hover:bg-white/5 disabled:opacity-50';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function CityModal({
  title,
  name,
  setName,
  slug,
  setSlug,
  isSubmitting = false,
  onClose,
  onSubmit,
  isEdit,
}: CityModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div className={`${card} max-h-[90vh] w-full max-w-[480px] overflow-y-auto p-5 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-medium">{title}</h2>
          <button type="button" onClick={onClose} disabled={isSubmitting} className={iconBtn}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
            City Name*
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Serang"
              disabled={isSubmitting}
              className={inputClass}
            />
          </label>

          <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
            Slug*
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. serang"
              disabled={isSubmitting}
              className={inputClass}
            />
          </label>

          <div className="mt-2 flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className={btnGhost}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={btnPrimary}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Update City' : 'Save City'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}