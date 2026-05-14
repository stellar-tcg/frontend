"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAllCards } from "@/hooks/useCards";
import { transferCard } from "@/lib/stellar";

interface HorizonOffer {
  id: string;
  seller: string;
  selling: { asset_code?: string; asset_type: string };
  buying: { asset_code?: string; asset_type: string };
  amount: string;
  price: string;
}

export default function MarketplacePage() {
  const { wallet, login } = useAuth();
  const { data: allCards } = useAllCards();
  const [offers, setOffers] = useState<HorizonOffer[]>([]);
  const [loading, setLoading] = useState(true);

  // Transfer form state
  const [toAddress, setToAddress] = useState("");
  const [cardId, setCardId] = useState("");
  const [amount, setAmount] = useState("1");
  const [transferring, setTransferring] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState(false);

  useEffect(() => {
    // Fetch open offers from Horizon for cards issued by the registry
    const horizonBase = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "TESTNET"
      ? "https://horizon-testnet.stellar.org"
      : "https://horizon.stellar.org";
    fetch(`${horizonBase}/offers?limit=20&order=desc`)
      .then((r) => r.json())
      .then((d) => setOffers(d._embedded?.records ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleTransfer() {
    if (!wallet) return;
    setTransferring(true);
    setTxError(null);
    setTxSuccess(false);
    try {
      await transferCard(wallet, toAddress, Number(cardId), Number(amount));
      setTxSuccess(true);
      setToAddress(""); setCardId(""); setAmount("1");
    } catch (e: unknown) {
      setTxError(e instanceof Error ? e.message : "Transfer failed");
    } finally {
      setTransferring(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Marketplace</h1>
      <p className="text-gray-400 text-sm">Cards trade on Stellar&apos;s native DEX. Use LOBSTR or Stellar Laboratory for full order management.</p>

      {/* P2P Transfer */}
      <div className="bg-gray-800 rounded-xl p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold text-lg">Send Card</h2>
        {!wallet ? (
          <button onClick={login} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Connect Wallet
          </button>
        ) : (
          <>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
            >
              <option value="">Select card</option>
              {allCards?.map((c) => (
                <option key={c.card_id} value={c.card_id}>{c.asset_code} (#{c.card_id})</option>
              ))}
            </select>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="Recipient address (G...)"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
            <input
              type="number"
              min="1"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={handleTransfer}
              disabled={transferring || !toAddress || !cardId}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded w-full"
            >
              {transferring ? "Sending…" : "Send Card"}
            </button>
            {txError && <p className="text-red-400 text-sm">{txError}</p>}
            {txSuccess && <p className="text-green-400 text-sm">Transfer successful!</p>}
          </>
        )}
      </div>

      {/* DEX Offers */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Open DEX Offers</h2>
        {loading ? (
          <p className="text-gray-400">Loading offers…</p>
        ) : offers.length === 0 ? (
          <p className="text-gray-400">No open offers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-2 pr-4">Selling</th>
                  <th className="py-2 pr-4">Buying</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2">Seller</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-2 pr-4">{o.selling.asset_code ?? "XLM"}</td>
                    <td className="py-2 pr-4">{o.buying.asset_code ?? "XLM"}</td>
                    <td className="py-2 pr-4">{o.amount}</td>
                    <td className="py-2 pr-4">{o.price}</td>
                    <td className="py-2 text-gray-400 text-xs">{o.seller.slice(0, 8)}…</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
