import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AQICategory } from '@/types/air-quality';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export interface AQITheme {
  hex: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  badgeBg: string;
  glowClass: string;
}

export function getAQITheme(aqi: number): AQITheme {
  if (aqi <= 50) {
    return {
      hex: '#43D9A3',
      textClass: 'text-success',
      bgClass: 'bg-success/10',
      borderClass: 'border-success/30',
      badgeBg: 'bg-success/20 text-success',
      glowClass: 'shadow-[0_0_20px_rgba(67,217,163,0.3)]',
    };
  }
  if (aqi <= 100) {
    return {
      hex: '#53C7F5',
      textClass: 'text-secondary',
      bgClass: 'bg-secondary/10',
      borderClass: 'border-secondary/30',
      badgeBg: 'bg-secondary/20 text-secondary',
      glowClass: 'shadow-[0_0_20px_rgba(83,199,245,0.3)]',
    };
  }
  if (aqi <= 150) {
    return {
      hex: '#F6C453',
      textClass: 'text-[#F6C453]',
      bgClass: 'bg-[#F6C453]/10',
      borderClass: 'border-[#F6C453]/30',
      badgeBg: 'bg-[#F6C453]/20 text-[#F6C453]',
      glowClass: 'shadow-[0_0_20px_rgba(246,196,83,0.3)]',
    };
  }
  if (aqi <= 200) {
    return {
      hex: '#F16B77',
      textClass: 'text-danger',
      bgClass: 'bg-danger/10',
      borderClass: 'border-danger/30',
      badgeBg: 'bg-danger/20 text-danger',
      glowClass: 'shadow-[0_0_20px_rgba(241,107,119,0.3)]',
    };
  }
  if (aqi <= 300) {
    return {
      hex: '#B262F6',
      textClass: 'text-purple-400',
      bgClass: 'bg-purple-500/10',
      borderClass: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/20 text-purple-300',
      glowClass: 'shadow-[0_0_20px_rgba(178,98,246,0.3)]',
    };
  }
  return {
    hex: '#8A1834',
    textClass: 'text-rose-600',
    bgClass: 'bg-rose-950/20',
    borderClass: 'border-rose-700/40',
    badgeBg: 'bg-rose-900/40 text-rose-300',
    glowClass: 'shadow-[0_0_25px_rgba(138,24,52,0.4)]',
  };
}

export function formatTimeAgo(minutesAgo: number): string {
  if (minutesAgo < 1) return 'Just now';
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  return `${hours}h ago`;
}

