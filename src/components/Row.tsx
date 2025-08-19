'use client';

import { Movie } from '@/types';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

interface RowProps {
  title: string;
  movies: Movie[];
  mediaType?: 'movie' | 'tv' | 'all';
}

const Row = ({ title, movies, mediaType = 'all' }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <FaChevronLeft
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />
        
        <div
          className="flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2"
          ref={rowRef}
        >
          {movies.map((movie) => (
            <Link 
              href={`/${mediaType === 'all' ? (movie.media_type || 'movie') : mediaType}/${movie.id}`}
              key={movie.id}
              className="block movie-card relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105"
            >
              <div className="relative w-full h-full">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${
                    movie.backdrop_path || movie.poster_path
                  }`}
                  className="rounded-sm object-cover md:rounded"
                  fill
                  alt={movie.title || movie.name || 'Movie'}
                  sizes="(max-width: 768px) 180px, 260px"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                  <h3 className="text-sm font-semibold line-clamp-1">
                    {movie.title || movie.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-green-400">
                      {Math.round((movie.vote_average || 0) * 10)}% Match
                    </span>
                    <span>•</span>
                    <span>
                      {mediaType === 'tv' 
                        ? `${movie.first_air_date?.substring(0, 4) || 'N/A'}` 
                        : `${movie.release_date?.substring(0, 4) || 'N/A'}`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <FaChevronRight
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
};

export default Row;
