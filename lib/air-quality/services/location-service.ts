import { LocationMetadata } from '@/types/air-quality';

export const PREDEFINED_LOCATIONS: LocationMetadata[] = [
  {
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
  },
  {
    name: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.3850,
    longitude: 78.4867,
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5204,
    longitude: 73.8567,
  },
  {
    name: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    latitude: 23.0225,
    longitude: 72.5714,
  },
];

export class LocationService {
  private static readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

  /**
   * Search for locations matching query string.
   * Matches predefined cities first, then queries Open-Meteo Geocoding API.
   */
  public static async searchLocations(query: string): Promise<LocationMetadata[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return PREDEFINED_LOCATIONS.slice(0, 5);
    }

    // Match local presets first
    const localMatches = PREDEFINED_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(trimmed) ||
        (loc.state && loc.state.toLowerCase().includes(trimmed))
    );

    try {
      const url = new URL(this.GEOCODING_URL);
      url.searchParams.set('name', trimmed);
      url.searchParams.set('count', '6');
      url.searchParams.set('language', 'en');
      url.searchParams.set('format', 'json');

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 86400 }, // 24-hr cache for static geographic coordinates
      });

      if (!res.ok) {
        return localMatches.length > 0 ? localMatches : PREDEFINED_LOCATIONS.slice(0, 5);
      }

      const data = await res.json();
      const results = data?.results;

      if (!Array.isArray(results) || results.length === 0) {
        return localMatches.length > 0 ? localMatches : PREDEFINED_LOCATIONS.slice(0, 5);
      }

      const apiMatches: LocationMetadata[] = results.map((item: {
        name: string;
        admin1?: string;
        country?: string;
        latitude: number;
        longitude: number;
      }) => ({
        name: item.name,
        state: item.admin1,
        country: item.country || 'Unknown',
        latitude: Number(item.latitude.toFixed(4)),
        longitude: Number(item.longitude.toFixed(4)),
      }));

      // Merge and deduplicate by coordinates (within 0.05 deg)
      const merged = [...localMatches];
      for (const apiLoc of apiMatches) {
        const isDuplicate = merged.some(
          (m) =>
            Math.abs(m.latitude - apiLoc.latitude) < 0.05 &&
            Math.abs(m.longitude - apiLoc.longitude) < 0.05
        );
        if (!isDuplicate) {
          merged.push(apiLoc);
        }
      }

      return merged.slice(0, 8);
    } catch {
      // Fallback to local matches or default
      return localMatches.length > 0 ? localMatches : PREDEFINED_LOCATIONS.slice(0, 5);
    }
  }

  /**
   * Reverse lookup or nearest city match for given coordinates
   */
  public static getNearestPredefinedLocation(latitude: number, longitude: number): LocationMetadata {
    let nearest = PREDEFINED_LOCATIONS[0];
    let minDistance = Infinity;

    for (const loc of PREDEFINED_LOCATIONS) {
      const d = Math.hypot(loc.latitude - latitude, loc.longitude - longitude);
      if (d < minDistance) {
        minDistance = d;
        nearest = loc;
      }
    }

    return {
      ...nearest,
      latitude,
      longitude,
    };
  }
}
