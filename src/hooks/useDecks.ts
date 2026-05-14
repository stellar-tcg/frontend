import useSWR from "swr";
import { api } from "@/lib/api";

export function useDecks() {
  const { data, mutate, error, isLoading } = useSWR("/decks", api.getDecks);

  const create = async (name: string, card_ids: number[]) => {
    await api.createDeck(name, card_ids);
    mutate();
  };

  const update = async (id: string, name: string, card_ids: number[]) => {
    await api.updateDeck(id, name, card_ids);
    mutate();
  };

  const remove = async (id: string) => {
    await api.deleteDeck(id);
    mutate();
  };

  return { decks: data, create, update, remove, error, isLoading };
}
