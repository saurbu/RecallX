import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Layers3 } from "lucide-react";

import { useGetDecksQuery } from "../features/decks/deckApi";
import {
    useGetCardsQuery,
    useCreateCardMutation,
    useUpdateCardMutation,
    useDeleteCardMutation,
} from "../features/cards/cardApi";

import CardModal from "../components/decks/CardModal";
import FlashcardItem from "../components/decks/FlashcardItem";

function DeckDetails() {
    const { id } = useParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [pageError, setPageError] = useState("");

    const {
        data: decksData,
        isLoading: decksLoading,
    } = useGetDecksQuery();

    const {
        data: cardsData,
        isLoading: cardsLoading,
        isError: cardsError,
    } = useGetCardsQuery(id);

    const [createCard, { isLoading: isCreating }] = useCreateCardMutation();
    const [updateCard, { isLoading: isUpdating }] = useUpdateCardMutation();
    const [deleteCard] = useDeleteCardMutation();

    const deck = decksData?.decks?.find((item) => item._id === id);
    const cards = cardsData?.cards || [];

    const openCreateModal = () => {
        setSelectedCard(null);
        setPageError("");
        setIsModalOpen(true);
    };

    const openEditModal = (card) => {
        setSelectedCard(card);
        setPageError("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleSubmit = async (cardData) => {
        try {
            if (selectedCard) {
                await updateCard({
                    id: selectedCard._id,
                    ...cardData,
                }).unwrap();
            } else {
                await createCard({
                    ...cardData,
                    deckId: id,
                }).unwrap();
            }

            closeModal();
        } catch (err) {
            throw err;
        }
    };

    const handleDelete = async (cardId) => {
        if (!window.confirm("Delete this flashcard permanently?")) return;

        setPageError("");

        try {
            await deleteCard(cardId).unwrap();
        } catch (err) {
            setPageError(err?.data?.message || "Unable to delete flashcard.");
        }
    };

    if (decksLoading || cardsLoading) {
        return (
            <div className="py-20 text-center text-stone-400">
                Loading deck...
            </div>
        );
    }

    if (!deck) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-xl font-semibold text-white">
                    Deck not found
                </h2>
                <Link
                    to="/decks"
                    className="mt-4 inline-block text-emerald-400 hover:text-emerald-300"
                >
                    Back to decks
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Link
                to="/decks"
                className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white"
            >
                <ArrowLeft size={17} />
                Back to decks
            </Link>

            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Layers3 size={17} />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Flashcard collection
                        </span>
                    </div>

                    <h1 className="mt-3 text-3xl font-bold text-white">
                        {deck.title}
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
                        {deck.description || "No description added."}
                    </p>

                    <p className="mt-3 text-sm text-stone-500">
                        {cards.length} flashcards
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-emerald-400"
                >
                    <Plus size={18} />
                    Add flashcard
                </button>
            </section>

            {pageError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {pageError}
                </p>
            )}

            {cardsError ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-400">
                    Unable to load flashcards. Please refresh the page.
                </div>
            ) : cards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-700 bg-stone-900/30 px-6 py-16 text-center">
                    <Layers3 className="mx-auto text-stone-500" size={35} />
                    <h2 className="mt-4 font-semibold text-white">
                        No flashcards in this deck
                    </h2>
                    <p className="mt-2 text-sm text-stone-400">
                        Add your first question and answer to get started.
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-emerald-400"
                    >
                        <Plus size={17} />
                        Add first flashcard
                    </button>
                </div>
            ) : (
                <div className="grid gap-5">
                    {cards.map((card) => (
                        <FlashcardItem
                            key={card._id}
                            card={card}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <CardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                card={selectedCard}
                isSaving={isCreating || isUpdating}
            />
        </div>
    );
}

export default DeckDetails;