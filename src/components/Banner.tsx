'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/types';
import { FaPlay } from 'react-icons/fa';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface BannerProps {
  movies: Movie[];
}

const Banner = ({ movies }: BannerProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    // Select a random movie for the banner
    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovie(randomMovie);
    }
  }, [movies]);

  if (!movie) {
    return <div className="h-[56.25vw] bg-gray-900" />;
  }

  // Truncate the overview text
  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <div className="relative h-[56.25vw]">
      <div className="absolute w-full h-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title || movie.name || 'Movie'}
          fill
          className="object-cover brightness-[60%]"
          priority
        />
      </div>

      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <h1 className="text-3xl md:text-5xl h-full w-[50%] lg:text-6xl font-bold drop-shadow-xl">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <p className="text-white text-xs md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {truncate(movie?.overview || '', 150)}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <button className="bannerButton bg-white text-black">
            <FaPlay className="h-4 w-4 text-black md:h-7 md:w-7" />
            Play
          </button>
          <button className="bannerButton bg-[gray]/70">
            <InformationCircleIcon className="h-5 w-5 md:h-8 md:w-8" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
