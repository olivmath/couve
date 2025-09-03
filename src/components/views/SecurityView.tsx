import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useWalletStore } from '../../stores/useWalletStore';
import { useStellarAccount } from '../../lib/useStellarAccount';
import AddressDisplay from '../AddressDisplay';
import copy from 'copy-to-clipboard';

const SecurityView: React.FC = () => {
  const { setCurrentView, networkType } = useWalletStore();
  const { stellarAccount } = useStellarAccount();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);

  const handleCopyPrivateKey = () => {
    if (stellarAccount) {
      copy(stellarAccount.secretKey);
      setCopiedPrivateKey(true);
      setTimeout(() => setCopiedPrivateKey(false), 2000);
    }
  };

  const handleCopyPublicKey = () => {
    if (stellarAccount) {
      copy(stellarAccount.publicKey);
      setCopiedPublicKey(true);
      setTimeout(() => setCopiedPublicKey(false), 2000);
    }
  };

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
          <Shield className="h-6 w-6 text-green-600 mr-2" />
          Segurança
        </h2>
        <div></div>
      </div>

      {/* Security Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-800 mb-2">⚠️ Informações Sensíveis</h3>
        <p className="text-sm text-red-700">
          Suas chaves são extremamente importantes. Nunca compartilhe sua chave privada com ninguém.
          Qualquer pessoa com acesso à sua chave privada pode controlar seus fundos.
        </p>
      </div>

      {stellarAccount && (
        <>
          {/* Public Key Card */}
          <Card className="border-2 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <ExternalLink className="h-5 w-5 text-green-600 mr-2" />
                  Endereço Público
                </h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCopyPublicKey}
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedPublicKey ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Endereço da carteira Stellar:</p>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all overflow-hidden">
                  <span className="break-all overflow-wrap-anywhere">{stellarAccount.publicKey}</span>
                </div>
                <div className="mt-3">
                  <AddressDisplay 
                    address={stellarAccount.publicKey}
                    explorerUrl={`https://stellar.expert/explorer/${networkType === 'mainnet' ? 'public' : 'testnet'}/account/${stellarAccount.publicKey}`}
                    className="text-green-600"
                    showIcons={true}
                  />
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>• Use este endereço para receber KALE e outros ativos Stellar</p>
                <p>• É seguro compartilhar seu endereço público</p>
                <p>• Clique no link para ver no Stellar Expert</p>
              </div>
            </CardContent>
          </Card>

          {/* Private Key Card */}
          <Card className="border-2 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-800 flex items-center">
                  <Shield className="h-5 w-5 text-red-600 mr-2" />
                  Chave Privada
                </h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    {showPrivateKey ? (
                      <><EyeOff className="h-4 w-4 mr-1" />Ocultar</>
                    ) : (
                      <><Eye className="h-4 w-4 mr-1" />Mostrar</>
                    )}
                  </Button>
                  {showPrivateKey && (
                    <Button
                      onClick={handleCopyPrivateKey}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedPrivateKey ? 'Copiado!' : 'Copiar'}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-700 mb-2 font-semibold">
                  ⚠️ NUNCA compartilhe sua chave privada!
                </p>
                
                {showPrivateKey ? (
                  <div className="bg-white p-3 rounded border overflow-hidden">
                    <p className="font-mono text-sm break-all text-red-800 overflow-wrap-anywhere">
                      {stellarAccount.secretKey}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded border overflow-hidden">
                    <p className="font-mono text-sm text-gray-400 break-all overflow-wrap-anywhere">
                      ••••••••••••••••••••••••••••••••••••••••••••••••••••••••
                    </p>
                  </div>
                )}
                
                {copiedPrivateKey && (
                  <p className="text-green-600 text-sm mt-2 font-semibold">✓ Chave privada copiada!</p>
                )}
              </div>
              
              <div className="mt-4 text-xs text-red-600 space-y-1">
                <p>• <strong>CRÍTICO:</strong> Qualquer pessoa com esta chave controla seus fundos</p>
                <p>• <strong>BACKUP:</strong> Anote em local seguro, offline</p>
                <p>• <strong>SEGURANÇA:</strong> Nunca digite em sites suspeitos</p>
                <p>• <strong>PERDA:</strong> Se perder esta chave, perderá acesso aos fundos</p>
              </div>
            </CardContent>
          </Card>


        </>
      )}
    </div>
  );
};

export default SecurityView;