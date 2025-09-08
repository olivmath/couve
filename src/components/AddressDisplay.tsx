import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import copy from 'copy-to-clipboard';

interface AddressDisplayProps {
  address: string;
  explorerUrl?: string;
  label?: string;
  className?: string;
  showIcons?: boolean;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  explorerUrl,
  label,
  className = '',
  showIcons = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  
  // Function to summarize the address (first 6 and last 4 characters)
  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleCopy = () => {
    copy(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center">
        {label && <span className="text-gray-600 mr-2">{label}:</span>}
        <a 
          href={explorerUrl ? explorerUrl : `https://stellar.expert/explorer/public/account/${address}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-mono text-green-700 hover:text-green-800 hover:underline"
        >
          {shortenAddress(address)}
        </a>
      </div>
      
      {showIcons && (
        <div className="flex space-x-1">
          <button 
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-green-100 transition-colors"
            title="Copy address"
          >
            {copied ? (
              <span className="text-xs text-green-600 font-medium">Copiado!</span>
            ) : (
              <Copy className="h-4 w-4 text-green-600" />
            )}
          </button>
          
          {explorerUrl && (
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1 rounded-md hover:bg-green-100 transition-colors"
              title="Ver no explorer"
            >
              <ExternalLink className="h-4 w-4 text-green-600" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;