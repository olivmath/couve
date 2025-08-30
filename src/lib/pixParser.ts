/**
 * Parser para códigos PIX copia e cola
 * Baseado na documentação oficial do PIX
 */

export interface PixData {
  pixKey: string;
  amount: string;
  recipientName: string;
  recipientCity: string;
  description?: string;
}

/**
 * Extrai dados de um payload PIX
 * @param payload - String do código PIX copia e cola
 * @returns Dados extraídos do PIX ou null se inválido
 */
export function parsePixPayload(payload: string): PixData | null {
  try {
    // Remove espaços e quebras de linha
    const cleanPayload = payload.replace(/\s/g, '');
    
    // Verifica se começa com o formato correto (00020126...)
    if (!cleanPayload.startsWith('000201')) {
      return null;
    }

    let position = 0;
    const data: Partial<PixData> = {};

    while (position < cleanPayload.length - 4) { // -4 para o CRC no final
      const id = cleanPayload.substr(position, 2);
      const length = parseInt(cleanPayload.substr(position + 2, 2), 10);
      const value = cleanPayload.substr(position + 4, length);
      
      position += 4 + length;

      switch (id) {
        case '26': // Merchant Account Information
          // Dentro do campo 26, procurar pela chave PIX
          const pixKeyData = parsePixKey(value);
          if (pixKeyData) {
            data.pixKey = pixKeyData;
          }
          break;
        case '54': // Transaction Amount
          data.amount = value;
          break;
        case '59': // Merchant Name
          // Remover CPF/CNPJ do início se presente
          let cleanName = value.replace(/^\d+\.\d+\.\d+/, '').replace(/^\d+\.\d+\.\d+\/\d+-\d+/, '');
          // Remover indicadores de cidade no final (600X)
          cleanName = cleanName.replace(/600\d*$/, '');
          data.recipientName = cleanName.trim();
          break;
        case '60': // Merchant City
          data.recipientCity = value;
          break;
        case '62': // Additional Data Field Template
          // Pode conter descrição do pagamento
          const description = parseAdditionalData(value);
          if (description) {
            data.description = description;
          }
          break;
      }
    }

    // Verifica se temos os dados essenciais
    if (data.pixKey && data.amount && data.recipientName) {
      return {
        pixKey: data.pixKey,
        amount: data.amount,
        recipientName: data.recipientName,
        recipientCity: data.recipientCity || '',
        description: data.description
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao fazer parsing do PIX:', error);
    return null;
  }
}

/**
 * Extrai a chave PIX do campo Merchant Account Information (26)
 */
function parsePixKey(merchantInfo: string): string | null {
  let position = 0;
  
  while (position < merchantInfo.length) {
    const id = merchantInfo.substr(position, 2);
    const length = parseInt(merchantInfo.substr(position + 2, 2), 10);
    const value = merchantInfo.substr(position + 4, length);
    
    position += 4 + length;

    // Campo 01 dentro do 26 contém a chave PIX
    if (id === '01') {
      return value;
    }
  }
  
  return null;
}

/**
 * Extrai dados adicionais do campo 62
 */
function parseAdditionalData(additionalData: string): string | null {
  let position = 0;
  
  while (position < additionalData.length) {
    const id = additionalData.substr(position, 2);
    const length = parseInt(additionalData.substr(position + 2, 2), 10);
    const value = additionalData.substr(position + 4, length);
    
    position += 4 + length;

    // Campo 05 dentro do 62 geralmente contém a descrição
    if (id === '05') {
      return value;
    }
  }
  
  return null;
}

/**
 * Valida se uma string é um payload PIX válido
 */
export function isValidPixPayload(payload: string): boolean {
  const cleanPayload = payload.replace(/\s/g, '');
  
  // Verifica formato básico
  if (!cleanPayload.startsWith('000201')) {
    return false;
  }
  
  // Verifica se tem pelo menos o tamanho mínimo
  if (cleanPayload.length < 50) {
    return false;
  }
  
  // Tenta fazer o parsing
  return parsePixPayload(payload) !== null;
}

/**
 * Formata o nome do destinatário para exibição
 */
export function formatRecipientName(name: string): string {
  // Lista de nomes comuns brasileiros para ajudar na separação
  const commonNames = ['LUCAS', 'BISPO', 'SILVA', 'SANTOS', 'OLIVEIRA', 'SOUZA', 'LIMA', 'COSTA', 'PEREIRA', 'RODRIGUES', 'ALMEIDA', 'NASCIMENTO', 'CARVALHO', 'GOMES', 'MARTINS', 'ARAUJO', 'MELO', 'BARBOSA', 'RIBEIRO', 'MONTEIRO'];
  
  let formattedName = name.toUpperCase();
  
  // Se o nome não tem espaços, tentar separar usando nomes comuns
  if (!name.includes(' ') && name.length > 0) {
    for (const commonName of commonNames) {
      if (formattedName.includes(commonName)) {
        const regex = new RegExp(`(${commonName})`, 'g');
        formattedName = formattedName.replace(regex, ` $1 `);
      }
    }
    
    // Limpar espaços extras
    formattedName = formattedName.replace(/\s+/g, ' ').trim();
    
    // Se ainda não conseguiu separar, usar heurística simples
    if (!formattedName.includes(' ') && formattedName.length > 6) {
      // Tentar separar no meio para nomes longos
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
 * Formata o valor para exibição em BRL
 */
export function formatPixAmount(amount: string): string {
  const numericAmount = parseFloat(amount);
  return numericAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}