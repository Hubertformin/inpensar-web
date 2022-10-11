import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.scss';
import theme from '../utils/theme';
import "react-datepicker/dist/react-datepicker.css";
import {wrapper} from "../store";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
      <>
          <Head>
              <title>Inpensar Financial Manager</title>
              <meta name="description" content="Inpensar Financial Manage"/>
              <link rel="manifest" href="/manifest.json" />
          </Head>
          <ChakraProvider theme={theme}>
              <Component {...pageProps} />
          </ChakraProvider>
      </>
  )
}

export default wrapper.withRedux(MyApp)
