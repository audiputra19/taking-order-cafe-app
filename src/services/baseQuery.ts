import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3001'
})

export const baseQueryAuth = fetchBaseQuery({
    baseUrl: "http://localhost:3001/auth/",
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).auth.token;
        if(token) headers.set("authorization", `Bearer ${token}`);
        return headers;
    }
});