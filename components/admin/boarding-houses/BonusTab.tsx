'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Bonus } from '@/components/admin/boarding-houses/data';

interface BonusTabProps {
  bonuses: Bonus[];
  onAddBonus: (name: string, description: string) => void;
  onDeleteBonus: (id: number) => void;
}

const inputClass =
  'h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]';
const btnPrimary =
  'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90';
const iconBtn =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function BonusTab({ bonuses, onAddBonus, onDeleteBonus }: BonusTabProps) {
  const [bonusName, setBonusName] = useState('');
  const [bonusDesc, setBonusDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusName.trim()) return;
    onAddBonus(bonusName, bonusDesc);
    setBonusName('');
    setBonusDesc('');
  };

  return (
    <div className="grid gap-5">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-[#262626] p-4 grid gap-3">
        <h3 className="text-[13px] font-medium text-[#e8e2b8]">Tambah Bonus</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
            Name
            <input
              value={bonusName}
              onChange={(e) => setBonusName(e.target.value)}
              placeholder="Free Wi-Fi"
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
            Description
            <input
              value={bonusDesc}
              onChange={(e) => setBonusDesc(e.target.value)}
              placeholder="Speed 100Mbps"
              className={inputClass}
            />
          </label>
        </div>
        <div className="flex justify-end mt-1">
          <button type="submit" className={btnPrimary}>
            <Plus className="h-3.5 w-3.5" /> Add to bonus
          </button>
        </div>
      </form>

      <div>
        <h3 className="mb-3 text-[12px] font-medium text-[#8a8a86]">Daftar Bonus</h3>
        {bonuses.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-[#8a8a86]">Belum ada bonus.</p>
        ) : (
          <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {bonuses.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#262626] p-3 text-[12px]"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[#e8e2b8] truncate">{b.name}</p>
                  <p className="text-[#8a8a86] truncate">{b.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteBonus(b.id)}
                  className={iconBtn}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}