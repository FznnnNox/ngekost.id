import type { Metadata } from 'next';
import BoardingHousesView from '@/components/admin/boarding-houses/BoardingHousesView';

export const metadata: Metadata = {
  title: 'Boarding Houses - Ngekost.id',
  robots: { index: false, follow: false },
};

export default function BoardingHousesPage() {
  return <BoardingHousesView />;
}