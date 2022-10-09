import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.scss';
import theme from './theme';
import "react-datepicker/dist/react-datepicker.css";
import {wrapper} from "../store";

function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
  )
}

export default wrapper.withRedux(MyApp)
