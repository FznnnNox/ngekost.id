'use client';

import React from 'react';
import { Eye, Search, Trash2 } from 'lucide-react';
import { rupiah, type Transaction } from './data';

interface TransactionTableProps {
  transactions: Transaction[];
  query: string;
  setQuery: (q: string) => void;
  onOpenDetail: (trx: Transaction) => void;
  onDelete: (id: number) => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function TransactionTable({
  transactions,
  query,
  setQuery,
  onOpenDetail,
  onDelete,
}: TransactionTableProps) {
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Success':
        return 'bg-[#e8e2b8]/10 text-[#e8e2b8]';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-white/5 text-[#6b6b68]';
    }
  };

  return (
    <section className={card}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 pb-4">
        <div>
          <h1 className="text-[18px] font-medium">Transactions Management</h1>
          <p className="mt-0.5 text-[12px] text-[#8a8a86]">{transactions.length} transactions total</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="flex h-10 w-full sm:w-[240px] items-center gap-2 rounded-full bg-[#262626] px-4 text-[12px]">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search invoice or tenant name"
              className="w-full bg-transparent outline-none placeholder:text-[#6b6b68]"
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[850px]">
          <div className="grid grid-cols-[1.2fr_1.5fr_1.8fr_1.2fr_1fr_1fr_96px] bg-[#161616] px-5 py-2.5 text-[11px] text-[#8a8a86]">
            <span>Invoice</span>
            <span>Tenant Name</span>
            <span>Boarding House & Room</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>
          <ul>
            {transactions.length === 0 ? (
              <li className="px-5 py-10 text-center text-[12px] text-[#8a8a86]">No transactions found.</li>
            ) : (
              transactions.map((trx) => (
                <li
                  key={trx.id}
                  className="grid grid-cols-[1.2fr_1.5fr_1.8fr_1.2fr_1fr_1fr_96px] items-center border-t border-white/5 px-5 py-3.5 text-[12px] transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-medium text-[#e8e2b8]">{trx.invoice}</span>
                  <span className="text-[#ededed] truncate">{trx.tenantName}</span>
                  <span className="text-[#8a8a86] truncate">
                    <span className="block text-[#ededed]">{trx.boardingHouse}</span>
                    <span className="text-[10px]">{trx.room}</span>
                  </span>
                  <span className="font-medium text-[#ededed]">{rupiah(trx.amount)}</span>
                  <span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(trx.status)}`}>
                      {trx.status}
                    </span>
                  </span>
                  <span className="text-[#8a8a86]">{trx.date}</span>
                  <span className="flex justify-end gap-1.5">
                    <button type="button" onClick={() => onOpenDetail(trx)} className={iconBtn} aria-label={`View invoice ${trx.invoice}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(trx.id)}
                      className={`${iconBtn} hover:!bg-[#4a1f1c] hover:text-[#ff9a90]`}
                      aria-label={`Delete ${trx.invoice}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}