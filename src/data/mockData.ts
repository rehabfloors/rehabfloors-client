// src/data/mockData.ts

export interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  status: 'Stable' | 'Improving' | 'Requires Attention' | 'Discharged';
  image: string;
  progress: number;
  lastSession: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  therapistAssigned?: string;
  admissionDate?: string;
  medicalHistory?: string[];
  gaitMetrics?: {
    speed: number; // m/s
    symmetry: number; // %
    stepLength: number; // cm
    cadence: number; // steps/min
  };
  balanceScore?: number; // Skor keseimbangan dari 0-100
  rangeOfMotion?: {
    joint: string;
    flexion?: number; // derajat - dibuat opsional
    extension?: number; // derajat - dibuat opsional
    abduction?: number; // Properti baru ditambahkan sebagai opsional
    adduction?: number; // Properti baru ditambahkan sebagai opsional
    internalRotation?: number; // Properti baru ditambahkan sebagai opsional
    externalRotation?: number; // Properti baru ditambahkan sebagai opsional
    // Anda bisa menambahkan jenis pengukuran lain di sini jika perlu
  }[];
}

export interface Notification {
  id: string;
  type: 'Fall' | 'Progress' | 'Therapy' | 'System' | 'Medication';
  patientId?: string;
  patientName?: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity?: 'Low' | 'Medium' | 'High';
}

export interface TherapyMetric {
  name: string;
  value: number;
  change: number;
  unit?: string;
  targetValue?: number;
}

export interface RehabilitationMetricSet {
  symmetry: TherapyMetric;
  balance: TherapyMetric;
  speed: TherapyMetric;
  endurance: TherapyMetric;
  overallProgress: TherapyMetric;
}

export interface DailyActivitySummary {
  date: string;
  steps: number;
  activeTime: number; // dalam menit
  therapyTimePlanned: number; // dalam menit
  therapyTimeCompleted: number; // dalam menit
  mood?: 'Excellent' | 'Good' | 'Okay' | 'Poor';
}

// --- Data Pasien ---
export const patients: Patient[] = [
  {
    id: 'P001',
    name: 'Sarah Johnson',
    age: 65,
    diagnosis: 'Post-stroke rehabilitation',
    status: 'Improving',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 75,
    lastSession: 'May 23 2025, 9:30 AM',
    email: 'sarah.j@example.com',
    phoneNumber: '(+62) 812-0001-0001',
    address: 'Jl. Merdeka No. 1, Bandung',
    therapistAssigned: 'Dr. Emily Carter',
    admissionDate: 'April 15 2025',
    medicalHistory: ['Hypertension', 'Previous TIA'],
    gaitMetrics: { speed: 0.8, symmetry: 85, stepLength: 55, cadence: 100 },
    balanceScore: 70,
    rangeOfMotion: [{ joint: 'Knee (Right)', flexion: 110, extension: 5 }],
  },
  {
    id: 'P002',
    name: 'Robert Chen',
    age: 72,
    diagnosis: 'Hip replacement recovery',
    status: 'Stable',
    image: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 60,
    lastSession: 'May 22 2025, 2:00 PM',
    email: 'robert.c@example.com',
    therapistAssigned: 'Dr. Ben Miller',
    admissionDate: 'May 01 2025',
    medicalHistory: ['Osteoarthritis'],
    gaitMetrics: { speed: 0.6, symmetry: 70, stepLength: 45, cadence: 90 },
    balanceScore: 65,
  },
  {
    id: 'P003',
    name: 'Maria Garcia',
    age: 58,
    diagnosis: "Parkinson's disease management",
    status: 'Requires Attention',
    image: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 30,
    lastSession: 'May 23 2025, 11:00 AM',
    therapistAssigned: 'Dr. Emily Carter',
    admissionDate: 'March 10 2025',
    medicalHistory: ['Type 2 Diabetes'],
    gaitMetrics: { speed: 0.4, symmetry: 60, stepLength: 35, cadence: 80 },
    balanceScore: 40,
    rangeOfMotion: [{ joint: 'Shoulder (Left)', flexion: 90, extension: 20 }],
  },
  {
    id: 'P004',
    name: 'David Miller',
    age: 45,
    diagnosis: 'ACL reconstruction recovery',
    status: 'Improving',
    image: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 85,
    lastSession: 'May 24 2025, 10:00 AM',
    email: 'david.m@example.com',
    therapistAssigned: 'Dr. Ben Miller',
    admissionDate: 'May 05 2025',
    medicalHistory: ['Active sportsman'],
    balanceScore: 80,
    rangeOfMotion: [{ joint: 'Knee (Left)', flexion: 130, extension: 0 }],
  },
  {
    id: 'P005',
    name: 'Linda Kim',
    age: 78,
    diagnosis: 'General deconditioning',
    status: 'Stable',
    image: 'https://images.pexels.com/photos/4098150/pexels-photo-4098150.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 50,
    lastSession: 'May 21 2025, 3:30 PM',
    therapistAssigned: 'Dr. Emily Carter',
    admissionDate: 'April 20 2025',
    medicalHistory: ['Mild cognitive impairment'],
    balanceScore: 55,
  },
   {
    id: 'P006',
    name: 'Ahmad Santoso',
    age: 68,
    diagnosis: 'Balance Disorder Post Vestibular Neuritis',
    status: 'Improving',
    image: 'https://images.pexels.com/photos/5453837/pexels-photo-5453837.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 65,
    lastSession: 'May 24 2025, 08:00 AM',
    email: 'ahmad.s@example.com',
    phoneNumber: '(+62) 812-0002-0002',
    address: 'Jl. Asia Afrika No. 101, Bandung',
    therapistAssigned: 'Dr. Ben Miller',
    admissionDate: 'May 02 2025',
    medicalHistory: ['Vertigo history'],
    gaitMetrics: { speed: 0.7, symmetry: 75, stepLength: 50, cadence: 95 },
    balanceScore: 72,
  },
  {
    id: 'P007',
    name: 'Rina Wulandari',
    age: 52,
    diagnosis: 'Frozen Shoulder Recovery',
    status: 'Stable',
    image: 'https://images.pexels.com/photos/5214996/pexels-photo-5214996.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 80,
    lastSession: 'May 23 2025, 01:30 PM',
    therapistAssigned: 'Dr. Emily Carter',
    admissionDate: 'April 28 2025',
    medicalHistory: ['None significant'],
    rangeOfMotion: [ // Data ini sekarang valid karena interface diperbarui
        { joint: 'Shoulder (Right)', flexion: 140, extension: 40 },
        { joint: 'Shoulder (Right)', abduction: 130, internalRotation: 50 }
    ],
  },
  {
    id: 'P008',
    name: 'James Brown',
    age: 80,
    diagnosis: 'Post-Fall Confidence Building',
    status: 'Requires Attention',
    image: 'https://images.pexels.com/photos/5790853/pexels-photo-5790853.jpeg?auto=compress&cs=tinysrgb&w=120',
    progress: 20,
    lastSession: 'May 22 2025, 04:00 PM',
    therapistAssigned: 'Dr. Ben Miller',
    admissionDate: 'May 15 2025',
    medicalHistory: ['Multiple falls in last 6 months', 'Anxiety'],
    balanceScore: 30,
  },
];

// --- Data Notifikasi ---
export const notifications: Notification[] = [
  {
    id: 'N001',
    type: 'Fall',
    patientId: 'P003',
    patientName: 'Maria Garcia',
    message: 'Maria Garcia experienced a fall in Therapy Room 2. Assistance may be required.',
    timestamp: 'May 24 2025, 10:15 AM',
    read: false,
    severity: 'High',
  },
  {
    id: 'N002',
    type: 'Progress',
    patientId: 'P001',
    patientName: 'Sarah Johnson',
    message: 'Sarah Johnson has achieved 75% progress in her rehabilitation program. Consider next phase planning.',
    timestamp: 'May 23 2025, 11:00 AM',
    read: false,
    severity: 'Medium',
  },
  {
    id: 'N003',
    type: 'Therapy',
    patientId: 'P002',
    patientName: 'Robert Chen',
    message: "Robert Chen's next therapy session is scheduled for May 25 2025, at 2:00 PM.",
    timestamp: 'May 23 2025, 9:00 AM',
    read: true,
    severity: 'Low',
  },
  {
    id: 'N004',
    type: 'System',
    message: 'Scheduled system maintenance tonight at 2:00 AM - 3:00 AM. Expect brief downtime.',
    timestamp: 'May 24 2025, 1:00 PM',
    read: false,
    severity: 'Medium',
  },
  {
    id: 'N005',
    type: 'Medication',
    patientId: 'P003',
    patientName: 'Maria Garcia',
    message: 'Reminder: Medication review for Maria Garcia is due next week.',
    timestamp: 'May 22 2025, 4:30 PM',
    read: true,
    severity: 'Medium',
  },
  {
    id: 'N006',
    type: 'Progress',
    patientId: 'P004',
    patientName: 'David Miller',
    message: 'David Miller has shown significant improvement in knee flexion this week.',
    timestamp: 'May 24 2025, 11:30 AM',
    read: false,
    severity: 'Low',
  },
];

// --- Data Metrik Rehabilitasi Global (Contoh, bisa juga per pasien) ---
export const globalRehabilitationMetrics: RehabilitationMetricSet = {
  symmetry: { name: 'Avg. Gait Symmetry', value: 78, change: 2, unit: '%', targetValue: 85 },
  balance: { name: 'Avg. Balance Score', value: 72, change: -1, unit: 'pts', targetValue: 80 },
  speed: { name: 'Avg. Walking Speed', value: 0.9, change: 0.05, unit: 'm/s', targetValue: 1.2 },
  endurance: { name: 'Avg. 6-Min Walk Test', value: 350, change: 15, unit: 'm', targetValue: 400 },
  overallProgress: { name: 'Avg. Patient Progress', value: 68, change: 3, unit: '%', targetValue: 80 },
};

// --- Data Metrik Pasien Spesifik (Contoh untuk satu pasien) ---
export const specificPatientMetrics: { [patientId: string]: TherapyMetric[] } = {
  'P001': [ // Sarah Johnson
    { name: 'Mobility Score', value: 75, change: 5, targetValue: 80 },
    { name: 'Balance (Berg)', value: 48, change: 3, unit: 'pts', targetValue: 52 },
    { name: 'Gait Symmetry', value: 85, change: 2, unit: '%', targetValue: 90 },
    { name: 'Step Cadence', value: 100, change: 5, unit: 'steps/min', targetValue: 110 },
  ],
  'P002': [ // Robert Chen
    { name: 'Hip ROM Flexion', value: 95, change: 5, unit: 'deg', targetValue: 110 },
    { name: 'Timed Up & Go', value: 15, change: -1, unit: 's', targetValue: 12 },
    { name: 'Pain Level (VAS)', value: 3, change: -1, unit: '/10', targetValue: 1 },
  ]
};

// --- Data Ringkasan Harian (Contoh, biasanya lebih banyak dan per pasien) ---
export const dailySummaries: DailyActivitySummary[] = [
  { date: '2025-05-23', steps: 5230, activeTime: 65, therapyTimePlanned: 45, therapyTimeCompleted: 45, mood: 'Good' },
  { date: '2025-05-22', steps: 4890, activeTime: 50, therapyTimePlanned: 60, therapyTimeCompleted: 45, mood: 'Okay' },
  { date: '2025-05-21', steps: 6103, activeTime: 75, therapyTimePlanned: 45, therapyTimeCompleted: 45, mood: 'Excellent' },
];

export const rehabilitationMetrics = {
  symmetry: 80,
  balance: 75,
  speed: 65,
  endurance: 70,
  overall: 73,
};

export const patientMetrics = {
  mobility: { value: 75, change: 5 },
  balance: { value: 68, change: 3 },
  gaitSymmetry: { value: 80, change: 7 },
  stepCadence: { value: 95, change: 5, unit: 'steps/min' }
};

export const dailySummary = {
  steps: 6103,
  therapyTime: 45,
  overallProgress: 73,
};

