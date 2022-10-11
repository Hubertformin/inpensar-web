import {createSlice} from "@reduxjs/toolkit";
import {AppState} from "../";
import {HYDRATE} from "next-redux-wrapper";
import {Data} from "../../data";
import {addTransactionThunk} from "../thunks/transaction.thunk";
import AddTransaction from "../../components/AddTransaction";
import {computeTransactionBalance, sumTransactionEarnings, sumTransactionExpenses} from "../../utils/number";
import {TransactionType} from "../../models/transactions.model";

const initialState = {
    data: Data.transactions,
    loading: false,
    insights: {
        earnings: sumTransactionEarnings(Data.transactions) || 0,
        expenses: sumTransactionExpenses(Data.transactions) || 0,
        balance: computeTransactionBalance(Data.transactions) || 0
    }
};

const computeTransactionState = (state, newState) => {
    state.data = newState;
    state.insights.earnings = sumTransactionEarnings(newState);
    state.insights.expenses = sumTransactionExpenses(newState);
    state.insights.balance = computeTransactionBalance(newState);
}

// @ts-ignore
export const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactionState(state, action) {
            // state.data = action.payload;
            computeTransactionState(state, action.payload);
        },
        appendTransactionState(state, action) {
            computeTransactionState(state,[...state.data, action.payload])

        },
        prependTransactionState(state, action) {
            computeTransactionState(state, [action.payload, ...state.data]);
        },
        replaceTransactionInState(state, action) {
            const newState = state.data.map(t => {
                if (t._id === action.payload._id) {
                    t = action.payload;
                }
                return t;
            });
            computeTransactionState(state, newState);
        }, removeTransactionFromState(state, action) {
            const newState = state.data.filter(t => t._id !== action.payload._id);
            computeTransactionState(state, newState);
        },
    },
    extraReducers: builder => {
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
                state.loading = false
            })
    }
});

export const {
    setTransactionState,
    appendTransactionState,
    prependTransactionState,
    replaceTransactionInState,
    removeTransactionFromState
} = transactionsSlice.actions;

export const selectTransactionData = (state: AppState) => state.transactions.data;
export const selectTransactionInsights = (state: AppState) => state.transactions.insights;

export const selectTransactionLoadingState = (state: AppState) => state.transactions.loading;

export default transactionsSlice.reducer;