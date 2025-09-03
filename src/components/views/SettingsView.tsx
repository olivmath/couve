import React from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useWalletStore, NetworkType } from '../../stores/useWalletStore';
import { getKaleConfig } from '../../lib/kaleConfig';

const SettingsView: React.FC = () => {
  const { setCurrentView, networkType, setNetworkType } = useWalletStore();
  const kaleConfig = getKaleConfig(networkType);

  const handleNetworkChange = (network: NetworkType) => {
    setNetworkType(network);
  };

  const getNetworkInfo = () => {
    if (networkType === 'mainnet') {
      return {
        name: 'Stellar Mainnet',
        server: 'horizon.stellar.org',
        warnings: [
          '• Esta é a rede principal - fundos têm valor real',
          '• Transações são permanentes e irreversíveis',
          '• Use com cuidado em produção'
        ],
        color: 'blue'
      };
    } else {
      return {
        name: 'Stellar Testnet',
        server: 'horizon-testnet.stellar.org',
        warnings: [
          '• Esta é a rede de teste - fundos não têm valor real',
          '• Use para desenvolvimento e testes',
          '• Fundos podem ser obtidos gratuitamente via faucet'
        ],
        color: 'orange'
      };
    }
  };

  const networkInfo = getNetworkInfo();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => setCurrentView("profile")}
          variant="ghost"
          className="text-green-600 font-medium flex items-center p-0"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Globe className="h-6 w-6 text-green-600 mr-2" />
          Configurações
        </h2>
        <div></div>
      </div>

      {/* Network Configuration */}
      <Card className="border-2 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Configuração de Rede
            </h3>
          </div>

          {/* Network Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Selecionar Rede:
            </label>
            <div className="flex space-x-2">
              <Button
                variant={networkType === 'testnet' ? 'default' : 'outline'}
                onClick={() => handleNetworkChange('testnet')}
                className={networkType === 'testnet' 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
                }
              >
                Testnet
              </Button>
              <Button
                variant={networkType === 'mainnet' ? 'default' : 'outline'}
                onClick={() => handleNetworkChange('mainnet')}
                className={networkType === 'mainnet' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }
              >
                Mainnet
              </Button>
            </div>
          </div>

          {/* Network Information */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Rede Ativa:</span>
              <span className={`text-sm font-semibold text-${networkInfo.color}-600`}>
                {networkInfo.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Horizon Server:</span>
              <span className={`text-sm text-${networkInfo.color}-600 font-mono text-xs`}>
                {networkInfo.server}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Asset KALE:</span>
                <span className="text-xs text-green-600 font-semibold font-mono break-all">
                  {kaleConfig.ISSUER}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Contract:</span>
                <span className="text-xs text-blue-600 font-semibold font-mono break-all">
                  {kaleConfig.CONTRACT}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">SAC:</span>
                <span className="text-xs text-purple-600 font-semibold font-mono break-all">
                  {kaleConfig.SAC}
                </span>
              </div>
            </div>
          </div>

          {/* Network Warnings */}
          <div className={`mt-4 text-xs text-${networkInfo.color}-600`}>
            {networkInfo.warnings.map((warning, index) => (
              <p key={index}>{warning}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;