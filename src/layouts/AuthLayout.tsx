import { Outlet } from 'react-router-dom';
import { Brain } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen wave-background flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-600 p-4 rounded-lg">
              <Brain className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold ml-3">RehabFloor</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;