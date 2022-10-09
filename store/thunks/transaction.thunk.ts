// This file has functions that communicate with the backend

import {TransactionsModel} from "../../models/transactions.model";
import {createAsyncThunk} from "@reduxjs/toolkit";

// TODO: IMPLEMENT API REQUEST
export const addTransactionThunk = createAsyncThunk('transactions/add',
    async (transaction: TransactionsModel, thunkAPI) => {
        // Send api request to add
        return transaction;
});