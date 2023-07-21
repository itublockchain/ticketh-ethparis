import {
    WalletConnectModal,
    useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import { Image, KeyboardAvoidingView, View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

import { LogoLarge, WelcomeIllustration } from '../assets';
import { WalletConnectConstants } from '../constants/WalletConnectConstants';
import { Layout } from '../ui';
import { Button } from '../ui/Button';

export const Intro = (): JSX.Element => {
    const { open } = useWalletConnectModal();

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={-24}
            behavior="padding"
            enabled
        >
            <View style={styles.wrapper}>
                <Layout padding={false}>
                    <View style={[styles.logoWrapper]}>
                        <Image source={LogoLarge} style={styles.logo} />
                    </View>
                    <View style={[styles.illustrationWrapper]}>
                        <Image
                            source={WelcomeIllustration}
                            style={styles.illustration}
                        />
                    </View>

                    <View style={styles.connect}>
                        <Button onPress={open} color="primary">
                            WalletConnect
                        </Button>
                    </View>

                    <WalletConnectModal
                        projectId={
                            WalletConnectConstants.walletConnectProjectId
                        }
                        providerMetadata={
                            WalletConnectConstants.walletConnectProviderMetadata
                        }
                    />
                </Layout>
            </View>
        </KeyboardAvoidingView>
    );
};

//eslint-disable-next-line
export const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: '#fff',
    },
    logoWrapper: {
        marginTop: Dimensions.get('screen').height * 0.25,
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
    },
    illustrationWrapper: {
        marginTop: 24,
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
    },
    illustration: {
        width: '90%',
        height: 200,
        resizeMode: 'contain',
    },
    logo: {
        width: '90%',
        height: 80,
        resizeMode: 'contain',
    },
    connect: {
        marginTop: 'auto',
        marginBottom: 72,
    },
});
