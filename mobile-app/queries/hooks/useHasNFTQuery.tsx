import { useQuery } from 'react-query';

import { apiGetHasNft } from '..';
import { Queries } from '../../constants/Queries';
import type { CustomQueryResult } from '../dto';

export const useHasNFT = (
    address: string,
    tokenId: number,
): CustomQueryResult<boolean, boolean> => {
    const { data, ...rest } = useQuery({
        queryKey: Queries.hasNft,
        queryFn: async (): Promise<boolean> =>
            apiGetHasNft(address, tokenId).then((res) => {
                return res.data.hasNft;
            }),
        refetchOnWindowFocus: true,
    });

    return { data: data ?? false, ...rest };
};
