// src/services/patientService.ts
import {
  Patient,
  patients as mockPatients,
  specificPatientMetrics as mockSpecificPatientMetrics, // Digunakan untuk contoh fetchPatientMetrics
  TherapyMetric, // Impor tipe ini jika belum ada di mockData atau definisikan di sini
  patientMetrics as mockGlobalPatientMetrics // Ini adalah patientMetrics global dari mockData
} from '../data/mockData';

import { Session } from './sessionService';

// Definisikan tipe untuk metrik pasien jika belum ada atau berbeda
// TherapyMetric sudah ada di mockData.ts, jadi kita bisa gunakan itu
// Jika struktur patientMetrics di PatientDetails berbeda, kita buat tipe baru
export interface PatientPageMetrics {
  mobility: { value: number; change: number };
  balance: { value: number; change: number };
  gaitSymmetry: { value: number; change: number };
  stepCadence: { value: number; change: number; unit?: string };
  // Tambahkan metrik lain jika ada
}

/**
 * Mengambil semua data pasien.
 * Di masa depan, ini akan memanggil API backend.
 */
export const fetchPatients = async (): Promise<Patient[]> => {
  console.log("Fetching all patients (mock)...");
  // Simulasi penundaan API
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockPatients]; // Mengembalikan salinan array mock
};

/**
 * Mengambil data pasien berdasarkan ID.
 * Di masa depan, ini akan memanggil API backend.
 * @param id ID Pasien
 */
export const fetchPatientById = async (id: string): Promise<Patient | undefined> => {
  console.log(`Workspaceing patient by ID: ${id} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 150));
  const patient = mockPatients.find(p => p.id === id);
  return patient ? { ...patient } : undefined; // Mengembalikan salinan objek pasien
};

/**
 * Mengambil data metrik untuk halaman detail pasien.
 * Ini mungkin akan menjadi bagian dari fetchPatientById atau endpoint terpisah.
 * Untuk MVP, kita bisa menggunakan mockGlobalPatientMetrics atau mockSpecificPatientMetrics.
 * @param patientId ID Pasien
 */
export const fetchPatientMetricsForDetailPage = async (patientId: string): Promise<PatientPageMetrics | null> => {
  console.log(`Workspaceing metrics for patient detail page: ${patientId} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 100));

  // Di mockData.ts, `patientMetrics` adalah objek global:
  // export const patientMetrics = {
  //   mobility: { value: 75, change: 5 },
  //   balance: { value: 68, change: 3 },
  //   gaitSymmetry: { value: 80, change: 7 },
  //   stepCadence: { value: 95, change: 5, unit: 'steps/min' }
  // };
  // Ini digunakan di PatientDetails.tsx.
  // Kita akan mengembalikan ini untuk semua patientId untuk sementara.
  // Jika Anda memiliki data metrik spesifik per pasien, Anda bisa menggunakan mockSpecificPatientMetrics.

  // Pastikan tipe PatientPageMetrics cocok dengan struktur mockGlobalPatientMetrics
  if (mockGlobalPatientMetrics) {
    return { ...mockGlobalPatientMetrics } as PatientPageMetrics;
  }
  return null;
};

/**
 * Contoh fungsi untuk mengambil TherapyMetric[] spesifik pasien jika diperlukan
 * (seperti yang didefinisikan dalam specificPatientMetrics di mockData.ts).
 * Ini mungkin tidak langsung digunakan oleh PatientDetails.tsx yang menggunakan struktur PatientPageMetrics.
 * @param patientId ID Pasien
 */
export const fetchSpecificTherapyMetricsForPatient = async (patientId: string): Promise<TherapyMetric[]> => {
  console.log(`Workspaceing specific therapy metrics for patient: ${patientId} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSpecificPatientMetrics[patientId] || [];
};

// Anda bisa menambahkan fungsi lain di sini sesuai kebutuhan, misalnya:
// export const addPatient = async (newPatientData: Omit<Patient, 'id'>): Promise<Patient> => { ... }
// export const updatePatient = async (patientId: string, updates: Partial<Patient>): Promise<Patient> => { ... }

// Tipe untuk data yang dibutuhkan oleh SessionHistoryPage untuk satu pasien
export interface PatientSessionSummaryData extends Patient {
  rehabilitationMetrics: { // Untuk Radar Chart dan Metric Cards
    symmetry: number;
    balance: number;
    speed: number;
    overall: number;
    change?: number; // Opsional, jika ada data perubahan
    // Tambahkan metrik lain jika ada untuk radar chart
  };
  summaryStats: { // Untuk Statistik Ringkas
    totalSessions: number;
    fallIncidents: number;
    latestBalance: number;
    latestSymmetry: number;
  };
  sessions?: Session[]; // Sesi bisa diambil terpisah atau bersamaan
}

// Mock data ini perlu disesuaikan agar sesuai dengan struktur PatientSessionSummaryData
// Ambil dari `patientsData` lokal di SessionHistory.tsx dan sesuaikan
const mockDetailedPatientDataForSessionPage: PatientSessionSummaryData[] = [
  {
    id: 'P001', // Sarah Johnson
    name: 'Sarah Johnson',
    age: 65,
    diagnosis: 'Post-stroke rehabilitation',
    status: 'Stable',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    progress: 75,
    lastSession: 'Jun 10, 2025',
    rehabilitationMetrics: {
      symmetry: 80,
      balance: 75,
      speed: 65,
      overall: 73,
      change: 10.0, // Contoh
    },
    summaryStats: {
      totalSessions: 3,
      fallIncidents: 1,
      latestBalance: 0.75,
      latestSymmetry: 0.80,
    },
    // sessions akan diambil oleh fetchSessionHistoryForPatient dari sessionService
  },
  // Tambahkan pasien lain jika perlu
];

/**
 * Mengambil data ringkasan lengkap pasien untuk halaman Riwayat Sesi.
 * Ini termasuk info pasien, metrik rehabilitasi untuk radar, dan statistik ringkas.
 * Riwayat sesi aktual akan diambil secara terpisah oleh fetchSessionHistoryForPatient.
 * @param patientId ID Pasien
 */
export const fetchPatientSessionSummary = async (patientId: string): Promise<PatientSessionSummaryData | undefined> => {
  console.log(`Workspaceing patient session summary for ${patientId} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 200));
  const patientData = mockDetailedPatientDataForSessionPage.find(p => p.id === patientId);
  // Untuk mock, kita gabungkan dengan data pasien dari mockPatients jika ada info tambahan
  const basePatientInfo = mockPatients.find(p => p.id === patientId);
  if (patientData && basePatientInfo) {
    return { ...basePatientInfo, ...patientData }; // Gabungkan info dasar dengan info sesi summary
  }
  return patientData; // Atau hanya patientData jika sudah lengkap
};