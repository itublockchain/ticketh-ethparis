import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { apiGetEventById } from '..';
import { Queries } from '../../constants/Queries';
import type { CustomQueryResult, EventDto } from '../dto';

export const useEventByIdQuery = (
    eventId: number,
): CustomQueryResult<EventDto, null> => {
    const { data, refetch, ...rest } = useQuery({
        queryKey: Queries.eventById,
        queryFn: async (): Promise<EventDto> =>
            apiGetEventById(eventId).then((res) => {
                return res.data;
            }),
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (eventId != null) {
            refetch();
        }
    }, [eventId]);

    return { data: data ?? null, refetch, ...rest };
};
