const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY || '');
  url.searchParams.append('language', 'en-US');
  
  // Add any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
}

export async function getMovieDetails(movieId: string) {
  return fetchFromTMDB(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar,reviews'
  });
}

export async function getTVShowDetails(tvId: string) {
  return fetchFromTMDB(`/tv/${tvId}`, {
    append_to_response: 'credits,videos,similar,reviews,content_ratings'
  });
}

export async function getMovieVideos(movieId: string) {
  return fetchFromTMDB(`/movie/${movieId}/videos`);
}

export async function getTVShowVideos(tvId: string) {
  return fetchFromTMDB(`/tv/${tvId}/videos`);
}

export async function getTVSeasonDetails(tvId: string, seasonNumber: number) {
  return fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`, {
    append_to_response: 'credits,videos,images,external_ids'
  });
}

export async function getSimilarMovies(movieId: string) {
  return fetchFromTMDB(`/movie/${movieId}/similar`);
}

export async function getSimilarTVShows(tvId: string) {
  return fetchFromTMDB(`/tv/${tvId}/similar`);
}

export async function searchMovies(query: string, page: number = 1) {
  return fetchFromTMDB('/search/movie', {
    query,
    page: page.toString(),
    include_adult: 'false'
  });
}

export async function searchTVShows(query: string, page: number = 1) {
  return fetchFromTMDB('/search/tv', {
    query,
    page: page.toString(),
    include_adult: 'false'
  });
}

// Image URL builder
export function getImageUrl(path: string, size: 'w500' | 'original' = 'w500') {
  return path 
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : '/no-image.jpg';
}

// Get YouTube thumbnail URL
export function getYouTubeThumbnail(videoKey: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault') {
  return `https://img.youtube.com/vi/${videoKey}/${quality}.jpg`;
}
