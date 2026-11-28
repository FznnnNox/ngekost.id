// "use client";

// import React, { useRef } from "react";
// import dynamic from "next/dynamic";
// import { Upload, X, Image as ImageIcon, MapPin, Phone } from "lucide-react";
// import {
//   categories,
//   cities,
//   slugify,
//   type BoardingHouse,
// } from "@/components/admin/boarding-houses/data";
// import { RupiahInput } from "@/components/admin/boarding-houses/RupiahInput";
// import { RichTextEditor } from "@/components/admin/ui/RichTextEditor";

// // Import Leaflet secara dinamis tanpa SSR
// const LocationPickerMap = dynamic(
//   () => import("@/components/admin/boarding-houses/LocationPickerMap"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-2xl bg-[#262626] text-[12px] text-[#8a8a86]">
//         Memuat Peta...
//       </div>
//     ),
//   },
// );

// type HouseForm = Omit<BoardingHouse, "id"> & {
//   ownerWhatsapp?: string;
//   owner_whatsapp?: string;
// };

// interface GeneralInfoTabProps {
//   isCreating: boolean;
//   form: HouseForm;
//   setForm: React.Dispatch<React.SetStateAction<HouseForm>>;
//   saving: boolean;
//   onSave: () => void;
//   onCancel: () => void;
// }

// const inputClass =
//   "h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]";
// const btnPrimary =
//   "w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-50";
// const btnGhost =
//   "w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] transition-colors hover:bg-white/5";

// function Field({
//   label,
//   children,
//   className = "",
// }: {
//   label: string;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <label className={`grid gap-1.5 text-[12px] text-[#8a8a86] ${className}`}>
//       {label}
//       {children}
//     </label>
//   );
// }

// export function GeneralInfoTab({
//   isCreating,
//   form,
//   setForm,
//   saving,
//   onSave,
//   onCancel,
// }: GeneralInfoTabProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const ownerWhatsappValue = form.ownerWhatsapp ?? form.owner_whatsapp ?? "";

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const result = reader.result as string;
//       setForm((prev) => ({ ...prev, thumbnail: result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveThumbnail = () => {
//     setForm((prev) => ({ ...prev, thumbnail: "" }));
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <form
//       className="grid gap-4 grid-cols-1 sm:grid-cols-2"
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSave();
//       }}
//     >
//       <Field label="Thumbnail Photo*" className="sm:col-span-2">
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="hidden"
//           id="thumbnail-upload"
//         />

//         {form.thumbnail ? (
//           <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#262626] h-52 w-full flex items-center justify-center">
//             <img
//               src={form.thumbnail}
//               alt="Thumbnail Preview"
//               className="h-full w-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
//               <label
//                 htmlFor="thumbnail-upload"
//                 className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#e8e2b8] px-4 py-2 text-xs font-medium text-[#111] hover:opacity-90 transition-opacity"
//               >
//                 <Upload className="h-3.5 w-3.5" />
//                 Change Photo
//               </label>
//               <button
//                 type="button"
//                 onClick={handleRemoveThumbnail}
//                 className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/30 transition-colors"
//               >
//                 <X className="h-3.5 w-3.5" />
//                 Remove
//               </button>
//             </div>
//           </div>
//         ) : (
//           <label
//             htmlFor="thumbnail-upload"
//             className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-[#262626] p-6 text-center cursor-pointer hover:border-[#e8e2b8] transition-colors"
//           >
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#e8e2b8]">
//               <ImageIcon className="h-5 w-5" />
//             </div>
//             <div>
//               <p className="text-[13px] font-medium text-[#ededed]">
//                 Click to upload thumbnail
//               </p>
//               <p className="text-[11px] text-[#6b6b68] mt-0.5">
//                 SVG, PNG, JPG, or WEBP (Max. 5MB)
//               </p>
//             </div>
//           </label>
//         )}
//       </Field>

//       <Field label="Boarding House Name*">
//         <input
//           required
//           value={form.name}
//           onChange={(e) => {
//             const name = e.target.value;
//             setForm((prev) => ({
//               ...prev,
//               name,
//               slug: isCreating ? slugify(name) : prev.slug,
//             }));
//           }}
//           placeholder="e.g. Cedar Residence"
//           className={inputClass}
//         />
//       </Field>

//       <Field label="Slug*">
//         <input
//           required
//           value={form.slug}
//           onChange={(e) =>
//             setForm((prev) => ({ ...prev, slug: e.target.value }))
//           }
//           placeholder="e.g. cedar-residence"
//           className={inputClass}
//         />
//       </Field>

//       <Field label="City*">
//         <select
//           value={form.cityId}
//           onChange={(e) =>
//             setForm((prev) => ({ ...prev, cityId: Number(e.target.value) }))
//           }
//           className={inputClass}
//         >
//           {cities.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </Field>

//       <Field label="Category*">
//         <select
//           value={form.categoryId}
//           onChange={(e) =>
//             setForm((prev) => ({ ...prev, categoryId: Number(e.target.value) }))
//           }
//           className={inputClass}
//         >
//           {categories.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </Field>

//       <Field label="Starting Price / Month (Rp)*">
//         <RupiahInput
//           required
//           value={form.price}
//           onChange={(price) => setForm((prev) => ({ ...prev, price }))}
//           placeholder="Rp 650.000"
//           className={inputClass}
//         />
//       </Field>

//       <Field label="Owner WhatsApp Number*">
//         <div className="relative flex items-center">
//           <Phone className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#8a8a86]" />
//           <input
//             type="tel"
//             required
//             value={ownerWhatsappValue}
//             onChange={(e) =>
//               setForm((prev) => ({
//                 ...prev,
//                 ownerWhatsapp: e.target.value,
//                 owner_whatsapp: e.target.value,
//               }))
//             }
//             placeholder="e.g. 081234567890 or 6281234567890"
//             className={`${inputClass} pl-9`}
//           />
//         </div>
//       </Field>

//       <Field label="Address*" className="sm:col-span-2">
//         <input
//           required
//           value={form.address}
//           onChange={(e) =>
//             setForm((prev) => ({ ...prev, address: e.target.value }))
//           }
//           placeholder="e.g. Kelodran, Serang, Banten"
//           className={inputClass}
//         />
//       </Field>

//       {/* Pin Lokasi Leaflet */}
//       <div className="sm:col-span-2 grid gap-2 rounded-2xl border border-white/10 bg-[#181818] p-4">
//         <div className="flex flex-wrap items-center justify-between gap-2">
//           <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#e8e2b8]">
//             <MapPin className="h-3.5 w-3.5" /> Pin Lokasi di Peta (Klik pada
//             peta untuk menandai)
//           </span>
//           <span className="text-[11px] text-[#8a8a86]">
//             {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
//           </span>
//         </div>

//         <LocationPickerMap
//           latitude={form.latitude}
//           longitude={form.longitude}
//           onLocationChange={(lat, lng) =>
//             setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))
//           }
//         />

//         <div className="grid grid-cols-2 gap-3 mt-1">
//           <Field label="Latitude">
//             <input
//               type="number"
//               step="any"
//               value={form.latitude}
//               onChange={(e) =>
//                 setForm((prev) => ({
//                   ...prev,
//                   latitude: Number(e.target.value),
//                 }))
//               }
//               className={inputClass}
//             />
//           </Field>
//           <Field label="Longitude">
//             <input
//               type="number"
//               step="any"
//               value={form.longitude}
//               onChange={(e) =>
//                 setForm((prev) => ({
//                   ...prev,
//                   longitude: Number(e.target.value),
//                 }))
//               }
//               className={inputClass}
//             />
//           </Field>
//         </div>
//       </div>

//       <Field label="Description" className="sm:col-span-2">
//         <RichTextEditor
//           value={form.description}
//           placeholder="Provide details about the environment, rules, and general facilities..."
//           onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
//         />
//       </Field>

//       <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:col-span-2 mt-2">
//         <button type="button" onClick={onCancel} className={btnGhost}>
//           Cancel
//         </button>
//         <button type="submit" disabled={saving} className={btnPrimary}>
//           {saving ? "Menyimpan..." : "Save Boarding House"}
//         </button>
//       </div>
//     </form>
//   );
// }
"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Upload,
  X,
  Image as ImageIcon,
  MapPin,
  Phone,
  Link2,
  Search,
  CheckCircle2,
} from "lucide-react";
import {
  categories,
  cities,
  slugify,
  type BoardingHouse,
} from "@/components/admin/boarding-houses/data";
import { RupiahInput } from "@/components/admin/boarding-houses/RupiahInput";
import { RichTextEditor } from "@/components/admin/ui/RichTextEditor";

const LocationPickerMap = dynamic(
  () => import("@/components/admin/boarding-houses/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-2xl bg-[#262626] text-[12px] text-[#8a8a86]">
        Memuat Peta...
      </div>
    ),
  },
);

type HouseForm = Omit<BoardingHouse, "id"> & {
  ownerWhatsapp?: string;
  owner_whatsapp?: string;
};

interface GeneralInfoTabProps {
  isCreating: boolean;
  form: HouseForm;
  setForm: React.Dispatch<React.SetStateAction<HouseForm>>;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const inputClass =
  "h-10 w-full rounded-xl border border-white/10 bg-[#262626] px-3 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#6b6b68] focus:border-[#e8e2b8]";
const btnPrimary =
  "w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#e8e2b8] px-5 text-[13px] font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-50";
const btnGhost =
  "w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-[13px] text-[#ededed] transition-colors hover:bg-white/5";

function Field({
  label,
  children,
  className = "",
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

/**
 * Mengekstrak koordinat (lat, lng) dari URL Google Maps atau teks koordinat langsung.
 * Mendukung pola:
 * - "@lat,lng"
 * - "!3dLAT!4dLNG"
 * - "?q=lat,lng" atau "&query=lat,lng"
 * - teks mentah "lat, lng"
 */
function parseLatLngFromInput(raw: string): { lat: number; lng: number } | null {
  const text = decodeURIComponent(raw.trim());
  if (!text) return null;

  const isValidCoord = (lat: number, lng: number) =>
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0);

  // 1. Pola !3dLAT!4dLNG pada URL tempat/pin Google Maps
  const dataPinMatch = text.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i);
  if (dataPinMatch) {
    const lat = Number(dataPinMatch[1]);
    const lng = Number(dataPinMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // 2. Pola @lat,lng pada URL Google Maps
  const atMatch = text.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const lat = Number(atMatch[1]);
    const lng = Number(atMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // 3. Pola query parameter ?q=lat,lng atau ?query=lat,lng atau ?ll=lat,lng
  const paramMatch = text.match(
    /(?:[?&](?:q|query|ll|center)=)(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
  );
  if (paramMatch) {
    const lat = Number(paramMatch[1]);
    const lng = Number(paramMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // 4. Teks koordinat langsung: "-6.121255, 106.206035"
  const directMatch = text.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
  );
  if (directMatch) {
    const lat = Number(directMatch[1]);
    const lng = Number(directMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  return null;
}

export function GeneralInfoTab({
  isCreating,
  form,
  setForm,
  saving,
  onSave,
  onCancel,
}: GeneralInfoTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mapsInput, setMapsInput] = useState("");
  const [mapsStatus, setMapsStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const ownerWhatsappValue = form.ownerWhatsapp ?? form.owner_whatsapp ?? "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setForm((prev) => ({ ...prev, thumbnail: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setForm((prev) => ({ ...prev, thumbnail: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const applyMapsInput = (value: string) => {
    setMapsInput(value);
    if (!value.trim()) {
      setMapsStatus(null);
      return;
    }

    const parsed = parseLatLngFromInput(value);
    if (parsed) {
      setForm((prev) => ({
        ...prev,
        latitude: parsed.lat,
        longitude: parsed.lng,
      }));
      setMapsStatus({
        type: "success",
        text: `Koordinat ditemukan: ${parsed.lat}, ${parsed.lng}`,
      });
    } else if (/maps\.app\.goo\.gl|goo\.gl\/maps/i.test(value)) {
      setMapsStatus({
        type: "error",
        text: "Link pendek tidak memuat koordinat langsung. Buka link di browser lalu copy URL panjangnya atau koordinat lat, lng.",
      });
    } else {
      setMapsStatus({
        type: "error",
        text: "Format belum dikenali. Paste URL Google Maps atau koordinat seperti -6.121255, 106.206035.",
      });
    }
  };

  const handleSearchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // Jika user mengetik koordinat atau URL Google Maps di kotak search, langsung proses juga
    const parsed = parseLatLngFromInput(q);
    if (parsed) {
      setForm((prev) => ({
        ...prev,
        latitude: parsed.lat,
        longitude: parsed.lng,
      }));
      setSearchResults([]);
      setMapsStatus({
        type: "success",
        text: `Koordinat ditemukan: ${parsed.lat}, ${parsed.lng}`,
      });
      return;
    }

    setSearching(true);
    setMapsStatus(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=id&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Gagal mencari lokasi");
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
      if (data.length === 0) {
        setMapsStatus({
          type: "error",
          text: "Lokasi tidak ditemukan. Coba kata kunci lain atau paste URL Google Maps.",
        });
      }
    } catch {
      setMapsStatus({
        type: "error",
        text: "Pencarian lokasi gagal. Coba lagi atau paste URL / koordinat Google Maps.",
      });
    } finally {
      setSearching(false);
    }
  };

  const handlePickSearchResult = (item: SearchResult) => {
    const lat = Number(Number(item.lat).toFixed(6));
    const lng = Number(Number(item.lon).toFixed(6));
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: prev.address || item.display_name,
    }));
    setSearchResults([]);
    setMapsStatus({
      type: "success",
      text: `Dipilih: ${item.display_name}`,
    });
  };

  return (
    <form
      className="grid gap-4 grid-cols-1 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <Field label="Thumbnail Photo*" className="sm:col-span-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="thumbnail-upload"
        />

        {form.thumbnail ? (
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#262626] h-52 w-full flex items-center justify-center">
            <img
              src={form.thumbnail}
              alt="Thumbnail Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#e8e2b8] px-4 py-2 text-xs font-medium text-[#111] hover:opacity-90 transition-opacity"
              >
                <Upload className="h-3.5 w-3.5" />
                Change Photo
              </label>
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="thumbnail-upload"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-[#262626] p-6 text-center cursor-pointer hover:border-[#e8e2b8] transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#e8e2b8]">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#ededed]">
                Click to upload thumbnail
              </p>
              <p className="text-[11px] text-[#6b6b68] mt-0.5">
                SVG, PNG, JPG, or WEBP (Max. 5MB)
              </p>
            </div>
          </label>
        )}
      </Field>

      <Field label="Boarding House Name*">
        <input
          required
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            setForm((prev) => ({
              ...prev,
              name,
              slug: isCreating ? slugify(name) : prev.slug,
            }));
          }}
          placeholder="e.g. Cedar Residence"
          className={inputClass}
        />
      </Field>

      <Field label="Slug*">
        <input
          required
          value={form.slug}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, slug: e.target.value }))
          }
          placeholder="e.g. cedar-residence"
          className={inputClass}
        />
      </Field>

      <Field label="City*">
        <select
          value={form.cityId}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, cityId: Number(e.target.value) }))
          }
          className={inputClass}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Category*">
        <select
          value={form.categoryId}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, categoryId: Number(e.target.value) }))
          }
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Starting Price / Month (Rp)*">
        <RupiahInput
          required
          value={form.price}
          onChange={(price) => setForm((prev) => ({ ...prev, price }))}
          placeholder="Rp 650.000"
          className={inputClass}
        />
      </Field>

      <Field label="Owner WhatsApp Number*">
        <div className="relative flex items-center">
          <Phone className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#8a8a86]" />
          <input
            type="tel"
            required
            value={ownerWhatsappValue}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                ownerWhatsapp: e.target.value,
                owner_whatsapp: e.target.value,
              }))
            }
            placeholder="e.g. 081234567890 or 6281234567890"
            className={`${inputClass} pl-9`}
          />
        </div>
      </Field>

      <Field label="Address*" className="sm:col-span-2">
        <input
          required
          value={form.address}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address: e.target.value }))
          }
          placeholder="e.g. Kelodran, Serang, Banten"
          className={inputClass}
        />
      </Field>

      {/* Pin Lokasi Leaflet + Search + Paste URL Google Maps */}
      <div className="sm:col-span-2 grid gap-3 rounded-2xl border border-white/10 bg-[#181818] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#e8e2b8]">
            <MapPin className="h-3.5 w-3.5" /> Pin Lokasi di Peta (Klik peta,
            cari tempat, atau paste URL Google Maps)
          </span>
          <span className="text-[11px] text-[#8a8a86]">
            {Number(form.latitude || 0).toFixed(6)},{" "}
            {Number(form.longitude || 0).toFixed(6)}
          </span>
        </div>

        {/* Paste URL Google Maps / Koordinat */}
        <div className="grid gap-1.5">
          <label className="text-[11px] text-[#8a8a86]">
            Paste Google Maps URL or Coordinates
          </label>
          <div className="relative flex items-center">
            <Link2 className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#8a8a86]" />
            <input
              type="text"
              value={mapsInput}
              onChange={(e) => applyMapsInput(e.target.value)}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                if (pasted) {
                  setTimeout(() => applyMapsInput(pasted), 0);
                }
              }}
              placeholder="Paste link Google Maps atau -6.121255, 106.206035"
              className={`${inputClass} pl-9 pr-9`}
            />
            {mapsInput && (
              <button
                type="button"
                aria-label="Clear Google Maps input"
                onClick={() => {
                  setMapsInput("");
                  setMapsStatus(null);
                }}
                className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[#8a8a86] hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Lokasi */}
        <div className="relative grid gap-1.5">
          <label className="text-[11px] text-[#8a8a86]">Search Place / Street</label>
          <div className="flex gap-2">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#8a8a86]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchPlace(e);
                  }
                }}
                placeholder="Cari lokasi (mis. UNPAM Serang, Pondok Indah Estate)..."
                className={`${inputClass} pl-9`}
              />
            </div>
            <button
              type="button"
              disabled={searching}
              onClick={handleSearchPlace}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#262626] px-4 text-[12px] font-medium text-[#ededed] transition-colors hover:border-[#e8e2b8] hover:text-[#e8e2b8] disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <ul className="mt-1 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-[#222222] text-[12px]">
              {searchResults.map((item, idx) => (
                <li key={`${item.lat}-${item.lon}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => handlePickSearchResult(item)}
                    className="flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e8e2b8]" />
                    <span className="line-clamp-2 text-[#ededed]">
                      {item.display_name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mapsStatus && (
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] ${
              mapsStatus.type === "success"
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-amber-500/10 text-amber-300"
            }`}
          >
            {mapsStatus.type === "success" && (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{mapsStatus.text}</span>
          </div>
        )}

        <LocationPickerMap
          latitude={form.latitude}
          longitude={form.longitude}
          onLocationChange={(lat, lng) => {
            setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
            setMapsStatus({
              type: "success",
              text: `Pin dipindahkan ke: ${lat}, ${lng}`,
            });
          }}
        />

        {/* Input Latitude & Longitude tetap tersedia untuk penyesuaian halus */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <Field label="Latitude">
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  latitude: Number(e.target.value),
                }))
              }
              className={inputClass}
            />
          </Field>
          <Field label="Longitude">
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  longitude: Number(e.target.value),
                }))
              }
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field label="Description" className="sm:col-span-2">
        <RichTextEditor
          value={form.description}
          placeholder="Provide details about the environment, rules, and general facilities..."
          onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
        />
      </Field>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:col-span-2 mt-2">
        <button type="button" onClick={onCancel} className={btnGhost}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? "Menyimpan..." : "Save Boarding House"}
        </button>
      </div>
    </form>
  );
}