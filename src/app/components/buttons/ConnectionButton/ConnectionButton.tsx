'use client';

import { useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { ConnectorButtons } from '@/app/components/buttons/ConnectorButtons/ConnectorButtons';

export const ConnectionButton = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <div className="w-full items-start flex flex-col">
      {isConnected ? (
        <button
          className="hover:bg-gray-300 bg-white text-gray-500 p-4 rounded-md"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      ) : (
        <ConnectorButtons />
      )}
    </div>
  );
};
