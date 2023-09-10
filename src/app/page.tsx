'use client';

import { useAccount } from 'wagmi';

import { ConnectionButton } from '@/app/components/buttons/ConnectionButton/ConnectionButton';
import { NetworkSelector } from '@/app/components/NetworkSelector/NetworkSelector';
import { WalletDetails } from '@/app/components/WalletDetails/WalletDetails';

export default function Home() {
  const { address, isConnected, isConnecting } = useAccount();

  return (
    <main className="flex min-h-screen p-24">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col">
          <WalletDetails
            address={address}
            isConnected={isConnected}
            isConnecting={isConnecting}
          />
          <NetworkSelector />
        </div>
        <div className="flex">
          <ConnectionButton />
        </div>
      </div>
    </main>
  );
}
