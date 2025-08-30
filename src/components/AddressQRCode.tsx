import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from './ui/card';
import AddressDisplay from './AddressDisplay';

interface AddressQRCodeProps {
  address: string;
  title?: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  showText?: boolean;
  className?: string;
  explorerUrl?: string;
}

const AddressQRCode: React.FC<AddressQRCodeProps> = ({
  address,
  title = 'Wallet Address',
  size = 180,
  bgColor = '#ffffff',
  fgColor = '#166534',
  showText = true,
  className = '',
  explorerUrl,
}) => {
  return (
    <Card className={`bg-white border-2 border-dashed border-green-300 rounded-lg p-6 text-center ${className}`}>
      <div className="mx-auto mb-4 flex items-center justify-center">
        <QRCodeSVG
          value={address}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level={"H"}
          includeMargin={true}
        />
      </div>
      {title && <p className="font-semibold text-gray-800 mb-2">{title}</p>}
      {showText && (
        <div className="bg-green-50 border border-green-200 p-3 rounded text-xs mb-4">
          <AddressDisplay 
            address={address} 
            explorerUrl={explorerUrl} 
            showIcons={true} 
          />
        </div>
      )}
    </Card>
  );
};

export default AddressQRCode;