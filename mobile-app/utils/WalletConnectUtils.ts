import type { IProviderMetadata } from '@walletconnect/modal-react-native';

export const getWalletConnectProviderMetadata = (): IProviderMetadata => {
    return {
        name: 'Ticketh',
        description: 'Secure ticketing app based on EAS',
        url: 'https://your-project-website.com/',
        icons: ['https://your-project-logo.com/'],
        redirect: {
            native: 'ticketh://',
            universal: 'com.asgarovf.tickethmobile.com',
        },
    };
};

export const getWalletConnectProjectId = (): string => {
    return '7c7a609b8da8a9eec1551317907fc2d1';
};
