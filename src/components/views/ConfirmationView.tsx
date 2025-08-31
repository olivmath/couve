import React, { useState } from 'react';
import { ArrowLeft, Send, Eye, EyeOff } from 'lucide-react';
import AddressDisplay from '../AddressDisplay';
import { useWalletStore } from '../../stores/useWalletStore';

export default function ConfirmationView() {
  const { paymentData, setCurrentView, handleSendPIX } = useWalletStore();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setShowPasswordInput(true);
  };

  const handlePasswordSubmit = async () => {
    if (password.length < 4) {
      alert('Senha deve ter pelo menos 4 dígitos');
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento
    setTimeout(() => {
      setIsProcessing(false);
      handleSendPIX();
    }, 2000);
  };

  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentView('send')}
            className="justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 text-green-600 font-medium flex items-center p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            Confirmar Pagamento
          </h2>
          <div></div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Destinatário {paymentData?.recipientName}
            </label>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                 {paymentData?.pixKeyType === 'CPF' ? 'CPF' :
                  paymentData?.pixKeyType === 'CNPJ' ? 'CNPJ' :
                  paymentData?.pixKeyType === 'EMAIL' ? 'E-mail' :
                  paymentData?.pixKeyType === 'PHONE' ? 'Telefone' :
                  paymentData?.pixKeyType === 'UUID' ? 'Chave Aleatória' : 'Desconhecido'}
               </span>
             </div>
            <p className="text-lg font-semibold text-gray-800">
              {paymentData?.pixKey}
            </p>
            {paymentData?.recipientName && (
              <p className="text-sm text-gray-500 mt-1">
                <AddressDisplay 
                  address={paymentData?.pixKey || ''} 
                  showIcons={true}
                />
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Valor
            </label>
            <p className="text-2xl font-bold text-green-600">
              R$ {paymentData?.amount || '0'}
            </p>
          </div>
        </div>

        {/* Password Input */}
        {showPasswordInput && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Digite sua senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12"
                maxLength={6}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!showPasswordInput ? (
            <button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Confirmar Pagamento
            </button>
          ) : (
            <button
              onClick={handlePasswordSubmit}
              disabled={password.length < 4 || isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Pagamento
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}