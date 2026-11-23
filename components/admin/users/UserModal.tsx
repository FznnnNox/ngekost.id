"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";
import { type User } from "./data";

interface UserModalProps {
  title: string;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  role: User["role"];
  setRole: (v: User["role"]) => void;
  status: User["status"];
  setStatus: (v: User["status"]) => void;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEdit: boolean;
}

const card = "rounded-[22px] bg-[#1c1c1c] text-[#ededed]";
const inputClass =
  "h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]";
const btnPrimary =
  "w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-50";
const btnGhost =
  "w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] transition-colors hover:bg-white/5 disabled:opacity-50";
const iconBtn =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]";

export function UserModal({
  title,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  status,
  setStatus,
  isSubmitting = false,
  onClose,
  onSubmit,
  isEdit,
}: UserModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) =>
        e.target === e.currentTarget && !isSubmitting && onClose()
      }
    >
      <div
        className={`${card} max-h-[90vh] w-full max-w-[480px] overflow-y-auto p-5 shadow-2xl`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-medium">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={iconBtn}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
            Full Name*
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmad Fauzan"
              disabled={isSubmitting}
              className={inputClass}
            />
          </label>

          <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
            Email Address*
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@ngekost.id"
              disabled={isSubmitting}
              className={inputClass}
            />
          </label>

          <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
            {isEdit
              ? "New Password (leave blank to keep current)"
              : "Password*"}
            <input
              type="password"
              required={!isEdit}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? "••••••••" : "At least 6 characters"}
              disabled={isSubmitting}
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
              Role*
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as User["role"])}
                disabled={isSubmitting}
                className={inputClass}
              >
                <option value="Admin">Admin</option>
                <option value="Owner">Owner</option>
                <option value="Customer">Customer</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-[12px] text-[#8a8a86]">
              Status*
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as User["status"])}
                disabled={isSubmitting}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          {role === "Admin" && (
            <p className="rounded-xl border border-[#e8e2b8]/20 bg-[#e8e2b8]/10 px-3 py-2 text-[11px] text-[#e8e2b8]">
              Role <strong>Admin</strong> akan memiliki akses penuh ke menu{" "}
              <strong>Dashboard</strong> dan manajemen data sistem.
            </p>
          )}

          <div className="mt-2 flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={btnGhost}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={btnPrimary}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Update User" : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}