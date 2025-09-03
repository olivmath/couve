import { NetworkType } from '../stores/useWalletStore';

// Configurações KALE por rede
export const KALE_CONFIG = {
  mainnet: {
    ASSET_CODE: 'KALE',
    ISSUER: 'GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE',
    CONTRACT: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA',
    SAC: 'CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV',
    HORIZON_SERVER: 'https://horizon.stellar.org'
  },
  testnet: {
    ASSET_CODE: 'KALE',
    ISSUER: 'GCHPTWXMT3HYF4RLZHWBNRF4MPXLTJ76ISHMSYIWCCDXWUYOQG5MR2AB',
    CONTRACT: 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO',
    SAC: 'CAAVU2UQJLMZ3GUZFM56KVNHLPA3ZSSNR4VP2U53YBXFD2GI3QLIVHZZ',
    HORIZON_SERVER: 'https://horizon-testnet.stellar.org'
  }
};

// Função para obter configuração KALE baseada na rede
export const getKaleConfig = (networkType: NetworkType) => {
  return KALE_CONFIG[networkType];
};

// Função para obter o asset completo KALE:ISSUER
export const getKaleAsset = (networkType: NetworkType) => {
  const config = getKaleConfig(networkType);
  return `${config.ASSET_CODE}:${config.ISSUER}`;
};