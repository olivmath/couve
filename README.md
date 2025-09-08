# CouvePIX - Official Kale Wallet for Meridian 
The Kale wallet with PIX integration for the Meridian 2025 event.

## Signin
<img width="100" height="300" alt="sigin" src="https://github.com/user-attachments/assets/c97fc31c-ef91-4c30-bf52-75578588456b" />

## Pay
<img width="100" height="300" alt="home" src="https://github.com/user-attachments/assets/1b9a6960-503f-414e-8f92-5681f91c270a" />
<img width="100" height="300" alt="pix" src="https://github.com/user-attachments/assets/90d1f67b-545e-4481-ab38-7092b8f982ee" />
<img width="100" height="300" alt="key" src="https://github.com/user-attachments/assets/33f505dc-a499-4fff-b6ee-11708a9a507f" />
<img width="100" height="300" alt="value" src="https://github.com/user-attachments/assets/2dae9902-99c8-4c47-8549-13debca6f31e" />
<img width="100" height="300" alt="confirm" src="https://github.com/user-attachments/assets/5a955327-5c2f-4a50-b89a-3cfcbfc4a356" />
<img width="100" height="300" alt="done" src="https://github.com/user-attachments/assets/a12ab0b3-8d98-4193-898b-f7ac34a08d1e" />

## Deposit
<img width="100" height="300" alt="deposit" src="https://github.com/user-attachments/assets/b0228706-7dfa-42bd-97c3-035e79dd1eff" />

## History
<img width="100" height="300" alt="history" src="https://github.com/user-attachments/assets/436d6ae1-ae0e-4a61-8134-c641ac0d5355" />

## Events
<img width="100" height="300" alt="events" src="https://github.com/user-attachments/assets/da5ac449-9cff-4070-837a-58204900115c" />

## Profile
<img width="100" height="300" alt="profile" src="https://github.com/user-attachments/assets/377cece6-6405-4193-95c9-1abb63a1dcdf" />
<img width="100" height="300" alt="settings" src="https://github.com/user-attachments/assets/09290235-9a02-46a2-b6db-22adcc656ff6" />
<img width="100" height="300" alt="mainnet" src="https://github.com/user-attachments/assets/41155b95-4abb-4ee0-b16e-aad41a7d8958" />
<img width="100" height="300" alt="keys" src="https://github.com/user-attachments/assets/550f1a8e-4d7f-4e58-a9a5-7da13a3c6934" />
<img width="100" height="300" alt="debug" src="https://github.com/user-attachments/assets/71388840-bd18-4504-aa32-40ad83f21f16" />





## Flow

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
