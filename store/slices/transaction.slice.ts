import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";
import { Data } from "../../data";
import { addTransactionThunk } from "../thunks/transaction.thunk";
import AddTransaction from "../../components/transactions/AddTransaction";
import {
  computeTransactionBalance,
  sumTransactionEarnings,
  sumTransactionExpenses,
} from "../../utils/number";
import {
  TransactionsModel,
  TransactionType,
} from "../../models/transactions.model";

const initialState = {
  data: Data.transactions,
  loading: false,
  insights: {
    earnings: sumTransactionEarnings(Data.transactions) || 0,
    expenses: sumTransactionExpenses(Data.transactions) || 0,
    balance: computeTransactionBalance(Data.transactions) || 0,
  },
};

const computeInsights = (
  state,
  transaction: TransactionsModel,
  opp: "ADD" | "UPDATE" | "SUBTRACT",
  oldTransaction?: TransactionsModel
) => {
  console.clear();
  console.log(transaction);
  switch (opp) {
    case "ADD":
      if (transaction.type === TransactionType.INCOME) {
        state.insights.earnings += Number(transaction.amount);
        state.insights.balance =
          state.insights.earnings - state.insights.expenses;
      } else if (transaction.type === TransactionType.EXPENSE) {
        state.insights.expenses += Number(transaction.amount);
        state.insights.balance =
          state.insights.earnings - state.insights.expenses;
      }
      break;
    case "SUBTRACT":
      console.log(transaction.amount);
      if (transaction.type === TransactionType.INCOME) {
        state.insights.earnings -= Number(transaction.amount);
        state.insights.balance =
          state.insights.earnings - state.insights.expenses;
      } else if (transaction.type === TransactionType.EXPENSE) {
        state.insights.expenses -= Number(transaction.amount);
        console.log(state.insights.earnings);
        console.log(state.insights.expenses);
        state.insights.balance =
          state.insights.earnings - state.insights.expenses;
      }
      break;
    case "UPDATE":
      if (transaction.type === TransactionType.INCOME) {
        state.insights.earnings +=
          Number(transaction.amount) - Number(oldTransaction.amount);
        state.insights.balance =
          state.insights.earnings - state.insights.expenses;
      } else if (transaction.type === TransactionType.EXPENSE) {
        state.insights.expenses +=
          Number(transaction.amount) - Number(oldTransaction.amount);
        state.insights.balance =
          state.insights.earnings - state.insights.expenses;
      }
      break;
    default:
      break;
  }
};

// @ts-ignore
export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionState(state, action) {
      state.data = action.payload.data;
      state.insights.earnings = action.payload.insights.earnings;
      state.insights.expenses = action.payload.insights.expenses;
      state.insights.balance = action.payload.insights.balance;
    },
    appendTransactionState(state, action) {
      // computeTransactionState(state,[...state..data, action.payload])
      state.data = [...state.data, action.payload];
      computeInsights(state, action.payload, "ADD");
    },
    prependTransactionState(state, action) {
      state.data = [action.payload, ...state.data];
      computeInsights(state, action.payload, "ADD");
    },
    replaceTransactionInState(state, action) {
      let oldTransaction: TransactionsModel = state.data.find(
        (t) => t._id === action.payload._id
      );
      state.data = state.data.map((t) => {
        if (t._id === action.payload._id) {
          t = action.payload;
        }
        return t;
      });
      computeInsights(state, action.payload, "UPDATE", oldTransaction);
    },
    removeTransactionFromState(state, action) {
      state.data = state.data.filter((t) => t._id !== action.payload._id);
      computeInsights(state, action.payload, "SUBTRACT");
    },
  },
  extraReducers: (builder) => {
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    builder
      .addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...(action as any).payload.transactions,
        };
      })
      .addCase(addTransactionThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addTransactionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload, ...state.data];
      })
      .addCase(addTransactionThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {
  setTransactionState,
  appendTransactionState,
  prependTransactionState,
  replaceTransactionInState,
  removeTransactionFromState,
} = transactionsSlice.actions;

export const selectTransactionData = (state: AppState) =>
  state.transactions.data;
export const selectTransactionInsights = (state: AppState) =>
  state.transactions.insights;

export const selectTransactionLoadingState = (state: AppState) =>
  state.transactions.loading;

export default transactionsSlice.reducer;
