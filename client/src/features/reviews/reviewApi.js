import { baseApi } from "../../services/baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTodayQueue: builder.query({
            query: () => ({
                url: "/api/reviews/today",
            }),
            providesTags: ["Review"],
        }),

        submitReview: builder.mutation({
            query: ({ cardId, rating }) => ({
                url: "/api/reviews",
                method: "POST",
                data: { cardId, rating },
            }),
            invalidatesTags: ["Review", "Stats", "Deck", "Card"],
        }),
    }),
});

export const {
    useGetTodayQueueQuery,
    useSubmitReviewMutation,
} = reviewApi;