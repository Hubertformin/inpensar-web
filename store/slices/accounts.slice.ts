import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";
import {Data} from "../../data";
import {computeAccountBalance} from "../../utils/account";

const initialState = {
    data: [],
    balance: 0
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
            const wallets = Array.isArray(action.payload) ? action.payload : [action.payload];

            for (const wallet of wallets) {
                const oldAccount = state.data.find(a => a._id === wallet._id);
                state.data = state.data.map(t => {
                    if (t._id === wallet._id) {
                        t = wallet;
                    }
                    return t;
                });
                state.balance += (wallet.amount - oldAccount.amount);}
        }

        ,
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
