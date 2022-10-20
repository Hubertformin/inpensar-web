import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    data: {
        name: 'Hubert Formin',
        email: 'hformin@gmail.com'
    },
    idToken: '',
    document: null
};


export const authUserSlice = createSlice({
    name: "authUser",
    initialState,
    reducers: {
        setAuthUserState(state, action) {
            state.data = action.payload;
        },
        setIdTokenState(state, action) {
            state.idToken = action.payload;
        },
        setAuthUserDocument(state, action) {
            state.document = action.payload;
        },
        clearAuthUser(state, action) {
            state.data = null;
            state.idToken = null
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.authUser,
                };
            },
        },

    },
});

export const {
    setAuthUserState,
    setIdTokenState,
    setAuthUserDocument,
    clearAuthUser
} = authUserSlice.actions;

export const selectAuthUserState = (state: AppState) => state.authUser.data;

export const selectAuthUserIdTokenState = (state: AppState) => state.authUser.idToken;

export default authUserSlice.reducer;