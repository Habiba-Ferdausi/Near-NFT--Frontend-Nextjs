import {
  WalletSelector,
} from "@near-wallet-selector/core";
import { WalletSelectorModal } from "@near-wallet-selector/modal-ui";

export type AccountView = {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
};
export type WalletContextType = {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  accountId: string | null;
  signIn: () => void;
  signOut: () => Promise<void>;
};