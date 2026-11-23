export interface RoomZone {
  id: string;
  name: string;
  iconName: string;
  areaSqFt: number;
  volumeM3: number;
  occupancyDescription: string;
  fenestration: string;
  ventilationType: string;
  thermalUnit: string;
  estimatedExposureReductionUgM3: number;
  estimatedMicroZoneAqi: number;
  statusLabel: string;
  recommendedAirChangesPerHour: number;
  strategies: IndoorStrategy[];
}

export interface IndoorStrategy {
  id: string;
  title: string;
  category: 'immediate' | 'ventilation' | 'budget-friendly' | 'purifier';
  costLevel: 'Free' | 'Low (<$15)' | 'Moderate' | 'High';
  effectivenessPercent: number;
  description: string;
  isCompleted: boolean;
}

