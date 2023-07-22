import type { ethers } from 'ethers';

import { useProvider } from './useProvider';

export const useSigner = (): ethers.providers.JsonRpcSigner | null => {
    const provider = useProvider();
    return provider?.getSigner() ?? null;
};
