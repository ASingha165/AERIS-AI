import { DataFreshness } from '@/types/air-quality';

export class FreshnessService {
  public static readonly LIVE_THRESHOLD_HOURS = 2;
  public static readonly RECENT_THRESHOLD_HOURS = 12;
  public static readonly STALE_THRESHOLD_HOURS = 48;
  private static readonly FUTURE_CLOCK_SKEW_TOLERANCE_HOURS = 1;

  public static getFreshness(timestampIso: string | null | undefined): DataFreshness {
    if (!timestampIso) return 'UNAVAILABLE';

    const timestampMs = new Date(timestampIso).getTime();
    if (!Number.isFinite(timestampMs)) return 'UNAVAILABLE';

    const diffHours = (Date.now() - timestampMs) / (1000 * 60 * 60);

    // Allow small clock skew, but do not classify materially future-dated data as live.
    if (diffHours < -this.FUTURE_CLOCK_SKEW_TOLERANCE_HOURS) return 'UNAVAILABLE';
    if (diffHours < 0) return 'LIVE';
    if (diffHours <= this.LIVE_THRESHOLD_HOURS) return 'LIVE';
    if (diffHours <= this.RECENT_THRESHOLD_HOURS) return 'RECENT';
    if (diffHours <= this.STALE_THRESHOLD_HOURS) return 'STALE';
    return 'UNAVAILABLE';
  }

  public static formatTimeDifference(timestampIso: string | null | undefined): string {
    if (!timestampIso) return 'No sync timestamp';

    const timestampMs = new Date(timestampIso).getTime();
    if (!Number.isFinite(timestampMs)) return 'Invalid date';

    const diffMinutes = Math.floor((Date.now() - timestampMs) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}
