import React from 'react';
import { useUser, SignIn, SignUp, UserButton } from '@stackframe/stack';
import { useWalletStore } from '../../stores/useWalletStore';

interface AuthViewProps {
  mode?: 'signin' | 'signup';
}

const AuthView: React.FC<AuthViewProps> = ({ mode = 'signin' }) => {
  const user = useUser();
  const { navigateToView } = useWalletStore();

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Bem-vindo!</h2>
          <p className="text-gray-600">Você já está logado.</p>
        </div>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Kale Wallet</h1>
          <p className="text-gray-600">
            {mode === 'signin' ? 'Entre na sua conta' : 'Crie sua conta'}
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
              Não tem uma conta?{' '}
              <button
                onClick={() => navigateToView('signup' as any)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Cadastre-se
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={() => navigateToView('signin' as any)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Entre
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;