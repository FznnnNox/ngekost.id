'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  variant = 'success',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isError = variant === 'error';

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur animate-fade-in ${
        isError
          ? 'border-red-500/30 bg-[#2a1515]/95 text-[#ff9a90]'
          : 'border-white/10 bg-[#1c1c1c]/95 text-[#ededed]'
      }`}
    >
      {isError ? (
        <AlertCircle className="h-5 w-5 shrink-0 text-[#ff9a90]" />
      ) : (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#e8e2b8]" />
      )}
      <span className="text-[13px] font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 text-[#8a8a86] hover:text-[#ededed]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}