import { StyleSheet } from 'react-native';
import type { XmlProps } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';

interface Props extends Partial<XmlProps> {
    children: string;
    size?: number;
    color?: string;
    onTouchEnd?: () => void;
}

const Icon = ({
    children,
    size = 18,
    color,
    onTouchEnd,
    ...props
}: Props): JSX.Element => {
    return (
        <SvgXml
            onTouchEnd={onTouchEnd}
            xml={children}
            width={String(size)}
            height={String(size)}
            override={{
                style: {
                    ...(props.style as Object),
                    color: color ?? styles.color,
                },
                ...props,
            }}
        />
    );
};

export const styles = StyleSheet.create({
    color: {
        color: '#000',
    },
});

export { Icon };
