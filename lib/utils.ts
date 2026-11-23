import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AQICategory } from '@/types/air-quality';
import { getCPCBCategory } from './air-quality/calculations/cpcb-aqi';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAQICategory(aqi: number): AQICategory {
  return getCPCBCategory(aqi);
}

export interface AQITheme {
  hex: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  badgeBg: string;
  glowClass: string;
}

export function getAQITheme(aqi: number | null | undefined): AQITheme {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return {
      hex: '#A5B7C8',
      textClass: 'text-outline',
      bgClass: 'bg-outline/10',
      borderClass: 'border-outline/30',
      badgeBg: 'bg-outline/20 text-outline',
      glowClass: 'shadow-none',
    };
  }

  // Official Indian CPCB NAQI Categories & Color Mapping
  if (aqi <= 50) {
    // Good (0-50)
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
    // Satisfactory (51-100)
    return {
      hex: '#53C7F5',
      textClass: 'text-secondary',
      bgClass: 'bg-secondary/10',
      borderClass: 'border-secondary/30',
      badgeBg: 'bg-secondary/20 text-secondary',
      glowClass: 'shadow-[0_0_20px_rgba(83,199,245,0.3)]',
    };
  }
  if (aqi <= 200) {
    // Moderately Polluted (101-200)
    return {
      hex: '#F6C453',
      textClass: 'text-[#F6C453]',
      bgClass: 'bg-[#F6C453]/10',
      borderClass: 'border-[#F6C453]/30',
      badgeBg: 'bg-[#F6C453]/20 text-[#F6C453]',
      glowClass: 'shadow-[0_0_20px_rgba(246,196,83,0.3)]',
    };
  }
  if (aqi <= 300) {
    // Poor (201-300)
    return {
      hex: '#FF8A65',
      textClass: 'text-[#FF8A65]',
      bgClass: 'bg-[#FF8A65]/10',
      borderClass: 'border-[#FF8A65]/30',
      badgeBg: 'bg-[#FF8A65]/20 text-[#FF8A65]',
      glowClass: 'shadow-[0_0_20px_rgba(255,138,101,0.3)]',
    };
  }
  if (aqi <= 400) {
    // Very Poor (301-400)
    return {
      hex: '#F16B77',
      textClass: 'text-danger',
      bgClass: 'bg-danger/10',
      borderClass: 'border-danger/30',
      badgeBg: 'bg-danger/20 text-danger',
      glowClass: 'shadow-[0_0_20px_rgba(241,107,119,0.3)]',
    };
  }
  // Severe (401-500+)
  return {
    hex: '#B262F6',
    textClass: 'text-purple-400',
    bgClass: 'bg-purple-950/20',
    borderClass: 'border-purple-700/40',
    badgeBg: 'bg-purple-900/40 text-purple-300',
    glowClass: 'shadow-[0_0_25px_rgba(178,98,246,0.4)]',
  };
}

export function formatTimeAgo(minutesAgo: number): string {
  if (minutesAgo < 1) return 'Just now';
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  return `${hours}h ago`;
}
