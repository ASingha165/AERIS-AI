export type AgeGroup = 'infant' | 'child' | 'adult' | 'senior';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  ageGroup: AgeGroup;
  age: number;
  respiratorySensitivity: 'none' | 'mild' | 'moderate' | 'severe';
  hasAsthma: boolean;
  hasCardiovascularCondition: boolean;
  dailyOutdoorHours: number;
}

export interface HouseholdProfile {
  id: string;
  householdName: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  homeType: 'apartment-high-rise' | 'apartment-low-rise' | 'independent-house' | 'dense-cluster';
  floorLevel: number;
  distanceToMajorRoadMeters: number;
  airPurifiersCount: number;
  plantsCount: number;
  cookingFuelType: 'lpg' | 'induction' | 'biomass' | 'kerosene';
  members: FamilyMember[];
  primaryCommuteMode: 'metro' | 'bus' | 'two-wheeler' | 'car-ac' | 'walking' | 'bicycle';
  vulnerabilityIndexScore: number; // 0 - 100
  vulnerabilityCategory: 'Low' | 'Moderate' | 'High' | 'Severe';
}

