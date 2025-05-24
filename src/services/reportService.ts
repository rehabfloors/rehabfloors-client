// src/services/reportService.ts
import { Patient } from '../data/mockData';

export interface ReportItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  highlightedKeyword?: string;
  description: string;
  lastUpdated: string;
  category: 'Summary' | 'Analysis' | 'Incidents' | string;
  downloadUrl?: string;
  viewUrl?: string;
}

// MODIFIKASI di sini: tambahkan nama metrik
export interface MonthlyMetricPoint {
  month: string;
  avgBalanceScore: number; // Sebelumnya value1
  avgSymmetryScore: number; // Sebelumnya value2
}

export interface PatientProgressOverview {
  chartData: MonthlyMetricPoint[]; // Menggunakan tipe baru
  // Nama metrik untuk legenda
  metric1Name?: string; // Contoh: "Avg. Balance Score"
  metric2Name?: string; // Contoh: "Avg. Symmetry Score"
  totalSessions: number;
  fallIncidents: number;
  fallIncidentsChange?: number;
  avgBalanceScore: number; // Ini adalah skor rata-rata keseluruhan, bukan per bulan untuk chart
  avgBalanceScoreChange?: number;
  avgSymmetry: number; // Ini adalah skor simetri keseluruhan
  avgSymmetryChange?: number;
}

export interface KeyInsight {
    id: string;
    title: string;
    description: string;
}

export interface PatientReportData extends Patient {
  keyInsights?: KeyInsight[];
  progressOverview?: PatientProgressOverview;
  availableReports?: ReportItem[];
}

const mockReportDataForPatients: PatientReportData[] = [
  {
    id: 'P002',
    name: 'Robert Chen',
    age: 72,
    diagnosis: 'Hip replacement recovery',
    status: 'Improving',
    image: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=80',
    progress: 45,
    lastSession: '11 June 2025',
    keyInsights: [ /* ... */ ],
    progressOverview: {
      metric1Name: "Avg. Balance Score", // Keterangan untuk legenda
      metric2Name: "Avg. Symmetry Score", // Keterangan untuk legenda
      chartData: [ // Menggunakan nama field baru
        { month: 'Jan', avgBalanceScore: 30, avgSymmetryScore: 20 },
        { month: 'Feb', avgBalanceScore: 35, avgSymmetryScore: 25 },
        { month: 'Mar', avgBalanceScore: 40, avgSymmetryScore: 30 },
        { month: 'Apr', avgBalanceScore: 45, avgSymmetryScore: 35 },
        { month: 'May', avgBalanceScore: 50, avgSymmetryScore: 40 },
        { month: 'Jun', avgBalanceScore: 55, avgSymmetryScore: 45 },
        // ... data lainnya ...
      ],
      totalSessions: 24,
      fallIncidents: 3,
      fallIncidentsChange: -1,
      avgBalanceScore: 78, // Ini adalah skor rata-rata keseluruhan
      avgBalanceScoreChange: 12,
      avgSymmetry: 72, // Ini adalah skor simetri keseluruhan
      avgSymmetryChange: 8,
    },
    availableReports: [ /* ... */ ]
  },
  {
    id: 'P001',
    name: 'Sarah Johnson',
    age: 65,
    diagnosis: 'Post-stroke rehabilitation',
    status: 'Stable',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80',
    progress: 75,
    lastSession: '12 June 2025',
    keyInsights: [ /* ... */ ],
    progressOverview: {
      metric1Name: "Avg. Mobility Score",
      metric2Name: "Avg. Step Length (cm)",
      chartData: [
        { month: 'Jan', avgBalanceScore: 50, avgSymmetryScore: 40 }, // Tetap gunakan avgBalanceScore & avgSymmetryScore untuk struktur data
        { month: 'Feb', avgBalanceScore: 55, avgSymmetryScore: 45 }, // atau ubah nama field di MonthlyMetricPoint
        { month: 'Mar', avgBalanceScore: 60, avgSymmetryScore: 55 },
        // Untuk Sarah Johnson, metriknya bisa jadi berbeda, jadi nama di metric1Name/metric2Name
        // akan memberitahu pengguna apa yang direpresentasikan oleh value1 (avgBalanceScore) dan value2 (avgSymmetryScore)
        // dalam konteks pasien ini.
      ],
      totalSessions: 35,
      fallIncidents: 0,
      avgBalanceScore: 85,
      avgSymmetry: 82,
      avgSymmetryChange: 3,
    },
    availableReports: [ /* ... */ ]
  },
];

export const fetchReportPatientList = async (): Promise<Pick<PatientReportData, 'id' | 'name'>[]> => {
    console.log("Fetching patient list for reports (mock)...");
    await new Promise(resolve => setTimeout(resolve, 150));
    return mockReportDataForPatients.map(p => ({
        id: p.id,
        name: p.name,
    }));
};

export const fetchFullReportDataForPatient = async (patientId: string): Promise<PatientReportData | undefined> => {
  console.log(`Workspaceing full report data for patient ${patientId} (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const reportData = mockReportDataForPatients.find(p => p.id === patientId);
  return reportData ? { ...reportData } : undefined;
};

export const downloadSpecificReport = async (reportId: string, patientId: string): Promise<{ success: boolean, url?: string, message?: string }> => {
    console.log(`Requesting download for report ${reportId}, patient ${patientId} (mock)...`);
    await new Promise(resolve => setTimeout(resolve, 400));
    const patientData = mockReportDataForPatients.find(p => p.id === patientId);
    const report = patientData?.availableReports?.find(r => r.id === reportId);

    if (report?.downloadUrl) {
        return { success: true, url: report.downloadUrl, message: `Mock download started for: ${report.title}` };
    }
    return { success: false, message: 'Report not found or no download URL available.' };
};