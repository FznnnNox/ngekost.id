'use client';

import React, { useRef, useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { roomTypes, rupiah, type Room } from '@/components/admin/boarding-houses/data';
import { RupiahInput } from '@/components/admin/boarding-houses/RupiahInput';

type RoomInput = Omit<Room, 'id' | 'boardingHouseId'>;

interface RoomsTabProps {
  rooms: Room[];
  onAddRoom: (roomData: RoomInput) => Promise<boolean>;
  onDeleteRoom: (id: number) => void;
}

const DEFAULT_PRICE = 650000;
const DEFAULT_IMAGE = '/assets/image01.png';

const inputClass =
  'h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]';
const btnPrimary =
  'w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-50';
const iconBtn =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] transition-colors hover:bg-[#333]';

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

export function RoomsTab({ rooms, onAddRoom, onDeleteRoom }: RoomsTabProps) {
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState(roomTypes[0]);
  const [roomSize, setRoomSize] = useState(120);
  const [roomCapacity, setRoomCapacity] = useState(1);
  const [roomPrice, setRoomPrice] = useState(DEFAULT_PRICE);
  const [roomAvailable, setRoomAvailable] = useState(true);
  const [roomPhotos, setRoomPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setRoomName('');
    setRoomType(roomTypes[0]);
    setRoomSize(120);
    setRoomCapacity(1);
    setRoomPrice(DEFAULT_PRICE);
    setRoomAvailable(true);
    setRoomPhotos([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    try {
      const results = await readFilesAsDataUrl(files);
      setRoomPhotos((prev) => [...prev, ...results]);
    } catch {
      // Gagal membaca file: abaikan, user bisa memilih ulang
    } finally {
      // Kosongkan agar user bisa memilih file yang sama lagi
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setRoomPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || submitting) return;

    setSubmitting(true);
    const ok = await onAddRoom({
      name: roomName.trim(),
      roomType,
      squareFeet: roomSize,
      capacity: roomCapacity,
      pricePerMonth: roomPrice,
      isAvailable: roomAvailable,
      images: roomPhotos.length > 0 ? roomPhotos : [DEFAULT_IMAGE],
    });
    setSubmitting(false);

    // Form hanya dikosongkan jika data berhasil tersimpan
    if (ok) resetForm();
  };

  return (
    <div className="grid gap-5">
      {/* Form tambah kamar */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-[#262626] p-4 grid gap-3 grid-cols-1 sm:grid-cols-2"
      >
        <h3 className="text-[13px] font-medium text-[#e8e2b8] sm:col-span-2">Add New Room</h3>

        <Field label="Room Name*">
          <input
            required
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Room A / Deluxe 01"
            className={inputClass}
          />
        </Field>

        <Field label="Room Type*">
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className={inputClass}
          >
            {roomTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Size (sq ft)*">
          <input
            type="number"
            min={1}
            required
            value={roomSize}
            onChange={(e) => setRoomSize(Number(e.target.value))}
            className={inputClass}
          />
        </Field>

        <Field label="Capacity (People)*">
          <input
            type="number"
            min={1}
            required
            value={roomCapacity}
            onChange={(e) => setRoomCapacity(Number(e.target.value))}
            className={inputClass}
          />
        </Field>

        <Field label="Price per Month (Rp)*" className="sm:col-span-2">
          <RupiahInput
            required
            value={roomPrice}
            onChange={setRoomPrice}
            placeholder="Rp 650.000"
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
            onChange={handleFileChange}
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
                    onClick={() => handleRemovePhoto(idx)}
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
            {rooms.map((r) => (
              <div
                key={r.id}
                className="rounded-xl bg-[#262626] p-3 text-[12px] flex flex-col justify-between border border-white/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[#e8e2b8]">
                      {r.name}{' '}
                      <span className="text-[10px] font-normal text-[#8a8a86]">({r.roomType})</span>
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
                    {r.squareFeet} sq ft · {r.capacity} person(s) ·{' '}
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

                <div className="flex justify-end mt-3 border-t border-white/5 pt-2">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}