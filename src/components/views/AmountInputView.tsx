import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react';
import AddressDisplay from '../AddressDisplay';
import { useWalletStore } from '../../stores/useWalletStore';

export default function AmountInputView() {
  const { paymentData, setCurrentView, handleAmountSubmit } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [kaleAmount, setKaleAmount] = useState('0.00');

  // Simular conversão BRL para KALE (taxa fictícia: 1 BRL = 2.381 KALE)
  const brlToKaleRate = 2.381;

  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    const kale = (numericAmount * brlToKaleRate).toFixed(2);
    setKaleAmount(kale);
  }, [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove caracteres não numéricos exceto ponto e vírgula
    value = value.replace(/[^0-9.,]/g, '');
    
    // Substitui vírgula por ponto
    value = value.replace(',', '.');
    
    // Permite apenas um ponto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limita a 2 casas decimais
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    setAmount(value);
  };

  const handleNext = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0) {
      handleAmountSubmit(amount);
    }
  };

  const isValidAmount = parseFloat(amount) > 0;

  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentView('pix_key_input')}
            className="justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 text-green-600 font-medium flex items-center p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            Valor do Pagamento
          </h2>
          <div></div>
        </div>

        {/* Recipient Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Destinatário
          </label>
          <p className="text-lg font-semibold text-gray-800">
            <AddressDisplay 
              address={paymentData?.pixKey || ''} 
              showIcons={true}
            />
          </p>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Valor em BRL
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-semibold text-gray-500">
              R$
            </span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0,00"
              className="w-full pl-12 pr-4 py-4 text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              autoFocus
            />
          </div>
          
          {isValidAmount && (
            <p className="text-sm text-gray-600 flex items-center">
              <Leaf className="h-4 w-4 text-green-500 mr-1" />
              Será colhido: {kaleAmount} KALE
            </p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {['10', '25', '50', '100', '200', '500'].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              className="py-3 px-4 border-2 border-gray-300 rounded-lg text-lg font-medium hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              R$ {quickAmount}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!isValidAmount}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center"
        >
          Próximo
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}