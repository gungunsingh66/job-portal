import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    authLoading: true,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authLoading = false;
        },

        logoutSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.authLoading = false;
        },

        authCheckComplete: (state) => {
            state.authLoading = false;
        },
    },
});

export const {
    loginSuccess,
    logoutSuccess,
    authCheckComplete,
} = authSlice.actions;

export default authSlice.reducer;