// // import { useState } from 'react';
// // import { Routes, Route, useLocation } from 'react-router-dom';
// // import AuthLayout from './layouts/AuthLayout';
// // import DashboardLayout from './layouts/DashboardLayout';
// // import SignUp from './pages/auth/SignUp';
// // import Login from './pages/auth/Login';
// // import Dashboard from './pages/dashboard/Dashboard';
// // import PatientProfiles from './pages/patients/PatientProfiles';
// // import PatientDetails from './pages/patients/PatientDetails';
// // import SessionHistory from './pages/sessions/SessionHistory';
// // import TherapistDashboard from './pages/therapist/TherapistDashboard';
// // import FallDetection from './pages/monitoring/FallDetection';
// // import TherapyRoutines from './pages/therapy/TherapyRoutines';
// // import Reports from './pages/reports/Reports';
// // import Settings from './pages/settings/Settings';
// // import { AuthProvider } from './contexts/AuthContext';

// // function App() {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const location = useLocation();

// //   // For demo purposes, automatically authenticate when navigating to dashboard routes
// //   const handleLogin = () => {
// //     setIsAuthenticated(true);
// //   };
  
// //   return (
// //     <AuthProvider>
// //       <Routes>
// //         {/* Auth Routes */}
// //         <Route element={<AuthLayout />}>
// //           <Route path="/signup" element={<SignUp onSignUp={handleLogin} />} />
// //           <Route path="/login" element={<Login onLogin={handleLogin} />} />
// //           <Route path="/" element={<Login onLogin={handleLogin} />} />
// //         </Route>
        
// //         {/* Dashboard Routes */}
// //         <Route element={<DashboardLayout />}>
// //           <Route path="/dashboard" element={<Dashboard />} />
// //           <Route path="/patients" element={<PatientProfiles />} />
// //           <Route path="/patients/:id" element={<PatientDetails />} />
// //           <Route path="/sessions" element={<SessionHistory />} />
// //           <Route path="/therapist" element={<TherapistDashboard />} />
// //           <Route path="/fall-detection" element={<FallDetection />} />
// //           <Route path="/therapy-routines" element={<TherapyRoutines />} />
// //           <Route path="/reports" element={<Reports />} />
// //           <Route path="/settings" element={<Settings />} />
// //         </Route>
// //       </Routes>
// //     </AuthProvider>
// //   );
// // }

// // export default App;

// import { useState } from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import AuthLayout from './layouts/AuthLayout';
// import DashboardLayout from './layouts/DashboardLayout';
// import SignUp from './pages/auth/SignUp';
// import Login from './pages/auth/Login';
// import Dashboard from './pages/dashboard/Dashboard';
// import PatientProfiles from './pages/patients/PatientProfiles';
// import PatientDetails from './pages/patients/PatientDetails';
// import SessionHistory  from './pages/sessions/SessionHistory';
// import TherapistDashboard from './pages/therapist/TherapistDashboard';
// import FallDetectionPage from './pages/monitoring/FallDetection';
// import TherapyRoutinesPage from './pages/therapy/TherapyRoutines';
// import ReportsAnalyticsPage from './pages/reports/ReportsAnalyticsPage';
// import SettingsPage from './pages/settings/Settings';
// import { AuthProvider } from './contexts/AuthContext';

// // Placeholder components untuk halaman yang belum dibuat
// const Placeholder = ({ name }: { name: string }) => (
//   <div className="p-6 text-center text-gray-600">
//     <h2 className="text-2xl font-semibold">{name} Page</h2>
//     <p>This page is under construction.</p>
//   </div>
// );

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const location = useLocation();

//   // Demo: otomatis authenticate saat navigasi ke dashboard
//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   return (
//     <AuthProvider>
//       <Routes>
//         {/* Auth Routes */}
//         <Route element={<AuthLayout />}>
//           <Route path="/signup" element={<SignUp onSignUp={handleLogin} />} />
//           <Route path="/login" element={<Login onLogin={handleLogin} />} />
//           <Route path="/" element={<Login onLogin={handleLogin} />} />
//         </Route>

//         {/* Dashboard Routes */}
//         <Route element={<DashboardLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/patients" element={<PatientProfiles />} />
//           <Route path="/patients/:id" element={<PatientDetails />} />
//           <Route path="/sessions" element={<SessionHistory />} />
//           <Route path="/therapist" element={<TherapistDashboard />} />
//           <Route path="/fall-detection" element={<FallDetectionPage />} />
//           <Route path="/therapy-routines" element={<TherapyRoutinesPage />} />
//           <Route path="/reports" element={<ReportsAnalyticsPage />} />
//           <Route path="/settings" element={<SettingsPage />} />
//         </Route>
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;

// src/App.tsx
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PatientProfiles from './pages/patients/PatientProfiles';
import PatientDetails from './pages/patients/PatientDetails';
import SessionHistory  from './pages/sessions/SessionHistory';
import TherapistDashboard from './pages/therapist/TherapistDashboard';
import FallDetectionPage from './pages/monitoring/FallDetection';
import TherapyRoutinesPage from './pages/therapy/TherapyRoutines';
import ReportsAnalyticsPage from './pages/reports/ReportsAnalyticsPage';
import SettingsPage from './pages/settings/Settings';
import { AuthProvider } from './contexts/AuthContext';

// Placeholder components (jika masih ada rute yang menggunakannya)
const Placeholder = ({ name }: { name: string }) => (
  <div className="p-6 text-center text-gray-600">
    <h2 className="text-2xl font-semibold">{name} Page</h2>
    <p>This page is under construction.</p>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State ini mungkin perlu dikelola lebih baik via AuthContext
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true); // Sebaiknya ini memanipulasi state di AuthContext
  };

  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp onSignUp={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        </Route>

        {/* Dashboard Routes */}
        {/* Logika untuk melindungi rute ini bisa ditambahkan di sini atau di dalam DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientProfiles />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/sessions" element={<SessionHistory />} />
          <Route path="/therapist" element={<TherapistDashboard />} />
          <Route path="/fall-detection" element={<FallDetectionPage />} />
          <Route path="/therapy-routines" element={<TherapyRoutinesPage />} />
          <Route path="/reports" element={<ReportsAnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Pastikan tidak ada rute yang secara keliru merender <RehabilitationProgress /> di sini */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;