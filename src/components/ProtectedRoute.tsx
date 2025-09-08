import React from 'react';
import { useUser } from '@stackframe/stack';
import { useWalletStore } from '../stores/useWalletStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const user = useUser();
  const { navigateToView } = useWalletStore();

  React.useEffect(() => {
    if (!user) {
      navigateToView('signin');
    }
  }, [user, navigateToView]);

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;