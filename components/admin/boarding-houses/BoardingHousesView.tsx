'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  categories,
  cities,
  type BoardingHouse,
  type Bonus,
  type Room,
} from '@/components/admin/boarding-houses/data';
import * as api from '@/components/admin/boarding-houses/api';
import { TabNavigation, type Tab } from '@/components/admin/boarding-houses/TabNavigation';
import { GeneralInfoTab } from '@/components/admin/boarding-houses/GeneralInfoTab';
import { BonusTab } from '@/components/admin/boarding-houses/BonusTab';
import { RoomsTab } from '@/components/admin/boarding-houses/RoomsTab';
import { HouseListView } from '@/components/admin/boarding-houses/HouseListView';
import { Toast } from '@/components/admin/ui/Toast';
import { DeleteBoardingHouseModal } from '@/components/admin/boarding-houses/DeleteBoardingHouseModal';

type HouseForm = Omit<BoardingHouse, 'id'>;
type ToastState = { id: number; message: string; variant: 'success' | 'error' } | null;

const card = 'rounded-[22px] bg-[#1c1c1c] text-[#ededed]';
const iconBtn =
  'flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

const emptyForm = (): HouseForm => ({
  name: '',
  slug: '',
  thumbnail: '',
  cityId: cities[0].id,
  categoryId: categories[0].id,
  description: '',
  price: 650000,
  address: '',
  latitude: -6.1154,
  longitude: 106.1503,
});

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : 'Terjadi kesalahan, coba lagi.';

export default function BoardingHousesView() {
  const [houses, setHouses] = useState<BoardingHouse[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tab, setTab] = useState<Tab>('info');
  const [query, setQuery] = useState('');
  const [houseForm, setHouseForm] = useState<HouseForm>(emptyForm());
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BoardingHouse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);

  const notify = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, variant });
  }, []);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    api
      .fetchAll()
      .then(({ houses, rooms, bonuses }) => {
        setHouses(houses);
        setRooms(rooms);
        setBonuses(bonuses);
      })
      .catch((e) => notify(errorMessage(e), 'error'))
      .finally(() => setLoading(false));
  }, [notify]);

  const activeHouse = houses.find((h) => h.id === activeId) ?? null;
  const showDetail = isCreating || activeHouse !== null;

  const houseRooms = useMemo(
    () => rooms.filter((r) => r.boardingHouseId === activeId),
    [rooms, activeId]
  );
  const houseBonuses = useMemo(
    () => bonuses.filter((b) => b.boardingHouseId === activeId),
    [bonuses, activeId]
  );

  const filteredHouses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return houses.filter(
      (h) => !q || h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q)
    );
  }, [houses, query]);

  const deleteRoomCount = deleteTarget
    ? rooms.filter((r) => r.boardingHouseId === deleteTarget.id).length
    : 0;
  const deleteBonusCount = deleteTarget
    ? bonuses.filter((b) => b.boardingHouseId === deleteTarget.id).length
    : 0;

  const closeDetail = () => {
    setIsCreating(false);
    setActiveId(null);
  };

  const handleStartCreate = () => {
    setActiveId(null);
    setHouseForm(emptyForm());
    setTab('info');
    setIsCreating(true);
  };

  const handleSelectHouse = (id: number) => {
    const house = houses.find((h) => h.id === id);
    if (!house) return;
    const { id: _id, ...form } = house;
    setHouseForm(form);
    setActiveId(id);
    setIsCreating(false);
    setTab('info');
  };

  const handleSaveHouse = async () => {
    if (!houseForm.name.trim() || !houseForm.slug.trim()) {
      notify('Nama dan slug wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const created = await api.createHouse(houseForm);
        setHouses((prev) => [created, ...prev]);
        setHouseForm({
          name: created.name,
          slug: created.slug,
          thumbnail: created.thumbnail,
          cityId: created.cityId,
          categoryId: created.categoryId,
          description: created.description,
          price: created.price,
          address: created.address,
          latitude: created.latitude,
          longitude: created.longitude,
        });
        setIsCreating(false);
        setActiveId(created.id);
        notify('Boarding house berhasil ditambahkan.');
      } else if (activeId !== null) {
        const updated = await api.updateHouse(activeId, houseForm);
        setHouses((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
        notify('Perubahan berhasil disimpan.');
      }
    } catch (e) {
      notify(errorMessage(e), 'error');
    } finally {
      setSaving(false);
    }
  };

  const requestDeleteHouse = (id: number) => {
    const house = houses.find((h) => h.id === id);
    if (house) setDeleteTarget(house);
  };

  const closeDeleteModal = useCallback(() => setDeleteTarget(null), []);

  const confirmDeleteHouse = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setIsDeleting(true);
    try {
      await api.deleteHouse(id);
      setHouses((prev) => prev.filter((h) => h.id !== id));
      setRooms((prev) => prev.filter((r) => r.boardingHouseId !== id));
      setBonuses((prev) => prev.filter((b) => b.boardingHouseId !== id));
      if (activeId === id) closeDetail();
      notify('Boarding house berhasil dihapus.');
    } catch (e) {
      notify(errorMessage(e), 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleAddBonus = async (name: string, description: string): Promise<boolean> => {
    if (activeId === null) return false;
    try {
      const bonus = await api.createBonus(activeId, name, description);
      setBonuses((prev) => [...prev, bonus]);
      notify('Bonus berhasil ditambahkan.');
      return true;
    } catch (e) {
      notify(errorMessage(e), 'error');
      return false;
    }
  };

  const handleDeleteBonus = async (id: number) => {
    try {
      await api.deleteBonus(id);
      setBonuses((prev) => prev.filter((b) => b.id !== id));
      notify('Bonus berhasil dihapus.');
    } catch (e) {
      notify(errorMessage(e), 'error');
    }
  };

  const handleAddRoom = async (
    roomData: Omit<Room, 'id' | 'boardingHouseId'>
  ): Promise<boolean> => {
    if (activeId === null) return false;
    try {
      const room = await api.createRoom(activeId, roomData);
      setRooms((prev) => [...prev, room]);
      notify('Kamar berhasil ditambahkan.');
      return true;
    } catch (e) {
      notify(errorMessage(e), 'error');
      return false;
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await api.deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      notify('Kamar berhasil dihapus.');
    } catch (e) {
      notify(errorMessage(e), 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#e8e2b8]"
          role="status"
          aria-label="Loading data"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {!showDetail ? (
        <HouseListView
          houses={filteredHouses}
          rooms={rooms}
          bonuses={bonuses}
          query={query}
          setQuery={setQuery}
          onSelectHouse={handleSelectHouse}
          onDeleteHouse={requestDeleteHouse}
          onStartCreate={handleStartCreate}
        />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <button type="button" onClick={closeDetail} className={`${iconBtn} h-10 w-10`}>
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-[18px] font-medium">
                {isCreating ? 'Create Boarding House' : activeHouse?.name}
              </h1>
              <p className="text-[12px] text-[#8a8a86]">
                {isCreating ? 'Boarding Houses > Create' : 'Edit Boarding House'}
              </p>
            </div>
          </div>

          <section className={`${card} p-5`}>
            <TabNavigation
              activeTab={tab}
              onChangeTab={setTab}
              bonusCount={houseBonuses.length}
              roomCount={houseRooms.length}
              disabledTabs={isCreating ? ['bonuses', 'rooms'] : []}
            />

            {tab === 'info' && (
              <GeneralInfoTab
                isCreating={isCreating}
                form={houseForm}
                setForm={setHouseForm}
                saving={saving}
                onSave={handleSaveHouse}
                onCancel={closeDetail}
              />
            )}

            {tab === 'bonuses' && !isCreating && (
              <BonusTab
                bonuses={houseBonuses}
                onAddBonus={handleAddBonus}
                onDeleteBonus={handleDeleteBonus}
              />
            )}

            {tab === 'rooms' && !isCreating && (
              <RoomsTab
                rooms={houseRooms}
                onAddRoom={handleAddRoom}
                onDeleteRoom={handleDeleteRoom}
              />
            )}
          </section>
        </>
      )}

      {deleteTarget && (
        <DeleteBoardingHouseModal
          houseName={deleteTarget.name}
          roomCount={deleteRoomCount}
          bonusCount={deleteBonusCount}
          isSubmitting={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteHouse}
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