'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type Testimonial } from './data';
import * as api from './api';
import { TestimonialTable } from '@/components/admin/testimonials/TestimonialTable';
import { TestimonialModal } from '@/components/admin/testimonials/TestimonialModal';
import { Toast } from '@/components/admin/ui/Toast';

type ToastState = { id: number; message: string; variant: 'success' | 'error' } | null;

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedTrx, setSelectedTrx] = useState<Testimonial | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const notify = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, variant });
  }, []);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    api
      .fetchAllTestimonials()
      .then((data) => setTestimonials(data))
      .catch((e) => notify(e instanceof Error ? e.message : 'Gagal memuat testimoni.', 'error'))
      .finally(() => setLoading(false));
  }, [notify]);

  const filteredTestimonials = useMemo(() => {
    const q = query.trim().toLowerCase();
    return testimonials.filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q)
    );
  }, [testimonials, query]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      notify('Testimoni berhasil dihapus.');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Gagal menghapus testimoni.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#e8e2b8]"
          role="status"
          aria-label="Loading testimonials"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <TestimonialTable
        testimonials={filteredTestimonials}
        query={query}
        setQuery={setQuery}
        onOpenDetail={(item) => setSelectedTrx(item)}
        onDelete={handleDelete}
      />

      {selectedTrx && (
        <TestimonialModal
          testimonial={selectedTrx}
          onClose={() => setSelectedTrx(null)}
        />
      )}

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onClose={closeToast}
        />
      )}
    </div>
  );
}