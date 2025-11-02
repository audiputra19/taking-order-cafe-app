import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { CreateVoucherRequest, CreateVoucherResponse } from "../interfaces/voucher";

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
        })
    })
})

export const { useCreateVoucherMutation } = apiVoucher;