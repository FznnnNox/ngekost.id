import type { Metadata } from 'next';
import LoginShowcase from '@/components/login/LoginShowcase';
import LoginForm from '@/components/login/LoginForm';
import LoginGuard from '@/components/login/LoginGuard';

export const metadata: Metadata = {
  title: 'Admin Login - Ngekost.id',
  description: 'Admin access for managing Ngekost.id listings.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <LoginGuard>
      <main className="grid min-h-screen bg-white text-[#111] lg:grid-cols-2">
        <LoginShowcase />
        <LoginForm />
      </main>
    </LoginGuard>
  );
}