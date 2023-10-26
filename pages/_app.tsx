import { ChakraProvider, useToast } from "@chakra-ui/react";
import "../styles/globals.scss";
import theme from "../utils/theme";
import "react-datepicker/dist/react-datepicker.css";
import { wrapper } from "../store";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";
import { fireAuth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { AuthState, selectAuthUserIdTokenState, selectAuthUserState, setAuthState, setIdTokenState } from "../store/slices/auth.slice";
import useApi from "../hooks/useApi";
import { selectActiveProjectState, setActiveProjectId } from "../store/slices/projects.slice";
import { selectCategoriesState } from "../store/slices/categories.slice";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { BudgetModel } from "../models/budget.model";
import { selectBudgetState } from "../store/slices/budget.slice";
import { AccountsModel } from "../models/accounts.model";
import { selectAccountsState } from "../store/slices/accounts.slice";

function MyApp({ Component, pageProps }) {
    const dispatch = useDispatch();
    const api = useApi();
    const router = useRouter();
    const toast = useToast();
    const authUser = useSelector(selectAuthUserState);
    const activeProject = useSelector(selectActiveProjectState);
    const categories = useSelector(selectCategoriesState);
    const idTokenState = useSelector(selectAuthUserIdTokenState);
    // Budgets
    const budgets: BudgetModel[] = useSelector(selectBudgetState);
    const accounts: AccountsModel[] = useSelector(selectAccountsState);
    async function loadApplicationData() {
        const url = new URL(window.location.href);
        let activeProjectId;
        if (url.pathname.startsWith("/projects")) {
            activeProjectId = url.pathname.split("/")[2];
            await dispatch(setActiveProjectId(activeProjectId));
        }
        // Listen to auth-state changes
        fireAuth.onAuthStateChanged(
            async (user) => {
                // get id token
                if (user) {
                    let idToken = await user.getIdToken(true);

                    await dispatch(setIdTokenState(idToken));

                    if (!authUser._id) {
                        // get user's data from server
                        await api.getAndSetCurrentUsersData({ idToken }).catch((err: AxiosError) => {
                            console.log(err);
                            // If account data does not exist, redirect the user to complete is account
                            if (err.response) {
                                if (err.response.status === 404) {
                                    router.push("/auth/complete-account");
                                }
                            }
                        });
                    }

                    /**
                     * LOAD USER'S DATA TO BE USED IN THE APP
                     */
                    if (!activeProject && activeProjectId) {
                        await api.getAndSetActiveProject({ projectId: activeProjectId, idToken }).catch((err) => {
                            if (err.response) {
                                if (err.response.status === 404) {
                                    toast({ title: "Project not found", description: "Your project was either moved or deleted!", status: "error" });
                                    router.push(`/projects/`);
                                }
                            }
                        });
                    }

                    // Load categories when the user opens a project, these categories will be used for transactions budgets
                    // Do not fetch categories if they have already been searched
                    if (categories.income.length === 0 || categories.expenses.length == 0) {
                        await api.getAndSetCategories({ idToken });
                    }

                    // if (activeProjectId && budgets.length == 0) {
                    //     console.log(activeProjectId)
                    //     await api.getBudgets().catch(err => console.error(err));
                    // }
                    //
                    // if (idToken && accounts.length == 0) {
                    //     await api.getAccounts().catch(err => console.error(err));
                    // }

                    dispatch(setAuthState(AuthState.AUTHENTICATED));
                } else {
                    // in case of log out
                    dispatch(setAuthState(AuthState.UNAUTHENTICATED));
                    //  dispatch(clearAuthUser(null));
                }
            },
            (err) => {
                console.error(err);
            }
        );
    }

    useEffect(() => {
        if (typeof window == "undefined") {
            return;
        }
        loadApplicationData();
    }, []);

    return (
        <>
            <Head>
                <title>Sunshine Financial Manager</title>
                <meta name="description" content="Sunshine Financial Manage" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <NextNProgress color="#FB9700" startPosition={0.3} stopDelayMs={200} height={5} showOnShallow={true} />
            <ChakraProvider theme={theme}>
                <>
                    <Component {...pageProps} />
                </>
            </ChakraProvider>
        </>
    );
}

export default wrapper.withRedux(MyApp);
