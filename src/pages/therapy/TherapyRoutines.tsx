// src/pages/therapy/TherapyRoutines.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, PlusCircle, ListFilter, Calendar, Clock3, BarChart3, Edit2, PlayCircle, Eye, CheckCircle, Users } from 'lucide-react';
import {
  fetchPatientsWithRoutinesList,
  fetchRecommendedRoutines,
  assignRoutineToPatient,
  createNewTherapyRoutine,
  fetchRoutinesForPatient, // <-- PASTIKAN FUNGSI INI DIIMPOR
  PatientWithRoutines,
  TherapyRoutine,
  Exercise,
  RecommendedRoutine
} from '../../services/therapyService';

// ... (Komponen Lokal UI: PatientListItem, ExerciseCard, dst. tetap sama) ...
interface PatientListItemProps {
  patient: Pick<PatientWithRoutines, 'id' | 'name' | 'diagnosis' | 'image' | 'progress'>;
  isSelected: boolean;
  onSelect: () => void;
}
const PatientListItem: React.FC<PatientListItemProps> = ({ patient, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-l-4 border-blue-600 shadow-sm' : 'hover:bg-gray-100'}`}
  >
    <img src={patient.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} alt={patient.name} className="w-10 h-10 rounded-full object-cover mr-3" />
    <div className="flex-1 overflow-hidden">
      <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{patient.name}</h4>
      <p className="text-xs text-gray-500 truncate">{patient.diagnosis}</p>
      {isSelected && typeof patient.progress === 'number' && (
        <div className="mt-1.5">
          <div className="flex justify-between text-xs text-gray-600 mb-0.5">
            <span>Progress</span>
            <span>{patient.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${patient.progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  </div>
);

interface ExerciseCardProps {
  exercise: Exercise;
}
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => (
  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:shadow-sm transition-shadow">
    <h5 className="text-sm font-semibold text-gray-700">{exercise.name}</h5>
    <p className="text-xs text-gray-500 mt-0.5 mb-1.5 leading-relaxed">{exercise.description}</p>
    <div className="flex space-x-3 text-xs text-gray-600">
      {exercise.duration && <span><Clock3 size={12} className="inline mr-1" />{exercise.duration}</span>}
      {exercise.reps && <span><BarChart3 size={12} className="inline mr-1" />{exercise.reps}</span>}
    </div>
  </div>
);

interface DifficultyBadgeProps {
  difficulty: TherapyRoutine['difficulty'];
}
const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  let colorClasses = '';
  switch (difficulty) {
    case 'Easy': colorClasses = 'bg-green-100 text-green-700 border-green-200'; break;
    case 'Medium': colorClasses = 'bg-yellow-100 text-yellow-700 border-yellow-200'; break;
    case 'Hard': colorClasses = 'bg-red-100 text-red-700 border-red-200'; break;
    default: colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
  }
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${colorClasses}`}>{difficulty}</span>;
};

interface AssignedRoutineCardProps {
  routine: TherapyRoutine;
  onEdit: (routineId: string) => void;
  onStart: (routineId: string) => void;
}
const AssignedRoutineCard: React.FC<AssignedRoutineCardProps> = ({ routine, onEdit, onStart }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-5 flex flex-col hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-800">{routine.title}</h3>
      <DifficultyBadge difficulty={routine.difficulty} />
    </div>
    <p className="text-sm text-gray-600 mb-3 leading-relaxed flex-grow">{routine.description}</p>
    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
      <span className="flex items-center col-span-1 truncate"><Calendar size={14} className="mr-1.5 flex-shrink-0" /> {routine.frequency}</span>
      <span className="flex items-center col-span-1 truncate"><Clock3 size={14} className="mr-1.5 flex-shrink-0" /> {routine.totalDuration}</span>
      <span className="flex items-center col-span-1 truncate"><BarChart3 size={14} className="mr-1.5 flex-shrink-0" /> {routine.exerciseCount} exercises</span>
    </div>
    {routine.exercises && routine.exercises.length > 0 && (
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Exercises:</h4>
        {routine.exercises.slice(0,2).map(ex => <ExerciseCard key={ex.id} exercise={ex} />)}
        {routine.exercises.length > 2 && <p className="text-xs text-blue-600 hover:underline cursor-pointer mt-1">View all exercises...</p>}
      </div>
    )}
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto pt-3 border-t border-gray-100">
      <button onClick={() => onEdit(routine.id)} className="flex-1 text-sm bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center">
        <Edit2 size={14} className="mr-1.5" /> Edit
      </button>
      <button onClick={() => onStart(routine.id)} className="flex-1 text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
        <PlayCircle size={14} className="mr-1.5" /> Start
      </button>
    </div>
  </div>
);

interface ApprovalBadgeProps {
  approval: RecommendedRoutine['approval'];
}
const ApprovalBadge: React.FC<ApprovalBadgeProps> = ({ approval }) => {
  let colorClasses = '';
  switch (approval) {
    case 'Therapist Approved': colorClasses = 'bg-green-100 text-green-700 border-green-200'; break;
    case 'AI-Recommended': colorClasses = 'bg-teal-100 text-teal-700 border-teal-200'; break;
  }
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${colorClasses}`}>{approval}</span>;
};

interface RecommendedRoutineCardProps {
  routine: RecommendedRoutine;
  onViewDetails: (routine: RecommendedRoutine) => void;
  onAddToPatient: (routine: RecommendedRoutine) => void;
}
const RecommendedRoutineCard: React.FC<RecommendedRoutineCardProps> = ({ routine, onViewDetails, onAddToPatient }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-5 flex flex-col hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-800">{routine.title}</h3>
      <ApprovalBadge approval={routine.approval} />
    </div>
    <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">{routine.description}</p>
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto pt-3 border-t border-gray-100">
      <button onClick={() => onViewDetails(routine)} className="flex-1 text-sm bg-white text-sky-600 border border-sky-600 px-4 py-2 rounded-md hover:bg-sky-50 transition-colors flex items-center justify-center">
        <Eye size={14} className="mr-1.5" /> View Details
      </button>
      <button onClick={() => onAddToPatient(routine)} className="flex-1 text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
        <CheckCircle size={14} className="mr-1.5" /> Add to Patient
      </button>
    </div>
  </div>
);


// --- Halaman Utama ---
const TherapyRoutinesPage: React.FC = () => {
  const [patientList, setPatientList] = useState<PatientWithRoutines[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [recommendedRoutines, setRecommendedRoutines] = useState<RecommendedRoutine[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState<boolean>(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingPatients(true);
      setIsLoadingRecommended(true);
      try {
        const patients = await fetchPatientsWithRoutinesList();
        setPatientList(patients);
        if (patients.length > 0 && !selectedPatientId) {
          setSelectedPatientId(patients[0].id);
        }
        const recRoutines = await fetchRecommendedRoutines();
        setRecommendedRoutines(recRoutines);
      } catch (error) {
        console.error("Gagal memuat data rutin terapi:", error);
        showFeedback("Error: Gagal memuat data.");
      } finally {
        setIsLoadingPatients(false);
        setIsLoadingRecommended(false);
      }
    };
    loadInitialData();
  }, []); // Hanya dijalankan sekali saat mount, atau jika Anda ingin memuat ulang setelah filter/aksi tertentu

  // Efek untuk memuat ulang rutin pasien tertentu jika selectedPatientId berubah
  // atau jika ada aksi yang memodifikasi rutinnya.
  // Ini bisa di-trigger oleh state lain jika perlu.
  useEffect(() => {
    if (!selectedPatientId) return;

    const loadPatientSpecificRoutines = async () => {
        // Anda mungkin ingin menambahkan state loading khusus untuk ini
        try {
            const routines = await fetchRoutinesForPatient(selectedPatientId);
            setPatientList(prevList =>
                prevList.map(p =>
                    p.id === selectedPatientId ? { ...p, routines: routines } : p
                )
            );
        } catch (error) {
            console.error(`Gagal memuat rutin untuk pasien ${selectedPatientId}:`, error);
            showFeedback(`Error: Gagal memuat rutin untuk pasien.`);
        }
    };
    loadPatientSpecificRoutines();
  }, [selectedPatientId]);


  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const selectedPatient = useMemo(() => {
    return patientList.find(p => p.id === selectedPatientId);
  }, [patientList, selectedPatientId]);

  const handleEditRoutine = (routineId: string) => {
    showFeedback(`Edit routine: ${routineId} (Not implemented)`);
  };
  const handleStartRoutine = (routineId: string) => {
    showFeedback(`Start routine: ${routineId} (Not implemented)`);
  };
  const handleViewRecommendedDetails = (routine: RecommendedRoutine) => {
    showFeedback(`View details for: ${routine.title} (Not implemented)`);
  };

  const handleAddToPatient = async (routine: RecommendedRoutine) => {
    if (!selectedPatientId || !selectedPatient) { // Pastikan selectedPatient juga ada
      showFeedback("Please select a patient first.");
      return;
    }
    showFeedback(`Adding "${routine.title}" to ${selectedPatient.name}...`);
    const newRoutineData: Omit<TherapyRoutine, 'id' | 'patientId'> = {
        title: routine.title,
        description: routine.description,
        difficulty: 'Medium', // Default, atau ambil dari RecommendedRoutine jika ada
        frequency: '3 times/week', // Default
        totalDuration: '30 mins', // Default
        exerciseCount: 0, // Hitung dari exercises (jika ada di RecommendedRoutine)
        exercises: [] // Tambahkan exercises jika ada di RecommendedRoutine atau dari template
    };
    // Untuk mock, assignRoutineToPatient mungkin memerlukan detail rutin penuh
    // atau hanya ID jika backend bisa mencarinya. Kita kirim detailnya.
    const success = await assignRoutineToPatient(selectedPatientId, routine.id, newRoutineData as TherapyRoutine);
    if (success) {
      showFeedback(`"${routine.title}" assigned to ${selectedPatient.name}. Reloading routines...`);
      // Muat ulang data rutin untuk pasien yang dipilih untuk menampilkan perubahan
      try {
        const updatedRoutines = await fetchRoutinesForPatient(selectedPatientId); // <--- PANGGIL FUNGSI YANG BENAR
        setPatientList(prevList => prevList.map(p => p.id === selectedPatientId ? {...p, routines: updatedRoutines} : p));
      } catch (error) {
        console.error("Gagal memuat ulang rutin setelah assign:", error);
        showFeedback("Error memuat ulang rutin.");
      }
    } else {
      showFeedback(`Failed to assign routine. It might already be assigned or another issue occurred.`);
    }
  };

  const handleAddNewRoutine = async () => {
    showFeedback("Add new routine template form would open here. (Not implemented)");
  }

  const filteredPatientListForSidebar = useMemo(() => {
    if (!searchTerm) return patientList;
    return patientList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [patientList, searchTerm]);

  const mainContentHeight = "calc(100vh - var(--header-height, 64px))";

  return (
    <div className="flex" style={{ height: mainContentHeight }}>
      {feedbackMessage && (
        <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2.5 rounded-md shadow-lg z-50 transition-opacity duration-300 animate-fadeInOut">
          {feedbackMessage}
        </div>
      )}
      <aside className="w-72 md:w-80 bg-white border-r border-gray-200 p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800 px-1 flex items-center">
                <Users size={20} className="mr-2 text-blue-600"/> Patient List
            </h2>
        </div>
         <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
        </div>
        <div className="flex-grow overflow-y-auto space-y-1 pr-1">
            {isLoadingPatients ? (
                <p className="text-gray-500 text-sm text-center py-4">Loading patients...</p>
            ) : filteredPatientListForSidebar.length > 0 ? (
                filteredPatientListForSidebar.map(patient => (
                <PatientListItem
                    key={patient.id}
                    patient={patient}
                    isSelected={patient.id === selectedPatientId}
                    onSelect={() => setSelectedPatientId(patient.id)}
                />
                ))
            ) : (
                 <p className="text-gray-500 text-sm text-center py-4">No patients found.</p>
            )}
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Therapy Routines</h1>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
              <ListFilter size={16} className="mr-1.5" /> Filter
            </button>
            <button onClick={handleAddNewRoutine} className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 shadow-sm">
              <PlusCircle size={16} className="mr-1.5" /> Add New Routine
            </button>
          </div>
        </div>

        {(isLoadingPatients && !selectedPatientId) && ( // Tampilkan loading jika daftar pasien awal masih dimuat
             <div className="text-center py-10"><p>Loading data...</p></div>
        )}

        {selectedPatient && (
          <>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
              Assigned Routines for: <span className="text-blue-600">{selectedPatient.name}</span>
            </h2>
            {selectedPatient.routines && selectedPatient.routines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {selectedPatient.routines.map(routine => (
                    <AssignedRoutineCard key={routine.id} routine={routine} onEdit={handleEditRoutine} onStart={handleStartRoutine} />
                ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mb-8 p-6 bg-white rounded-lg shadow border border-gray-200">No therapy routines currently assigned to {selectedPatient.name}.</div>
            )}
          </>
        )}
        {!selectedPatientId && !isLoadingPatients && patientList.length > 0 && (
             <div className="text-center py-10 text-gray-500"><p>Please select a patient from the list to view their assigned routines.</p></div>
        )}


        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Recommended Therapy Routines</h2>
          {isLoadingRecommended ? (
             <p className="text-gray-500 text-sm">Loading recommended routines...</p>
          ) : recommendedRoutines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommendedRoutines.map(routine => (
                <RecommendedRoutineCard key={routine.id} routine={routine} onViewDetails={handleViewRecommendedDetails} onAddToPatient={handleAddToPatient}/>
              ))}
            </div>
          ): (
            <div className="text-center text-gray-500 p-6 bg-white rounded-lg shadow border border-gray-200">No recommended routines available at the moment.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TherapyRoutinesPage;