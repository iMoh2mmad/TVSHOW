import { movieRepository, seriesRepository, personRepository } from '@/lib/repository/json';

const demoMovies = [
  {
    title: 'The Great Adventure',
    overview: 'An epic tale of courage and discovery in uncharted lands. Follow our heroes as they embark on a journey that will change their lives forever.',
    year: 2023,
    genres: ['Adventure', 'Action', 'Drama'],
    tags: ['epic', 'journey', 'heroes'],
    poster_url: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg',
    backdrop_url: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg',
    source: {
      protocol: 'HLS' as const,
      master_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    },
    subtitles: [
      {
        id: 'en-1',
        lang_code: 'en',
        label: 'English',
        url: 'https://example.com/subtitles/en.vtt'
      }
    ],
    published: true
  },
  {
    title: 'Mystery of the Lost City',
    overview: 'A thrilling mystery that takes viewers deep into the heart of an ancient civilization.',
    year: 2022,
    genres: ['Mystery', 'Adventure', 'Thriller'],
    tags: ['mystery', 'ancient', 'civilization'],
    poster_url: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg',
    backdrop_url: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg',
    published: true
  }
];

const demoSeries = [
  {
    title: 'Chronicles of Tomorrow',
    overview: 'A sci-fi series exploring the possibilities of future technology and human evolution.',
    year: 2023,
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    tags: ['future', 'technology', 'evolution'],
    poster_url: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
    backdrop_url: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
    seasons: [
      {
        id: 'season-1',
        number: 1,
        title: 'The Beginning',
        episodes: [
          {
            id: 'ep-1-1',
            title: 'Pilot',
            number: 1,
            overview: 'The journey begins...',
            source: {
              protocol: 'HLS' as const,
              master_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
            },
            runtime_minutes: 45
          },
          {
            id: 'ep-1-2',
            title: 'New Discoveries',
            number: 2,
            overview: 'The plot thickens...',
            runtime_minutes: 42
          }
        ]
      }
    ],
    published: true
  }
];

const demoPeople = [
  {
    name: 'John Director',
    photo_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    bio: 'Acclaimed director with over 20 years of experience in filmmaking.'
  },
  {
    name: 'Jane Actor',
    photo_url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    bio: 'Award-winning actress known for her versatile performances.'
  }
];

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed people first
    console.log('Creating demo people...');
    for (const person of demoPeople) {
      await personRepository.create(person);
    }

    // Seed movies
    console.log('Creating demo movies...');
    for (const movie of demoMovies) {
      await movieRepository.create(movie);
    }

    // Seed series
    console.log('Creating demo series...');
    for (const series of demoSeries) {
      await seriesRepository.create(series);
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}

export default seed;