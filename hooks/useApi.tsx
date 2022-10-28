import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { BudgetModel } from "../models/budget.model";
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
  replaceTransactionInState, setTransactionState,
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
import {selectAuthUserIdTokenState, setAuthUserState, setUserSettings} from "../store/slices/auth.slice";
import {prependProjectState, selectActiveProjectState, setActiveProjectState} from "../store/slices/projects.slice";
import {UserModel} from "../models/user.model";
import {ProjectModel} from "../models/project.model";
import {setCategoriesState} from "../store/slices/categories.slice";

const API = process.env.NODE_ENV == 'development' ? 'http://localhost:5001/inpensar-enchird/us-central1/api' : 'https://us-central1-inpensar-enchird.cloudfunctions.net/api'
export default function useApi() {
  const httpInstance = axios.create({
    baseURL: API,
    httpAgent: 'Inpensar/web'
  });

  const dispatch = useDispatch();
  const idToken = useSelector(selectAuthUserIdTokenState);
  const activeProject = useSelector(selectActiveProjectState);


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

    return { authUser, project: data['data'].project };
  }

  async function updateUserSettings(id: string, payload: any) {
    const {data} = await httpInstance.put(`/users/${id}`, {settings: payload}, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });

    dispatch(setUserSettings(payload));

    return data;
  }

  async function getAndSetCurrentUsersData({idToken = null}) {
    const {data} = await httpInstance.get('/users/me', {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
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
  async function getAndSetActiveProject({projectId, idToken }): Promise<ProjectModel> {
    const {data} = await httpInstance.get(`/projects/${projectId}`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    const projectData = data['data'].results;
    dispatch(setActiveProjectState({...projectData}));
    return projectData;
  }
  /**
   *  ===== CATEGORIES =====
   */
  async function getAndSetCategories({idToken = null}) {
    const {data} = await httpInstance.get(`/projects/categories/all`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    const categoriesData = data['data'].results;
    const expenses = categoriesData.filter(category => category.type === TransactionType.EXPENSE);
    const income = categoriesData.filter(category => category.type === TransactionType.INCOME);
    dispatch(setCategoriesState({ income, expenses }));
    return categoriesData;
  }
  /**
   *  ===== TRANSACTIONS =====
   */

  async function getTransactions(): Promise<TransactionsModel[]> {
    const {data} = await httpInstance.get(`/projects/${activeProject._id}/transactions/me`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(setTransactionState(data['data'].results));

    return data['data'].results;
  }
  async function addTransaction(
    transaction: TransactionsModel
  ): Promise<TransactionsModel> {
    // Add transaction to database....
    const payload = {...transaction, category: transaction.category._id, account: transaction.account._id};
    const {data} = await httpInstance.post(`/projects/${activeProject._id}/transactions`, payload, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(prependTransactionState({...data['data'].results, category: transaction.category, account: transaction.account }));
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
    const {data} = await httpInstance.put(`/projects/${activeProject._id}/transactions/${transaction._id}`, payload, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(replaceTransactionInState({...data['data'].results, category: transaction.category, account: transaction.account }));
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
    // TODO: API CALL
    const {data} = await httpInstance.delete(`/projects/${activeProject._id}/transactions/${transaction._id}`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
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
    const {data} = await httpInstance.get(`/projects/${activeProject._id}/budgets/me`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });

    dispatch(setBudgetState(data['data'].results));
  }
  async function addBudget(budget: BudgetModel): Promise<BudgetModel> {
    // TODO: API CALL
    const payload = {
      ...budget,
      categories: budget.categories.map(c => c._id)
    };
    const {data} = await httpInstance.post(`/projects/${activeProject._id}/budgets`, payload, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(appendBudgetState({...data['data'].results, categories: budget.categories }));
    return data['data'].results;
  }

  async function updateBudget(budget: BudgetModel): Promise<BudgetModel> {
    const payload = {
      ...budget,
      categories: budget.categories.map(c => c._id)
    };
    const {data} = await httpInstance.put(`/projects/${activeProject._id}/budgets/${budget._id}`, payload, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(replaceBudgetInState({...data['data'].results, categories: budget.categories }));
    return data['data'].results;
  }

  async function deleteBudget(budget: BudgetModel): Promise<BudgetModel> {
    // TODO: API CALL
    await httpInstance.delete(`/projects/${activeProject._id}/budgets/${budget._id}`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(removeBudgetFromState(budget));
    return null;
  }

  /**
   * ========= ACCOUNTS =========
   */
  async function getAccounts(): Promise<AccountsModel[]> {
    const {data} = await httpInstance.get(`/accounts/me`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(setAccountsState(data['data'].results));

    return data['data'].results;
  }
  async function addAccount(account: AccountsModel): Promise<AccountsModel> {
    const {data} = await httpInstance.post(`/accounts`, account, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(appendAccountsState(data['data'].results));

    return data['data'].results;
  }

  async function updateAccount(account: AccountsModel): Promise<AccountsModel> {
    const {data} = await httpInstance.put(`/accounts/${account._id}`, account, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(replaceAccountsInState(data['data'].results));

    return data['data'].results;
  }

  async function deleteAccount(account: AccountsModel): Promise<AccountsModel> {
    await httpInstance.delete(`/accounts/${account._id}`, {
      ...(idToken && { headers: { 'Authorization': `Bearer ${idToken}` }})
    });
    dispatch(removeAccountsFromState(account));

    return account;
  }

  return {
    createUserAccount,
    updateUserSettings,
    getAndSetCurrentUsersData,
    getAndSetActiveProject,
    getAndSetCategories,
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
