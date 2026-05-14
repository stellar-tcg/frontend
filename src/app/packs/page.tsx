"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAllCards } from "@/hooks/useCards";
import { PackOpener } from "@/components/PackOpener";
import { api } from "@/lib/api";

export default function PacksPage() {
  const { wallet, login } = useAuth();
  const { data: allCards } = useAllCards();
  const [priceXlm, setPriceXlm] = useState<string>("1");

  useEffect(() => {
    api.getPackPrice().then((p) => setPriceXlm(p.price_xlm)).catch(() => {});
  }, []);

  if (!wallet) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400">Connect your wallet to open packs.</p>
        <button onClick={login} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Card Packs</h1>
      <div className="text-sm text-gray-400 space-y-1">
        <p>🟢 Common — 70% &nbsp; 🔵 Rare — 20% &nbsp; 🟣 Epic — 8% &nbsp; 🟡 Legendary — 2%</p>
      </div>
      <PackOpener wallet={wallet} priceXlm={priceXlm} allCards={allCards ?? []} />
    </div>
  );
}
