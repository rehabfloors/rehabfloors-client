// src/services/dashboardService.ts
import {
  Patient,
  Notification,
  // DailyActivitySummary, // Kita akan menggunakan DashboardStatSummary yang lebih spesifik
  patients as mockPatients,
  notifications as mockNotifications,
  dailySummary as mockDailySummary,
  rehabilitationMetrics as mockRehabProgress // Ini adalah objek { symmetry: 80, balance: 75, ... }
} from '../data/mockData';

// Tipe spesifik untuk data progres rehabilitasi yang akan digunakan oleh RehabilitationProgress.tsx
export interface RehabProgressData {
  symmetry: number;
  balance: number;
  speed: number;
  endurance: number;
  overall: number;
}

// Tipe spesifik untuk statistik yang akan ditampilkan di bagian bawah Dashboard.tsx
export interface DashboardStatSummary {
  steps: number;
  therapyTime: number;
  overallProgress: number; // Sesuai dengan objek dailySummary di mockData.ts
  // Properti di bawah ini bisa ditambahkan jika ingin lebih selaras dengan DailyActivitySummary
  // dan jika StatCard atau logika lain di Dashboard membutuhkannya.
  // Untuk MVP, kita fokus pada apa yang ditampilkan secara eksplisit.
  date?: string;
  activeTime?: number;
  therapyTimePlanned?: number;
  therapyTimeCompleted?: number;
  mood?: 'Excellent' | 'Good' | 'Okay' | 'Poor';
}

export const fetchDashboardPatients = async (limit: number = 2): Promise<Patient[]> => {
  console.log("Fetching dashboard patients (mock)...");
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockPatients.slice(0, limit);
};

export const fetchDashboardNotifications = async (limit: number = 3): Promise<Notification[]> => {
  console.log("Fetching dashboard notifications (mock)...");
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockNotifications.slice(0, limit); // Ambil 3 notifikasi teratas (atau sesuai logika backend nanti)
};

export const fetchDashboardRehabProgress = async (): Promise<RehabProgressData> => {
  console.log("Fetching dashboard rehabilitation progress (mock)...");
  await new Promise(resolve => setTimeout(resolve, 150));
  // Pastikan mockRehabProgress (dari rehabilitationMetrics di mockData) memiliki semua field
  // yang dibutuhkan oleh RehabProgressData.
  const defaultEndurance = 0; // Nilai default jika endurance tidak ada di mockRehabProgress
  return {
    symmetry: mockRehabProgress.symmetry,
    balance: mockRehabProgress.balance,
    speed: mockRehabProgress.speed,
    endurance: typeof mockRehabProgress.endurance !== 'undefined' ? mockRehabProgress.endurance : defaultEndurance,
    overall: mockRehabProgress.overall,
  };
};

export const fetchDashboardStats = async (): Promise<DashboardStatSummary> => {
  console.log("Fetching dashboard bottom stats (mock)...");
  await new Promise(resolve => setTimeout(resolve, 150));

  // mockDailySummary dari mockData.ts adalah: { steps: 6103, therapyTime: 45, overallProgress: 73 }
  // Ini akan dikembalikan, dan Dashboard.tsx akan menggunakan tipe DashboardStatSummary.
  const stats: DashboardStatSummary = {
    steps: mockDailySummary.steps,
    therapyTime: mockDailySummary.therapyTime,
    overallProgress: (mockDailySummary as any).overallProgress, // Cast jika tipe DailyActivitySummary tidak punya ini
                                                                // tapi objeknya punya
    // Tambahkan nilai default jika diperlukan untuk properti opsional lainnya
    date: new Date().toISOString().split('T')[0],
    activeTime: 0,
    therapyTimePlanned: mockDailySummary.therapyTime, // Asumsi
    therapyTimeCompleted: mockDailySummary.therapyTime,
    mood: 'Okay',
  };
  return stats;
};