import { useCallback, useState } from 'react';

import { colors } from '../styles/colors';

type ReturnType = {
    onRefresh: () => void;
    refreshing: boolean;
    tintColor: string;
};

export const useRefresh = (
    onRefresh: () => void,
    timeout = 2000,
): ReturnType => {
    const [refreshing, setRefreshing] = useState(false);

    const _onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, timeout);
        onRefresh?.();
    }, [onRefresh, timeout]);

    return { onRefresh: _onRefresh, refreshing, tintColor: colors.primary };
};
