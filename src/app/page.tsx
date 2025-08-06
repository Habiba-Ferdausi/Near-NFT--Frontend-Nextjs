import ConnectBar from "@/components/ConnectBar";
import WalletProvider from "./providers/WalletProvider";
import WalletLookup from "@/components/WalletLookup";


export default function Page() {
  return (
    <WalletProvider>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">NEAR NFT Lookup</h1>
        <p className="opacity-80">
          Connect a NEAR wallet, see its balance, or manually enter a wallet ID to fetch NFTs.
        </p>
        <div className="mt-4"><ConnectBar /></div>
       <WalletLookup/>
      </main>
    </WalletProvider>
  );
}
