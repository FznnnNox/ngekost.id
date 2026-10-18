import type { Metadata } from 'next';
import SectionHeading from '@/components/sections/SectionHeading';
import FindKosView from '@/components/find-kos/FindKosView';

export const metadata: Metadata = {
  title: 'Browse Kos near UNPAM Serang - Ngekost.id',
  description: 'Find kosan around Universitas Pamulang (UNPAM) Serang. Compare prices, distance, and facilities on the map.',
};

export default function FindKosPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-[#ededed]">

      <header className="mx-auto max-w-[1280px] px-4 pb-14 pt-8 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Browse kos near" title="UNPAM" />
          <p className="max-w-[320px] text-[14px] font-light leading-relaxed text-[#9c9c9c]">
            Every kosan inside the green zone is a short walk or ride from the UNPAM Serang campus.
          </p>
        </div>
      </header>

      <div className="bg-[#f4f4f2] px-4 pb-16 pt-6 text-[#111] sm:px-8">
        <FindKosView />
      </div>
    </main>
  );
}