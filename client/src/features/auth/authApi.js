
import { baseApi } from "../../services/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: "/api/auth/register",
                method: "POST",
                data: userData
            })
        }),

        login: builder.mutation({
            query: (credentials) => ({
                url: "/api/auth/login",
                method: "POST",
                data: credentials
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/api/auth/logout",
                method: "POST"
            })
        }),

        getMe: builder.query({
            query: () => ({
                url: "/api/auth/me"
            }),
            providesTags: ["Auth"]
        })
    })
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetMeQuery
} = authApi;
