import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import type { OwnedNft } from 'alchemy-sdk';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    View,
} from 'react-native';
import { StyleSheet } from 'react-native';

import { Navbar } from '../components';
import { EventCard } from '../components/EventCard';
import { useEventByIdQuery } from '../queries/hooks/useEventByIdQuery';
import { useNFTsQuery } from '../queries/hooks/useNFTsQuery';
import { colors } from '../styles/colors';
import { Layout } from '../ui';

export const MyTickeths = (): JSX.Element => {
    const { address } = useWalletConnectModal();
    const { data: nfts, isLoading } = useNFTsQuery(
        '0xccaec61d44566fAE4bd1bdb47A92C5894bdE4eBF' as string,
    );

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
});
