import type { Metadata } from 'next';
import DashboardView from '@/components/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Dashboard - Ngekost.id',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardView />;
}