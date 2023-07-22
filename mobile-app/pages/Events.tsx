import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';

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
});
