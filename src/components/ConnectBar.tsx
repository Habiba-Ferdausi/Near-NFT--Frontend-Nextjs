"use client";

import { useEffect, useState } from "react";
import { getNearBalance } from "@/lib/near";
import { useWallet } from "@/app/providers/WalletProvider";
import { LiaLinkSolid } from "react-icons/lia";
import { MdAccountBalanceWallet } from "react-icons/md";

export default function ConnectBar() {
  const { accountId, signIn, signOut } = useWallet();
  const [balance, setBalance] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchBalance = async () => {
      if (!accountId) return;
      setLoading(true);
      setError(null);
      try {
        const b = await getNearBalance(accountId);
        if (active) setBalance(b);
      } catch (err) {
        if (active) setError("Failed to load balance");
        console.error("Balance error:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBalance();

    return () => {
      active = false;
    };
  }, [accountId]);

  return (
    <div className="backdrop-blur-md rounded-3xl p-[1px] shadow-xl">
      <div className="bg-blue-50/50 rounded-[23px] p-6">
        {!accountId ? (
          <button
            onClick={signIn}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            <LiaLinkSolid size={32}/>
            </div>
            Connect NEAR Wallet
          </button>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
               
                <MdAccountBalanceWallet size={32} color="purple"/>
                <div>
                  <p className="text-xs text-gray-700 font-mono">NEAR ACCOUNT</p>
                  <p className="font-medium text-black text-lg truncate max-w-[200px]">{accountId}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-gray-800  p-2 rounded-lg border"
              >
                Sign Out
              </button>
            </div>

            <div className="bg-blue-100 rounded-2xl p-5">
              <p className="text-sm text-gray-800 mb-2 font-mono">BALANCE</p>
              <div className="flex items-center justify-between">
                {loading ? (
                  <div className="h-8 w-32 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-lg animate-pulse"></div>
                ) : error ? (
                  <p className="text-red-400 text-sm">{error}</p>
                ) : (
                  <p className="text-3xl font-bold text-blue-800">{balance || "0"}</p>
                )}
              
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}