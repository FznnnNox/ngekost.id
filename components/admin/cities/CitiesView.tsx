'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify, type City } from './data';
import { CityTable } from '@/components/admin/cities/CityTable';
import { CityModal } from '@/components/admin/cities/CityModal';
import { DeleteCityModal } from '@/components/admin/cities/DeleteCityModal';
import { Toast } from '@/components/admin/ui/Toast';

export default function CitiesView() {
  const [cities, setCities] = useState<City[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [modalState, setModalState] = useState<{ kind: 'add' | 'edit'; item?: City } | null>(null);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  
  // Toast Notification State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const fetchCities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching cities:', error.message);
    } else if (data) {
      setCities(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cities.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [cities, query]);

  const handleOpenAdd = () => {
    setName('');
    setSlug('');
    setEditId(null);
    setModalState({ kind: 'add' });
  };

  const handleOpenEdit = (city: City) => {
    setEditId(city.id);
    setName(city.name);
    setSlug(city.slug);
    setModalState({ kind: 'edit', item: city });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (modalState?.kind === 'add') {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const finalSlug = slug.trim() ? slugify(slug) : slugify(name);

    if (modalState?.kind === 'add') {
      const { data, error } = await supabase
        .from('cities')
        .insert([{ name: name.trim(), slug: finalSlug }])
        .select()
        .single();

      if (error) {
        alert(`Error adding city: ${error.message}`);
      } else if (data) {
        setCities((prev) => [data, ...prev]);
        setModalState(null);
        setSuccessMessage('City added successfully!');
      }
    } else if (modalState?.kind === 'edit' && editId !== null) {
      const { data, error } = await supabase
        .from('cities')
        .update({ name: name.trim(), slug: finalSlug })
        .eq('id', editId)
        .select()
        .single();

      if (error) {
        alert(`Error updating city: ${error.message}`);
      } else if (data) {
        setCities((prev) => prev.map((c) => (c.id === editId ? data : c)));
        setModalState(null);
        setSuccessMessage('City updated successfully!');
      }
    }

    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    if (!cityToDelete) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('cities').delete().eq('id', cityToDelete.id);

    if (error) {
      alert(`Error deleting city: ${error.message}`);
    } else {
      setCities((prev) => prev.filter((c) => c.id !== cityToDelete.id));
      setCityToDelete(null);
      setSuccessMessage('City deleted successfully!');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-3 relative">
      <CityTable
        cities={filteredCities}
        query={query}
        setQuery={setQuery}
        loading={loading}
        onOpenAdd={handleOpenAdd}
        onOpenEdit={handleOpenEdit}
        onDelete={(id) => {
          const target = cities.find((c) => c.id === id);
          if (target) setCityToDelete(target);
        }}
      />

      {/* Modal Add & Edit */}
      {modalState && (
        <CityModal
          title={modalState.kind === 'add' ? 'Add New City' : 'Edit City'}
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
      {cityToDelete && (
        <DeleteCityModal
          cityName={cityToDelete.name}
          isSubmitting={isSubmitting}
          onClose={() => setCityToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Popup / Toast Notifikasi Berhasil */}
      {successMessage && (
        <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
    </div>
  );
}