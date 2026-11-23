export interface TransportModeComparison {
  id: string;
  name: string;
  icon: string;
  co2GramsPerKm: number;
  pmEmissionsGramPerKm: number;
  personalExposureIndex: number; // scale 1-10
  sustainableBadge?: string;
  costEstimateInrPerKm: number;
}

export interface CommunityImpactMetric {
  title: string;
  metricValue: string;
  metricUnit: string;
  subtext: string;
  changeRate: string;
  icon: string;
}

