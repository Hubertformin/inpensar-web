import {ColorModeScript} from '@chakra-ui/react'
import {Html, Head, Main, NextScript} from 'next/document'
import theme from './theme'

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
                      rel="stylesheet"/>
            </Head>
            <body>
            {/* 👇 Here's the script */}
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}