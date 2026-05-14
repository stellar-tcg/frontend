"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBattle } from "@/hooks/useBattle";
import { useAllCards } from "@/hooks/useCards";
import { BattleBoard } from "@/components/BattleBoard";
import { api } from "@/lib/api";

// We need the raw JWT for the socket — expose it via a helper
import { _getToken } from "@/lib/api";

export default function BattlePage() {
  const { wallet, player, login } = useAuth();
  const { data: allCards } = useAllCards();
  const token = _getToken();
  const { matchId, gameState, matchResult, opponent } = useBattle(token);
  const [inQueue, setInQueue] = useState(false);
  const [queueError, setQueueError] = useState<string | null>(null);

  async function joinQueue() {
    setQueueError(null);
    try {
      await api.joinQueue();
      setInQueue(true);
    } catch (e: unknown) {
      setQueueError(e instanceof Error ? e.message : "Failed to join queue");
    }
  }

  async function leaveQueue() {
    await api.leaveQueue().catch(() => {});
    setInQueue(false);
  }

  if (!wallet) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400">Connect your wallet to battle.</p>
        <button onClick={login} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (matchId && gameState) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Battle</h1>
          {opponent && (
            <span className="text-gray-400 text-sm">vs {opponent.username}</span>
          )}
        </div>
        <BattleBoard
          matchId={matchId}
          gameState={gameState}
          wallet={wallet}
          allCards={allCards ?? []}
          matchResult={matchResult}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-16">
      <h1 className="text-2xl font-bold">Battle</h1>
      <div className="bg-gray-800 rounded-xl p-8 space-y-4">
        <div className="text-5xl">⚔️</div>
        <p className="text-gray-300">ELO: <span className="text-yellow-400 font-bold">{player?.elo ?? "—"}</span></p>
        {inQueue ? (
          <>
            <div className="flex items-center justify-center gap-2 text-green-400">
              <span className="animate-pulse">●</span>
              <span>Searching for opponent…</span>
            </div>
            <button onClick={leaveQueue} className="text-gray-400 hover:text-white text-sm underline">
              Leave Queue
            </button>
          </>
        ) : (
          <>
            <button
              onClick={joinQueue}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold w-full"
            >
              Find Match
            </button>
            {queueError && <p className="text-red-400 text-sm">{queueError}</p>}
          </>
        )}
      </div>
    </div>
  );
}
