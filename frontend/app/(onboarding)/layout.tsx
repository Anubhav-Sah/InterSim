type Props = {
  children: React.ReactNode;
};

export default function OnboardingLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-xl mx-auto p-8">
        {children}
      </main>
    </div>
  );
}
