import {ChakraProvider, useToast} from '@chakra-ui/react'
import '../styles/globals.scss';
import theme from '../utils/theme';
import "react-datepicker/dist/react-datepicker.css";
import {wrapper} from "../store";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import {useEffect} from "react";
import {fireAuth} from "../utils/firebase";
import {useDispatch, useSelector} from "react-redux";
import {
    AuthState,
    selectAuthUserState,
    setAuthState,
    setIdTokenState
} from "../store/slices/auth.slice";
import useApi from "../hooks/useApi";
import {selectActiveProjectState, setActiveProjectId, setActiveProjectState} from "../store/slices/projects.slice";
import {selectCategoriesState} from "../store/slices/categories.slice";
import {useRouter} from "next/router";
import {AxiosError} from "axios";

function MyApp({Component, pageProps}) {
    const dispatch = useDispatch();
    const api = useApi();
    const router = useRouter();
    const toast = useToast();
    const authUser = useSelector(selectAuthUserState);
    const activeProject = useSelector(selectActiveProjectState);
    const categories = useSelector(selectCategoriesState);

    useEffect(() => {
        if (typeof window == 'undefined') {
            return;
        }
        const url = new URL(window.location.href);
        let activeProjectId;
        if (url.pathname.startsWith('/projects')) {
            activeProjectId = url.pathname.split('/')[2];
            dispatch(setActiveProjectId(activeProjectId))
        }
        // Listen to authstate changes
        fireAuth.onAuthStateChanged(async (user) => {
            // get id token
            if (user) {
                const idToken = (user as any).accessToken ? (user as any).accessToken : await user.getIdToken();
                await dispatch(setIdTokenState(idToken));

                if (!authUser._id) {
                    // get user's data from server
                    await api.getAndSetCurrentUsersData({idToken})
                        .catch((err: AxiosError) => {
                            console.log(err)
                            // If account data does not exist, redirect the user to complete is account
                            if (err?.response?.status === 404) {
                                router.push('/auth/complete-account');
                            }
                        })
                }

                /**
                 * LOAD USER'S DATA TO BE USED IN THE APP
                 */
                if (!activeProject && activeProjectId) {
                    await api.getAndSetActiveProject({projectId: activeProjectId, idToken})
                        .catch(err => {
                            if (err.response.status === 404) {
                                toast({title: 'Project not found',description: 'Your project was either moved or deleted!', status: 'error'});
                                router.push(`/projects/`);
                            }
                        })
                }

                // Load categories when the user opens a project, these categories will be used for transactions budgets
                // Do not fetch categories if they have already been searched
                if (activeProjectId && (categories.income.length === 0 || categories.expenses.length == 0)) {
                    await api.getAndSetCategories({idToken});
                }

                // if (activeProject && budgets.length == 0) {
                //     await api.getBudgets().catch(err => console.error(err));
                // }
                //
                // if (accounts.length == 0) {
                //     await api.getAccounts().catch(err => console.error(err));
                // }

                dispatch(setAuthState(AuthState.AUTHENTICATED));
            } else {
                // in case of log out
                dispatch(setAuthState(AuthState.UNAUTHENTICATED));
                //  dispatch(clearAuthUser(null));
            }
        }, (err) => {
            console.error(err);
        })
    }, [activeProject, api, authUser._id, categories.expenses.length, categories.income.length, dispatch]);
    return (
        <>
            <Head>
                <title>Inpensar Financial Manager</title>
                <meta name="description" content="Inpensar Financial Manage"/>
                <link rel="manifest" href="/manifest.json"/>
            </Head>
            <NextNProgress
                color="#673ab7"
                startPosition={0.3}
                stopDelayMs={200}
                height={5}
                showOnShallow={true}
            />
            <ChakraProvider theme={theme}>
                <>
                    <Component {...pageProps} />
                </>
            </ChakraProvider>
        </>
    )
}

export default wrapper.withRedux(MyApp)
