import { useQuery } from 'react-query';

import { apiGetEvents } from '..';
import { Queries } from '../../constants/Queries';
import type { CustomQueryResult, EventDto } from '../dto';

export const useEventsQuery = (): CustomQueryResult<Array<EventDto>, []> => {
    const { data, ...rest } = useQuery({
        queryKey: Queries.events,
        queryFn: async (): Promise<Array<EventDto>> =>
            apiGetEvents().then((res) => {
                return res.data;
            }),
        refetchOnWindowFocus: true,
    });

    return { data: data ?? [], ...rest };
};
