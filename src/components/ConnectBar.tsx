"use client";

import { useEffect, useState } from "react";
import { getNearBalance } from "@/lib/near";
import { useWallet } from "@/app/providers/WalletProvider";

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
    <div className="flex items-center justify-between gap-4 p-4 border rounded-md shadow-sm max-w-xl mx-auto bg-white">
      {!accountId ? (
        <button
          onClick={signIn}
          className="px-4 py-2 text-white bg-black rounded hover:opacity-90 transition"
        >
          Connect NEAR Wallet
        </button>
      ) : (
        <>
          <div className="text-sm flex-1">
            <div><strong>Connected:</strong> {accountId}</div>
            <div className="opacity-80">
              <strong>Balance:</strong>{" "}
              {loading
                ? "Loading..."
                : error
                ? <span className="text-red-500">{error}</span>
                : balance || "—"}
            </div>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100 transition"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}
