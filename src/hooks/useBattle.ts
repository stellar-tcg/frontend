import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { GameState, MatchResult } from "@/lib/types";

export function useBattle(token: string | null) {
  const socket = useRef<Socket | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [opponent, setOpponent] = useState<{ wallet: string; username: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}/matchmaking`, {
      auth: { token },
    });

    socket.current.on("match_found", ({ match_id, opponent_wallet, opponent_username }: { match_id: string; opponent_wallet: string; opponent_username: string }) => {
      setMatchId(match_id);
      setOpponent({ wallet: opponent_wallet, username: opponent_username });
    });

    socket.current.on("game_state", (state: GameState) => setGameState(state));
    socket.current.on("match_ended", (result: MatchResult) => setMatchResult(result));

    return () => {
      socket.current?.disconnect();
    };
  }, [token]);

  return { matchId, gameState, matchResult, opponent };
}
