import React from 'react';
import { Activity } from 'lucide-react';
import { DataSummary } from './components/DataSummary';
import { DataTable } from './components/DataTable';
import type { SensorEvent, HourlyStats, DailyStats } from './types';

// Mock data generator for demonstration
const generateMockData = (): SensorEvent[] => {
  const locations = ['Building A', 'Building B', 'Building C', 'Building D'];
  const data: SensorEvent[] = [];
  const startDate = new Date('2024-03-01');
  const endDate = new Date('2024-03-07');

  for (let date = new Date(startDate); date <= endDate; date.setHours(date.getHours() + 1)) {
    locations.forEach(location => {
      if (Math.random() > 0.3) { // 70% chance of having data for each location/hour
        data.push({
          id: crypto.randomUUID(),
          timestamp: date.toISOString(),
          location,
          eventCount: Math.floor(Math.random() * 50) + 1
        });
      }
    });
  }

  return data;
};

const processHourlyStats = (data: SensorEvent[]): HourlyStats[] => {
  const hourlyMap = new Map<string, SensorEvent[]>();
  
  data.forEach(event => {
    const hour = new Date(event.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      hour12: true
    });
    if (!hourlyMap.has(hour)) hourlyMap.set(hour, []);
    hourlyMap.get(hour)!.push(event);
  });

  return Array.from(hourlyMap.entries()).map(([hour, events]) => ({
    hour,
    totalEvents: events.reduce((sum, e) => sum + e.eventCount, 0),
    avgEventsPerLocation: events.reduce((sum, e) => sum + e.eventCount, 0) / events.length,
    uniqueLocations: new Set(events.map(e => e.location)).size
  }));
};

const processDailyStats = (data: SensorEvent[]): DailyStats[] => {
  const dailyMap = new Map<string, SensorEvent[]>();
  
  data.forEach(event => {
    const date = new Date(event.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    if (!dailyMap.has(date)) dailyMap.set(date, []);
    dailyMap.get(date)!.push(event);
  });

  return Array.from(dailyMap.entries()).map(([date, events]) => {
    const hourlyEvents = new Map<number, number>();
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyEvents.set(hour, (hourlyEvents.get(hour) || 0) + event.eventCount);
    });
    
    const peakHour = Array.from(hourlyEvents.entries()).reduce((a, b) => 
      a[1] > b[1] ? a : b
    );

    return {
      date,
      totalEvents: events.reduce((sum, e) => sum + e.eventCount, 0),
      avgEventsPerHour: events.reduce((sum, e) => sum + e.eventCount, 0) / 24,
      peakHour: `${peakHour[0]}:00 (${peakHour[1]} events)`,
      uniqueLocations: new Set(events.map(e => e.location)).size
    };
  });
};

function App() {
  const [sensorData] = React.useState<SensorEvent[]>(() => generateMockData());
  const hourlyStats = React.useMemo(() => processHourlyStats(sensorData), [sensorData]);
  const dailyStats = React.useMemo(() => processDailyStats(sensorData), [sensorData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">IoT Sensor Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <DataSummary data={sensorData} />
        <DataTable hourlyData={hourlyStats} dailyData={dailyStats} />
      </main>
    </div>
  );
}

export default App;