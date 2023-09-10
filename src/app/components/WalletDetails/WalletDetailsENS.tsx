import { useEnsAvatar, useEnsName } from 'wagmi';

import { ETHEREUM_CHAIN_ID } from '@/app/utils/chains';

type WalletDetailsENSProps = {
  address?: `0x${string}`;
};

export const WalletDetailsENS = ({ address }: WalletDetailsENSProps) => {
  const {
    data: ensName,
    isLoading: useEnsNameIsLoading,
    isError: useEnsNameIsError,
  } = useEnsName({ address, chainId: ETHEREUM_CHAIN_ID });

  const { data: ensPhoto } = useEnsAvatar({
    chainId: ETHEREUM_CHAIN_ID,
    name: ensName,
  });

  if (useEnsNameIsLoading) {
    return <div className="text-white">ENS details loading...</div>;
  }

  if (useEnsNameIsError) {
    return <div>ENS details error</div>;
  }

  if (!ensName) {
    return null;
  }

  return (
    <div className="flex flex-row items-center mb-8">
      {ensPhoto && (
        <div>
          <img
            alt="ENS Photo"
            className="w-16 h-16 rounded-full mr-2"
            height={64}
            src={ensPhoto}
            width={64}
          />
        </div>
      )}
      <div className="font-bold">{ensName}</div>
    </div>
  );
};
