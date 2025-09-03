import React from "react";
import { Button } from "./ui/button";
import { Send, Download, Truck } from "lucide-react";
import { useWalletStore } from "@/stores/useWalletStore";
import { quickActionButton, iconColors } from "../lib/styles";

const QuickActions: React.FC = () => {
  const { setCurrentView } = useWalletStore();

  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        onClick={() => setCurrentView("send")}
        variant="outline"
        className={quickActionButton}
      >
        <Send className={`h-6 w-6 ${iconColors.primary} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
        <p className="text-sm font-medium text-gray-800">Pay PIX</p>
      </Button>

      <Button
        onClick={() => setCurrentView("deposit")}
        variant="outline"
        className={quickActionButton}
      >
        <Download className={`h-6 w-6 ${iconColors.primary} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
        <p className="text-sm font-medium text-gray-800">Receive Couve</p>
      </Button>

      <Button
        onClick={() => window.open("https://kalefarm", "_blank")}
        variant="outline"
        className={quickActionButton}
      >
        <Truck className={`h-6 w-6 ${iconColors.primary} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
        <p className="text-sm font-medium text-gray-800">Farm</p>
      </Button>
    </div>
  );
};

export default QuickActions;
