import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../data/mockData';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'badge-stable';
      case 'Improving':
        return 'badge-improving';
      case 'Requires Attention':
        return 'badge-attention';
      default:
        return 'badge-stable';
    }
  };
  
  const getProgressBarClass = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'progress-bar-stable';
      case 'Improving':
        return 'progress-bar-improving';
      case 'Requires Attention':
        return 'progress-bar-attention';
      default:
        return 'progress-bar-stable';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 ${isHovered ? 'shadow-md transform -translate-y-1' : 'shadow-sm'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/patients/${patient.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <img 
            src={patient.image} 
            alt={patient.name} 
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-semibold text-lg">{patient.name}</h3>
            <p className="text-gray-600 text-sm">{patient.age} years - {patient.diagnosis}</p>
            <div className="mt-1">
              <span className={getStatusClass(patient.status)}>{patient.status}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Therapy Progress</span>
            <span className="text-sm font-medium text-gray-700">{patient.progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className={getProgressBarClass(patient.status)}
              style={{ width: `${patient.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <span>Last Session: {patient.lastSession}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;