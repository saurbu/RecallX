import { baseApi } from "../../services/baseApi";

export const cardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCards: builder.query({
            query: (deckId) => ({
                url: `/api/cards?deckId=${encodeURIComponent(deckId)}`,
            }),
            providesTags: (result, error, deckId) => [
                { type: "Card", id: deckId },
            ],
        }),

        createCard: builder.mutation({
            query: (cardData) => ({
                url: "/api/cards",
                method: "POST",
                data: cardData,
            }),
            invalidatesTags: ["Card", "Deck", "Stats"],
        }),

        updateCard: builder.mutation({
            query: ({ id, ...cardData }) => ({
                url: `/api/cards/${id}`,
                method: "PUT",
                data: cardData,
            }),
            invalidatesTags: ["Card", "Deck", "Stats"],
        }),

        deleteCard: builder.mutation({
            query: (id) => ({
                url: `/api/cards/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Card", "Deck", "Stats"],
        }),
    }),
});

export const {
    useGetCardsQuery,
    useCreateCardMutation,
    useUpdateCardMutation,
    useDeleteCardMutation,
} = cardApi;