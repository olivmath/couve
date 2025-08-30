import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, X } from 'lucide-react';

interface QRScannerViewProps {
  onBack: () => void;
  onScanSuccess: (pixKey: string, amount?: string) => void;
}

export default function QRScannerView({ onBack, onScanSuccess }: QRScannerViewProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simular escaneamento de QR code com dados fictícios
    const mockPixData = {
      pixKey: '11987654321',
      amount: '25.00'
    };
    
    setTimeout(() => {
      stopCamera();
      onScanSuccess(mockPixData.pixKey, mockPixData.amount);
    }, 2000);
  };

  const handleBack = () => {
    stopCamera();
    onBack();
  };

  return (
    <div className="p-4 h-screen bg-black">
      <div className="space-y-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <button
            onClick={handleBack}
            className="justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 text-white font-medium flex items-center p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
          <h2 className="text-xl font-bold text-white">
            Escanear QR Code
          </h2>
          <div></div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative">
          {!isScanning && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="w-32 h-32 border-4 border-white rounded-lg flex items-center justify-center">
                <Camera className="h-16 w-16 text-white" />
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Posicione o QR Code na câmera
                </h3>
                <p className="text-gray-300">
                  Aponte a câmera para o QR Code PIX que deseja pagar
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg text-center">
                  <p>{error}</p>
                </div>
              )}
              
              <button
                onClick={startCamera}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center"
              >
                <Camera className="h-5 w-5 mr-2" />
                Abrir Câmera
              </button>
            </div>
          )}
          
          {isScanning && (
            <div className="relative h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Frame */}
                  <div className="w-64 h-64 border-4 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                    
                    {/* Scanning Line Animation */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="w-full h-1 bg-green-500" style={{
                        animation: 'scanLine 2s linear infinite',
                        transformOrigin: 'center'
                      }}></div>
                    </div>
                  </div>
                  
                  <p className="text-white text-center mt-4 font-medium">
                    Escaneando QR Code...
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Simulate Scan Button (for demo) */}
              <button
                onClick={simulateQRScan}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg text-sm"
              >
                Simular Escaneamento
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scanLine {
            0% { transform: translateY(0); }
            100% { transform: translateY(256px); }
          }
        `
      }} />
    </div>
  );
}