// src/components/dashboard/PatientOverview.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../data/mockData'; // Pastikan tipe Patient diimpor
import PatientCard from '../common/PatientCard';
import { ChevronRight } from 'lucide-react';

interface PatientOverviewProps {
  patients: Patient[];
  isLoading: boolean;
}

const PatientOverview: React.FC<PatientOverviewProps> = ({ patients, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patient Overview</h2>
        <button
          onClick={() => navigate('/patients')}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading && <p className="text-gray-500 text-center py-4">Loading patient overview...</p>}
      {!isLoading && patients.length === 0 && (
        <p className="text-gray-500 text-center py-4">No patients to display.</p>
      )}
      {!isLoading && patients.length > 0 && (
        <div className="space-y-4">
          {patients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientOverview;