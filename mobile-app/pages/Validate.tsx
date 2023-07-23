import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';

import { Paths } from '../constants';
import { apiGetEventById } from '../queries';
import { colors } from '../styles/colors';
import { BarcodeIndicator } from '../ui/BarcodeIndicator';

const Validate = (): JSX.Element => {
    const navigation = useNavigation();

    const [scanned, setScanned] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        const getBarCodeScannerPermissions = async (): Promise<void> => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async ({
        data,
    }: {
        data: string;
    }): Promise<void> => {
        setScanned(true);
        try {
            const parsed = JSON.parse(data);
            const res = await apiGetEventById(parsed.eventId);
            const event = res.data;

            Alert.alert(`Validated sucessfully for ${event.name}`);

            navigation.navigate(Paths.ACCOUNT as never);
        } catch {
            Alert.alert('Could not scan the QR code. Please try again');
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: colors.secondary }}>
            <View style={styles.wrapper}>
                {hasPermission == null ||
                hasPermission === false ||
                scanned ? null : (
                    <>
                        <BarcodeIndicator />
                        <BarCodeScanner
                            barCodeTypes={[
                                BarCodeScanner.Constants.BarCodeType.qr,
                            ]}
                            onBarCodeScanned={
                                scanned ? undefined : handleBarCodeScanned
                            }
                            style={StyleSheet.absoluteFillObject}
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export { Validate };

//eslint-disable-next-line
const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 0,
    },
});
