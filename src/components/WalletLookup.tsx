'use client';

import { checkWallet } from '@/app/actions/checkWallet';
import { useTransition, useState } from 'react';
import { NFT } from './types/types';
import { AiOutlineLoading } from 'react-icons/ai';
import { CiSearch } from 'react-icons/ci';


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
    <div className="space-y-8  rounded-2xl p-1 shadow-lg bg-blue-50 backdrop-blur-md">
  
        <div className=" p-6">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
           
            NFT Wallet Lookup
          </h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
            
              <div className="flex gap-3">
                <input
                  id="walletId"
                  name="walletId"
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  placeholder="   Enter NEAR Wallet ID"
                  className="flex-1 p-2 border border-blue-100 rounded-lg text-black focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isPending || !walletId.trim()}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed  flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                     <AiOutlineLoading className='animate-spin' />
                      Searching
                    </>
                  ) : (
                    <>
                      <CiSearch />
                      Lookup
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
     {/* error ui showing */}

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 text-red-100">
          <div className="flex items-center gap-2">
           
            <h3 className="font-medium">Error</h3>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {exists === false && (
        <div className="bg-yellow-800/60 border border-yellow-700 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2">
          
            <h3 className="font-medium">Wallet Not Found</h3>
          </div>
          <p className="mt-1 text-sm">The wallet ID you entered doesn&#39;t exist or has no activity.</p>
        </div>
      )}

{/* NFT card showing */}

      {exists && (
        <div className="space-y-6 p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-black">
              {nfts.length === 0 ? 'No NFTs Found' : `Found ${nfts.length} NFT${nfts.length !== 1 ? 's' : ''}`}
            </h3>
            
          </div>

          {nfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {nfts.map((nft) => (
                <div key={`${nft.contractId}-${nft.token_id}`} className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1">
                  <div className="overflow-hidden">
                    {nft.media ? (
                      <img
                        src={nft.media}
                        alt={nft.title || nft.token_id}
                        className="w-full h-[300px]  transition-transform duration-500 hover:scale-105"
                      
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Media
                      </div>
                    )}
                  </div>
                  <div className="py-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-black/90 ">
                        {nft.title || `NFT #${nft.token_id.split(':').pop()}`}
                      </h4>
                      
                    </div>
                    
                    {nft.description && (
                      <p className="text-gray-600 text-sm mt-2 ">{nft.description}</p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <p className="text-gray-500">Token ID</p>
                        <p className="text-sm text-blue-500 ">
                          {nft.token_id}
                        </p>
                      </div>
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-gray-600 rounded-xl p-8 text-center">
              
              <h3 className="mt-3 text-lg font-medium text-gray-800">No NFTs Found</h3>
              <p className="mt-1 text-sm text-gray-600">This wallet doesn't contain any NFTs.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}