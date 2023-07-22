export const formatAddress = (value: string, limit = 3): string => {
    let _value = value;

    if (!_value.startsWith('0x')) {
        _value = '0x' + _value;
    }

    return (
        _value.slice(0, limit + 2) +
        '...' +
        _value.slice(value.length - limit + 1)
    );
};
