'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { type Transaction } from './data';
import { TransactionTable } from '@/components/admin/transactions/TransactionTable';
import { TransactionModal } from '@/components/admin/transactions/TransactionModal';
import { supabase } from '@/lib/supabase';

export default function TransactionsView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          invoice,
          tenant_name,
          room_name,
          amount,
          status,
          date,
          boarding_houses ( name )
        `)
        .order('id', { ascending: false });

      if (error) {
        console.error('Gagal memuat transaksi:', error);
        return;
      }

      const mapped: Transaction[] = (data || []).map((row: any) => {
        const houseObj = Array.isArray(row.boarding_houses)
          ? row.boarding_houses[0]
          : row.boarding_houses;

        return {
          id: row.id,
          invoice: row.invoice,
          tenantName: row.tenant_name || 'Penyewa',
          boardingHouse: houseObj?.name || 'Boarding House',
          room: row.room_name || 'Standard Room',
          amount: Number(row.amount || 0),
          status: (row.status as Transaction['status']) || 'Pending',
          date: row.date || new Date().toISOString().split('T')[0],
        };
      });

      setTransactions(mapped);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        !q ||
        t.invoice.toLowerCase().includes(q) ||
        t.tenantName.toLowerCase().includes(q) ||
        t.boardingHouse.toLowerCase().includes(q)
    );
  }, [transactions, query]);

  const handleUpdateStatus = async (newStatus: Transaction['status']) => {
    if (!selectedTrx) return;

    const { error } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', selectedTrx.id);

    if (error) {
      alert('Gagal memperbarui status transaksi.');
      return;
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === selectedTrx.id ? { ...t, status: newStatus } : t))
    );
    setSelectedTrx(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction record?')) return;

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      alert('Gagal menghapus transaksi.');
      return;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="rounded-[22px] bg-[#1c1c1c] p-8 text-center text-[13px] text-[#8a8a86]">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <TransactionTable
        transactions={filteredTransactions}
        query={query}
        setQuery={setQuery}
        onOpenDetail={(trx) => setSelectedTrx(trx)}
        onDelete={handleDelete}
      />

      {selectedTrx && (
        <TransactionModal
          transaction={selectedTrx}
          onClose={() => setSelectedTrx(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}