import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClientProvider } from '@tanstack/react-query';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { RecoilRoot } from 'recoil';

import { Intro } from './pages';
import { usePoppins } from './styles/theme';
import { tickethQueryClient } from './utils/ReactQueryUtils';

const StackNavigator = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App(): JSX.Element | null {
    const fontsLoaded = usePoppins();

    React.useEffect(() => {
        const hideSplashScreen = async (): Promise<void> => {
            await SplashScreen.hideAsync();
        };

        if (fontsLoaded) {
            hideSplashScreen();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={tickethQueryClient}>
            <StatusBar style="dark" />
            <RecoilRoot>
                <Main />
            </RecoilRoot>
        </QueryClientProvider>
    );
}

function Main(): JSX.Element {
    const { isConnected } = useWalletConnectModal();

    return (
        <NavigationContainer>
            {isConnected ? null : <Intro />}
        </NavigationContainer>
    );
}
