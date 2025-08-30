import React from 'react';
import { ArrowLeft, QrCode, Clipboard, Keyboard, Leaf } from 'lucide-react';
import { ViewType } from '../../hooks/useWallet';

interface SendViewProps {
  balance: number;
  kaleToBRL: number;
  onNavigate: (view: ViewType) => void;
  startQRScan: () => void;
  startPixKeyInput: () => void;
  handlePastePixKey: () => void;
}

export function SendView({
  balance,
  kaleToBRL,
  onNavigate,
  startQRScan,
  startPixKeyInput,
  handlePastePixKey
}: SendViewProps) {
  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 text-green-600 font-medium flex items-center p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Leaf className="h-6 w-6 text-green-600 mr-2" />
            Pay with KALE
          </h2>
          <div></div>
        </div>

        {/* Balance Info */}
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Saldo disponível</p>
          <p className="text-2xl font-bold text-green-600">
            {balance.toFixed(2)} KALE
          </p>
          <p className="text-sm text-gray-500">
            ≈ R$ {(balance * kaleToBRL).toFixed(2)}
          </p>
        </div>

        {/* PIX Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Como você quer pagar?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={startQRScan}
              className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:text-accent-foreground rounded-md flex flex-col items-center p-3 h-auto border-2 transition-colors border-green-300 hover:bg-green-50"
            >
              <QrCode className="h-5 w-5 mb-1" />
              <span className="text-xs">Scan QR</span>
            </button>
            
            <button
              onClick={handlePastePixKey}
              className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:text-accent-foreground rounded-md flex flex-col items-center p-3 h-auto border-2 transition-colors border-green-300 hover:bg-green-50"
            >
              <Clipboard className="h-5 w-5 mb-1" />
              <span className="text-xs">Paste</span>
            </button>
            
            <button
              onClick={startPixKeyInput}
              className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:text-accent-foreground rounded-md flex flex-col items-center p-3 h-auto border-2 transition-colors border-green-300 hover:bg-green-50"
            >
              <Keyboard className="h-5 w-5 mb-1" />
              <span className="text-xs">Type</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Como funciona:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Scan QR:</strong> Escaneie um QR Code PIX</li>
            <li>• <strong>Paste:</strong> Cole uma chave PIX da área de transferência</li>
            <li>• <strong>Type:</strong> Digite manualmente a chave PIX</li>
          </ul>
        </div>
      </div>
    </div>
  );
}