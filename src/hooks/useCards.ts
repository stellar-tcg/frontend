import useSWR from "swr";
import { api } from "@/lib/api";

export function usePlayerCards(wallet: string | null) {
  return useSWR(
    wallet ? `/cards/player/${wallet}` : null,
    () => api.getPlayerCards(wallet!),
  );
}

export function useAllCards() {
  return useSWR("/cards", api.getCards);
}

export function useCard(id: number | null) {
  return useSWR(id != null ? `/cards/${id}` : null, () => api.getCard(id!));
}
