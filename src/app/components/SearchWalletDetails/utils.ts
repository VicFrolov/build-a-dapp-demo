import { isAddress } from 'viem';

export const validateAddress = (
  inputAddress: `0x${string}` | undefined | string
): undefined | `0x${string}` => {
  if (!inputAddress || !isAddress(inputAddress as string)) {
    return undefined;
  }

  return inputAddress as `0x${string}`;
};
