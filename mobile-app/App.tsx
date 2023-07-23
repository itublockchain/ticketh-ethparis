import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';

import { Paths } from './constants';
import { useScreenOptions } from './hooks';
import { Intro, MyTickeths } from './pages';
import { Account } from './pages/Account';
import { Event } from './pages/Event';
import { Events } from './pages/Events';
import { Validate } from './pages/Validate';
import type { EventDto } from './queries/dto';
import { usePoppins } from './styles/theme';
import { tickethQueryClient } from './utils/ReactQueryUtils';

const StackNavigator = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export type ParamList = {
    [Paths.EVENT]: {
        event: EventDto;
    };
};

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
                    <StackNavigator.Screen
                        options={screenOptions}
                        name={Paths.MY_TICKETHS}
                        component={MyTickeths}
                    />
                    <StackNavigator.Screen
                        options={screenOptions}
                        name={Paths.ACCOUNT}
                        component={Account}
                    />
                    <StackNavigator.Screen
                        options={screenOptions}
                        name={Paths.EVENT}
                        component={Event}
                    />
                    <StackNavigator.Screen
                        options={screenOptions}
                        name={Paths.VALIDATE}
                        component={Validate}
                    />
                </StackNavigator.Navigator>
            ) : (
                <Intro />
            )}
        </NavigationContainer>
    );
}
