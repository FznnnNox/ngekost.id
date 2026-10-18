import type { Metadata } from 'next';
import DetailTopBar from '@/components/listing-detail/DetailTopBar';
import PhotoGallery from '@/components/listing-detail/PhotoGallery';
import ListingHeader from '@/components/listing-detail/ListingHeader';
import SectionBlock from '@/components/listing-detail/SectionBlock';
import FacilityGrid from '@/components/listing-detail/FacilityGrid';
import InfoList from '@/components/listing-detail/InfoList';
import RuleList from '@/components/listing-detail/RuleList';
import LocationSection from '@/components/listing-detail/LocationSection';
import BookingCard from '@/components/listing-detail/BookingCard';
import { listingData } from '@/components/listing-detail/data';

export const metadata: Metadata = {
  title: `${listingData.title} - KosFinder`,
  description: listingData.description,
};

// Sementara semua /listings/[id] menampilkan data statis yang sama
export default function ListingDetailPage() {
  const d = listingData;

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-10 text-[#ededed] sm:px-8">
      <div className="mx-auto max-w-[1100px]">
        <DetailTopBar />

        <PhotoGallery photos={d.photos} title={d.title} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Kiri: informasi */}
          <div className="space-y-8 lg:col-span-2">
            <ListingHeader title={d.title} location={d.location} rating={d.rating} reviewsCount={d.reviewsCount} />

            <p className="border-t border-white/10 pt-8 text-[14px] leading-relaxed text-[#c4c4c4]">{d.description}</p>

            <SectionBlock title="Room Facilities">
              <FacilityGrid items={d.roomFacilities} />
            </SectionBlock>

            <SectionBlock title="Bathroom Facilities">
              <FacilityGrid items={d.bathroomFacilities} />
            </SectionBlock>

            <SectionBlock title="Shared Facilities">
              <FacilityGrid items={d.sharedFacilities} />
            </SectionBlock>

            <SectionBlock title="Parking">
              <FacilityGrid items={d.parking} />
            </SectionBlock>

            <SectionBlock title="Kost Information">
              <InfoList items={d.rulesInfo} />
            </SectionBlock>

            <SectionBlock title="Location">
              <LocationSection
                name={d.title}
                address={d.map.address}
                landmark={d.map.landmark}
                lat={d.map.lat}
                lng={d.map.lng}
                nearby={d.map.nearby}
              />
            </SectionBlock>

            <SectionBlock title="Other Rules">
              <RuleList items={d.otherRules} />
            </SectionBlock>
          </div>

          {/* Kanan: widget booking */}
          <aside>
            <BookingCard price={d.price} period={d.period} />
          </aside>
        </div>
      </div>
    </main>
  );
}