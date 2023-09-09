import { useBalance } from 'wagmi';

type WalletDetailsBalanceProps = {
  address?: `0x${string}`;
};

export const WalletDetailsBalance = ({
  address,
}: WalletDetailsBalanceProps) => {
  const {
    data: balanceData,
    isError: useBalanceIsError,
    isLoading: useBalanceIsLoading,
  } = useBalance({
    address,
  });

  const truncatedBalance = balanceData?.formatted
    ? balanceData?.formatted.slice(0, 7)
    : null;

  if (useBalanceIsLoading) {
    return <div className="text-white">Balance: loading...</div>;
  }

  if (useBalanceIsError) {
    return <div>Balance: error</div>;
  }

  return (
    <div>
      Balance:{' '}
      {truncatedBalance ? `${truncatedBalance} ${balanceData?.symbol}` : 'n/a'}
    </div>
  );
};
