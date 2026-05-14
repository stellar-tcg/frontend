import {
  Contract,
  rpc as SorobanRpc,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";
import { signTransaction } from "./freighter";

const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

function getServer() {
  return new SorobanRpc.Server(process.env.NEXT_PUBLIC_STELLAR_RPC_URL!);
}

/** Open a pack — buyer signs on-chain. Returns minted card IDs. */
export async function openPack(buyerAddress: string): Promise<number[]> {
  const server = getServer();
  const contract = new Contract(process.env.NEXT_PUBLIC_PACK_CONTRACT!);
  const account = await server.getAccount(buyerAddress);
  const tx = new TransactionBuilder(account, { fee: "1000000", networkPassphrase: NETWORK_PASSPHRASE })
    .addOperation(contract.call("open_pack", nativeToScVal(buyerAddress, { type: "address" })))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  const signedXdr = await signTransaction(prepared.toXDR());
  const signed = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const send = await server.sendTransaction(signed);

  let result;
  do {
    await new Promise((r) => setTimeout(r, 2000));
    result = await server.getTransaction(send.hash);
  } while (result.status === "NOT_FOUND");

  if (result.status !== "SUCCESS") throw new Error("Pack open failed");
  return scValToNative((result as SorobanRpc.Api.GetSuccessfulTransactionResponse).returnValue!) as number[];
}

/** Transfer a card to another player — sender signs on-chain. */
export async function transferCard(
  from: string,
  to: string,
  cardId: number,
  amount: number,
): Promise<void> {
  const server = getServer();
  const contract = new Contract(process.env.NEXT_PUBLIC_REGISTRY_CONTRACT!);
  const account = await server.getAccount(from);
  const tx = new TransactionBuilder(account, { fee: "1000000", networkPassphrase: NETWORK_PASSPHRASE })
    .addOperation(
      contract.call(
        "transfer",
        nativeToScVal(from, { type: "address" }),
        nativeToScVal(to, { type: "address" }),
        nativeToScVal(cardId, { type: "u32" }),
        nativeToScVal(amount, { type: "u32" }),
      ),
    )
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  const signedXdr = await signTransaction(prepared.toXDR());
  const signed = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  await server.sendTransaction(signed);
}
