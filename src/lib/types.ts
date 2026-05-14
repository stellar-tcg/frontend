export interface Player {
  id: string;
  wallet_address: string;
  username: string;
  elo: number;
  created_at: string;
}

export interface CardDef {
  card_id: number;
  asset_code: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  max_supply: number;
  minted: number;
  metadata_url?: string;
}

export interface CardMetadata {
  card_id: number;
  name: string;
  rarity: string;
  attack: number;
  defense: number;
  mana: number;
  description: string;
  image: string;
  animation?: string;
  season: number;
}

export interface Deck {
  id: string;
  player_id: string;
  name: string;
  card_ids: number[];
  created_at: string;
}

export interface GameState {
  match_id: string;
  turn: number;
  current_player: string;
  board: Record<string, number[]>;
  hand: Record<string, number[]>;
  hp: Record<string, number>;
}

export interface BattleAction {
  action_type: "play_card" | "attack" | "end_turn";
  card_id?: number;
  target?: string;
}

export interface MatchResult {
  winner: string | null;
  outcome: "win" | "draw";
  reward_tx_hash: string;
}
