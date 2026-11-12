import { useState } from "react";
import { Plus, Layers3 } from "lucide-react";

import DeckCard from "../components/decks/DeckCard";
import DeckModal from "../components/decks/DeckModal";

import {
    useGetDecksQuery,
    useCreateDeckMutation,
    useUpdateDeckMutation,
    useDeleteDeckMutation,
} from "../features/decks/deckApi";

function Decks() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [pageError, setPageError] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetDecksQuery();

    const [createDeck, { isLoading: isCreating }] = useCreateDeckMutation();
    const [updateDeck, { isLoading: isUpdating }] = useUpdateDeckMutation();
    const [deleteDeck, { isLoading: isDeleting }] = useDeleteDeckMutation();

    const decks = data?.decks || [];

    const openCreateModal = () => {
        setSelectedDeck(null);
        setPageError("");
        setIsModalOpen(true);
    };

    const openEditModal = (deck) => {
        setSelectedDeck(deck);
        setPageError("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDeck(null);
    };

    const handleSubmit = async (deckData) => {
        try {
            if (selectedDeck) {
                await updateDeck({
                    id: selectedDeck._id,
                    ...deckData,
                }).unwrap();
            } else {
                await createDeck(deckData).unwrap();
            }

            closeModal();
            setPageError("");
        } catch (err) {
            throw err;
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this deck and all its flashcards?"
        );

        if (!confirmed) return;

        setPageError("");

        try {
            await deleteDeck(id).unwrap();
        } catch (err) {
            setPageError(
                err?.data?.message || "Unable to delete this deck."
            );
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 text-center text-stone-400">
                Loading your decks...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-emerald-400">
                        YOUR COLLECTIONS
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-white">
                        My Decks
                    </h1>

                    <p className="mt-2 text-sm text-stone-400">
                        Create and organize your flashcard collections.
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-emerald-400"
                >
                    <Plus size={18} />
                    Create deck
                </button>
            </section>

            {(isError || pageError) && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {pageError || error?.data?.message || "Unable to load decks."}
                </p>
            )}

            {!isError && decks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-700 bg-stone-900/30 px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                        <Layers3 size={30} />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        Your learning space is empty
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-400">
                        Create your first deck and start building your personal flashcard library.
                    </p>

                    <button
                        onClick={openCreateModal}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-emerald-400"
                    >
                        <Plus size={18} />
                        Create your first deck
                    </button>
                </div>
            ) : (
                !isError && (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {decks.map((deck) => (
                            <DeckCard
                                key={deck._id}
                                deck={deck}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                isDeleting={isDeleting}
                            />
                        ))}
                    </div>
                )
            )}

            <DeckModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                deck={selectedDeck}
                isSaving={isCreating || isUpdating}
            />
        </div>
    );
}

export default Decks;