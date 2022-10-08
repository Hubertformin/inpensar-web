// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
    brand: {
        900: '#f39b41',
        800: '#f3a153',
        700: '#f5b06a',
    },
}

const theme = extendTheme({ colors });

export default theme;