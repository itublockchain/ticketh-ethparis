import {
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    View,
} from 'react-native';
import { StyleSheet } from 'react-native';

import { LogoLarge } from '../assets';
import { Navbar } from '../components';
import { EventCard } from '../components/EventCard';
import { useRefresh } from '../hooks/useRefresh';
import { useEventsQuery } from '../queries/hooks/useEventsQuery';
import { colors } from '../styles/colors';
import { Layout } from '../ui';

export const Events = (): JSX.Element => {
    const { data: events, refetch } = useEventsQuery();

    const refreshProps = useRefresh(() => {
        refetch();
    });

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView
                    refreshControl={<RefreshControl {...refreshProps} />}
                >
                    <Layout>
                        <View style={[styles.logoWrapper]}>
                            <Image source={LogoLarge} style={styles.logo} />
                        </View>
                        {events.map((event) => {
                            return <EventCard key={event.id} event={event} />;
                        })}
                    </Layout>
                </ScrollView>
                <Navbar />
            </View>
        </SafeAreaView>
    );
};

//eslint-disable-next-line
export const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: '#fff',
    },
    logoWrapper: {
        marginTop: 20,
        marginBottom: 12,
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
    },
    logo: {
        width: '90%',
        height: 40,
        resizeMode: 'contain',
    },
});
