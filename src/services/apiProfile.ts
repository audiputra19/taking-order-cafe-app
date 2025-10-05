import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { CreateCompanyProfileRequest, CreateCompanyProfileResponse, GetCompanyProfileResponse } from "../interfaces/profile";

export const apiProfile = createApi({
    reducerPath: 'apiProfile',
    baseQuery,
    tagTypes: ["Profile"],
    endpoints: build => ({
        createCompanyProfile: build.mutation<CreateCompanyProfileResponse, FormData | CreateCompanyProfileRequest>({
            query: (formData) => ({
                url: "profile/create-company-profile",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Profile"]
        }),
        getCompanyProfile: build.query<GetCompanyProfileResponse, void>({
            query: () => ({
                url: "profile/get-company-profile",
                method: "GET"
            }),
            providesTags: ["Profile"]
        })
    })
})

export const { useCreateCompanyProfileMutation, useGetCompanyProfileQuery } = apiProfile;