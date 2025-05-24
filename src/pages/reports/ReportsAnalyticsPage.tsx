// src/pages/reports/ReportsAnalyticsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Download, BarChart2, FileText, AlertOctagon, SlidersHorizontal, CalendarDays, User, TrendingUp } from 'lucide-react';
import {
  fetchReportPatientList,
  fetchFullReportDataForPatient,
  downloadSpecificReport,
  PatientReportData,
  ReportItem, // Pastikan ReportItem diekspor dari service dan diimpor di sini
  KeyInsight,
  PatientProgressOverview,
  MonthlyMetricPoint
} from '../../services/reportService';

// --- Komponen Lokal (UI Presentasional) ---
// Pastikan komponen PatientInfoCard, KeyInsightCard, ReportCardItem, dan SimpleBarLineChart
// sudah didefinisikan dengan benar di file ini atau diimpor jika terpisah.
// Saya akan sertakan definisinya di sini untuk kelengkapan jika belum ada.

interface PatientInfoCardProps {
  patient: PatientReportData;
  onDownloadFullReport: () => void;
}
const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patient, onDownloadFullReport }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-6">
    <div className="flex items-center mb-4">
      <img src={patient.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} alt={patient.name} className="w-16 h-16 rounded-full object-cover mr-4 shadow-sm" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
        <p className="text-xs text-gray-600">{patient.diagnosis}</p>
      </div>
    </div>
    <div className="space-y-1.5 text-sm mb-3">
      <div className="flex justify-between"><span className="text-gray-500">Age:</span> <span className="font-medium text-gray-700">{patient.age}</span></div>
      <div className="flex justify-between"><span className="text-gray-500">Status:</span> <span className={`font-medium ${patient.status === 'Improving' ? 'text-blue-600' : patient.status === 'Stable' ? 'text-green-600' : 'text-yellow-600'}`}>{patient.status}</span></div>
      <div className="flex justify-between"><span className="text-gray-500">Last Session:</span> <span className="font-medium text-gray-700">{patient.lastSession}</span></div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Progress:</span>
        <div className="w-1/2 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${patient.progress}%` }}></div>
          </div>
          <span className="font-medium text-gray-700 text-xs">{patient.progress}%</span>
        </div>
      </div>
    </div>
    <button
      onClick={onDownloadFullReport}
      className="w-full bg-blue-600 text-white text-sm py-2.5 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
    >
      <Download size={16} className="mr-2" /> Download Full Report (Summary)
    </button>
  </div>
);

interface KeyInsightCardProps {
  insight: KeyInsight; // Pastikan KeyInsight diimpor atau didefinisikan
}
const KeyInsightCard: React.FC<KeyInsightCardProps> = ({ insight }) => (
  <div className="bg-blue-50 p-3.5 rounded-md border border-blue-200 shadow-sm">
    <h4 className="text-sm font-semibold text-blue-700">{insight.title}</h4>
    <p className="text-xs text-blue-600 mt-0.5">{insight.description}</p>
  </div>
);

const reportCategoryIcons: { [key: string]: React.ReactNode } = {
  Summary: <BarChart2 size={20} className="text-blue-600" />,
  Analysis: <FileText size={20} className="text-blue-600" />,
  Incidents: <AlertOctagon size={20} className="text-orange-600" />,
  Default: <User size={20} className="text-gray-500" />,
};

interface ReportCardItemProps {
  report: ReportItem; // Tipe eksplisit
  onViewReport: (report: ReportItem) => void;
  onDownloadReport: (report: ReportItem) => void;
}
const ReportCardItem: React.FC<ReportCardItemProps> = ({ report, onViewReport, onDownloadReport }) => {
  const iconToDisplay = reportCategoryIcons[report.category] || reportCategoryIcons.Default;
  return(
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-start mb-2">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 mr-3">
           {report.icon || iconToDisplay}
        </div>
        <div className='flex-1'>
          <h4 className="text-md font-semibold text-gray-800">
              {report.title.replace(report.highlightedKeyword || '', '')}
              {report.highlightedKeyword && <span className="text-blue-600">{report.highlightedKeyword}</span>}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{report.description}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-auto mb-3">Last updated: {report.lastUpdated}</p>
      <div className="flex space-x-2">
        <button onClick={() => onViewReport(report)} className="flex-1 text-sm bg-white text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors">View</button>
        <button onClick={() => onDownloadReport(report)} className="flex-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">Download</button>
      </div>
    </div>
  );
}

interface SimpleBarLineChartProps {
  data: MonthlyMetricPoint[];
  metric1Name?: string;
  metric2Name?: string;
  timeFilter: string;
}
const SimpleBarLineChart: React.FC<SimpleBarLineChartProps> = ({ data, metric1Name = "Metric 1", metric2Name = "Metric 2", timeFilter }) => {
  if (!data || data.length === 0) {
    return <div className="w-full h-64 bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center justify-center text-gray-400">No chart data available for the selected period.</div>;
  }
  const maxValue = Math.max(...data.map(d => Math.max(d.avgBalanceScore, d.avgSymmetryScore)), 0) || 100;

  return (
    <div className="w-full">
        <div className="w-full h-64 bg-gray-50 p-4 rounded-md border border-gray-200 flex items-end space-x-1.5 overflow-x-auto overflow-y-hidden">
        {data.map((d: MonthlyMetricPoint, i: number) => ( // Tipe eksplisit untuk 'd'
            <div key={`${d.month}-${i}`} className="flex-1 min-w-[35px] sm:min-w-[40px] flex flex-col items-center justify-end h-full">
            <div className="w-full h-full relative flex items-end">
                <div
                className="w-1/2 bg-blue-400 rounded-t-sm hover:bg-blue-500 transition-colors"
                style={{ height: `${(d.avgBalanceScore / maxValue) * 100}%`}}
                title={`${metric1Name} (${d.month}): ${d.avgBalanceScore}`}
                ></div>
                <div
                className="w-1/2 bg-orange-400 rounded-t-sm ml-px hover:bg-orange-500 transition-colors"
                style={{ height: `${(d.avgSymmetryScore / maxValue) * 100}%`}}
                title={`${metric2Name} (${d.month}): ${d.avgSymmetryScore}`}
                ></div>
            </div>
            <span className="text-xs text-gray-500 mt-1.5 whitespace-nowrap">{d.month.substring(0,3)}</span>
            </div>
        ))}
        </div>
        <div className="flex justify-center space-x-4 mt-3 text-xs text-gray-600">
            <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-sm mr-1.5"></span>
                {metric1Name}
            </div>
            <div className="flex items-center">
                <span className="w-3 h-3 bg-orange-400 rounded-sm mr-1.5"></span>
                {metric2Name}
            </div>
        </div>
    </div>
  );
};

const ReportsAnalyticsPage: React.FC = () => {
  const [patientList, setPatientList] = useState<Pick<PatientReportData, 'id' | 'name'>[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPatientData, setSelectedPatientData] = useState<PatientReportData | null>(null);
  const [isLoadingPatientList, setIsLoadingPatientList] = useState<boolean>(true);
  const [isLoadingPatientData, setIsLoadingPatientData] = useState<boolean>(false);

  const [activeTimeFilter, setActiveTimeFilter] = useState<'Weekly' | 'Monthly' | 'Yearly' | 'Custom'>('Monthly');
  const [activeReportFilter, setActiveReportFilter] = useState<'All' | 'Summary' | 'Analysis' | 'Incidents'>('All');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPatientList = async () => {
      setIsLoadingPatientList(true);
      try {
        const list = await fetchReportPatientList();
        setPatientList(list);
        if (list.length > 0) {
          setSelectedPatientId(list[0].id);
        }
      } catch (error) {
        console.error("Gagal memuat daftar pasien untuk laporan:", error);
        showFeedback("Error: Gagal memuat daftar pasien.");
      } finally {
        setIsLoadingPatientList(false);
      }
    };
    loadPatientList();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) {
      setSelectedPatientData(null);
      return;
    }
    const loadFullReportData = async () => {
      setIsLoadingPatientData(true);
      try {
        const data = await fetchFullReportDataForPatient(selectedPatientId);
        setSelectedPatientData(data || null);
      } catch (error) {
        console.error(`Gagal memuat data laporan untuk pasien ${selectedPatientId}:`, error);
        showFeedback(`Error: Gagal memuat data untuk ${selectedPatientId}.`);
        setSelectedPatientData(null);
      } finally {
        setIsLoadingPatientData(false);
      }
    };
    loadFullReportData();
  }, [selectedPatientId]);

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Tipe eksplisit untuk filteredReports
  const filteredReports: ReportItem[] = useMemo(() => {
    if (!selectedPatientData || !selectedPatientData.availableReports) {
      return [];
    }
    if (activeReportFilter === 'All') {
      return selectedPatientData.availableReports;
    }
    // Tipe eksplisit untuk 'report' dalam filter callback
    return selectedPatientData.availableReports.filter(
      (report: ReportItem) => report.category === activeReportFilter
    );
  }, [selectedPatientData, activeReportFilter]);

  const handleDownloadFullReport = () => {
    if (!selectedPatientData) return;
    showFeedback(`Downloading full report summary for ${selectedPatientData.name}... (Simulation)`);
  };

  const handleViewReport = (report: ReportItem) => { // Tipe eksplisit untuk 'report'
    showFeedback(`Viewing report: ${report.title}... (Simulation)`);
    if(report.viewUrl) window.open(report.viewUrl, '_blank');
  };

  const handleDownloadReport = async (report: ReportItem) => { // Tipe eksplisit untuk 'report'
    if (!selectedPatientId) return;
    showFeedback(`Preparing download for: ${report.title}...`);
    const result = await downloadSpecificReport(report.id, selectedPatientId);
    if (result.success && result.url) {
        showFeedback(result.message || `Downloading ${report.title}...`);
        console.log("Mock download URL:", result.url);
    } else {
        showFeedback(result.message || `Failed to download ${report.title}.`);
    }
  };

  const handleTimeFilterChange = (filter: 'Weekly' | 'Monthly' | 'Yearly' | 'Custom') => {
    setActiveTimeFilter(filter);
    showFeedback(`Time filter for chart set to: ${filter}`);
    console.log(`Chart time filter changed to: ${filter}. Data refetch/filtering logic would go here.`);
  };

  const timeFilters: ('Weekly' | 'Monthly' | 'Yearly' | 'Custom')[] = ['Weekly', 'Monthly', 'Yearly', 'Custom'];
  const reportCategories: ('All' | 'Summary' | 'Analysis' | 'Incidents')[] = ['All', 'Summary', 'Analysis', 'Incidents'];

  if (isLoadingPatientList) {
    return <div className="p-6 bg-gray-50 min-h-full flex justify-center items-center"><p className="text-lg">Loading report page...</p></div>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full">
       {feedbackMessage && (
        <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2.5 rounded-md shadow-lg z-50 transition-opacity duration-300 animate-fadeInOut">
          {feedbackMessage}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Reports & Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col space-y-6">
            <div>
                <label htmlFor="patient-select-reports" className="block text-sm font-medium text-gray-700 mb-1">Select Patient:</label>
                {patientList.length > 0 ? (
                <div className="relative">
                    <select
                    id="patient-select-reports"
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="appearance-none block w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-2.5 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                    {patientList.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                ) : (
                <p className="text-sm text-gray-500">No patients available for reporting.</p>
                )}
            </div>

            {isLoadingPatientData && <div className="bg-white rounded-lg shadow border border-gray-200 p-5 text-center"><p>Loading patient data...</p></div>}
            {!isLoadingPatientData && selectedPatientData && <PatientInfoCard patient={selectedPatientData} onDownloadFullReport={handleDownloadFullReport} />}
            {!isLoadingPatientData && selectedPatientData && selectedPatientData.keyInsights && selectedPatientData.keyInsights.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Key Insights</h3>
                    <div className="space-y-3">
                    {selectedPatientData.keyInsights.map((insight: KeyInsight) => <KeyInsightCard key={insight.id} insight={insight} />)}
                    </div>
                </div>
            )}
            {!isLoadingPatientData && selectedPatientId && !selectedPatientData && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-5 text-center"><p>No report data found for {selectedPatientId}.</p></div>
            )}
        </div>

        <div className="lg:col-span-2 flex flex-col space-y-6">
          {isLoadingPatientData && <div className="bg-white rounded-lg shadow border border-gray-200 p-5 text-center"><p>Loading patient progress...</p></div>}
          {!isLoadingPatientData && selectedPatientData && selectedPatientData.progressOverview && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Patient Progress Overview</h3>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg shadow-sm">
                    {timeFilters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => handleTimeFilterChange(filter)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTimeFilter === filter ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        {filter === 'Custom' ? <CalendarDays size={14} className="inline mr-1.5" /> : null} {filter}
                    </button>
                    ))}
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="md:col-span-2">
                        <SimpleBarLineChart
                        data={selectedPatientData.progressOverview.chartData} // chartData adalah MonthlyMetricPoint[]
                        metric1Name={selectedPatientData.progressOverview.metric1Name}
                        metric2Name={selectedPatientData.progressOverview.metric2Name}
                        timeFilter={activeTimeFilter}
                        />
                    </div>
                    <div className="md:col-span-1 space-y-3">
                        {/* Statistik Ringkas */}
                        <div className="bg-gray-100 p-3 rounded-md text-center shadow-sm">
                            <div className="text-3xl font-bold text-gray-700">{selectedPatientData.progressOverview.totalSessions}</div>
                            <div className="text-xs text-gray-500">Total Sessions</div>
                        </div>
                        <div className={`${selectedPatientData.progressOverview.fallIncidents > 0 ? 'bg-red-100' : 'bg-green-100'} p-3 rounded-md text-center shadow-sm`}>
                            <div className="flex justify-center items-baseline">
                                <span className={`text-3xl font-bold ${selectedPatientData.progressOverview.fallIncidents > 0 ? 'text-red-700' : 'text-green-700'}`}>{selectedPatientData.progressOverview.fallIncidents}</span>
                                {selectedPatientData.progressOverview.fallIncidentsChange !== undefined && (
                                    <span className={`text-xs font-medium ml-1 ${selectedPatientData.progressOverview.fallIncidentsChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {selectedPatientData.progressOverview.fallIncidentsChange > 0 ? `+${selectedPatientData.progressOverview.fallIncidentsChange}` : selectedPatientData.progressOverview.fallIncidentsChange}
                                    </span>
                                )}
                            </div>
                            <div className={`text-xs ${selectedPatientData.progressOverview.fallIncidents > 0 ? 'text-red-600' : 'text-green-600'}`}>Fall Incidents</div>
                        </div>
                         <div className="bg-white border border-gray-200 p-3 rounded-md text-center shadow-sm">
                            <div className="flex justify-center items-baseline">
                                <span className="text-2xl font-bold text-gray-700">{selectedPatientData.progressOverview.avgBalanceScore}%</span>
                                {selectedPatientData.progressOverview.avgBalanceScoreChange !== undefined && (
                                    <span className={`text-xs font-medium ml-1 ${selectedPatientData.progressOverview.avgBalanceScoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedPatientData.progressOverview.avgBalanceScoreChange >= 0 ? `+${selectedPatientData.progressOverview.avgBalanceScoreChange}` : selectedPatientData.progressOverview.avgBalanceScoreChange}%
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">Avg. Balance Score</div>
                        </div>
                        <div className="bg-white border border-gray-200 p-3 rounded-md text-center shadow-sm">
                            <div className="flex justify-center items-baseline">
                                <span className="text-2xl font-bold text-gray-700">{selectedPatientData.progressOverview.avgSymmetry}%</span>
                                {selectedPatientData.progressOverview.avgSymmetryChange !== undefined && (
                                    <span className={`text-xs font-medium ml-1 ${selectedPatientData.progressOverview.avgSymmetryChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedPatientData.progressOverview.avgSymmetryChange >= 0 ? `+${selectedPatientData.progressOverview.avgSymmetryChange}` : selectedPatientData.progressOverview.avgSymmetryChange}%
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">Avg. Symmetry</div>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {!isLoadingPatientData && selectedPatientData && selectedPatientData.availableReports && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Available Reports</h3>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg shadow-sm">
                    {reportCategories.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveReportFilter(filter)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${activeReportFilter === filter ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        {filter}
                    </button>
                    ))}
                </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredReports.length > 0 ? (
                    // Tipe eksplisit untuk 'report' dalam map callback
                    filteredReports.map((report: ReportItem) => (
                        <ReportCardItem
                            key={report.id}
                            report={report}
                            onViewReport={handleViewReport}
                            onDownloadReport={handleDownloadReport}
                        />
                    ))
                ) : (
                    <p className="sm:col-span-2 text-sm text-gray-500 text-center py-4">
                        No reports available for "{activeReportFilter}" category.
                    </p>
                )}
                </div>
            </div>
          )}
          {!isLoadingPatientData && selectedPatientId && !selectedPatientData && (
             <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 text-center"><p>No detailed report data available for this patient.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalyticsPage;