import { NextRequest, NextResponse } from 'next/server';
import { LocationQuerySchema } from '@/lib/air-quality/schemas/air-quality-schema';
import { LocationService } from '@/lib/air-quality/services/location-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    const parseResult = LocationQuerySchema.safeParse({ q });
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameter',
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const locations = await LocationService.searchLocations(parseResult.data.q);

    return NextResponse.json(locations, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        error: 'Failed to search locations',
        message,
      },
      { status: 500 }
    );
  }
}
