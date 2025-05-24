// src/pages/therapist/TherapistDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  ChevronDown,
  UserPlus,
  CalendarPlus,
  FilePlus2,
  AlertTriangle,
  Users,
  CalendarDays,
  Activity,
  Bell,
  ClipboardList, // <-- GANTI BriefcaseMedical dengan ClipboardList (atau ikon lain yang ada)
  TrendingUp,
  History,
} from 'lucide-react';
import {
  fetchTherapistStats,
  fetchTherapistPatients,
  fetchRecentSessionsForTherapist,
  fetchTodaysScheduleForTherapist,
  fetchUnreadAlertsForTherapist,
  TherapistStat,
  RecentSession,
  ScheduledAppointment,
} from '../../services/therapistService';
import { Patient, Notification as NotificationType } from '../../data/mockData';

// --- Komponen Lokal (UI Presentasional) ---

const TherapistStatCard: React.FC<TherapistStat> = ({ value, label, valueColor = 'text-gray-800' }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm text-center hover:shadow-md transition-shadow flex flex-col justify-between min-h-[100px]">
      <div className={`text-3xl md:text-4xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-gray-600 mt-1 text-sm">{label}</div>
    </div>
  );
};

const getStatusClass = (status: Patient['status']): string => {
  switch (status) {
    case 'Stable': return 'bg-green-100 text-green-700 border-green-200';
    case 'Improving': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Requires Attention': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Discharged': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getProgressColor = (status: Patient['status']): string => {
    switch (status) {
      case 'Stable': return 'bg-green-500';
      case 'Improving': return 'bg-blue-500';
      case 'Requires Attention': return 'bg-yellow-500';
      case 'Discharged': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
};

const TherapistDashboard: React.FC = () => {
  const [stats, setStats] = useState<TherapistStat[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [schedule, setSchedule] = useState<ScheduledAppointment[]>([]);
  const [alerts, setAlerts] = useState<NotificationType[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Patient['status'] | 'All Status'>('All Status');

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [
          fetchedStats,
          fetchedPatients,
          fetchedSessions,
          fetchedSchedule,
          fetchedAlerts,
        ] = await Promise.all([
          fetchTherapistStats(),
          fetchTherapistPatients(),
          fetchRecentSessionsForTherapist(),
          fetchTodaysScheduleForTherapist(),
          fetchUnreadAlertsForTherapist(),
        ]);
        setStats(fetchedStats);
        setPatients(fetchedPatients);
        setRecentSessions(fetchedSessions);
        setSchedule(fetchedSchedule);
        setAlerts(fetchedAlerts);
      } catch (error) {
        console.error("Gagal memuat data therapist dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) &&
      (statusFilter === 'All Status' || patient.status === statusFilter)
    );
  }, [patients, searchTerm, statusFilter]);

  const handleAddPatient = () => alert("Fitur 'Add New Patient' belum diimplementasikan.");
  const handleScheduleSession = () => alert("Fitur 'Schedule Session' belum diimplementasikan.");
  const handleCreateTherapyPlan = () => alert("Fitur 'Create Therapy Plan' belum diimplementasikan.");
  const handleViewFullSchedule = () => alert("Fitur 'View Full Schedule' belum diimplementasikan.");
  const handleViewAllAlerts = () => alert("Fitur 'View All Alerts' belum diimplementasikan.");

  const formatDisplayDateTime = (isoDateTime: string) => {
    if (!isoDateTime) return 'N/A';
    try {
        return new Date(isoDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return 'Invalid Date';
    }
  };
  const formatDisplayDate = (isoDateTime: string) => {
    if (!isoDateTime) return 'N/A';
     try {
        return new Date(isoDateTime).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
  }

  if (isLoading) {
      return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex justify-center items-center">
            <div className="text-center">
                <p className="text-lg text-gray-600">Loading Therapist Dashboard...</p>
            </div>
        </div>
      );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Therapist Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        {stats.length > 0 ? stats.map(stat => (
          <TherapistStatCard key={stat.label} {...stat} />
        )) : Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg h-24 p-4 shadow-sm flex items-center justify-center text-gray-400 text-sm animate-pulse">Loading Stat...</div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-0 flex items-center">
                <Users size={22} className="mr-2.5 text-blue-600"/>Your Patients
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as Patient['status'] | 'All Status')}
                    className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white w-full sm:w-auto shadow-sm"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Stable">Stable</option>
                    <option value="Improving">Improving</option>
                    <option value="Requires Attention">Requires Attention</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {filteredPatients.length === 0 ? (
                <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">No patients match your criteria.</p>
              ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Diagnosis</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Session</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-9 w-9 rounded-full object-cover shadow-sm group-hover:ring-2 group-hover:ring-blue-300 transition-all" src={patient.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} alt={patient.name} />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{patient.name}</div>
                            <div className="text-xs text-gray-500">{patient.age} years</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                        <div className="flex items-center">
                           <ClipboardList size={14} className="mr-1.5 text-gray-400 flex-shrink-0" /> {/* Ikon untuk diagnosis */}
                           {patient.diagnosis}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClass(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center">
                          <TrendingUp size={14} className="mr-1.5 text-gray-400 flex-shrink-0" /> {/* Ikon untuk progress */}
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className={`h-2 rounded-full ${getProgressColor(patient.status)}`} style={{ width: `${patient.progress}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{patient.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                        <div className="flex items-center">
                            <History size={14} className="mr-1.5 text-gray-400 flex-shrink-0" /> {/* Ikon untuk last session */}
                            {patient.lastSession}
                        </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center"><Activity size={22} className="mr-2.5 text-green-600"/>Recent Sessions</h2>
            {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover shadow-sm" src={session.patientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.patientName)}&background=random`} alt={session.patientName} />
                    <div className="ml-3.5">
                      <div className="text-sm font-medium text-gray-800">{session.patientName}</div>
                      <div className="text-xs text-gray-500">{session.sessionType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">{formatDisplayDate(session.dateTime)} at {formatDisplayDateTime(session.dateTime)}</div>
                    {session.fallDetected && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                        <AlertTriangle size={12} className="mr-1" /> Fall Detected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            ) : <p className="text-sm text-gray-500 py-4 text-center">No recent sessions.</p>}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><CalendarDays size={20} className="mr-2.5 text-indigo-600"/>Today's Schedule</h3>
            {schedule.length > 0 ? (
            <div className="space-y-3.5">
              {schedule.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <img className="h-9 w-9 rounded-full object-cover mr-3 shadow-sm" src={item.patientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.patientName)}&background=random`} alt={item.patientName} />
                    <div>
                        <div className="text-sm font-medium text-blue-700">{item.patientName}</div>
                        <div className="text-xs text-blue-600">{item.sessionType}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-blue-700">{formatDisplayDateTime(item.dateTime)}</div>
                </div>
              ))}
            </div>
            ) : <p className="text-sm text-gray-500 py-2 text-center">No sessions scheduled for today.</p>}
            <button onClick={handleViewFullSchedule} className="mt-5 w-full text-sm text-blue-600 hover:text-blue-700 py-2.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors font-medium">
              View Full Schedule
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Bell size={20} className="mr-2.5 text-red-600"/>Unread Alerts</h3>
            {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-3.5 rounded-lg border ${alert.type === 'Fall' ? 'bg-red-50 border-red-200 hover:shadow-md' : 'bg-sky-50 border-sky-200 hover:shadow-md'} transition-shadow`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold ${alert.type === 'Fall' ? 'text-red-700' : 'text-sky-700'}`}>{alert.patientName} - {alert.type}</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
            ) : <p className="text-sm text-gray-500 py-2 text-center">No unread alerts.</p>}
             <button onClick={handleViewAllAlerts} className="mt-5 w-full text-sm text-blue-600 hover:text-blue-700 py-2.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors font-medium">
              View All Alerts
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={handleAddPatient} className="w-full flex items-center justify-center text-sm bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                <UserPlus size={16} className="mr-2" /> Add New Patient
              </button>
              <button onClick={handleScheduleSession} className="w-full flex items-center justify-center text-sm bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors shadow-sm font-medium">
                <CalendarPlus size={16} className="mr-2" /> Schedule Session
              </button>
              <button onClick={handleCreateTherapyPlan} className="w-full flex items-center justify-center text-sm bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors shadow-sm font-medium">
                <FilePlus2 size={16} className="mr-2" /> Create Therapy Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;