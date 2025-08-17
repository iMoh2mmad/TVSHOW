import { NextRequest, NextResponse } from 'next/server';
import { movieRepository } from '@/lib/repository/json';
import { CreateMovieSchema, MovieSchema } from '@/lib/schemas';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const published = searchParams.get('published');
    
    let movies = await movieRepository.findAll();
    
    // Filter by published status if specified
    if (published === 'true') {
      movies = movies.filter(movie => movie.published === true);
    }
    
    // Search if query provided
    if (query) {
      movies = await movieRepository.search(query);
    }
    
    return NextResponse.json({ data: movies });
  } catch (error) {
    console.error('GET /api/movies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CreateMovieSchema.parse(body);
    
    const movie = await movieRepository.create(validatedData);
    
    return NextResponse.json({ data: movie }, { status: 201 });
  } catch (error) {
    console.error('POST /api/movies error:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}