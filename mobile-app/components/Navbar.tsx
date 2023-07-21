import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Paths } from '../constants';
import {
    home,
    homeFilled,
    imageSquare,
    imageSquredFilled,
    user,
    userFilled,
} from '../icons';
import { colors } from '../styles/colors';
import { Icon } from '../ui';

type NavbarItem = {
    name: string;
    icon: string;
    iconActive: string;
    isActive: boolean;
    path: Paths;
};

const Navbar = (): JSX.Element => {
    const navigation = useNavigation();
    const route = useRoute();

    const navbarItems = useMemo(() => {
        return [
            {
                name: 'My Tickeths',
                icon: imageSquare(20),
                iconActive: imageSquredFilled(20),
                isActive: route.name === Paths.MY_TICKETHS,
                path: Paths.MY_TICKETHS,
            },
            {
                name: 'Events',
                icon: home(20),
                iconActive: homeFilled(20),
                isActive: route.name === Paths.EVENTS,
                path: Paths.EVENTS,
            },
            {
                name: 'Account',
                icon: user(20),
                iconActive: userFilled(20),
                isActive: route.name === Paths.ACCOUNT,
                path: Paths.ACCOUNT,
            },
        ].filter((item) => item != null) as Array<NavbarItem>;
    }, []);

    return (
        <View style={styles.wrapper}>
            {navbarItems.map(({ isActive, name, icon, iconActive, path }) => {
                const iconColor = !isActive
                    ? styles.icon.color
                    : styles.iconActive.color;

                return (
                    <NavbarButton
                        onPress={(): void => {
                            navigation.navigate(path as never);
                        }}
                        key={name}
                    >
                        <View style={styles.button}>
                            <View
                                style={[
                                    styles.iconWrapper,
                                    isActive && styles.iconWrapperActive,
                                ]}
                            >
                                <Icon color={iconColor}>
                                    {isActive ? iconActive : icon}
                                </Icon>
                            </View>
                            <Text style={styles.text}>{name}</Text>
                        </View>
                    </NavbarButton>
                );
            })}
        </View>
    );
};

type NavbarButtonProps = {
    children: ReactNode | JSX.Element;
    onPress: () => void;
};

const NavbarButton = ({
    children,
    onPress,
}: NavbarButtonProps): JSX.Element => {
    return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

export { Navbar };

//eslint-disable-next-line
export const styles = StyleSheet.create({
    wrapper: {
        left: 0,
        bottom: 0,
        position: 'absolute',
        width: Dimensions.get('window').width,
        backgroundColor: colors.light,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 4,
        paddingBottom: 0,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
    },
    iconWrapper: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: colors.light,
        borderRadius: 12,
    },
    iconWrapperActive: {
        backgroundColor: colors.primary,
    },
    text: {
        marginTop: 6,
        color: colors.primary,
        fontSize: 12,
    },
    icon: {
        color: colors.primary,
    },
    iconActive: {
        color: colors.secondary,
    },
});
