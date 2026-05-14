# ⭐ Stellar TCG

A blockchain-powered trading card game on Stellar. Cards are real on-chain assets, tradable on Stellar's native DEX, with battles rewarded in XLM and rare cards via Soroban smart contracts.

---

## How It Works

- **Ownership** — every card is a Stellar asset in the player's wallet
- **Trading** — peer-to-peer transfers and DEX orders, settled in ~5 seconds
- **Packs** — opened on-chain via Soroban (`open_pack`), buyer signs the transaction
- **Battles** — game logic runs server-side; the backend distributes rewards on-chain after each match
- **Auth** — wallet-based login using Freighter message signing (no passwords, no custodial keys)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Wallet | Freighter (`@stellar/freighter-api`) |
| Blockchain | `@stellar/stellar-sdk` v12, Soroban RPC |
| State / Data | SWR, React Context |
| Realtime | `socket.io-client` |
| Backend | NestJS, PostgreSQL, Redis (separate repo) |
| Contracts | Soroban (Rust) — `card_registry`, `pack_opening`, `rewards` |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing
│   ├── inventory/        # Player's cards
│   ├── packs/            # Buy & open packs on-chain
│   ├── deck-builder/     # Build decks from owned cards
│   ├── marketplace/      # P2P transfers + Stellar DEX offers
│   ├── battle/           # Matchmaking + live PvP
│   ├── leaderboard/      # ELO rankings
│   └── admin/            # Card registration (admin wallet only)
├── components/
│   ├── Nav.tsx           # Top navigation
│   ├── CardTile.tsx      # Card display with rarity border
│   ├── DeckBuilder.tsx   # Card selection UI
│   ├── PackOpener.tsx    # On-chain pack open + reveal
│   └── BattleBoard.tsx   # Live battle UI
├── context/
│   ├── AuthContext.tsx   # JWT auth via wallet signing
│   └── WalletContext.tsx # Wallet address state
├── hooks/
│   ├── useCards.ts       # Inventory + card catalog (SWR)
│   ├── useDecks.ts       # Deck CRUD
│   └── useBattle.ts      # WebSocket match events
└── lib/
    ├── api.ts            # Typed backend API client (JWT in-memory)
    ├── freighter.ts      # connectWallet, signMessage, signTransaction
    ├── stellar.ts        # openPack, transferCard (Soroban RPC)
    └── types.ts          # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Freighter wallet](https://freighter.app) browser extension
- Backend API running (see backend repo)
- Deployed Soroban contracts (contract IDs from `make deploy-all`)

### Install

```bash
npm install
```

### Configure

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_REGISTRY_CONTRACT=C...   # from .env.contracts
NEXT_PUBLIC_PACK_CONTRACT=C...
NEXT_PUBLIC_REWARDS_CONTRACT=C...
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_WALLET=G...        # wallet address with admin access
```

### Run

```bash
npm run dev      # development
npm run build    # production build
npm start        # production server
```

---

## Key User Flows

**Connect & Login**
1. Click "Connect Wallet" → Freighter prompts for permission
2. Backend issues a nonce → player signs it → JWT returned
3. JWT stored in memory only (never localStorage)

**Open a Pack**
1. Frontend builds an `open_pack(buyer)` Soroban transaction
2. Freighter signs it — player pays the pack price in XLM
3. Contract mints 5 cards (70% Common / 20% Rare / 8% Epic / 2% Legendary)
4. New cards appear in inventory

**Battle**
1. Join matchmaking queue → WebSocket matches by ELO
2. Play cards, attack, end turn — all actions validated server-side
3. On match end, backend calls `distribute_reward` on-chain → winner receives XLM + card

**Trade**
- Direct transfer: sign a `transfer(from, to, card_id, amount)` transaction
- DEX: use LOBSTR or Stellar Laboratory to place/fill orders

---

## Card Rarity

| Rarity | Border | Pack Odds |
|---|---|---|
| Common | Gray | 70% |
| Rare | Blue | 20% |
| Epic | Purple | 8% |
| Legendary | Gold | 2% |

---

## Security

- The frontend **never** holds the admin key or mint authority
- JWT is kept in memory — cleared on page refresh / logout
- Battle outcomes are determined server-side only
- Card ownership is verified on-chain before any deck is saved

---

## License

MIT
