import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Movie.Fun - Watch Movies & TV Shows Online',
  description: 'Stream your favorite movies and TV shows on Movie.Fun',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <div className="relative min-h-screen">
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
