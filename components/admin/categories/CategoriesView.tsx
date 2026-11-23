'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify, type Category } from './data';
import { CategoryTable } from '@/components/admin/categories/CategoryTable';
import { CategoryModal } from '@/components/admin/categories/CategoryModal';
import { DeleteCategoryModal } from '@/components/admin/categories/DeleteCategoryModal';
import { Toast } from '@/components/admin/ui/Toast';

export default function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [modalState, setModalState] = useState<{ kind: 'add' | 'edit'; item?: Category } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Toast Notification State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch Categories dari Supabase
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching categories:', error.message);
    } else if (data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories berdasarkan pencarian
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, query]);

  const handleOpenAdd = () => {
    setName('');
    setSlug('');
    setEditId(null);
    setModalState({ kind: 'add' });
  };

  const handleOpenEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setModalState({ kind: 'edit', item: cat });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (modalState?.kind === 'add') {
      setSlug(slugify(val));
    }
  };

  // Submit Handler (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const finalSlug = slug.trim() ? slugify(slug) : slugify(name);

    if (modalState?.kind === 'add') {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: name.trim(), slug: finalSlug }])
        .select()
        .single();

      if (error) {
        alert(`Error adding category: ${error.message}`);
      } else if (data) {
        setCategories((prev) => [data, ...prev]);
        setModalState(null);
        setSuccessMessage('Category added successfully!');
      }
    } else if (modalState?.kind === 'edit' && editId !== null) {
      const { data, error } = await supabase
        .from('categories')
        .update({ name: name.trim(), slug: finalSlug })
        .eq('id', editId)
        .select()
        .single();

      if (error) {
        alert(`Error updating category: ${error.message}`);
      } else if (data) {
        setCategories((prev) => prev.map((c) => (c.id === editId ? data : c)));
        setModalState(null);
        setSuccessMessage('Category updated successfully!');
      }
    }

    setIsSubmitting(false);
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('categories').delete().eq('id', categoryToDelete.id);

    if (error) {
      alert(`Error deleting category: ${error.message}`);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      setSuccessMessage('Category deleted successfully!');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-3 relative">
      <CategoryTable
        categories={filteredCategories}
        query={query}
        setQuery={setQuery}
        loading={loading}
        onOpenAdd={handleOpenAdd}
        onOpenEdit={handleOpenEdit}
        onDelete={(id) => {
          const target = categories.find((c) => c.id === id);
          if (target) setCategoryToDelete(target);
        }}
      />

      {/* Modal Add & Edit */}
      {modalState && (
        <CategoryModal
          title={modalState.kind === 'add' ? 'Add New Category' : 'Edit Category'}
          name={name}
          setName={handleNameChange}
          slug={slug}
          setSlug={setSlug}
          isSubmitting={isSubmitting}
          onClose={() => setModalState(null)}
          onSubmit={handleSubmit}
          isEdit={modalState.kind === 'edit'}
        />
      )}

      {/* Modal Delete */}
      {categoryToDelete && (
        <DeleteCategoryModal
          categoryName={categoryToDelete.name}
          isSubmitting={isSubmitting}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Toast Notifikasi Berhasil */}
      {successMessage && (
        <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
    </div>
  );
}