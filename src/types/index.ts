export interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
  popularity?: number;
  vote_count?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  status: string;
  revenue: number;
  budget: number;
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  similar: {
    results: Movie[];
  };
}

export interface TVShowDetails extends Movie {
  genres: Genre[];
  number_of_episodes: number;
  number_of_seasons: number;
  episode_run_time: number[];
  status: string;
  created_by: {
    id: number;
    name: string;
    profile_path: string;
  }[];
  seasons: Season[];
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  similar: {
    results: Movie[];
  };
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  vote_average: number;
  vote_count: number;
  air_date: string;
  runtime: number;
  crew: Crew[];
  guest_stars: Cast[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}
