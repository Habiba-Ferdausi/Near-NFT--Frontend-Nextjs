"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  setupWalletSelector,
  WalletSelector,
  AccountState,
} from "@near-wallet-selector/core";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupIntearWallet } from "@near-wallet-selector/intear-wallet";
import { setupHotWallet } from "@near-wallet-selector/hot-wallet";
import {
  setupModal,
  WalletSelectorModal,
} from "@near-wallet-selector/modal-ui";
import "@near-wallet-selector/modal-ui/styles.css";
import { WalletContextType } from "@/components/types/types";



const WalletCtx = createContext<WalletContextType>({
  selector: null,
  modal: null,
  accountId: null,
  signIn: () => {},
  signOut: async () => {},
});

export function useWallet() {
  return useContext(WalletCtx);
}

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);

  const accountId = useMemo(
    () => accounts[0]?.accountId ?? null,
    [accounts]
  );

  useEffect(() => {
    (async () => {
      const network =
        (process.env.NEXT_PUBLIC_NEAR_NETWORK as "testnet") || "testnet";

      const _selector = await setupWalletSelector({
        network,
        modules: [
          setupMeteorWallet(),
          setupIntearWallet(),
          setupHotWallet(),
        ],
      });

      const _modal = setupModal(_selector, { contractId: "" });
      const state = _selector.store.getState();

      setSelector(_selector);
      setModal(_modal);
      setAccounts(state.accounts);

      const sub = _selector.store.observable.subscribe((next) => {
        setAccounts(next.accounts);
      });

      return () => sub.unsubscribe();
    })();
  }, []);

  const signIn = () => modal?.show();

  const signOut = async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    await wallet.signOut();
  };

  return (
    <WalletCtx.Provider
      value={{ selector, modal, accountId, signIn, signOut }}
    >
      {children}
    </WalletCtx.Provider>
  );
}
