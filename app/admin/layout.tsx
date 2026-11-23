import AdminGuard from '@/components/admin/AdminGuard';
import DashboardNavbar from '@/components/admin/TopNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen p-3 sm:p-8">
        <div className="mx-auto max-w-[1280px] rounded-[28px] p-4 text-[#ededed] sm:p-5">
          <DashboardNavbar />
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}