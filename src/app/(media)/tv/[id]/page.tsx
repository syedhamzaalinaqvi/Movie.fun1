import { notFound } from 'next/navigation';
import { getTVShowDetails, getTVShowVideos, getTVSeasonDetails, fetchFromTMDB } from '@/lib/tmdb';
import Image from 'next/image';
import { FaPlay, FaPlus, FaThumbsUp, FaVolumeMute, FaVolumeUp, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { TVShowDetails, Video, Season, Episode } from '@/types';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the video player with no SSR
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

// Episode component to handle individual episode display and playback
const EpisodeCard = ({ 
  episode, 
  showId,
  seasonNumber,
  onPlayEpisode 
}: { 
  episode: Episode; 
  showId: string;
  seasonNumber: number;
  onPlayEpisode: (episode: Episode) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="flex items-start p-3 hover:bg-gray-800/50 rounded-lg transition cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlayEpisode(episode)}
    >
      <div className="relative w-1/3 min-w-[120px] aspect-video rounded overflow-hidden">
        <Image
          src={episode.still_path 
            ? `https://image.tmdb.org/t/p/w500${episode.still_path}` 
            : '/placeholder-episode.jpg'}
          alt={`${episode.name} still`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
            <FaPlay className="text-black ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-xs">
          {episode.runtime || '--'}m
        </div>
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">
            {episode.episode_number}. {episode.name}
          </h3>
          <span className="text-sm text-gray-400">
            {episode.air_date?.substring(0, 4) || '--'}
          </span>
        </div>
        <p className="text-sm text-gray-300 mt-1 line-clamp-2">
          {episode.overview || 'No description available.'}
        </p>
      </div>
    </div>
  );
};

interface TVShowPageProps {
  params: {
    id: string;
  };
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  const tvId = params.id;
  
  // Fetch TV show details, videos, and reviews in parallel
  const [show, videos, reviews] = await Promise.all([
    getTVShowDetails(tvId),
    getTVShowVideos(tvId),
    fetchFromTMDB(`/tv/${tvId}/reviews`)
  ]);

  if (!show) {
    notFound();
  }

  // Find the first trailer video
  const trailer = videos?.results?.find((video: Video) => 
    (video.type === 'Trailer' || video.type === 'Teaser') && video.site === 'YouTube'
  );

  // Get the latest season (or first if no latest)
  const latestSeasonNumber = show.seasons?.find(s => s.season_number === show.number_of_seasons)?.season_number || 
                           show.seasons?.[0]?.season_number || 1;
  
  // Fetch the latest season details
  const latestSeason = await getTVSeasonDetails(tvId, latestSeasonNumber);

  return (
    <div className="relative">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path || show.poster_path}`}
          alt={show.name || 'TV Show'}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-4 md:px-12 lg:px-24">
        {/* Show Info */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {show.name}
          </h1>
          
          <div className="flex items-center space-x-4 text-gray-300">
            <span className="text-green-500 font-semibold">
              {Math.round((show.vote_average || 0) * 10)}% Match
            </span>
            <span>•</span>
            <span>{show.first_air_date?.substring(0, 4)}</span>
            <span>•</span>
            <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
            {show.episode_run_time?.[0] && (
              <>
                <span>•</span>
                <span>{show.episode_run_time[0]}m</span>
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
            {show.overview}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Genres:</p>
              <p className="text-white">
                {show.genres?.map((g: any) => g.name).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Seasons:</p>
              <p className="text-white">{show.number_of_seasons}</p>
            </div>
            <div>
              <p className="text-gray-400">Episodes:</p>
              <p className="text-white">{show.number_of_episodes}</p>
            </div>
            {show.networks && show.networks.length > 0 && (
              <div>
                <p className="text-gray-400">Network:</p>
                <p className="text-white">{show.networks[0].name}</p>
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
                light={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <p className="text-gray-400">No trailer available</p>
            </div>
          )}
        </div>

        {/* Episodes Section */}
        {latestSeason?.episodes && latestSeason.episodes.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Episodes</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Season {latestSeason.season_number}</span>
                <button className="text-gray-400 hover:text-white">
                  <FaChevronDown size={16} />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg overflow-hidden">
              {latestSeason.episodes.map((episode: Episode) => (
                <EpisodeCard 
                  key={episode.id} 
                  episode={episode}
                  showId={tvId}
                  seasonNumber={latestSeason.season_number}
                  onPlayEpisode={(episode) => {
                    // Handle episode playback
                    console.log('Play episode:', episode);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Seasons Section */}
        {show.seasons && show.seasons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {show.seasons
                .filter((s: any) => s.season_number > 0) // Skip specials (season 0)
                .map((season: any) => (
                  <div key={season.id} className="group cursor-pointer">
                    <div className="relative aspect-[2/3] rounded overflow-hidden">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${season.poster_path || show.poster_path}`}
                        alt={`${show.name} - ${season.name}`}
                        fill
                        className="object-cover group-hover:opacity-80 transition"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition" />
                    </div>
                    <div className="mt-2">
                      <h3 className="font-semibold">{season.name}</h3>
                      <p className="text-sm text-gray-400">{season.episode_count} episodes</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          
          {/* Add Review Form */}
          <div className="bg-gray-900/50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="5"
                >
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 10 ? '★' : num + ' ★'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Review
                </label>
                <textarea
                  id="review"
                  name="review"
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts about this show..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews?.results && reviews.results.length > 0 ? (
              reviews.results.map((review: any) => (
                <div key={review.id} className="bg-gray-900/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.author}</h4>
                        <div className="flex items-center text-yellow-400 text-sm">
                          {'★'.repeat(Math.floor(review.author_details.rating / 2))}
                          {review.author_details.rating % 2 === 1 && '½'}
                          <span className="text-gray-400 ml-2">
                            ({review.author_details.rating}/10)
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-line">
                    {review.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No reviews yet. Be the first to review this show!
              </div>
            )}
          </div>
        </div>

        {/* Similar Shows */}
        {show.similar?.results && show.similar.results.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {show.similar.results.slice(0, 6).map((item: any) => (
                <a 
                  key={item.id} 
                  href={`/tv/${item.id}`}
                  className="group block"
                >
                  <div className="relative aspect-video rounded overflow-hidden">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:opacity-80 transition"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition" />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="text-green-500">
                        {Math.round((item.vote_average || 0) * 10)}%
                      </span>
                      <span className="mx-1">•</span>
                      <span>{item.first_air_date?.substring(0, 4)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
