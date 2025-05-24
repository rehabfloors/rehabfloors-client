// src/pages/patients/PatientProfiles.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { fetchPatients } from '../../services/patientService'; // Impor fungsi fetch
import { Patient } from '../../data/mockData'; // <-- Impor tipe Patient dari sumber aslinya
import PatientCard from '../../components/common/PatientCard';

const PatientProfiles: React.FC = () => {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [displayedPatients, setDisplayedPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchedPatients = await fetchPatients(); // Fungsi ini mengembalikan Promise<Patient[]>
        setAllPatients(fetchedPatients);
        setDisplayedPatients(fetchedPatients);
      } catch (error) {
        console.error("Gagal mengambil daftar pasien:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...allPatients];
    if (searchTerm.trim() !== '') {
      filtered = allPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }
    setDisplayedPatients(filtered);
  }, [searchTerm, allPatients]);

  const handleAddPatient = () => {
    alert("Fungsi 'Add Patient' belum diimplementasikan.");
  };

  const handleFilter = () => {
    alert("Fungsi 'Filter' belum diimplementasikan.");
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading patient profiles...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Profiles</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="relative w-full md:flex-grow md:max-w-md">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients by name or diagnosis..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full shadow-sm"
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={handleFilter}
            className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button
            onClick={handleAddPatient}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Patient
          </button>
        </div>
      </div>
      {displayedPatients.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-10 p-6 bg-white rounded-lg shadow border border-gray-200">
          <p>No patients found{searchTerm ? " matching your search criteria" : ""}.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
};

export default PatientProfiles;