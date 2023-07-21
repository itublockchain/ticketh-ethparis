import { SafeAreaView, View } from 'react-native';
import { StyleSheet } from 'react-native';

import { Navbar } from '../components';
import { colors } from '../styles/colors';

export const Events = (): JSX.Element => {
    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
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
