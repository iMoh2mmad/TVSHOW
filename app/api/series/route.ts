import { NextRequest, NextResponse } from 'next/server';
import { seriesRepository } from '@/lib/repository/json';
import { CreateSeriesSchema } from '@/lib/schemas';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const published = searchParams.get('published');
    
    let series = await seriesRepository.findAll();
    
    // Filter by published status if specified
    if (published === 'true') {
      series = series.filter(s => s.published === true);
    }
    
    // Search if query provided
    if (query) {
      series = await seriesRepository.search(query);
    }
    
    return NextResponse.json({ data: series });
  } catch (error) {
    console.error('GET /api/series error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
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
    const validatedData = CreateSeriesSchema.parse(body);
    
    const series = await seriesRepository.create(validatedData);
    
    return NextResponse.json({ data: series }, { status: 201 });
  } catch (error) {
    console.error('POST /api/series error:', error);
    return NextResponse.json(
      { error: 'Failed to create series' },
      { status: 500 }
    );
  }
}