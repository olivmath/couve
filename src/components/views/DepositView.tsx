import { ArrowRight, Truck, Sprout, Leaf } from "lucide-react";
import { Button } from "../ui/button";
import AddressQRCode from "../AddressQRCode";
import AddressDisplay from "../AddressDisplay";
import { useWalletStore } from "../../stores/useWalletStore";

export const DepositView = () => {
  const { setCurrentView } = useWalletStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={() => setCurrentView("home")}
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

      <AddressQRCode 
        address="GCKFBEIYTKP74Q7T7IVLSTLC6JGDTZXXHZGLXXUAMXWL4VYZJSJK2024"
        title="KALE Farm Address"
        explorerUrl="https://stellar.expert/explorer/public/account/GCKFBEIYTKP74Q7T7IVLSTLC6JGDTZXXHZGLXXUAMXWL4VYZJSJK2024"
      />
      <div className="text-sm text-gray-600 space-y-1 bg-white p-4 rounded-lg border border-green-200">
        <p>
          <strong>Asset:</strong> KALE 🥬
        </p>
        <p className="flex items-center justify-between">
          <strong>Issuer:</strong>
          <AddressDisplay 
            address="GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE" 
            explorerUrl="https://stellar.expert/explorer/public/account/GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE"
          />
        </p>
        <p>
          <strong>Memo:</strong> FARMER123456
        </p>
      </div>
    </div>
  );
};

export default DepositView;