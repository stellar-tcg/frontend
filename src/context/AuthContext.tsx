"use client";
import { createContext, useContext, useState } from "react";
import { connectWallet, signMessage } from "@/lib/freighter";
import { api, setToken, clearToken } from "@/lib/api";
import type { Player } from "@/lib/types";

interface AuthCtx {
  wallet: string | null;
  player: Player | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  async function login() {
    const address = await connectWallet();
    const { nonce } = await api.getNonce(address);
    const signature = await signMessage(nonce);
    const { access_token } = await api.verify(address, signature);
    setToken(access_token);
    setWallet(address);
    const me = await api.getMe();
    setPlayer(me);
  }

  function logout() {
    clearToken();
    setWallet(null);
    setPlayer(null);
  }

  return (
    <AuthContext.Provider value={{ wallet, player, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
