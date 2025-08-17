export interface Subtitle {
  id: string;
  lang_code: string;
  label: string;
  url: string;
}

export interface Source {
  protocol: "HLS";
  master_url: string;
}

export interface PersonRef {
  id: string;
  name: string;
  role?: "cast" | "director" | "writer";
}

export interface Movie {
  id: string;
  title: string;
  overview?: string;
  year?: number;
  genres?: string[];
  tags?: string[];
  poster_url?: string;
  backdrop_url?: string;
  source?: Source;
  subtitles?: Subtitle[];
  people?: PersonRef[];
  published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  title: string;
  number: number;
  overview?: string;
  source?: Source;
  subtitles?: Subtitle[];
  runtime_minutes?: number;
}

export interface Season {
  id: string;
  number: number;
  title?: string;
  episodes: Episode[];
}

export interface Series {
  id: string;
  title: string;
  overview?: string;
  year?: number;
  genres?: string[];
  tags?: string[];
  poster_url?: string;
  backdrop_url?: string;
  seasons: Season[];
  people?: PersonRef[];
  published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  name: string;
  photo_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface FieldRule {
  selector: string;
  type?: "text" | "attr";
  attr?: string;
  resolve?: boolean;
  optional?: boolean;
}

export interface Mapping {
  title: string;
  poster_url?: string;
  overview?: string;
  year?: string;
  source_master_url?: string;
}

export interface Pagination {
  next_selector?: string;
  max_pages?: number;
}

export interface ScraperConfig {
  id: string;
  name: string;
  base_url: string;
  start_url: string;
  list_item_selector: string;
  fields: Record<string, FieldRule>;
  pagination?: Pagination;
  mapping: Mapping;
  defaults?: {
    source?: Source;
    subtitles?: Subtitle[];
    genres?: string[];
    tags?: string[];
  };
  legal_note?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "user";
  name?: string;
  created_at: string;
}