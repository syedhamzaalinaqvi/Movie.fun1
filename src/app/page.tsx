import Banner from '@/components/Banner';
import Row from '@/components/Row';

// TMDB API Configuration
const API_KEY = '46d13701165988b5bb5fb4d123c0447e';
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch trending movies
const fetchTrending = async () => {
  const res = await fetch(
    `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`
  );
  return res.json();
};

// Fetch top rated movies
const fetchTopRated = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`
  );
  return res.json();
};

// Fetch popular TV shows
const fetchTvPopular = async () => {
  const res = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US`
  );
  return res.json();
};

export default async function Home() {
  const [trendingNow, topRated, popularTv] = await Promise.all([
    fetchTrending(),
    fetchTopRated(),
    fetchTvPopular(),
  ]);

  return (
    <main className="relative pb-24 lg:space-y-24">
      {/* Banner */}
      <Banner movies={trendingNow.results} />
      
      <section className="md:space-y-16">
        {/* Trending Now */}
        <Row title="Trending Now" movies={trendingNow.results} />
        
        {/* Top Rated */}
        <Row title="Top Rated" movies={topRated.results} />
        
        {/* Popular TV Shows */}
        <Row title="Popular on Movie.Fun" movies={popularTv.results} mediaType="tv" />
      </section>
    </main>
  );
}
