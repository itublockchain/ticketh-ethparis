export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toDateString();
    } catch {
        return dateString;
    }
};
