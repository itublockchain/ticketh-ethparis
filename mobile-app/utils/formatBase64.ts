export const formatBase64 = (data: string | null): string => {
    if (data == null) {
        return '';
    }
    if (data.startsWith('data:image/png;base64,')) {
        return data;
    } else {
        return 'data:image/png;base64,' + data;
    }
};
