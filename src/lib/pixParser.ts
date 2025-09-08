/**
 * Parser for PIX copy and paste codes
 * Based on official PIX documentation
 */

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'UUID';

/**
 * Detects the type of a PIX key
 */
export function detectPixKeyType(key: string): PixKeyType {
  if (!key) return 'UUID';
  
  const cleanKey = key.replace(/[^a-zA-Z0-9@.-]/g, '');
  
  if (/^\d{11}$/.test(cleanKey)) return 'CPF';
  if (/^\d{14}$/.test(cleanKey)) return 'CNPJ';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanKey)) return 'EMAIL';
  if (/^\d{10,11}$/.test(cleanKey)) return 'PHONE';
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(cleanKey)) return 'UUID';
  
  return 'UUID';
}

export interface PixData {
  pixKey: string;
  pixKeyType: PixKeyType;
  amount: string;
  recipientName: string;
  recipientCity: string;
  description?: string;
}

/**
 * Extracts data from a PIX payload
 * @param payload - PIX copy and paste code string
 * @returns Extracted PIX data or null if invalid
 */
export function parsePixPayload(payload: string): PixData | null {
  try {
    // Remove spaces and line breaks
    const cleanPayload = payload.replace(/\s/g, '');
    
    // Check if it starts with correct format (00020126...)
    if (!cleanPayload.startsWith('000201')) {
      return null;
    }

    let position = 0;
    const data: Partial<PixData> = {};

    while (position < cleanPayload.length - 4) { // -4 for CRC at the end
      const id = cleanPayload.substr(position, 2);
      const length = parseInt(cleanPayload.substr(position + 2, 2), 10);
      const value = cleanPayload.substr(position + 4, length);
      
      position += 4 + length;

      switch (id) {
        case '26': // Merchant Account Information
          // Inside field 26, look for PIX key
          const pixKeyData = parsePixKey(value);
          if (pixKeyData) {
            data.pixKey = pixKeyData;
          }
          break;
        case '54': // Transaction Amount
          data.amount = value;
          break;
        case '59': // Merchant Name
          // Remove CPF/CNPJ from beginning if present
          let cleanName = value.replace(/^\d+\.\d+\.\d+/, '').replace(/^\d+\.\d+\.\d+\/\d+-\d+/, '');
          // Remove city indicators at the end (600X)
          cleanName = cleanName.replace(/600\d*$/, '');
          data.recipientName = cleanName.trim();
          break;
        case '60': // Merchant City
          data.recipientCity = value;
          break;
        case '62': // Additional Data Field Template
          // May contain payment description
          const description = parseAdditionalData(value);
          if (description) {
            data.description = description;
          }
          break;
      }
    }

    // Check if we have essential data
    if (data.pixKey && data.amount && data.recipientName) {
      return {
        pixKey: data.pixKey,
        pixKeyType: detectPixKeyType(data.pixKey),
        amount: data.amount,
        recipientName: data.recipientName,
        recipientCity: data.recipientCity || '',
        description: data.description
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing PIX:', error);
    return null;
  }
}

/**
 * Extracts PIX key from Merchant Account Information field (26)
 */
function parsePixKey(merchantInfo: string): string | null {
  let position = 0;
  
  while (position < merchantInfo.length) {
    const id = merchantInfo.substr(position, 2);
    const length = parseInt(merchantInfo.substr(position + 2, 2), 10);
    const value = merchantInfo.substr(position + 4, length);
    
    position += 4 + length;

    // Field 01 inside 26 contains the PIX key
    if (id === '01') {
      return value;
    }
  }
  
  return null;
}

/**
 * Extracts additional data from field 62
 */
function parseAdditionalData(additionalData: string): string | null {
  let position = 0;
  
  while (position < additionalData.length) {
    const id = additionalData.substr(position, 2);
    const length = parseInt(additionalData.substr(position + 2, 2), 10);
    const value = additionalData.substr(position + 4, length);
    
    position += 4 + length;

    // Field 05 inside 62 usually contains the description
    if (id === '05') {
      return value;
    }
  }
  
  return null;
}

/**
 * Validates if a string is a valid PIX payload
 */
export function isValidPixPayload(payload: string): boolean {
  const cleanPayload = payload.replace(/\s/g, '');
  
  // Check basic format
  if (!cleanPayload.startsWith('000201')) {
    return false;
  }
  
  // Check if it has at least minimum size
  if (cleanPayload.length < 50) {
    return false;
  }
  
  // Try to parse
  return parsePixPayload(payload) !== null;
}

/**
 * Formats recipient name for display
 */
export function formatRecipientName(name: string): string {
  // List of common Brazilian names to help with separation
  const commonNames = ['LUCAS', 'BISPO', 'SILVA', 'SANTOS', 'OLIVEIRA', 'SOUZA', 'LIMA', 'COSTA', 'PEREIRA', 'RODRIGUES', 'ALMEIDA', 'NASCIMENTO', 'CARVALHO', 'GOMES', 'MARTINS', 'ARAUJO', 'MELO', 'BARBOSA', 'RIBEIRO', 'MONTEIRO'];
  
  let formattedName = name.toUpperCase();
  
  // If name has no spaces, try to separate using common names
  if (!name.includes(' ') && name.length > 0) {
    for (const commonName of commonNames) {
      if (formattedName.includes(commonName)) {
        const regex = new RegExp(`(${commonName})`, 'g');
        formattedName = formattedName.replace(regex, ` $1 `);
      }
    }
    
    // Clean extra spaces
    formattedName = formattedName.replace(/\s+/g, ' ').trim();
    
    // If still couldn't separate, use simple heuristic
    if (!formattedName.includes(' ') && formattedName.length > 6) {
      // Try to separate in the middle for long names
      const middle = Math.floor(formattedName.length / 2);
      formattedName = formattedName.slice(0, middle) + ' ' + formattedName.slice(middle);
    }
  }
  
  return formattedName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats amount for display in BRL
 */
export function formatPixAmount(amount: string): string {
  const numericAmount = parseFloat(amount);
  return numericAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}