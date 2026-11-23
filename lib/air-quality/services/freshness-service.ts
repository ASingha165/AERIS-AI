import { DataFreshness } from '@/types/air-quality';

export class FreshnessService {
  /**
   * Freshness thresholds (in hours):
   * < 2 hours: LIVE (Current real-time observation)
   * 2 - 12 hours: RECENT (Recent observation within same diurnal cycle)
   * 12 - 48 hours: STALE (Stale observation, not representative of current dispersion)
   * > 48 hours or missing: UNAVAILABLE
   */
  public static readonly LIVE_THRESHOLD_HOURS = 2;
  public static readonly RECENT_THRESHOLD_HOURS = 12;
  public static readonly STALE_THRESHOLD_HOURS = 48;

  public static getFreshness(timestampIso: string | null | undefined): DataFreshness {
    if (!timestampIso) return 'UNAVAILABLE';

    const timestampMs = new Date(timestampIso).getTime();
    if (isNaN(timestampMs)) return 'UNAVAILABLE';

    const nowMs = Date.now();
    const diffHours = (nowMs - timestampMs) / (1000 * 60 * 60);

    // If future timestamp (e.g. slight clock drift), treat as LIVE
    if (diffHours < 0 && diffHours > -1) {
      return 'LIVE';
    }

    if (diffHours <= this.LIVE_THRESHOLD_HOURS) {
      return 'LIVE';
    }
    if (diffHours <= this.RECENT_THRESHOLD_HOURS) {
      return 'RECENT';
    }
    if (diffHours <= this.STALE_THRESHOLD_HOURS) {
      return 'STALE';
    }

    return 'UNAVAILABLE';
  }

  public static formatTimeDifference(timestampIso: string | null | undefined): string {
    if (!timestampIso) return 'No sync timestamp';

    const timestampMs = new Date(timestampIso).getTime();
    if (isNaN(timestampMs)) return 'Invalid date';

    const diffMinutes = Math.floor((Date.now() - timestampMs) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}
