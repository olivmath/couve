import { ArrowRight, Leaf, Sprout, Send, QrCode, Clipboard, Keyboard } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ViewType } from '../../hooks/useWallet';

interface SendViewProps {
  pixAmount: string;
  pixKey: string;
  balance: number;
  kaleToBRL: number;
  isProcessing: boolean;
  onPixAmountChange: (value: string) => void;
  onPixKeyChange: (value: string) => void;
  onSendPIX: () => void;
  onNavigate: (view: ViewType) => void;
  canSend: boolean;
}

export const SendView = ({
  pixAmount,
  pixKey,
  balance,
  kaleToBRL,
  isProcessing,
  onPixAmountChange,
  onPixKeyChange,
  onSendPIX,
  onNavigate,
  canSend
}: SendViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={() => onNavigate('home')}
          variant="ghost"
          className="text-green-600 font-medium flex items-center p-0"
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Leaf className="h-6 w-6 text-green-600 mr-2" />
          Pay with KALE
        </h2>
        <div></div>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Sprout className="h-5 w-5 text-green-600" />
          <p className="font-semibold text-green-800">Instant cultivated payment</p>
        </div>
        <p className="text-green-700 text-sm">Current rate: 1 KALE = R$ {kaleToBRL.toFixed(2)} 🌱</p>
      </Card>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount in BRL</label>
        <input
          type="number"
          value={pixAmount}
          onChange={(e) => onPixAmountChange(e.target.value)}
          placeholder="0.00"
          className="w-full p-4 text-2xl font-semibold border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {pixAmount && (
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <Leaf className="h-4 w-4 text-green-500 mr-1" />
            Will be harvested: {(parseFloat(pixAmount) / kaleToBRL).toFixed(2)} KALE
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Recipient's PIX Key</label>
        
        {/* PIX Input Options */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center p-3 h-auto border-2 border-green-300 hover:bg-green-50"
            onClick={() => alert('QR Code scanner would open here')}
          >
            <QrCode className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-xs">Scan QR</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center p-3 h-auto border-2 border-green-300 hover:bg-green-50"
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                onPixKeyChange(text);
              } catch (err) {
                alert('Unable to read clipboard');
              }
            }}
          >
            <Clipboard className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-xs">Paste</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center p-3 h-auto border-2 border-green-300 hover:bg-green-50"
            onClick={() => document.getElementById('pix-input')?.focus()}
          >
            <Keyboard className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-xs">Type</span>
          </Button>
        </div>
        
        <input
          id="pix-input"
          type="text"
          value={pixKey}
          onChange={(e) => onPixKeyChange(e.target.value)}
          placeholder="CPF, email, phone or random key"
          className="w-full p-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <Button
        onClick={onSendPIX}
        disabled={!canSend || isProcessing}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Sprout className="animate-spin h-5 w-5 mr-2" />
            Cultivating payment...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Pay R$ {pixAmount || '0.00'}
          </>
        )}
      </Button>

      {!canSend && pixAmount && pixKey && (
        <Card className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center">🚫 Insufficient KALE for this harvest</p>
        </Card>
      )}
    </div>
  );
};