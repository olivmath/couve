# CouvePIX - Official Kale Wallet for Meridian 

A modern wallet for the Stellar network with PIX integration and Meridian 2025 events.

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

## 🚀 Features

- 💳 Integrated Stellar wallet
- 🇧🇷 PIX payments via Stellar
- 🎉 Meridian 2025 events carousel with Luma API
- 📱 Mobile-first responsive interface
- 🌟 Modern design with Tailwind CSS

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd couve

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Luma API Configuration (Optional)

To integrate real Luma events:

1. Access [Luma Dashboard](https://lu.ma/dashboard)
2. Go to Settings → API Keys
3. Generate a new API key
4. Add to the `.env` file:

```env
VITE_LUMA_API_KEY=your_api_key_here
```

### Run the project

```bash
npm run dev
```

## 📱 Main Flows


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

## 🎨 Main Components

- **MeridianEventsCarousel**: Interactive events carousel with Luma API integration
- **WalletStore**: Stellar wallet state management
- **BalanceCard**: Balance display and conversions
- **QuickActions**: Quick actions for PIX payments

## 🌐 Integrated APIs

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

### Detailed APIs

- **Luma API**: Meridian 2025 events
- **Stellar Horizon**: Stellar network
- **Transfero**: PIX payments
- **Soroswap**: Token swaps on Stellar

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
