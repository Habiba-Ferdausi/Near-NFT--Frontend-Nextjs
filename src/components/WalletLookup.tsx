'use client';

import { checkWallet } from '@/app/actions/checkWallet';
import { useTransition, useState } from 'react';

type NFT = {
  token_id: string;
  title?: string;
  description?: string;
  media?: string;
  contractId: string;
};

export default function WalletLookup() {
  const [walletId, setWalletId] = useState('');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const id = formData.get('walletId') as string;

 startTransition(async () => {
  setExists(null);
  setError(null);
  setNfts([]);

  const result = await checkWallet(id);

  if (!result.success) {
    setError(result.error);
    return;
  }

  setExists(result.exists ?? null);
  setNfts(result.nfts);
});

  }

  return (
    <div className="mt-6">
      <form action={handleSubmit} className="flex gap-2">
        <input
          name="walletId"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          placeholder="e.g. sillyherb213.testnet"
          className="flex-1 p-2 border rounded"
        />
        <button className="px-4 py-2 border rounded" disabled={isPending}>
          {isPending ? 'Checking…' : 'Check Wallet'}
        </button>
      </form>

      {error && <p className="mt-3 text-red-600">Error: {error}</p>}
      {exists === false && <p className="mt-3">Wallet not found. Please try another ID.</p>}

      {exists && (
        <div className="mt-4">
          {nfts.length === 0 ? (
            <p>No NFTs found for this wallet.</p>
          ) : (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
              {nfts.map((nft) => (
                <div key={`${nft.contractId}-${nft.token_id}`} className="border rounded p-3">
                  {nft.media ? (
                    <img
                      src={nft.media}
                      alt={nft.title || nft.token_id}
                      className="w-full h-48 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded grid place-items-center">
                      <span>No image</span>
                    </div>
                  )}
                  <div className="mt-2 text-sm">
                    <div><strong>Title:</strong> {nft.title || '—'}</div>
                    <div className="line-clamp-3"><strong>Description:</strong> {nft.description || '—'}</div>
                    <div><strong>Token ID:</strong> {nft.token_id}</div>
                    <div className="opacity-70"><strong>Contract:</strong> {nft.contractId}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
