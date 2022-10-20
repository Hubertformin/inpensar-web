import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.scss';
import theme from '../utils/theme';
import "react-datepicker/dist/react-datepicker.css";
import {wrapper} from "../store";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import {useEffect} from "react";
import {fireAuth} from "../utils/firebase";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthUser, selectAuthUserState, setAuthUserState, setIdTokenState} from "../store/slices/auth.slice";
import useApi from "../hooks/useApi";
import {useRouter} from "next/router";
import {selectActiveProjectState} from "../store/slices/projects.slice";

function MyApp({ Component, pageProps }) {
    const dispatch = useDispatch();
    const api = useApi();
    const router = useRouter();
    const authUser = useSelector(selectAuthUserState);
    const activeProject = useSelector(selectActiveProjectState);

    useEffect(() => {
        // Listen to authstate changes
        fireAuth.onAuthStateChanged(async (user) => {
            // get id token
            if (user) {
                const idToken = await user.getIdToken();
                await dispatch(setIdTokenState(idToken));

                if (!authUser._id) {
                    // get user's data from server
                    await api.getAndSetCurrentUsersData({idToken});
                }
                console.log(activeProject)
                if (!activeProject) {
                    await api.getAndSetActiveProject({ projectId: router.query.projectId.toString(), idToken })
                }
                // dispatch(setAuthUserState({
                //     _id: null,
                //     name: user.displayName,
                //     email: user.email,
                //     settings: {},
                //     uid: user.uid
                // }));
            } else {
                // in case of log out
                console.log(user);
               //  dispatch(clearAuthUser(null));
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
