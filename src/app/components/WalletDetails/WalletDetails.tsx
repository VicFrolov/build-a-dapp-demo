import { GetAccountResult } from 'wagmi/actions';

import { WalletDetailsBalance } from '@/app/components/WalletDetails/WalletDetailsBalance';
import { WalletDetailsENS } from '@/app/components/WalletDetails/WalletDetailsENS';

export type WalletDetailsProps = Pick<
  GetAccountResult,
  'address' | 'isConnected' | 'isConnecting'
>;

export const WalletDetails = ({
  address,
  isConnecting,
  isConnected,
}: WalletDetailsProps) => {
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'not connected';

  if (isConnecting) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col text-white py-8 px-12 border-white-500 border-2 rounded-2xl">
      {isConnected ? (
        <>
          <WalletDetailsENS address={address} />
          <div>Address: {truncatedAddress}</div>
          <WalletDetailsBalance address={address} />
        </>
      ) : (
        <div>not connected</div>
      )}
    </div>
  );
};
