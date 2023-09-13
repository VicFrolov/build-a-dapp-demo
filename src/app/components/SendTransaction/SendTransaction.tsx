import { ChangeEvent, useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { parseEther } from 'viem';
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';

const TO_ADDRESS_DEBOUNCE_MS = 500;

export const SendTransaction = () => {
  const [toAddress, setToAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  const [debouncedToAddress] = useDebounce(toAddress, TO_ADDRESS_DEBOUNCE_MS);
  const [debouncedSendAmount] = useDebounce(sendAmount, TO_ADDRESS_DEBOUNCE_MS);

  const { address: currentWalletAddress } = useAccount();

  const { config } = usePrepareSendTransaction({
    to: debouncedToAddress,
    value: debouncedSendAmount ? parseEther(debouncedSendAmount) : undefined,
  });
  const { sendTransaction, isLoading: isLoadingSendTransaction } =
    useSendTransaction(config);

  const handleSubmit = useCallback(() => {
    sendTransaction?.();
  }, [sendTransaction]);

  const handleSetToAddress = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setToAddress(event.target.value);
    },
    []
  );

  const handleSetSendAmount = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSendAmount(event.target.value);
    },
    []
  );

  const submitButtonDisabled =
    !currentWalletAddress ||
    !sendAmount ||
    !toAddress ||
    !sendTransaction ||
    isLoadingSendTransaction;

  return (
    <div className="flex flex-col text-white px-16 py-16 border-white-500 border-2 rounded-2xl">
      <div className="font-bold mb-2">Send Crypto</div>
      <div>
        <div className="mt-4">
          To{' '}
          <input
            className="bg-black border-2 border-white-500 py-2 px-4 mt-2 w-full"
            onChange={handleSetToAddress}
            placeholder="0x Address / ENS Name"
            type="text"
            value={toAddress}
          />
        </div>
        <div className="mt-4">
          Amount{' '}
          <input
            className="bg-black border-2 border-white-500 py-2 px-4 mt-2 w-full"
            onChange={handleSetSendAmount}
            placeholder="0.05"
            type="text"
            value={sendAmount}
          />
        </div>
      </div>
      <button
        className={`hover:bg-gray-50 text-gray-500 rounded-full mt-10 p-4  bg-white font-bold ${
          submitButtonDisabled ? 'disabled:opacity-30' : ''
        }`}
        disabled={submitButtonDisabled}
        onClick={handleSubmit}
      >
        Submit
      </button>
      {isLoadingSendTransaction && <div className="mt-4">loading...</div>}
    </div>
  );
};
