import React from 'react';
import { FileDown } from 'lucide-react';
import type { SensorEvent } from '../types';
import { exportData } from '../utils/export';

interface Props {
  data: SensorEvent[];
}

export function DataSummary({ data }: Props) {
  const totalEvents = data.reduce((sum, event) => sum + event.eventCount, 0);
  const uniqueLocations = new Set(data.map(event => event.location)).size;
  const dateRange = {
    start: new Date(Math.min(...data.map(e => new Date(e.timestamp).getTime()))),
    end: new Date(Math.max(...data.map(e => new Date(e.timestamp).getTime())))
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Overview</h2>
        <div className="space-x-2">
          <button
            onClick={() => exportData(data, 'csv')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => exportData(data, 'json')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export JSON
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600">{totalEvents.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Unique Locations</h3>
          <p className="text-3xl font-bold text-green-600">{uniqueLocations}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Date Range</h3>
          <p className="text-sm font-medium text-purple-600">
            {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800">Avg Events/Location</h3>
          <p className="text-3xl font-bold text-orange-600">
            {Math.round(totalEvents / uniqueLocations).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}