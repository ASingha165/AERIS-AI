import { NextRequest, NextResponse } from 'next/server';
import { AirQualityQuerySchema } from '@/lib/air-quality/schemas/air-quality-schema';
import { AirQualityService } from '@/lib/air-quality/services/air-quality-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');
    const radiusParam = searchParams.get('radius');
    const nameParam = searchParams.get('name') || undefined;

    const parseResult = AirQualityQuerySchema.safeParse({
      lat: latParam?.trim() ? latParam : undefined,
      lon: lonParam?.trim() ? lonParam : undefined,
      radius: radiusParam || undefined,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { lat, lon, radius } = parseResult.data;

    const data = await AirQualityService.getAirQualityData(
      lat,
      lon,
      radius,
      nameParam
    );

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        error: 'Failed to retrieve air quality data',
        message,
      },
      { status: 500 }
    );
  }
}
