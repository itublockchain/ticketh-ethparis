import type { AxiosError } from 'axios';
import type { UseMutationResult, UseQueryResult } from 'react-query';

export type CustomQueryResult<T, K = null> = Omit<
    UseQueryResult<T, unknown>,
    'data' | 'refetch'
> & { data: T | K; refetch: () => void };

export type CustomMutationResult<T, K = unknown> = UseMutationResult<
    T,
    unknown,
    K,
    unknown
>;

export type DefaultAxiosError = AxiosError<{
    message: string;
    statusCode: number;
}>;

export type EventDto = {
    id: number;

    name: string;

    description: string;

    location: string;

    image_url: string | null;

    author: string;

    start_date: string;

    expire_date: string;
};
