import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClientProvider } from '@tanstack/react-query';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { RecoilRoot } from 'recoil';

import { Navbar } from './components/Navbar';
import { Paths } from './constants';
import { useScreenOptions } from './hooks';
import { Intro } from './pages';
import { Events } from './pages/Events';
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
    const screenOptions = useScreenOptions();

    return (
        <NavigationContainer>
            {isConnected ? (
                <StackNavigator.Navigator>
                    <StackNavigator.Screen
                        options={screenOptions}
                        name={Paths.EVENTS}
                        component={Events}
                    />
                </StackNavigator.Navigator>
            ) : (
                <Intro />
            )}
        </NavigationContainer>
    );
}
