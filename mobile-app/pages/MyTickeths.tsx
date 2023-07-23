import { useNavigation } from '@react-navigation/native';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import type { OwnedNft } from 'alchemy-sdk';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { StyleSheet } from 'react-native';

import { Navbar } from '../components';
import { EventCard } from '../components/EventCard';
import { Paths } from '../constants';
import { send } from '../icons';
import { useEventByIdQuery } from '../queries/hooks/useEventByIdQuery';
import { useNFTsQuery } from '../queries/hooks/useNFTsQuery';
import { colors } from '../styles/colors';
import { Poppins } from '../styles/theme';
import { Layout } from '../ui';
import { Button } from '../ui/Button';

export const MyTickeths = (): JSX.Element => {
    const { address } = useWalletConnectModal();
    const { data: nfts, isLoading } = useNFTsQuery(address as string);
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView>
                    <Layout>
                        {isLoading && (
                            <View style={styles.activiy}>
                                <ActivityIndicator />
                            </View>
                        )}
                        {nfts.length === 0 && (
                            <View>
                                <Text style={styles.emptyText}>
                                    You don't have any tickets
                                </Text>
                                <Button
                                    onPress={(): void => {
                                        navigation.navigate(
                                            Paths.EVENTS as never,
                                        );
                                    }}
                                    leftIcon={send}
                                    color="primary"
                                    buttonOverride={{
                                        style: styles.emptyButton,
                                    }}
                                >
                                    Explore events
                                </Button>
                            </View>
                        )}
                        {nfts.map((nft, index) => {
                            return (
                                <NFTCard index={index} nft={nft} key={index} />
                            );
                        })}
                    </Layout>
                </ScrollView>

                <Navbar />
            </View>
        </SafeAreaView>
    );
};

const NFTCard = ({
    nft,
    index,
}: {
    nft: OwnedNft;
    index: number;
}): JSX.Element | null => {
    const { data: event } = useEventByIdQuery(Number(nft.tokenId));

    if (event == null) {
        if (index !== 0) {
            return null;
        }

        return (
            <View style={{ marginTop: 24 }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <EventCard type="buyed" event={event} />;
};

//eslint-disable-next-line
export const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: '#fff',
    },
    activiy: {
        marginTop: 24,
    },
    emptyText: {
        fontFamily: Poppins.medium,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 48,
    },
    emptyButton: {
        marginTop: 24,
    },
});
