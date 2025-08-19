import Banner from '@/components/Banner';
import Row from '@/components/Row';
import { fetchFromTMDB } from '@/lib/tmdb';

// Fetch data for the homepage
const fetchHomePageData = async () => {
  try {
    const [
      trendingNow,
      topRatedMovies,
      popularTv,
      actionMovies,
      comedyMovies,
      documentaries,
      trendingTv,
      topRatedTv,
    ] = await Promise.all([
      // Trending across all (movies and TV)
      fetchFromTMDB('/trending/all/week'),
      
      // Movies
      fetchFromTMDB('/movie/top_rated'),
      fetchFromTMDB('/tv/popular'),
      fetchFromTMDB('/discover/movie', { with_genres: '28' }), // Action
      fetchFromTMDB('/discover/movie', { with_genres: '35' }), // Comedy
      fetchFromTMDB('/discover/movie', { with_genres: '99' }), // Documentary
      
      // TV Shows
      fetchFromTMDB('/trending/tv/day'),
      fetchFromTMDB('/tv/top_rated'),
    ] as const);

    return {
      trendingNow: trendingNow.results,
      topRatedMovies: topRatedMovies.results,
      popularTv: popularTv.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      documentaries: documentaries.results,
      trendingTv: trendingTv.results,
      topRatedTv: topRatedTv.results,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
};

export default async function Home() {
  const {
    trendingNow,
    topRatedMovies,
    popularTv,
    actionMovies,
    comedyMovies,
    documentaries,
    trendingTv,
    topRatedTv,
  } = await fetchHomePageData();

  // Get a random movie for the banner
  const bannerMovie = trendingNow && trendingNow.length > 0 
    ? trendingNow[Math.floor(Math.random() * trendingNow.length)] 
    : null;

  return (
    <main className="relative pb-24 lg:space-y-24">
      {/* Banner with a random trending movie */}
      <Banner movie={bannerMovie} />
      
      <section className="md:space-y-16">
        {/* Trending Now (All) */}
        <Row 
          title="Trending Now" 
          movies={trendingNow} 
          mediaType="all"
        />
        
        {/* Top Rated Movies */}
        <Row 
          title="Top Rated Movies" 
          movies={topRatedMovies} 
          mediaType="movie"
        />
        
        {/* Popular TV Shows */}
        <Row 
          title="Popular TV Shows" 
          movies={popularTv} 
          mediaType="tv"
        />
        
        {/* Action Movies */}
        <Row 
          title="Action Movies" 
          movies={actionMovies} 
          mediaType="movie"
        />
        
        {/* Comedy Movies */}
        <Row 
          title="Comedy Movies" 
          movies={comedyMovies} 
          mediaType="movie"
        />
        
        {/* Trending TV Shows */}
        <Row 
          title="Trending TV Shows" 
          movies={trendingTv} 
          mediaType="tv"
        />
        
        {/* Top Rated TV Shows */}
        <Row 
          title="Top Rated TV Shows" 
          movies={topRatedTv} 
          mediaType="tv"
        />
        
        {/* Documentaries */}
        <Row 
          title="Documentaries" 
          movies={documentaries} 
          mediaType="movie"
        />
      </section>
    </main>
  );
}
