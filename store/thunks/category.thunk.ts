
// TODO: IMPLEMENT API REQUEST
import {createAsyncThunk} from "@reduxjs/toolkit";
import {Data} from "../../data";

export const getCategoriesThunk = createAsyncThunk('categories/get',
    async (thunkAPI) => {
        // Send api request to add
        return {income: Data.income_categories, expenses: Data.expense_categories};
    });