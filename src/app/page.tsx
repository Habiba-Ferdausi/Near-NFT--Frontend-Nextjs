import ConnectBar from "@/components/ConnectBar";
import WalletLookup from "@/components/WalletLookup";
import { FaWallet, FaSearch } from "react-icons/fa";

export default function Page() {
  return (

      <main className="min-h-screen bg-white py-12 ">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2">
              <FaWallet color="#1DA1F2" /> NEAR NFT Lookup
            </h1>
            <p className="text-gray-600 mt-2">
              Connect your NEAR wallet to see balance, or manually check NFTs from another wallet.
            </p>
          </div>

          <ConnectBar />
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaSearch /> Lookup by Wallet ID
            </h2>
            <WalletLookup />
          </div>
        </div>
      </main>
  
  );
}
