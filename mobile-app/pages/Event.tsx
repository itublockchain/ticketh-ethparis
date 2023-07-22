import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';

import type { ParamList } from '../App';
import { Navbar } from '../components';
import { EventCard } from '../components/EventCard';
import { colors } from '../styles/colors';

export const Event = (): JSX.Element => {
    const route = useRoute<RouteProp<ParamList>>();
    const event = route.params.event;

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView>
                    <EventCard type="detailed" event={event} />
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
