import type { Metadata } from 'next';
import SectionHeading from '@/components/sections/SectionHeading';
import LoginForm from '@/components/login/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login - Ngekost.id',
  description: 'Admin access for managing Ngekost.id listings.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-[#f4f4f2]">
      <header className="mx-auto max-w-[1280px] px-4 pb-14 pt-24 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Admin only" title="Sign in to your dashboard" />
          <p className="max-w-[320px] text-[14px] font-light leading-relaxed text-[#9c9c9c]">
            This area is for Ngekost.id admins. Visitors can contact kos owners directly via WhatsApp from each listing.
          </p>
        </div>
      </header>

      <div className="bg-[#f4f4f2] px-4 pb-16 pt-6 text-[#111] sm:px-8">
        <LoginForm />
      </div>
    </main>
  );
}