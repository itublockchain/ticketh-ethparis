import type { Nft, OwnedNftsResponse } from 'alchemy-sdk';
import Axios from 'axios';
import type { AxiosResponse } from 'axios';

import type { EventDto } from './dto';

export const axios = Axios.create({
    baseURL: 'http://10.5.45.108:8000/api/v1',
});

export const apiGetEvents = async (): Promise<
    AxiosResponse<Array<EventDto>>
> => {
    return await axios.get('/events');
};

export const apiGetEventById = async (
    id: number,
): Promise<AxiosResponse<EventDto>> => {
    return await axios.get(`/events/${id}`);
};

export const apiGetNFTs = async (
    address: string,
): Promise<AxiosResponse<OwnedNftsResponse>> => {
    return await axios.get('/nfts', {
        params: {
            address,
        },
    });
};
