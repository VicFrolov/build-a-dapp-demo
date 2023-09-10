import { useCallback } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export const NetworkSelector = () => {
  const { chain: activeChain } = useNetwork();
  const { chains, switchNetwork, error, isLoading } = useSwitchNetwork();

  const handleButtonClick = useCallback(
    (chainId?: number) => {
      if (chainId && switchNetwork) {
        switchNetwork(chainId);
      }
    },
    [switchNetwork]
  );

  if (!chains || chains.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col text-white py-4 px-8 border-white-500 border-2 rounded-2xl mt-8 w-96">
      <div className="font-bold mb-2">
        Supported networks {isLoading && '(loading)'}
      </div>
      {chains.map((chain) => (
        <div key={chain.id}>
          <button
            className={`hover:bg-gray-50 text-gray-500 rounded-full mb-4 px-4 mr-4 ${
              chain.id === activeChain?.id && chain.name === activeChain?.name
                ? 'bg-white font-bold'
                : 'bg-white opacity-70'
            }`}
            disabled={isLoading}
            onClick={() => handleButtonClick(chain.id)}
          >
            {chain.name}
          </button>
        </div>
      ))}
      {error && (
        <div className="text-red-500 text-sm max-w-xs">{error.message}</div>
      )}
    </div>
  );
};
