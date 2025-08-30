import React from 'react';
import { Button } from './ui/button';
import { Send, Download, Truck } from 'lucide-react';

interface QuickActionsProps {
  onSend: () => void;
  onReceive: () => void;
  onFarm: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSend, onReceive, onFarm }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        onClick={onSend}
        variant="outline"
        className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group h-auto flex-col"
      >
        <Send className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
        <p className="text-sm font-medium text-gray-800">Pay PIX</p>
      </Button>
      
      <Button
        onClick={onReceive}
        variant="outline"
        className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group h-auto flex-col"
      >
        <Download className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
        <p className="text-sm font-medium text-gray-800">Receive Kale</p>
      </Button>
      
      <Button
        onClick={onFarm}
        variant="outline"
        className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group h-auto flex-col"
      >
        <Truck className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
        <p className="text-sm font-medium text-gray-800">Farm</p>
      </Button>
    </div>
  );
};

export default QuickActions;