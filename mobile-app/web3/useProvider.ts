import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import type { ethers } from 'ethers';

import { wrappedEthers } from '../utils/wrappedEthers';

export const useProvider = (): ethers.providers.Web3Provider | null => {
    const { provider } = useWalletConnectModal();

    if (provider != null) {
        return new wrappedEthers.providers.Web3Provider(provider);
    } else {
        return null;
    }
};
