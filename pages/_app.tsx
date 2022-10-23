import {ChakraProvider} from '@chakra-ui/react'
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
import {selectActiveProjectState} from "../store/slices/projects.slice";
import {selectCategoriesState} from "../store/slices/categories.slice";
import {AccountsModel} from "../models/accounts.model";
import {selectAccountsState} from "../store/slices/accounts.slice";
import {BudgetModel} from "../models/budget.model";
import {selectBudgetState} from "../store/slices/budget.slice";

function MyApp({Component, pageProps}) {
    const dispatch = useDispatch();
    const api = useApi();
    const authUser = useSelector(selectAuthUserState);
    const activeProject = useSelector(selectActiveProjectState);
    const categories = useSelector(selectCategoriesState);
    const accounts: AccountsModel[] = useSelector(selectAccountsState);
    const budgets: BudgetModel[] = useSelector(selectBudgetState);

    useEffect(() => {
        if (typeof window == 'undefined') {
            return;
        }
        const url = new URL(window.location.href);
        let activeProjectId;
        if (url.pathname.startsWith('/projects')) {
            activeProjectId = url.pathname.split('/')[2];
        }
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

                /**
                 * LOAD USER'S DATA TO BE USED IN THE APP
                 */
                if (!activeProject && activeProjectId) {
                    await api.getAndSetActiveProject({projectId: activeProjectId, idToken})
                }

                // Load categories when the user opens a project, these categories will be used for transactions budgets
                // Do not fetch categories if they have already been searched
                if (categories.income.length === 0 || categories.expenses.length == 0) {
                    await api.getAndSetCategories({idToken});
                }

                // if (activeProject && budgets.length == 0) {
                //     await api.getBudgets().catch(err => console.log(err));
                // }
                //
                // if (accounts.length == 0) {
                //     await api.getAccounts().catch(err => console.log(err));
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
    }, []);
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
