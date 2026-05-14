"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET ?? "";

export default function AdminPage() {
  const { wallet, login } = useAuth();

  // Register card form
  const [cardId, setCardId] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [rarity, setRarity] = useState("Common");
  const [maxSupply, setMaxSupply] = useState("1000");
  const [regStatus, setRegStatus] = useState<string | null>(null);

  // Update username form
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<string | null>(null);

  if (!wallet) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400">Admin access requires wallet connection.</p>
        <button onClick={login} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (ADMIN_WALLET && wallet !== ADMIN_WALLET) {
    return <p className="text-center py-20 text-red-400">Access denied. Admin wallet required.</p>;
  }

  async function handleRegister() {
    setRegStatus(null);
    try {
      // Card registration is a backend-admin operation — call backend endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: Number(cardId), asset_code: assetCode, rarity, max_supply: Number(maxSupply) }),
      });
      if (!res.ok) throw new Error(await res.text());
      setRegStatus("Card registered successfully.");
      setCardId(""); setAssetCode(""); setRarity("Common"); setMaxSupply("1000");
    } catch (e: unknown) {
      setRegStatus(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
    }
  }

  async function handleUpdateUsername() {
    setUsernameStatus(null);
    try {
      await api.updateUsername(username);
      setUsernameStatus("Username updated.");
      setUsername("");
    } catch (e: unknown) {
      setUsernameStatus(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Register Card</h2>
        <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Card ID (number)" value={cardId} onChange={(e) => setCardId(e.target.value)} />
        <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Asset code (e.g. FIRDRGN)" value={assetCode} onChange={(e) => setAssetCode(e.target.value)} />
        <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={rarity} onChange={(e) => setRarity(e.target.value)}>
          {["Common", "Rare", "Epic", "Legendary"].map((r) => <option key={r}>{r}</option>)}
        </select>
        <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Max supply" value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} />
        <button onClick={handleRegister} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full">
          Register Card
        </button>
        {regStatus && <p className={`text-sm ${regStatus.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>{regStatus}</p>}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Update Username</h2>
        <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="New username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={handleUpdateUsername} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full">
          Update
        </button>
        {usernameStatus && <p className={`text-sm ${usernameStatus.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>{usernameStatus}</p>}
      </div>
    </div>
  );
}
