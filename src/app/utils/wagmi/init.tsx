'use client';

import { ReactNode, useEffect, useState } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, goerli, mainnet, polygon } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { infuraProvider } from 'wagmi/providers/infura'; // Uncomment if infura API key is added to .env
import { publicProvider } from 'wagmi/providers/public';

// const infuraProviderKey = process.env.INFURA_PROVIDER_KEY; // Uncomment if infura API key is added to .env

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, polygon, base],
  [publicProvider()] // If using Infura, replace with: [infuraProvider({ apiKey: infuraProviderKey }), publicProvider()]
);

const connectors = [
  new MetaMaskConnector({ chains }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'dapp demo',
    },
  }),
];

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

type WagmiProviderProps = {
  children: ReactNode;
};

export const WagmiProvider = ({ children }: WagmiProviderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
};
