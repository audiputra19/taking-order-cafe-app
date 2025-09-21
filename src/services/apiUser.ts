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
        getUser: builder.query<GetUserResponse[], void>({
            query: () => ({
                url: 'user/get-user',
                method: 'GET'
            }),
            providesTags: ["user"]
        }),
        deleteUser: builder.mutation<DeleteUserResponse, string>({
            query: (username) => ({
                url: `user/delete-user/${username}`,
                method: 'PUT'
            }),
            invalidatesTags: ["user"]
        })
    })
})

export const { useCreateUserMutation, useGetUserQuery, useDeleteUserMutation } = apiUser;