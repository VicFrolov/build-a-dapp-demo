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
