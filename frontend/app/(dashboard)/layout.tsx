import { Sidebar } from '../../components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 bg-bg-base min-h-screen p-6">
        {children}
      </main>
    </div>
  );
}
