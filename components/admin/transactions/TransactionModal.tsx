'use client';

import React from 'react';
import { X } from 'lucide-react';
import { rupiah, type Transaction } from './data';

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdateStatus: (newStatus: Transaction['status']) => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const inputClass = 'h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors focus:border-[#e8e2b8]';
const btnPrimary = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function TransactionModal({
  transaction,
  onClose,
  onUpdateStatus,
}: TransactionModalProps) {
  const [status, setStatus] = React.useState<Transaction['status']>(transaction.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${card} max-h-[90vh] w-full max-w-[500px] overflow-y-auto p-5 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-medium">Transaction Detail</h2>
            <p className="text-[12px] text-[#8a8a86]">Invoice: {transaction.invoice}</p>
          </div>
          <button type="button" onClick={onClose} className={iconBtn}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 text-[13px]">
          <div className="rounded-xl bg-[#262626] p-4 grid gap-2.5 border border-white/5">
            <div className="flex justify-between">
              <span className="text-[#8a8a86]">Tenant Name:</span>
              <span className="font-medium text-[#ededed]">{transaction.tenantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8a86]">Boarding House:</span>
              <span className="font-medium text-[#ededed]">{transaction.boardingHouse}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8a86]">Room:</span>
              <span className="font-medium text-[#ededed]">{transaction.room}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8a86]">Amount Paid:</span>
              <span className="font-medium text-[#e8e2b8]">{rupiah(transaction.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8a86]">Date:</span>
              <span className="text-[#ededed]">{transaction.date}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3 pt-2">
            <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
              Update Status*
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Transaction['status'])}
                className={inputClass}
              >
                <option value="Pending">Pending</option>
                <option value="Success">Success</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>

            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] hover:bg-white/5">
                Close
              </button>
              <button type="submit" className={btnPrimary}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}