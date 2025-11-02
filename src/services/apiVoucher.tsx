import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { CreateVoucherRequest, CreateVoucherResponse, DeleteVoucherResponse, GetVoucherResponse, UpdateVoucherRequest, UpdateVoucherResponse } from "../interfaces/voucher";

export const apiVoucher = createApi({
    reducerPath: 'apiVoucher',
    baseQuery,
    tagTypes: ["Voucher"],
    endpoints: builder => ({
        createVoucher: builder.mutation<CreateVoucherResponse, CreateVoucherRequest>({
            query: body => ({
                url: 'voucher/create-voucher',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Voucher"]
        }),
        getVoucher: builder.query<GetVoucherResponse[], void>({
            query: () => ({
                url: 'voucher/get-voucher',
                method: 'POST'
            }),
            providesTags: ["Voucher"]
        }),
        updateVoucher: builder.mutation<UpdateVoucherResponse, {data: UpdateVoucherRequest}>({
            query: ({ data }) => ({
                url: `voucher/update-voucher/${data.id_voucher}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["Voucher"]
        }),
        deleteVoucher: builder.mutation<DeleteVoucherResponse, string>({
            query: (id) => ({
                url: `voucher/delete-voucher/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ["Voucher"]
        }),
    })
})

export const { useCreateVoucherMutation, useGetVoucherQuery, useUpdateVoucherMutation, useDeleteVoucherMutation } = apiVoucher;