
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./api";

export const baseApi = createApi({
    reducerPath: "api",

    baseQuery: axiosBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000"
    }),

    tagTypes: [
        "Auth",
        "Deck",
        "Card",
        "Review",
        "Stats"
    ],

    endpoints: () => ({})
});
