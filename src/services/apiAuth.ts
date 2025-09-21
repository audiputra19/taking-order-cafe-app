import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from './baseQuery'
import type { AuthState, LoginRequest, LoginResponse, MeResponse, MeState } from "../interfaces/auth";

export const apiAuth = createApi({
    reducerPath: 'apiAuth',
    baseQuery: baseQueryAuth,
    tagTypes: ["auth"],
    endpoints: build => ({
        postLogin: build.mutation<AuthState<LoginResponse>, LoginRequest>({
            query: body => ({
                url: 'login',
                method: 'POST',
                body
            }),
            invalidatesTags: ["auth"]
        }),
        postMe: build.query<MeState<MeResponse>, void>({
            query: () => ({
                url: 'me',
                method: 'POST'
            }),
            providesTags: ["auth"]
        })
    })
});

export const { usePostLoginMutation, usePostMeQuery } = apiAuth;