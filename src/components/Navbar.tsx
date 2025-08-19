'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-2 transition-all lg:px-10 lg:py-4 ${
        isScrolled && 'bg-gradient-to-b from-black to-transparent'
      }`}
    >
      <div className="flex items-center space-x-2 md:space-x-8">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-netflix-red">Movie.Fun</h1>
        </Link>
        
        <nav className="hidden space-x-4 md:flex">
          <Link 
            href="/" 
            className={`text-sm font-light ${pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-gray-200'}`}
          >
            Home
          </Link>
          <Link 
            href="/movies" 
            className={`text-sm font-light ${pathname === '/movies' ? 'text-white' : 'text-gray-300 hover:text-gray-200'}`}
          >
            Movies
          </Link>
          <Link 
            href="/tv-shows" 
            className={`text-sm font-light ${pathname === '/tv-shows' ? 'text-white' : 'text-gray-300 hover:text-gray-200'}`}
          >
            TV Shows
          </Link>
          <Link 
            href="/my-list" 
            className={`text-sm font-light ${pathname === '/my-list' ? 'text-white' : 'text-gray-300 hover:text-gray-200'}`}
          >
            My List
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FaSearch className="h-5 w-5 cursor-pointer text-gray-200 hover:text-gray-300" />
          <span className="hidden lg:inline">Search</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaBell className="h-5 w-5 cursor-pointer text-gray-200 hover:text-gray-300" />
          <span className="hidden lg:inline">Notifications</span>
        </div>
        <div className="flex cursor-pointer items-center space-x-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-md">
            <Image
              src="/default-avatar.png"
              alt="Profile"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
              }}
            />
          </div>
          <FaChevronDown className="h-4 w-4 text-gray-200" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
