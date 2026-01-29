import { type Metadata } from 'next'
type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'InterSim- Auth',
  description: 'Internship Simulation',
}

export default function PublicLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 border-b bg-white">
        <h1 className="text-xl font-bold text-gray-900">
          InterSim
        </h1>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  );
}
