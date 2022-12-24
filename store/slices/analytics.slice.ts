import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    filters: {
        startDate: '',
        endDate: '',
        dateFilter: 'this_month'
    },
    data: null
};


export const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {
        setAnalyticsState(state, action) {
            state.data = action.payload;
        },
        setAnalyticsFiltersState(state, action) {
            state.filters = action.payload;
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.analytics,
                };
            },
        },

    },
});

export const {
    setAnalyticsState,
    setAnalyticsFiltersState
} = analyticsSlice.actions;

export const selectAnalyticsState = (state: AppState) => state.analytics.data;

export const selectAnalyticsFilters = (state: AppState) => state.analytics.filters;

export default analyticsSlice.reducer;