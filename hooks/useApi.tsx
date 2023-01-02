import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {BudgetModel} from "../models/budget.model";
import {TransactionsModel, TransactionType} from "../models/transactions.model";
import {
    appendBudgetState,
    removeBudgetFromState,
    replaceBudgetInState,
    setBudgetState
} from "../store/slices/budget.slice";
import {
    prependTransactionState,
    removeTransactionFromState,
    replaceTransactionInState,
    setTransactionState,
} from "../store/slices/transaction.slice";
import {AccountsModel} from "../models/accounts.model";
import {
    appendAccountsState,
    removeAccountsFromState,
    replaceAccountsInState,
    setAccountsState
} from "../store/slices/accounts.slice";
import axios from "axios";
import {fireAuth} from "../utils/firebase";
import {signInWithCustomToken} from "@firebase/auth";
import {selectAuthUserIdTokenState, setAuthUserState, setUser} from "../store/slices/auth.slice";
import {
    prependProjectState,
    selectActiveProjectIdState,
    setActiveProjectState,
    updateActiveProjectState
} from "../store/slices/projects.slice";
import {UserModel} from "../models/user.model";
import {ProjectModel} from "../models/project.model";
import {setCategoriesState} from "../store/slices/categories.slice";
import {setAnalyticsFiltersState, setAnalyticsState} from "../store/slices/analytics.slice";

export default function useApi() {
    const httpInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        httpAgent: 'Inpensar/web'
    });

    const dispatch = useDispatch();
    const idToken = useSelector(selectAuthUserIdTokenState);
    const activeProjectId = useSelector(selectActiveProjectIdState);


    async function createUserAccount(payload: any) {
        const {data} = await httpInstance.post('/users', payload);
        const authUser = await signInWithCustomToken(fireAuth, data['data'].authToken);
        const userData = data['data'].results as UserModel;
        dispatch(setAuthUserState({
            _id: userData._id,
            name: authUser.user.displayName,
            email: authUser.user.email,
            settings: userData.settings,
            uid: authUser.user.uid
        }));
        // set default active project
        dispatch(prependProjectState(data['data'].project));
        dispatch(setActiveProjectState(data['data'].project));

        return {authUser, project: data['data'].project};
    }


    async function updateUser(id: string, payload: any) {
        const {data} = await httpInstance.put(`/users/${id}`, payload, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });

        dispatch(setUser(payload));

        return data;
    }

    function updateUserSettings(id: string, payload: any) {
        return updateUser(id, {settings: payload});
    }

    async function getAndSetCurrentUsersData({idToken = null}) {
        const {data} = await httpInstance.get('/users/me', {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        const userData = data['data'].results;
        dispatch(setAuthUserState({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            settings: userData.settings,
            uid: userData.uid
        }));
        return userData;
    }

    async function createFirebaseUserData(uid: string, payload) {
        const {data} = await httpInstance.post(`/users/uid/${uid}`, payload, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        const userData = data['data'].results;
        dispatch(setAuthUserState({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            settings: userData.settings,
            uid: userData.uid
        }));
        return userData;
    }

    /**
     *  ===== PROJECTS =====
     */
    async function getProjects(): Promise<ProjectModel[]> {
        const {data} = await httpInstance.get(`/projects/`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        return data['data'].results;
    }

    async function getAndSetActiveProject({projectId, idToken}): Promise<ProjectModel> {
        const {data} = await httpInstance.get(`/projects/${projectId}`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        const projectData = data['data'].results;
        dispatch(setActiveProjectState({...projectData}));
        return projectData;
    }

    async function updateProject(id: string, payload: any): Promise<ProjectModel> {
        const {data} = await httpInstance.put(`/projects/${id}`, payload, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        const projectData = data['data'].results;
        dispatch(updateActiveProjectState({...projectData}));
        return projectData;
    }

    /**
     *  ===== CATEGORIES =====
     */
    async function getAndSetCategories({idToken = null}) {
        const {data} = await httpInstance.get(`/projects/categories/all`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        const categoriesData = data['data'].results;
        const expenses = categoriesData.filter(category => category.type === TransactionType.EXPENSE);
        const income = categoriesData.filter(category => category.type === TransactionType.INCOME);
        dispatch(setCategoriesState({income, expenses}));
        return categoriesData;
    }

    /**
     *  ===== REPORT =====
     */
    interface ReportsFilters {
        startDate?: string;
        endDate?: string;
        dateFilter?: string;
    }

    async function getProjectReports(filters: ReportsFilters = {}): Promise<any> {
        // save filters to state
        dispatch(setAnalyticsFiltersState(filters))
        // Construct query params
        const searchParams = new URLSearchParams(filters as URLSearchParams).toString();
        // Fetch
        const {data} = await httpInstance.get(`/projects/${activeProjectId}/reports?${searchParams}`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        console.log(data['data'])
        dispatch(setAnalyticsState(data['data']));

        return data['data'];
    }

    /**
     *  ===== TRANSACTIONS =====
     */
    interface TransactionFilters {
        startDate?: string;
        endDate?: string;
        dateFilter?: string;
        page?: number;
        limit?: number;
        search?: string;
    }

    async function getTransactions(filters: TransactionFilters = {}): Promise<TransactionsModel[]> {
        const searchParams = new URLSearchParams(filters as URLSearchParams).toString();
        const {data} = await httpInstance.get(`/projects/${activeProjectId}/transactions/me?${searchParams}`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });

        // Only update the state if there are results. This is done to prevent infinite re-renders as some hooks
        // listen to this data
        if (data['data'].results.length > 0) {
            dispatch(setTransactionState(data['data'].results));
        }

        return data['data'].results;
    }

    async function addTransaction(
        transaction: TransactionsModel
    ): Promise<TransactionsModel> {
        // Add transaction to database....
        const payload = {...transaction, category: transaction.category._id, account: transaction.account._id};
        const {data} = await httpInstance.post(`/projects/${activeProjectId}/transactions`, payload, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(prependTransactionState({
            ...data['data'].results,
            category: transaction.category,
            account: transaction.account
        }));
        // update the state with the wallet(s) or budget that was updated
        if (data['data'].accounts) {
            dispatch(replaceAccountsInState(data['data'].accounts));
        }

        if (data['data'].budget) {
            dispatch(replaceBudgetInState(data['data'].budget));
        }

        return data['data'].results;
    }

    async function updateTransaction(
        transaction: TransactionsModel
    ): Promise<TransactionsModel> {
        // Update transaction in database....
        const payload = {...transaction, category: transaction.category._id, account: transaction.account._id};
        const {data} = await httpInstance.put(`/projects/${activeProjectId}/transactions/${transaction._id}`, payload, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(replaceTransactionInState({
            ...data['data'].results,
            category: transaction.category,
            account: transaction.account
        }));
        // update the state with the wallet(s) or budget that was updated
        if (data['data'].accounts) {
            dispatch(replaceAccountsInState(data['data'].accounts));
        }

        if (data['data'].budget) {
            dispatch(replaceBudgetInState(data['data'].budget));
        }
        return data['data'].results;
    }

    async function deleteTransaction(transaction: TransactionsModel) {
        const {data} = await httpInstance.delete(`/projects/${activeProjectId}/transactions/${transaction._id}`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(removeTransactionFromState(transaction));

        if (data['data'].budget) {
            dispatch(replaceBudgetInState(data['data'].budget));
        }

        return transaction._id;
    }

    /**
     *  ===== Budgets =====
     */
    async function getBudgets() {
        const {data} = await httpInstance.get(`/projects/${activeProjectId}/budgets/me`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });

        // Only update the state if there are results. This is done to prevent infinite re-renders as some hooks
        // listen to this data
        if (data['data'].results.length > 0) {
            dispatch(setBudgetState(data['data'].results));
        }
    }

    async function addBudget(budget: BudgetModel): Promise<BudgetModel> {
        const payload = {
            ...budget,
            categories: budget.categories.map(c => c._id)
        };
        const {data} = await httpInstance.post(`/projects/${activeProjectId}/budgets`, payload, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(appendBudgetState({...data['data'].results, categories: budget.categories}));
        return data['data'].results;
    }

    async function updateBudget(budget: BudgetModel): Promise<BudgetModel> {
        const payload = {
            ...budget,
            categories: budget.categories.map(c => c._id)
        };
        const {data} = await httpInstance.put(`/projects/${activeProjectId}/budgets/${budget._id}`, payload, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(replaceBudgetInState({...data['data'].results, categories: budget.categories}));
        return data['data'].results;
    }

    async function deleteBudget(budget: BudgetModel): Promise<BudgetModel> {
        await httpInstance.delete(`/projects/${activeProjectId}/budgets/${budget._id}`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(removeBudgetFromState(budget));
        return null;
    }

    /**
     * ========= ACCOUNTS =========
     */
    async function getAccounts(): Promise<AccountsModel[]> {
        const {data} = await httpInstance.get(`/accounts/me`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        // Only update the state if there are results. This is done to prevent infinite re-renders as some hooks
        // listen to this data
        if (data['data'].results.length > 0) {
            dispatch(setAccountsState(data['data'].results));
        }

        return data['data'].results;
    }

    async function addAccount(account: AccountsModel): Promise<AccountsModel> {
        const {data} = await httpInstance.post(`/accounts`, account, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(appendAccountsState(data['data'].results));

        return data['data'].results;
    }

    async function updateAccount(account: AccountsModel): Promise<AccountsModel> {
        const {data} = await httpInstance.put(`/accounts/${account._id}`, account, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(replaceAccountsInState(data['data'].results));

        return data['data'].results;
    }

    async function deleteAccount(account: AccountsModel): Promise<AccountsModel> {
        await httpInstance.delete(`/accounts/${account._id}`, {
            ...(idToken && {headers: {'Authorization': `Bearer ${idToken}`}})
        });
        dispatch(removeAccountsFromState(account));

        return account;
    }

    return {
        createUserAccount,
        updateUser,
        updateUserSettings,
        getAndSetCurrentUsersData,
        createFirebaseUserData,
        getProjects,
        getAndSetActiveProject,
        updateProject,
        getAndSetCategories,
        getProjectReports,
        getTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getBudgets,
        addBudget,
        updateBudget,
        deleteBudget,
        getAccounts,
        addAccount,
        updateAccount,
        deleteAccount
    };
}
