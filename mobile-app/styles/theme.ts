import {
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    useFonts,
} from '@expo-google-fonts/poppins';

export const usePoppins = (): boolean => {
    const [fontsLoaded] = useFonts({
        Poppins_100Thin,
        Poppins_200ExtraLight,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
        Poppins_900Black,
    });

    return fontsLoaded;
};

export enum Poppins {
    'thin' = 'Poppins_100Thin',
    'extraLight' = 'Poppins_200ExtraLight',
    'light' = 'Poppins_300Light',
    'regular' = 'Poppins_400Regular',
    'medium' = 'Poppins_500Medium',
    'semibold' = 'Poppins_600SemiBold',
    'bold' = 'Poppins_700Bold',
    'extrabold' = 'Poppins_800ExtraBold',
    'black' = 'Poppins_900Black',
}
