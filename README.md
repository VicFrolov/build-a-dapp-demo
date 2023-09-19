# Build a Dapp 101
[Demo the Dapp](https://build-a-dapp-demo.vercel.app/)

## What We're Building

Welcome to building a dapp 101. We will be building a Dapp that communicates with the Ethereum blockchain leveraging nextjs, tailwind, wagmi, and viem. We will learn what providers are, what EIP-1193 is, how to connect a wallet, how to read from the blockchain, and how to write to the blockchain.

<img width="1756" alt="Screenshot 2023-09-11 at 9 48 58 PM" src="https://github.com/VicFrolov/build-a-dapp-demo/assets/8305711/841fbeb5-85e4-4da8-b05b-4e74b28148f9">

It is separated into 4 general sections, each section contains a code link showing the diff, as well a a deployed demo page to see the changes in action:
1) [Wallet Connection](#part-1)
2) [Read from the blockchain](#part-2-1)
3) [Write to the blockchain](#part-3)
4) Best Practices

## Who is this Tutorial For?

This tutorial assumes familiarity with the frontend world (Typescript, HTML, CSS). It is made for those curious on how a website is able to connect to a wallet, and how it can read and write data to the blockchain.

## Prerequisites

You should have:
  * nvm or npm and node 18.15.0
  * Wallet (one or more):
    * Coinbase Wallet Extension
    * Coinbase Wallet app
    * Retail App with Web3 Wallet
    * Metamask Extension
    * Tallyho Wallet Extension
  * Familiarity with Typescript, HTML, and CSS
  * [Recommended] A wallet funded with Eth/Base or test funds
    * To get test funds, please follow these instructions:  
  * [Optional] Free Infura account and API Key

    
## Getting Started

First, clone the repository, and checkout the starting branch:

```bash
git clone https://github.com/VicFrolov/build-a-dapp-demo.git
git checkout 3bff28bd5f8f1169dda2f59dd29c5c24bde5c653
```

Then, run the development server:

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<a id="part-1"></a>
## Part 1: Wallet Connection ([Demo](https://build-a-dapp-demo-7m8c85g4z-vicfrolov.vercel.app/), [Code](https://github.com/VicFrolov/build-a-dapp-demo/pull/2/files))

### What is a Dapp?

A decentralized application (DApp) is a software application that runs on a distributed computing system, typically a blockchain, instead of a centralized server. DApps are designed to be transparent, resistant to censorship, and operate without a single point of failure.

The user interface of a DApp can certainly be hosted on traditional web servers, making it accessible via standard web browsers. In this sense, a DApp could have a "web2" front-end but still be considered a DApp due to its backend architecture being decentralized.

### Configure a Provider
#### What is EIP-1193?
[EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) is a standard that establishes a unified JavaScript API for Ethereum providers, streamlining how decentralized applications and Ethereum nodes interact. It outlines the methods and events that a compliant Ethereum provider must offer.

#### What is an Ethereum provider?
A provider is an implementation of the [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) specification that serves as the interface between a web application and an Ethereum node.

#### How to use an Ethereum provider
There are many implementations of providers. We will be focusing on providers that are injected via extensions such as Metamask and Coinbase Wallet, and via javascript packages.

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

We will leverage wagmi, a higher level React library for interacting with providers from the browser, and it's dependency viem, a lower level JS utility library for interfacing with providers in any environment.

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


We can now leverage various hooks (e.g. `useAccount`, `useConnect`) to allow the user to connect/disconnect their wallet. See the full implementation of the `Provider` [here](https://github.com/VicFrolov/build-a-dapp-demo/pull/2/files#diff-9baecf5db4fbc90606286654dd835daf6a6c681521609d5c94090662162bdd7a). 

#### Connecting a Wallet

To connect to a wallet, we'll be using wagmi's `useConnect` hook to display metamask and coinbase connector buttons that we configured previously. Under the hood, connect is calling `window.ethereum.request({ method: 'eth_requestAccounts' });`.

First, let's create a new component `ConnectorButtons` that allows users to connect to their preferred wallet. 

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

Finally, let's add a `ConnectionButton.tsx`, which will either show the `ConnectorButtons` if the user is disconnected, or a new disconnect button that leverages wagmi's `useDisconnectHook`:

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

We can now replace all the generated nextjs content inside of `page.tsx` with this new button. Try testing out connecting with enabled/disabled extensions, and notice the different flows a user can take. For instance, tapping the Coinbase Wallet connector button with a CB Wallet extension triggers signing a message, but without a CB Wallet extension, it shows a modal to scan & sign.


```typescript
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectionButton />
    </main>
  );
```
 

<a id="part-2-1"></a>
## Part 2 Read from Blockchain
### Part 2.1: Read Connected Wallet

We're now able to connect/disconnect from a wallet, but we aren't reading any data yet. In this section, we will be going over how to read a connected wallet's address, balance, ens name, and ens photo.

#### Reading Wallet Balance

We will be leveraging wagmi's `useBalance` hook, let's create a new file `src/apps/components/WalletDetails/WalletDetailsBalance.tsx`. It takes in a prop for `address`:

```typescript
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
```

#### Reading ens details

ENS stands for Ethereum Name Service, which is a domain name service built on the Ethereum blockchain. An ENS name is essentially a human-readable alias (like "alice.eth") that can be mapped to an Ethereum address, IPFS hash, or other identifiers. This makes it easier for users to send transactions or interact with smart contracts without having to remember long, complex Ethereum addresses.

Next, let's handle fetching a wallet address' ens name and photo using wagmi's `useEnsName` and `useEnsAvatar` hooks:

```typescript
import { useEnsAvatar, useEnsName } from 'wagmi';

type WalletDetailsENSProps = {
  address?: `0x${string}`;
};

export const WalletDetailsENS = ({ address }: WalletDetailsENSProps) => {
  const {
    data: ensName,
    isLoading: useEnsNameIsLoading,
    isError: useEnsNameIsError,
  } = useEnsName({ address });
  const { data: ensPhoto } = useEnsAvatar({
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
```

Finally, we're going to tie this all together into a new file we create `src/app/components/WalletDetails/WalletDetails.tsx`:

```typescript
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
```

One last step is to instantiate our new `WalletDetails` component, and pass it the current user's wallet address, we will do this inside of `src/app/page.tsx`. We will use the same hook we used before, `useAccount`, but this time also extract the address, and the connected states:


```typescript
'use client';

import { useAccount } from 'wagmi';

import { ConnectionButton } from '@/app/components/buttons/ConnectionButton/ConnectionButton';
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
        </div>
        <div className="flex">
          <ConnectionButton />
        </div>
      </div>
    </main>
  );
}
```

Now if we run `window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})` in the terminal, we will see we get a response
#### Summary


<a id="part-2-2"></a>
### Part 2.2: Change Network
[Demo](https://build-a-dapp-demo-7m8c85g4z-vicfrolov.vercel.app/) 

#### Summary

 
<a id="part-3"></a>
## Part 3: Write to Blockchain
[Demo](https://build-a-dapp-demo-7m8c85g4z-vicfrolov.vercel.app/)

### Summary



Bonus:
* Toggling between crypto / fiat value (e.g. 0.0001 ETH or $17 USD)
* Insufficient funds calculation, including gas fees
* Mobile first development
* Using local state to avoid superfluous blockchain calls

## Appendix

<a id="appendix-wagmi"></a>
#### Wagmi Provider

The [wagmi SDK](https://github.com/wagmi-dev) simplifies interactions with the Ethereum blockchain by abstracting complex tasks into easy-to-use functions, in compliance with EIP (Ethereum Improvement Proposal) standards. It acts as a toolkit that allows developers to seamlessly connect with Ethereum nodes, adhering to protocols defined by various EIPs for interoperability and functionality.
