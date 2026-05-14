"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Nav() {
  const { wallet, player, login, logout } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-yellow-400 font-bold text-lg">⭐ Stellar TCG</Link>
          <div className="hidden sm:flex gap-4 text-sm text-gray-300">
            <Link href="/inventory" className="hover:text-white">Inventory</Link>
            <Link href="/packs" className="hover:text-white">Packs</Link>
            <Link href="/deck-builder" className="hover:text-white">Decks</Link>
            <Link href="/marketplace" className="hover:text-white">Market</Link>
            <Link href="/battle" className="hover:text-white">Battle</Link>
            <Link href="/leaderboard" className="hover:text-white">Leaderboard</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {wallet ? (
            <>
              <span className="text-gray-400 text-xs hidden sm:block">
                {player?.username ?? `${wallet.slice(0, 6)}…${wallet.slice(-4)}`}
              </span>
              <button onClick={logout} className="text-sm text-gray-400 hover:text-white">
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
