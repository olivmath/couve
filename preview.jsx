import React, { useState, useEffect } from 'react';
import { Sprout, Send, QrCode, Leaf, ArrowRight, Plus, History, Tractor, Home, User, Receipt } from 'lucide-react';

const KALEPIXWallet = () => {
  const [balance, setBalance] = useState(7998.90); // KALE balance
  const [pixAmount, setPixAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'send', 'receive', 'farm', 'statement', 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Taxa de conversão KALE -> BRL (simulada)
  const kaleToBRL = 0.42;

  // Meridian Side Events Banner
  const sideEvents = [
    {
      title: "Stellar Dev Workshop",
      date: "Dec 2, 2024",
      time: "2:00 PM",
      emoji: "👨‍💻"
    },
    {
      title: "DeFi on Stellar Panel",
      date: "Dec 3, 2024", 
      time: "4:30 PM",
      emoji: "🚀"
    },
    {
      title: "KALE Community Meetup",
      date: "Dec 4, 2024",
      time: "6:00 PM", 
      emoji: "🥬"
    },
    {
      title: "Soroban Smart Contracts",
      date: "Dec 5, 2024",
      time: "10:00 AM",
      emoji: "⚡"
    }
  ];

  const transactions = [
    { id: '1', type: 'pix_sent', amount: -21.00, date: '2025-08-28', description: 'Organic Market' },
    { id: '2', type: 'pix_sent', amount: -8.40, date: '2025-08-27', description: 'Uber Ride' },
    { id: '3', type: 'harvest', amount: 500.00, date: '2025-08-26', description: 'Harvest Reward' },
    { id: '4', type: 'pix_sent', amount: -6.30, date: '2025-08-26', description: 'Coffee Shop' }
  ];

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % sideEvents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendPIX = () => {
    if (!pixAmount || !pixKey) return;
    
    setIsProcessing(true);
    
    // Simulate PIX processing
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
      {/* Credit Card Style Balance */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 opacity-10">
          <Leaf className="h-32 w-32 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-green-100 text-sm">Available Balance</p>
              <p className="text-4xl font-bold">R$ {(balance * kaleToBRL).toFixed(2)} 🇧🇷</p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <Leaf className="h-6 w-6 text-green-200" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-green-200 text-sm">{balance.toFixed(2)} $KALE</p>
              <p className="text-green-100 text-xs">Farmer Balance</p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-xs">KALE CARD</p>
              <p className="text-green-200 text-sm font-mono">**** 2024</p>
            </div>
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
          <p className="text-sm font-medium text-gray-800">Pay PIX</p>
        </button>
        
        <button
          onClick={() => setCurrentView('receive')}
          className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group"
        >
          <Plus className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-800">Receive Kale</p>
        </button>
        
        <button
          onClick={() => setCurrentView('farm')}
          className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group"
        >
          <Tractor className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-800">Farm</p>
        </button>
      </div>

      {/* Meridian Side Events Carousel */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm">Meridian Week Side Events</h4>
          <div className="flex space-x-1">
            {sideEvents.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentBannerIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="transition-all duration-500 ease-in-out">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{sideEvents[currentBannerIndex].emoji}</span>
            <div>
              <p className="font-semibold text-sm">{sideEvents[currentBannerIndex].title}</p>
              <p className="text-xs opacity-90">
                {sideEvents[currentBannerIndex].date} • {sideEvents[currentBannerIndex].time}
              </p>
            </div>
          </div>
        </div>
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
          Back
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Leaf className="h-6 w-6 text-green-600 mr-2" />
          Pay with KALE
        </h2>
        <div></div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Sprout className="h-5 w-5 text-green-600" />
          <p className="font-semibold text-green-800">Instant cultivated payment</p>
        </div>
        <p className="text-green-700 text-sm">Current rate: 1 KALE = R$ {kaleToBRL.toFixed(2)} 🌱</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount in BRL</label>
        <input
          type="number"
          value={pixAmount}
          onChange={(e) => setPixAmount(e.target.value)}
          placeholder="0.00"
          className="w-full p-4 text-2xl font-semibold border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {pixAmount && (
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <Leaf className="h-4 w-4 text-green-500 mr-1" />
            Will harvest: {(parseFloat(pixAmount) / kaleToBRL).toFixed(2)} KALE
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient PIX Key</label>
        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder="CPF, email, phone or random key"
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
            Cultivating payment...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Pay R$ {pixAmount || '0.00'}
          </>
        )}
      </button>

      {parseFloat(pixAmount) / kaleToBRL > balance && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center">🚫 Insufficient KALE for this harvest</p>
        </div>
      )}
    </div>
  );

  const renderReceive = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentView('home')}
          className="text-green-600 font-medium flex items-center"
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Plus className="h-6 w-6 text-green-600 mr-2" />
          Receive KALE
        </h2>
        <div></div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-green-50 border-2 border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2 flex items-center">
          <Sprout className="h-5 w-5 mr-2" />
          🚜 Send KALE to your farm
        </h3>
        <p className="text-green-700 text-sm">Deposit mined KALE to use with PIX in Brazil</p>
      </div>

      <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
        <div className="bg-green-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <QrCode className="h-12 w-12 text-green-600" />
        </div>
        <p className="font-semibold text-gray-800 mb-2">KALE Farm Address</p>
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
          <strong>🌱 Farmer Tip:</strong> Always include the memo to identify your harvest!
        </p>
      </div>
    </div>
  );

  const renderFarm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentView('home')}
          className="text-green-600 font-medium flex items-center"
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Tractor className="h-6 w-6 text-green-600 mr-2" />
          Farm KALE
        </h2>
        <div></div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 text-center">
        <Tractor className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-purple-800 mb-2">Start Mining KALE!</h3>
        <p className="text-purple-700 mb-4">
          Visit <strong>kalefarm.xyz</strong> to start farming KALE on the Stellar network!
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
          Go to KaleFarm 🚜
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <Sprout className="h-8 w-8 text-green-600 mb-2" />
          <h4 className="font-semibold text-green-800">Plant</h4>
          <p className="text-green-700 text-sm">Stake KALE to commit your farming interest</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <Leaf className="h-8 w-8 text-yellow-600 mb-2" />
          <h4 className="font-semibold text-yellow-800">Work</h4>
          <p className="text-yellow-700 text-sm">Mine with hash generation for maximum zeros</p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 rounded-full p-2">
            <Tractor className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h4 className="font-semibold text-orange-800">Harvest</h4>
            <p className="text-orange-700 text-sm">Collect your KALE rewards based on contributions</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatement = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <Receipt className="h-6 w-6 text-green-600 mr-2" />
        Statement
      </h2>

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
                {tx.type === 'pix_sent' ? '💳 PIX sent' : 
                 tx.type === 'harvest' ? '🌱 KALE harvest' : 'Transaction'}
              </p>
              {tx.type === 'pix_sent' && (
                <p className="text-gray-400">
                  ~{(Math.abs(tx.amount) / kaleToBRL).toFixed(0)} KALE used
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <User className="h-6 w-6 text-green-600 mr-2" />
        Profile
      </h2>

      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">KALE Farmer</h3>
            <p className="text-green-600">Level 7 Cultivator</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Harvested</p>
            <p className="text-lg font-semibold text-green-600">12,456 KALE</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">PIX Payments</p>
            <p className="text-lg font-semibold text-green-600">47</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-gray-800">Security Settings</span>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-gray-800">Notification Preferences</span>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-gray-800">Connected Wallets</span>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center py-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">🎉 PIX cultivated successfully!</h3>
        <p className="text-green-700">
          R$ {pixAmount} was paid using {(parseFloat(pixAmount) / kaleToBRL).toFixed(2)} fresh KALE!
        </p>
        <div className="bg-white/50 rounded-lg p-3 mt-4">
          <p className="text-green-600 text-sm">🌱 Your farm keeps growing...</p>
        </div>
      </div>

      <button
        onClick={() => setCurrentView('home')}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center"
      >
        <Tractor className="h-5 w-5 mr-2" />
        Back to Farm
      </button>
    </div>
  );

  const getActiveView = () => {
    if (currentView === 'success') return renderSuccess();
    if (currentView === 'send') return renderSend();
    if (currentView === 'receive') return renderReceive();
    if (currentView === 'farm') return renderFarm();
    
    switch (activeTab) {
      case 'statement': return renderStatement();
      case 'profile': return renderProfile();
      default: return renderHome();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-green-50 to-white min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg p-4">
        <div className="flex items-center justify-center text-white">
          <Leaf className="h-6 w-6 mr-2" />
          <h1 className="text-lg font-bold">KALE Farmer Wallet</h1>
          <Sprout className="h-6 w-6 ml-2" />
        </div>
        <p className="text-green-100 text-center text-sm mt-1">Cultivating the future of payments 🥬</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {getActiveView()}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => {
              setActiveTab('home');
              setCurrentView('home');
            }}
            className={`p-4 text-center transition-colors ${
              activeTab === 'home' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <Home className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Home</p>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('statement');
              setCurrentView('statement');
            }}
            className={`p-4 text-center transition-colors ${
              activeTab === 'statement' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <Receipt className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Statement</p>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('profile');
              setCurrentView('profile');
            }}
            className={`p-4 text-center transition-colors ${
              activeTab === 'profile' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <User className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Profile</p>
          </button>
        </div>
      </div>

      <div className="p-4 text-center text-xs text-gray-500">
        <p>🥬 KALE Farmer Wallet Demo</p>
        <p>Powered by Stellar • Proof-of-Teamwork</p>
      </div>
    </div>
  );
};

export default KALEPIXWallet;