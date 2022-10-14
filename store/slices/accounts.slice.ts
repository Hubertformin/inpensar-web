import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";
import {Data} from "../../data";
import {computeAccountBalance} from "../../utils/account";

const initialState = {
    data: Data.wallets,
    balance: computeAccountBalance(Data.wallets)
};


export const accountsSlice = createSlice({
    name: "accounts",
    initialState,
    reducers: {

        setAccountsState(state, action) {
            state.data = action.payload;
            state.balance = computeAccountBalance(action.payload)
        },
        appendAccountsState(state, action) {
            state.data = [...state.data, action.payload]
            state.balance += action.payload.amount;
        },
        prependAccountsState(state, action) {
            state.data = [action.payload, ...state.data];
            state.balance += action.payload.amount;
        },
        replaceAccountsInState(state, action) {
            const oldAccount = state.data.find(a => a._id === action.payload._id);
            state.data = state.data.map(t => {
                if (t._id === action.payload._id) {
                    t = action.payload;
                }
                return t;
            });
            state.balance += (action.payload.amount - oldAccount.amount);
        },
        removeAccountsFromState(state, action) {
            state.data = state.data.filter(t => t._id !== action.payload._id);
            state.balance -= action.payload.amount;
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.accounts,
                };
            },
        },

    },
});

export const {
    setAccountsState,
    appendAccountsState,
    prependAccountsState,
    replaceAccountsInState,
    removeAccountsFromState
} = accountsSlice.actions;

export const selectAccountsState = (state: AppState) => state.accounts.data;

export const selectAccountBalanceState = (state: AppState) => state.accounts.balance;

export default accountsSlice.reducer;
