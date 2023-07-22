import { useQuery } from '@tanstack/react-query';

import { Queries } from '../constants/Queries';
import { formatAddress } from '../utils/formatAddress';
import { genLookupAddress } from '../utils/genLookupAddress';

export const useLookupAddress = (
    address: string | null | undefined,
): string => {
    async function resolveEns(): Promise<string | null> {
        const ens = await genLookupAddress(address);
        return ens;
    }

    const { data } = useQuery({
        queryKey: Queries.lookupENS,
        queryFn: resolveEns,
        cacheTime: Infinity,
        staleTime: Infinity,
    });

    if (address == null) {
        return '';
    } else {
        return data ?? formatAddress(address, 6);
    }
};