import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export interface Wilayah {
    id: string;
    name: string;
}

export const apiWilayah = createApi({
    reducerPath: 'apiWilayah',
    baseQuery,
    endpoints: builder => ({
        getProvinces: builder.query<Wilayah[], void>({
            query: () => "api/wilayah/provinces",
        }),
        getCities: builder.query<Wilayah[], string>({
            query: (provinceId) => `api/wilayah/cities/${provinceId}`,
        }),
        getDistricts: builder.query<Wilayah[], string>({
            query: (cityId) => `api/wilayah/districts/${cityId}`,
        }),
        getVillages: builder.query<Wilayah[], string>({
            query: (districtId) => `api/wilayah/villages/${districtId}`,
        }),
    }) 
});

export const { 
    useGetProvincesQuery,
    useGetCitiesQuery,
    useGetDistrictsQuery,
    useGetVillagesQuery  
} = apiWilayah;