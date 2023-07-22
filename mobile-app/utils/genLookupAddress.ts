import { wrappedEthers } from './wrappedEthers';

export const genLookupAddress = async (
    address: string | null | undefined,
): Promise<string | null> => {
    if (address == null) {
        return null;
    }
    try {
        const provider = new wrappedEthers.providers.JsonRpcProvider(
            'https://eth.llamarpc.com',
        );
        return await provider.lookupAddress(address);
    } catch {
        return null;
    }
};
