import { useNavigation } from '@react-navigation/native';
import {
    WalletConnectModal,
    useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import { useCallback } from 'react';
import { SafeAreaView, Share, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';

import { Navbar } from '../components';
import { Paths } from '../constants';
import { WalletConnectConstants } from '../constants/WalletConnectConstants';
import { useLookupAddress } from '../hooks/useLookupAddress';
import { copy, creditCard, userFilled } from '../icons';
import { colors } from '../styles/colors';
import { Poppins } from '../styles/theme';
import { Icon, Layout } from '../ui';
import { Button } from '../ui/Button';

export const Account = (): JSX.Element => {
    const { address, provider } = useWalletConnectModal();
    const navigation = useNavigation();

    const logout = async (): Promise<void> => {
        await provider?.disconnect();
    };

    const ensOrAddress = useLookupAddress(address);

    const onShare = useCallback(async () => {
        try {
            const result = await Share.share({
                message: address as string,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch {
            // alert.error('Failed to share');
        }
    }, [ensOrAddress]);

    return (
        <>
            <SafeAreaView style={{ backgroundColor: colors.light }}>
                <View style={styles.wrapper}>
                    <WalletConnectModal
                        projectId={
                            WalletConnectConstants.walletConnectProjectId
                        }
                        providerMetadata={
                            WalletConnectConstants.walletConnectProviderMetadata
                        }
                    />
                    <Layout padding={true}>
                        <View style={styles.profileWrapper}>
                            <View style={styles.circle}>
                                <Icon color={colors.primary}>
                                    {userFilled(56)}
                                </Icon>
                            </View>
                            <Text style={styles.address}>{ensOrAddress}</Text>
                            <Button
                                onPress={onShare}
                                color="light"
                                buttonOverride={{
                                    style: styles.share,
                                }}
                                leftIcon={copy}
                            >
                                Share Address
                            </Button>

                            <Button
                                onPress={(): void => {
                                    navigation.navigate(
                                        Paths.VALIDATE as never,
                                    );
                                }}
                                color="light"
                                buttonOverride={{
                                    style: styles.validate,
                                }}
                                leftIcon={creditCard}
                            >
                                Validate Ticketh
                            </Button>
                        </View>
                        <View style={styles.logoutWrapper}>
                            <Button onPress={logout}>Log out</Button>
                        </View>
                    </Layout>

                    <Navbar />
                </View>
            </SafeAreaView>
        </>
    );
};

//eslint-disable-next-line
export const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: '#fff',
    },
    profileWrapper: {
        width: '100%',
        marginTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 96,
        height: 96,
        borderRadius: 50,
        borderStyle: 'solid',
        borderColor: colors.secondary,
        borderWidth: 1,
        backgroundColor: colors.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    address: {
        fontSize: 18,
        fontFamily: Poppins.medium,
        marginTop: 12,
    },
    share: {
        marginTop: 24,
    },
    validate: {
        marginTop: 12,
    },
    logoutWrapper: {
        marginTop: 'auto',
        marginBottom: 16,
    },
});
