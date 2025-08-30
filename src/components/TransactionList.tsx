import { Leaf, Sprout, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Transaction {
  id: string;
  type: 'pix_sent' | 'harvest';
  amount: number;
  date: string;
  description: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  kaleToBRL: number;
  limit?: number;
}

export const TransactionList = ({ transactions, kaleToBRL, limit = 3 }: TransactionListProps) => {
  const displayTransactions = transactions.slice(0, limit);

  return (
    <Card className="bg-white border-2 border-green-200 rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="font-semibold text-gray-800 flex items-center">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {displayTransactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-green-50">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  tx.type === 'harvest' ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {tx.amount < 0 ? '-' : '+'}R$ {Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};