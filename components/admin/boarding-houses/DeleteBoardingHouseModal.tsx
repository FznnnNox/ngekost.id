'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteBoardingHouseModalProps {
  houseName: string;
  roomCount: number;
  bonusCount: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const btnDanger = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#4a1f1c] px-5 text-[13px] font-medium text-[#ff9a90] transition-opacity hover:opacity-90 disabled:opacity-50';
const btnGhost = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] transition-colors hover:bg-white/5 disabled:opacity-50';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function DeleteBoardingHouseModal({
  houseName,
  roomCount,
  bonusCount,
  isSubmitting = false,
  onClose,
  onConfirm,
}: DeleteBoardingHouseModalProps) {
  // Tutup dengan Escape, kecuali saat proses hapus berjalan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSubmitting, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-house-title"
        className={`${card} max-h-[90vh] w-full max-w-[420px] overflow-y-auto p-5 shadow-2xl`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#ff9a90]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4a1f1c]/50">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 id="delete-house-title" className="text-[16px] font-medium text-[#ededed]">
              Delete Boarding House
            </h2>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} className={iconBtn}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[13px] text-[#8a8a86] leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-[#ededed]">&quot;{houseName}&quot;</span>?
        </p>

        {(roomCount > 0 || bonusCount > 0) && (
          <div className="mt-3 rounded-xl bg-[#4a1f1c]/30 px-3 py-2.5 text-[12px] text-[#ff9a90]">
            This will also permanently delete{' '}
            {roomCount > 0 && <span className="font-medium">{roomCount} room(s)</span>}
            {roomCount > 0 && bonusCount > 0 && ' and '}
            {bonusCount > 0 && <span className="font-medium">{bonusCount} bonus(es)</span>}.
          </div>
        )}

        <p className="mt-3 text-[12px] text-[#8a8a86]">This action cannot be undone.</p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button type="button" onClick={onClose} disabled={isSubmitting} className={btnGhost}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isSubmitting} className={btnDanger}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Boarding House
          </button>
        </div>
      </div>
    </div>
  );
}