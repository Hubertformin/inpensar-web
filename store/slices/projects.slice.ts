import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../";
import { HYDRATE } from "next-redux-wrapper";
import {Data} from "../../data";

const initialState = {
    data: [Data.project],
    activeProject: Data.project
};


export const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjectsState(state, action) {
            state.data = action.payload;
        },
        setSelectedProjectState(state, action) {
            state.activeProject = action.payload;
        },
        appendProjectState(state, action) {
            state.data = [...state.data, action.payload]
        },
        prependProjectState(state, action) {
            state.data = [action.payload, ...state.data]
        },
        replaceProjectInState(state, action) {
            state.data = state.data.map(t => {
                if (t._id === action.payload._id) {
                    t = action.payload;
                }
                return t;
            });
        },
        removeProjectFromState(state, action) {
            state.data = state.data.filter(t => t._id !== action.payload._id);
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.projects,
                };
            },
        },

    },
});

export const {
    setProjectState,
    appendProjectState,
    prependProjectState,
    setSelectedProjectState,
    replaceProjectInState,
    removeProjectFromState
} = projectsSlice.actions;

export const selectProjectState = (state: AppState) => state.projects.data;

export const selectActiveProjectState = (state: AppState) => state.projects.activeProject;

export default projectsSlice.reducer;