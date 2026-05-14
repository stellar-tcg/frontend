"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { wallet, login } = useAuth();

  return (
    <div className="text-center space-y-8 py-16">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-yellow-400">⭐ Stellar TCG</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          A blockchain-powered trading card game. Own your cards on Stellar, trade on the native DEX, battle for real rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
        {[
          { icon: "🃏", title: "True Ownership", desc: "Cards are Stellar assets in your wallet — not a database entry." },
          { icon: "⚡", title: "Instant Trading", desc: "Trade on Stellar's native DEX. Settlements in ~5 seconds." },
          { icon: "🏆", title: "Earn Rewards", desc: "Win battles to earn XLM and rare cards on-chain." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-gray-800 rounded-xl p-5 space-y-2">
            <div className="text-3xl">{icon}</div>
            <h3 className="font-bold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {wallet ? (
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/inventory" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold">
            View Inventory
          </Link>
          <Link href="/packs" className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold">
            Open Packs
          </Link>
          <Link href="/battle" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold">
            Battle Now
          </Link>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-bold text-lg"
        >
          Connect Freighter Wallet
        </button>
      )}
    </div>
  );
}
