import { useNavigation } from '@react-navigation/native';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import PassKit from 'react-native-passkit-wallet';

import { MockEventImage } from '../assets';
import { AUTH_MESSAGE, Paths } from '../constants';
import { useLookupAddress } from '../hooks/useLookupAddress';
import { apiCreateOffchainAttestation } from '../queries';
import type { EventDto } from '../queries/dto';
import { useHasNFT } from '../queries/hooks/useHasNFTQuery';
import { usePasskitMutation } from '../queries/hooks/usePasskitMutation';
import { colors } from '../styles/colors';
import { Poppins } from '../styles/theme';
import { Button } from '../ui/Button';
import { formatDate } from '../utils/formatDate';
import { formatImageUrl } from '../utils/formatImageUrl';
import { useSigner } from '../web3/useSigner';

export type EventCardType = 'sale' | 'detailed' | 'buyed';

type Props = {
    event: EventDto;
    type?: EventCardType;
};

export const EventCard = ({
    event,
    type = 'sale',
}: Props): JSX.Element | null => {
    const signer = useSigner();
    const { address } = useWalletConnectModal();
    const navigation = useNavigation();
    const organizer = useLookupAddress(event.author);
    const mutation = usePasskitMutation();
    const [chainData, setChainData] = useState(0.1);
    const styles = rawStyles(type);

    if (signer == null) return null;

    const handleGetTicket = async (): Promise<void> => {
        if (type === 'sale') {
            const args = [Paths.EVENT, { event }] as never;
            navigation.navigate(...args);
        } else if (type === 'buyed') {
            PassKit.canAddPasses().then((result) => {
                if (!result) {
                    Alert.alert('You are not allowed to add pass');
                    return;
                }
                mutation
                    .mutateAsync({
                        address: address as string,
                        eventId: String(event.id),
                    })
                    .then((res) => {
                        PassKit.addPass(res).then((res) => {
                            console.log(res);
                        });
                    })
                    .catch(() => {
                        Alert.alert('Failed to add pass to Apple Wallet');
                    });
            });
            // Add to apple wallet
        } else {
            const sig = await signer.signMessage(AUTH_MESSAGE);

            if (sig == null) {
                Alert.alert('Could not get the Ticket');
                return;
            }

            try {
                await apiCreateOffchainAttestation(
                    event.id,
                    {
                        attester: event.author,
                        recipient: address,
                        revocable: true,
                        revocationTime: 0,
                        expirationTime: 0,
                        version: 0,
                    },
                    sig,
                );
                Alert.alert('Minted Successfully');
            } catch (err: Object) {
                Alert.alert(
                    err?.response?.data?.message ?? 'Could not get the Ticket',
                );
            }
        }
    };

    const buyContent = useMemo(() => {
        if (type === 'detailed') {
            return `Buy for ${chainData} ETH`;
        } else if (type === 'sale') {
            return 'Get ticket';
        } else if (type === 'buyed') {
            return 'Add to Apple Wallet';
        }
    }, [type, chainData]);

    return (
        <View style={styles.cardWrapper}>
            <Image
                style={styles.image}
                source={
                    event.image_url
                        ? formatImageUrl(event.image_url)
                        : MockEventImage
                }
            />
            <View style={styles.details}>
                <Text style={styles.header}>{event.name}</Text>
                <Text
                    numberOfLines={type === 'detailed' ? 12 : 2}
                    style={styles.description}
                >
                    {event.description}
                </Text>

                {type === 'detailed' ? (
                    <>
                        <Text
                            numberOfLines={type === 'detailed' ? 12 : 2}
                            style={styles.organizer}
                        >
                            Organized by: {organizer}
                        </Text>

                        <Text
                            numberOfLines={type === 'detailed' ? 12 : 2}
                            style={styles.location}
                        >
                            Location: {event.location}
                        </Text>
                    </>
                ) : null}

                <Text style={styles.date}>{formatDate(event.start_date)}</Text>
                <Button
                    onPress={handleGetTicket}
                    buttonOverride={{
                        style: styles.getTicket,
                    }}
                >
                    {buyContent}
                </Button>
            </View>
        </View>
    );
};

//eslint-disable-next-line
const rawStyles = (type: EventCardType) =>
    StyleSheet.create({
        cardWrapper: {
            width: '100%',
            marginTop: type === 'detailed' ? 0 : 12,
            backgroundColor: colors.light,
            borderStyle: 'solid',
            borderWidth: type === 'detailed' ? 0 : 1,
            borderRadius: type === 'detailed' ? 0 : 12,
            borderColor: colors.secondary,
            flexDirection: 'column',
        },
        image: {
            borderTopLeftRadius: type === 'detailed' ? 0 : 12,
            borderTopRightRadius: type === 'detailed' ? 0 : 12,
            height: type === 'detailed' ? 300 : 170,
            width: '100%',
            resizeMode: 'cover',
        },
        header: {
            fontSize: type === 'detailed' ? 24 : 18,
            fontFamily: Poppins.semibold,
        },
        details: {
            padding: 12,
        },
        description: {
            marginTop: 6,
            fontSize: 12,
            fontFamily: Poppins.light,
        },
        getTicket: {
            marginTop: type === 'detailed' ? 32 : 14,
        },
        date: {
            marginTop: 4,
            fontSize: 14,
            fontFamily: Poppins.medium,
        },
        organizer: {
            marginTop: 8,
            fontFamily: Poppins.medium,
        },
        location: {
            marginTop: 4,
            fontFamily: Poppins.medium,
        },
    });
