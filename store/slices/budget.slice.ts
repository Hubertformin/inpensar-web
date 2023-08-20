import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "../";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    data: [],
    isLoading: false
};

export const budgetsSlice = createSlice({
    name: "budgets",
    initialState,
    reducers: {
        setBudgetLoadingState(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setBudgetState(state, action) {
            state.data = action.payload;
        },
        appendBudgetState(state, action) {
            state.data = [...state.data, action.payload];
        },
        prependBudgetState(state, action) {
            state.data = [action.payload, ...state.data];
        },
        replaceBudgetInState(state, action) {
            state.data = state.data.map((t) => {
                if (t._id === action.payload._id) {
                    t = action.payload;
                }
                return t;
            });
        },
        removeBudgetFromState(state, action) {
            (action)
            state.data = state.data.filter((t) => t._id !== action.payload._id);
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.budgets,
                };
            },
        },
    },
});

export const {
    setBudgetState,
    appendBudgetState,
    setBudgetLoadingState,
    prependBudgetState,
    replaceBudgetInState,
    removeBudgetFromState,
} = budgetsSlice.actions;

export const selectBudgetLoadingState = (state: AppState) => state.budgets.isLoading;

export const selectBudgetState = (state: AppState) => state.budgets.data;

export default budgetsSlice.reducer;
