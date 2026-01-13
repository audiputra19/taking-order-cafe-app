import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './baseQuery';
import type { CreateUserRequest, CreateUserResponse, DeleteUserResponse, GetUserResponse } from "../interfaces/user";

export const apiUser = createApi({
    reducerPath: 'apiUser',
    baseQuery,
    tagTypes: ["user"],
    endpoints: builder => ({
        createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
            query: body => ({
                url: 'user/create-user',
                method: 'POST',
                body
            }),
            invalidatesTags: ["user"]
        }),
        getUser: builder.query<GetUserResponse[], { outlet_id: string | undefined }>({
            query: (data) => ({
                url: `user/get-user/${data.outlet_id}`,
                method: 'GET'
            }),
            providesTags: ["user"]
        }),
        deleteUser: builder.mutation<DeleteUserResponse, { username: string, outlet_id: string | undefined }>({
            query: (body) => ({
                url: `user/delete-user`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ["user"]
        })
    })
})

export const { useCreateUserMutation, useGetUserQuery, useDeleteUserMutation } = apiUser;