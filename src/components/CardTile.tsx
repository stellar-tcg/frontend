"use client";
import type { CardDef, CardMetadata } from "@/lib/types";

const RARITY_BORDER: Record<string, string> = {
  Common: "border-gray-400",
  Rare: "border-blue-500",
  Epic: "border-purple-500",
  Legendary: "border-yellow-400",
};

const RARITY_BADGE: Record<string, string> = {
  Common: "bg-gray-600",
  Rare: "bg-blue-600",
  Epic: "bg-purple-600",
  Legendary: "bg-yellow-500 text-black",
};

interface Props {
  card: CardDef & { metadata?: CardMetadata; balance?: number };
  selected?: boolean;
  onClick?: () => void;
}

export function CardTile({ card, selected, onClick }: Props) {
  const imgSrc = card.metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/");

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-2 cursor-pointer transition-transform hover:scale-105 bg-gray-900
        ${RARITY_BORDER[card.rarity]}
        ${selected ? "ring-2 ring-white scale-105" : ""}
      `}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={card.metadata?.name ?? card.asset_code} className="w-full h-32 object-cover rounded" />
      ) : (
        <div className="w-full h-32 bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
          {card.asset_code}
        </div>
      )}
      <p className="font-bold text-white mt-1 truncate">{card.metadata?.name ?? card.asset_code}</p>
      <div className="flex justify-between items-center mt-1">
        <span className={`text-xs px-1 rounded ${RARITY_BADGE[card.rarity]} text-white`}>
          {card.rarity}
        </span>
        {card.metadata && (
          <span className="text-xs text-gray-400">
            ⚔{card.metadata.attack} 🛡{card.metadata.defense} 💧{card.metadata.mana}
          </span>
        )}
      </div>
      {card.balance !== undefined && (
        <p className="text-xs text-gray-500 mt-1">x{card.balance}</p>
      )}
    </div>
  );
}
