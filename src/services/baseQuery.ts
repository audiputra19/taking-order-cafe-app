import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { BASE_URL } from "../components/BASE_URL";

export const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}`
})

export const baseQueryAuth = fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth/`,
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).auth.token;
        if(token) headers.set("authorization", `Bearer ${token}`);
        return headers;
    }
});