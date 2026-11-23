'use client';

import React from 'react';

interface RupiahInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export function RupiahInput({
  value,
  onChange,
  className = '',
  placeholder = 'Rp 650.000',
  required = false,
}: RupiahInputProps) {
  // Tampilkan "Rp 650.000" jika ada nilai, kosong jika 0
  const display = value > 0 ? `Rp ${value.toLocaleString('id-ID')}` : '';

  return (
    <input
      type="text"
      inputMode="numeric"
      required={required}
      value={display}
      placeholder={placeholder}
      onChange={(e) => {
        // Buang semua selain angka, lalu simpan sebagai number
        const digits = e.target.value.replace(/\D/g, '');
        onChange(digits ? Number(digits) : 0);
      }}
      className={className}
    />
  );
}