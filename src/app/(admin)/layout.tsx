import Sidebar from '@/components/Sidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
