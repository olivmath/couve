import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';
import { PixKeyType, detectPixKeyType } from '../../lib/pixParser';

export default function PixKeyInputView() {
  const { setCurrentView, handlePixKeySubmit } = useWalletStore();
  const [pixKey, setPixKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [pixKeyType, setPixKeyType] = useState<PixKeyType | null>(null);

  const isValidPixKey = (key: string): boolean => {
    if (!key) return false;
    const cleanKey = key.replace(/[^a-zA-Z0-9@.-]/g, '');
    return cleanKey.length > 0;
  };

  useEffect(() => {
    const isKeyValid = isValidPixKey(pixKey);
    setIsValid(isKeyValid);
    setPixKeyType(isKeyValid ? detectPixKeyType(pixKey) : null);
  }, [pixKey]);

  const handleNext = () => {
    if (isValid && pixKeyType) {
      handlePixKeySubmit(pixKey, pixKeyType);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPixKey(value);
  };

  const getPlaceholder = () => {
    return 'CPF, CNPJ, email, phone or random key';
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
          <h2 className="text-xl font-bold text-gray-800">
            PIX Key
          </h2>
          <div></div>
        </div>

        {/* PIX Key Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter recipient's PIX key
          </label>
          <input
            type="text"
            value={pixKey}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            autoFocus
          />
          
          {pixKey && !isValid && (
            <p className="text-sm text-red-600">
              Invalid PIX key. Check the format.
            </p>
          )}
          
          {isValid && pixKeyType && (
            <p className="text-sm text-green-600 flex items-center">
              ✓ Valid PIX key - Type: {pixKeyType}
            </p>
          )}
        </div>

        {/* Examples */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">PIX key examples:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• CPF: 123.456.789-00</li>
            <li>• Email: user@email.com</li>
            <li>• Phone: 11987654321</li>
            <li>• Random key: 12345-...-456789012</li>
          </ul>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center"
        >
          Next
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}