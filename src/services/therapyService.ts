// src/services/therapyService.ts
import { Patient } from '../data/mockData'; // Impor tipe Patient

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration?: string;
  reps?: string;
}

export interface TherapyRoutine {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  frequency: string;
  totalDuration: string;
  exerciseCount: number;
  exercises: Exercise[];
  patientId?: string; // Untuk mengaitkan rutin dengan pasien tertentu
}

export interface RecommendedRoutine {
  id: string;
  title: string;
  approval: 'Therapist Approved' | 'AI-Recommended';
  description: string;
}

// Tipe gabungan untuk data pasien beserta rutinnya
export interface PatientWithRoutines extends Patient {
  routines: TherapyRoutine[];
}

// Data mock dipindahkan dari TherapyRoutines.tsx
const mockPatientsWithRoutines: PatientWithRoutines[] = [
  {
    id: 'P001', // Sarah Johnson
    name: 'Sarah Johnson',
    age: 65,
    diagnosis: 'Post-stroke rehabilitation',
    status: 'Stable',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80',
    progress: 75,
    lastSession: 'Jun 10 2025, 9:30 AM',
    // Properti lain dari Patient bisa ditambahkan di sini jika dibutuhkan oleh PatientListItem
    email: 'sarah.j@example.com',
    phoneNumber: '(+62) 812-0001-0001',
    address: 'Jl. Merdeka No. 1, Bandung',
    therapistAssigned: 'Dr. Emily Carter',
    admissionDate: 'April 15 2025',
    medicalHistory: ['Hypertension', 'Previous TIA'],
    routines: [
      {
        id: 'sr1', patientId: 'P001', title: 'Post-Stroke Phase 2', difficulty: 'Medium', description: 'Focused on improving balance and gait symmetry',
        frequency: '3 times/week', totalDuration: '35 mins', exerciseCount: 3,
        exercises: [
          { id: 'sre1', name: 'Weight Shifting', description: 'Shift weight from one foot to another while standing', duration: '10 mins', reps: '15 reps' },
          { id: 'sre2', name: 'Heel-to-Toe Walking', description: 'Walk in a straight line placing heel directly in front of toe', duration: '15 mins', reps: '2 reps' },
          { id: 'sre3', name: 'Sit-to-Stand', description: 'Practice standing up from a seated position without hands', duration: '10 mins', reps: '10 reps' },
        ]
      },
      {
        id: 'sr2', patientId: 'P001', title: 'Post-Stroke Phase 3', difficulty: 'Hard', description: 'Advanced balance and coordination exercises',
        frequency: '3 times/week', totalDuration: '45 mins', exerciseCount: 3,
        exercises: [
          { id: 'sre4', name: 'Single Leg Stance', description: 'Stand on one leg for 30 seconds, repeat for other leg', duration: '15 mins', reps: '3 sets' },
          { id: 'sre5', name: 'Tandem Walking', description: 'Walk heel-to-toe along a marked line for 10 steps', duration: '15 mins', reps: '5 reps' },
          { id: 'sre6', name: 'Dynamic Lunges', description: 'Perform forward lunges with control and stability', duration: '15 mins', reps: '10 reps/leg' },
        ]
      }
    ]
  },
  {
    id: 'P002', // Robert Chen
    name: 'Robert Chen',
    age: 72,
    diagnosis: 'Hip replacement recovery',
    status: 'Improving',
    image: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=80',
    progress: 45,
    lastSession: 'Jun 11 2025, 2:00 PM',
    email: 'robert.c@example.com',
    therapistAssigned: 'Dr. Ben Miller',
    admissionDate: 'May 01 2025',
    medicalHistory: ['Osteoarthritis'],
    routines: [] // Robert Chen belum punya rutin
  },
  {
    id: 'P003', // Maria Garcia (bukan Emily Martinez seperti di mock TherapyRoutines.tsx asli)
    name: 'Maria Garcia',
    age: 58,
    diagnosis: "Parkinson's disease management",
    status: 'Requires Attention',
    image: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=80',
    progress: 30,
    lastSession: 'May 23 2025, 11:00 AM',
    therapistAssigned: 'Dr. Emily Carter',
    admissionDate: 'March 10 2025',
    medicalHistory: ['Type 2 Diabetes'],
    routines: []
  },
   {
    id: 'P004', // David Miller (bukan Robert Chen kedua seperti di mock TherapyRoutines.tsx asli)
    name: 'David Miller',
    age: 45,
    diagnosis: 'ACL reconstruction recovery',
    status: 'Improving',
    image: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=80',
    progress: 85,
    lastSession: 'May 24 2025, 10:00 AM',
    email: 'david.m@example.com',
    therapistAssigned: 'Dr. Ben Miller',
    admissionDate: 'May 05 2025',
    medicalHistory: ['Active sportsman'],
    routines: []
  }
];

const mockRecommendedRoutines: RecommendedRoutine[] = [
  { id: 'rec1', title: 'Balance and Coordination (PD Focus)', approval: 'Therapist Approved', description: "Personalized routine to improve balance and coordination for patients with Parkinson's disease or similar movement disorders." },
  { id: 'rec2', title: 'Advanced Gait Training (Post-Stroke)', approval: 'AI-Recommended', description: "Based on recent progress, this routine is recommended to improve step symmetry and balance for patients recovering from stroke." },
  { id: 'rec3', title: 'Lower Limb Strengthening (Post-Op)', approval: 'Therapist Approved', description: "A set of exercises to rebuild strength and mobility in the lower limbs after surgery like hip or knee replacement." }
];

/**
 * Mengambil daftar pasien (hanya info dasar untuk sidebar) beserta rutin terapi mereka.
 * Untuk MVP, kita ambil semua. Di masa depan, data rutin bisa diambil terpisah (lazy-loaded).
 */
export const fetchPatientsWithRoutinesList = async (): Promise<PatientWithRoutines[]> => {
  console.log("Fetching patients with their routines (mock)...");
  await new Promise(resolve => setTimeout(resolve, 200));
  // Pastikan setiap objek pasien memiliki semua properti dari tipe Patient dan juga routines
  return JSON.parse(JSON.stringify(mockPatientsWithRoutines)); // Mengembalikan salinan mendalam
};

/**
 * Mengambil rutin terapi spesifik untuk pasien tertentu.
 * @param patientId ID Pasien
 */
export const fetchRoutinesForPatient = async (patientId: string): Promise<TherapyRoutine[]> => {
  console.log(`Workspaceing routines for patient ${patientId} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 150));
  const patientData = mockPatientsWithRoutines.find(p => p.id === patientId);
  return patientData ? JSON.parse(JSON.stringify(patientData.routines)) : [];
};

/**
 * Mengambil daftar rutin terapi yang direkomendasikan.
 */
export const fetchRecommendedRoutines = async (): Promise<RecommendedRoutine[]> => {
  console.log("Fetching recommended therapy routines (mock)...");
  await new Promise(resolve => setTimeout(resolve, 100));
  return JSON.parse(JSON.stringify(mockRecommendedRoutines));
};

/**
 * Menambahkan rutin yang dipilih ke daftar rutin pasien.
 * @param patientId ID Pasien
 * @param routineId ID Rutin yang akan ditambahkan (dari recommended atau template)
 * @param routineDetails Detail rutin jika bukan hanya referensi ID (opsional untuk mock)
 */
export const assignRoutineToPatient = async (patientId: string, routineId: string, routineDetails?: TherapyRoutine): Promise<boolean> => {
  console.log(`Assigning routine ${routineId} to patient ${patientId} (mock)...`, routineDetails);
  await new Promise(resolve => setTimeout(resolve, 300));
  const patientIndex = mockPatientsWithRoutines.findIndex(p => p.id === patientId);
  if (patientIndex > -1) {
    // Cari rutin di recommended atau buat berdasarkan routineDetails
    let routineToAdd: TherapyRoutine | undefined = routineDetails;
    if (!routineToAdd) {
        const recommended = mockRecommendedRoutines.find(r => r.id === routineId);
        if (recommended) {
            // Ubah RecommendedRoutine menjadi TherapyRoutine (ini perlu penyesuaian)
            // Untuk mock, kita buat rutin sederhana
            routineToAdd = {
                id: `assigned-${recommended.id}-${Date.now()}`,
                patientId: patientId,
                title: recommended.title,
                description: recommended.description,
                difficulty: 'Medium', // Default
                frequency: 'As per plan', // Default
                totalDuration: '30 mins', // Default
                exerciseCount: 0, // Perlu diisi
                exercises: [] // Perlu diisi
            };
        }
    }

    if (routineToAdd) {
        const existingRoutineIndex = mockPatientsWithRoutines[patientIndex].routines.findIndex(r => r.id === routineToAdd!.id || r.title === routineToAdd!.title);
        if (existingRoutineIndex === -1) { // Hindari duplikasi berdasarkan ID atau judul untuk mock
            mockPatientsWithRoutines[patientIndex].routines.push(routineToAdd);
            return true;
        } else {
            console.warn(`Routine "${routineToAdd.title}" already assigned or ID conflict.`);
            return false;
        }
    }
  }
  return false; // Gagal jika pasien tidak ditemukan atau rutin tidak ditemukan
};

/**
 * Membuat template rutin terapi baru (belum terkait pasien).
 * @param routineData Data untuk rutin baru
 */
export const createNewTherapyRoutine = async (routineData: Omit<TherapyRoutine, 'id' | 'patientId'>): Promise<TherapyRoutine> => {
  console.log("Creating new therapy routine template (mock)...", routineData);
  await new Promise(resolve => setTimeout(resolve, 250));
  const newRoutine: TherapyRoutine = {
    ...routineData,
    id: `routine-template-${Date.now()}`,
    // patientId tidak di-set karena ini template
  };
  // Di aplikasi nyata, ini akan disimpan di backend.
  // Untuk mock, kita bisa menambahkannya ke array template terpisah jika diperlukan,
  // atau hanya mengembalikannya untuk ditampilkan/digunakan segera.
  console.log("Mock routine template created:", newRoutine);
  return JSON.parse(JSON.stringify(newRoutine));
};

// Anda bisa menambahkan fungsi lain seperti updateRoutine, deleteRoutineFromPatient, dll.