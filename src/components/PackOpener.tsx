"use client";
import { useState } from "react";
import type { CardDef, CardMetadata } from "@/lib/types";
import { openPack } from "@/lib/stellar";
import { CardTile } from "./CardTile";

interface Props {
  wallet: string;
  priceXlm: string;
  allCards: (CardDef & { metadata?: CardMetadata })[];
  onOpened?: () => void;
}

export function PackOpener({ wallet, priceXlm, allCards, onOpened }: Props) {
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    setOpening(true);
    setError(null);
    setResult(null);
    try {
      const cardIds = await openPack(wallet);
      setResult(cardIds);
      onOpened?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Pack open failed");
    } finally {
      setOpening(false);
    }
  }

  const resultCards = result?.map((id) => allCards.find((c) => c.card_id === id)).filter(Boolean) as (CardDef & { metadata?: CardMetadata })[] | undefined;

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 text-center space-y-4">
        <div className="text-6xl">🃏</div>
        <p className="text-gray-300">Each pack contains 5 cards</p>
        <p className="text-yellow-400 font-bold text-xl">{priceXlm} XLM</p>
        <button
          onClick={handleOpen}
          disabled={opening}
          className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold px-8 py-3 rounded-lg text-lg"
        >
          {opening ? "Opening…" : "Open Pack"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {resultCards && resultCards.length > 0 && (
        <div>
          <h3 className="text-white font-bold mb-3">You got:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {resultCards.map((card, i) => (
              <CardTile key={i} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
