import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { AddOutletRequest, AddOutletResponse, GetOutletRequest, GetOutletResponse } from "../interfaces/outlet";

export const apiOutlet = createApi({
    reducerPath: 'apiOutlet',
    baseQuery,
    tagTypes: ["outlet"],
    endpoints: builder => ({
        addOutlet: builder.mutation<AddOutletResponse, AddOutletRequest>({
            query: (body) => ({
                url: 'outlet/add-outlet',
                method: 'POST',
                body
            }),
            invalidatesTags: ["outlet"]
        }),
        getOutlet: builder.query<GetOutletResponse[], GetOutletRequest>({
            query: (data) => ({
                url: `outlet/get-outlet/${data.company_id}`,
                method: 'GET'
            }),
            providesTags: ["outlet"]
        })
    })
}) 

export const { useAddOutletMutation, useGetOutletQuery } = apiOutlet;