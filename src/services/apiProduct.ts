import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { CreateProductRequest, CreateProductResponse, DiscontinueProductResponse, GetProductResponse, UpdateProductRequest, UpdateProductResponse } from "../interfaces/product";

export const apiProduct = createApi({
    reducerPath: 'apiProduct',
    baseQuery,
    tagTypes: ["Product"],
    endpoints: build => ({
        getProduct: build.query<GetProductResponse[], void>({
            query: () => ({
                url: 'get-product',
                method: 'GET'
            }),
            providesTags: ["Product"],
        }),
        getProductDiscontinue: build.query<GetProductResponse[], void>({
            query: () => ({
                url: 'get-product-discontinue',
                method: 'GET'
            }),
            providesTags: ["Product"],
        }),
        createProduct: build.mutation<CreateProductResponse, CreateProductRequest>({
            query: (data) => {
                const formData = new FormData();
                formData.append("nama", data.nama);
                formData.append("hpp", String(data.hpp));
                formData.append("harga", String(data.harga));
                formData.append("kategori", String(data.kategori));
                formData.append("deskripsi", data.deskripsi);
                if(data.file) {
                    formData.append("file", data.file);
                }

                return {
                    url: 'create-product',
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: ["Product"],
        }),
        updateProduct: build.mutation<UpdateProductResponse, {data: UpdateProductRequest}>({
            query: ({ data }) => {
                const formData = new FormData();
                formData.append('nama', data.nama);
                formData.append('hpp', data.hpp.toString());
                formData.append('harga', data.harga.toString());
                formData.append('kategori', data.kategori.toString());
                formData.append('deskripsi', data.deskripsi);
                formData.append('image_title', data.file ? data.file.name : data.image_title || '');
                formData.append('image_path', data.image_path || '');
                if (data.file) formData.append('file', data.file);

                return {
                    url: `update-product/${data.id}`,
                    method: 'PUT',
                    body: formData,
                };
            },
            invalidatesTags: ["Product"],
        }),
        discontinueProduct: build.mutation<DiscontinueProductResponse, string>({
            query: (id) => ({
                url: `dis-product/${id}`,
                method: 'PUT'
            }),
            invalidatesTags: ["Product"],
        }),
        activateProduct: build.mutation<DiscontinueProductResponse, string>({
            query: (id) => ({
                url: `activate-product/${id}`,
                method: 'PUT'
            }),
            invalidatesTags: ["Product"],
        }),
    })
})

export const { 
    useGetProductQuery, useGetProductDiscontinueQuery, useCreateProductMutation, useUpdateProductMutation, 
    useDiscontinueProductMutation, useActivateProductMutation
} = apiProduct;