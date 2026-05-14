import freighter from "@stellar/freighter-api";

const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === "TESTNET"
    ? "Test SDF Network ; September 2015"
    : "Public Global Stellar Network ; September 2015";

export async function connectWallet(): Promise<string> {
  await freighter.setAllowed();
  const { address } = await freighter.getAddress();
  return address;
}

export async function signMessage(message: string): Promise<string> {
  const { signedMessage } = await freighter.signMessage(message, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  return Buffer.from(signedMessage ?? "").toString("hex");
}

export async function signTransaction(xdr: string): Promise<string> {
  const { signedTxXdr } = await freighter.signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  return signedTxXdr;
}
