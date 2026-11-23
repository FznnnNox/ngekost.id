import type { Metadata } from 'next';
import CategoriesView from '@/components/admin/categories/CategoriesView';

export const metadata: Metadata = {
  title: 'Category - Ngekost.id',
  robots: { index: false, follow: false },
};

export default function CategoriesPage() {
  return <CategoriesView />;
}