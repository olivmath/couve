import { Sprout, Truck } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ViewType } from '../../hooks/useWallet';

interface SuccessViewProps {
  pixAmount: string;
  kaleToBRL: number;
  onNavigate: (view: ViewType) => void;
}

export const SuccessView = ({ pixAmount, kaleToBRL, onNavigate }: SuccessViewProps) => {
  return (
    <div className="space-y-6 text-center py-8">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">🎉 PIX cultivated successfully!</h3>
        <p className="text-green-700">
          R$ {pixAmount} was paid using {(parseFloat(pixAmount) / kaleToBRL).toFixed(2)} fresh KALE!
        </p>
        <Card className="bg-white/50 rounded-lg p-3 mt-4 border-0">
          <p className="text-green-600 text-sm">🌱 Your farm keeps growing...</p>
        </Card>
      </Card>

      <Button
        onClick={() => onNavigate('home')}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center"
      >
        <Truck className="h-5 w-5 mr-2" />
        Back to Farm
      </Button>
    </div>
  );
};