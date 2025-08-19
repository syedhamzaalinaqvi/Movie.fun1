import { ReactNode } from 'react';

export default function MediaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      {children}
    </div>
  );
}
