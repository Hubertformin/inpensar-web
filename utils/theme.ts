// 1. Import the extendTheme function
import {extendTheme, ThemeConfig} from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
}

const colors = {
    brand: {
        900: '#5e35b1',
        800: '#673ab7',
        700: '#673ab7',
    },
}

const theme = extendTheme({ colors, config });

export default theme;