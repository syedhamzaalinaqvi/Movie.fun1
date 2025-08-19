import { notFound } from 'next/navigation';
import { getMovieDetails, getMovieVideos } from '@/lib/tmdb';
import Image from 'next/image';
import { FaPlay, FaPlus, FaThumbsUp, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { Movie, Video } from '@/types';
import dynamic from 'next/dynamic';

// Dynamically import the video player with no SSR
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = params.id;
  
  // Fetch movie details and videos in parallel
  const [movie, videos] = await Promise.all([
    getMovieDetails(movieId),
    getMovieVideos(movieId)
  ]);

  if (!movie) {
    notFound();
  }

  // Find the first trailer video
  const trailer = videos?.results?.find((video: Video) => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title || movie.name || 'Movie'}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-4 md:px-12 lg:px-24">
        {/* Movie Info */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {movie.title || movie.name}
          </h1>
          
          <div className="flex items-center space-x-4 text-gray-300">
            <span className="text-green-500 font-semibold">
              {Math.round((movie.vote_average || 0) * 10)}% Match
            </span>
            <span>•</span>
            <span>
              {movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4)}
            </span>
            {movie.runtime && (
              <>
                <span>•</span>
                <span>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              </>
            )}
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center px-6 py-2 bg-white text-black rounded-md font-semibold hover:bg-opacity-80 transition">
              <FaPlay className="mr-2" /> Play
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-400 text-white hover:border-white">
              <FaPlus />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-400 text-white hover:border-white">
              <FaThumbsUp />
            </button>
          </div>

          <p className="text-lg text-gray-300">
            {movie.overview}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Genres:</p>
              <p className="text-white">
                {movie.genres?.map((g: any) => g.name).join(', ')}
              </p>
            </div>
            {movie.budget && movie.budget > 0 && (
              <div>
                <p className="text-gray-400">Budget:</p>
                <p className="text-white">${movie.budget.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Player Section */}
        <div className="mt-12 aspect-video max-w-5xl mx-auto bg-black rounded-lg overflow-hidden">
          {trailer ? (
            <div className="w-full h-full">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailer.key}`}
                width="100%"
                height="100%"
                controls
                playing
                light={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <p className="text-gray-400">No trailer available</p>
            </div>
          )}
        </div>

        {/* Similar Movies */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">More Like This</h2>
          {/* Similar movies list will go here */}
        </div>
      </div>
    </div>
  );
}
