import { ArrowRight, History, Sprout, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useWalletStore } from '../../stores/useWalletStore';

export const HistoryView = () => {
  const { transactions, kaleToBRL, setCurrentView } = useWalletStore();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={() => setCurrentView('home')}
          variant="ghost"
          className="text-green-600 font-medium flex items-center p-0"
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <History className="h-6 w-6 text-green-600 mr-2" />
          Harvest History
        </h2>
        <div></div>
      </div>

      <div className="space-y-3">
        {transactions.map(tx => (
          <Card key={tx.id} className="bg-white border-2 border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'harvest' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {tx.type === 'harvest' ? 
                    <Sprout className="h-5 w-5 text-green-600" /> : 
                    <Send className="h-5 w-5 text-orange-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-800">{tx.description}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {tx.amount < 0 ? '-' : '+'}R$ {Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">
                  {tx.type === 'pix_sent' ? '💳 PIX sent' : 
                  tx.type === 'harvest' ? '🌱 KALE Harvest' : 'Transaction'}
                </p>
              {tx.type === 'pix_sent' && (
                <p className="text-gray-400">
                  ~{(Math.abs(tx.amount) / kaleToBRL).toFixed(0)} KALE used
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;