import { useEffect, useState } from 'react';

import { TICKET_ABI } from '../constants/abi';
import { wrappedEthers } from '../utils/wrappedEthers';
import { TICKET_ADDRESS } from './address';
import { useProvider } from './useProvider';

export const useTicketDetails = (eventId: number, address: string): void => {
    const [details, setDetails] = useState({});
    const provider = useProvider();

    useEffect(() => {
        if (provider == null || address == null || eventId == null) return;

        const fn = async (): Promise<void> => {
            const contract = new wrappedEthers.Contract(
                TICKET_ADDRESS,
                TICKET_ABI,
                provider,
            );

            try {
                const data = await contract.getTicketData(
                    wrappedEthers.BigNumber.from(eventId),
                    address,
                );
                console.log(data);
            } catch (err) {
                console.log(err);
            }
        };
        fn();
    }, [provider, eventId, address]);
};
