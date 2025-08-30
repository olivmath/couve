import { Card } from './ui/card';

interface KaleInfoProps {
  title?: string;
  description?: string;
}

export const KaleInfo = ({ 
  title = "🥬 About KALE",
  description = "Mineable token on Stellar network • Proof-of-Teamwork • Farm more to gain more purchasing power!"
}: KaleInfoProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white border-0">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm opacity-90">{description}</p>
    </Card>
  );
};