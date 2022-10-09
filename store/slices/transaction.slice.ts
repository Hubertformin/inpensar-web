import {createSlice} from "@reduxjs/toolkit";
import {AppState} from "../";
import {HYDRATE} from "next-redux-wrapper";
import {Data} from "../../data";
import {addTransactionThunk} from "../thunks/transaction.thunk";
import AddTransaction from "../../pages/components/AddTransaction";

const initialState = {
    data: Data.transactions,
    loading: false
};


// @ts-ignore
export const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactionState(state, action) {
            state.data = action.payload;
        },
        appendTransactionState(state, action) {
            state.data = [...state.data, action.payload]
        },
        prependTransactionState(state, action) {
            state.data = [action.payload, ...state.data]
        },
        replaceTransactionInState(state, action) {
            state.data = state.data.map(t => {
                if (t._id === action.payload._id) {
                    t = action.payload;
                }
                return t;
            });
        }, removeTransactionFromState(state, action) {
            state.data = state.data.filter(t => t._id !== action.payload._id);
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

export const selectTransactionState = (state: AppState) => state.transactions.data;

export const selectTransactionLoadingState = (state: AppState) => state.transactions.loading;

export default transactionsSlice.reducer;