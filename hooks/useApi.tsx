import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { CONSTANTS } from "../data/constants";
import { BudgetModel } from "../models/budget.model";
import { TransactionsModel } from "../models/transactions.model";
import {appendBudgetState, removeBudgetFromState, replaceBudgetInState} from "../store/slices/budget.slice";
import {
  prependTransactionState,
  removeTransactionFromState,
  replaceTransactionInState,
} from "../store/slices/transaction.slice";
import { getRandomItemFromList } from "../utils/array";
import {AccountsModel} from "../models/accounts.model";
import {appendAccountsState, removeAccountsFromState, replaceAccountsInState} from "../store/slices/accounts.slice";
import axios from "axios";
import {fireAuth} from "../utils/firebase";
import {signInWithCustomToken} from "@firebase/auth";
import {selectAuthUserIdTokenState, setAuthUserDocument} from "../store/slices/auth.slice";


export default function useApi() {
  const httpInstance = axios.create({
    baseURL: 'http://localhost:4000',
    httpAgent: 'Inpensar/web'
  });

  const dispatch = useDispatch();
  const idToken = useSelector(selectAuthUserIdTokenState);

  React.useEffect(() => {
    httpInstance.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
  }, [idToken]);

  async function createUserAccount(userData: any) {
    const {data} = await httpInstance.post('/users', userData);
    console.log(data);
    const authUser = await signInWithCustomToken(fireAuth, data['data'].authToken);

    dispatch(setAuthUserDocument(data['data'].results))

    return authUser;
  }
  /**
   *  ===== TRANSACTIONS =====
   */
  async function addTransaction(
    transaction: TransactionsModel
  ): Promise<TransactionsModel> {
    // Add transaction to database....
    dispatch(prependTransactionState(transaction));
    return transaction;
  }

  async function updateTransaction(
    transaction: TransactionsModel
  ): Promise<TransactionsModel> {
    // Update transaction in database....
    dispatch(replaceTransactionInState(transaction));
    return transaction;
  }

  function deleteTransaction(transaction: TransactionsModel) {
    // TODO: API CALL
    dispatch(removeTransactionFromState(transaction));
    return Promise.resolve(transaction._id);
  }
  /**
   *  ===== Budgets =====
   */
  async function addBudget(budget: BudgetModel): Promise<BudgetModel> {
    // TODO: API CALL
    budget._id = (Math.random() * 100).toFixed(1).toString();
    budget.color = getRandomItemFromList(CONSTANTS.COLORS);
    budget.owner = "USER";
    dispatch(appendBudgetState(budget));
    return budget;
  }

  async function updateBudget(budget: BudgetModel): Promise<BudgetModel> {
    // TODO: API CALL
    dispatch(replaceBudgetInState(budget));
    return budget;
  }

  async function deleteBudget(budget: BudgetModel): Promise<BudgetModel> {
    // TODO: API CALL
    dispatch(removeBudgetFromState(budget));
    return null;
  }

  /**
   * ========= ACCOUNTS =========
   */
  async function addAccount(account: AccountsModel): Promise<AccountsModel> {
    // TODO: API CALLS
    account._id = (Math.random() * 100).toFixed(1).toString();
    account.owner = "USER";
    dispatch(appendAccountsState(account));

    return account;
  }

  async function updateAccount(account: AccountsModel): Promise<AccountsModel> {
    // TODO: API CALLS
    dispatch(replaceAccountsInState(account));

    return account;
  }

  async function deleteAccount(account: AccountsModel): Promise<AccountsModel> {
    // TODO: API CALLS
    dispatch(removeAccountsFromState(account));

    return account;
  }

  return {
    createUserAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addAccount,
    updateAccount,
    deleteAccount
  };
}
