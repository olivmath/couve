import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, X } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';

export default function QRScannerView() {
  const { setCurrentView, handleQRScanSuccess } = useWalletStore();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setHasPermission] = useState<boolean | null>(null);
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

  const getDetailedCameraError = (error: any): string => {
    const errorName = error?.name || '';
    const errorMessage = error?.message || '';
    
    console.log('Camera error details:', { name: errorName, message: errorMessage, error });
    
    switch (errorName) {
      case 'NotAllowedError':
        return 'Camera permission denied. To enable on iPhone: Settings > Safari > Camera > Allow';
      case 'NotFoundError':
        return 'No camera found on device.';
      case 'NotReadableError':
        return 'Camera is being used by another app. Close other apps that might be using the camera.';
      case 'OverconstrainedError':
        return 'Camera settings not supported. Trying with basic settings...';
      case 'SecurityError':
        return 'Camera access blocked for security reasons. Make sure you are using HTTPS.';
      case 'AbortError':
        return 'Camera operation was interrupted.';
      default:
        if (errorMessage.includes('Permission denied')) {
          return 'Camera permission denied. To enable on iPhone: Settings > Safari > Camera > Allow';
        }
        if (errorMessage.includes('not supported') || errorMessage.includes('não suportada')) {
           return 'Camera API not supported in this browser. Use updated Safari, Chrome or Firefox.';
         }
         return `Error accessing camera: ${errorMessage || 'Unknown error'}. Check permissions and try again.`;
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      // Primeiro, verificar se a API está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      
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
      
      // Se for erro de configuração, tentar com configurações mais básicas
      if (err instanceof Error && err.name === 'OverconstrainedError') {
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
          
          streamRef.current = basicStream;
          setHasPermission(true);
          setIsScanning(true);
          
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
          }
          return;
        } catch (basicErr) {
          setError(getDetailedCameraError(basicErr));
        }
      } else {
        setError(getDetailedCameraError(err));
      }
      
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
    // Simulate QR code scanning with real PIX payload
    const mockPixPayload = '00020126580014br.gov.bcb.pix013611987654321520400005303986540525.005802BR5913LUCAS BISPO DE6009SAO PAULO62070503***6304A1B2';
    
    setTimeout(() => {
      stopCamera();
      handleQRScanSuccess(mockPixPayload);
    }, 2000);
  };

  const handleBack = () => {
    stopCamera();
    setCurrentView('send');
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
            Back
          </button>
          <h2 className="text-xl font-bold text-white">
            Scan QR Code
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
                  Position the QR Code in the camera
                </h3>
                <p className="text-gray-300">
                  Point the camera at the PIX QR Code you want to pay
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg text-left space-y-3">
                  <p className="font-semibold">{error}</p>
                  
                  {(error.includes('Permissão') || error.includes('Permission')) && (
                    <div className="bg-red-600 p-3 rounded text-sm space-y-2">
                      <p className="font-semibold">📱 How to enable camera:</p>
                      <div className="space-y-1">
                        <p><strong>iPhone/iPad (Safari):</strong></p>
                        <p>1. Settings → Safari → Camera → Allow</p>
                        <p>2. Or tap the "aA" icon in address bar → Website Settings → Camera → Allow</p>
                      </div>
                      <div className="space-y-1">
                        <p><strong>Chrome/Firefox:</strong></p>
                        <p>1. Tap the lock/camera icon in the address bar</p>
                        <p>2. Select "Allow" for camera</p>
                      </div>
                      <p className="text-yellow-200">💡 Tip: Reload the page after changing permissions</p>
                    </div>
                  )}
                  
                  {error.includes('HTTPS') && (
                    <div className="bg-red-600 p-3 rounded text-sm">
                      <p>🔒 <strong>Security issue:</strong></p>
                      <p>Camera only works on secure sites (HTTPS). Make sure the URL starts with "https://"</p>
                    </div>
                  )}
                  
                  {error.includes('outro aplicativo') && (
                     <div className="bg-red-600 p-3 rounded text-sm">
                       <p>📱 <strong>Camera in use:</strong></p>
                       <p>Close other apps that might be using the camera (Instagram, TikTok, Zoom, etc.)</p>
                     </div>
                   )}
                   
                   {(error.includes('não suportada') || error.includes('not supported')) && (
                     <div className="bg-red-600 p-3 rounded text-sm space-y-2">
                       <p>🌐 <strong>Incompatible browser:</strong></p>
                       <div className="space-y-1">
                         <p><strong>Recommended browsers:</strong></p>
                         <p>• Safari (iOS 11+)</p>
                         <p>• Chrome (Android/iOS)</p>
                         <p>• Firefox (Android/iOS)</p>
                         <p>• Edge (Windows/Android)</p>
                       </div>
                       <div className="space-y-1">
                         <p><strong>Alternatives:</strong></p>
                         <p>• Update your browser to the latest version</p>
                         <p>• Try opening in another browser</p>
                         <p>• Use the "Simulate Scan" button to test</p>
                       </div>
                     </div>
                   )}
                </div>
              )}
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={startCamera}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  {error ? 'Try Again' : 'Open Camera'}
                </button>
                
                {error && (
                  <button
                    onClick={() => {
                      setError(null);
                      setHasPermission(null);
                    }}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all text-sm"
                  >
                    Clear Error
                  </button>
                )}
              </div>
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
                    Scanning QR Code...
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
                Simulate Scan
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