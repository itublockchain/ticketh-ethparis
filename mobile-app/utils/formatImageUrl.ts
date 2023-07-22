import { formatBase64 } from './formatBase64';

export const formatImageUrl = (data: string): { uri: string } => {
    if (data.startsWith('http')) {
        return { uri: data };
    } else {
        return { uri: formatBase64(data) };
    }
};
