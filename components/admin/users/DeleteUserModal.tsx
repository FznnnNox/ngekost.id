'use client';

import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteUserModalProps {
  userName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const btnDanger = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#4a1f1c] px-5 text-[13px] font-medium text-[#ff9a90] transition-opacity hover:opacity-90 disabled:opacity-50';
const btnGhost = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] transition-colors hover:bg-white/5 disabled:opacity-50';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function DeleteUserModal({
  userName,
  isSubmitting = false,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div className={`${card} max-h-[90vh] w-full max-w-[420px] overflow-y-auto p-5 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#ff9a90]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4a1f1c]/50">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-[16px] font-medium text-[#ededed]">Delete User</h2>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} className={iconBtn}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[13px] text-[#8a8a86] leading-relaxed">
          Are you sure you want to delete user <span className="font-semibold text-[#ededed]">&quot;{userName}&quot;</span>? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button type="button" onClick={onClose} disabled={isSubmitting} className={btnGhost}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isSubmitting} className={btnDanger}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}