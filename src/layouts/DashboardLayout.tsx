import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Brain,
  Home,
  Users,
  Calendar,
  Activity,
  AlertTriangle,
  LineChart,
  FileText,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Patient Profiles', path: '/patients' },
    { icon: <Calendar size={20} />, label: 'Session History', path: '/sessions' },
    { icon: <Activity size={20} />, label: 'Therapist Dashboard', path: '/therapist' },
    { icon: <AlertTriangle size={20} />, label: 'Fall Detection', path: '/fall-detection' },
    { icon: <LineChart size={20} />, label: 'Therapy Routines', path: '/therapy-routines' },
    { icon: <FileText size={20} />, label: 'Reports & Analytics', path: '/reports' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar - Tetap */}
      <header className="bg-white border-b border-gray-200 flex justify-between items-center px-4 py-2 fixed top-0 left-0 right-0 z-20 h-16"> {/* Tambahkan fixed, top, left, right, z-index, dan tinggi */}
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded-md mr-2">
            <Brain className="text-white h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">RehabFloor</h1>
        </div>

        <div className="flex items-center">
          <div className="relative mr-4">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <div className="relative mr-2">
            <Bell className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
          </div>
        </div>
      </header>

      {/* Kontainer untuk Sidebar dan Main Content */}
      {/* Tambahkan mt-16 (sesuai tinggi header) untuk menghindari tumpang tindih dengan header fixed */}
      <div className="flex flex-1 mt-16">
        {/* Sidebar Navigation */}
        {/* Atur sidebar agar fixed, dan berikan tinggi penuh dikurangi tinggi header */}
        <aside className="w-56 bg-white border-r border-gray-200 fixed top-16 left-0 bottom-0 z-10 flex flex-col"> {/* Tambahkan fixed, top, left, bottom, z-index, dan flex flex-col */}
          <nav className="mt-4 flex-grow overflow-y-auto"> {/* Tambahkan flex-grow dan overflow-y-auto agar bisa scroll jika item banyak */}
            <ul>
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-gray-700 ${
                        isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-100'
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile at Bottom */}
          {/* Bagian ini akan tetap di bawah sidebar karena sidebar sekarang fixed dan tingginya terdefinisi */}
          <div className="border-t border-gray-200 p-4 bg-white"> {/* Hapus absolute, left, bottom, w-56 karena sudah diatur oleh parent aside */}
            <div className="flex items-center">
              <img
                src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Doctor"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-medium text-sm">{user?.name || 'Dr. Jessica Chen'}</p> {/* Tambahkan fallback jika user null */}
                <p className="text-xs text-gray-500">Physical Therapist</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        {/* Berikan margin kiri seukuran lebar sidebar agar konten utama tidak tertimpa */}
        <main className="flex-1 bg-gray-50 ml-56"> {/* Tambahkan ml-56 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;