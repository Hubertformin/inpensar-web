import { useDispatch } from "react-redux";
import { TransactionsModel } from "../models/transactions.model";
import {
  prependTransactionState,
  removeTransactionFromState,
  replaceTransactionInState,
} from "../store/slices/transaction.slice";

export default function useApi() {
  const dispatch = useDispatch();
  /**
   *  ===== TRANSACTIONS =====
   */
  function addTransaction(
    transaction: TransactionsModel
  ): Promise<TransactionsModel> {
    // Add transaction to database....
    dispatch(prependTransactionState(transaction));
    return Promise.resolve(transaction);
  }

  function updateTransaction(
    transaction: TransactionsModel
  ): Promise<TransactionsModel> {
    // Update transaction in database....
    dispatch(replaceTransactionInState(transaction));
    return Promise.resolve(transaction);
  }

  function deleteTransaction(transaction: TransactionsModel) {
    // TODO: API CALL
    dispatch(removeTransactionFromState(transaction));
    return Promise.resolve(transaction._id);
  }

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}