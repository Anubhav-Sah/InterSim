import AppHeader from "@/components/layout/app-header";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-white border-r p-4">
        Sidebar
      </aside> */}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AppHeader />

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
