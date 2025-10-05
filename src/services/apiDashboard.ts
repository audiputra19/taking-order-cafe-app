import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { AverageFulfillmentTimeRequest, AverageFulfillmentTimeResponse, AverageOrderRequest, AverageOrderResponse, AverageOrderValueRequest, AverageOrderValueResponse, BestSellingProductsRequest, BestSellingProductsResponse, CategoryPerformanceRequest, CategoryPerformanceResponse, LowestSellingProductsRequest, LowestSellingProductsResponse, OrderCanceledRequest, OrderCanceledResponse, OrderTrendResponse, PeakOrderTimeRequest, PeakOrderTimeResponse, RevenueByCategoryRequest, RevenueByCategoryResponse, RevenueByProductRequest, RevenueByProductResponse, RevenueTrendResponse, TopPaymentMethodRequest, TopPaymentMethodResponse, TotalOrderRequest, TotalOrderResponse, TotalProfitRequest, TotalProfitResponse, TotalRevenueRequest, TotalRevenueResponse } from "../interfaces/dashboard";

export const apiDashboard = createApi({
    reducerPath: 'apiDashboard',
    baseQuery,
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        totalOrder: builder.mutation<TotalOrderResponse, TotalOrderRequest>({
            query: (body) => ({
                url: '/dashboard/total-order',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        orderCanceled: builder.mutation<OrderCanceledResponse, OrderCanceledRequest>({
            query: (body) => ({
                url: '/dashboard/order-canceled',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        averageOrder: builder.mutation<AverageOrderResponse, AverageOrderRequest>({
            query: (body) => ({
                url: '/dashboard/average-order',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        orderTrend: builder.query<OrderTrendResponse[], void>({
            query: () => ({
                url: '/dashboard/order-trend',
                method: 'GET'
            })
        }),
        categoryPerformance: builder.mutation<CategoryPerformanceResponse[], CategoryPerformanceRequest>({
            query: (body) => ({
                url: '/dashboard/category-performance',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        bestSellingProducts: builder.mutation<BestSellingProductsResponse[], BestSellingProductsRequest>({
            query: (body) => ({
                url: '/dashboard/best-selling-products',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        lowestSellingProducts: builder.mutation<LowestSellingProductsResponse[], LowestSellingProductsRequest>({
            query: (body) => ({
                url: '/dashboard/lowest-selling-products',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        averageFulfillmentTime: builder.mutation<AverageFulfillmentTimeResponse, AverageFulfillmentTimeRequest>({
            query: (body) => ({
                url: '/dashboard/average-fulfillment-time',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        peakOrderTime: builder.mutation<PeakOrderTimeResponse[], PeakOrderTimeRequest>({
            query: (body) => ({
                url: '/dashboard/peak-order-time',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),

        // REVENUE
        totalRevenue: builder.mutation<TotalRevenueResponse, TotalRevenueRequest>({
            query: (body) => ({
                url: '/dashboard/total-revenue',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        totalProfit: builder.mutation<TotalProfitResponse, TotalProfitRequest>({
            query: (body) => ({
                url: '/dashboard/total-profit',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        averageOrderValue: builder.mutation<AverageOrderValueResponse, AverageOrderValueRequest>({
            query: (body) => ({
                url: '/dashboard/average-order-value',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        revenueByProduct: builder.mutation<RevenueByProductResponse[], RevenueByProductRequest>({
            query: (body) => ({
                url: '/dashboard/revenue-product',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        revenueByCategory: builder.mutation<RevenueByCategoryResponse[], RevenueByCategoryRequest>({
            query: (body) => ({
                url: '/dashboard/revenue-category',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
        revenueTrend: builder.query<RevenueTrendResponse[], void>({
            query: () => ({
                url: '/dashboard/revenue-trend',
                method: 'GET'
            })
        }),
        topPaymentMethod: builder.mutation<TopPaymentMethodResponse[], TopPaymentMethodRequest>({
            query: (body) => ({
                url: '/dashboard/top-payment-method',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Dashboard"]
        }),
    })
})

export const { useTotalOrderMutation, useOrderCanceledMutation, useAverageOrderMutation, 
    useCategoryPerformanceMutation, useOrderTrendQuery, useBestSellingProductsMutation,
    useLowestSellingProductsMutation, useAverageFulfillmentTimeMutation, usePeakOrderTimeMutation,
    // REVENUE
    useTotalRevenueMutation, useTotalProfitMutation, useAverageOrderValueMutation,
    useRevenueByProductMutation, useRevenueByCategoryMutation, useRevenueTrendQuery,
    useTopPaymentMethodMutation
} = apiDashboard;