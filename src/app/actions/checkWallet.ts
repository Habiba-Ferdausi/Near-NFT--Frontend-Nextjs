'use server';

export async function checkWallet(walletId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletId }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data?.error || 'Request failed');

return {
  success: true,
  exists: data.exists as boolean,
  nfts: data.nfts || [],
};

  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Something went wrong',
    };
  }
}
