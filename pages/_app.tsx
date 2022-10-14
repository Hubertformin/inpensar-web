import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.scss';
import theme from '../utils/theme';
import "react-datepicker/dist/react-datepicker.css";
import {wrapper} from "../store";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
      <>
          <Head>
              <title>Inpensar Financial Manager</title>
              <meta name="description" content="Inpensar Financial Manage"/>
              <link rel="manifest" href="/manifest.json" />
          </Head>
          <NextNProgress
              color="#673ab7"
              startPosition={0.3}
              stopDelayMs={200}
              height={5}
              showOnShallow={true}
          />
          <ChakraProvider theme={theme}>
              <Component {...pageProps} />
          </ChakraProvider>
      </>
  )
}

export default wrapper.withRedux(MyApp)
