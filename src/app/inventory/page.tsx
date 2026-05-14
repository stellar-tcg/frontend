"use client";
import { useAuth } from "@/context/AuthContext";
import { usePlayerCards, useAllCards } from "@/hooks/useCards";
import { CardTile } from "@/components/CardTile";
import type { CardDef, CardMetadata } from "@/lib/types";

export default function InventoryPage() {
  const { wallet, login } = useAuth();
  const { data: playerCards, isLoading: loadingOwned } = usePlayerCards(wallet);
  const { data: allCards, isLoading: loadingAll } = useAllCards();

  if (!wallet) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400">Connect your wallet to view your inventory.</p>
        <button onClick={login} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loadingOwned || loadingAll) {
    return <p className="text-gray-400 text-center py-20">Loading inventory…</p>;
  }

  const cardMap = new Map(allCards?.map((c) => [c.card_id, c]) ?? []);

  const cards = (playerCards ?? [])
    .filter((pc) => pc.balance > 0)
    .map((pc) => ({
      ...(cardMap.get(pc.card_id) ?? { card_id: pc.card_id, asset_code: `#${pc.card_id}`, rarity: "Common" as const, max_supply: 0, minted: 0 }),
      balance: pc.balance,
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Inventory</h1>
        <span className="text-gray-400 text-sm">{cards.length} card types</span>
      </div>
      {cards.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No cards yet. Open some packs!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <CardTile key={card.card_id} card={card as CardDef & { metadata?: CardMetadata; balance: number }} />
          ))}
        </div>
      )}
    </div>
  );
}
