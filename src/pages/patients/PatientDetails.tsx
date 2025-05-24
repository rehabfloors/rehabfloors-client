// src/pages/patients/PatientDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link
import { Edit, FileText, ArrowLeft } from 'lucide-react'; // Import ArrowLeft
// Hapus impor lama: import { patients, patientMetrics } from '../../data/mockData';
import {
  fetchPatientById,
  fetchPatientMetricsForDetailPage,
  PatientPageMetrics // Pastikan tipe ini diimpor atau didefinisikan di patientService
} from '../../services/patientService';
import { Patient } from '../../data/mockData'; // Impor tipe Patient dari sumber aslinya
import ProgressMetric from '../../components/common/ProgressMetric';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Untuk tombol kembali

  const [patient, setPatient] = useState<Patient | null>(null);
  const [metrics, setMetrics] = useState<PatientPageMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Patient ID is missing.");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const patientData = await fetchPatientById(id);
        if (!patientData) {
          setError(`Patient with ID ${id} not found.`);
          setPatient(null);
        } else {
          setPatient(patientData);
        }

        const metricsData = await fetchPatientMetricsForDetailPage(id);
        setMetrics(metricsData);

      } catch (err) {
        console.error("Gagal memuat detail pasien atau metrik:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
        setPatient(null);
        setMetrics(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]); // Jalankan ulang efek jika ID berubah

  // Fungsi placeholder untuk tombol
  const handleEditProfile = () => {
    alert(`Fungsi 'Edit Profile' untuk pasien ${patient?.name} belum diimplementasikan.`);
  };

  const handleViewCompleteHistory = () => {
    if (id) {
      navigate(`/sessions?patientId=${id}`); // Contoh navigasi ke SessionHistory dengan filter pasien
      // Atau jika SessionHistory menggunakan path param: navigate(`/sessions/${id}`);
      // Sesuaikan dengan bagaimana SessionHistory akan menerima ID pasien
    } else {
      alert("Tidak bisa melihat riwayat, ID pasien tidak ditemukan.");
    }
  };


  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading patient details...</p>
        {/* Anda bisa menambahkan spinner di sini */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/patients" className="btn-secondary flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patient Profiles
        </Link>
      </div>
    );
  }

  if (!patient) {
    // Kondisi ini seharusnya sudah ditangani oleh 'error' state, tapi sebagai fallback.
    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col justify-center items-center">
            <p className="text-gray-600 text-lg mb-4">Patient data not available.</p>
            <Link to="/patients" className="btn-secondary flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient Profiles
            </Link>
        </div>
    );
  }

  // Menentukan warna badge status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'bg-green-100 text-green-800';
      case 'Improving':
        return 'bg-blue-100 text-blue-800';
      case 'Requires Attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'Discharged':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const getProgressBarClass = (status: string) => {
    switch (status) {
        case 'Stable': return 'progress-bar-stable'; // hijau
        case 'Improving': return 'progress-bar-improving'; // biru
        case 'Requires Attention': return 'progress-bar-attention'; // kuning
        default: return 'bg-gray-500'; // abu-abu jika status tidak diketahui
    }
  }


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
            onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{patient.name}</h1>
      <p className="text-md text-gray-500 mb-6">Patient Profile Details</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Kolom Info Pasien */}
          <div className="flex flex-col items-center lg:items-start lg:border-r lg:pr-8 border-gray-200">
            <img
              src={patient.image || 'https://via.placeholder.com/160'} // Fallback image
              alt={patient.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4 shadow-md"
            />
            <h2 className="text-2xl font-semibold text-gray-800">{patient.name}</h2>
            <p className="text-lg text-gray-600 mt-1">{patient.age} years</p>
            <div className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(patient.status)}`}>
              {patient.status}
            </div>

            <div className="mt-6 text-left w-full space-y-3 text-sm">
              <div>
                <h3 className="text-gray-500 font-medium mb-0.5">Diagnosis</h3>
                <p className="text-gray-800 font-semibold">{patient.diagnosis}</p>
              </div>
              <div>
                <h3 className="text-gray-500 font-medium mb-0.5">Patient ID</h3>
                <p className="text-gray-800">{patient.id}</p>
              </div>
              <div>
                <h3 className="text-gray-500 font-medium mb-0.5">Last Session</h3>
                <p className="text-gray-800">{patient.lastSession || 'N/A'}</p>
              </div>
              {/* Tambahkan info lain jika ada di tipe Patient */}
              {patient.email && (
                <div>
                    <h3 className="text-gray-500 font-medium mb-0.5">Email</h3>
                    <p className="text-gray-800">{patient.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Progres Terapi */}
          <div className="lg:col-span-2 mt-6 lg:mt-0">
            <h2 className="text-xl font-semibold text-gray-700 mb-5">Therapy Progress</h2>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-gray-700 font-medium">Overall Progress</span>
                <span className={`${getProgressBarClass(patient.status).replace('progress-bar-', 'text-').replace('-500', '-600')} font-semibold`}>{patient.progress}%</span>
              </div>
              <div className="progress-bar-container"> {/* bg-gray-200 rounded-full h-2.5 */}
                <div
                  className={`${getProgressBarClass(patient.status)} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${patient.progress}%` }}
                ></div>
              </div>
            </div>

            {metrics ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <ProgressMetric
                  title="Mobility Score"
                  value={metrics.mobility.value}
                  change={metrics.mobility.change}
                  color="blue" // Sesuaikan warna jika perlu
                />
                <ProgressMetric
                  title="Balance Score"
                  value={metrics.balance.value}
                  change={metrics.balance.change}
                  color="green" // Sesuaikan warna jika perlu
                />
                <ProgressMetric
                  title="Gait Symmetry"
                  value={metrics.gaitSymmetry.value}
                  change={metrics.gaitSymmetry.change}
                  color="yellow" // Sesuaikan warna jika perlu
                />
                <ProgressMetric
                  title="Step Cadence"
                  value={metrics.stepCadence.value}
                  change={metrics.stepCadence.change}
                  unit={metrics.stepCadence.unit || " steps/min"}
                  color="purple" // Sesuaikan warna jika perlu
                />
              </div>
            ) : (
              <p className="text-gray-500 mb-6">Patient metrics data is not available.</p>
            )}

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-gray-700 font-semibold mb-2 text-md">Medical Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {/* Catatan medis bisa diambil dari data pasien atau endpoint terpisah */}
                {patient.medicalHistory && patient.medicalHistory.length > 0
                  ? patient.medicalHistory.join('. ') + '.'
                  : "No specific medical notes available for this patient in the current mock data. Patient has shown improvement in gait symmetry and balance over the last month. Recommend to continue with the current therapy plan with increased focus on step cadence exercises. No adverse events reported during therapy sessions."
                }
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleEditProfile}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center px-5 py-2.5"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={handleViewCompleteHistory}
                className="btn-primary w-full sm:w-auto flex items-center justify-center px-5 py-2.5"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Complete History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;