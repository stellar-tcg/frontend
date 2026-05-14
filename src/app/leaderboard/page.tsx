"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import type { Player } from "@/lib/types";

export default function LeaderboardPage() {
  const { data: players, isLoading } = useSWR<Player[]>("/players", api.getLeaderboard);

  const sorted = [...(players ?? [])].sort((a, b) => b.elo - a.elo);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : sorted.length === 0 ? (
        <p className="text-gray-400">No players yet.</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="bg-gray-800 rounded-lg px-4 py-3 flex items-center gap-4">
              <span className={`font-bold text-lg w-8 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500"}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium">{p.username}</p>
                <p className="text-gray-400 text-xs">{p.wallet_address.slice(0, 8)}…</p>
              </div>
              <span className="text-yellow-400 font-bold">{p.elo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
