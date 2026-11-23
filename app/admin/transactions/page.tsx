import type { Metadata } from 'next';
import TransactionsView from '@/components/admin/transactions/TransactionsView';

export const metadata: Metadata = {
  title: 'Transaction - Ngekost.id',
  robots: { index: false, follow: false },
};

export default function TransactionsPage() {
  return <TransactionsView />;
}