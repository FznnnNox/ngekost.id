'use client';

import React, { useRef, useState } from 'react';
import { Pencil, Plus, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';
import { roomTypes, rupiah, type Room } from '@/components/admin/boarding-houses/data';
import { RupiahInput } from '@/components/admin/boarding-houses/RupiahInput';

type RoomInput = Omit<Room, 'id' | 'boardingHouseId'>;

interface RoomsTabProps {
  rooms: Room[];
  onAddRoom: (roomData: RoomInput) => Promise<boolean>;
  onUpdateRoom: (id: number, roomData: RoomInput) => Promise<boolean>;
  onDeleteRoom: (id: number) => void;
}

const DEFAULT_PRICE = 0;
const DEFAULT_SIZE = 0;
const DEFAULT_CAPACITY = 1;
const DEFAULT_IMAGE = '/assets/image01.png';

const inputClass =
  'h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]';
const editInputClass =
  'h-9 w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-2.5 text-[12px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]';
const btnPrimary =
  'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-50';
const iconBtn =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1c1c1c] transition-colors hover:bg-[#333]';

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-1.5 text-[12px] text-[#8a8a86] ${className}`}>
      {label}
      {children}
    </label>
  );
}

// Baca semua file dan pertahankan urutan pilihan user
const readFilesAsDataUrl = (files: File[]) =>
  Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        })
    )
  );

export function RoomsTab({
  rooms,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
}: RoomsTabProps) {
  // State form tambah room
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomSize, setRoomSize] = useState<string>('');
  const [roomCapacity, setRoomCapacity] = useState<string>('');
  const [roomPrice, setRoomPrice] = useState<number>(DEFAULT_PRICE);
  const [roomAvailable, setRoomAvailable] = useState(true);
  const [roomPhotos, setRoomPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // State edit room
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [editSize, setEditSize] = useState<string>('');
  const [editCapacity, setEditCapacity] = useState<string>('');
  const [editPrice, setEditPrice] = useState<number>(DEFAULT_PRICE);
  const [editAvailable, setEditAvailable] = useState(true);
  const [editPhotos, setEditPhotos] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const resetAddForm = () => {
    setRoomName('');
    setRoomType('');
    setRoomSize('');
    setRoomCapacity('');
    setRoomPrice(DEFAULT_PRICE);
    setRoomAvailable(true);
    setRoomPhotos([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    try {
      const results = await readFilesAsDataUrl(files);
      setRoomPhotos((prev) => [...prev, ...results]);
    } catch {
      // Gagal membaca file: abaikan, user bisa memilih ulang
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAddPhoto = (index: number) => {
    setRoomPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const parsedSize = roomSize.trim() === '' ? DEFAULT_SIZE : Math.max(0, Number(roomSize));
    const parsedCapacity =
      roomCapacity.trim() === '' ? DEFAULT_CAPACITY : Math.max(1, Number(roomCapacity));
    const resolvedName = roomName.trim() || 'Room';
    const resolvedType = roomType.trim() || roomTypes[0] || 'Standard';

    setSubmitting(true);
    const ok = await onAddRoom({
      name: resolvedName,
      roomType: resolvedType,
      squareFeet: Number.isNaN(parsedSize) ? DEFAULT_SIZE : parsedSize,
      capacity: Number.isNaN(parsedCapacity) ? DEFAULT_CAPACITY : parsedCapacity,
      pricePerMonth: Number.isNaN(roomPrice) ? DEFAULT_PRICE : Math.max(0, roomPrice),
      isAvailable: roomAvailable,
      images: roomPhotos.length > 0 ? roomPhotos : [DEFAULT_IMAGE],
    });
    setSubmitting(false);

    if (ok) resetAddForm();
  };

  const startEditing = (room: Room) => {
    setEditingId(room.id);
    setEditName(room.name);
    setEditType(room.roomType || '');
    setEditSize(room.squareFeet > 0 ? String(room.squareFeet) : '');
    setEditCapacity(room.capacity > 0 ? String(room.capacity) : '');
    setEditPrice(room.pricePerMonth ?? DEFAULT_PRICE);
    setEditAvailable(room.isAvailable);
    setEditPhotos(room.images ?? []);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const cancelEditing = () => {
    setEditingId(null);
    setSavingEdit(false);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    try {
      const results = await readFilesAsDataUrl(files);
      setEditPhotos((prev) => [...prev, ...results]);
    } catch {
      // Gagal membaca file: abaikan, user bisa memilih ulang
    } finally {
      if (editFileInputRef.current) editFileInputRef.current.value = '';
    }
  };

  const handleRemoveEditPhoto = (index: number) => {
    setEditPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (savingEdit) return;

    const parsedSize = editSize.trim() === '' ? DEFAULT_SIZE : Math.max(0, Number(editSize));
    const parsedCapacity =
      editCapacity.trim() === '' ? DEFAULT_CAPACITY : Math.max(1, Number(editCapacity));
    const resolvedName = editName.trim() || 'Room';
    const resolvedType = editType.trim() || roomTypes[0] || 'Standard';

    setSavingEdit(true);
    const ok = await onUpdateRoom(id, {
      name: resolvedName,
      roomType: resolvedType,
      squareFeet: Number.isNaN(parsedSize) ? DEFAULT_SIZE : parsedSize,
      capacity: Number.isNaN(parsedCapacity) ? DEFAULT_CAPACITY : parsedCapacity,
      pricePerMonth: Number.isNaN(editPrice) ? DEFAULT_PRICE : Math.max(0, editPrice),
      isAvailable: editAvailable,
      images: editPhotos.length > 0 ? editPhotos : [DEFAULT_IMAGE],
    });
    setSavingEdit(false);

    if (ok) cancelEditing();
  };

  return (
    <div className="grid gap-5">
      {/* Form tambah kamar */}
      <form
        onSubmit={handleAddSubmit}
        className="rounded-2xl bg-[#262626] p-4 grid gap-3 grid-cols-1 sm:grid-cols-2"
      >
        <h3 className="text-[13px] font-medium text-[#e8e2b8] sm:col-span-2">Add New Room</h3>

        <Field label="Room Name (Optional)">
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Room A / Deluxe 01"
            className={inputClass}
          />
        </Field>

        <Field label="Room Type (Optional)">
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className={inputClass}
          >
            <option value="">Select type (optional)</option>
            {roomTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Size (sq ft) (Optional)">
          <input
            type="number"
            min={0}
            value={roomSize}
            onChange={(e) => setRoomSize(e.target.value)}
            placeholder="e.g. 120"
            className={inputClass}
          />
        </Field>

        <Field label="Capacity (People) (Optional)">
          <input
            type="number"
            min={1}
            value={roomCapacity}
            onChange={(e) => setRoomCapacity(e.target.value)}
            placeholder="e.g. 1"
            className={inputClass}
          />
        </Field>

        <Field label="Price per Month (Rp) (Optional)" className="sm:col-span-2">
          <RupiahInput
            value={roomPrice}
            onChange={setRoomPrice}
            placeholder="Rp 0 (Optional)"
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2 text-[12px] sm:col-span-2 pt-1 text-[#8a8a86]">
          <input
            type="checkbox"
            checked={roomAvailable}
            onChange={(e) => setRoomAvailable(e.target.checked)}
            className="h-4 w-4 accent-[#e8e2b8]"
          />
          Is Available for Rent
        </label>

        {/* Upload foto kamar */}
        <div className="sm:col-span-2 border-t border-white/10 pt-3 grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#8a8a86]">Room Photos</span>
            <label
              htmlFor="room-photos-upload"
              className="cursor-pointer text-[11px] text-[#e8e2b8] flex items-center gap-1 hover:underline"
            >
              <Plus className="h-3 w-3" /> Add Photo(s)
            </label>
          </div>

          <input
            ref={fileInputRef}
            id="room-photos-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddFileChange}
            className="hidden"
          />

          {roomPhotos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1">
              {roomPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden h-20 bg-[#1c1c1c] border border-white/10"
                >
                  <img src={photo} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label={`Hapus foto ${idx + 1}`}
                    onClick={() => handleRemoveAddPhoto(idx)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <label
              htmlFor="room-photos-upload"
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-[#1c1c1c] p-4 text-center cursor-pointer hover:border-[#e8e2b8] transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[#e8e2b8]">
                <ImageIcon className="h-4 w-4" />
              </div>
              <p className="text-[12px] text-[#ededed]">Click to upload room photos</p>
              <p className="text-[10px] text-[#6b6b68]">Supports PNG, JPG, or WEBP (Multiple allowed)</p>
            </label>
          )}
        </div>

        <div className="flex justify-end sm:col-span-2 mt-2">
          <button type="submit" disabled={submitting} className={btnPrimary}>
            <Plus className="h-3.5 w-3.5" /> {submitting ? 'Menyimpan...' : 'Add Room'}
          </button>
        </div>
      </form>

      {/* Daftar kamar */}
      <div>
        <h3 className="mb-3 text-[12px] font-medium text-[#8a8a86]">Room List</h3>
        {rooms.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-[#8a8a86]">No rooms added yet.</p>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {rooms.map((r) => {
              const isEditing = editingId === r.id;

              if (isEditing) {
                return (
                  <form
                    key={r.id}
                    onSubmit={(e) => handleSaveEdit(e, r.id)}
                    className="rounded-xl bg-[#262626] p-3.5 text-[12px] grid gap-2.5 border border-[#e8e2b8]/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#e8e2b8]">Edit Room</span>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        aria-label="Batal edit"
                        className="text-[#8a8a86] hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                      <Field label="Room Name">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Room Name"
                          className={editInputClass}
                        />
                      </Field>

                      <Field label="Room Type">
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          className={editInputClass}
                        >
                          <option value="">Select type</option>
                          {roomTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Size (sq ft)">
                        <input
                          type="number"
                          min={0}
                          value={editSize}
                          onChange={(e) => setEditSize(e.target.value)}
                          placeholder="e.g. 120"
                          className={editInputClass}
                        />
                      </Field>

                      <Field label="Capacity (People)">
                        <input
                          type="number"
                          min={1}
                          value={editCapacity}
                          onChange={(e) => setEditCapacity(e.target.value)}
                          placeholder="e.g. 1"
                          className={editInputClass}
                        />
                      </Field>

                      <Field label="Price per Month (Rp)" className="sm:col-span-2">
                        <RupiahInput
                          value={editPrice}
                          onChange={setEditPrice}
                          placeholder="Rp 0"
                          className={editInputClass}
                        />
                      </Field>
                    </div>

                    <label className="flex items-center gap-2 text-[11px] text-[#8a8a86]">
                      <input
                        type="checkbox"
                        checked={editAvailable}
                        onChange={(e) => setEditAvailable(e.target.checked)}
                        className="h-3.5 w-3.5 accent-[#e8e2b8]"
                      />
                      Is Available for Rent
                    </label>

                    {/* Edit foto */}
                    <div className="grid gap-1.5 border-t border-white/10 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#8a8a86]">Photos</span>
                        <label
                          htmlFor={`edit-room-photos-${r.id}`}
                          className="cursor-pointer text-[11px] text-[#e8e2b8] flex items-center gap-1 hover:underline"
                        >
                          <Plus className="h-3 w-3" /> Add Photo
                        </label>
                      </div>
                      <input
                        ref={editFileInputRef}
                        id={`edit-room-photos-${r.id}`}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEditFileChange}
                        className="hidden"
                      />
                      {editPhotos.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {editPhotos.map((photo, idx) => (
                            <div
                              key={idx}
                              className="relative h-12 w-14 shrink-0 rounded-lg overflow-hidden bg-[#1c1c1c] border border-white/10"
                            >
                              <img src={photo} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                aria-label={`Hapus foto edit ${idx + 1}`}
                                onClick={() => handleRemoveEditPhoto(idx)}
                                className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={savingEdit}
                        className="inline-flex h-8 items-center gap-1 rounded-full bg-[#1c1c1c] px-3 text-[11px] text-[#ededed] hover:bg-[#333]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingEdit}
                        className="inline-flex h-8 items-center gap-1 rounded-full bg-[#e8e2b8] px-3.5 text-[11px] font-medium text-[#111] hover:opacity-90 disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" /> {savingEdit ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div
                  key={r.id}
                  className="rounded-xl bg-[#262626] p-3 text-[12px] flex flex-col justify-between border border-white/5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[#e8e2b8]">
                        {r.name}{' '}
                        {r.roomType ? (
                          <span className="text-[10px] font-normal text-[#8a8a86]">
                            ({r.roomType})
                          </span>
                        ) : null}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md ${
                          r.isAvailable
                            ? 'bg-[#e8e2b8]/10 text-[#e8e2b8]'
                            : 'bg-white/5 text-[#6b6b68]'
                        }`}
                      >
                        {r.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </div>

                    <p className="text-[#8a8a86] mt-1">
                      {r.squareFeet > 0 ? `${r.squareFeet} sq ft · ` : ''}
                      {r.capacity > 0 ? `${r.capacity} person(s) · ` : ''}
                      <span className="text-[#ededed] font-medium">{rupiah(r.pricePerMonth)}</span>/mo
                    </p>

                    <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-1">
                      {r.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="h-12 w-14 rounded-lg object-cover bg-[#1c1c1c] shrink-0 border border-white/5"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 mt-3 border-t border-white/5 pt-2">
                    <button
                      type="button"
                      aria-label={`Edit ${r.name}`}
                      onClick={() => startEditing(r)}
                      className={`${iconBtn} hover:!bg-[#333] text-[#ededed]`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus ${r.name}`}
                      onClick={() => onDeleteRoom(r.id)}
                      className={`${iconBtn} hover:!bg-[#4a1f1c] hover:text-[#ff9a90]`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}