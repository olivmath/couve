import React, { useState, useEffect } from 'react';
import { Sprout, Send, QrCode, Leaf, ArrowRight, Plus, History, Tractor } from 'lucide-react';

const KALEPIXWallet = () => {
  const [balance, setBalance] = useState(1247.89); // KALE balance
  const [pixAmount, setPixAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'send', 'deposit', 'history'
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

  // Taxa de conversão KALE -> BRL (simulada)
  const kaleToBRL = 0.42; // KALE é mais volátil, preço menor

  const transactions = [
    { id: '1', type: 'pix_sent', amount: -21.00, date: '2025-08-28', description: 'Mercado Orgânico Verde' },
    { id: '2', type: 'pix_sent', amount: -8.40, date: '2025-08-27', description: 'Feira do Produtor' },
    { id: '3', type: 'harvest', amount: 500.00, date: '2025-08-26', description: 'Harvest Reward' },
    { id: '4', type: 'pix_sent', amount: -6.30, date: '2025-08-26', description: 'Loja de Sementes' }
  ];

  const handleSendPIX = () => {
    if (!pixAmount || !pixKey) return;
    
    setIsProcessing(true);
    
    // Simular processamento PIX
    setTimeout(() => {
      const kaleAmount = parseFloat(pixAmount) / kaleToBRL;
      setBalance(balance - kaleAmount);
      setIsProcessing(false);
      setCurrentView('success');
      setPixAmount('');
      setPixKey('');
    }, 2000);
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Balance Card com tema KALE */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Leaf className="h-32 w-32 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-100 text-sm flex items-center">
                <Sprout className="h-4 w-4 mr-1" />
                Saldo Cultivado
              </p>
              <p className="text-3xl font-bold">{balance.toFixed(2)} KALE</p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <Leaf className="h-6 w-6 text-green-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-green-100 text-sm">Poder de compra em BRL</p>
            <p className="text-xl font-semibold">R$ {(balance * kaleToBRL).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Farming Status */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-white">
        <div className="flex items-center space-x-3">
          <Tractor className="h-6 w-6" />
          <div>
            <p className="font-semibold">Status da Fazenda</p>
            <p className="text-sm opacity-90">🌱 Plantando... próxima colheita em 2h</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('send')}
          className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group"
        >
          <Send className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-800">Pagar PIX</p>
        </button>
        
        <button
          onClick={() => setCurrentView('deposit')}
          className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group"
        >
          <Plus className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-800">Cultivar</p>
        </button>
        
        <button
          onClick={() => setCurrentView('history')}
          className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group"
        >
          <History className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-800">Colheitas</p>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border-2 border-green-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          Atividades recentes
        </h3>
        <div className="space-y-3">
          {transactions.slice(0, 3).map(tx => (
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
      </div>

      {/* KALE Info */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
        <h4 className="font-semibold mb-2">🥬 Sobre o KALE</h4>
        <p className="text-sm opacity-90">
          Token minerável da rede Stellar • Proof-of-Teamwork • Farm mais para ganhar mais poder de compra!
        </p>
      </div>
    </div>
  );

  const renderSend = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentView('home')}
          className="text-green-600 font-medium flex items-center"
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
          Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Leaf className="h-6 w-6 text-green-600 mr-2" />
          Pagar com KALE
        </h2>
        <div></div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Sprout className="h-5 w-5 text-green-600" />
          <p className="font-semibold text-green-800">Pagamento instantâneo cultivado</p>
        </div>
        <p className="text-green-700 text-sm">Taxa atual: 1 KALE = R$ {kaleToBRL.toFixed(2)} 🌱</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Valor em BRL</label>
        <input
          type="number"
          value={pixAmount}
          onChange={(e) => setPixAmount(e.target.value)}
          placeholder="0,00"
          className="w-full p-4 text-2xl font-semibold border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {pixAmount && (
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <Leaf className="h-4 w-4 text-green-500 mr-1" />
            Será colhido: {(parseFloat(pixAmount) / kaleToBRL).toFixed(2)} KALE
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chave PIX do destinatário</label>
        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder="CPF, email, telefone ou chave aleatória"
          className="w-full p-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <button
        onClick={handleSendPIX}
        disabled={!pixAmount || !pixKey || isProcessing || parseFloat(pixAmount) / kaleToBRL > balance}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Sprout className="animate-spin h-5 w-5 mr-2" />
            Cultivando pagamento...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Pagar R$ {pixAmount || '0,00'}
          </>
        )}
      </button>

      {parseFloat(pixAmount) / kaleToBRL > balance && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center">🚫 KALE insuficiente para esta colheita</p>
        </div>
      )}
    </div>
  );

  const renderDeposit = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentView('home')}
          className="text-green-600 font-medium flex items-center"
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
          Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Tractor className="h-6 w-6 text-green-600 mr-2" />
          Cultivar KALE
        </h2>
        <div></div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-green-50 border-2 border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2 flex items-center">
          <Sprout className="h-5 w-5 mr-2" />
          🚜 Envie KALE para sua fazenda
        </h3>
        <p className="text-green-700 text-sm">Deposite KALE minerado para usar com PIX no Brasil</p>
      </div>

      <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
        <div className="bg-green-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <QrCode className="h-12 w-12 text-green-600" />
        </div>
        <p className="font-semibold text-gray-800 mb-2">Endereço da Fazenda KALE</p>
        <div className="bg-green-50 border border-green-200 p-3 rounded text-xs font-mono break-all mb-4">
          GCKFBEIYTKP74Q7T7IVLSTLC6JGDTZXXHZGLXXUAMXWL4VYZJSJK2024
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Asset:</strong> KALE 🥬</p>
          <p><strong>Issuer:</strong> GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE</p>
          <p><strong>Memo:</strong> FARMER123456</p>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <p className="text-yellow-800 text-sm flex items-center">
          <Leaf className="h-4 w-4 mr-2" />
          <strong>🌱 Dica de Fazendeiro:</strong> Sempre inclua o memo para identificar sua colheita!
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-2">🎮 Quer minerar KALE?</h4>
        <p className="text-purple-700 text-sm mb-3">
          Visite <strong>kalefarm.xyz</strong> para começar a farmar KALE na rede Stellar!
        </p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
          Ir para KaleFarm 🚜
        </button>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentView('home')}
          className="text-green-600 font-medium flex items-center"
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
          Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <History className="h-6 w-6 text-green-600 mr-2" />
          Histórico de Colheitas
        </h2>
        <div></div>
      </div>

      <div className="space-y-3">
        {transactions.map(tx => (
          <div key={tx.id} className="bg-white border-2 border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
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
                {tx.type === 'pix_sent' ? '💳 PIX enviado' : 
                 tx.type === 'harvest' ? '🌱 Colheita KALE' : 'Transação'}
              </p>
              {tx.type === 'pix_sent' && (
                <p className="text-gray-400">
                  ~{(Math.abs(tx.amount) / kaleToBRL).toFixed(0)} KALE usado
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center py-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">🎉 PIX cultivado com sucesso!</h3>
        <p className="text-green-700">
          R$ {pixAmount} foram pagos usando {(parseFloat(pixAmount) / kaleToBRL).toFixed(2)} KALE fresquinho!
        </p>
        <div className="bg-white/50 rounded-lg p-3 mt-4">
          <p className="text-green-600 text-sm">🌱 Sua fazenda continua crescendo...</p>
        </div>
      </div>

      <button
        onClick={() => setCurrentView('home')}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center"
      >
        <Tractor className="h-5 w-5 mr-2" />
        Voltar à Fazenda
      </button>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Header com tema KALE */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg p-4">
        <div className="flex items-center justify-center text-white">
          <Leaf className="h-6 w-6 mr-2" />
          <h1 className="text-lg font-bold">KALE Farmer Wallet</h1>
          <Sprout className="h-6 w-6 ml-2" />
        </div>
        <p className="text-green-100 text-center text-sm mt-1">Cultivando o futuro dos pagamentos 🥬</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {currentView === 'home' && renderHome()}
        {currentView === 'send' && renderSend()}
        {currentView === 'deposit' && renderDeposit()}
        {currentView === 'history' && renderHistory()}
        {currentView === 'success' && renderSuccess()}
      </div>

      <div className="p-4 text-center text-xs text-gray-500">
        <p>🥬 Demo KALE Farmer Wallet</p>
        <p>Powered by Stellar • Proof-of-Teamwork</p>
      </div>
    </div>
  );
};

export default KALEPIXWallet;