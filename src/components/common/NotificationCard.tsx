import { AlertTriangle, Activity, Calendar } from 'lucide-react';
import { Notification } from '../../data/mockData';

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Fall':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'Progress':
        return <Activity className="h-6 w-6 text-green-500" />;
      case 'Therapy':
        return <Calendar className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'Fall':
        return <span className="badge-fall">Fall</span>;
      case 'Progress':
        return <span className="badge-progress">Progress</span>;
      case 'Therapy':
        return <span className="badge-therapy">Therapy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">{notification.type} Detected</h3>
            {getNotificationBadge(notification.type)}
          </div>
          <p className="text-gray-600 mt-1">{notification.message}</p>
          <p className="text-gray-500 text-sm mt-2">{notification.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;