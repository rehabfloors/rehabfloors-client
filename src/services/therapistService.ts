// src/services/therapistService.ts
import { Patient, Notification as NotificationType } from '../data/mockData';

export interface TherapistStat {
  value: string | number;
  label: string;
  valueColor?: string;
}

export interface RecentSession {
  id: string;
  patientName: string;
  patientImage: string;
  sessionType: string;
  dateTime: string; // Tetap menggunakan dateTime di sini
  fallDetected?: boolean;
}

export interface ScheduledAppointment {
  id: string;
  patientName: string;
  sessionType: string;
  // time: string; // Ganti 'time' dengan 'dateTime'
  dateTime: string; // Properti untuk menyimpan tanggal dan waktu lengkap (misalnya, format ISO "2025-06-10T10:30:00")
  patientImage?: string;
}

// --- Mock Data dengan dateTime yang diperbarui ---
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const formatDateToISO_DateTime = (dateObj: Date, timeStr: string) => {
  // timeStr format "HH:MM AM/PM"
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (hours === 12 && modifier.toUpperCase() === 'AM') {
    hours = 0; // Tengah malam
  } else if (hours < 12 && modifier.toUpperCase() === 'PM') {
    hours += 12;
  }
  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj.toISOString();
};

const mockYourPatientsData: Patient[] = [
  {
    id: 'P001', name: 'Sarah Johnson', age: 65, diagnosis: 'Post-stroke rehabilitation', status: 'Stable',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=60',
    progress: 75, lastSession: 'Jun 10, 2025, 9:30 AM'
  },
  {
    id: 'P002', name: 'Robert Chen', age: 72, diagnosis: 'Hip replacement recovery', status: 'Improving',
    image: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=60',
    progress: 45, lastSession: 'Jun 11, 2025, 2:00 PM'
  },
  {
    id: 'P003', name: 'Maria Garcia', age: 58, diagnosis: "Parkinson's disease management", status: 'Requires Attention',
    image: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=60',
    progress: 30, lastSession: 'Jun 09, 2025, 10:15 AM'
  },
  {
    id: 'P004', name: 'David Miller', age: 45, diagnosis: 'ACL reconstruction recovery', status: 'Improving',
    image: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=60',
    progress: 85, lastSession: 'Jun 11, 2025, 11:45 AM'
  }
];

const mockRecentSessionsData: RecentSession[] = [
  { id: 'rs1', patientName: 'Robert Chen', patientImage: mockYourPatientsData[1].image, sessionType: 'Mobility exercise', dateTime: formatDateToISO_DateTime(new Date(2025, 5, 11), '2:00 PM') }, // Juni adalah bulan ke-5 (0-indexed)
  { id: 'rs2', patientName: 'Sarah Johnson', patientImage: mockYourPatientsData[0].image, sessionType: 'Gait training', dateTime: formatDateToISO_DateTime(new Date(2025, 5, 10), '9:30 AM') },
  { id: 'rs3', patientName: 'Sarah Johnson', patientImage: mockYourPatientsData[0].image, sessionType: 'Balance exercise', dateTime: formatDateToISO_DateTime(new Date(2025, 5, 7), '10:15 AM') },
  { id: 'rs4', patientName: 'Sarah Johnson', patientImage: mockYourPatientsData[0].image, sessionType: 'Strength training', dateTime: formatDateToISO_DateTime(new Date(2025, 5, 3), '2:00 PM'), fallDetected: true },
];

const mockScheduleData: ScheduledAppointment[] = [
  { id: 'sch1', patientName: 'Sarah Johnson', sessionType: 'Gait Training', dateTime: formatDateToISO_DateTime(new Date(today), '10:30 AM'), patientImage: mockYourPatientsData[0].image },
  { id: 'sch2', patientName: 'Robert Chen', sessionType: 'Mobility Exercise', dateTime: formatDateToISO_DateTime(new Date(today), '1:00 PM'), patientImage: mockYourPatientsData[1].image },
  { id: 'sch3', patientName: 'Maria Garcia', sessionType: 'Balance Training', dateTime: formatDateToISO_DateTime(new Date(tomorrow), '3:15 PM'), patientImage: mockYourPatientsData[2].image }, // Jadwal besok
];

const mockUnreadAlertsData: NotificationType[] = [
  {
    id: 'alert1', type: 'Fall', patientId: 'P003', patientName: 'Maria Garcia',
    message: 'Maria Garcia has experienced a fall in Therapy Room 1. Immediate assistance required.',
    timestamp: formatDateToISO_DateTime(new Date(2025, 5, 11), '9:15 AM'), read: false, severity: 'High'
  },
  {
    id: 'alert2', type: 'Therapy', patientId: 'P002', patientName: 'Robert Chen',
    message: "Robert Chen's next therapy session is scheduled for tomorrow at 2:00 PM.",
    timestamp: formatDateToISO_DateTime(new Date(2025, 5, 11), '8:00 AM'), read: false, severity: 'Low'
  }
];


// Fungsi-fungsi untuk mengambil data
export const fetchTherapistStats = async (): Promise<TherapistStat[]> => {
  console.log("Fetching therapist stats (mock)...");
  await new Promise(resolve => setTimeout(resolve, 100));

  const activePatientsCount = mockYourPatientsData.length;
  const needsAttentionCount = mockYourPatientsData.filter(p => p.status === 'Requires Attention').length;
  const fallAlertsCount = mockUnreadAlertsData.filter(a => a.type === 'Fall' && !a.read).length;
  
  const todayString = new Date().toDateString();
  const sessionsTodayCount = mockScheduleData.filter(s => {
    const sessionDate = new Date(s.dateTime); // Sekarang s.dateTime ada dan berisi tanggal & waktu
    return sessionDate.toDateString() === todayString;
  }).length;

  return [
    { value: activePatientsCount, label: 'Active Patients', valueColor: 'text-blue-600' },
    { value: sessionsTodayCount, label: 'Sessions Today', valueColor: 'text-green-600' },
    { value: fallAlertsCount, label: 'Unread Fall Alerts', valueColor: 'text-red-600' },
    { value: needsAttentionCount, label: 'Need Attention', valueColor: 'text-yellow-600' },
  ];
};

export const fetchTherapistPatients = async (): Promise<Patient[]> => {
  console.log("Fetching therapist's patients (mock)...");
  await new Promise(resolve => setTimeout(resolve, 150));
  return JSON.parse(JSON.stringify(mockYourPatientsData));
};

export const fetchRecentSessionsForTherapist = async (limit: number = 4): Promise<RecentSession[]> => {
  console.log("Fetching recent sessions for therapist (mock)...");
  await new Promise(resolve => setTimeout(resolve, 120));
  // Urutkan berdasarkan dateTime terbaru jika perlu, untuk mock kita ambil slice saja
  const sortedSessions = [...mockRecentSessionsData].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  return JSON.parse(JSON.stringify(sortedSessions.slice(0, limit)));
};

export const fetchTodaysScheduleForTherapist = async (): Promise<ScheduledAppointment[]> => {
  console.log("Fetching today's schedule for therapist (mock)...");
  await new Promise(resolve => setTimeout(resolve, 90));
  const todayString = new Date().toDateString();
  const todaysAppointments = mockScheduleData.filter(s => {
    const appointmentDate = new Date(s.dateTime);
    return appointmentDate.toDateString() === todayString;
  });
  return JSON.parse(JSON.stringify(todaysAppointments));
};

export const fetchUnreadAlertsForTherapist = async (limit: number = 2): Promise<NotificationType[]> => {
  console.log("Fetching unread alerts for therapist (mock)...");
  await new Promise(resolve => setTimeout(resolve, 80));
  const sortedAlerts = [...mockUnreadAlertsData]
    .filter(a => !a.read)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return JSON.parse(JSON.stringify(sortedAlerts.slice(0, limit)));
};