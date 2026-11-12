import { baseApi } from "../../services/baseApi";

export const deckApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDecks: builder.query({
            query: () => ({
                url: "/api/decks",
            }),
            providesTags: ["Deck"],
        }),

        createDeck: builder.mutation({
            query: (deckData) => ({
                url: "/api/decks",
                method: "POST",
                data: deckData,
            }),
            invalidatesTags: ["Deck", "Stats"],
        }),

        updateDeck: builder.mutation({
            query: ({ id, ...deckData }) => ({
                url: `/api/decks/${id}`,
                method: "PUT",
                data: deckData,
            }),
            invalidatesTags: ["Deck"],
        }),

        deleteDeck: builder.mutation({
            query: (id) => ({
                url: `/api/decks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Deck", "Stats"],
        }),
    }),
});

export const {
    useGetDecksQuery,
    useCreateDeckMutation,
    useUpdateDeckMutation,
    useDeleteDeckMutation,
} = deckApi;