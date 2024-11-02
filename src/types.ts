export interface SensorEvent {
  id: string;
  timestamp: string;
  location: string;
  eventCount: number;
}

export interface HourlyStats {
  hour: string;
  totalEvents: number;
  avgEventsPerLocation: number;
  uniqueLocations: number;
}

export interface DailyStats {
  date: string;
  totalEvents: number;
  avgEventsPerHour: number;
  peakHour: string;
  uniqueLocations: number;
}