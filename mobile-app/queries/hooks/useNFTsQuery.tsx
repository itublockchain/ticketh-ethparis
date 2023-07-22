import type { OwnedNft } from 'alchemy-sdk';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { apiGetNFTs } from '..';
import { Queries } from '../../constants/Queries';
import type { CustomQueryResult } from '../dto';

export const useNFTsQuery = (
    address: string,
): CustomQueryResult<Array<OwnedNft>, []> => {
    const { data, refetch, ...rest } = useQuery({
        queryKey: Queries.nfts,
        queryFn: async (): Promise<Array<OwnedNft>> =>
            apiGetNFTs(address).then((res) => {
                return res.data.ownedNfts;
            }),
    });

    useEffect(() => {
        if (address != null) {
            refetch();
        }
    }, [address, refetch]);

    return { data: data ?? [], refetch, ...rest };
};
