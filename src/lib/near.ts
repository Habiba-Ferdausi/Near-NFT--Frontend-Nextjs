import { AccountView } from "@/components/types/types";
import { providers, utils } from "near-api-js";

const url =
  process.env.NEXT_PUBLIC_NEAR_NODE_URL || "https://rpc.testnet.near.org";
const provider = new providers.JsonRpcProvider({ url });



export async function getNearBalance(accountId: string): Promise<string> {
  const res = (await provider.query({
    request_type: "view_account",
    account_id: accountId,
    finality: "final",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any as AccountView;

  const formatted = utils.format.formatNearAmount(res.amount, 5);
  return `${formatted} NEAR`;
}
