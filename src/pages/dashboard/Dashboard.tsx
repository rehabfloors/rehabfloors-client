// src/pages/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Footprints, Clock, Percent } from 'lucide-react';
import PatientOverview from '../../components/dashboard/PatientOverview';
import RecentNotifications from '../../components/dashboard/RecentNotifications';
import RehabilitationProgress from '../../components/dashboard/RehabilitationProgress';
import GaitAnalysis from '../../components/dashboard/GaitAnalysis'; // Ini akan mengambil datanya sendiri
import StatCard from '../../components/dashboard/StatCard';

import { Patient, Notification } from '../../data/mockData'; // Tipe yang masih relevan
import {
  fetchDashboardPatients,
  fetchDashboardNotifications,
  fetchDashboardRehabProgress,
  fetchDashboardStats,
  RehabProgressData,
  DashboardStatSummary // Gunakan tipe spesifik ini
} from '../../services/dashboardService';

const Dashboard = () => {
  const [dashboardPatients, setDashboardPatients] = useState<Patient[]>([]);
  const [dashboardNotifications, setDashboardNotifications] = useState<Notification[]>([]);
  const [rehabProgressData, setRehabProgressData] = useState<RehabProgressData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatSummary | null>(null);

  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isLoadingRehab, setIsLoadingRehab] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoadingPatients(true);
      fetchDashboardPatients()
        .then(setDashboardPatients)
        .catch(err => console.error("Failed to load patients", err))
        .finally(() => setIsLoadingPatients(false));

      setIsLoadingNotifications(true);
      fetchDashboardNotifications()
        .then(setDashboardNotifications)
        .catch(err => console.error("Failed to load notifications", err))
        .finally(() => setIsLoadingNotifications(false));

      setIsLoadingRehab(true);
      fetchDashboardRehabProgress()
        .then(setRehabProgressData)
        .catch(err => console.error("Failed to load rehab progress", err))
        .finally(() => setIsLoadingRehab(false));

      setIsLoadingStats(true);
      fetchDashboardStats()
        .then(setDashboardStats)
        .catch(err => console.error("Failed to load dashboard stats", err))
        .finally(() => setIsLoadingStats(false));
    };

    loadDashboardData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen"> {/* Tambahkan min-h-screen dan bg-gray-50 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1> {/* Sesuaikan styling header */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <PatientOverview patients={dashboardPatients} isLoading={isLoadingPatients} />
          <RehabilitationProgress data={rehabProgressData} isLoading={isLoadingRehab} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RecentNotifications notifications={dashboardNotifications} isLoading={isLoadingNotifications} />
          {/* GaitAnalysis akan mengambil datanya sendiri dari iotService */}
          <GaitAnalysis />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {isLoadingStats && <div className="md:col-span-3 text-center text-gray-500 py-4">Loading summary stats...</div>}
        {!isLoadingStats && dashboardStats && (
          <>
            <StatCard
              value={dashboardStats.steps}
              label="Steps today"
              icon={<Footprints className="h-6 w-6 text-blue-600" />}
            />
            <StatCard
              value={dashboardStats.therapyTime}
              label="Therapy today"
              unit=" min"
              icon={<Clock className="h-6 w-6 text-blue-600" />}
            />
            <StatCard
              value={dashboardStats.overallProgress}
              label="Overall progress (Daily)"
              unit="%"
              icon={<Percent className="h-6 w-6 text-blue-600" />}
            />
          </>
        )}
        {!isLoadingStats && !dashboardStats && (
            <div className="md:col-span-3 text-center text-gray-500 py-4">Summary stats not available.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;