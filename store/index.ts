import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { transactionsSlice } from "./slices/transaction.slice";
import { walletSlice } from "./slices/wallet.slice";
import { budgetsSlice } from "./slices/budget.slice";
import { categoriesSlice } from "./slices/categories.slice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
    configureStore({
        reducer: {
            [transactionsSlice.name]: transactionsSlice.reducer,
            [walletSlice.name]: walletSlice.reducer,
            [budgetsSlice.name]: budgetsSlice.reducer,
            [categoriesSlice.name]: categoriesSlice.reducer,
        },
        devTools: true,
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
    >;

export const wrapper = createWrapper<AppStore>(makeStore);
