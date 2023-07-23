import { useMutation } from 'react-query';

import { apiPostPasskitMutation } from '..';
import type { CustomMutationResult } from '../dto';

export const usePasskitMutation = (): CustomMutationResult<
    string,
    {
        address: string;
        eventId: string;
    }
> => {
    const mutation = useMutation({
        mutationFn: async ({
            address,
            eventId,
        }: {
            address: string;
            eventId: string;
        }): Promise<string> =>
            apiPostPasskitMutation(address, eventId).then((res) => {
                return res.data.buffer;
            }),
    });

    return mutation;
};
