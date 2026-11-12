import { baseApi } from "../../services/baseApi";

export const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => ({
                url: "/api/stats/dashboard",
            }),
            providesTags: ["Stats"],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = statsApi;