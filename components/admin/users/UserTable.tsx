'use client';

import React from 'react';
import { Pencil, Plus, Search, Trash2, Loader2 } from 'lucide-react';
import { type User } from './data';

interface UserTableProps {
  users: User[];
  query: string;
  setQuery: (q: string) => void;
  loading?: boolean;
  onOpenAdd: () => void;
  onOpenEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const btnPrimary = 'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90';
const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

export function UserTable({
  users,
  query,
  setQuery,
  loading = false,
  onOpenAdd,
  onOpenEdit,
  onDelete,
}: UserTableProps) {
  return (
    <section className={card}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 pb-4">
        <div>
          <h1 className="text-[18px] font-medium">Users Management</h1>
          <p className="mt-0.5 text-[12px] text-[#8a8a86]">{users.length} users total</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="flex h-10 w-full sm:w-[220px] items-center gap-2 rounded-full bg-[#262626] px-4 text-[12px]">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#8a8a86]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email"
              className="w-full bg-transparent outline-none placeholder:text-[#6b6b68]"
            />
          </label>
          <button type="button" onClick={onOpenAdd} className={btnPrimary}>
            <Plus className="h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_100px] bg-[#161616] px-5 py-2.5 text-[11px] text-[#8a8a86]">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-5 py-12 text-[13px] text-[#8a8a86]">
              <Loader2 className="h-4 w-4 animate-spin text-[#e8e2b8]" />
              Loading users...
            </div>
          ) : (
            <ul>
              {users.length === 0 ? (
                <li className="px-5 py-10 text-center text-[12px] text-[#8a8a86]">No users found.</li>
              ) : (
                users.map((u) => (
                  <li
                    key={u.id}
                    className="grid grid-cols-[2fr_2fr_1fr_1fr_100px] items-center border-t border-white/5 px-5 py-3.5 text-[12px] transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="font-medium text-[#ededed] flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#262626] text-[11px] font-semibold text-[#e8e2b8] border border-white/5 shrink-0">
                        {u.name.charAt(0)}
                      </span>
                      <span className="truncate">{u.name}</span>
                    </span>
                    <span className="text-[#8a8a86] truncate">{u.email}</span>
                    <span>
                      <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-[#e8e2b8]">
                        {u.role}
                      </span>
                    </span>
                    <span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${u.status === 'Active' ? 'bg-[#e8e2b8]/10 text-[#e8e2b8]' : 'bg-white/5 text-[#6b6b68]'}`}>
                        {u.status}
                      </span>
                    </span>
                    <span className="flex justify-end gap-1.5">
                      <button type="button" onClick={() => onOpenEdit(u)} className={iconBtn} aria-label={`Edit ${u.name}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(u.id)}
                        className={`${iconBtn} hover:!bg-[#4a1f1c] hover:text-[#ff9a90]`}
                        aria-label={`Delete ${u.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}