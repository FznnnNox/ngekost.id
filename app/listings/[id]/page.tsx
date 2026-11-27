'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Wifi,
  CheckCircle2,
  Store,
  Utensils,
  Landmark,
  Bus,
  GraduationCap,
} from 'lucide-react';
import * as api from '@/components/admin/boarding-houses/api';
import * as testimonialApi from '@/components/admin/testimonials/api';
import {
  cities,
  type BoardingHouse,
  type Room,
  type Bonus,
} from '@/components/admin/boarding-houses/data';
import DetailTopBar from '@/components/listing-detail/DetailTopBar';
import PhotoGallery from '@/components/listing-detail/PhotoGallery';
import ListingHeader from '@/components/listing-detail/ListingHeader';
import SectionBlock from '@/components/listing-detail/SectionBlock';
import FacilityGrid from '@/components/listing-detail/FacilityGrid';
import LocationSection from '@/components/listing-detail/LocationSection';
import BookingCard from '@/components/listing-detail/BookingCard';
import ReviewSection from '@/components/listing-detail/ReviewSection';
import { supabase } from '@/lib/supabase';

function sanitizeDescriptionHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*data-[a-z0-9-]+="[^"]*"/gi, '')
    .trim();
}

function normalizeWhatsappNumber(rawPhone?: string | null): string {
  const fallback = '6281234567890';
  if (!rawPhone) return fallback;
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return fallback;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return `62${digits}`;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;

  const [house, setHouse] = useState<BoardingHouse | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [reviewStats, setReviewStats] = useState({ rating: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        const result = await api.fetchHouseDetail(idParam);
        if (result) {
          setHouse(result.house);
          setRooms(result.rooms);
          setBonuses(result.bonuses);

          const reviews = await testimonialApi.fetchTestimonialsByHouse(result.house.id);
          if (reviews.length > 0) {
            const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            setReviewStats({ rating: Number(avg.toFixed(1)), count: reviews.length });
          } else {
            setReviewStats({ rating: 0, count: 0 });
          }
        }
      } catch (err) {
        console.error('Gagal memuat detail kosan:', err);
      } finally {
        setLoading(false);
      }
    }

    if (idParam) loadDetail();
  }, [idParam]);

  const handleReserveBooking = async ({
    startDate,
    durationMonths,
    totalAmount,
  }: {
    startDate: string;
    durationMonths: number;
    totalAmount: number;
  }) => {
    if (!house || reserving) return;
    setReserving(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.push(`/login?next=${encodeURIComponent(`/listings/${idParam}`)}`);
        return;
      }

      const tenantName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Calon Penyewa';

      const selectedRoom = rooms[0]?.name || 'Kamar Utama';

      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardingHouseId: house.id,
          tenantName,
          roomName: selectedRoom,
          amount: totalAmount,
          startDate,
          durationMonths,
        }),
      });

      const bookingResult = await res.json();
      if (!res.ok) {
        throw new Error(bookingResult.error || 'Gagal membuat booking');
      }

      const houseWithPhone = house as BoardingHouse & {
        owner_whatsapp?: string | null;
        ownerWhatsapp?: string | null;
        phone?: string | null;
      };

      const ownerPhoneRaw =
        houseWithPhone.owner_whatsapp ||
        houseWithPhone.ownerWhatsapp ||
        houseWithPhone.phone;

      const waPhone = normalizeWhatsappNumber(ownerPhoneRaw);

      const waMessage = [
        `Halo Pemilik *${house.name}*, saya *${tenantName}* ingin booking kos lewat *Ngekost.id*.`,
        '',
        `• *Invoice:* ${bookingResult.invoice}`,
        `• *Kamar:* ${selectedRoom}`,
        `• *Mulai Kos:* ${startDate}`,
        `• *Durasi:* ${durationMonths} Bulan`,
        `• *Total Estimasi:* Rp ${totalAmount.toLocaleString('id-ID')}`,
        '',
        '---',
        'Khusus Pemilik Kos (Update Status Otomatis):',
        `• Confirm Deal: ${bookingResult.confirmUrl}`,
        `• Cancel: ${bookingResult.cancelUrl}`,
      ].join('\n');

      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Gagal memproses reservasi:', err);
      alert('Terjadi kesalahan saat memproses reservasi. Coba lagi.');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#ededed]"
          role="status"
          aria-label="Loading detail"
        />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] px-4 text-center text-white">
        <h1 className="text-2xl font-medium">Kosan Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-[#8a8a86]">
          Data kosan yang kamu cari tidak tersedia atau sudah dihapus.
        </p>
      </div>
    );
  }

  const cityObj = cities.find((c) => c.id === house.cityId);
  const cityName = cityObj ? cityObj.name : 'Serang';

  const photos = [
    house.thumbnail || '/assets/image01.png',
    ...rooms.flatMap((r) => r.images || []),
  ];

  const facilityItems = bonuses.map((b) => ({
    name: b.name,
    icon: CheckCircle2,
    value: b.description,
  }));

  const formattedPrice = `Rp ${house.price.toLocaleString('id-ID')}`;
  const cleanDescription = house.description
    ? sanitizeDescriptionHtml(house.description)
    : '';

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-10 text-[#ededed] sm:px-8">
      <div className="mx-auto max-w-[1100px]">
        <DetailTopBar />

        <PhotoGallery photos={photos} title={house.name} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <ListingHeader
              title={house.name}
              location={`${house.address}, ${cityName}`}
              rating={reviewStats.rating}
              reviewsCount={reviewStats.count}
            />

            {cleanDescription ? (
              <div
                className="border-t border-white/10 pt-8 text-[14px] leading-relaxed text-[#c4c4c4] space-y-3 [&_strong]:font-semibold [&_strong]:text-white [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#a8a8a8] [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: cleanDescription }}
              />
            ) : (
              <p className="border-t border-white/10 pt-8 text-[14px] leading-relaxed text-[#c4c4c4]">
                Tidak ada deskripsi tambahan untuk kosan ini.
              </p>
            )}

            <SectionBlock title="Facilities & Amenities">
              <FacilityGrid items={facilityItems} />
            </SectionBlock>

            <SectionBlock title="Available Rooms">
              {rooms.length === 0 ? (
                <p className="text-[13px] text-[#9c9c9c]">Belum ada kamar terdaftar.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {rooms.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 text-[13px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{r.name}</span>
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-[#e8e2b8]">
                          {r.roomType}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-[#9c9c9c]">
                        {r.squareFeet} sq ft · {r.capacity} person(s)
                      </p>
                      <p className="mt-3 text-[15px] font-semibold text-white">
                        Rp {r.pricePerMonth.toLocaleString('id-ID')}{' '}
                        <span className="text-[11px] font-normal text-[#9c9c9c]">/month</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SectionBlock>

            <SectionBlock title="Location">
              <LocationSection
                name={house.name}
                address={`${house.address}, ${cityName}, Banten`}
                landmark="Dekat fasilitas umum dan kampus utama"
                lat={house.latitude || -6.1154}
                lng={house.longitude || 106.1503}
                nearby={[
                  { name: 'Minimarket', distance: '150 m', icon: Store },
                  { name: 'Food street', distance: '300 m', icon: Utensils },
                  { name: 'Mosque', distance: '400 m', icon: Landmark },
                  { name: 'Bus stop', distance: '500 m', icon: Bus },
                  { name: 'Campus', distance: '1.2 km', icon: GraduationCap },
                ]}
              />
            </SectionBlock>

            <SectionBlock title="Reviews">
              <ReviewSection
                boardingHouseId={house.id}
                baseRating={reviewStats.rating}
                baseCount={reviewStats.count}
              />
            </SectionBlock>
          </div>

          <aside>
            <BookingCard
              price={formattedPrice}
              period="month"
              priceNumber={house.price}
              onReserve={handleReserveBooking}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}