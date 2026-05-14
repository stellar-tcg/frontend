import type { Player, CardDef, Deck, GameState, BattleAction } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

let _jwt: string | null = null;
export const setToken = (t: string) => { _jwt = t; };
export const clearToken = () => { _jwt = null; };
export const _getToken = () => _jwt;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (_jwt) headers["Authorization"] = `Bearer ${_jwt}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  getNonce: (wallet_address: string) =>
    request<{ nonce: string }>("/auth/nonce", { method: "POST", body: JSON.stringify({ wallet_address }) }),

  verify: (wallet_address: string, signature: string) =>
    request<{ access_token: string }>("/auth/verify", { method: "POST", body: JSON.stringify({ wallet_address, signature }) }),

  getMe: () => request<Player>("/players/me"),
  getPlayer: (wallet: string) => request<Player>(`/players/${wallet}`),
  updateUsername: (username: string) =>
    request<Player>("/players/me/username", { method: "PUT", body: JSON.stringify({ username }) }),

  getCards: () => request<CardDef[]>("/cards"),
  getCard: (id: number) => request<CardDef>(`/cards/${id}`),
  getPlayerCards: (wallet: string) =>
    request<{ card_id: number; balance: number }[]>(`/cards/player/${wallet}`),

  getDecks: () => request<Deck[]>("/decks"),
  createDeck: (name: string, card_ids: number[]) =>
    request<Deck>("/decks", { method: "POST", body: JSON.stringify({ name, card_ids }) }),
  updateDeck: (id: string, name: string, card_ids: number[]) =>
    request<Deck>(`/decks/${id}`, { method: "PUT", body: JSON.stringify({ name, card_ids }) }),
  deleteDeck: (id: string) => request<void>(`/decks/${id}`, { method: "DELETE" }),

  getPackPrice: () =>
    request<{ price_stroops: string; price_xlm: string }>("/packs/price"),

  joinQueue: () => request<{ queue_id: string }>("/matchmaking/queue", { method: "POST" }),
  leaveQueue: () => request<void>("/matchmaking/queue", { method: "DELETE" }),

  submitAction: (matchId: string, action: BattleAction) =>
    request<GameState>(`/battles/${matchId}/action`, { method: "POST", body: JSON.stringify(action) }),
  getBattleState: (matchId: string) => request<GameState>(`/battles/${matchId}/state`),

  getLeaderboard: () => request<Player[]>("/players"),
};
