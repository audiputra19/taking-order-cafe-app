import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './baseQuery' 
import type { GetOrder, GetOrderByIdResponse, OrderRequest, OrderResponse } from "../interfaces/order";

export const apiOrder = createApi({
    reducerPath: 'apiOrder',
    baseQuery,
    tagTypes: ["Order"],
    endpoints: builder => ({
        getOrder: builder.query<GetOrder[], void>({
            query: () => ({
                url: 'order/get-order',
                method: 'GET'
            }),
            providesTags: ["Order"]
        }),
        getOrderComplete: builder.query<GetOrder[], void>({
            query: () => ({
                url: 'order/get-order-complete',
                method: 'GET'
            }),
            providesTags: ["Order"]
        }),
        paidOrderByKasir: builder.mutation<OrderResponse, OrderRequest>({
            query: (body) => ({
                url: 'order/paid-kasir',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        cancelOrderByKasir: builder.mutation<OrderResponse, OrderRequest>({
            query: (body) => ({
                url: 'order/cancel-kasir',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        acceptOrderByKasir: builder.mutation<OrderResponse, OrderRequest>({
            query: (body) => ({
                url: 'order/accept-kasir',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        acceptOrderByDapur: builder.mutation<OrderResponse, OrderRequest>({
            query: (body) => ({
                url: 'order/accept-dapur',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        readyOrder: builder.mutation<OrderResponse, OrderRequest>({
            query: (body) => ({
                url: 'order/ready',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        finishOrder: builder.mutation<OrderResponse, OrderRequest>({
            query: (body) => ({
                url: 'order/finish',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        getOrderById: builder.query<GetOrderByIdResponse[], string>({
            query: (id) => ({
                url: `order/get-order-by-id/${id}`,
                method: 'GET'
            }),
            providesTags: ["Order"]
        })
    })
})

export const { useGetOrderQuery, useGetOrderCompleteQuery, usePaidOrderByKasirMutation,
    useCancelOrderByKasirMutation, useAcceptOrderByKasirMutation, useAcceptOrderByDapurMutation, 
    useReadyOrderMutation, useFinishOrderMutation, useLazyGetOrderByIdQuery, useGetOrderByIdQuery
} = apiOrder;