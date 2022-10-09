import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";
import {Data} from "../../data";

const initialState = {
    walletsState: Data.wallets
};


export const walletSlice = createSlice({
    name: "wallets",
    initialState,
    reducers: {

        setWalletState(state, action) {
            state.walletsState = action.payload;
        },
        appendWalletState(state, action) {
            state.walletsState = [...state.walletsState, action.payload]
        },
        prependWalletState(state, action) {
            state.walletsState = [action.payload, ...state.walletsState]
        },
        replaceWalletInState(state, action) {
            state.walletsState = state.walletsState.map(t => {
                if (t._id === action.payload._id) {
                    t = action.payload;
                }
                return t;
            });
        },removeWalletFromState(state, action) {
            state.walletsState = state.walletsState.filter(t => t._id !== action.payload._id);
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.wallets,
                };
            },
        },

    },
});

export const {
    setWalletState,
    appendWalletState,
    prependWalletState,
    replaceWalletInState,
    removeWalletFromState
} = walletSlice.actions;

export const selectWalletState = (state: AppState) => state.wallets.walletsState;

export default walletSlice.reducer;