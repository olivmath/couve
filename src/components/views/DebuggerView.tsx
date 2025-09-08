import React from 'react';
import { ArrowLeft, Bug } from 'lucide-react';
import { Button } from '../ui/button';
import { useWalletStore } from '../../stores/useWalletStore';
import PriceDebugger from '../PriceDebugger';

const DebuggerView: React.FC = () => {
  const { navigateToView } = useWalletStore();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigateToView('profile')}
          variant="ghost"
          className="text-green-600 font-medium flex items-center p-0"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Bug className="h-6 w-6 text-red-600 mr-2" />
          Debugger
        </h2>
        <div></div>
      </div>

      {/* Description */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">🔧 Ferramenta de Debug</h3>
        <p className="text-sm text-yellow-700">
          This tool allows real-time monitoring of KALE prices and testing 
          price services to identify connectivity issues or invalid data.
        </p>
      </div>

      {/* Price Debugger Component */}
      <PriceDebugger />

      {/* Additional Debug Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">ℹ️ Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Test Services:</strong> Testa conectividade com APIs externas</p>
          <p>• <strong>Update Prices:</strong> Forces manual price update</p>
          <p>• <strong>Store Values:</strong> Valores atuais armazenados no estado</p>
          <p>• <strong>Debug Results:</strong> Resultados detalhados dos testes</p>
        </div>
      </div>
    </div>
  );
};

export default DebuggerView;