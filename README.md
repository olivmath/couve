# Couve - Stellar Wallet App

Uma carteira moderna para a rede Stellar com integração PIX e eventos do Meridian 2025.

## 🚀 Funcionalidades

- 💳 Carteira Stellar integrada
- 🇧🇷 Pagamentos PIX via Stellar
- 🎉 Carrossel de eventos do Meridian 2025 com API do Luma
- 📱 Interface mobile-first responsiva
- 🌟 Design moderno com Tailwind CSS

## 🛠️ Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd couve

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### Configuração da API do Luma (Opcional)

Para integrar eventos reais do Luma:

1. Acesse [Luma Dashboard](https://lu.ma/dashboard)
2. Vá em Settings → API Keys
3. Gere uma nova API key
4. Adicione no arquivo `.env`:

```env
VITE_LUMA_API_KEY=sua_api_key_aqui
```

### Executar o projeto

```bash
npm run dev
```

## 📱 Fluxos Principais

### FLOW ONBOARDING

1. user deposit $KALE
2. couve convert $KALE to USDC onchain swap
3. couve convert USDC to XLM onchain soroswap

### FLOW PAY PIX
 
1. user scan/paste/input PIX key
2. couve send data to Transfero (receiver pix address, amount in xlm)
3. couve listen the webhook to confirm payment

## 🎨 Componentes Principais

- **MeridianEventsCarousel**: Carrossel interativo de eventos com integração API do Luma
- **WalletStore**: Gerenciamento de estado da carteira Stellar
- **BalanceCard**: Exibição de saldos e conversões
- **QuickActions**: Ações rápidas para pagamentos PIX

## 🌐 APIs Integradas

- **Luma API**: Eventos do Meridian 2025
- **Stellar Horizon**: Rede Stellar
- **Transfero**: Pagamentos PIX

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request


# Couve PIX Gateway [Come on to Meridian]

alide se o frontend e o backend estão seguindo a seguinte lógica de fluxo:

1. **Login e Criação de Carteira**:

- Quando o usuário fizer login via StackAuth, o backend deve:

- Identificar o login

- Criar um par de chaves para o usuário

- Salvar as chaves no banco de dados

- Atribuir um saldo inicial através da testnet do Stellar (faucet

- O frontend deve exibir o saldo consultando diretamente a blockchain usando a carteira que o backend criou

2. **Depósito e Conversão**:

- Quando o usuário fizer um depósito na carteira Kale:

- O backend deve monitorar eventos via WebSocket na blockchain

- Identificar depósitos na carteira previamente criada

- Ao detectar um depósito:

- Realizar um swap automático: KALE → SDC → XLM

- Obter cotação do KALE através do oráculo Reflector ou pool de liquidez

- O frontend deve atualizar o saldo consultando a blockchain

3. **Envio de PIX**:

- Quando o usuário solicitar um PIX:

- O backend deve:

- Receber a requisição

- Conectar na API da Transfero

- Enviar o valor equivalente em XLM e a chave pix do destinatario

- Notificar a Transfero para processar o PIX

- A Transfero notificará via webhook quando o pagamento for concluído

- O backend deve modificar o estatos do pagamento do banco que será consultado pelo frontend sobre a conclusão

4. **Registro de Transações**:

- Todas as transações (logins, depósitos, swaps, envios de PIX) devem ser registradas no banco de dados

- O frontend deve exibir um histórico completo das transações para o usuário

Valide se ambos os sistemas estão implementando corretamente essa sequência de operações e comunicação entre os componentes.

Sempre antes de modificar um arquivo verifique a docs para implementa certo as coisas.

aqui estão as docs que podem ser uteis:

stellar sdk js stellar base js reflector-js docs-reflector kalesc kalefrontend kale/usdc kalefarm transfero stack-auth launchtube

Meu arquivos backend frontend