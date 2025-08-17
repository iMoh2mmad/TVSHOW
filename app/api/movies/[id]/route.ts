import { NextRequest, NextResponse } from 'next/server';
import { movieRepository } from '@/lib/repository/json';
import { UpdateMovieSchema } from '@/lib/schemas';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movie = await movieRepository.findById(params.id);
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: movie });
  } catch (error) {
    console.error('GET /api/movies/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateMovieSchema.parse(body);
    
    const movie = await movieRepository.update(params.id, validatedData);
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: movie });
  } catch (error) {
    console.error('PATCH /api/movies/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const success = await movieRepository.delete(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/movies/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}