import {createSlice} from "@reduxjs/toolkit";
import {AppState} from "../";
import {HYDRATE} from "next-redux-wrapper";
import {Data} from "../../data";
import {getCategoriesThunk} from "../thunks/category.thunk";

const initialState = {
    income: Data.income_categories,
    expenses: Data.expense_categories,
    loading: false
};


// @ts-ignore
export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategoriesState(state, action) {
            state.income = action.payload.income;
            state.expenses = action.payload.expenses;
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
            .addCase(getCategoriesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.income = action.payload.income;
                state.expenses = action.payload.expenses;
            })
    }
});

export const {
    setCategoriesState
} = categoriesSlice.actions;

export const selectCategoriesState = (state: AppState) => state.categories;

export default categoriesSlice.reducer;