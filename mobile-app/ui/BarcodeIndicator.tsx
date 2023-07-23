import { View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

import { colors } from '../styles/colors';

export const BarcodeIndicator = (): JSX.Element => {
    return (
        <>
            <View style={styles.barcodeIndicator}>
                <View style={styles.topLeft}></View>
                <View style={styles.topRight}></View>
                <View style={styles.bottomLeft}></View>
                <View style={styles.bottomRight}></View>
            </View>
        </>
    );
};

const BARCODE_INDICATOR_SIZE = 160;

const DEFAULT_INDICATOR_STYLES: Record<string, unknown> = {
    position: 'absolute',
    borderColor: colors.secondary,
    borderStyle: 'solid',
    height: 40,
    width: 40,
};

const styles = StyleSheet.create({
    barcodeIndicator: {
        position: 'absolute',
        left: Dimensions.get('screen').width / 2 - BARCODE_INDICATOR_SIZE / 2,
        top: Dimensions.get('screen').height / 2 - 160,
        height: BARCODE_INDICATOR_SIZE,
        width: BARCODE_INDICATOR_SIZE,
        zIndex: 1,
    },
    topLeft: {
        ...DEFAULT_INDICATOR_STYLES,
        left: 0,
        top: 0,
        borderLeftWidth: 8,
        borderTopWidth: 8,
    },
    topRight: {
        ...DEFAULT_INDICATOR_STYLES,
        right: 0,
        top: 0,
        borderRightWidth: 8,
        borderTopWidth: 8,
    },
    bottomLeft: {
        ...DEFAULT_INDICATOR_STYLES,
        left: 0,
        bottom: 0,
        borderBottomWidth: 8,
        borderLeftWidth: 8,
    },
    bottomRight: {
        ...DEFAULT_INDICATOR_STYLES,
        right: 0,
        bottom: 0,
        borderRightWidth: 8,
        borderBottomWidth: 8,
    },
});
