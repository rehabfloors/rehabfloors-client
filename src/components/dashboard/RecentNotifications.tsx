// src/components/dashboard/RecentNotifications.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../data/mockData'; // Pastikan tipe Notification diimpor
import NotificationCard from '../common/NotificationCard';
import { ChevronRight } from 'lucide-react';

interface RecentNotificationsProps {
  notifications: Notification[];
  isLoading: boolean;
}

const RecentNotifications: React.FC<RecentNotificationsProps> = ({ notifications, isLoading }) => {
  const navigate = useNavigate();

  // Pastikan Anda memiliki route /notifications jika tombol "View all" akan digunakan
  const handleViewAllClick = () => {
    // navigate('/notifications');
    alert("Navigasi ke halaman semua notifikasi belum diimplementasikan.");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Notifications</h2>
        <button
          onClick={handleViewAllClick}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading && <p className="text-gray-500 text-center py-4">Loading notifications...</p>}
      {!isLoading && notifications.length === 0 && (
        <p className="text-gray-500 text-center py-4">No recent notifications.</p>
      )}
      {!isLoading && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentNotifications;