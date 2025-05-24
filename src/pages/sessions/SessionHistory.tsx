// src/pages/sessions/SessionHistory.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, CalendarRange, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom'; // Untuk mengambil query param

// Impor service dan tipe
import { fetchPatients, fetchPatientSessionSummary, PatientSessionSummaryData } from '../../services/patientService';
import { fetchSessionHistoryForPatient, Session } from '../../services/sessionService';
import { Patient } from '../../data/mockData';

// Komponen UI Lokal (MetricCard, SessionDetailCard, StatDisplayCard)
// Sebaiknya komponen ini dipindahkan ke direktori common atau components/sessions jika digunakan di tempat lain.
// Untuk sekarang, kita biarkan di sini untuk menjaga fokus.

interface MetricCardProps {
  title: string;
  value: number;
  change?: number; // Perubahan sekarang opsional
  color: string;
  unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, color, unit = "%" }) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-700 font-medium text-sm">{title}</span>
        {typeof change === 'number' && (
          <span className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1.5">
        {value}{unit}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${color}`} // Contoh: 'bg-blue-500'
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

interface SessionDetailCardProps {
  session: Session;
}
const SessionDetailCard: React.FC<SessionDetailCardProps> = ({ session }) => {
  const badgeColorClass = () => {
    switch (session.typeColor) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'sky': return 'bg-sky-100 text-sky-700';
      case 'red': return 'bg-red-100 text-red-700';
      case 'green': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow border border-gray-100 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${badgeColorClass()}`}>
          {session.type}
        </span>
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {session.date} - {session.duration}
      </div>
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Gait Metrics:</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div><span className="text-gray-600">Symmetry:</span> <span className="font-semibold text-gray-800">{session.gaitMetrics.symmetry}</span></div>
          <div><span className="text-gray-600">Cadence:</span> <span className="font-semibold text-gray-800">{session.gaitMetrics.cadence}</span></div>
          <div><span className="text-gray-600">Speed:</span> <span className="font-semibold text-gray-800">{session.gaitMetrics.speed}</span></div>
          <div><span className="text-gray-600">Balance:</span> <span className="font-semibold text-gray-800">{session.gaitMetrics.balance}</span></div>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
        <p className="text-xs text-gray-600 leading-relaxed break-words">{session.notes}</p>
      </div>
    </div>
  );
};

interface StatDisplayCardProps {
  label: string;
  value: string | number;
}
const StatDisplayCard: React.FC<StatDisplayCardProps> = ({ label, value }) => (
  <div className="bg-white rounded-lg p-4 shadow text-center border border-gray-100">
    <div className="text-gray-600 text-sm">{label}</div>
    <div className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">{value}</div>
  </div>
);

// Fungsi untuk Radar Chart (diambil dari versi asli Anda, perlu disesuaikan)
const getRadarPolygonPoints = (data: { overall: number, symmetry: number, balance: number, speed: number }, centerX: number, centerY: number, maxRadius: number) => {
    const pointsData = [data.overall, data.symmetry, data.balance, data.speed]; // Sesuaikan urutan dengan label
    const numAxes = pointsData.length;
    const angleSlice = 360 / numAxes;

    return pointsData.map((value, i) => {
        const angleRadians = ( (angleSlice * i) - 90) * (Math.PI / 180); // -90 agar Overall di atas
        const radius = (value / 100) * maxRadius;
        const x = centerX + radius * Math.cos(angleRadians);
        const y = centerY + radius * Math.sin(angleRadians);
        return `${x},${y}`;
    }).join(' ');
};

const radarAxisLabels = [
    { label: 'Overall', angle: 0 }, // Sudut 0 derajat (atas)
    { label: 'Symmetry', angle: 90 }, // Sudut 90 derajat (kanan)
    { label: 'Balance', angle: 180 }, // Sudut 180 derajat (bawah)
    { label: 'Speed', angle: 270 },   // Sudut 270 derajat (kiri)
];


const SessionHistory: React.FC = () => {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [patientSummary, setPatientSummary] = useState<PatientSessionSummaryData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Ambil daftar pasien saat komponen dimuat
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const patientsData = await fetchPatients();
        setAllPatients(patientsData);
        if (patientsData.length > 0) {
          // Cek apakah ada patientId dari query params (misalnya dari PatientDetails)
          const queryParams = new URLSearchParams(location.search);
          const patientIdFromQuery = queryParams.get('patientId');
          if (patientIdFromQuery && patientsData.find(p => p.id === patientIdFromQuery)) {
            setSelectedPatientId(patientIdFromQuery);
          } else {
            setSelectedPatientId(patientsData[0].id); // Default ke pasien pertama jika tidak ada query
          }
        }
      } catch (error) {
        console.error("Gagal mengambil daftar pasien:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [location.search]);

  // Ambil detail pasien dan sesi ketika selectedPatientId berubah
  useEffect(() => {
    if (!selectedPatientId) {
      setPatientSummary(null);
      setSessions([]);
      return;
    }

    const loadPatientDetailsAndSessions = async () => {
      setIsLoadingDetails(true);
      try {
        const summaryData = await fetchPatientSessionSummary(selectedPatientId);
        setPatientSummary(summaryData || null);

        const sessionsData = await fetchSessionHistoryForPatient(selectedPatientId);
        setSessions(sessionsData);
      } catch (error) {
        console.error(`Gagal mengambil detail untuk pasien ${selectedPatientId}:`, error);
        setPatientSummary(null);
        setSessions([]);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    loadPatientDetailsAndSessions();
  }, [selectedPatientId]);


  if (isLoading) {
    return <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center"><p className="text-lg">Loading patient data...</p></div>;
  }

  if (allPatients.length === 0) {
    return <div className="p-6 bg-gray-50 min-h-screen text-center"><p>No patients available.</p></div>;
  }

  const currentPatientForDisplay = patientSummary || allPatients.find(p => p.id === selectedPatientId);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
       <div className="mb-6 flex items-center justify-between">
        <button
            onClick={() => navigate(-1)} // Tombol kembali
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mr-4"
        >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Session History</h1>
      </div>


      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="flex items-center">
          <label htmlFor="patient-select" className="text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">
            Select Patient:
          </label>
          <div className="relative min-w-[200px]">
            <select
              id="patient-select"
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="appearance-none block w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {allPatients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-500" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
            <Filter size={14} className="mr-1.5" />
            Filter
          </button>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
            <CalendarRange size={14} className="mr-1.5" />
            Date Range
          </button>
        </div>
      </div>

      {isLoadingDetails && (
        <div className="text-center p-10"><p>Loading patient details and sessions...</p></div>
      )}

      {!isLoadingDetails && currentPatientForDisplay && patientSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Progres dan Detail Sesi */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-4 md:p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Rehabilitation Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2 flex justify-center items-center h-full max-w-[200px] md:max-w-xs mx-auto">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {[0.25, 0.5, 0.75, 1].reverse().map((scale, i) => (
                      <polygon
                        key={i}
                        points={getRadarPolygonPoints({ overall: 100 * scale, symmetry: 100 * scale, balance: 100 * scale, speed: 100 * scale }, 100, 100, 80)}
                        fill="none" stroke={i === 3 ? "#d1d5db" : "#e5e7eb"} strokeWidth="1"
                      />
                    ))}
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                    <polygon
                      points={getRadarPolygonPoints(patientSummary.rehabilitationMetrics, 100, 100, 80)}
                      fill="rgba(59, 130, 246, 0.2)" stroke="#3B82F6" strokeWidth="2"
                    />
                    {getRadarPolygonPoints(patientSummary.rehabilitationMetrics, 100, 100, 80).split(' ').map((point, index) => (
                       <circle key={index} cx={parseFloat(point.split(',')[0])} cy={parseFloat(point.split(',')[1])} r="3.5" fill="#3B82F6" />
                    ))}
                    {radarAxisLabels.map(axis => {
                        const [x,y] = getRadarPolygonPoints({overall:110, symmetry:110, balance:110, speed:110}, 100,100,80).split(' ')[radarAxisLabels.indexOf(axis)];
                        let textAnchor = "middle";
                        if (axis.angle === 90) textAnchor = "start"; else if (axis.angle === 270) textAnchor = "end";
                        let dy = "0.35em";
                        if (axis.angle === 0) dy = "0"; else if (axis.angle === 180) dy = "0.71em";
                        return <text key={axis.label} x={parseFloat(x)} y={parseFloat(y)} dy={dy} textAnchor={textAnchor as any} fontSize="10" fill="#6b7280">{axis.label}</text>
                    })}
                  </svg>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MetricCard title="Symmetry" value={patientSummary.rehabilitationMetrics.symmetry} change={patientSummary.rehabilitationMetrics.change} color="bg-blue-500" />
                  <MetricCard title="Balance" value={patientSummary.rehabilitationMetrics.balance} change={patientSummary.rehabilitationMetrics.change} color="bg-green-500" />
                  <MetricCard title="Speed" value={patientSummary.rehabilitationMetrics.speed} change={patientSummary.rehabilitationMetrics.change} color="bg-yellow-500" />
                  <MetricCard title="Overall Progress" value={patientSummary.rehabilitationMetrics.overall} change={patientSummary.rehabilitationMetrics.change} color="bg-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Session Details</h2>
              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sessions.slice(0, 3).map(session => (
                    <SessionDetailCard key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No session details available for this patient.</p>
              )}
            </div>
          </div>

          {/* Kolom Kanan - Info Pasien dan Statistik Ringkas */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
              <div className="flex items-center mb-4">
                <img src={currentPatientForDisplay.image || 'https://via.placeholder.com/100'} alt={currentPatientForDisplay.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-3 md:mr-4 shadow-sm"/>
                <div>
                  <h3 className="text-md md:text-lg font-semibold text-gray-800">{currentPatientForDisplay.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{currentPatientForDisplay.diagnosis}</p>
                  <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${ currentPatientForDisplay.status === 'Stable' ? 'bg-green-100 text-green-700' : currentPatientForDisplay.status === 'Improving' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700' }`}>
                    {currentPatientForDisplay.status}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs md:text-sm mb-3">
                <div className="flex justify-between"><span className="text-gray-500">Age:</span> <span className="font-medium text-gray-700">{currentPatientForDisplay.age}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Last Session:</span> <span className="font-medium text-gray-700">{currentPatientForDisplay.lastSession}</span></div>
              </div>
              <div>
                <div className="flex justify-between text-xs md:text-sm font-medium text-gray-700 mb-1">
                    <span>Therapy Progress</span>
                    <span>{currentPatientForDisplay.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${currentPatientForDisplay.progress}%` }} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <StatDisplayCard label="Total Sessions" value={patientSummary.summaryStats.totalSessions} />
              <StatDisplayCard label="Fall Incidents" value={patientSummary.summaryStats.fallIncidents} />
              <StatDisplayCard label="Latest Balance" value={patientSummary.summaryStats.latestBalance.toFixed(2)} />
              <StatDisplayCard label="Latest Symmetry" value={patientSummary.summaryStats.latestSymmetry.toFixed(2)} />
            </div>
          </div>
        </div>
      )}
      {!isLoadingDetails && !patientSummary && selectedPatientId && (
          <div className="text-center p-10"><p>Could not load details for patient {selectedPatientId}.</p></div>
      )}
    </div>
  );
};

export default SessionHistory;