## Build a Dapp 101

[Demo the Dapp](https://build-a-dapp-demo.vercel.app/)

Welcome to building a dapp 101. This tutorial is separated into 4 sections:
1) [Wallet Connection](#part-1)
2) [Read from the blockchain](#part-2-1)
3) [Write to the blockchain](#part-3)
4) Best Practices

<img width="1756" alt="Screenshot 2023-09-11 at 9 48 58 PM" src="https://github.com/VicFrolov/build-a-dapp-demo/assets/8305711/841fbeb5-85e4-4da8-b05b-4e74b28148f9">

## Prerequisites

You should have:
  * Either nvm or npm and node 18.15.0
  * Wallet (one or more):
    * Coinbase Wallet Extension
    * Coinbase Wallet app
    * Retail App with Web3 Wallet
    * Metamask Extension
    * Tallyho Wallet Extension
  * [Optional] Free Infura account and API Key
    
## Getting Started
First, run the development server:

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<a id="part-1"></a>
## Part 1: Wallet Connection ([Demo](https://build-a-dapp-demo-7m8c85g4z-vicfrolov.vercel.app/), [Code](https://build-a-dapp-demo-7m8c85g4z-vicfrolov.vercel.app/))

### Configure a Provider
#### What is an Ethereum provider?
A provider is an implementation of the [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) specification that serves as the interface between a web application and an Ethereum node.

#### What is EIP-1193?
[EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) is a standard that establishes a unified JavaScript API for Ethereum providers, streamlining how decentralized applications and Ethereum nodes interact. It outlines the methods and events that a compliant Ethereum provider must offer.


#### How to use an Ethereum provider
There are many implementations of providers, but we will be focusing on providers that are injected via extensions such as Metamask and Coinbase Wallet, and via javascript packages. 

While we could interact with the injected provider directly:

```javascript
// Check for injected Ethereum provider
if (window.ethereum) {
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    // handle error or rejection from user
  }
```

We will leverage wagmi, a higher level React library for interacting with providers from the browser, and it's dependency ethers, a lower level JS utility library for interfacing with providers in any environment.

#### Configuring our Provider
```bash
npm install @wagmi/core viem
```

Wagmi setup requires configuring which chains (e.g. Polygon) to use, specifying which connectors (e.g. Metamask) we want to use, and creating a wagmi config.

```javascript
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
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
```

Let's now wrap our app with this new Provider in `src/app/layout.tsx`

```javascript
  <WagmiProvider>{children}</WagmiProvider>
```


We can now leverage various hooks (e.g. useAccounts, useConnect) to allow the user to connect/disconnect their wallet. See the full implementation of the `Provider` [here](https://github.com/VicFrolov/build-a-dapp-demo/pull/2/files#diff-9baecf5db4fbc90606286654dd835daf6a6c681521609d5c94090662162bdd7a). 

#### Connecting a Wallet

First, let's create a new component `ConnectorButtons` that allows users to connect to their preferred wallet. We're using wagmi's `useConnect` hook to display metamask and coinbase connector buttons that we configured previously. Under the hood, connect is calling `window.ethereum.request({ method: 'eth_requestAccounts' });`.


```javascript
import { useConnect } from 'wagmi';

export const ConnectorButtons = () => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  return (
    <div className="flex flex-col">
      {connectors.map((connector) => (
        <button
          className="hover:bg-gray-300 bg-white text-gray-500 p-4 rounded-md mb-4"
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}
    </div>
  );
};

```

Finally, let's add a `ConnectionButton.tsx`, which will either show the `ConnectorButtons` if the user is disconnected, or a new disconnect button that leverages `useDisconnectHook`:

```javascript
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

```

We can now replace all the generated nextjs content inside of `page.tsx` with this new button. Try testing out connecting with enabled/disabled extensions, and notice the different flows a user can take. For instance, tapping the Coinbase Wallet with an extension triggers signing

```javascript
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectionButton />
    </main>
  );
```
 

<a id="part-2-1"></a>
## Part 2 Read from Blockchain
### Part 2.1: Read Connected Wallet


#### Summary


<a id="part-2-2"></a>
### Part 2.2: Change Network
[Demo](https://build-a-dapp-demo-7m8c85g4z-vicfrolov.vercel.app/) 

#### Summary

 
<a id="part-3"></a>
## Part 3: Write to Blockchain
[Demo](https://build-a-dapp-demo-7m8c85g4z-vicfrolov.vercel.app/)

### Summary




## Appendix

<a id="appendix-wagmi"></a>
#### Wagmi Provider

The [wagmi SDK](https://github.com/wagmi-dev) simplifies interactions with the Ethereum blockchain by abstracting complex tasks into easy-to-use functions, in compliance with EIP (Ethereum Improvement Proposal) standards. It acts as a toolkit that allows developers to seamlessly connect with Ethereum nodes, adhering to protocols defined by various EIPs for interoperability and functionality.
