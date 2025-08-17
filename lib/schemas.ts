import { z } from 'zod';

export const SubtitleSchema = z.object({
  id: z.string(),
  lang_code: z.string(),
  label: z.string(),
  url: z.string().url(),
});

export const SourceSchema = z.object({
  protocol: z.literal("HLS"),
  master_url: z.string().url(),
});

export const PersonRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["cast", "director", "writer"]).optional(),
});

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  overview: z.string().optional(),
  year: z.number().min(1800).max(2100).optional(),
  genres: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  poster_url: z.string().url().optional(),
  backdrop_url: z.string().url().optional(),
  source: SourceSchema.optional(),
  subtitles: z.array(SubtitleSchema).optional(),
  people: z.array(PersonRefSchema).optional(),
  published: z.boolean().optional().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export const EpisodeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  number: z.number().positive(),
  overview: z.string().optional(),
  source: SourceSchema.optional(),
  subtitles: z.array(SubtitleSchema).optional(),
  runtime_minutes: z.number().positive().optional(),
});

export const SeasonSchema = z.object({
  id: z.string(),
  number: z.number().positive(),
  title: z.string().optional(),
  episodes: z.array(EpisodeSchema),
});

export const SeriesSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  overview: z.string().optional(),
  year: z.number().min(1800).max(2100).optional(),
  genres: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  poster_url: z.string().url().optional(),
  backdrop_url: z.string().url().optional(),
  seasons: z.array(SeasonSchema),
  people: z.array(PersonRefSchema).optional(),
  published: z.boolean().optional().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PersonSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  photo_url: z.string().url().optional(),
  bio: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ScraperConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  base_url: z.string().url(),
  start_url: z.string().url(),
  list_item_selector: z.string().min(1, "List item selector is required"),
  fields: z.record(z.object({
    selector: z.string(),
    type: z.enum(["text", "attr"]).optional(),
    attr: z.string().optional(),
    resolve: z.boolean().optional(),
    optional: z.boolean().optional(),
  })),
  pagination: z.object({
    next_selector: z.string().optional(),
    max_pages: z.number().positive().optional(),
  }).optional(),
  mapping: z.object({
    title: z.string(),
    poster_url: z.string().optional(),
    overview: z.string().optional(),
    year: z.string().optional(),
    source_master_url: z.string().optional(),
  }),
  defaults: z.object({
    source: SourceSchema.optional(),
    subtitles: z.array(SubtitleSchema).optional(),
    genres: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
  legal_note: z.string().optional(),
});

// Request/Response schemas
export const CreateMovieSchema = MovieSchema.omit({ id: true, created_at: true, updated_at: true });
export const UpdateMovieSchema = CreateMovieSchema.partial();

export const CreateSeriesSchema = SeriesSchema.omit({ id: true, created_at: true, updated_at: true });
export const UpdateSeriesSchema = CreateSeriesSchema.partial();

export const CreatePersonSchema = PersonSchema.omit({ id: true, created_at: true, updated_at: true });
export const UpdatePersonSchema = CreatePersonSchema.partial();