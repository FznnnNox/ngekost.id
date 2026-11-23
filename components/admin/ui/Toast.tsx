'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-[#1c1c1c] px-4 py-3 text-[#ededed] shadow-2xl border border-white/10 animate-fade-in">
      <CheckCircle2 className="h-5 w-5 text-[#e8e2b8] shrink-0" />
      <span className="text-[13px] font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-[#8a8a86] hover:text-[#ededed]">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}