# Couve - Stellar Wallet App

Uma carteira moderna para a rede Stellar com integração PIX e eventos do Meridian 2025.

```mermaid
flowchart LR
    A[KALE] --> B[USDC]
    B --> C[Allbridge XLM to EVM]
    C --> D[USDC]
    D --> E[PIX]
    
    style A fill:#4ade80
    style B fill:#3b82f6
    style C fill:#f59e0b
    style D fill:#3b82f6
    style E fill:#10b981
```

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

```mermaid
sequenceDiagram
    participant User
    participant Couve
    participant Stellar
    participant Soroswap
    
    User->>Couve: Deposit $KALE
    Couve->>Stellar: Convert $KALE to USDC
    Note over Stellar: Onchain swap
    Stellar-->>Couve: USDC received
    Couve->>Soroswap: Convert USDC to XLM
    Note over Soroswap: Onchain soroswap
    Soroswap-->>Couve: XLM received
    Couve-->>User: Wallet ready with XLM
```

### FLOW PAY PIX

```mermaid
sequenceDiagram
    participant User
    participant Couve
    participant Transfero
    participant Bank
    
    User->>Couve: Scan/Paste/Input PIX key
    User->>Couve: Enter amount
    Couve->>Transfero: Send payment data
    Note over Transfero: (PIX address, XLM amount)
    Transfero->>Bank: Process PIX payment
    Bank-->>Transfero: Payment confirmation
    Transfero-->>Couve: Webhook notification
    Couve-->>User: Payment confirmed
```

## 🎨 Componentes Principais

- **MeridianEventsCarousel**: Carrossel interativo de eventos com integração API do Luma
- **WalletStore**: Gerenciamento de estado da carteira Stellar
- **BalanceCard**: Exibição de saldos e conversões
- **QuickActions**: Ações rápidas para pagamentos PIX

## 🌐 APIs Integradas

```mermaid
graph TB
    subgraph "Couve App"
        A[Frontend React]
        B[Wallet Store]
        C[Stellar Service]
    end
    
    subgraph "External APIs"
        D[Luma API]
        E[Stellar Horizon]
        F[Transfero API]
        G[Soroswap]
    end
    
    subgraph "Blockchain"
        H[Stellar Network]
        I[Smart Contracts]
    end
    
    A --> B
    B --> C
    C --> E
    A --> D
    C --> F
    C --> G
    E --> H
    G --> I
    
    D -.-> |"Meridian 2025 Events"| A
    E -.-> |"Account Data"| C
    F -.-> |"PIX Payments"| C
    G -.-> |"Token Swaps"| C
    
    style A fill:#3b82f6
    style D fill:#f59e0b
    style E fill:#10b981
    style F fill:#ef4444
    style G fill:#8b5cf6
```

### APIs Detalhadas

- **Luma API**: Eventos do Meridian 2025
- **Stellar Horizon**: Rede Stellar
- **Transfero**: Pagamentos PIX
- **Soroswap**: Swaps de tokens na Stellar

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
