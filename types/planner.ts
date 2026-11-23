export interface RoutineActivity {
  id: string;
  name: string;
  emoji: string;
  exertionLevel: 'Low Inhalation' | 'Aerobic Moderate' | 'Vigorous Load' | 'Pedestrian Peak' | 'Airing Rooms' | 'Child Lungs';
  inhalationMultiplier: number;
  defaultDurationMinutes: number;
  iconName: string;
}

export interface TimeSlotEvaluation {
  timeLabel: string;
  hour: number;
  estimatedAqi: number;
  pm25UgM3: number;
  exposureScore: number; // calculated exertion x concentration
  status: 'optimal' | 'moderate' | 'critical';
  recommendationNote: string;
}

export interface PlannedScheduleOutput {
  activity: RoutineActivity;
  targetDate: string;
  durationMinutes: number;
  selectedWindow: string;
  bestAlternativeWindow: string;
  overallExposureReductionPercent: number;
  evaluations: TimeSlotEvaluation[];
}

