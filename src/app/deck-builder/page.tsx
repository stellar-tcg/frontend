"use client";
import { useAuth } from "@/context/AuthContext";
import { usePlayerCards, useAllCards } from "@/hooks/useCards";
import { useDecks } from "@/hooks/useDecks";
import { DeckBuilder } from "@/components/DeckBuilder";
import type { CardDef, CardMetadata } from "@/lib/types";

export default function DeckBuilderPage() {
  const { wallet, login } = useAuth();
  const { data: playerCards } = usePlayerCards(wallet);
  const { data: allCards } = useAllCards();
  const { decks, create, remove } = useDecks();

  if (!wallet) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400">Connect your wallet to build decks.</p>
        <button onClick={login} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
          Connect Wallet
        </button>
      </div>
    );
  }

  const cardMap = new Map(allCards?.map((c) => [c.card_id, c]) ?? []);
  const inventory = (playerCards ?? [])
    .filter((pc) => pc.balance > 0)
    .map((pc) => ({
      ...(cardMap.get(pc.card_id) ?? { card_id: pc.card_id, asset_code: `#${pc.card_id}`, rarity: "Common" as const, max_supply: 0, minted: 0 }),
      balance: pc.balance,
    })) as (CardDef & { metadata?: CardMetadata; balance: number })[];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Deck Builder</h1>

      {decks && decks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-300">My Decks</h2>
          {decks.map((deck) => (
            <div key={deck.id} className="bg-gray-800 rounded-lg px-4 py-3 flex justify-between items-center">
              <div>
                <span className="font-medium">{deck.name}</span>
                <span className="text-gray-400 text-sm ml-3">{deck.card_ids.length} cards</span>
              </div>
              <button
                onClick={() => remove(deck.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-300 mb-4">Build New Deck</h2>
        <DeckBuilder inventory={inventory} onSave={create} />
      </div>
    </div>
  );
}
