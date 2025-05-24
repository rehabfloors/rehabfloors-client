// src/pages/monitoring/FallDetection.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, MapPin, Clock, ChevronDown, ListFilter, Eye, ArrowUpDown } from 'lucide-react';
import {
  // fetchSensorData, // We'll use subscribeToSensorUpdates for live data
  subscribeToSensorUpdates,
  SensorState,
  BoardLayout,
  DEFAULT_BOARD_LAYOUT
} from '../../services/iotService'; // IMPORT FROM SERVICE
// Removed FallIncident import from mockData, it should be local or defined here

// --- Local Interfaces (as they were in your original FallDetection.tsx) ---
interface FallStat {
  id: string;
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

interface FallIncident {
  id: string;
  incidentId: string;
  patientName: string;
  patientImage?: string;
  timestamp: string;
  location: string;
  notes: string;
  status: 'Unresolved' | 'Resolved';
}

// --- Mock Data (can be moved to a service or kept for non-IoT parts if needed) ---
const fallStatsData: FallStat[] = [ // Added explicit type FallStat[]
  { id: 'fs1', value: 3, label: 'Total Falls Today (Mock)', bgColor: 'bg-white', textColor: 'text-gray-800' },
  { id: 'fs2', value: 1, label: 'High Severity (Mock)', bgColor: 'bg-red-100', textColor: 'text-red-700', icon: <AlertTriangle size={20} className="text-red-500" /> },
  { id: 'fs3', value: 0, label: 'Medium/Low Severity (Mock)', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { id: 'fs4', value: 2, label: 'Resolved Today (Mock)', bgColor: 'bg-green-100', textColor: 'text-green-700' },
];

const initialFallIncidentsData: FallIncident[] = [
  {
    id: 'fi1',
    incidentId: 'F103',
    patientName: 'Emily Martinez (Mock)',
    timestamp: 'May 24 2025, 9:15 AM',
    location: 'Therapy Room 1',
    notes: 'Patient lost balance during exercise. Currently under observation.',
    status: 'Unresolved',
  },
  {
    id: 'fi2',
    incidentId: 'F102',
    patientName: 'Michelle Williams (Mock)',
    timestamp: 'May 23 2025, 10:37 PM',
    location: 'Hallway B',
    notes: 'Patient fell while attempting to walk unassisted. Minor bruising on right arm.',
    status: 'Resolved',
  },
];


// --- Local Components (as they were in your original FallDetection.tsx) ---
const FallStatCard: React.FC<FallStat> = ({ value, label, bgColor, textColor, icon }) => {
  return (
    <div className={`${bgColor} rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col items-center justify-center text-center`}>
      {icon && <div className="mb-1.5">{icon}</div>}
      <div className={`text-4xl font-bold ${textColor}`}>{value}</div>
      <div className={`text-sm mt-1 ${icon ? textColor : 'text-gray-600'}`}>{label}</div>
    </div>
  );
};

const IncidentCard: React.FC<{ incident: FallIncident; onMarkAsResolved: (id: string) => void }> = ({ incident, onMarkAsResolved }) => {
  const isUnresolved = incident.status === 'Unresolved';
  return (
    <div className={`p-4 rounded-lg border ${isUnresolved ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          {isUnresolved ? <AlertTriangle size={20} className="text-red-600 mr-2" /> : <CheckCircle2 size={20} className="text-green-600 mr-2" />}
          <h3 className={`text-md font-semibold ${isUnresolved ? 'text-red-700' : 'text-green-700'}`}>{incident.incidentId}</h3>
        </div>
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${isUnresolved ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {incident.status}
        </span>
      </div>
      <div className="text-sm text-gray-700 mb-1"><strong>Patient:</strong> {incident.patientName}</div>
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <Clock size={14} className="mr-1.5" /> {incident.timestamp}
      </div>
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <MapPin size={14} className="mr-1.5" /> {incident.location}
      </div>
      <div className="text-xs text-gray-600 mb-3">
        <strong className="text-gray-700">Notes:</strong> {incident.notes}
      </div>
      {isUnresolved && (
        <button
          onClick={() => onMarkAsResolved(incident.id)}
          className="w-full bg-red-600 text-white text-sm py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Mark as Resolved
        </button>
      )}
    </div>
  );
};


interface SensorBoardDisplayProps {
  sensors: SensorState[];
  layout: BoardLayout;
  onSensorClick?: (sensorId: number) => void;
}

const SensorBoardDisplay: React.FC<SensorBoardDisplayProps> = ({ sensors, layout, onSensorClick }) => {
  const getTileClass = (sensor?: SensorState) => {
    if (!sensor) return 'bg-gray-300';
    if (sensor.isActive) return 'bg-red-500 animate-pulse';
    return 'bg-sky-100 border border-sky-300';
  };

  const sensorMap = new Map(sensors.map(s => [s.id, s]));

  return (
    <div className="grid p-2 bg-gray-200 rounded-md" style={{ gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`, gap: '4px' }}>
      {Array.from({ length: layout.rows * layout.cols }).map((_, index) => {
        const sensorId = index;
        const sensor = sensorMap.get(sensorId);
        return (
          <div
            key={sensorId}
            className={`aspect-square rounded-md flex items-center justify-center cursor-pointer ${getTileClass(sensor)}`}
            onClick={() => onSensorClick?.(sensorId)}
            title={`Sensor ${sensorId}`}
          >
            {sensor?.isActive && <AlertTriangle size={Math.min(20, 100/layout.cols)} className="text-white" />}
            {/* <span className="text-xs text-black opacity-50">{sensorId}</span> */}
          </div>
        );
      })}
    </div>
  );
};

const FallDetectionPage: React.FC = () => {
  const [incidents, setIncidents] = useState<FallIncident[]>(initialFallIncidentsData);
  const [patientFilter, setPatientFilter] = useState('All Patients');
  const [currentSensorData, setCurrentSensorData] = useState<SensorState[]>([]);
  const [boardLayout] = useState<BoardLayout>(DEFAULT_BOARD_LAYOUT);

  useEffect(() => {
    const unsubscribe = subscribeToSensorUpdates(setCurrentSensorData);
    return unsubscribe;
  }, []);

  const handleMarkAsResolved = (id: string) => {
    setIncidents(prevIncidents =>
      prevIncidents.map(inc =>
        inc.id === id ? { ...inc, status: 'Resolved' } : inc
      )
    );
    // TODO: Add logic to update fallStatsData or notify backend
  };

  const filteredIncidents = incidents.filter(incident =>
    patientFilter === 'All Patients' || incident.patientName === patientFilter
  );

  const patientNames = ['All Patients', ...new Set(initialFallIncidentsData.map(inc => inc.patientName))];

  const currentLegendItems = [
    { label: 'Inactive Sensor Area', color: 'bg-sky-100' },
    { label: 'Active Sensor / Potential Fall', icon: <AlertTriangle size={16} className="text-white" />, color: 'bg-red-500' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fall Detection & Sensor Monitoring</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {fallStatsData.map(stat => (
          <FallStatCard key={stat.id} {...stat} /> // Correctly passing props using spread
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Sensor Board Activity</h2>
          <div className="mb-4 max-w-md mx-auto">
            {currentSensorData.length > 0 ? (
              <SensorBoardDisplay sensors={currentSensorData} layout={boardLayout} />
            ) : (
              <div className="text-center p-10">Connecting to sensor board...</div>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            {currentLegendItems.map(item => (
              <div key={item.label} className="flex items-center text-xs text-gray-600">
                <div className={`w-4 h-4 rounded-sm mr-1.5 ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <label htmlFor="patient-filter" className="text-sm font-medium text-gray-700 mr-2">Patient (Mock Incidents):</label>
                    <div className="relative">
                        <select
                            id="patient-filter"
                            value={patientFilter}
                            onChange={e => setPatientFilter(e.target.value)}
                            className="appearance-none text-sm bg-white border border-gray-300 rounded-md pl-3 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                           {patientNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
                {/* Removed filter buttons for brevity, can be added back if needed */}
            </div>
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filteredIncidents.length === 0 && patientFilter !== "All Patients" && (
                    <p className="text-sm text-gray-500 text-center py-4">No mock incidents found for {patientFilter}.</p>
                )}
                {filteredIncidents.length > 0 && filteredIncidents.map(incident => (
                    <IncidentCard key={incident.id} incident={incident} onMarkAsResolved={handleMarkAsResolved} />
                ))}
                 {initialFallIncidentsData.length === 0 && ( // Show if no incidents at all
                    <p className="text-sm text-gray-500 text-center py-4">No mock fall incidents logged.</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallDetectionPage;