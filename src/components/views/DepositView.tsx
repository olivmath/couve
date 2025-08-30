import { ArrowRight, Truck, Sprout, QrCode, Leaf } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ViewType } from '../../hooks/useWallet';

interface DepositViewProps {
  onNavigate: (view: ViewType) => void;
}

export const DepositView = ({ onNavigate }: DepositViewProps) => {
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
          <Truck className="h-6 w-6 text-green-600 mr-2" />
          Cultivate KALE
        </h2>
        <div></div>
      </div>

      <Card className="bg-gradient-to-r from-yellow-50 to-green-50 border-2 border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2 flex items-center">
          <Sprout className="h-5 w-5 mr-2" />
          🚜 Send KALE to your farm
        </h3>
        <p className="text-green-700 text-sm">Deposit mined KALE to use with PIX in Brazil</p>
      </Card>

      <Card className="bg-white border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
        <div className="bg-green-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <QrCode className="h-12 w-12 text-green-600" />
        </div>
        <p className="font-semibold text-gray-800 mb-2">KALE Farm Address</p>
        <div className="bg-green-50 border border-green-200 p-3 rounded text-xs font-mono break-all mb-4">
          GCKFBEIYTKP74Q7T7IVLSTLC6JGDTZXXHZGLXXUAMXWL4VYZJSJK2024
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Asset:</strong> KALE 🥬</p>
          <p><strong>Issuer:</strong> GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE</p>
          <p><strong>Memo:</strong> FARMER123456</p>
        </div>
      </Card>

      <Card className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <p className="text-yellow-800 text-sm flex items-center">
          <Leaf className="h-4 w-4 mr-2" />
          <strong>🌱 Farmer's Tip:</strong> Always include the memo to identify your harvest!
        </p>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-2">🎮 Want to mine KALE?</h4>
        <p className="text-purple-700 text-sm mb-3">
          Visit <strong>kalefarm.xyz</strong> to start farming KALE on the Stellar network!
        </p>
        <Button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
          Go to KaleFarm 🚜
        </Button>
      </Card>
    </div>
  );
};