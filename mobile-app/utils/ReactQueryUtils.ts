import { QueryClient } from '@tanstack/react-query';

export const tickethQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 0,
            refetchOnWindowFocus: false,
        },
    },
});
