import type { Metadata } from 'next';
import UsersView from '@/components/admin/users/UsersView';

export const metadata: Metadata = {
  title: 'User - Ngekost.id',
  robots: { index: false, follow: false },
};

export default function UsersPage() {
  return <UsersView />;
}