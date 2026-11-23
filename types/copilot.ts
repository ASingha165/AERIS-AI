export interface ProjectedExposurePoint {
  timeLabel: string;
  pm25Concentration: number;
  alertLevel: 'normal' | 'moderate' | 'high' | 'critical';
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  senderName?: string;
  confidenceScore?: number;
  sensitiveGroupFlag?: string;
  timeWindowTag?: string;
  strategicRecommendation?: {
    statusEmoji: string;
    headline: string;
    summary: string;
    optimalAlternativeTime?: string;
  };
  projectedExposure?: {
    location: string;
    points: ProjectedExposurePoint[];
  };
  reasoning?: {
    headline: string;
    details: string;
  };
  actionChips?: string[];
  groundingSources?: {
    cpcbStandard: string;
    whoGuideline: string;
    satelliteSensor: string;
  };
}

export interface QuickPromptSuggestion {
  id: string;
  label: string;
  category: 'routine' | 'child' | 'indoor' | 'commute';
  promptText: string;
}

