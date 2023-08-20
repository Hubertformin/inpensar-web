// 1. Import the extendTheme function
import {extendTheme, ThemeConfig} from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
}

const colors = {
    brand: {
        900: '#d27e00',
        800: '#FB9700',
        700: '#f59910',
        600: '#f6a01e',
        500: '#f8ac38',
        400: '#f8b248',
        300: '#f8b146',
        200: '#f5ba62',
        100: '#f6c273',
    },
}

const theme = extendTheme({ colors, config });

export default theme;
