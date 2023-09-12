import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useBalance, useEnsAddress } from 'wagmi';
import { GetAccountResult } from 'wagmi/actions';

import { validateAddress } from '@/app/components/SearchWalletDetails/utils';
import { WalletDetails } from '@/app/components/WalletDetails/WalletDetails';

export type SearchWalletDetailsProps = Pick<
  GetAccountResult,
  'address' | 'isConnected' | 'isConnecting'
>;

export const SearchWalletDetails = () => {
  const [addressValue, setAddressValue] = useState('');

  const { data: addressForEns } = useEnsAddress({
    name: addressValue.includes('.eth') ? addressValue : undefined,
  });

  const validatedAddress = useMemo(() => {
    return validateAddress(addressForEns || addressValue);
  }, [addressForEns, addressValue]);

  const {
    data: balanceData,
    isFetching: isFetchingBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address: validatedAddress,
  });

  const handleSetAddressValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAddressValue(event.target.value);
    },
    []
  );

  return (
    <div className="flex flex-col text-white py-8 px-12 border-white-500 border-2 rounded-2xl mt-8">
      <div className="font-bold">Search for a Wallet</div>
      <input
        className="bg-black border-2 border-white-500 py-2 px-4 mt-2 w-full mb-8"
        onChange={handleSetAddressValue}
        placeholder="ENS name or 0x address"
        type="text"
        value={addressValue}
      />
      <WalletDetails
        address={validatedAddress}
        isConnected={!!balanceData}
        isConnecting={(!balanceData && isFetchingBalance) || isLoadingBalance}
        notConnectedText={
          addressValue ? 'Not found' : 'Enter ENS or 0x address'
        }
      />
    </div>
  );
};
