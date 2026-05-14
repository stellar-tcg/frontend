"use client";
import type { GameState, CardDef, CardMetadata, BattleAction, MatchResult } from "@/lib/types";
import { api } from "@/lib/api";

interface Props {
  matchId: string;
  gameState: GameState;
  wallet: string;
  allCards: (CardDef & { metadata?: CardMetadata })[];
  matchResult: MatchResult | null;
}

export function BattleBoard({ matchId, gameState, wallet, allCards, matchResult }: Props) {
  const myHand = gameState.hand[wallet] ?? [];
  const myBoard = gameState.board[wallet] ?? [];
  const myHp = gameState.hp[wallet] ?? 0;
  const isMyTurn = gameState.current_player === wallet;

  const opponentWallet = Object.keys(gameState.hp).find((w) => w !== wallet) ?? "";
  const oppBoard = gameState.board[opponentWallet] ?? [];
  const oppHp = gameState.hp[opponentWallet] ?? 0;

  function cardName(id: number) {
    return allCards.find((c) => c.card_id === id)?.metadata?.name ?? `Card #${id}`;
  }

  async function sendAction(action: BattleAction) {
    await api.submitAction(matchId, action);
  }

  if (matchResult) {
    const won = matchResult.winner === wallet;
    return (
      <div className="text-center space-y-4 py-12">
        <div className="text-6xl">{won ? "🏆" : matchResult.winner ? "💀" : "🤝"}</div>
        <h2 className="text-2xl font-bold text-white">
          {won ? "Victory!" : matchResult.winner ? "Defeat" : "Draw"}
        </h2>
        <p className="text-gray-400 text-sm">Reward tx: {matchResult.reward_tx_hash}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Opponent side */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-sm">Opponent</span>
          <span className="text-red-400 font-bold">❤️ {oppHp}</span>
        </div>
        <div className="flex gap-2 flex-wrap min-h-[80px]">
          {oppBoard.map((id, i) => (
            <button
              key={i}
              onClick={() => sendAction({ action_type: "attack", target: opponentWallet, card_id: id })}
              disabled={!isMyTurn}
              className="bg-gray-700 hover:bg-red-900 disabled:opacity-50 text-white text-xs px-3 py-2 rounded border border-gray-600"
            >
              {cardName(id)}
            </button>
          ))}
        </div>
      </div>

      {/* My side */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-green-400 text-sm">You {isMyTurn && "— Your Turn"}</span>
          <span className="text-red-400 font-bold">❤️ {myHp}</span>
        </div>
        <p className="text-gray-500 text-xs mb-2">Board</p>
        <div className="flex gap-2 flex-wrap min-h-[60px] mb-4">
          {myBoard.map((id, i) => (
            <span key={i} className="bg-indigo-800 text-white text-xs px-3 py-2 rounded">
              {cardName(id)}
            </span>
          ))}
        </div>
        <p className="text-gray-500 text-xs mb-2">Hand</p>
        <div className="flex gap-2 flex-wrap">
          {myHand.map((id, i) => (
            <button
              key={i}
              onClick={() => sendAction({ action_type: "play_card", card_id: id })}
              disabled={!isMyTurn}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs px-3 py-2 rounded"
            >
              {cardName(id)}
            </button>
          ))}
        </div>
        {isMyTurn && (
          <button
            onClick={() => sendAction({ action_type: "end_turn" })}
            className="mt-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
          >
            End Turn
          </button>
        )}
      </div>
      <p className="text-center text-gray-500 text-xs">Turn {gameState.turn}</p>
    </div>
  );
}
