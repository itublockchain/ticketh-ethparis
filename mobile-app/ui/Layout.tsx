import type { ReactNode } from 'react';
import { Animated, StyleSheet } from 'react-native';

type Props = {
    children: ReactNode | JSX.Element;
    padding?: boolean;
};

const Layout = ({ children, padding = true }: Props): JSX.Element => {
    const themedStyles = styles();

    return (
        <Animated.View
            style={{
                ...themedStyles.wrapper,
                paddingBottom: padding ? 64 : 0,
            }}
        >
            {children}
        </Animated.View>
    );
};

export { Layout };

//eslint-disable-next-line
export const styles = () =>
    StyleSheet.create({
        wrapper: {
            paddingLeft: 24,
            paddingRight: 24,
            height: '100%',
        },
    });
