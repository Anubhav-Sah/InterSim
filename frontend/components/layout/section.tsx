type Props = {
  children: React.ReactNode;
};

export default function Section({ children }: Props) {
  return (
    <div className="space-y-4 mb-8">
      {children}
    </div>
  );
}
