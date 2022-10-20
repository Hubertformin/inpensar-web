import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.scss';
import theme from '../utils/theme';
import "react-datepicker/dist/react-datepicker.css";
import {wrapper} from "../store";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import {useEffect} from "react";
import {fireAuth} from "../utils/firebase";
import {useDispatch} from "react-redux";
import {clearAuthUser, setAuthUserState, setIdTokenState} from "../store/slices/auth.slice";

function MyApp({ Component, pageProps }) {
    const dispatch = useDispatch();
    useEffect(() => {
        // Listen to authstate changes
        fireAuth.onAuthStateChanged(async (user) => {
            // get id token
            if (user) {
                const idToken = await user.getIdToken();
                dispatch(setAuthUserState(user));
                dispatch(setIdTokenState(idToken));
            } else {
                // in case of log out
                dispatch(clearAuthUser(null));
            }
        }, (err) => {
            console.error(err);
        })
    }, []);
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
