"use client";
import { useState } from "react";
import type { CardDef, CardMetadata } from "@/lib/types";
import { CardTile } from "./CardTile";

const MAX_DECK_SIZE = 20;

interface Props {
  inventory: (CardDef & { metadata?: CardMetadata; balance: number })[];
  onSave: (name: string, cardIds: number[]) => Promise<void>;
}

export function DeckBuilder({ inventory, onSave }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(cardId: number) {
    setSelected((prev) => {
      if (prev.includes(cardId)) return prev.filter((id) => id !== cardId);
      if (prev.length >= MAX_DECK_SIZE) return prev;
      return [...prev, cardId];
    });
  }

  async function handleSave() {
    if (!name.trim()) { setError("Deck name required"); return; }
    if (selected.length === 0) { setError("Select at least one card"); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(name.trim(), selected);
      setSelected([]);
      setName("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white flex-1"
          placeholder="Deck name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="text-gray-400 text-sm">{selected.length}/{MAX_DECK_SIZE}</span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving…" : "Save Deck"}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {inventory.map((card) => (
          <CardTile
            key={card.card_id}
            card={card}
            selected={selected.includes(card.card_id)}
            onClick={() => toggle(card.card_id)}
          />
        ))}
      </div>
    </div>
  );
}
