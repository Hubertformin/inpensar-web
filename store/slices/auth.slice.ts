import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";

export enum AuthState {
    LOADING = 'LOADING',
    AUTHENTICATED = 'AUTHENTICATED',
    UNAUTHENTICATED = 'UNAUTHENTICATED',
}

const initialState = {
    data: {
        name: '',
        email: '',
        _id: undefined,
        uid: '',
        settings: {
            country: '',
            language: '',
            currency: ''
        }
    },
    idToken: '',
    authState: AuthState.LOADING
};


export const authUserSlice = createSlice({
    name: "authUser",
    initialState,
    reducers: {
        setAuthUserState(state, action) {
            Object.assign(state.data, action.payload);
        },
        setIdTokenState(state, action) {
            state.idToken = action.payload;
        },
        setAuthState(state, action) {
            state.authState = action.payload;
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
    setAuthState,
    clearAuthUser
} = authUserSlice.actions;

export const selectAuthUserState = (state: AppState) => state.authUser.data;

export const selectAuthState = (state: AppState) => state.authUser.authState;

export const selectAuthUserIdTokenState = (state: AppState) => state.authUser.idToken;

export default authUserSlice.reducer;