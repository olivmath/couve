import React from 'react';
import { useUser, SignIn, SignUp, UserButton } from '@stackframe/stack';
import { useWalletStore } from '../../stores/useWalletStore';

interface AuthViewProps {
  mode?: 'signin' | 'signup';
}

const AuthView: React.FC<AuthViewProps> = ({ mode = 'signin' }) => {
  const user = useUser();
  const { navigateToView } = useWalletStore();

  // Redirect to home when user is authenticated
  React.useEffect(() => {
    if (user) {
      navigateToView('home');
    }
  }, [user, navigateToView]);

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Welcome!</h2>
          <p className="text-gray-600">Redirecting to your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Couve 🥬</h1>
          <p className="text-gray-600">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Formulário de autenticação */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {mode === 'signin' ? (
            <SignIn />
          ) : (
            <SignUp />
          )}
        </div>

        {/* Link para alternar entre login/signup */}
        <div className="text-center mt-6">
          {mode === 'signin' ? (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigateToView('signup')}
                className="text-green-600 hover:text-green-800 font-medium underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigateToView('signin')}
                className="text-green-600 hover:text-green-800 font-medium underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;