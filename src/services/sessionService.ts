// src/services/sessionService.ts
import {
  Patient, // Mungkin diperlukan jika sesi terkait dengan pasien tertentu
  patients as mockPatients, // Untuk mengambil data sesi yang mungkin tersemat
  // Definisikan tipe Session jika belum ada atau berbeda dari yang di mockData
  // Berdasarkan SessionHistory.tsx, struktur sesi terlihat seperti ini:
} from '../data/mockData';

// Tipe data untuk satu sesi, berdasarkan SessionHistory.tsx
export interface SessionGaitMetrics {
  symmetry: string;
  speed: string;
  cadence: string;
  balance: string;
}

export interface Session {
  id: number | string; // ID bisa berupa number atau string
  type: string;
  typeColor?: 'blue' | 'sky' | 'red' | string; // Warna badge opsional
  date: string;
  duration: string;
  gaitMetrics: SessionGaitMetrics;
  notes: string;
  patientId?: string; // Opsional, untuk mengaitkan sesi dengan pasien
}

// Data mock untuk sesi (diambil dari `patientsData` lokal di `SessionHistory.tsx`)
// Idealnya, ini akan diambil dari backend.
const mockPatientSessions: { [patientId: string]: Session[] } = {
  'P001': [ // Contoh untuk Sarah Johnson (sesuaikan ID jika berbeda dengan mockPatients)
    {
      id: 1,
      type: 'Gait training',
      typeColor: 'blue',
      date: 'Jun 10, 2025',
      duration: '45 min',
      patientId: 'P001',
      gaitMetrics: { symmetry: '80%', speed: '90%', cadence: '95 steps/min', balance: '75%' },
      notes: 'Patient showed improvement in balance during the session.',
    },
    {
      id: 2,
      type: 'Balance exercise',
      typeColor: 'sky',
      date: 'Jun 07, 2025',
      duration: '30 min',
      patientId: 'P001',
      gaitMetrics: { symmetry: '75%', speed: '85%', cadence: '90 steps/min', balance: '70%' },
      notes: 'Patient reported minor discomfort but completed all exercises.',
    },
  ],
  'P002': [ // Contoh untuk Robert Chen
     {
      id: 3,
      type: 'Mobility exercise',
      typeColor: 'green', // Contoh warna
      date: 'Jun 11, 2025',
      duration: '40 min',
      patientId: 'P002',
      gaitMetrics: { symmetry: '70%', speed: '80%', cadence: '85 steps/min', balance: '65%' },
      notes: 'Focused on hip range of motion.',
    },
  ]
  // Tambahkan data sesi untuk pasien lain jika perlu
};


/**
 * Mengambil riwayat sesi untuk pasien tertentu.
 * @param patientId ID Pasien
 */
export const fetchSessionHistoryForPatient = async (patientId: string): Promise<Session[]> => {
  console.log(`Workspaceing session history for patient ${patientId} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 250));
  return mockPatientSessions[patientId] || [];
};

/**
 * Mengambil detail sesi tertentu.
 * @param sessionId ID Sesi
 */
export const fetchSessionById = async (sessionId: string | number): Promise<Session | undefined> => {
    console.log(`Workspaceing session by ID: ${sessionId} (mock)...`);
    await new Promise(resolve => setTimeout(resolve, 100));
    for (const patientId in mockPatientSessions) {
        const session = mockPatientSessions[patientId].find(s => s.id.toString() === sessionId.toString());
        if (session) {
            return { ...session };
        }
    }
    return undefined;
};

/**
 * Menambahkan sesi baru untuk pasien.
 * @param patientId ID Pasien
 * @param sessionData Data sesi baru (tanpa ID, karena akan dibuat oleh backend)
 */
export const addSessionForPatient = async (patientId: string, sessionData: Omit<Session, 'id' | 'patientId'>): Promise<Session> => {
  console.log(`Adding new session for patient ${patientId} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const newId = `session-${Date.now()}`; // ID unik sementara
  const newSession: Session = {
    ...sessionData,
    id: newId,
    patientId: patientId,
  };
  if (!mockPatientSessions[patientId]) {
    mockPatientSessions[patientId] = [];
  }
  mockPatientSessions[patientId].unshift(newSession); // Tambah di awal
  return { ...newSession };
};

// Anda bisa menambahkan fungsi lain seperti updateSession, deleteSession, dll.