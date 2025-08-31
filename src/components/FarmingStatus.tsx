import { Truck } from 'lucide-react';
import { Card } from './ui/card';

interface FarmingStatusProps {
  status?: string;
  nextHarvest?: string;
}

export const FarmingStatus = ({ 
  status = "Planting...", 
  nextHarvest = "next harvest in 2h" 
}: FarmingStatusProps) => {
  return (
    <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-white border-0">
      <div className="flex items-center space-x-3">
        <Truck className="h-6 w-6" />
        <div>
          <p className="font-semibold">Farm Status</p>
          <p className="text-sm opacity-90">🌱 {status} {nextHarvest}</p>
        </div>
      </div>
    </Card>
  );
};